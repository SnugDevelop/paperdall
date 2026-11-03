// custom/paperdoll/paperdollSetting.js
//
// The Paperdoll look's on/off switch, kept apart from paperdollExtensions.js so the Skin card (ui/skinCard.js)
// can import it without pulling in the compose stack. Stored through appStorage - the one storage seam, as
// systems/modSettings.js does - and read every frame from memory.

import { appStorage } from '../../src/systems/appStorage.js';

const STORAGE_KEY = 'custom.paperdoll.enabled';
/** What a player who never touched the switch gets: true draws the paperdoll in third person, false the sprite. */
const DEFAULT_ON = true;

let cache = null;

export function isEnabled() {
  if (cache === null) {
    let v = null;
    try { v = appStorage()?.getItem(STORAGE_KEY); } catch { /* no storage */ }
    cache = v == null ? DEFAULT_ON : v !== '0';
  }
  return cache;
}

export function setEnabled(on) {
  cache = !!on;
  try { appStorage()?.setItem(STORAGE_KEY, cache ? '1' : '0'); } catch { /* no storage */ }
  return cache;
}

// ---- the animated back sprite: with it on, the doll is the FRONT only; seen from behind, the sprite draws ----
const BACK_KEY = 'custom.paperdoll.backSprite';
/** What a player who never touched it gets: false keeps the doll from every side, true shows the sprite from behind. */
const BACK_DEFAULT_ON = false;

let backCache = null;

export function backSpriteOn() {
  if (backCache === null) {
    let v = null;
    try { v = appStorage()?.getItem(BACK_KEY); } catch { /* no storage */ }
    backCache = v == null ? BACK_DEFAULT_ON : v !== '0';
  }
  return backCache;
}

export function setBackSprite(on) {
  backCache = !!on;
  try { appStorage()?.setItem(BACK_KEY, backCache ? '1' : '0'); } catch { /* no storage */ }
  return backCache;
}

// ---- the golden halo (custom/paperdoll/goldHalo.js): a local extra over your own head, on by default ----
const HALO_KEY = 'custom.paperdoll.goldHalo';
const HALO_DEFAULT_ON = true;

let haloCache = null;

export function haloOn() {
  if (haloCache === null) {
    let v = null;
    try { v = appStorage()?.getItem(HALO_KEY); } catch { /* no storage */ }
    haloCache = v == null ? HALO_DEFAULT_ON : v !== '0';
  }
  return haloCache;
}

export function setHalo(on) {
  haloCache = !!on;
  try { appStorage()?.setItem(HALO_KEY, haloCache ? '1' : '0'); } catch { /* no storage */ }
  return haloCache;
}

// ---- the title "My Dress Up Darling" (custom/paperdoll/dressUpTitle.js, customTitle.js): over your head and on your profile ----
const TITLE_KEY = 'custom.paperdoll.dressUpTitle';
const TITLE_DEFAULT_ON = true;

let titleCache = null;

export function titleOn() {
  if (titleCache === null) {
    let v = null;
    try { v = appStorage()?.getItem(TITLE_KEY); } catch { /* no storage */ }
    titleCache = v == null ? TITLE_DEFAULT_ON : v !== '0';
  }
  return titleCache;
}

export function setTitle(on) {
  titleCache = !!on;
  try { appStorage()?.setItem(TITLE_KEY, titleCache ? '1' : '0'); } catch { /* no storage */ }
  return titleCache;
}

// ---- your own plate over your head (custom/paperdoll/ownPlate.js): your name, and your chosen title - both off until asked ----
const OWN_NAME_KEY = 'custom.paperdoll.ownName';
const CHOSEN_TITLE_KEY = 'custom.paperdoll.chosenTitle';

let ownNameCache = null;
let chosenTitleCache = null;

export function ownNameOn() {
  if (ownNameCache === null) {
    let v = null;
    try { v = appStorage()?.getItem(OWN_NAME_KEY); } catch { /* no storage */ }
    ownNameCache = v === '1';
  }
  return ownNameCache;
}

export function setOwnName(on) {
  ownNameCache = !!on;
  try { appStorage()?.setItem(OWN_NAME_KEY, ownNameCache ? '1' : '0'); } catch { /* no storage */ }
  return ownNameCache;
}

export function chosenTitleOn() {
  if (chosenTitleCache === null) {
    let v = null;
    try { v = appStorage()?.getItem(CHOSEN_TITLE_KEY); } catch { /* no storage */ }
    chosenTitleCache = v === '1';
  }
  return chosenTitleCache;
}

export function setChosenTitle(on) {
  chosenTitleCache = !!on;
  try { appStorage()?.setItem(CHOSEN_TITLE_KEY, chosenTitleCache ? '1' : '0'); } catch { /* no storage */ }
  return chosenTitleCache;
}
