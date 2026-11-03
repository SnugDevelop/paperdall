// custom/paperdoll/goldGlow.js
//
// A pixel-art GLOW for the halo's and the title's frames: gold dither laid round the shapes, thick near them and thinning
// to nothing, breathing a little from frame to frame. It is built from whole opaque pixels (an ordered dither, as the
// game's own auras are cut - render/auraPixel.js), so it shows the same whether a billboard is alpha-tested or blended.
// Pure - no imports.

const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
const NEAR = [255, 214, 92];
const FAR = [150, 92, 12];

/**
 * Lay the glow UNDER what is already in `px` (a top-down RGBA picture `w` x `h`): every clear pixel within `radius` of a
 * drawn one may take a gold pixel, the likelier the nearer. `pulse` 0..1 is how strongly it breathes this frame.
 * @param {Uint8Array} px
 */
export function addGlow(px, w, h, { radius = 5, pulse = 1, strength = 0.9 } = {}) {
  const drawn = (x, y) => x >= 0 && y >= 0 && x < w && y < h && px[(y * w + x) * 4 + 3] > 0;
  const out = [];
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (drawn(x, y)) continue;
      let best = Infinity;
      for (let dy = -radius; dy <= radius; dy++) {
        for (let dx = -radius; dx <= radius; dx++) {
          const d2 = dx * dx + dy * dy;
          if (d2 >= best || d2 > radius * radius || !drawn(x + dx, y + dy)) continue;
          best = d2;
        }
      }
      if (best === Infinity) continue;
      const d = Math.sqrt(best);
      const cover = Math.max(0, 1 - (d - 0.5) / (radius + 0.5)) * strength * pulse;
      if (cover <= 0 || BAYER[(y & 3) * 4 + (x & 3)] / 16 >= cover) continue;
      const k = Math.min(1, d / radius);
      out.push(x, y, Math.round(NEAR[0] + (FAR[0] - NEAR[0]) * k), Math.round(NEAR[1] + (FAR[1] - NEAR[1]) * k), Math.round(NEAR[2] + (FAR[2] - NEAR[2]) * k));
    }
  }
  for (let i = 0; i < out.length; i += 5) {
    const o = (out[i + 1] * w + out[i]) * 4;
    px[o] = out[i + 2]; px[o + 1] = out[i + 3]; px[o + 2] = out[i + 4]; px[o + 3] = 255;
  }
}

/** The breathing: 0.7 .. 1 over one loop of `frames`. */
export const pulseAt = (i, frames) => 0.85 + 0.15 * Math.sin((i / frames) * Math.PI * 2);
