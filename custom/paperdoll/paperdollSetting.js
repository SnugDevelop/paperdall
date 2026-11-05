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
  if (haloCache) { fireHaloCache = false; snowHaloCache = false; pinkHaloCache = false; witchHaloCache = false; }
  try {
    appStorage()?.setItem(HALO_KEY, haloCache ? '1' : '0');
    if (haloCache) {
      appStorage()?.setItem(FIRE_HALO_KEY, '0');
      appStorage()?.setItem(SNOW_HALO_KEY, '0');
      appStorage()?.setItem(PINK_HALO_KEY, '0');
      appStorage()?.setItem(WITCH_HALO_KEY, '0');
    }
  } catch { /* no storage */ }
  return haloCache;
}

// ---- alternative local head effects: animated flames or falling snow ----
const FIRE_HALO_KEY = 'custom.paperdoll.fireHalo';
const SNOW_HALO_KEY = 'custom.paperdoll.snowHalo';
const PINK_HALO_KEY = 'custom.paperdoll.pinkHalo';
const WITCH_HALO_KEY = 'custom.paperdoll.witchHalo';
let fireHaloCache = null;
let snowHaloCache = null;
let pinkHaloCache = null;
let witchHaloCache = null;

export function fireHaloOn() {
  if (fireHaloCache === null) {
    let v = null;
    try { v = appStorage()?.getItem(FIRE_HALO_KEY); } catch { /* no storage */ }
    fireHaloCache = v === '1';
  }
  return fireHaloCache;
}

export function snowHaloOn() {
  if (snowHaloCache === null) {
    let v = null;
    try { v = appStorage()?.getItem(SNOW_HALO_KEY); } catch { /* no storage */ }
    snowHaloCache = v === '1';
  }
  return snowHaloCache;
}

export function setFireHalo(on) {
  fireHaloCache = !!on;
  if (fireHaloCache) { haloCache = false; snowHaloCache = false; pinkHaloCache = false; witchHaloCache = false; }
  try {
    appStorage()?.setItem(FIRE_HALO_KEY, fireHaloCache ? '1' : '0');
    if (fireHaloCache) {
      appStorage()?.setItem(HALO_KEY, '0');
      appStorage()?.setItem(SNOW_HALO_KEY, '0');
      appStorage()?.setItem(PINK_HALO_KEY, '0');
      appStorage()?.setItem(WITCH_HALO_KEY, '0');
    }
  } catch { /* no storage */ }
  return fireHaloCache;
}

export function setSnowHalo(on) {
  snowHaloCache = !!on;
  if (snowHaloCache) { haloCache = false; fireHaloCache = false; pinkHaloCache = false; witchHaloCache = false; }
  try {
    appStorage()?.setItem(SNOW_HALO_KEY, snowHaloCache ? '1' : '0');
    if (snowHaloCache) {
      appStorage()?.setItem(HALO_KEY, '0');
      appStorage()?.setItem(FIRE_HALO_KEY, '0');
      appStorage()?.setItem(PINK_HALO_KEY, '0');
      appStorage()?.setItem(WITCH_HALO_KEY, '0');
    }
  } catch { /* no storage */ }
  return snowHaloCache;
}

// ---- the pink devil halo (custom/paperdoll/pinkDevilHalo.js): a glossy pink ring with two little horns, dripping liquid ----
export function pinkHaloOn() {
  if (pinkHaloCache === null) {
    let v = null;
    try { v = appStorage()?.getItem(PINK_HALO_KEY); } catch { /* no storage */ }
    pinkHaloCache = v === '1';
  }
  return pinkHaloCache;
}

export function setPinkHalo(on) {
  pinkHaloCache = !!on;
  if (pinkHaloCache) { haloCache = false; fireHaloCache = false; snowHaloCache = false; witchHaloCache = false; }
  try {
    appStorage()?.setItem(PINK_HALO_KEY, pinkHaloCache ? '1' : '0');
    if (pinkHaloCache) {
      appStorage()?.setItem(HALO_KEY, '0');
      appStorage()?.setItem(FIRE_HALO_KEY, '0');
      appStorage()?.setItem(SNOW_HALO_KEY, '0');
      appStorage()?.setItem(WITCH_HALO_KEY, '0');
    }
  } catch { /* no storage */ }
  return pinkHaloCache;
}

// ---- the Witch's Circle (custom/paperdoll/witchCircle.js): a green ring that throws glittering green sparkles up and out ----
export function witchHaloOn() {
  if (witchHaloCache === null) {
    let v = null;
    try { v = appStorage()?.getItem(WITCH_HALO_KEY); } catch { /* no storage */ }
    witchHaloCache = v === '1';
  }
  return witchHaloCache;
}

