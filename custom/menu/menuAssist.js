// custom/menu/menuAssist.js
//
// QUALITY-OF-LIFE FOR THE PAUSE WINDOW (ui/enhanced/enhancedMenu.js): the pieces that make its tabs and rails easier to find
// your way round, kept in one place so the window itself only calls them.
//   * GROUPS     thin rules between the kinds of page on a rail (Stats: you / status / activities; System: game / options /
//                help / leave) - railBreak()
//   * TIPS       a plain line for every tab and page, as its hover text and its screen-reader description - tabTip(), railTip()
//   * DOTS       a small lit square on a tab or page that has something waiting - dotNode()
//   * KEYS       Q and E step to the previous and next tab, 1 to 9 open the rail's pages - pauseHotkeys(), and the key
//                caps that say so - keycapNode()
//   * LOOK       the stylesheet for the above, a brighter grey for the dim text and a clear ring on the key's focus
// Nothing here draws a page, renames a tab or touches a setting.

import { t } from '../../src/systems/textManager.js';

export const ASSIST_STYLE_ID = 'menu-assist-style';

const CSS = `
/* a thin rule between the kinds of page on a rail */
.px-qrail .px-assist-rule { height: 0; margin: 5px 8px; border-top: 2px solid rgba(125,116,96,0.4); }
/* something waiting: a small lit square pip (the tabs' own markers are diamonds), at a tab's top right or a rail row's right */
.px-assist-dot { display: inline-block; width: 8px; height: 8px; flex: 0 0 auto; background: rgb(243,239,44);
  box-shadow: 0 0 0 2px rgba(0,0,0,0.85), 0 0 8px 1px rgba(243,239,44,0.55); }
.px-tabs button { position: relative; }
.px-tabs button .px-assist-dot { position: absolute; top: 8px; right: 0; }
.px-qrow .px-assist-dot { margin-left: auto; margin-right: 8px; }
/* the keys that move between tabs, at the strip's two ends (they take no room from the tabs) */
.px-tabs { position: relative; }
.px-assist-key { position: absolute; top: 50%; transform: translateY(-50%); min-width: 22px; height: 22px; padding: 0 5px;
  box-sizing: border-box; display: inline-flex; align-items: center; justify-content: center;
  font-size: 13px; letter-spacing: 0; color: #cfc6aa; border: 2px solid rgba(125,116,96,0.7);
  background: rgba(10,12,17,0.6); text-shadow: 1px 1px 0 rgba(0,0,0,0.8); pointer-events: none; }
.px-assist-key.prev { left: 8px; }
.px-assist-key.next { right: 8px; }
@media (max-width: 900px) { .px-assist-key { display: none; } }
/* the dim grey of the small print, a step brighter (it was #9c937d) */
.px-statshead span, .px-stat .k, .px-note, .px-qarch, .px-mtop .k, .px-skilltick, .px-master-lead { color: #b8af98; }
/* the key's place, always visible: a clear ring round whatever has the focus, not only a change of colour */
.px-win button:focus-visible, .px-win [tabindex]:focus-visible, .px-win a:focus-visible {
  outline: 2px solid rgb(243,239,44); outline-offset: 2px; }
/* the Master Skills card on the Skills page */
.px-assist-master { display: flex; align-items: center; gap: 14px; margin: 0 0 14px; padding: 10px 14px;
  border-left: 2px solid var(--brass); text-shadow: 2px 2px 0 rgba(0,0,0,0.8); }
.px-assist-master .px-assist-blurb { flex: 1 1 auto; color: #b8af98; font-size: 15px; line-height: 1.4; }
.px-assist-master button { flex: 0 0 auto; }
`;

export function injectAssistStyle(doc = document) {
  if (!doc?.head || doc.getElementById(ASSIST_STYLE_ID)) return;
  const st = doc.createElement('style');
  st.id = ASSIST_STYLE_ID;
  st.textContent = CSS;
  doc.head.append(st);
}

// ---- GROUPS: which pages belong together on a rail ----
/** The Stats rail: about you, how you stand, what you do. A page not listed (another module's) joins the last group. */
export const STATS_GROUPS = Object.freeze([
  Object.freeze(['character', 'attributes', 'skills', 'specials']),
  Object.freeze(['standing', 'effects']),
  Object.freeze(['professions', 'crafting', 'vendor']),
]);
/** The System rail: the game, its options, help, and the way out. */
export const SYSTEM_GROUPS = Object.freeze([
  Object.freeze(['resume', 'save', 'load']),
  Object.freeze(['settings', 'overhauls', 'screenshots']),
  Object.freeze(['tutorials', 'about']),
  Object.freeze(['exit']),
]);

const groupOf = (groups, id) => { const i = groups.findIndex((g) => g.includes(id)); return i < 0 ? groups.length : i; };

/** A rule to put before the row `id`, when the row before it (`prevId`, null for the first) is in another group - else null. */
export function railBreak(doc, groups, prevId, id) {
  if (prevId == null || groupOf(groups, prevId) === groupOf(groups, id)) return null;
  const rule = doc.createElement('div');
  rule.className = 'px-assist-rule';
  rule.setAttribute?.('role', 'separator');
  return rule;
}

