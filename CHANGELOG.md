# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## 🚀 Version 1.3.0 (September 20, 2026)
major: add Broadcast / eSports HUD layout, new GI characters & visual enhancements

### ✨ 1. New Characters & Artwork (GI):
- Add new characters in GI: **Vesna** (5★ Anemo / Sword) & **Vodyanitsa** (5★ Hydro / Catalyst).
- Added card artwork & selection portraits for **Vesna** and **Vodyanitsa**.
- Refreshed/updated Traveler portrait assets for all 7 elements (Anemo, Geo, Electro, Dendro, Hydro, Pyro, Cryo) across character cards and selection grid.

### 🎮 2. Broadcast / eSports HUD Layout Mode:
- Added layout selector in Settings modal (`Vertical (Player Mode)` / `Horizontal (Broadcast / eSports)`) with `localStorage` persistence and live parent-child window communication.
- Implemented full Horizontal Broadcast HUD in `src/All/styles/hud-base.css`:
  - Docked Ban bar above pick slots with enlarged slot cards (70x70px) and glow highlights.
  - Full-width bottom Pick bar with seamless side-by-side cards for Team 1 and Team 2.
  - Centered glowing `VS` badge separating team pick zones.
  - Floating upper character selection modal for optimized broadcast stream visibility.
- Dynamic layout engine integration in `DraftEngine.applyLayoutMode` switching `.broadcast-hud` and `.classic-hud`.

### 🎨 3. UI/UX Polishing & Fixes:
- Replaced score separator in title bar from text "vs" to clean "-" dash (`#score-bar`).
- Fixed `no_ban.svg` icon rendering by removing unwanted solid white background block.
- Refined image centering and positioning (`object-position: 50% 20%` / `background-position`) for Ban and Pick cards across GI and HSR.
- Streamlined `HSRConfig.renderPickSlot` art styling and added custom styles for `<select>` elements in settings panel.

## 🔧 Version 1.2.20.3 (August 31, 2026)
refactor: unify core engines, streamline HUD styles & fix layout issues

### ✨ 1. Core Engine Unification (Adapter Pattern):
- Created `src/All/core/draftEngine.js`: Consolidated Ban/Pick state machine, countdown timer, auto timeout handling (No-Ban / Random Pick), audio playback, volume controls, settings modal integration, and dynamic slot generation.
- Created `src/All/core/filterEngine.js`: Consolidated character search (150ms debounce), multi-category filtering (element, weapon, path, rarity stars), high-performance DOM rendering via `DocumentFragment`, and Event Delegation.
- Created `gi-config.js` and `hsr-config.js`: Extracted game-specific configurations (slot definitions, filter categories, custom card rendering).
- Streamlined `code.js` and `search.js` in both GI & HSR into thin adapter entry points (~10 lines each).

### ✨ 2. HUD Streamlining & Base/Theme CSS Separation:
- Created `src/All/styles/hud-base.css`: Centralized shared layout flexbox/grid, animations (slot-glow, blink, warp), scoreboard, timer, volume dropdown, and search box.
- Eliminated over 1,500 lines of duplicated CSS: reduced `GI/style.css` (819 -> 50 lines) and `HSR/style.css` (844 -> 60 lines).
- Streamlined `HUD.html` for both games from ~160 lines down to ~65 lines via dynamic slot and filter generation.

### ✨3. Bug Fixes & UI Polishing:
- Fixed 404 resource errors for system icons (`settings_icon`, `volume_icon`, `search_icon`) caused by relative path resolutions.
- Restored empty placeholder background images (`card-bg`, `empty`, `choose`) across both games.
- Fixed pick slots overflow/squishing issues by establishing two seamless, compact vertical columns (`gap: 0;`, `width: 250px; height: 88px;`) aligned along the left and right screen edges matching the original reference designs.
- Restored vertical divider lines (`.verticalLine`) between Ban slots with game-specific border colors.

