// custom/paperdoll/localCosmetics.js
//
// THE CLIENT'S OWN COSMETICS AND TITLES on the signed-in profile: the golden, flaming, frost and pink devil halos, and
// the title My Dress Up Darling. All LOCAL extras - only you see them, the account service knows nothing of them, and none
// needs a purchase or an unlock. This module is their one list, and the profile's two ways of choosing among them:
//   * localPanel(): the Cosmetics and Titles tabs the two buttons at the top of the profile open (ui/enhanced/enhancedAccount.js)
//   * pillNode() / activeLocalHalo(): the same halos as choices in the Head slot's picker (ui/characterSlots.js)
// Its pills wear the look of the slot pickers: a dashed edge in the thing's own colour, a solid glowing one when worn.

import { localHaloId, setLocalHalo, titleOn, setTitle, sceneLightOn, setSceneLight } from './paperdollSetting.js';
import { haloFrame, HALO_W, HALO_H, HALO_FRAMES } from './goldHaloFrames.js';
import { fireHaloFrame, snowHaloFrame, ELEMENT_W, ELEMENT_H, ELEMENT_FRAMES } from './elementalHaloFrames.js';
import { pinkHaloFrame, PINK_W, PINK_H, PINK_FRAMES } from './pinkDevilHaloFrames.js';
import { witchCircleFrame, WITCH_W, WITCH_H, WITCH_FRAMES } from './witchCircleFrames.js';

export const COSMETIC_NOTE = 'Custom-client bonus cosmetic: included locally for Paperdall users: no purchase or account unlock required.';
export const TITLE_NOTE = 'Custom-client bonus title: included locally for Paperdall users: no purchase or account unlock required.';
const HINT = 'Point at a choice to see it. Press it to wear it.';

/** The local head effects, in the order they are offered. `frames` draws the preview; `id` is paperdollSetting.js's localHaloId. */
export const LOCAL_HALOS = Object.freeze([
  Object.freeze({ id: 'gold', name: 'Golden Halo', color: '#f7c840',
    look: 'A ring of gold pixels floats above the head, a bright glint running round it and sparkles that swell and fade.',
    frames: { w: HALO_W, h: HALO_H, count: HALO_FRAMES, ms: 110, frame: haloFrame }, place: { w: 0.62, below: 0 } }),
  Object.freeze({ id: 'fire', name: 'Flaming Halo', color: '#ff8a2a',
    look: 'A ring of fire floats above the head, tongues of flame rising from it and embers drifting up.',
    frames: { w: ELEMENT_W, h: ELEMENT_H, count: ELEMENT_FRAMES, ms: 95, frame: fireHaloFrame }, place: { w: 0.70, below: 0 } }),
  Object.freeze({ id: 'snow', name: 'Frost Halo', color: '#5db7ef',
    look: 'A ring of ice floats above the head, snowflakes falling through it and icy glints circling its rim.',
    frames: { w: ELEMENT_W, h: ELEMENT_H, count: ELEMENT_FRAMES, ms: 95, frame: snowHaloFrame }, place: { w: 0.70, below: 0 } }),
  Object.freeze({ id: 'pink', name: 'Pink Devil Halo', color: '#ff6fb5',
    look: 'A glossy pink halo floats above the head, crowned with two little devil horns. Thick pink liquid beads and drips from the ring.',
    frames: { w: PINK_W, h: PINK_H, count: PINK_FRAMES, ms: 95, frame: pinkHaloFrame }, place: { w: 0.66, below: ((PINK_H - 1 - 48) * 0.66) / PINK_W } }),
  Object.freeze({ id: 'witch', name: 'Witch\'s Circle', color: '#5be07a',
    look: 'A ring of green witchfire floats above the head, its runes pulsing in turn, throwing glittering green sparkles up and out.',
    frames: { w: WITCH_W, h: WITCH_H, count: WITCH_FRAMES, ms: 95, frame: witchCircleFrame }, place: { w: 0.84, below: ((WITCH_H - 1 - 59) * 0.84) / WITCH_W } }),
]);

