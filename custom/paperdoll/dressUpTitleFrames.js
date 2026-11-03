// custom/paperdoll/dressUpTitleFrames.js
//
// "My Dress Up Darling" as pixels: a small hand-drawn pixel font, gold in three bands with a dark outline, a glint that
// sweeps across it and four-point sparkles that swell and fade, in a breathing dithered gold glow (goldGlow.js) -
// TITLE_FRAMES pictures that loop. Drawn in code with no fonts and no canvas, so it looks the same everywhere and a test
// can render it. Pure.

import { addGlow, pulseAt } from './goldGlow.js';

export const TITLE_STRING = 'My Dress-Up Darling';
export const TITLE_FRAMES = 8;
const S = 2;                        // texture pixels per font pixel
const GW = 120, GH = 20;            // the picture in font pixels
export const TITLE_W = GW * S;
export const TITLE_H = GH * S;

const HI = [255, 244, 168], MID = [247, 200, 64], LO = [201, 140, 22], LINE = [92, 58, 8], WHITE = [255, 255, 238];

// Glyphs: `top` the first row used (0 is the top of a capital, 2 the top of a lowercase letter, the baseline is row 6, a
// descender runs to row 8); `rows` what is drawn from there down. '#' is ink.
const G = (top, rows) => ({ top, rows, w: rows[0].length });
const GLYPHS = Object.freeze({
  M: G(0, ['#...#', '##.##', '#.#.#', '#.#.#', '#...#', '#...#', '#...#']),
  y: G(2, ['#...#', '#...#', '#...#', '.####', '....#', '....#', '.###.']),
  D: G(0, ['####.', '#...#', '#...#', '#...#', '#...#', '#...#', '####.']),
  r: G(2, ['#.##.', '##..#', '#....', '#....', '#....']),
  e: G(2, ['.###.', '#...#', '#####', '#....', '.####']),
  s: G(2, ['.####', '#....', '.###.', '....#', '####.']),
  U: G(0, ['#...#', '#...#', '#...#', '#...#', '#...#', '#...#', '.###.']),
  p: G(2, ['####.', '#...#', '#...#', '#...#', '####.', '#....', '#....']),
  a: G(2, ['.###.', '....#', '.####', '#...#', '.####']),
  l: G(0, ['##.', '.#.', '.#.', '.#.', '.#.', '.#.', '###']),
  i: G(0, ['.#.', '...', '##.', '.#.', '.#.', '.#.', '###']),
  n: G(2, ['#.##.', '##..#', '#...#', '#...#', '#...#']),
  g: G(2, ['.####', '#...#', '#...#', '.####', '....#', '....#', '.###.']),
  '-': G(4, ['#####']),
});
const SPACE = 3, GAP = 1;

/** Where each lit font pixel lies: a Set of `y * GW + x`, and the text's width in font pixels. */
function layout() {
  let w = 0;
  for (const c of TITLE_STRING) w += (c === ' ' ? SPACE : GLYPHS[c].w) + GAP;
  w -= GAP;
  const lit = new Set();
  let x = Math.floor((GW - w) / 2);
  const y0 = 6;
  for (const c of TITLE_STRING) {
    if (c === ' ') { x += SPACE + GAP; continue; }
    const g = GLYPHS[c];
    g.rows.forEach((row, r) => { for (let k = 0; k < row.length; k++) if (row[k] === '#') lit.add((y0 + g.top + r) * GW + x + k); });
    x += g.w + GAP;
  }
  return { lit, x0: Math.floor((GW - w) / 2), w };
}
const LAYOUT = layout();

/** Sparkles: [x, y, phase 0..1] in font pixels - over the letters' tops, at the ends, and under the tails. */
const STARS = Object.freeze([[10, 8, 0.0], [34, 3, 0.35], [58, 2, 0.7], [84, 4, 0.15], [108, 9, 0.5], [96, 17, 0.8], [22, 16, 0.25]]);

/** One frame, `i` of TITLE_FRAMES: a top-down RGBA Uint8Array, TITLE_W x TITLE_H. Pure. */
export function titleFrame(i) {
  const px = new Uint8Array(TITLE_W * TITLE_H * 4);
  const put = (x, y, c) => {                    // one font pixel, S x S texture pixels
    if (x < 0 || y < 0 || x >= GW || y >= GH) return;
    for (let dy = 0; dy < S; dy++) for (let dx = 0; dx < S; dx++) {
      const o = ((y * S + dy) * TITLE_W + x * S + dx) * 4;
      px[o] = c[0]; px[o + 1] = c[1]; px[o + 2] = c[2]; px[o + 3] = 255;
    }
  };
  const on = (x, y) => x >= 0 && y >= 0 && x < GW && y < GH && LAYOUT.lit.has(y * GW + x);
  // the outline: every font pixel touching a letter, diagonals too
  for (let y = 0; y < GH; y++) for (let x = 0; x < GW; x++) {
    if (on(x, y)) continue;
    let near = false;
    for (let dy = -1; dy <= 1 && !near; dy++) for (let dx = -1; dx <= 1; dx++) if ((dx || dy) && on(x + dx, y + dy)) { near = true; break; }
    if (near) put(x, y, LINE);
  }
  // the letters, in three bands of gold; a glint sweeps across on a slant, once a loop
  const sweep = -10 + (i / TITLE_FRAMES) * (GW + 20);
  for (const key of LAYOUT.lit) {
    const x = key % GW, y = Math.floor(key / GW);
    const band = y - 6;                                    // 0 the capitals' top row
    let c = band <= 2 ? HI : band <= 5 ? MID : LO;
    if (Math.abs(x + (y - 6) * 0.8 - sweep) <= 1.5) c = WHITE;
    put(x, y, c);
  }
  // the sparkles
  for (const [sx, sy, ph] of STARS) {
    const t = (i / TITLE_FRAMES + ph) % 1;
    const v = 1 - Math.abs(2 * t - 1);
    const arm = v < 0.25 ? 0 : v < 0.55 ? 1 : v < 0.85 ? 2 : 3;
    if (!arm) continue;
    put(sx, sy, WHITE);
    for (let k = 1; k <= arm; k++) { const c = k === arm && arm > 1 ? MID : HI; put(sx + k, sy, c); put(sx - k, sy, c); put(sx, sy + k, c); put(sx, sy - k, c); }
  }
  addGlow(px, TITLE_W, TITLE_H, { radius: 5, pulse: pulseAt(i, TITLE_FRAMES) });   // the glow, under everything drawn
  return px;
}