## 🔧 Version 1.2.20.2 (August 31, 2026)
### 🔧 Fix:
- Use DocumentFragment and batch DOM manipulation to prevent reflow/layout thrashing when rendering character grid in search.js.
- Add debounce (150ms) to search input to optimize filtering performance.
- Implement event delegation on character list container instead of binding individual click listeners per item.
- Add loading="lazy" for character portraits.
- Add font-display: swap to all @font-face rules across stylesheets to prevent FOIT (Flash of Invisible Text).
- Safely resolve element icons when character.elements is an array in GI HUD.

## 🔧 Version 1.2.20.1 (August 31, 2026)
### ✨ Add:
- Add stopCountdown() helper in time.js and properly clear timer on draft completion.
### 🔧 Fix:
- Fix navigation link paths (change Windows backslashes '\' to '/' and relative assets) in index.html for Linux/GitHub Pages compatibility.
- Fix audio source bindings (correctly map ban.wav to ban-sound and pick.wav to pick-sound) in GI and HSR HUDs.
- Fix audio volume ReferenceError and confirmBtn variable shadowing in code.js for both GI & HSR.
- Rename 'setting copy.html' to 'setting.html' across GI and HSR features and update iframe sources.
- Fix unclosed HTML tags and CSS selector mismatch (.page-container vs #page-container).

## 🔥 Version 1.2.20 (August 26, 2026)
### ✨ Add:
- Add new character in HSR v4.5 : **Robin - Summeretto & Aventurine - Waveflair**.

## Version 1.2.19 (August 12, 2026)
### ✨ Add:
- Add new character in GI v7.0 : **Odette, Alyosha & Traveler (Cryo)**.

## Version 1.2.18 (July 25, 2026)
### ✨ Add:
- Add new character in HSR v4.4 (Part 2) - HSRxFATE : **Rin Tohsaka & Gilgamesh**.
### 🔧 Fix:
- Fix character image for **Dahlia** in HSR.

## Version 1.2.17 (July 15, 2026)
### ✨ Add:
- Add new character in HSR v4.4 (Part 1): **Himeko - Nova**.

## Version 1.2.16 (July 01, 2026)
### ✨ Add:
- Add new character in GI "Luna VIII": **Sandrone**.

## Version 1.2.15 (June 07, 2026)
### ✨ Add:
- Add new character in HSR v4.3: **Mortenax Blade**.

## Version 1.2.14 (May 20, 2026)
### ✨ Add:
- Add new character in GI "Luna VII": **Lohen, Nicole & Prune**.

## Version 1.2.13 (April 22, 2026)
### ✨ Add:
- Add new character in HSR v4.2: **Silver Wolf LV.999, Trailblazer(Elation) & Evanescia**.

## Version 1.2.12 (April 8, 2026)
### ✨ Add:
- Add new character in GI "Luna VI": **Linnea**.

## Version 1.2.11 (March 29, 2026)
### ✨ Add:
- Add new character in HSR v4.1: **Ashveil**.

## Version 1.2.10 (February 25, 2026)
### ✨ Add:
- Add new character in GI "Luna V": **Varka**.

## Version 1.2.9 (February 13, 2026)
### ✨ Add:
- Add new path: "Elation" in HSR.
+ Updates: register "Elation" in pathNames (const.ts), append character entries to HSRCharacter (character.js), add Elation icon to HUD player paths (HUD.html)
- Add new character in HSR v4.0: Yao Guang & Sparxie.
### 🔧 Update:
- Update: Bump footer version to 1.2.9 (index.html).

## Version 1.2.8 (January 27, 2026)
### ✨ Add:
- Add new character in GI "Luna IV": **Columbina, Zibai & Illuga**.

## Version 1.2.7 (January 02, 2026)
### ✨ Add:
- Add new character in HSR "3.8": **The Dahlia**.

## Version 1.2.6 (December 03, 2025)
### ✨ Add:
- Add new character in GI "Luna III": **Durin & Jahoda**.

## Version 1.2.5 (November 17, 2025)
### ✨ Add:
- Add new character in HSR v3.7: **Cyrene**.

## Version 1.2.4 (October 23, 2025)
### ✨ Add:
- Add new character in GI "Luna II": **Nefer**.

## Version 1.2.3 (September 24, 2025)
### ✨ Add:
- Add new character in HSR v3.6: **Evernight & Dan Heng - PT**.

## Version 1.2.2 (September 10, 2025)
### ✨ Add:
- Add new character in GI "Luna I": **Aino, Flins & Lauma**.
### 🔧 Change:
- Change background for GI Ban/Pick UI: Using the moon image.

## Version 1.2.1 (August 13, 2025)
### ✨ Add:
- Add new character in HSR v3.5: **Hysilens & Cerydra**.

### 🚀 Optimization:
- Add filter title for character filter in HSR and GI.
- Change bolder size when choosing icon in character filter in HSR and GI.

## Version 1.1.1 (July 30, 2025)
### ✨ Add:
- Add new character in GI v5.8: **Ineffa**.

## Version 1.1.0 (July 2, 2025)
### ✨ Add:
- Add new character in HSR v3.4: **Archer, Phainon & Saber**.

### 🔧 Fix:
- Fix the bug that you can't hear the ban sound after the no-ban is running.
- Fix the bug that when you choose the character that have lots of variants, lock it, and then you use filter function, the character that you choose didn't grayscale like the other characters.

## 🔥🔥Version 1.0.0 - BIG UPDATE (June 18, 2025) 🔥🔥
### ✨ Add: 
- Add new character in GI v5.7: **Skirk & Dahlia**.

### 🚀 Optimization:
#### - Open page for HSR and GI:
* Make the box for HSR and GI more **compact**.
* Optimize the icon for HSR and GI.
* Optimize the background for HSR and GI: Using the color for full background instead of using the image.
* Optimize the footer:
    - Add "About this project" with GitHub link and Feedback link.
    - Change footer layout to make it more compact.
    - Add my channel logo to the footer.
    - Change the footer description text to make it more suitable for the project.

#### - Setting in HSR and GI:
* Update UI Template for setting Menu to make it suitable.
* Add logic: you need to setting the team name, score and countdown time and click the "Save Setting" button to start the ban/pick phase or you can click the button "Save Setting" to start the ban/pick phase without edit it.
* Add logic: you can change the team name anytime during the ban/pick phase, but not the countdown time.

#### - Logic ban/pick for HSR and GI:
* **Remove the old ban/pick logic**: Once you clicked on a character from the character list during your ban/pick phase, ***it would automatically confirm your pick***. 
* **Add the new ban/pick logic**: You can ***choose any character during your ban/pick phase*** and **confirm** your pick with the "Confirm" button if you're happy with it.
* Team can **choose** _only 1 variant of the character has lots of variants per team_.
* If you didn't ban your character in the ban phase, or you choose your character to ban but didn't confirm it, the game will **automatically not ban your character** for you.
* If you didn't pick your character in the pick phase, the game will **randomly choose a character for you from the character list**.
* If you pick your character in the pick phase, but didn't confirm it when time was ended, the game will **automatically confirm your pick** for you after the pick phase is finished.

#### - Ban/pick HUD 
##### + For HSR: 
* Change the blink animation for ban/pick: 
    - From ***flashing effect*** to ***blink ban/pick slot effect*** while in turn with team color.
    - Add the **border blink animation** to confirm your character on the pick slot when you click on the "Confirm" button.

* UI of pick slot: 
    - Removed rarities; path, element and character name will be in a corner of pick slot.
    - Change the character image in pick slot: Now it will use ***a part of image from Character Splash Art*** instead of using the **Selection Character Image** like before.
    - There will have a black overlay on the character image in pick slot to make it more visible.
    - The border of the pick slot will be rounded in one corner to match the game theme.
    - Background of pick slot when you choose your character will be darker.

* The scroll bar in character-list will be **thinner**.

* New confirm button design: It will be a **rounded button** with some adjustment to match the game theme.

* Change color the vertical line in ban slot and border of pick slot: It will now use a different color scheme (from #ffffff to #DBC291) to match the game theme.

* Add background for HUD: The background will use image from **"HSR Login screen"**.

* Title bar: 
    - Setting and Volume button will be in the title bar, not in the simple button in the conner like before.
    - Name and score text will be bigger than before.
    - Some adjustment design for the title bar to make it more compact. 

##### + For GI:  
* Change the blink animation for ban/pick: 
    - From ***flashing effect*** to ***blink ban/pick slot effect*** while in turn with team color.
    - Add the **border blink animation** to confirm your character on the pick slot when you click on the "Confirm" button.

* UI of pick slot: 
    - Removed rarities; path, element and character name will be in a corner of pick slot.
    - There will have a white overlay on the character image in pick slot to make it more visible.
    - Background of pick slot when you choose your character will be darker.

* Change color the vertical line in ban slot and border of pick slot: It will now use a different color scheme (from #ffffff to #4D5564).

* The scroll bar in character-list will be **thinner**.

* New confirm button design: It will be a **rounded button** with some adjustment to match the game theme.

* Add background for UI: The background will use image from "GI Spiral Abyss background".

* Title bar: 
    - Setting and Volume button will be in the title bar, not in the simple button in the conner like before.
    - Name and score text will be bigger than before.
    - Some adjustment design for the title bar to make it more compact. 

#### - Other Optimization:
* Hide character-list, filter, and confirm button after all ban/pick turns are finished for a cleaner UI.
* Remove some unnecessary code and files.
* Add a new ban/pick music for HSR.

### 🔧 Fix:
* Fix the team name title can't reset after you finish the ban/pick phase.
* Fix the battle auto start the ban/pick phase when you open the web and did't clisk save setting to begin the ban/pick phase.

## Version 0.4.2 
### ✨ Add: 
- Add new character in HSR v3.3: **Cipher & Hyacine**.

##  Version 0.4.1 
### ✨ Add: 
- Add new character in GI v5.6: **Escoffier & Ifa**.

##  Version 0.4.0 
### ✨ Add: 
- Add new character in HSR v3.2: **Castorice & Anaxa**.
- Add **Setting** and **Volume** button in HSR Ban/Pick UI like GI.
- Add ban/pick turn notice on team name title.

### 🔧 Fix:
- Erase some unuse line.
- Make time.js is a global tool for this project. 

## Version 0.3.0
### Add:
- Add new character in GI v5.5: Varesa & Iansan.
- Add **Setting** button in GI: Change team name, score and countdown time.
- Add **Volume** button in GI: Can adjust the volume of ban/pick sound.
- Add ban/pick turn notice on team name title.

### Fix:
- Change folder name in HSR and GI from HUI to HUD.

## Version 0.2.2
### Fix:
- Change UI for **Search bar** (HSR, GI).
- Change **Character Filter** (GI).
- Center character name in the name card in character-list (HSR, GI).
- Fix **Alert message box** (HSR, GI).

## Version 0.2.1 (HOT FIX)
### Fix:
- Change Opening Page UI.
- Fix text in Opening Page UI footer.

## Version 0.2.0 (Feb 26,2025)
### Add:
+ [README.md.](README.md)
+ Honkai: Star Rail Ban/Pick UI.
+ [CHANGELOG.md](CHANGELOG.md)

### Fix:
#### + Opening Page: 
- Change UI.
- Can choose HSR or GI for Ban/Pick UI.
#### + Genshin Ban/Pick UI: 
- Change Vertical Line in Ban Slot to make it thinner.
- Add Icon in Pick Slot.
- Decrease the width of character-filter and character-list.
- Fix the empty background size in Pick Slot.
- Background image and Icon in Ban/Pick Slot will be disappeared when you choose your character.
- Show Rarities for character on Pick-Slot when you pick your character. 
- Fix bug: Can't see blink animation when game start.

## Version 0.1.0 (Sep 7, 2024 - Feb 25, 2025)
### Add:
+ GI Ban/Pick UI.
+ GI Ban/Pick Opening Page.
+ Opening Page.

### Fix
+ Bug in GI Ban/Pick UI.