/** The local titles. One so far. */
export const LOCAL_TITLES = Object.freeze([
  Object.freeze({ id: 'dressup', name: 'My Dress Up Darling', color: '#f7c840',
    look: 'A shimmering gold title with twinkling stars, shown above your name over your head and on your profile.' }),
]);

/** The local halo worn now, or null. */
export const activeLocalHalo = () => LOCAL_HALOS.find((h) => h.id === localHaloId()) ?? null;
/** What the picker says under its choices for a local item: its look, and that it is the client's own. */
export const localLook = (item, note = COSMETIC_NOTE) => (item ? `${item.look} ${note}` : HINT);

// ---- the look: pills in the slot pickers' manner, the corner buttons, the preview ----
export const LOCAL_STYLE_ID = 'paperdoll-local-style';
const CSS = `
.card .acctplate { position: relative; }
.card .pd-corners { position: absolute; top: 0; left: 0; right: 0; display: flex; justify-content: space-between; pointer-events: none; z-index: 1; }
.card .pd-corners button { pointer-events: auto; }
.card button.pd-corner { font-size: 12px; letter-spacing: 0.14em; text-transform: uppercase; padding: 7px 14px; }
.card button.pd-corner[aria-pressed="true"] { border-color: var(--brass); box-shadow: inset 0 0 0 1px var(--brass); color: var(--brass); }
@media (max-width: 520px) { .card .pd-corners { position: static; width: 100%; } }
.card button.acttitle.pd-pill { color: var(--pd, #ccc); border: 1px dashed var(--pd, #ccc); opacity: 0.8; }
.card button.acttitle.pd-pill:hover:not(:disabled) { opacity: 1; background: color-mix(in srgb, var(--pd, #ccc) 10%, transparent); }
.card button.acttitle.pd-pill.worn { opacity: 1; border: 2px solid var(--pd, #ccc); padding: 5px 11px;
  background: color-mix(in srgb, var(--pd, #ccc) 16%, transparent); box-shadow: 0 0 10px color-mix(in srgb, var(--pd, #ccc) 40%, transparent); }
.card .pd-panel { margin: 0 0 4px; }
.card .pd-preview { display: block; width: 192px; height: 128px; margin: 6px auto 2px; image-rendering: pixelated;
  border: 2px solid var(--iron); background: radial-gradient(circle at 50% 60%, #1b1826 0%, #08070c 80%); }
.card .pd-preview.empty { visibility: hidden; }
.card .pd-look { margin: 4px 0 0; min-height: 2.6em; }
.card .pd-lightrow { margin-top: 10px; }
.card .pd-stagehalo { position: absolute; inset: 0; overflow: hidden; pointer-events: none; }
.card .pd-stagehalo canvas { position: absolute; left: 0; top: 0; transform-origin: 0 0; image-rendering: pixelated; }
.card .pd-lightnote { margin: 4px 0 0; }
`;

export function injectLocalStyle(doc = document) {
  if (!doc?.head || doc.getElementById(LOCAL_STYLE_ID)) return;
  const st = doc.createElement('style');
  st.id = LOCAL_STYLE_ID;
  st.textContent = CSS;
  doc.head.append(st);
}

const node = (doc, tag, cls = null, txt = null) => {
  const n = doc.createElement(tag);
  if (cls) n.className = cls;
  if (txt != null) n.textContent = txt;
  return n;
};

/** One local choice as a pill, `on` for the one worn. The caller wires its events. */
export function pillNode(doc, item, on) {
  injectLocalStyle(doc);
  const b = node(doc, 'button', `acttitle pd-pill${on ? ' worn' : ''}`);
  b.type = 'button';
  b.style.setProperty('--pd', item.color);
  b.append(node(doc, 'span', 'acttitleword', item.name));
  b.setAttribute?.('aria-pressed', on ? 'true' : 'false');
  b.title = on ? 'Worn. Press to take it off.' : `Wear ${item.name}`;
  return b;
}

