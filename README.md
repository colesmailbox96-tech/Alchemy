# 🧪 Alchemy

A browser-based element crafting game inspired by Little Alchemy 2. Discover **748 elements** by combining them together, starting from just four basic elements: Water, Fire, Earth, and Air.

## How It Works – Sand Pouring Simulation

Instead of drag-and-drop, Alchemy uses a **sand-pouring particle simulation**:

1. **Select a material** from the sidebar (tap/click an element card)
2. **Press & hold** on the arena canvas to pour granular particles from a spout at your finger/cursor position
3. Particles fall with gravity, pile up, and bounce off walls
4. **Mix two materials** in the **Reaction Zone** (dashed rectangle at the bottom-center) – when enough particles of 2+ materials coexist, a recipe triggers automatically
5. **Discover new elements** – they appear in the sidebar and become available for pouring

### Controls
- **Single finger / mouse**: move spout position
- **Press & hold**: pour particles
- **Toggle Pour button**: tap-to-toggle pour mode (accessibility)
- **Clear button**: remove all particles
- **Debug button**: show FPS & particle counter

### Tuning Knobs
| Parameter | Default | Description |
|-----------|---------|-------------|
| `MAX_PARTICLES` | 8000 | Maximum number of particles in the pool |
| `SPAWN_RATE` | 4 | Particles spawned per frame while pouring |
| `REACTION_THRESHOLD` | 30 | Particles per material needed to trigger a recipe |
| `COOLDOWN_FRAMES` | 60 | Cooldown between same-recipe triggers (~1s at 60fps) |
| `CHECK_INTERVAL` | 6 | Frames between reaction zone checks |
| `GRID_CELL_SIZE` | 8 | Spatial hash cell size for collision detection |
| `resolutionScale` | ~0.65×DPR | Canvas internal resolution scaling for iOS perf |

These can be adjusted by modifying `js/particleSim.js` (particle config), `js/reactionEngine.js` (reaction config), and `js/arenaRenderer.js` (resolution scale).

## Potential Pivot Direction

### **Idle / Merge Shop Tycoon (Web + iOS + Steam)**

If you decide to rebuild from scratch instead of continuing Alchemy, this is a high-demand concept that fits the repo's web-first stack.
Build a cozy tycoon where players merge items (ingredients, tools, or products), automate production lines, and optimize profit through upgrades and limited-time events.

- **In demand:** idle + merge + management loops have strong retention in mobile and desktop casual markets.
- **Monetizable:** ad rewards (web/mobile), cosmetic packs, battle pass/event pass, optional premium starter bundles, and DLC-style content on Steam.
- **No fancy App Store approvals required to launch early:** ship first as a browser game/PWA (works in Safari on iOS), then wrap later for stores.
- **Runs on iOS and desktop:** responsive web UI with pointer/touch controls.
- **Scalable content model:** new item trees, maps, events, automation machines, seasonal themes, and social features can be added incrementally.
- **Steam-ready path:** package web build in Electron/Tauri for desktop distribution and achievements/cloud save integration later.

## Getting Started

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

## How to Play

1. **Open the app** in your browser (via `npm run dev` or by opening `index.html` directly)
2. **Select an element** from the sidebar by tapping/clicking it
3. **Press & hold** on the arena to pour particles of the selected material
4. **Mix materials** in the Reaction Zone (dashed area at bottom) to trigger recipes
5. **Discover new elements** — they appear in the sidebar and can be poured
6. Use **Search** and **Category filters** to find discovered elements

## Features

- 🔬 **748 elements** across 16 categories
- 🧩 **747 recipes** — every element is reachable from the 4 starting elements
- 🏖️ **Sand-pouring simulation** — pour particles, mix materials, trigger reactions
- ⚗️ **Reaction zone** — automatic recipe detection when materials mix
- 📊 **Debug panel** — FPS counter & particle count toggle
- 📱 **iOS-optimized** — resolution scaling, touch controls, adaptive quality
- 💾 **Auto-save** — progress is saved in your browser's localStorage
- 🔍 **Search & filter** — find elements by name or category
- ✨ **Discovery animations** — celebrate each new element found
- 🚀 **No dependencies** — pure HTML, CSS, and JavaScript

## Categories

| Category | Count | Examples |
|----------|-------|---------|
| Animal | 103 | Dog, Cat, Dragon, Whale |
| Tool | 97 | Hammer, Computer, Rocket |
| Material | 74 | Glass, Steel, Diamond |
| Place | 58 | City, Castle, Volcano |
| Human | 53 | Doctor, Astronaut, Chef |
| Food | 51 | Pizza, Sushi, Chocolate |
| Concept | 51 | Time, Love, Music |
| Technology | 51 | Internet, Robot, Satellite |
| Nature | 44 | Mountain, River, Forest |
| Plant | 40 | Tree, Rose, Cactus |
| Science | 29 | DNA, Atom, Electricity |
| Myth | 27 | Dragon, Phoenix, Unicorn |
| Space | 23 | Sun, Moon, Galaxy |
| Weather | 23 | Rain, Thunder, Tornado |
| Life | 20 | Life, Cell, Bacteria |
| Basic | 4 | Water, Fire, Earth, Air |

## Running Tests

```bash
npm test
```

## Project Structure

```
├── index.html              # Main HTML page with canvas arena
├── package.json            # Dev dependencies and scripts
├── css/style.css           # Game styling
├── js/
│   ├── game.js             # Game engine (combination logic, persistence)
│   ├── ui.js               # UI controller (sand sim integration, sidebar)
│   ├── physics.js           # Legacy physics (element gravity/stacking)
│   ├── particleSim.js       # Particle simulation (pooling, spatial hash, gravity)
│   ├── arenaRenderer.js     # Canvas2D renderer (resolution scaling)
│   ├── inputController.js   # Touch/pointer input (spout, pour controls)
│   └── reactionEngine.js    # Reaction zone (recipe triggering)
├── data/elements.js         # Element and recipe definitions (748 elements)
└── tests/
    ├── game.test.js         # Game engine tests
    ├── physics.test.js      # Physics classification tests
    └── reaction.test.js     # Particle sim + reaction engine tests
```

## Technical Details

- **No build step** — open `index.html` directly in a browser
- **No external dependencies** — everything is self-contained
- **Canvas2D particle simulation** — up to 8000 particles with object pooling
- **Spatial hash grid** — efficient neighbor detection for pile approximation
- **Resolution scaling** — internal canvas resolution adapts to device pixel ratio
- **Adaptive quality** — spawn rate decreases if FPS drops below threshold
- **LocalStorage** — game progress persists between sessions
- **Pointer Events API** — unified touch and mouse controls
- **iOS Safari optimized** — no layout thrash in render loop, touch-action: none
