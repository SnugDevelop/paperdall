// custom/hud/playerCard.js
//
// THE CHARACTER CARD ON THE HUD: your paperdoll's head and shoulders, your name with the title you wear above it, and your
// health, magicka and fatigue, in the bottom-left corner. A piece of the HUD like any other (ui/hud/hudLayout.js lists it as
// 'pcard'): press Alt+U to free the mouse and the editor outlines it - drag it where you like, the corner square scales it,
// its X puts it away (and back), double-click or Reset brings it home. Its place is kept by the editor.
//
// Drawn from ONE call, ui/enhanced/enhancedHud.js drawEnhancedHud, with the same three rows the HUD's own bars read, so it can
// never disagree with them. The face is the doll composed WITHOUT its hands (custom/paperdoll/paperdollExtensions.js
// dollEntity), cropped to the head, and recomposed only when what is worn changes.

import { playerEntity } from '../../src/characters/playerEntity.js';
import { composeDollTransparent } from '../../src/ui/paperDoll.js';
import { namePlateNode } from '../../src/ui/namePlate.js';
import { dollEntity, wornSignature } from '../paperdoll/paperdollExtensions.js';
import { alphaBounds } from '../paperdoll/paperdollImage.js';
import { ownIdentity } from '../paperdoll/ownPlate.js';

export const CARD_STYLE_ID = 'hud-player-card-style';
const FACE_PX = 56;

const CSS = `
.hud .hud-pcard { position: absolute; display: none; align-items: stretch; gap: 10px; box-sizing: border-box;
  left: calc(24px + env(safe-area-inset-left, 0px)); bottom: calc(22px + env(safe-area-inset-bottom, 0px));
  width: 300px; padding: 8px 10px; transform: scale(var(--hud-scale, 1)); transform-origin: bottom left;
  background: rgba(10,12,17,0.72); border: 2px solid rgba(125,116,96,0.75); box-shadow: 0 0 0 1px rgba(0,0,0,0.6);
  text-shadow: 2px 2px 0 rgba(0,0,0,0.85); }
.hud .hud-pcard.on { display: flex; }
.hud-pcard-face { flex: 0 0 auto; width: ${FACE_PX}px; height: ${FACE_PX}px; align-self: center; image-rendering: pixelated;
  background: radial-gradient(circle at 50% 40%, #2a2733 0%, #12131a 80%); border: 2px solid rgba(125,116,96,0.75); }
.hud-pcard-body { flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; justify-content: center; gap: 3px; }
.hud-pcard-id { font-size: 15px; line-height: 1.05; min-height: 1.2em; }
.hud-pcard-id .dfname-title { margin: 0; text-align: left; font-size: 0.78em; overflow: hidden; text-overflow: ellipsis; }
.hud-pcard-name { color: #efe8d2; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.hud-pcard-row { display: flex; align-items: center; gap: 6px; font-size: 11px; line-height: 1; color: #cfc6aa; }
.hud-pcard-row b { flex: 0 0 auto; width: 14px; font-weight: normal; letter-spacing: 0; opacity: 0.85; }
.hud-pcard-track { flex: 1 1 auto; height: 8px; background: rgba(0,0,0,0.65); border: 1px solid rgba(0,0,0,0.9); box-sizing: border-box; }
.hud-pcard-track i { display: block; height: 100%; width: 0; }
.hud-pcard-row.health i { background: #d98074; }
.hud-pcard-row.magicka i { background: #6f8fd9; }
.hud-pcard-row.fatigue i { background: #74d9a0; }
.hud-pcard-row span { flex: 0 0 auto; min-width: 64px; text-align: right; }
/* the corner this card stands in is the quick block's: the block stands above it while the card is there */
.hud:has(.hud-pcard.on) .hud-quick { bottom: calc(22px + 32px * var(--hud-scale, 1) + 72px * var(--hud-scale, 1) + env(safe-area-inset-bottom, 0px)); }
.hud:has(.hud-pcard.on):has(.hud-renown.on) .hud-quick { bottom: calc(22px + 64px * var(--hud-scale, 1) + 72px * var(--hud-scale, 1) + env(safe-area-inset-bottom, 0px)); }
`;

let card = null;            // the element
let parts = null;           // its parts
let last = {};              // what each part says now, so a frame changes only what changed
let faceSig = '';           // what the face was drawn for
let faceBusy = false;
let faceRetryAt = 0;
let faceCheckAt = 0;
let broken = false;
let nameStyled = false;

function injectStyle(doc) {
  if (doc.getElementById(CARD_STYLE_ID)) return;
  const st = doc.createElement('style');
  st.id = CARD_STYLE_ID;
  st.textContent = CSS;
  doc.head.append(st);
}

