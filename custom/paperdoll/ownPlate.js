// custom/paperdoll/ownPlate.js
//
// YOUR OWN NAME AND CHOSEN TITLE, over your own head in third person - the plate the game draws over every OTHER player
// (ui/nameLayer.js) and never over you. A LOCAL extra: built on this client from what this device already knows (the
// stored session's name and chosen title, the character's name), drawn in the name layer's own look, sent nowhere. Two
// switches, both off until asked for: your name (with its glyphs), and your chosen title (the "Over the head" slot).
//
// Called from ONE place: player/eyeOfTheBeholder/eotbBody.js draw(), on foot, which hands it the frame's camera. The
// head point is projected the way the name layer projects another player's (player/tapRay.js projectToScreen), and the
// plate is a DOM element in a `.dfnames` layer of its own - fixed, under the HUD - moved each frame, rebuilt only when
// what it says changes. It stands above the halo and the gold title, whichever of them are on.

import { namePlateNode } from '../../src/ui/namePlate.js';
import { projectToScreen } from '../../src/player/tapRay.js';
import { storedSession, SESSION_KEY } from '../../src/net/accountClient.js';
import { appStorage } from '../../src/systems/appStorage.js';
import { ownGlyphs } from '../../src/systems/ownGlyphs.js';
import { playerEntity } from '../../src/characters/playerEntity.js';
import { CAPSULE_HEIGHT } from '../../src/player/motor.js';
import { ownNameOn, chosenTitleOn, titleOn, headEffectOn, ownPlateSizeMode, characterNameOn, titleScalePercent } from './paperdollSetting.js';

const LIFT = 0.04;          // metres over the crown of the head
const HALO_SPACE = 0.36;    // the golden halo's height and gap (goldHalo.js) - the plate stands over it
const TITLE_SPACE = 0.26;   // the gold title's height and gap (dressUpTitle.js)
const GAP_PX = 4;           // pixels between the plate's foot and the point it hangs from
const LARGE_SCALE = 2.4;    // visual-only transform; does not alter nameplate layout or font metrics
const GONE_MS = 300;        // the plate is put away when no frame has moved it for this long (a menu, first person)

let host = null;            // the .dfnames layer
let node = null;            // the plate
let nodeKey = '';
let lastAt = 0;
let timer = null;
let broken = false;
let rawSeen;                // the stored session's raw string last parsed
let session = null;

/** The stored session, parsed again only when its raw string changed (ownGlyphs.js reads it the same way). */
function sessionNow() {
  let raw = null;
  try { raw = appStorage()?.getItem?.(SESSION_KEY) ?? null; } catch { raw = null; }
  if (raw !== rawSeen) {
    rawSeen = raw;
    try { session = storedSession(appStorage()); } catch { session = null; }
  }
  return session;
}

/** The title this player has chosen, as the service last stated it on the stored session - or null. */
const chosenTitleKey = (s) => {
  const t = s?.title ?? s?.wardrobe?.title ?? null;
  return typeof t === 'string' && t ? t : null;
};

function ensureHost() {
  if (host?.isConnected) return host;
  host = document.createElement('div');
  host.className = 'dfnames';           // the name layer's own sheet styles it: fixed, over the viewport, under the HUD
  host.setAttribute('aria-hidden', 'true');
  host.style.display = 'none';
  document.body.append(host);
  // the sheet that styles a plate (the world's name layer injects it online); asked for lazily, so nothing of it is read
  // at load, and once only
  import('../../src/ui/nameLayer.js').then((m) => m.injectNameStyle(document)).catch(() => {});
  return host;
}

function hide() {
  if (host) host.style.display = 'none';
}

function stamp() {
  lastAt = performance.now();
  if (!timer) timer = setInterval(() => { if (performance.now() - lastAt > GONE_MS) hide(); }, 150);
}

/** The plate for what is asked for now: a title line, a name line with its glyphs, or both. */
function buildNode(title, name, glyphs) {
  const n = namePlateNode(document, { title, glyphs, name, lv: null });
  if (!title) n.querySelector('.dfname-title')?.remove();
  if (!name) n.querySelector('.dfname-tag')?.remove();
  return n;
}

