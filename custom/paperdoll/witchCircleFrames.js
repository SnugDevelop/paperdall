// custom/paperdoll/witchCircleFrames.js
//
// The Witch's Circle's pictures, drawn in code: a ring of green witchfire with five rune points that pulse in turn, and
// glittering green sparkles that leave the ring and drift up and out, shrinking and cooling as they go. WITCH_FRAMES pictures
// that loop (every sparkle's life divides the loop, so the last frame runs into the first). Hard pixels with a dark outline,
// like the other halos. Pure - no imports.

export const WITCH_W = 96;
export const WITCH_H = 64;
export const WITCH_FRAMES = 12;
/** The row of the ring's lowest pixel, for the draw code: the ring is what sits on the head. */
export const WITCH_RING_BOTTOM = 59;

const CX = 48, CY = 53;          // the ring's centre
const OX = 30, OY = 6.5;         // outer ellipse - narrower than the other halos, so the sparkles have room to leave it
const IX = 25.5, IY = 3.6;       // inner ellipse

const C = {
  line: [10, 56, 30], dark: [28, 132, 62], mid: [72, 204, 94], light: [176, 255, 160],
  white: [238, 255, 228], glow: [120, 245, 130], fade: [40, 150, 70],
};

const inEllipse = (x, y, rx, ry) => ((x + 0.5 - CX) / rx) ** 2 + ((y + 0.5 - CY) / ry) ** 2 <= 1;

/** One frame, `i` of WITCH_FRAMES: a top-down RGBA Uint8Array, WITCH_W x WITCH_H. Pure. */
export function witchCircleFrame(i) {
  const px = new Uint8Array(WITCH_W * WITCH_H * 4);
  const put = (x, y, c) => {
    if (x < 0 || y < 0 || x >= WITCH_W || y >= WITCH_H) return;
    const o = (y * WITCH_W + x) * 4;
    px[o] = c[0]; px[o + 1] = c[1]; px[o + 2] = c[2]; px[o + 3] = 255;
  };
  const mask = new Uint8Array(WITCH_W * WITCH_H);
  for (let y = 0; y < WITCH_H; y++) for (let x = 0; x < WITCH_W; x++) {
    if (inEllipse(x, y, OX, OY) && !inEllipse(x, y, IX, IY)) mask[y * WITCH_W + x] = 1;
  }
  const at = (x, y) => (x < 0 || y < 0 || x >= WITCH_W || y >= WITCH_H ? 0 : mask[y * WITCH_W + x]);

  // the ring: outline, then light along the top, mid, dark underneath
  for (let y = 0; y < WITCH_H; y++) for (let x = 0; x < WITCH_W; x++) {
    if (at(x, y)) continue;
    if (at(x + 1, y) || at(x - 1, y) || at(x, y + 1) || at(x, y - 1)) put(x, y, C.line);
  }
  for (let y = 0; y < WITCH_H; y++) for (let x = 0; x < WITCH_W; x++) {
    if (!at(x, y)) continue;
    const v = (y + 0.5 - (CY - OY)) / (OY * 2);
    put(x, y, v < 0.3 ? C.light : v < 0.7 ? C.mid : C.dark);
  }

  // five rune points round the ring (the points of a star), each lit in turn: a bright mark, else a dark notch
  for (let p = 0; p < 5; p++) {
    const a = -Math.PI / 2 + (p * 2 * Math.PI) / 5;
    const x = Math.round(CX - 0.5 + ((OX + IX) / 2) * Math.cos(a)), y = Math.round(CY - 0.5 + ((OY + IY) / 2) * Math.sin(a));
    const lit = ((i + p * 2) % 12) < 3;
    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
      if (!at(x + dx, y + dy)) continue;
      put(x + dx, y + dy, lit ? (dx === 0 && dy === 0 ? C.white : C.light) : C.dark);
    }
  }

  // the sparkles: each leaves the ring, climbs and drifts outward, and over its life of 12 grows dim and small.
  // Young ones are stars (a few are big ones), middle-aged ones twinkle between a plus and an X, old ones are a point.
  const N = 26;
  for (let n = 0; n < N; n++) {
    const age = (i + n * 5) % 12;
    const th = n * 2.399963;                                   // the golden angle, so they spread evenly with no pattern
    const ox = CX + (OX - 2.5) * Math.cos(th), oy = CY + (OY - 1.5) * Math.sin(th);
    const out = Math.cos(th);                                  // -1 at the ring's left, +1 at its right
    const up = 1.0 + (n % 4) * 0.3;                            // how fast it climbs
    const x = Math.round(ox + (out * 1.05 + (n % 3 - 1) * 0.35) * age * (1 - age * 0.018));
    const y = Math.round(oy - up * age);
    const big = n % 6 === 0;                                   // every sixth is a big star
    const plus = (arm, reach = 1) => { for (let r = 1; r <= reach; r++) { put(x - r, y, arm); put(x + r, y, arm); put(x, y - r, arm); put(x, y + r, arm); } };
    const ex = (arm) => { put(x - 1, y - 1, arm); put(x + 1, y - 1, arm); put(x - 1, y + 1, arm); put(x + 1, y + 1, arm); };
    if (age < 4) {                                             // young: a bright star
      if (big) { plus(C.glow, 2); plus(C.light, 1); } else plus(age < 2 ? C.light : C.glow);
      put(x, y, C.white);
    } else if (age < 8) {                                      // middle: it twinkles between a plus and an X
      if ((age + n) % 2) plus(C.mid); else ex(C.mid);
      put(x, y, C.light);
    } else if (age < 10) put(x, y, C.mid);                     // old: one point
    else put(x, y, C.fade);                                    // almost gone
  }
  return px;
}
