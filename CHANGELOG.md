# Changelog

## [2.0.0] - 2026-02-21

### Changed
- **Replaced drag-and-drop UX with sand-pouring simulation**: Users now select a material from the sidebar palette and press/hold on the canvas arena to pour granular particles. Particles fall with gravity, pile up, and can be mixed in a reaction zone to trigger recipes.
- **Sidebar click now selects active material** instead of creating a workspace element. Selected material is highlighted with a purple border and indicator arrow.
- **Workspace is now a Canvas2D arena** instead of a DOM-based element playground.
- **Hint overlay** updated to explain new sand-pouring controls.

### Added
- `js/particleSim.js` — Particle simulation engine with object pooling (8000 particles), spatial hash grid for pile approximation, gravity, damping, and wall/floor collisions.
- `js/arenaRenderer.js` — Canvas2D renderer with iOS resolution scaling (~0.65× devicePixelRatio), batched color rendering, reaction zone visualization, and spout indicator.
- `js/inputController.js` — iOS-first pointer/touch input controller with press-and-hold pouring and tap-to-toggle accessibility mode.
- `js/reactionEngine.js` — Reaction zone engine that periodically counts particles by material, checks recipes, consumes particles, and triggers discovery callbacks. Supports cooldowns and configurable thresholds.
- `tests/reaction.test.js` — 16 unit tests covering particle spawning/removal, zone counting, physics gravity, recipe triggering (fire+water=steam, earth+water=mud, etc.), cooldown behavior, same-element combos, and reset logic.
- **Toggle Pour button** — Tap-to-toggle pour mode for accessibility.
- **Debug button** — Toggle FPS and particle count overlay on the canvas.
- **Selected material indicator** — Shows current material emoji and name in the arena top-left.
- **Adaptive quality** — Automatically reduces spawn rate when FPS drops below 30.
- **CHANGELOG.md** — This file.

### Preserved
- All 748 elements and 747 recipes unchanged.
- Discovery popup and auto-dismiss behavior.
- Search and category filter functionality.
- Progress bar and discovered count display.
- LocalStorage persistence of discovered elements.
- Reset and clear functionality.
- Mobile sidebar toggle.
- All existing tests (game engine: 20, physics: 21) continue to pass.