/** The two buttons at the top corners of the profile: Cosmetics at the left, Titles at the right. `view` is the tab open. */
export function cornerButtons(doc, view, onPick, keyedAs = (n) => n) {
  injectLocalStyle(doc);
  const wrap = node(doc, 'div', 'pd-corners');
  for (const [id, label] of [['cosmetics', 'Cosmetics'], ['titles', 'Titles']]) {
    const b = keyedAs(node(doc, 'button', 'act pd-corner', label), `pd:${id}`);
    b.type = 'button';
    b.setAttribute?.('aria-pressed', view === id ? 'true' : 'false');
    b.onclick = () => onPick(view === id ? null : id);
    wrap.append(b);
  }
  return wrap;
}

/**
 * The tab a corner button opened: its choices as pills, what is pointed at (else what is worn) shown under them, and for
 * the cosmetics a small animated preview of it. `kind` is 'cosmetics' or 'titles'; `repaint` asks the card to draw again.
 */
export function localPanel(doc, kind, { keyedAs = (n) => n, repaint = () => {} } = {}) {
  injectLocalStyle(doc);
  const titles = kind === 'titles';
  const items = titles ? LOCAL_TITLES : LOCAL_HALOS;
  const note = titles ? TITLE_NOTE : COSMETIC_NOTE;
  const worn = () => (titles ? (titleOn() ? LOCAL_TITLES[0] : null) : activeLocalHalo());
  const wear = (item) => {
    if (titles) setTitle(!item ? false : !(titleOn()));
    else setLocalHalo(!item || worn()?.id === item.id ? null : item.id);
    repaint();
  };

  const sec = node(doc, 'section', 'acctsec pd-panel');
  sec.append(node(doc, 'h4', 'acctsechead', titles ? 'Titles' : 'Cosmetics'));
  const box = node(doc, 'div', 'acctwear slots-picker');
  const head = node(doc, 'div', 'slots-pickhead');
  head.append(node(doc, 'span', 'slots-pickname', titles ? 'Over the head' : 'Head'));
  box.append(head);

  let canvas = null;
  let shown = worn();
  const look = node(doc, 'p', 'meta pd-look', localLook(shown, note));
  const point = (item) => { shown = item; look.textContent = localLook(item, note); };

  const row = node(doc, 'div', 'acctwearrow');
  const none = keyedAs(node(doc, 'button', `acttitle actnone${worn() ? '' : ' worn'}`), `pd:${kind}:none`);
  none.type = 'button';
  none.append(node(doc, 'span', 'acttitleword', 'None'));
  none.setAttribute?.('aria-pressed', worn() ? 'false' : 'true');
  none.onclick = () => wear(null);
  row.append(none);
  for (const item of items) {
    const b = keyedAs(pillNode(doc, item, worn()?.id === item.id), `pd:${kind}:${item.id}`);
    b.onclick = () => wear(item);
    b.onpointerenter = () => point(item);
    b.onfocus = () => point(item);
    b.onpointerleave = () => point(worn());
    b.onblur = () => point(worn());
    row.append(b);
  }
  box.append(row);

  if (!titles) {
    canvas = node(doc, 'canvas', 'pd-preview');
    canvas.width = 96;
    canvas.height = 64;
    box.append(canvas);
    runPreview(canvas, () => shown?.frames ?? null);
  }
  box.append(look);
  box.append(...sceneLightRow(doc, keyedAs, repaint));
  sec.append(box);
  return sec;
}

/**
 * THE SCENE-LIGHTING SWITCH, under both tabs (it covers every halo and the title): ON, the world's light and shadow darken them
 * as they do anything standing there; OFF, they shine at full brightness, like the official title and aura. Seen in the
 * world, not in these previews. Returns the row and its note.
 */
function sceneLightRow(doc, keyedAs, repaint) {
  const on = sceneLightOn();
  const row = node(doc, 'div', 'acctwearrow pd-lightrow');
  const b = keyedAs(node(doc, 'button', `acttitle pd-pill${on ? ' worn' : ''}`), 'pd:sceneLight');
  b.type = 'button';
  b.style.setProperty('--pd', '#9fc7ff');
  b.append(node(doc, 'span', 'acttitleword', `Scene lighting: ${on ? 'On' : 'Off'}`));
  b.setAttribute?.('aria-pressed', on ? 'true' : 'false');
  b.title = on ? 'Press to make your halos and title shine at full brightness.' : 'Press to let the world\'s light and shadow darken your halos and title.';
  b.onclick = () => { setSceneLight(!on); repaint(); };
  row.append(b);
  const note = node(doc, 'p', 'meta pd-lightnote', on
    ? 'On: the world\'s light and shadow darken your halos and title, like anything else standing there. You see this in the world, not in these previews.'
    : 'Off: your halos and title shine at full brightness in the world, whatever the light, like the official title and aura.');
  return [row, note];
}

