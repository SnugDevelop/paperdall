// Pixel-art frames for the local fire and frost head effects.
// Transparent RGBA; generated in code so no external image assets are required.
export const ELEMENT_W = 96;
export const ELEMENT_H = 64;
export const ELEMENT_FRAMES = 12;

const putter = (px) => (x, y, c) => {
  if (x < 0 || y < 0 || x >= ELEMENT_W || y >= ELEMENT_H) return;
  const o = (y * ELEMENT_W + x) * 4;
  px[o] = c[0]; px[o + 1] = c[1]; px[o + 2] = c[2]; px[o + 3] = 255;
};
const ellipse = (x, y, cx, cy, rx, ry) => ((x + .5 - cx) / rx) ** 2 + ((y + .5 - cy) / ry) ** 2 <= 1;

function ring(px, put, colors) {
  const mask = new Uint8Array(ELEMENT_W * ELEMENT_H);
  const cx = 48, cy = 53, outerX = 38, outerY = 8, innerX = 33, innerY = 4.8;
  for (let y = 0; y < ELEMENT_H; y++) for (let x = 0; x < ELEMENT_W; x++) {
    if (ellipse(x, y, cx, cy, outerX, outerY) && !ellipse(x, y, cx, cy, innerX, innerY)) mask[y * ELEMENT_W + x] = 1;
  }
  for (let y = 0; y < ELEMENT_H; y++) for (let x = 0; x < ELEMENT_W; x++) {
    if (mask[y * ELEMENT_W + x]) continue;
    const near = (dx, dy) => x + dx >= 0 && y + dy >= 0 && x + dx < ELEMENT_W && y + dy < ELEMENT_H && mask[(y + dy) * ELEMENT_W + x + dx];
    if (near(1, 0) || near(-1, 0) || near(0, 1) || near(0, -1)) put(x, y, colors.line);
  }
  for (let y = 0; y < ELEMENT_H; y++) for (let x = 0; x < ELEMENT_W; x++) {
    if (!mask[y * ELEMENT_W + x]) continue;
    const v = (y + .5 - (cy - outerY)) / (outerY * 2);
    put(x, y, v < .3 ? colors.light : v < .7 ? colors.mid : colors.dark);
  }
}

/**
 * The fire: teardrop flames that grow out of the ring's own curve - wide at the root, a bright core, a dark red skin, a
 * pointed tip that leans and licks. Each flame breathes on its own beat; the tall ones stand at the back, the short ones in
 * front; embers lift off the tips and cool as they rise. 12 frames, and every beat divides 12 so the loop is seamless.
 */
export function fireHaloFrame(i) {
  const px = new Uint8Array(ELEMENT_W * ELEMENT_H * 4), put = putter(px);
  const C = { line:[91,35,12], hot:[255,248,200], light:[255,226,110], mid:[255,132,35], dark:[195,49,18], deep:[140,30,14] };
  const CX = 48, CY = 53, OX = 38, OY = 8, TAU = Math.PI * 2;
  /** where the ring's top edge is in column x - a flame's root sits just inside it */
  const ringTop = (x) => CY - OY * Math.sqrt(Math.max(0, 1 - ((x - CX) / OX) ** 2));
  // [x, height, half-width at the root, beat offset 0..11, back row?] - the back row is drawn first
  const FLAMES = [
    [26, 27, 5, 2, 1], [43, 36, 6, 7, 1], [58, 31, 6, 4, 1], [72, 25, 5, 10, 1],
    [14, 14, 4, 0, 0], [31, 20, 5, 5, 0], [49, 27, 6, 9, 0], [66, 20, 5, 3, 0], [82, 14, 4, 8, 0],
  ];
  const flame = ([x, H, hw, ph]) => {
    const t = ((i + ph) % 12) / 12;
    const h = Math.max(6, Math.round(H * (1 + 0.13 * Math.sin(TAU * t) + 0.06 * Math.sin(TAU * 2 * t + 1))));
    const sway = 2.4 * Math.sin(TAU * t + ph);
    const lean = ((x - CX) / OX) * 3.2;            // the outer flames lean away from the middle
    const root = Math.round(ringTop(x)) + 3;
    for (let k = 0; k <= h; k++) {
      const v = k / h;
      const w = hw * Math.pow(Math.max(0, 1 - v * v), 0.8);          // wide root, pointed tip
      const c = x + lean * v * v + sway * Math.pow(v, 1.5) + 0.9 * Math.sin(TAU * 2 * t + v * 5) * v;
      const left = Math.round(c - w), right = Math.round(c + w), y = root - k;
      for (let xx = left; xx <= right; xx++) {
        const d = w < 0.6 ? 0 : Math.abs(xx - c) / w;                // 0 at the middle of the flame, 1 at its skin
        const edge = xx === left || xx === right;
        let col;
        if (v > 0.9) col = C.dark;
        else if (edge && v > 0.12) col = v > 0.55 ? C.deep : C.dark;
        else if (d < 0.35 && v < 0.3) col = C.hot;
        else if (d < 0.55 && v < 0.55) col = C.light;
        else if (d < 0.85 && v < 0.8) col = C.mid;
        else col = C.dark;
        put(xx, y, col);
      }
    }
  };
  for (const f of FLAMES) if (f[4]) flame(f);
  for (const f of FLAMES) if (!f[4]) flame(f);
  ring(px, put, C);
  // embers lift off the flames, cooling from yellow to red as they climb; each rises on its own loop of 12
  for (let n = 0; n < 12; n++) {
    const age = (i + n * 5) % 12;
    const x0 = 16 + ((n * 37) % 66);
    const x = x0 + Math.round(Math.sin((age + n) * TAU / 12) * 2);
    const y = Math.round(ringTop(x0)) - 12 - age * 2.4 - (n % 3) * 3;
    const col = age < 4 ? C.light : age < 8 ? C.mid : C.dark;
    put(x, y, col);
    if (age < 6 && n % 2 === 0) put(x, y + 1, C.mid);
  }
  return px;
}

export function snowHaloFrame(i) {
  const px = new Uint8Array(ELEMENT_W * ELEMENT_H * 4), put = putter(px);
  const C = { line:[25,72,125], light:[220,249,255], mid:[93,183,239], dark:[38,111,190] };
  ring(px, put, C);
  // Falling pixel snowflakes, each on its own vertical loop and slightly drifting sideways.
  for (let n = 0; n < 11; n++) {
    const baseX = 7 + ((n * 23) % 82);
    const y = 5 + ((n * 13 + i * (n % 3 + 1) * 2) % 43);
    const x = baseX + Math.round(Math.sin((i + n * 2) * Math.PI / 6) * 2);
    put(x, y, C.light);
    if (n % 3 !== 1) {
      put(x - 1, y, C.mid); put(x + 1, y, C.mid);
      put(x, y - 1, C.mid); put(x, y + 1, C.mid);
    } else {
      put(x - 1, y - 1, C.mid); put(x + 1, y + 1, C.mid);
      put(x + 1, y - 1, C.mid); put(x - 1, y + 1, C.mid);
    }
  }
  // icy glints travelling around the ring
  const a = i / ELEMENT_FRAMES * Math.PI * 2;
  const gx = Math.round(48 + 35 * Math.cos(a)), gy = Math.round(53 + 6 * Math.sin(a));
  put(gx, gy, C.light); put(gx + 1, gy, C.light);
  return px;
}
