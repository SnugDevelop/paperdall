// custom/paperdoll/customTitle.js
//
// The profile's version of the title: a DOM line in gold with a shimmer and twinkling stars, put over the name on the
// character stage's plate (ui/characterSlots.js placePlate). A LOCAL extra - the account service knows nothing of it.

import { TITLE_STRING } from './dressUpTitleFrames.js';

export const DRESSUP_STYLE_ID = 'dressup-title-style';

const CSS = `
.dd-title { position: relative; display: inline-block; padding: 0 .9em; font-weight: 500; line-height: 1.25; white-space: nowrap;
  background: linear-gradient(90deg, #8a5a0c 0%, #f7c840 22%, #fff4a8 50%, #f7c840 78%, #8a5a0c 100%); background-size: 220% 100%;
  -webkit-background-clip: text; background-clip: text; color: transparent; -webkit-text-fill-color: transparent;
  filter: drop-shadow(0 1px 0 #3a2403) drop-shadow(1px 0 0 #3a2403) drop-shadow(-1px 0 0 #3a2403) drop-shadow(0 0 6px rgba(247,200,64,.8));
  animation: dd-shimmer 2.6s linear infinite, dd-glow 2.2s ease-in-out infinite; }
.dd-title::before, .dd-title::after { content: '\\2726'; position: absolute; top: -.15em; color: #fff4a8; -webkit-text-fill-color: #fff4a8;
  background: none; font-size: .75em; animation: dd-twinkle 1.7s ease-in-out infinite; }
.dd-title::before { left: 0; }
.dd-title::after { right: 0; animation-delay: .85s; }
@keyframes dd-glow { 0%, 100% { filter: drop-shadow(0 1px 0 #3a2403) drop-shadow(1px 0 0 #3a2403) drop-shadow(-1px 0 0 #3a2403) drop-shadow(0 0 4px rgba(247,200,64,.55)); }
  50% { filter: drop-shadow(0 1px 0 #3a2403) drop-shadow(1px 0 0 #3a2403) drop-shadow(-1px 0 0 #3a2403) drop-shadow(0 0 11px rgba(255,220,100,.95)); } }
@keyframes dd-shimmer { from { background-position: 0% 0; } to { background-position: -220% 0; } }
@keyframes dd-twinkle { 0%, 100% { opacity: .15; transform: scale(.6); } 50% { opacity: 1; transform: scale(1.15); } }
@media (prefers-reduced-motion: reduce) { .dd-title, .dd-title::before, .dd-title::after { animation: none; } }
`;

export function injectDressUpStyle(doc = document) {
  if (!doc?.head || doc.getElementById(DRESSUP_STYLE_ID)) return;
  const st = doc.createElement('style');
  st.id = DRESSUP_STYLE_ID;
  st.textContent = CSS;
  doc.head.append(st);
}

/** The gold title as a DOM line, its style put in the page the first time. */
export function dressUpTitleNode(doc = document) {
  injectDressUpStyle(doc);
  const n = doc.createElement('div');
  n.className = 'dd-title';
  n.textContent = TITLE_STRING;
  return n;
}
