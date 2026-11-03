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

export function fireHaloFrame(i) {
  const px = new Uint8Array(ELEMENT_W * ELEMENT_H * 4), put = putter(px);
  const C = { line:[91,35,12], light:[255,235,130], mid:[255,132,35], dark:[195,49,18] };
  // Flickering tongues of flame rise from the ring; the staggered phases keep the motion lively.
  const tongues = [[12,22,0],[22,30,3],[33,19,6],[45,28,1],[56,18,5],[68,27,2],[80,20,7]];
  for (const [x, h, phase] of tongues) {
    const sway = Math.round(Math.sin((i + phase) * Math.PI / 6) * 2);
    const flicker = (i + phase) % 4;
    for (let k = 0; k < h - flicker; k++) {
      const xx = x + sway + (k > 5 ? Math.round(Math.sin(k * .8 + i) * 1.5) : 0);
      const yy = 48 - k;
      put(xx, yy, k % 5 === 0 ? C.light : k % 3 === 0 ? C.dark : C.mid);
      if (k < 5) put(xx + 1, yy, C.light);
    }
    put(x + sway, 48 - h + flicker, C.light);
  }
  ring(px, put, C);
  // tiny embers drifting upward
  for (let n = 0; n < 7; n++) {
    const x = (n * 17 + 9) % 90 + 3;
    const y = 12 + ((n * 11 - i * 3 + 72) % 31);
    put(x, y, n % 2 ? C.light : C.mid);
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
