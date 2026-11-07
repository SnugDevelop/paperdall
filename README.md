```text
════════════════════════════════════════════════════════════════════════
██████╗  █████╗ ██████╗ ███████╗██████╗ ██████╗  █████╗ ██╗     ██╗     
██╔══██╗██╔══██╗██╔══██╗██╔════╝██╔══██╗██╔══██╗██╔══██╗██║     ██║     
██████╔╝███████║██████╔╝█████╗  ██████╔╝██║  ██║███████║██║     ██║     
██╔═══╝ ██╔══██║██╔═══╝ ██╔══╝  ██╔══██╗██║  ██║██╔══██║██║     ██║     
██║     ██║  ██║██║     ███████╗██║  ██║██████╔╝██║  ██║███████╗███████╗
╚═╝     ╚═╝  ╚═╝╚═╝     ╚══════╝╚═╝  ╚═╝╚═════╝ ╚═╝  ╚═╝╚══════╝╚══════╝

             ██████╗ ███╗   ██╗██╗     ██╗███╗   ██╗███████╗
            ██╔═══██╗████╗  ██║██║     ██║████╗  ██║██╔════╝
            ██║   ██║██╔██╗ ██║██║     ██║██╔██╗ ██║█████╗  
            ██║   ██║██║╚██╗██║██║     ██║██║╚██╗██║██╔══╝  
            ╚██████╔╝██║ ╚████║███████╗██║██║ ╚████║███████╗
             ╚═════╝ ╚═╝  ╚═══╝╚══════╝╚═╝╚═╝  ╚═══╝╚══════╝
════════════════════════════════════════════════════════════════════════
```

**Paperdall Online** is a custom DFO client designed to draw in the player's paperdoll sprite in place of the usual animated sprite, along with adding simple QoL changes for better readability.

DISCLAIMER: Vibe coded from ChatGPT and Claude, so this is not my own work and may be buggy.

## Features

- Reuses the existing Daggerfall equipment paperdoll, replacing the traditional animated player sprite with the paperdoll representation.
- Simple QoL changes for better client readability. 
- Displays the player's equipped appearance in the outdoor world.
- Optional animated back sprite when seen from behind.
- Preserves the existing first-person view and combat behavior. The paperdoll feature is intended as an alternative third-person character presentation, not a replacement for the original first-person experience.

## Custom changes

Built on Daggerfall Enhanced (`daggerfall-js-source`, MIT) and Daggerfall Unity. The paperdoll code lives in
`custom/paperdoll/`; the upstream files listed under "Files touched" carry only small hooks, so updates from upstream
merge cleanly.

### Paperdoll

- **Paperdoll body in third person.** The player's own paperdoll, composed transparently from the equipped gear,
  replaces the Eye of the Beholder sprite when walking on foot. The sprite is kept when riding, transformed, dead,
  in the grown overworld travel view, and until the doll has finished composing. The doll updates when gear, race,
  gender or face change.
- **"Paperdoll" look option.** Profile → Skin → Look now offers Skins, Layered Gearing and Paperdoll. The choice is
  saved with the game's other settings. Paperdoll is on by default (`DEFAULT_ON` in
  `custom/paperdoll/paperdollSetting.js`).
- **Animated back sprite (optional).** With Paperdoll selected, a checkbox under it lets the normal animated sprite
  draw when the player is seen from behind, so the paperdoll is the front view only. Off by default
  (`BACK_DEFAULT_ON` in `paperdollSetting.js`). The sprite is used for the straight-behind view and the two back
  diagonals (`BACK_ORIENTATIONS` in `paperdollExtensions.js`).
- **Paperdoll character preview.** With Look set to Paperdoll, the profile (and shop and wardrobe) character
  preview shows the paperdoll in a running game. At the title screen it still shows the sprite.
- **Mod faces in menu icons.** Face icons (menu portrait, save tiles, character-creation face picker) use an
  attached DFMod's replacement faces, such as Paperdoll Enhanced, and fall back to the original icons. Works with
  the mod and with loose textures.
- **Debugging aid.** `__paperdoll.state()` and `__paperdoll.diag` in the browser console report the paperdoll's
  status.
- **Sheathing.** The in-world doll now draws with its weapon, shield and torch removed while your weapon is put away, and brings them back when you draw. One detail: sizing is still measured from the doll as worn, so the figure doesn’t shrink or grow when the weapon appears or disappears. On a fresh login you’re sheathed, so weapons won’t show until you draw. A gathering tool in hand counts as drawn, matching how your game already treats it.

### QoL Changes

- **Master Skills.** It’s now a card at the top of the Skills page, with its one-line description. The Character page keeps a single row of doors: Pack, Spellbook, Chronicle, Growth. Master Skills and Growth keep their count badges.
- **Grouped rails.** Thin rules split the Stats rail into you, standing and activities. The System rail splits into game, options, help and leave.
- **Plainer names.** Standing is now Reputation, and Advantages is now Advantages & Disadvantages. Every tab and most pages also have a hover tip, for example Growth: “Level up, choose specializations, and spend stars on the Firmament.”
- **Waiting markers.** A small lit square sits on the Growth tab when a level, path or stars are waiting. One also appears on Stats and Skills when a skill is ready to master, so moving Master Skills doesn’t hide that.
- **Keys.** Q and E step through tabs, and 1 to 9 open the rail’s pages, with small Q and E key caps at the ends of the tab strip. The keys stand aside while a card, field or window is open, on the System rail (where rows act), and while the Growth stage is up.
- **System.** Added a Tutorials row next to About. The Tutorials tab stays where it was.
- **Readability** The dim small print is a step brighter, and keyboard focus now draws a clear yellow ring.

### HUD Character Card

It sits bottom-left and shows:

