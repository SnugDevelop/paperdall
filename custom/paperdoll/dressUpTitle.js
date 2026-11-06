// custom/paperdoll/dressUpTitle.js
//
// "MY DRESS UP DARLING", the client's own gold title, floating over the player's head in third person - above the halo
// when the halo is on. A LOCAL extra: drawn on this client only, never sent to the account service, and it touches none
// of the wardrobe's titles or store items. Called from ONE place: player/eyeOfTheBeholder/eotbBody.js draw(), on foot.
// Drawn as a billboard from frames made in code (dressUpTitleFrames.js), the way the golden halo is.

import { CAPSULE_HEIGHT } from '../../src/player/motor.js';
import { uploadBillboardTexture, applySceneLight } from './sceneLight.js';   // the scene-lighting setting
import { titleOn, headEffectOn, titleScalePercent } from './paperdollSetting.js';
import { titleFrame, TITLE_W, TITLE_H, TITLE_FRAMES } from './dressUpTitleFrames.js';

const TEXTURE_SET = 900002;     // beside the paperdoll's 900000 and the halo's 900001
const WORLD_W = 1.2;            // the title's base width, metres
const LIFT = 0.04;              // the gap over the head
const HALO_SPACE = 0.36;        // the golden halo's height (goldHalo.js) and its gap - the title stands over it
const FRAME_MS = 110;

let renderer_ = null;
let frames = null;              // { key, batch } per frame
let broken = false;
let builtScale = null;

function release() {
  if (renderer_ && frames) {
    for (const f of frames) { renderer_.destroyBillboardBatch?.(f.batch); renderer_.releaseTexture?.(TEXTURE_SET, f.key); }
  }
  frames = null;
  builtScale = null;
}

function bottomFirst(rgba) {
  const out = new Uint8Array(rgba.length);
  const row = TITLE_W * 4;
  for (let y = 0; y < TITLE_H; y++) out.set(rgba.subarray(y * row, (y + 1) * row), (TITLE_H - 1 - y) * row);
  return out;
}

function build(renderer) {
  const list = [];
  const worldW = WORLD_W * (titleScalePercent() / 100);
  const worldH = (worldW * TITLE_H) / TITLE_W;
  for (let i = 0; i < TITLE_FRAMES; i++) {
    const key = `dressup_title_${i}`;
    const px = bottomFirst(titleFrame(i));
    uploadBillboardTexture(renderer, TEXTURE_SET, key, { width: TITLE_W, height: TITLE_H, colors: new Uint32Array(px.buffer) });
    const batch = renderer.createBillboardBatch(TEXTURE_SET, key, { w: worldW, h: worldH }, [[0, 0, 0]]);
    batch.origin = [0, 0, 0];
    list.push({ key, batch });
  }
  builtScale = titleScalePercent();
  return list;
}

/**
 * Draw the title over the head standing at `feet`, if the player has it on. Never throws.
 *   { renderer, feet, camRight, bbUp, height? }
 */
export function dressUpTitleDraw({ renderer, feet, camRight, bbUp, height = CAPSULE_HEIGHT }) {
  if (broken) return;
  if (!titleOn()) { if (frames) release(); return; }
  if (!renderer || !feet) return;
  try {
    if (renderer_ !== renderer) { release(); renderer_ = renderer; }
    const scale = titleScalePercent();
    if (!frames || builtScale !== scale) { release(); frames = build(renderer); }
    const f = frames[Math.floor(performance.now() / FRAME_MS) % frames.length];
    f.batch.origin[0] = feet[0];
    f.batch.origin[1] = feet[1] + height + LIFT + (headEffectOn() ? HALO_SPACE : 0);
    f.batch.origin[2] = feet[2];
    applySceneLight(f.batch);
    renderer.drawBillboards([f.batch], camRight, bbUp);
  } catch (err) {
    broken = true;   // once: do not retry every frame
    console.warn('[paperdoll] the title would not draw', err?.message ?? err);
  }
}