/**
 * Hang the plate over the head standing at `feet`, if either switch is on. Never throws.
 *   { canvas, proj, view, feet, height? }  - the frame's camera and the feet the body is drawn at
 */
export function ownPlateDraw({ canvas, proj, view, feet, height = CAPSULE_HEIGHT }) {
  if (broken) return;
  const wantName = ownNameOn(), wantTitle = chosenTitleOn();
  if (!wantName && !wantTitle) { hide(); return; }
  if (!canvas?.getBoundingClientRect || !proj || !view || !feet || typeof document === 'undefined') return;
  try {
    const s = sessionNow();
    const title = wantTitle ? chosenTitleKey(s) : null;
    const useCharacterName = characterNameOn();
    const characterName = typeof playerEntity?.name === 'string' ? playerEntity.name : '';
    const accountName = typeof s?.name === 'string' ? s.name : '';
    const name = wantName ? (useCharacterName ? characterName : (accountName || characterName)) : '';
    const glyphs = wantName && !useCharacterName ? ownGlyphs() : [];
    if (!title && !name) { hide(); return; }
    const root = ensureHost();
    const key = `${title ?? ''}|${name}|${glyphs.join(',')}`;
    if (key !== nodeKey || !node?.isConnected) {
      nodeKey = key;
      root.textContent = '';
      node = buildNode(title, name, glyphs);
      root.append(node);
    }
    const titleNode = node.querySelector('.dfname-title');
    if (titleNode) {
      titleNode.style.transformOrigin = 'bottom center';
      titleNode.style.transform = `scale(${titleScalePercent() / 100})`;
    }
    const up = height + LIFT + (headEffectOn() ? HALO_SPACE : 0) + (titleOn() ? TITLE_SPACE : 0);
    const rect = canvas.getBoundingClientRect();
    const p = projectToScreen([feet[0], feet[1] + up, feet[2]], rect.width, rect.height, proj, view, null, false);
    if (!p?.front) { hide(); return; }
    const scale = ownPlateSizeMode() === 'large' ? LARGE_SCALE : 1;
    node.style.transformOrigin = 'bottom center';
    node.style.transform = `translate(${Math.round(rect.left + p.x)}px, ${Math.round(rect.top + p.y - GAP_PX)}px) translate(-50%, -100%) scale(${scale})`;
    root.style.display = '';
    stamp();
  } catch (err) {
    broken = true;   // once: do not retry every frame
    hide();
    console.warn('[paperdoll] your own plate would not draw', err?.message ?? err);
  }
}

/**
 * WHO THE PLAYER IS, as the plate would say it, whatever the plate's own two switches: { title, name, glyphs } - the chosen
 * title's key (or null), the name by the character-name setting, and the glyphs shown beside an account name. The HUD's
 * character card (custom/hud/playerCard.js) reads it, so it says what the plate over the head says. Never throws.
 */
export function ownIdentity() {
  try {
    const s = sessionNow();
    const useCharacterName = characterNameOn();
    const characterName = typeof playerEntity?.name === 'string' ? playerEntity.name : '';
    const accountName = typeof s?.name === 'string' ? s.name : '';
    return {
      title: chosenTitleKey(s),
      name: useCharacterName ? characterName : (accountName || characterName),
      glyphs: useCharacterName ? [] : ownGlyphs(),
    };
  } catch { return { title: null, name: '', glyphs: [] }; }
}

/** For the console: what this device's session carries (key names only - never the values, which hold the token). */
globalThis.__paperdollPlate = () => ({
  sessionKeys: Object.keys(sessionNow() ?? {}),
  chosenTitle: chosenTitleKey(sessionNow()),
  name: sessionNow()?.name ?? playerEntity?.name ?? null,
  wantName: ownNameOn(), wantTitle: chosenTitleOn(), characterName: characterNameOn(), broken,
});