- The head and shoulders of your paperdoll
- your title above your name
- HP, MP and FT bars, with fatigue as a percentage

### Custom cosmetics and titles

Paperdall adds a few cosmetics and a title of its own. They are bonus, client-side extras: included locally for Paperdall users, no purchase or account unlock required. Only you see them. The account service knows nothing about them, and they never touch the official store cosmetics, titles or auras.

### Where to find them

Open your profile while signed in:

- **Cosmetics** (button at the top left of the profile) opens the Cosmetics tab.
- **Titles** (button at the top right of the profile) opens the Titles tab.
- The halos are also offered in the **Head** slot's picker in the Character section, after the official head pieces.

Point at a choice to preview it and read its description, press it to wear it, and press it again (or choose **None**) to take it off. Your choices are remembered in this browser.

### Cosmetics (head)

Only one halo can be worn at a time.

| Halo | Look |
| --- | --- |
| Golden Halo | A ring of gold pixels with a bright glint running round it and sparkles that swell and fade. |
| Flaming Halo | A ring of fire with tongues of flame rising from it and drifting embers. |
| Frost Halo | A ring of ice with snowflakes falling through it and icy glints around the rim. |
| Pink Devil Halo | A glossy pink halo crowned with two little devil horns. Thick pink liquid beads along the ring, swells into drips, lets go and falls. |

### Titles

| Title | Look |
| --- | --- |
| My Dress Up Darling | A shimmering gold title with twinkling stars, shown above your name over your head and on your profile. |

### Where the code lives

All of it is in `custom/paperdoll/`, with small hooks in `src/`.

- `localCosmetics.js`: the list of local halos and titles, and the Cosmetics and Titles tabs.
- `paperdollSetting.js`: the saved settings. Turning one halo on turns the others off.
- `pinkDevilHaloFrames.js`, `pinkDevilHalo.js`: the Pink Devil Halo's pixel art (drawn in code, no image assets) and its in-world drawing.
- `goldHalo.js`, `elementalHalo.js`, `dressUpTitle.js` (and their `*Frames.js`): the other halos and the title.
- Hooks: `src/ui/enhanced/enhancedAccount.js` (the two buttons and the tab), `src/ui/characterSlots.js` (halos in the Head picker), `src/player/eyeOfTheBeholder/eotbBody.js` (draws the halos in the world).

### Adding another cosmetic

Add an entry to `LOCAL_HALOS` (or `LOCAL_TITLES`) in `localCosmetics.js` with a name, colour, description and preview frames, add a setting in `paperdollSetting.js`, and draw it in the world the way `pinkDevilHalo.js` does.


### Branding and menus

- **Renamed to Paperdall Online.** A new gold wordmark replaces the dragon logo in the menu, intro and landing page
  (`src/assets/branding/dfo-online.png`, same size as the original so layouts are unchanged). A matching title
  splash is at `public/logo.png`, and the landing page's title text is updated.
- **Support links removed; About button added.** The Patreon and Ko-fi icons are gone from the in-game main menu
  and from the landing page. A small "i" button takes their place and opens the AI disclaimer about this build.

### Files touched

New: `custom/paperdoll/paperdollExtensions.js`, `paperdollSetting.js`, `paperdollImage.js`; `public/logo.png`.

Replaced art: `src/assets/branding/dfo-online.png`.

Small edits to upstream files:

| File | Change |
|---|---|
| `src/ui/paperDoll.js` | `composeDollTransparent`, the doll without its backdrop |
| `src/player/eyeOfTheBeholder/eotbBody.js` | the draw hook (one import, one call) |
| `src/ui/skinCard.js` | the Paperdoll look and the back-sprite checkbox |
| `src/ui/profileBody.js`, `src/render/characterStage.js` | the paperdoll preview |
| `src/ui/facePortrait.js` | mod faces in menu icons |
| `src/ui/enhanced/enhancedMenu.js` | the About button replaces the support links; unused import removed |
| `index.html` | landing page: title text, support links replaced by the About button |

### Not changed

The desktop launcher window (`app/launcher`) still shows the original name and logo. The account server's optional
Claude staff feature (`server-account/src/claudeStaff.js`) is left in; it does nothing unless a server enables it.

## Running from source

Daggerfall's game files are not included. You need your own copy of the `arena2` folder.

```
npm install
set ARENA2_PATH=C:\path\to\your\arena2
npm run dev
```

To build: `npm run build`. After changing code, rebuild before testing a built copy.

## Credits

Based on Daggerfall Enhanced by Lattymoy and Daggerfall Unity.


# DFO Online: open-source edition

This is the source of DFO Online as it stood on 2026-11-02. It is released under the MIT License (`LICENSE`), with
Daggerfall Unity's notice beside it. Work on DFO Online continues in a private repository.

DFO Online is an independent, unofficial project. It is not affiliated with or endorsed by Bethesda Softworks or
ZeniMax Media. The Elder Scrolls and Daggerfall are trademarks of ZeniMax Media Inc.

Play the live game at https://daggerfalljs.dev/.

## The desktop app

The desktop app's releases are published here, and installed copies update from them:
https://github.com/Lattymoy/daggerfall-js-source/releases

## Reporting a bug

Open an issue here. Report an exploit or a security problem privately, as `SECURITY.md` says.

## Building this edition

Node 20.19+ or 22.12+.

- `npm ci`
- `npm run dev`: the development server
- `npm run build`: a production build

The game reads your own copy of The Elder Scrolls II: Daggerfall (its `ARENA2` folder), which is never committed.
`sh tools/fetch-data.sh <folder>` downloads the free release of it into that folder.


This edition does not follow the live game, so its client may occasionally disconnect from live servers but is still able to be used online.