export function setWitchHalo(on) {
  witchHaloCache = !!on;
  if (witchHaloCache) { haloCache = false; fireHaloCache = false; snowHaloCache = false; pinkHaloCache = false; }
  try {
    appStorage()?.setItem(WITCH_HALO_KEY, witchHaloCache ? '1' : '0');
    if (witchHaloCache) {
      appStorage()?.setItem(HALO_KEY, '0');
      appStorage()?.setItem(FIRE_HALO_KEY, '0');
      appStorage()?.setItem(SNOW_HALO_KEY, '0');
      appStorage()?.setItem(PINK_HALO_KEY, '0');
    }
  } catch { /* no storage */ }
  return witchHaloCache;
}

/** Any of the mutually exclusive halo-style head effects is active. */
export function headEffectOn() { return haloOn() || fireHaloOn() || snowHaloOn() || pinkHaloOn() || witchHaloOn(); }

/** Which local head effect is on - 'gold', 'fire', 'snow', 'pink' or 'witch' - or null for none. */
export function localHaloId() {
  return haloOn() ? 'gold' : fireHaloOn() ? 'fire' : snowHaloOn() ? 'snow' : pinkHaloOn() ? 'pink' : witchHaloOn() ? 'witch' : null;
}

/** Turn exactly one local head effect on (or all off with null). The others go off with it. */
export function setLocalHalo(id) {
  setHalo(id === 'gold');
  setFireHalo(id === 'fire');
  setSnowHalo(id === 'snow');
  setPinkHalo(id === 'pink');
  setWitchHalo(id === 'witch');
  return localHaloId();
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


// ---- scale for local overhead titles: both the custom gold title and the selected wardrobe title ----
const TITLE_SCALE_KEY = 'custom.paperdoll.titleScale';
const TITLE_SCALE_DEFAULT = 100;
let titleScaleCache = null;

/** Percentage scale for overhead title text/billboards (50-200%, default 100%). */
export function titleScalePercent() {
  if (titleScaleCache === null) {
    let v = null;
    try { v = Number(appStorage()?.getItem(TITLE_SCALE_KEY)); } catch { /* no storage */ }
    titleScaleCache = Number.isFinite(v) && v >= 50 && v <= 200 ? Math.round(v / 5) * 5 : TITLE_SCALE_DEFAULT;
  }
  return titleScaleCache;
}

export function setTitleScalePercent(value) {
  const n = Number(value);
  titleScaleCache = Number.isFinite(n) ? Math.max(50, Math.min(200, Math.round(n / 5) * 5)) : TITLE_SCALE_DEFAULT;
  try { appStorage()?.setItem(TITLE_SCALE_KEY, String(titleScaleCache)); } catch { /* no storage */ }
  return titleScaleCache;
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


// ---- the local overhead name/title size: dynamic camera scaling, or a consistently enlarged plate ----
const OWN_PLATE_SIZE_KEY = 'custom.paperdoll.ownPlateSize';
const OWN_PLATE_SIZE_DEFAULT = 'dynamic';
let ownPlateSizeCache = null;

/** 'dynamic' follows the game's normal nameplate scale; 'large' applies a fixed visual enlargement. */
export function ownPlateSizeMode() {
  if (ownPlateSizeCache === null) {
    let v = null;
    try { v = appStorage()?.getItem(OWN_PLATE_SIZE_KEY); } catch { /* no storage */ }
    ownPlateSizeCache = v === 'large' ? 'large' : OWN_PLATE_SIZE_DEFAULT;
  }
  return ownPlateSizeCache;
}

export function setOwnPlateSizeMode(mode) {
  ownPlateSizeCache = mode === 'large' ? 'large' : 'dynamic';
  try { appStorage()?.setItem(OWN_PLATE_SIZE_KEY, ownPlateSizeCache); } catch { /* no storage */ }
  return ownPlateSizeCache;
}


// ---- which local identity appears on the owner's overhead nameplate ----
const CHARACTER_NAME_KEY = 'custom.paperdoll.characterName';
let characterNameCache = null;

/** False keeps the account name; true uses the active character's in-world name. */
export function characterNameOn() {
  if (characterNameCache === null) {
    let v = null;
    try { v = appStorage()?.getItem(CHARACTER_NAME_KEY); } catch { /* no storage */ }
    characterNameCache = v === '1';
  }
  return characterNameCache;
}

export function setCharacterName(on) {
  characterNameCache = !!on;
  try { appStorage()?.setItem(CHARACTER_NAME_KEY, characterNameCache ? '1' : '0'); } catch { /* no storage */ }
  return characterNameCache;
}
