# NOTZeta PvP Draft Tool

Official Website: [https://quanlinhson.github.io](https://quanlinhson.github.io)

## 📌 Introduction
**NOTZeta PvP Draft Tool** is an interactive, high-performance Ban/Pick drafting platform designed for competitions, eSports tournaments, livestreaming, and casual PvP matches with friends.

Currently supporting:
- **Genshin Impact (GI)**
- **Honkai: Star Rail (HSR)**

Each game features dedicated drafting rules, element/path/weapon filters, sound effects, and custom card rendering tailored to the respective gameplay mechanics.

> ⚠️ **CAUTION**: This web application is optimized for **Desktop and Laptop** screens (minimum recommended resolution: 1280x720).

---

## ✨ Key Features

- **🎮 Dual HUD Layout Modes**:
  - **Player Mode (Vertical Columns)**: Classic 2-column layout with 8 vertical pick slots on each side and a centered character selector.
  - **Broadcast Mode (Horizontal eSports Overlay)**: Bottom-docked tournament banner with full-width responsive pick cards, glow countdown timer, and a central `VS` badge—ideal for casters, OBS overlays, and livestreams.
- **⚡ Unified Core Engine**:
  - `DraftEngine`: Robust state machine managing turn cycles, countdown timers, dynamic slot rendering, audio playback, and layout switching.
  - `FilterEngine`: High-performance search with debouncing (150ms), multi-attribute category filtering, and `DocumentFragment` DOM batching.
- **⚙️ Match Customization & Persistence**:
  - Customizable Team Names, Match Score (`0 - 0`), Ban/Pick timers, and Layout Mode with automatic `localStorage` persistence.
  - Granular volume controls for BGM, Ban sound, and Pick sound effects.
- **⏱️ Tournament Automations**:
  - Automatic **No-Ban** pass when ban time expires.
  - Automatic **Random Pick** selection when pick time expires.

---

## 🛠️ Technology & Architecture

- **Front-end**: HTML5, Modern CSS3 (CSS Variables, Flexbox/Grid, Glassmorphism, Clip-path animations).
- **Architecture**: Modular Vanilla JavaScript (ES6+ Modules, Adapter Pattern).
  - `src/All/core/draftEngine.js`: Core draft state machine.
  - `src/All/core/filterEngine.js`: Search & category filter system.
  - `src/All/styles/hud-base.css`: Centralized layout, animations, and broadcast overlay styles.
  - `gi-config.js` / `hsr-config.js`: Lightweight game adapters.

---

## 📊 Database & Assets

- Data structures adapted and expanded from the [Pustur GitHub page](https://github.com/Pustur/genshin-impact-team-randomizer).
- Character assets, splash art, and game icons sourced from [HoYoWiki (HoYoverse)](https://wiki.hoyolab.com/), [Honey Impact](https://gensh.honeyhunterworld.com/), in-game resources, and community wikis.

---

## 🖥️ UI Showcase

### 🌟 Genshin Impact
- **Classic Player HUD (Vertical Columns)**:
  ![Genshin Impact Classic Player HUD](/src/All/images/GI1.png)
- **Broadcast Mode (Horizontal eSports Overlay)**:
  ![Genshin Impact Broadcast HUD](/src/All/images/GI_broadcast.png)

### 🚀 Honkai: Star Rail
- **Classic Player HUD (Vertical Columns)**:
  ![Honkai Star Rail Classic Player HUD](/src/All/images/HSR1.png)
- **Broadcast Mode (Horizontal eSports Overlay)**:
  ![Honkai Star Rail Broadcast HUD](/src/All/images/HSR_broadcast.png)

---

## 🔮 Future Development Roadmap

- [ ] Add Zenless Zone Zero (ZZZ) drafting support.
- [ ] Export match results as high-resolution summary image (PNG).
- [ ] Fearless Draft & Global Ban/Pick rule presets.
- [ ] Online multiplayer room synchronization via WebSockets/WebRTC.
- [ ] Additional tournament BGM and sound packs.

---

## 📜 License & Disclaimer

- This is a **non-profit, open-source community project** created for tournament organizers, streamers, and players.
- **NOT for commercial use.**
- All game assets, artwork, and trademarks belong to **HoYoverse / Cognosphere**.
- Licensed under [Apache 2.0](LICENSE).

---

## 📝 Update Log
See all recent updates, refactors, and version history in [CHANGELOG.md](CHANGELOG.md).