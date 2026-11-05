// custom/paperdoll/pinkDevilHaloFrames.js
//
// The pink devil halo's pictures, drawn in code: a glossy pink ring with two little devil horns on top, and thick pink
// liquid that beads along the underside of the ring, swells, lets go and falls. PINK_FRAMES pictures that loop. Hard
// pixels with a dark outline, like the gold, flame and frost halos, so it keeps the game's pixel-art look. Pure - no
// imports - so a test (or the profile's preview) can render it.

export const PINK_W = 96;
export const PINK_H = 64;
export const PINK_FRAMES = 12;
/** The row of the ring's lowest pixel, for the draw code: the drips hang below it, so the ring is what sits on the head. */
export const PINK_RING_BOTTOM = 48;

const CX = 48, CY = 40;          // the ring's centre
const OX = 36, OY = 8;           // outer ellipse
const IX = 31.5, IY = 4.8;       // inner ellipse - the ring is what lies between

const LINE = [96, 12, 62];
const RING = { light: [255, 208, 236], mid: [255, 102, 178], dark: [205, 44, 130] };
const HORN = { light: [255, 150, 196], mid: [238, 62, 134], dark: [160, 22, 92] };
const GLOSS = [255, 248, 253];
const DRIP = { light: [255, 196, 228], mid: [255, 96, 170], dark: [214, 52, 138] };

/** [x, phase 0..11]: where the liquid gathers along the ring's underside, each out of step with the others. */
const DRIPS = Object.freeze([[17, 0], [30, 5], [42, 2], [55, 8], [67, 3], [79, 6]]);
/** Sparkles of gloss: [x, y, phase]. */
const GLINTS = Object.freeze([[14, 31, 0], [82, 29, 6], [48, 25, 3]]);

const inEllipse = (x, y, rx, ry) => ((x + 0.5 - CX) / rx) ** 2 + ((y + 0.5 - CY) / ry) ** 2 <= 1;

/** One frame, `i` of PINK_FRAMES: a top-down RGBA Uint8Array, PINK_W x PINK_H. Pure. */
export function pinkHaloFrame(i) {
  const px = new Uint8Array(PINK_W * PINK_H * 4);
  const put = (x, y, c) => {
    if (x < 0 || y < 0 || x >= PINK_W || y >= PINK_H) return;
    const o = (y * PINK_W + x) * 4;
    px[o] = c[0]; px[o + 1] = c[1]; px[o + 2] = c[2]; px[o + 3] = 255;
  };
  /** the body of the halo (ring and horns) as colours, null where nothing is, so the outline can be found */
  const shape = new Array(PINK_W * PINK_H).fill(null);
  const set = (x, y, c) => { if (x >= 0 && y >= 0 && x < PINK_W && y < PINK_H) shape[y * PINK_W + x] = c; };
  const at = (x, y) => (x < 0 || y < 0 || x >= PINK_W || y >= PINK_H ? null : shape[y * PINK_W + x]);

  // the ring: light along the top, mid, dark underneath
  for (let y = 0; y < PINK_H; y++) {
    for (let x = 0; x < PINK_W; x++) {
      if (!inEllipse(x, y, OX, OY) || inEllipse(x, y, IX, IY)) continue;
      const v = (y + 0.5 - (CY - OY)) / (OY * 2);
      set(x, y, v < 0.3 ? RING.light : v < 0.7 ? RING.mid : RING.dark);
    }
  }
  // the gloss: a bright streak along the upper left of the ring, held still
  for (let x = 24; x <= 38; x++) {
    for (let y = 0; y < PINK_H; y++) {
      if (at(x, y) === RING.light) { set(x, y, GLOSS); break; }
    }
  }

  // the two little horns, curving outward from the top of the ring; light on the left edge, dark on the right
  const horn = (baseX, dir) => {
    for (let k = 0; k <= 12; k++) {
      const y = CY - OY + 1 - k;
      const w = Math.max(1, Math.round(6 - k * 0.45));
      const cx = baseX + dir * Math.round((k * k) / 28);
      const x0 = cx - Math.floor(w / 2);
      for (let j = 0; j < w; j++) set(x0 + j, y, j === 0 ? HORN.light : j === w - 1 && w > 1 ? HORN.dark : HORN.mid);
    }
  };
  horn(35, -1);
  horn(61, 1);

  // paint: the outline first (every empty pixel touching the body), then the body
  for (let y = 0; y < PINK_H; y++) {
    for (let x = 0; x < PINK_W; x++) {
      if (at(x, y)) continue;
      if (at(x + 1, y) || at(x - 1, y) || at(x, y + 1) || at(x, y - 1)) put(x, y, LINE);
    }
  }
  for (let y = 0; y < PINK_H; y++) for (let x = 0; x < PINK_W; x++) { const c = at(x, y); if (c) put(x, y, c); }

  // a glint of gloss that runs once round the ring's front edge
  const a = (i / PINK_FRAMES) * Math.PI * 2;
  const gx = Math.round(CX + 34 * Math.cos(a)), gy = Math.round(CY + 6.2 * Math.sin(a));
  if (at(gx, gy)) { put(gx, gy, GLOSS); put(gx + 1, gy, GLOSS); }

  // the liquid: a bead gathers on the underside, stretches into a drip, lets go, and the drop falls
  for (const [x, phase] of DRIPS) {
    let yb = -1;                                   // the lowest ring pixel in this column
    for (let y = PINK_H - 1; y >= 0; y--) if (at(x, y)) { yb = y; break; }
    if (yb < 0) continue;
    const t = ((i + phase) % PINK_FRAMES) / PINK_FRAMES;
    // a thick bead always clings to the ring where the drip leaves it
    put(x, yb + 1, DRIP.mid); put(x + 1, yb + 1, DRIP.dark); put(x - 1, yb, DRIP.mid); put(x + 2, yb, DRIP.mid);
    if (t < 0.65) {
      const len = 1 + Math.round((t / 0.65) * 7);              // 1..8 pixels long
      for (let k = 2; k < len; k++) { put(x, yb + k, DRIP.light); put(x + 1, yb + k, DRIP.mid); }
      if (len >= 3) {                                          // the swelling drop at the end
        const e = yb + len;
        put(x - 1, e, DRIP.mid); put(x, e, DRIP.light); put(x + 1, e, DRIP.mid); put(x + 2, e, DRIP.dark);
        put(x - 1, e + 1, DRIP.mid); put(x, e + 1, DRIP.mid); put(x + 1, e + 1, DRIP.mid); put(x + 2, e + 1, DRIP.dark);
        put(x, e + 2, DRIP.mid); put(x + 1, e + 2, DRIP.dark);
      }
    } else {
      const f = (t - 0.65) / 0.35;                              // 0..1: the drop on its way down
      const y = yb + 10 + Math.round(f * 5);
      put(x, y, DRIP.light); put(x + 1, y, DRIP.mid); put(x, y + 1, DRIP.mid); put(x + 1, y + 1, DRIP.dark);
    }
  }

  // glints of gloss, blinking out of step
  for (const [x, y, phase] of GLINTS) {
    if ((i + phase) % PINK_FRAMES >= 4) continue;
    put(x, y, GLOSS); put(x - 1, y, DRIP.light); put(x + 1, y, DRIP.light); put(x, y - 1, DRIP.light); put(x, y + 1, DRIP.light);
  }
  return px;
}