// ---- TIPS: one plain line for each tab and page ----
export const TAB_TIPS = Object.freeze({
  quests: () => t('tip.tab.quests', 'Your quests: what is active, and what is done.'),
  stats: () => t('tip.tab.stats', 'Your character sheet: stats, skills, reputation, professions.'),
  growth: () => t('tip.tab.growth', 'Level up, choose specializations, and spend stars on the Firmament.'),
  holdings: () => t('tip.tab.holdings', 'What you own and who follows you: horse and wagon, ships, companions, stores, collections.'),
  family: () => t('tip.tab.family', 'Your family tree, your house and the Hall of Ancestors.'),
  tutorials: () => t('tip.tab.tutorials', 'Read any of the game\'s tutorials again.'),
  system: () => t('tip.tab.system', 'Save, load, settings, and leaving the game.'),
});

export const RAIL_TIPS = Object.freeze({
  character: () => t('tip.page.character', 'Your health, fatigue and magicka, gold and what you are carrying.'),
  attributes: () => t('tip.page.attributes', 'Strength, Intelligence and your other attributes.'),
  skills: () => t('tip.page.skills', 'What you can do and how well. Master Skills is here too.'),
  specials: () => t('tip.page.specials', 'The advantages and disadvantages you started with.'),
  standing: () => t('tip.page.standing', 'How guilds, factions and the people you meet see you.'),
  effects: () => t('tip.page.effects', 'The spells and conditions on you right now.'),
  professions: () => t('tip.page.professions', 'Your gathering and crafting professions and their ranks.'),
  crafting: () => t('tip.page.crafting', 'The crafting hall and its recipes.'),
  vendor: () => t('tip.page.vendor', 'Your traders, what they have sold, and a search for other traders.'),
  stable: () => t('tip.page.stable', 'Your horse and wagon: summon them or send them away.'),
  fleet: () => t('tip.page.fleet', 'Your ships.'),
  companions: () => t('tip.page.companions', 'The companions sworn to you.'),
  revenants: () => t('tip.page.revenants', 'The revenants that follow you.'),
  stores: () => t('tip.page.stores', 'The materials you have stored.'),
  collections: () => t('tip.page.collections', 'Your codex, cards and wardrobe.'),
  resume: () => t('tip.page.resume', 'Close this window and return to the game.'),
  save: () => t('tip.page.save', 'Save your progress to a slot.'),
  load: () => t('tip.page.load', 'Load a saved game.'),
  settings: () => t('tip.page.settings', 'Options and key bindings.'),
  screenshots: () => t('tip.page.screenshots', 'Your screenshots.'),
  tutorials: () => t('tip.page.tutorials', 'Read any of the game\'s tutorials again.'),
  about: () => t('tip.page.about', 'Version and credits.'),
  exit: () => t('tip.page.exit', 'Leave the game.'),
});

/** Put a tip on a control: hover text, and the line a screen reader reads after its name. Nothing to say, nothing set. */
export function setTip(node, text) {
  if (!node || !text) return node;
  node.title = text;
  node.setAttribute?.('aria-description', text);
  return node;
}
export const tabTip = (node, id) => setTip(node, TAB_TIPS[id]?.());
export const railTip = (node, id) => setTip(node, RAIL_TIPS[id]?.());

// ---- DOTS and KEY CAPS ----
/** The small lit square for "something waits here". `label` is what a screen reader says for it. */
export function dotNode(doc, label) {
  const d = doc.createElement('span');
  d.className = 'px-assist-dot';
  d.setAttribute?.('role', 'img');
  d.setAttribute?.('aria-label', label);
  d.title = label;
  return d;
}

/** The key cap at a tab strip's end: side is 'prev' or 'next'. It takes no part in the strip's layout or the focus order. */
export function keycapNode(doc, key, side) {
  const k = doc.createElement('span');
  k.className = `px-assist-key ${side}`;
  k.textContent = key;
  k.setAttribute?.('aria-hidden', 'true');
  return k;
}

// ---- KEYS ----
/**
 * The window's own keys: Q and E to the previous and next tab, 1 to 9 to the rail's page of that number. `app` is the
 * element the window is drawn in. It acts by pressing the same buttons a click would, so every guard a click has (a Growth
 * face's unaccepted stars, a staged control) holds. Returns true when it took the key.
 * `ok` is asked first: it says whether the window is free to take it (no card, field or window over it).
 */
export function pauseHotkeys(e, app, ok = () => true) {
  if (!app || e.type !== 'keydown' || e.repeat || e.ctrlKey || e.altKey || e.metaKey || e.shiftKey) return false;
  const el = e.target;
  if (el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT' || el.isContentEditable)) return false;
  if (!ok()) return false;
  const code = e.code ?? '';
  if (code === 'KeyQ' || code === 'KeyE') {
    const tabs = [...app.querySelectorAll('.px-tabs button')];
    if (tabs.length < 2) return false;
    const at = Math.max(0, tabs.findIndex((b) => b.classList.contains('on')));
    tabs[(at + (code === 'KeyE' ? 1 : tabs.length - 1)) % tabs.length].click();
    return true;
  }
  const digit = /^(?:Digit|Numpad)([1-9])$/.exec(code);
  if (digit) {
    // the System rail's rows act (Resume, Exit): a number never presses those by accident
    if (app.querySelector('.px-qrail[data-assist="acts"]')) return false;
    const rows = [...app.querySelectorAll('.px-qrail .px-qrow')];
    const row = rows[Number(digit[1]) - 1];
    if (!row) return false;
    row.click();
    return true;
  }
  return false;
}
