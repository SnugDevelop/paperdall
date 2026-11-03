// Local animated fire and frost halos. Only one head effect is active at a time.
import { CAPSULE_HEIGHT } from '../../src/player/motor.js';
import { fireHaloOn, snowHaloOn } from './paperdollSetting.js';
import { ELEMENT_W, ELEMENT_H, ELEMENT_FRAMES, fireHaloFrame, snowHaloFrame } from './elementalHaloFrames.js';

const SET_FIRE = 900003;
const SET_SNOW = 900004;
const WORLD_W = 0.70;
const LIFT = 0.04;
const FRAME_MS = 95;
let renderer_ = null;
let fire = null;
let snow = null;
let broken = false;

function dispose(renderer, list, set) {
  if (!renderer || !list) return;
  for (const f of list) {
    renderer.destroyBillboardBatch?.(f.batch);
    renderer.releaseTexture?.(set, f.key);
  }
}
function bottomFirst(rgba) {
  const out = new Uint8Array(rgba.length), row = ELEMENT_W * 4;
  for (let y = 0; y < ELEMENT_H; y++) out.set(rgba.subarray(y * row, (y + 1) * row), (ELEMENT_H - 1 - y) * row);
  return out;
}
function build(renderer, set, prefix, frameFn) {
  const list = [], worldH = WORLD_W * ELEMENT_H / ELEMENT_W;
  for (let i = 0; i < ELEMENT_FRAMES; i++) {
    const key = `${prefix}_${i}`;
    const px = bottomFirst(frameFn(i));
    renderer.uploadTexture(set, key, { width: ELEMENT_W, height: ELEMENT_H, colors: new Uint32Array(px.buffer) });
    const batch = renderer.createBillboardBatch(set, key, { w: WORLD_W, h: worldH }, [[0, 0, 0]]);
    batch.origin = [0, 0, 0];
    list.push({ key, batch });
  }
  return list;
}

export function elementalHaloDraw({ renderer, feet, camRight, bbUp, height = CAPSULE_HEIGHT }) {
  if (broken) return;
  const kind = fireHaloOn() ? 'fire' : snowHaloOn() ? 'snow' : null;
  if (!kind) {
    if (fire || snow) {
      dispose(renderer_ || renderer, fire, SET_FIRE);
      dispose(renderer_ || renderer, snow, SET_SNOW);
      fire = snow = null;
    }
    return;
  }
  if (!renderer || !feet) return;
  try {
    if (renderer_ !== renderer) {
      dispose(renderer_, fire, SET_FIRE); dispose(renderer_, snow, SET_SNOW);
      fire = snow = null; renderer_ = renderer;
    }
    if (kind === 'fire') {
      if (!fire) fire = build(renderer, SET_FIRE, 'fire_halo', fireHaloFrame);
      const f = fire[Math.floor(performance.now() / FRAME_MS) % fire.length];
      f.batch.origin[0] = feet[0]; f.batch.origin[1] = feet[1] + height + LIFT; f.batch.origin[2] = feet[2];
      renderer.drawBillboards([f.batch], camRight, bbUp);
    } else {
      if (!snow) snow = build(renderer, SET_SNOW, 'snow_halo', snowHaloFrame);
      const f = snow[Math.floor(performance.now() / FRAME_MS) % snow.length];
      f.batch.origin[0] = feet[0]; f.batch.origin[1] = feet[1] + height + LIFT; f.batch.origin[2] = feet[2];
      renderer.drawBillboards([f.batch], camRight, bbUp);
    }
  } catch (err) {
    broken = true;
    console.warn('[paperdoll] elemental halo would not draw', err?.message ?? err);
  }
}
