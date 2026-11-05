// custom/paperdoll/witchCircle.js
//
// THE WITCH'S CIRCLE: a ring of green witchfire throwing green sparkles up and out. A LOCAL extra - drawn on this client
// only, never sent to the account service. Drawn like the pink devil halo (pinkDevilHalo.js): a billboard per frame, its
// frames uploaded once as textures. It is called from pinkDevilHaloDraw, which the world already calls, so the world's own
// draw code needed no new line.

import { CAPSULE_HEIGHT } from '../../src/player/motor.js';
import { witchHaloOn } from './paperdollSetting.js';
import { witchCircleFrame, WITCH_W, WITCH_H, WITCH_FRAMES, WITCH_RING_BOTTOM } from './witchCircleFrames.js';

const TEXTURE_SET = 900006;     // beside the gold, fire, frost (900001, 900003, 900004) and pink devil (900005) halos
const WORLD_W = 0.84;           // the picture's width, metres: the ring itself is about 60 of its 96 pixels
const LIFT = 0.04;              // the gap between the crown of the head and the ring's lowest edge
const FRAME_MS = 95;            // how long each frame stands
const BELOW_RING = (WITCH_H - 1 - WITCH_RING_BOTTOM) * (WORLD_W / WITCH_W);   // the ring, not the picture's edge, sits on the head

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
  const out = new Uint8Array(rgba.length), row = WITCH_W * 4;
  for (let y = 0; y < WITCH_H; y++) out.set(rgba.subarray(y * row, (y + 1) * row), (WITCH_H - 1 - y) * row);
  return out;
}

function build(renderer) {
  const list = [], worldH = (WORLD_W * WITCH_H) / WITCH_W;
  for (let i = 0; i < WITCH_FRAMES; i++) {
    const key = `witch_circle_${i}`;
    const px = bottomFirst(witchCircleFrame(i));
    renderer.uploadTexture(TEXTURE_SET, key, { width: WITCH_W, height: WITCH_H, colors: new Uint32Array(px.buffer) });
    const batch = renderer.createBillboardBatch(TEXTURE_SET, key, { w: WORLD_W, h: worldH }, [[0, 0, 0]]);
    batch.origin = [0, 0, 0];
    list.push({ key, batch });
  }
  return list;
}

/** Draw the circle over the head standing at `feet`, if the player has it on. Never throws. { renderer, feet, camRight, bbUp, height? } */
export function witchCircleDraw({ renderer, feet, camRight, bbUp, height = CAPSULE_HEIGHT }) {
  if (broken) return;
  if (!witchHaloOn()) { if (batches) release(); return; }
  if (!renderer || !feet) return;
  try {
    if (renderer_ !== renderer) { release(); renderer_ = renderer; }
    if (!batches) batches = build(renderer);
    const f = batches[Math.floor(performance.now() / FRAME_MS) % batches.length];
    f.batch.origin[0] = feet[0];
    f.batch.origin[1] = feet[1] + height + LIFT - BELOW_RING;
    f.batch.origin[2] = feet[2];
    renderer.drawBillboards([f.batch], camRight, bbUp);
  } catch (err) {
    broken = true;   // once: do not retry every frame
    console.warn('[paperdoll] the Witch\'s Circle would not draw', err?.message ?? err);
  }
}