/** Plays `frames()` (a LOCAL_HALOS `frames`, or null) on `canvas` until the canvas leaves the page. */
function runPreview(canvas, frames) {
  const ctx = canvas.getContext?.('2d');
  const raf = globalThis.requestAnimationFrame;
  if (!ctx || !raf || typeof globalThis.ImageData !== 'function') return;
  const made = new Map();       // `${id}:${i}` -> ImageData, drawn once each
  let ticks = 0;
  const tick = () => {
    if (!canvas.isConnected && ++ticks > 3) return;     // the card was drawn again: this preview is gone
    const f = frames();
    canvas.classList.toggle('empty', !f);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (f) {
      const i = Math.floor(performance.now() / f.ms) % f.count;
      const key = `${f.w}x${f.h}:${f.frame.name}:${i}`;
      let img = made.get(key);
      if (!img) { img = new globalThis.ImageData(new Uint8ClampedArray(f.frame(i)), f.w, f.h); made.set(key, img); }
      ctx.putImageData(img, 0, canvas.height - f.h);
    }
    raf(tick);
  };
  raf(tick);
}

// ---- THE HALO ON THE PROFILE'S PREVIEW STAGE ----
/** The halo's height as the world stands its name plate over it (ownPlate.js HALO_SPACE), metres: the preview's plate rises as far. */
export const HALO_PLATE_RISE = 0.36;
const HALO_LIFT = 0.04;    // the gap between the crown and the ring's lowest edge, as in the world

/**
 * The worn halo drawn over the preview stage's head - above the body, whichever body (sprite, doll or Morrowind) the stage
 * shows - at the size and height the world draws it. `host` goes over the stage's canvas; `place(at, metrePx)` runs each frame
 * with the stage's head point (CSS px) and its pixels to the metre, and hides the halo when none is worn or the stage has
 * no head point yet. Frames are made once each.
 */
export function stageHalo(doc) {
  injectLocalStyle(doc);
  const host = node(doc, 'div', 'pd-stagehalo');
  host.setAttribute?.('aria-hidden', 'true');
  const canvas = node(doc, 'canvas');
  host.append(canvas);
  const ctx = canvas.getContext?.('2d') ?? null;
  const made = new Map();
  let wxh = '';
  return {
    host,
    place(at, metrePx) {
      const h = activeLocalHalo();
      if (!h?.place || !at || !(metrePx > 0) || !ctx || typeof globalThis.ImageData !== 'function') { canvas.style.display = 'none'; return; }
      const f = h.frames;
      if (wxh !== `${f.w}x${f.h}`) { wxh = `${f.w}x${f.h}`; canvas.width = f.w; canvas.height = f.h; }
      const i = Math.floor(performance.now() / f.ms) % f.count;
      const key = `${h.id}:${i}`;
      let img = made.get(key);
      if (!img) { img = new globalThis.ImageData(new Uint8ClampedArray(f.frame(i)), f.w, f.h); made.set(key, img); }
      ctx.clearRect(0, 0, f.w, f.h);
      ctx.putImageData(img, 0, 0);
      const wpx = h.place.w * metrePx, hpx = (wpx * f.h) / f.w;
      const bottom = at.y + (h.place.below - HALO_LIFT) * metrePx;      // the picture's lower edge, as the world hangs it
      canvas.style.display = '';
      canvas.style.width = `${wpx}px`;
      canvas.style.height = `${hpx}px`;
      canvas.style.transform = `translate(${Math.round(at.x - wpx / 2)}px, ${Math.round(bottom - hpx)}px)`;
    },
  };
}
