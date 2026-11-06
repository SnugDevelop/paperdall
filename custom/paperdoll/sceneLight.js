// custom/paperdoll/sceneLight.js
//
// WHETHER THE WORLD'S LIGHT REACHES THE CLIENT'S OWN HALOS AND TITLE. A billboard in the world is shaded like anything
// else standing there - darker in a dim room, darker still in the dungeon's gloom - and so were these. The renderer lets a
// picture carry an EMISSION map (a lantern's glow), which it draws at full brightness whatever the light; and a batch can
// say `emissionOff` to be drawn without it. So each picture is uploaded with its own colours as its emission, and the
// batch's flag follows the player's setting every frame - on or off at will, nothing rebuilt:
//   scene lighting ON  (the default)  emissionOff = true   the world's light and shadow darken it, as before
//   scene lighting OFF                emissionOff = false  it shines at full brightness, like the official title and aura
// A renderer with no uploadEmissionTexture just ignores it: the pictures are lit as ever.

import { sceneLightOn } from './paperdollSetting.js';

/** Upload `tex` ({ width, height, colors }) for (set, key) - and as its own emission map, for the setting to use. */
export function uploadBillboardTexture(renderer, set, key, tex) {
  renderer.uploadTexture(set, key, tex);
  renderer.uploadEmissionTexture?.(set, key, tex, { white: true });
}

/** Set `batch` up for this frame's draw: lit by the scene, or at full brightness, as the player chose. */
export function applySceneLight(batch) {
  batch.emissionOff = sceneLightOn();
}
