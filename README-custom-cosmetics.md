## Custom cosmetics and titles

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