function build(doc) {
  const el = (tag, cls, txt) => { const n = doc.createElement(tag); if (cls) n.className = cls; if (txt != null) n.textContent = txt; return n; };
  const root = el('div', 'hud-pcard');
  root.setAttribute('aria-label', 'Your character');
  const face = el('canvas', 'hud-pcard-face');
  face.width = FACE_PX; face.height = FACE_PX;
  const body = el('div', 'hud-pcard-body');
  const id = el('div', 'hud-pcard-id');
  const name = el('div', 'hud-pcard-name');
  id.append(name);
  body.append(id);
  const bars = {};
  for (const [key, tag] of [['health', 'HP'], ['magicka', 'MP'], ['fatigue', 'FT']]) {
    const row = el('div', `hud-pcard-row ${key}`);
    const track = el('div', 'hud-pcard-track');
    const fill = el('i');
    track.append(fill);
    const val = el('span');
    row.append(el('b', null, tag), track, val);
    body.append(row);
    bars[key] = { fill, val };
  }
  root.append(face, body);
  return { root, face, id, name, bars };
}

/** Paint the title above the name the way the world paints it over a head: the plate's own title element, moved here. */
function setIdentity(doc, who) {
  const key = `${who.title ?? ''}|${who.name}`;
  if (last.id === key) return;
  last.id = key;
  parts.name.textContent = who.name;
  parts.id.querySelector('.dfname-title')?.remove();
  if (who.title) {
    const plate = namePlateNode(doc, { title: who.title, glyphs: [], name: '', lv: null });
    const t = plate.querySelector('.dfname-title');
    if (t && t.textContent) parts.id.insertBefore(t, parts.name);
  }
  if (!nameStyled) {   // the name layer's sheet paints that title; asked for lazily, once
    nameStyled = true;
    import('../../src/ui/nameLayer.js').then((m) => m.injectNameStyle(doc)).catch(() => {});
  }
}

/** The head and shoulders of the doll, cut from its top and drawn on the face. */
function paintFace(rgba, w, h) {
  const r = alphaBounds(rgba, w, h);
  if (!r) return false;
  // the head's middle: where the top tenth of the figure stands, so a weapon's reach to one side does not pull it off
  let sx = 0, n = 0;
  const band = Math.max(2, Math.round(r.h * 0.1));
  for (let y = r.y; y < r.y + band; y++) for (let x = r.x; x < r.x + r.w; x++) if (rgba[(y * w + x) * 4 + 3] !== 0) { sx += x; n++; }
  const cx = n ? sx / n : r.x + r.w / 2;
  const side = Math.max(16, Math.round(r.h * 0.3));
  const src = document.createElement('canvas');
  src.width = w; src.height = h;
  src.getContext('2d').putImageData(new ImageData(new Uint8ClampedArray(rgba), w, h), 0, 0);
  const ctx = parts.face.getContext('2d');
  ctx.imageSmoothingEnabled = false;
  ctx.clearRect(0, 0, FACE_PX, FACE_PX);
  ctx.drawImage(src, Math.round(cx - side / 2), r.y - 2, side, side, 0, 0, FACE_PX, FACE_PX);
  return true;
}

/** The face again when what is worn changed. Polled gently; one composition at a time; a try later when the art is not in yet. */
function tickFace() {
  const now = performance.now();
  if (faceBusy || now < faceCheckAt || now < faceRetryAt || !playerEntity) return;
  faceCheckAt = now + 600;
  let sig = '';
  try { sig = wornSignature(playerEntity); } catch { return; }
  if (sig === faceSig) return;
  faceBusy = true;
  Promise.resolve(composeDollTransparent(dollEntity(playerEntity)))
    .then((px) => { if (px?.rgba && paintFace(px.rgba, px.width, px.height)) faceSig = sig; else faceRetryAt = performance.now() + 2000; })
    .catch(() => { faceRetryAt = performance.now() + 4000; })
    .finally(() => { faceBusy = false; });
}

/**
 * The card for this frame. `host` is the HUD's root (.hud); `rows` the three rows its bars read - [key, part, now, max] with
 * key 'magicka', 'health' or 'fatigue' - so the card shows the same numbers. Never throws.
 */
export function tickPlayerCard(host, rows) {
  if (broken || !host || typeof document === 'undefined') return;
  try {
    if (!card) { injectStyle(document); parts = build(document); card = parts.root; }
    if (card.parentNode !== host) host.append(card);
    const who = ownIdentity();
    const show = !!playerEntity && !!who.name;
    if (show !== last.show) { last.show = show; card.classList.toggle('on', show); }
    if (!show) return;
    setIdentity(document, who);
    for (const [key, , now, max] of rows) {
      const bar = parts.bars[key];
      if (!bar) continue;
      const cur = Math.max(0, Math.round(now)), top = Math.max(1, Math.round(max));
      const pct = Math.max(0, Math.min(100, (now / max) * 100));
      const w = `${pct.toFixed(1)}%`;
      if (last[`${key}W`] !== w) { last[`${key}W`] = w; bar.fill.style.width = w; }
      const v = key === 'fatigue' ? `${Math.round(pct)}%` : `${cur}/${top}`;   // fatigue's raw number is x64: a percent reads true
      if (last[`${key}V`] !== v) { last[`${key}V`] = v; bar.val.textContent = v; }
    }
    tickFace();
  } catch (err) {
    broken = true;   // once: do not retry every frame
    card?.classList.remove('on');
    console.warn('[paperdoll] the character card would not draw', err?.message ?? err);
  }
}
