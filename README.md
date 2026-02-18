# 🧪 Alchemy

A browser-based element crafting game inspired by Little Alchemy 2. Discover **748 elements** by combining them together, starting from just four basic elements: Water, Fire, Earth, and Air.

## How to Play

1. **Open `index.html`** in any modern web browser
2. **Drag elements** from the sidebar onto the workspace
3. **Combine elements** by dragging one workspace element onto another
4. **Discover new elements** — they appear in the sidebar when found
5. Use **Search** and **Category filters** to find discovered elements

## Features

- 🔬 **748 elements** across 16 categories
- 🧩 **747 recipes** — every element is reachable from the 4 starting elements
- 💾 **Auto-save** — progress is saved in your browser's localStorage
- 🔍 **Search & filter** — find elements by name or category
- ✨ **Discovery animations** — celebrate each new element found
- 📱 **Responsive design** — works on desktop and mobile
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
node tests/game.test.js
```

## Project Structure

```
├── index.html          # Main HTML page
├── css/style.css       # Game styling
├── js/game.js          # Game engine (combination logic, persistence)
├── js/ui.js            # UI controller (drag-and-drop, rendering)
├── data/elements.js    # Element and recipe definitions
└── tests/game.test.js  # Game engine tests
```

## Technical Details

- **No build step** — open `index.html` directly in a browser
- **No external dependencies** — everything is self-contained
- **LocalStorage** — game progress persists between sessions
- **Pointer Events API** — smooth drag-and-drop on touch and mouse devices
