// custom/paperdoll/pinkDevilHalo.js
//
// THE PINK DEVIL HALO: a glossy pink ring with two little devil horns, dripping thick pink liquid. A LOCAL extra - drawn
// on this client only, never sent to the account service, and it touches none of the wardrobe's titles, auras or store
// items. Drawn like the gold, flame and frost halos (goldHalo.js, elementalHalo.js): a billboard per frame, its frames
// uploaded once as textures. Called from the same place: player/eyeOfTheBeholder/eotbBody.js draw(), on foot.

import { CAPSULE_HEIGHT } from '../../src/player/motor.js';
import { uploadBillboardTexture, applySceneLight } from './sceneLight.js';   // the scene-lighting setting
import { pinkHaloOn } from './paperdollSetting.js';
import { witchCircleDraw } from './witchCircle.js';   // drawn from the same call, so the world's draw code stays as it was
import { pinkHaloFrame, PINK_W, PINK_H, PINK_FRAMES, PINK_RING_BOTTOM } from './pinkDevilHaloFrames.js';

const TEXTURE_SET = 900005;     // beside the gold (900001), fire (900003) and frost (900004) halos
const WORLD_W = 0.66;           // the halo's width, metres
const LIFT = 0.04;              // the gap between the crown of the head and the ring's lowest edge
const FRAME_MS = 95;            // how long each frame stands
// the ring, not the picture's bottom edge, is what sits on the head: the drips hang below it, over the hair
const BELOW_RING = (PINK_H - 1 - PINK_RING_BOTTOM) * (WORLD_W / PINK_W);

let renderer_ = null;
let batches = null;
let broken = false;

function release() {
  if (renderer_ && batches) {
    for (const b of batches) {
      renderer_.destroyBillboardBatch?.(b.batch);
      renderer_.releaseTexture?.(TEXTURE_SET, b.key);
    }
  }
  batches = null;
}

function bottomFirst(rgba) {
  const out = new Uint8Array(rgba.length), row = PINK_W * 4;
  for (let y = 0; y < PINK_H; y++) out.set(rgba.subarray(y * row, (y + 1) * row), (PINK_H - 1 - y) * row);
  return out;
}

function build(renderer) {
  const list = [], worldH = (WORLD_W * PINK_H) / PINK_W;
  for (let i = 0; i < PINK_FRAMES; i++) {
    const key = `pink_halo_${i}`;
    const px = bottomFirst(pinkHaloFrame(i));
    uploadBillboardTexture(renderer, TEXTURE_SET, key, { width: PINK_W, height: PINK_H, colors: new Uint32Array(px.buffer) });
    const batch = renderer.createBillboardBatch(TEXTURE_SET, key, { w: WORLD_W, h: worldH }, [[0, 0, 0]]);
    batch.origin = [0, 0, 0];
    list.push({ key, batch });
  }
  return list;
}

/** Draw the halo over the head standing at `feet`, if the player has it on. Never throws. { renderer, feet, camRight, bbUp, height? } */
export function pinkDevilHaloDraw({ renderer, feet, camRight, bbUp, height = CAPSULE_HEIGHT }) {
  witchCircleDraw({ renderer, feet, camRight, bbUp, height });   // the Witch's Circle's turn (it draws only while it is on)
  if (broken) return;
  if (!pinkHaloOn()) { if (batches) release(); return; }
  if (!renderer || !feet) return;
  try {
    if (renderer_ !== renderer) { release(); renderer_ = renderer; }
    if (!batches) batches = build(renderer);
    const f = batches[Math.floor(performance.now() / FRAME_MS) % batches.length];
    f.batch.origin[0] = feet[0];
    f.batch.origin[1] = feet[1] + height + LIFT - BELOW_RING;
    f.batch.origin[2] = feet[2];
    applySceneLight(f.batch);
    renderer.drawBillboards([f.batch], camRight, bbUp);
  } catch (err) {
    broken = true;   // once: do not retry every frame
    console.warn('[paperdoll] the pink devil halo would not draw', err?.message ?? err);
  }
}
