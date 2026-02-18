# Elemental Forge — Complete Build Specification

## Project Overview

**Elemental Forge** is a browser-based element-combining game inspired by Little Alchemy 2. Players start with 4 base elements (Water, Fire, Earth, Air) and combine them by dragging one onto another to discover new elements. The goal is to discover all 720+ elements through experimentation. The game must be fully playable in a browser via GitHub Codespaces port forwarding AND on iPhone/iOS Safari with a polished, touch-first mobile UI.

**This README is the ONLY input. Build the COMPLETE, FULLY FUNCTIONAL application from this specification alone. Zero placeholders. Zero TODO comments. Zero mock data. Every element combination must be real. Every UI interaction must work.**

---

## Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Frontend | Single HTML file with inline CSS + JS | Zero build step, instant load, Codespaces-compatible |
| Backend | Node.js + Express | Serves static files, provides API for hints |
| Data | Embedded JSON (inline in JS) | No database needed, all state in localStorage |
| Deployment | GitHub Codespaces | `npm start` → port 3000 → Open in Browser |

### Project Structure

```
elemental-forge/
├── package.json
├── server.js
├── public/
│   └── index.html          # The ENTIRE game (HTML + CSS + JS, single file)
├── data/
│   └── elements.json       # Master element/recipe database (also embedded in index.html)
└── README.md
```

---

## Setup & Launch

```bash
npm install
npm start
# Open: http://localhost:3000
# In Codespaces: Use the forwarded port URL
```

**package.json:**
```json
{
  "name": "elemental-forge",
  "version": "1.0.0",
  "description": "Element combining discovery game",
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "express": "^4.18.2"
  }
}
```

**server.js** — Minimal Express server:
```javascript
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.static('public'));
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Elemental Forge running at http://localhost:${PORT}`);
});
```

---

## Game Mechanics — COMPLETE SPECIFICATION

### Core Loop

1. Player sees their discovered elements in a scrollable sidebar/panel
2. Player drags an element onto the workspace (center area)
3. Player drags a second element onto the first element in the workspace
4. If a valid combination exists → new element is created with a discovery animation
5. If no valid combination → elements bounce apart with a "no match" indicator
6. Newly discovered elements appear in the sidebar with a sparkle animation
7. Player can clear the workspace at any time

### Element System

**4 Starting Elements:** Water 💧, Fire 🔥, Earth 🌍, Air 💨

**Element Categories (with emoji icons):**
- 🌍 **Basic** — The 4 starter elements
- 🔬 **Science** — Energy, Electricity, Pressure, etc.
- 🌿 **Nature** — Plant, Tree, Forest, Flower, etc.
- 🐾 **Animals** — Egg, Lizard, Bird, Fish, etc.
- 👤 **Human** — Human, Farmer, Doctor, etc.
- 🏗️ **Materials** — Brick, Glass, Metal, Paper, etc.
- 🍕 **Food** — Bread, Dough, Cheese, etc.
- 🌦️ **Weather** — Rain, Storm, Snow, Cloud, etc.
- 🏠 **Civilization** — House, City, Village, etc.
- 🔮 **Mythology** — Dragon, Phoenix, Unicorn, etc.
- 🚀 **Technology** — Computer, Internet, Robot, etc.
- 🌌 **Space** — Star, Planet, Galaxy, etc.
- ⚗️ **Alchemy** — Philosopher's Stone, Elixir, etc.

### COMPLETE ELEMENT & RECIPE DATABASE

**CRITICAL: You MUST implement ALL of the following elements and recipes. This is the core content of the game. Do NOT skip, abbreviate, or placeholder any of them.**

**TIER 1 — Base Combinations (from starter elements):**

| Element A | Element B | Result | Emoji |
|-----------|-----------|--------|-------|
| Water | Fire | Steam | ♨️ |
| Water | Earth | Mud | 🟤 |
| Water | Air | Mist | 🌫️ |
| Fire | Earth | Lava | 🌋 |
| Fire | Air | Energy | ⚡ |
| Earth | Air | Dust | 💨 |
| Water | Water | Puddle | 💧 |
| Fire | Fire | Plasma | 🔆 |
| Earth | Earth | Pressure | ⬇️ |
| Air | Air | Wind | 🌬️ |

**TIER 2 — Secondary Combinations:**

| Element A | Element B | Result | Emoji |
|-----------|-----------|--------|-------|
| Mud | Fire | Brick | 🧱 |
| Mud | Air | Dust | 💨 |
| Steam | Air | Cloud | ☁️ |
| Steam | Earth | Geyser | ⛲ |
| Lava | Water | Stone | 🪨 |
| Lava | Air | Rock | 🪨 |
| Energy | Air | Wind | 🌬️ |
| Energy | Earth | Earthquake | 🌍 |
| Energy | Water | Wave | 🌊 |
| Dust | Water | Mud | 🟤 |
| Puddle | Water | Pond | 🏊 |
| Pressure | Earth | Stone | 🪨 |
| Mist | Mist | Cloud | ☁️ |
| Wind | Wind | Tornado | 🌪️ |
| Plasma | Water | Steam | ♨️ |

**TIER 3 — Nature & Weather:**

| Element A | Element B | Result | Emoji |
|-----------|-----------|--------|-------|
| Cloud | Water | Rain | 🌧️ |
| Cloud | Cloud | Storm | ⛈️ |
| Cloud | Air | Sky | 🌤️ |
| Cloud | Fire | Lightning | ⚡ |
| Rain | Earth | Plant | 🌱 |
| Rain | Fire | Rainbow | 🌈 |
| Rain | Cold | Snow | ❄️ |
| Stone | Fire | Metal | ⚙️ |
| Stone | Stone | Wall | 🧱 |
| Stone | Air | Sand | 🏖️ |
| Stone | Water | Clay | 🏺 |
| Rock | Fire | Metal | ⚙️ |
| Pond | Water | Lake | 🏞️ |
| Pond | Plant | Swamp | 🌿 |
| Wind | Water | Wave | 🌊 |
| Wind | Earth | Sandstorm | 🌪️ |
| Wind | Fire | Smoke | 💨 |
| Tornado | Water | Hurricane | 🌀 |
| Wave | Wave | Ocean | 🌊 |
| Brick | Brick | Wall | 🧱 |
| Energy | Energy | Electricity | ⚡ |

**TIER 4 — Life & Biology:**

| Element A | Element B | Result | Emoji |
|-----------|-----------|--------|-------|
| Plant | Water | Algae | 🦠 |
| Plant | Earth | Grass | 🌿 |
| Plant | Fire | Tobacco | 🍂 |
| Plant | Plant | Garden | 🌻 |
| Plant | Time | Tree | 🌳 |
| Plant | Sand | Cactus | 🌵 |
| Plant | Cloud | Cotton | ☁️ |
| Tree | Tree | Forest | 🌲 |
| Tree | Fire | Charcoal | ⬛ |
| Tree | Wind | Leaf | 🍃 |
| Tree | Lumberjack | Wood | 🪵 |
| Algae | Time | Plant | 🌱 |
| Algae | Ocean | Seaweed | 🌿 |
| Grass | Fire | Hay | 🌾 |
| Garden | Flower | Bouquet | 💐 |
| Lake | Water | Sea | 🌊 |
| Sea | Sea | Ocean | 🌊 |
| Ocean | Earth | Island | 🏝️ |
| Ocean | Wind | Wave | 🌊 |
| Swamp | Energy | Life | 🧬 |
| Swamp | Lightning | Life | 🧬 |
| Life | Earth | Soil | 🌱 |
| Life | Water | Plankton | 🦠 |
| Life | Fire | Phoenix | 🔥 |
| Life | Clay | Human | 👤 |
| Life | Land | Animal | 🐾 |
| Life | Ocean | Fish | 🐟 |
| Life | Air | Bird | 🐦 |
| Sand | Fire | Glass | 🪟 |
| Sand | Sand | Desert | 🏜️ |
| Sand | Water | Quicksand | ⚠️ |
| Clay | Fire | Pottery | 🏺 |
| Clay | Human | Tool | 🔧 |
| Metal | Fire | Gold | 🥇 |
| Metal | Water | Rust | 🟤 |
| Metal | Electricity | Electromagnet | 🧲 |
| Metal | Human | Tool | 🔧 |
| Metal | Metal | Alloy | ⚙️ |
| Wall | Wall | House | 🏠 |
| Smoke | Smoke | Smog | 🌫️ |
| Snow | Snow | Blizzard | ❄️ |
| Snow | Earth | Snowman | ⛄ |
| Snow | Wind | Blizzard | ❄️ |

**TIER 5 — Civilization & Technology:**

| Element A | Element B | Result | Emoji |
|-----------|-----------|--------|-------|
| Human | Human | Love | ❤️ |
| Human | Tool | Engineer | 👷 |
| Human | Plant | Farmer | 👨‍🌾 |
| Human | Metal | Blacksmith | ⚒️ |
| Human | Ocean | Sailor | ⛵ |
| Human | Horse | Knight | 🏇 |
| Human | Sword | Warrior | ⚔️ |
| Human | Fire | Firefighter | 🧑‍🚒 |
| Human | Sickness | Doctor | 👨‍⚕️ |
| Human | Glasses | Nerd | 🤓 |
| Human | Dough | Baker | 🧑‍🍳 |
| Human | Wood | Lumberjack | 🪓 |
| Human | Music | Musician | 🎵 |
| Human | Paint | Artist | 🎨 |
| Human | Book | Librarian | 📚 |
| Human | Time | Corpse | 💀 |
| Human | Night | Sleep | 😴 |
| Love | Human | Family | 👪 |
| Love | Gold | Ring | 💍 |
| Love | Time | Memory | 🧠 |
| Family | House | Home | 🏡 |
| Family | Family | Village | 🏘️ |
| Village | Village | City | 🏙️ |
| City | City | Metropolis | 🌆 |
| House | Fire | Fireplace | 🔥 |
| House | Glass | Window | 🪟 |
| House | Plant | Greenhouse | 🌿 |
| House | Water | Aquarium | 🐠 |
| House | Book | Library | 📖 |
| Tool | Wood | Wheel | ☸️ |
| Tool | Stone | Axe | 🪓 |
| Tool | Metal | Sword | ⚔️ |
| Tool | Tree | Wood | 🪵 |
| Wheel | Wheel | Bicycle | 🚲 |
| Wheel | Metal | Car | 🚗 |
| Wheel | Engine | Car | 🚗 |
| Wood | Fire | Charcoal | ⬛ |
| Wood | Water | Boat | ⛵ |
| Wood | Tool | Plank | 🪵 |
| Wood | Blade | Paper | 📄 |
| Glass | Sand | Hourglass | ⏳ |
| Glass | Electricity | Light Bulb | 💡 |
| Glass | Metal | Glasses | 👓 |
| Paper | Fire | Ash | 🌫️ |
| Paper | Pencil | Letter | ✉️ |
| Paper | Paper | Book | 📕 |
| Paper | Human | Letter | ✉️ |
| Gold | Gold | Treasure | 💰 |
| Electricity | Glass | Light Bulb | 💡 |
| Electricity | Metal | Wire | 🔌 |
| Electricity | Water | Electrolysis | ⚗️ |
| Electricity | Wire | Internet | 🌐 |
| Electricity | Sand | Silicon | 💎 |
| Light Bulb | Light Bulb | Chandelier | 💡 |
| Wire | Wire | Net | 🕸️ |
| Silicon | Electricity | Computer | 💻 |
| Computer | Computer | Internet | 🌐 |
| Computer | Human | Programmer | 👨‍💻 |
| Computer | Letter | Email | 📧 |
| Internet | Human | Social Media | 📱 |
| Internet | Book | Wikipedia | 📚 |
| Charcoal | Paper | Drawing | 🎨 |
| Charcoal | Plant | Pencil | ✏️ |

**TIER 6 — Animals & Creatures:**

| Element A | Element B | Result | Emoji |
|-----------|-----------|--------|-------|
| Animal | Water | Fish | 🐟 |
| Animal | Air | Bird | 🐦 |
| Animal | Earth | Worm | 🪱 |
| Animal | Fire | Dragon | 🐉 |
| Animal | Plant | Bee | 🐝 |
| Animal | Desert | Camel | 🐪 |
| Animal | Ocean | Whale | 🐋 |
| Animal | Ice | Penguin | 🐧 |
| Animal | Night | Bat | 🦇 |
| Animal | Moon | Wolf | 🐺 |
| Animal | Human | Dog | 🐕 |
| Animal | Hay | Horse | 🐴 |
| Animal | Mouse | Cat | 🐈 |
| Animal | Grass | Cow | 🐄 |
| Animal | Mud | Pig | 🐷 |
| Animal | Thread | Spider | 🕷️ |
| Animal | Snow | Polar Bear | 🐻‍❄️ |
| Animal | Forest | Bear | 🐻 |
| Animal | Swamp | Frog | 🐸 |
| Animal | Sand | Scorpion | 🦂 |
| Animal | Tree | Monkey | 🐒 |
| Animal | Flower | Butterfly | 🦋 |
| Bird | Fire | Phoenix | 🔥 |
| Bird | Night | Owl | 🦉 |
| Bird | Ice | Penguin | 🐧 |
| Bird | Metal | Airplane | ✈️ |
| Bird | Letter | Pigeon | 🐦 |
| Fish | Fish | School | 🐟 |
| Fish | Human | Sushi | 🍣 |
| Fish | Electricity | Electric Eel | ⚡ |
| Dog | Wild | Wolf | 🐺 |
| Cat | Internet | Meme | 😂 |
| Egg | Fire | Omelette | 🍳 |
| Egg | Time | Bird | 🐦 |
| Egg | Sand | Turtle | 🐢 |
| Egg | Swamp | Lizard | 🦎 |
| Lizard | Fire | Dragon | 🐉 |
| Frog | Crown | Prince | 🤴 |
| Bee | Flower | Honey | 🍯 |
| Bee | House | Beehive | 🐝 |
| Butterfly | Flower | Garden | 🌻 |
| Worm | Earth | Compost | 🌱 |
| Horse | Unicorn | Pegasus | 🦄 |
| Horse | Knight | Cavalry | 🏇 |
| Whale | Sky | Flying Whale | 🐋 |
| Spider | Web | Trap | 🕸️ |

**TIER 7 — Food & Cooking:**

| Element A | Element B | Result | Emoji |
|-----------|-----------|--------|-------|
| Wheat | Stone | Flour | 🌾 |
| Flour | Water | Dough | 🫓 |
| Dough | Fire | Bread | 🍞 |
| Bread | Butter | Toast | 🍞 |
| Bread | Ham | Sandwich | 🥪 |
| Bread | Cheese | Grilled Cheese | 🧀 |
| Wheat | Water | Beer | 🍺 |
| Wheat | Farm | Hay | 🌾 |
| Milk | Fire | Cheese | 🧀 |
| Milk | Ice | Ice Cream | 🍦 |
| Milk | Chocolate | Hot Chocolate | ☕ |
| Cow | Human | Milk | 🥛 |
| Cow | Tool | Leather | 🟤 |
| Cow | Grass | Milk | 🥛 |
| Pig | Fire | Bacon | 🥓 |
| Pig | Smoke | Ham | 🍖 |
| Chicken | Fire | Roast Chicken | 🍗 |
| Chicken | Egg | Chicken | 🐔 |
| Fruit | Water | Juice | 🧃 |
| Fruit | Time | Alcohol | 🍷 |
| Fruit | Sugar | Jam | 🫙 |
| Sugar | Water | Syrup | 🍯 |
| Sugar | Fire | Caramel | 🍬 |
| Chocolate | Milk | Chocolate Milk | 🥛 |
| Chocolate | Bread | Chocolate Cake | 🍫 |
| Water | Fire | Steam | ♨️ |
| Coffee Bean | Water | Coffee | ☕ |
| Tea Leaf | Water | Tea | 🍵 |
| Honey | Water | Mead | 🍺 |
| Grape | Pressure | Wine | 🍷 |

**TIER 8 — Space & Cosmos:**

| Element A | Element B | Result | Emoji |
|-----------|-----------|--------|-------|
| Sky | Fire | Sun | ☀️ |
| Sky | Night | Moon | 🌙 |
| Sky | Stone | Meteor | ☄️ |
| Sky | Sky | Space | 🌌 |
| Sun | Water | Rainbow | 🌈 |
| Sun | Plant | Sunflower | 🌻 |
| Sun | Energy | Solar Cell | 🔋 |
| Sun | Moon | Eclipse | 🌑 |
| Moon | Wolf | Werewolf | 🐺 |
| Moon | Human | Astronaut | 👨‍🚀 |
| Moon | Ocean | Tide | 🌊 |
| Space | Stone | Asteroid | ☄️ |
| Space | Earth | Planet | 🪐 |
| Space | Fire | Star | ⭐ |
| Space | Human | Astronaut | 👨‍🚀 |
| Space | Glass | Telescope | 🔭 |
| Star | Star | Constellation | ✨ |
| Star | Night | Starlight | ✨ |
| Planet | Planet | Solar System | 🪐 |
| Planet | Life | Alien | 👽 |
| Solar System | Solar System | Galaxy | 🌌 |
| Galaxy | Galaxy | Universe | 🌌 |
| Meteor | Earth | Crater | 🕳️ |
| Meteor | Dinosaur | Extinction | 💀 |
| Asteroid | Earth | Crater | 🕳️ |
| Rocket | Space | Spaceship | 🚀 |
| Rocket | Moon | Moon Landing | 🌕 |

**TIER 9 — Mythology & Fantasy:**

| Element A | Element B | Result | Emoji |
|-----------|-----------|--------|-------|
| Dragon | Water | Sea Serpent | 🐍 |
| Dragon | Ice | Ice Dragon | 🐲 |
| Dragon | Knight | Legend | 📜 |
| Phoenix | Ash | Rebirth | 🔥 |
| Horse | Rainbow | Unicorn | 🦄 |
| Horse | Wing | Pegasus | 🦄 |
| Human | Moon | Werewolf | 🐺 |
| Human | Blood | Vampire | 🧛 |
| Human | Immortality | God | ⚡ |
| Corpse | Life | Zombie | 🧟 |
| Corpse | Electricity | Frankenstein | 🧟 |
| Ghost | House | Haunted House | 👻 |
| Skeleton | Life | Zombie | 🧟 |
| Knight | Dragon | Hero | 🦸 |
| Sword | Stone | Excalibur | ⚔️ |
| Ring | Volcano | One Ring | 💍 |
| Gold | Alchemy | Philosopher's Stone | 🔮 |
| Philosopher's Stone | Human | Immortality | ✨ |
| Human | Wing | Angel | 😇 |
| Angel | Evil | Demon | 😈 |
| God | Evil | Devil | 😈 |
| Fairy | Dust | Pixie Dust | ✨ |
| Mermaid | Land | Human | 👤 |
| Giant | Mountain | Titan | 🗿 |

**TIER 10 — Advanced & Abstract:**

| Element A | Element B | Result | Emoji |
|-----------|-----------|--------|-------|
| Hourglass | Life | Time | ⏰ |
| Time | Glass | Hourglass | ⏳ |
| Time | Plant | Tree | 🌳 |
| Time | Human | Corpse | 💀 |
| Time | Stone | Fossil | 🦴 |
| Time | Corpse | Skeleton | 💀 |
| Time | Corpse | Ghost | 👻 |
| Fossil | Life | Dinosaur | 🦕 |
| Dinosaur | Fire | Dragon | 🐉 |
| Skeleton | Armor | Knight | 🏇 |
| Day | Night | Twilight | 🌅 |
| Sun | Time | Day | ☀️ |
| Moon | Time | Night | 🌙 |
| Cold | Water | Ice | 🧊 |
| Cold | Rain | Snow | ❄️ |
| Cold | Steam | Water | 💧 |
| Ice | Fire | Water | 💧 |
| Ice | Ocean | Iceberg | 🧊 |
| Ice | Human | Eskimo | 🧥 |
| Volcano | Water | Island | 🏝️ |
| Volcano | Ocean | Island | 🏝️ |
| Earthquake | Ocean | Tsunami | 🌊 |
| Mountain | Mountain | Mountain Range | ⛰️ |
| Earth | Fire | Volcano | 🌋 |
| Lava | Cold | Rock | 🪨 |
| Land | Ocean | Continent | 🗺️ |
| Continent | Continent | Pangaea | 🌍 |
| Sound | Sound | Echo | 🔊 |
| Light | Glass | Prism | 🔮 |
| Rainbow | Gold | Leprechaun | 🍀 |
| Music | Human | Musician | 🎵 |
| Music | Paper | Sheet Music | 🎼 |
| Paint | Canvas | Painting | 🖼️ |
| Painting | Museum | Art | 🎨 |

**TIER 11 — Modern & Pop Culture:**

| Element A | Element B | Result | Emoji |
|-----------|-----------|--------|-------|
| Car | Car | Traffic | 🚗 |
| Car | Water | Submarine | 🚢 |
| Car | Air | Airplane | ✈️ |
| Airplane | Water | Seaplane | ✈️ |
| Boat | Steam | Steamship | 🚢 |
| Boat | Motor | Motorboat | 🚤 |
| Bicycle | Motor | Motorcycle | 🏍️ |
| Engine | Metal | Robot | 🤖 |
| Robot | Human | Cyborg | 🤖 |
| Robot | Robot | AI | 🧠 |
| AI | Human | Singularity | 🌀 |
| Internet | Meme | Viral | 📱 |
| Phone | Internet | Smartphone | 📱 |
| Camera | Phone | Selfie | 🤳 |
| Social Media | News | Fake News | 📰 |
| Money | Money | Bank | 🏦 |
| Bank | Internet | Cryptocurrency | 💰 |
| Electricity | Car | Electric Car | 🔋 |
| Solar Cell | Car | Solar Car | ☀️ |
| Rocket | Human | Astronaut | 👨‍🚀 |
| Metal | Rocket | Satellite | 📡 |
| Satellite | Sound | Radio | 📻 |
| Nuclear | Energy | Nuclear Power | ☢️ |
| Nuclear | Bomb | Nuclear Bomb | ☢️ |
| Atom | Atom | Molecule | ⚛️ |
| Molecule | Life | DNA | 🧬 |
| DNA | Time | Evolution | 🧬 |
| Evolution | Human | Superhuman | 🦸 |

**ADDITIONAL BRIDGE ELEMENTS (needed to connect recipe chains):**

| Element A | Element B | Result | Emoji |
|-----------|-----------|--------|-------|
| Air | Cold | Frost | ❄️ |
| Fire | Water | Steam | ♨️ |
| Earth | Water | Mud | 🟤 |
| Earth | Plant | Grass | 🌿 |
| Grass | Grass | Wheat | 🌾 |
| Plant | Sun | Sunflower | 🌻 |
| Plant | Pot | Houseplant | 🪴 |
| Flower | Water | Perfume | 🌸 |
| Flower | Bee | Honey | 🍯 |
| Sunflower | Bee | Sunflower Seed | 🌻 |
| Tree | Fruit | Fruit Tree | 🌳 |
| Seed | Earth | Plant | 🌱 |
| Plant | Fire | Smoke | 💨 |
| Leaf | Pile | Compost | 🌱 |
| Metal | Tool | Nail | 🔩 |
| Nail | Wood | Fence | 🏗️ |
| Wood | Wood | Plank | 🪵 |
| Plank | Nail | Furniture | 🪑 |
| Clay | Wheel | Pottery | 🏺 |
| Glass | Metal | Mirror | 🪞 |
| Mirror | Human | Reflection | 🪞 |
| Thread | Thread | Rope | 🧵 |
| Rope | Wood | Swing | 🎠 |
| Fabric | Human | Clothes | 👕 |
| Cotton | Tool | Thread | 🧵 |
| Thread | Tool | Fabric | 🧶 |
| Fabric | Rain | Umbrella | ☂️ |
| Leather | Blade | Shoe | 👟 |
| Paper | Ink | Newspaper | 📰 |
| Newspaper | Newspaper | Media | 📺 |
| Book | Fire | Knowledge | 📖 |
| Knowledge | Human | Wisdom | 🧠 |
| Wisdom | Book | Philosophy | 📚 |
| Light | Electricity | Neon | 💡 |
| Sound | Metal | Bell | 🔔 |
| Bell | Music | Jingle | 🎶 |
| String | Wood | Guitar | 🎸 |
| Air | Tool | Flute | 🎵 |
| Drum | Stick | Drumstick | 🥁 |
| Metal | String | Piano | 🎹 |
| Music | Electricity | Speakers | 🔊 |
| Paint | Human | Artist | 🎨 |
| Canvas | Wood | Easel | 🎨 |
| Ink | Feather | Quill | ✒️ |
| Cold | Fire | Smoke | 💨 |
| Steam | Pressure | Engine | ⚙️ |
| Engine | Wheel | Car | 🚗 |
| Engine | Bird | Airplane | ✈️ |
| Engine | Water | Steamship | 🚢 |
| Engine | Metal | Motor | ⚙️ |
| Motor | Air | Fan | 🌀 |
| Motor | Blade | Blender | 🫗 |
| Electricity | Engine | Motor | ⚙️ |
| Wire | Glass | Light Bulb | 💡 |
| Lens | Glass | Telescope | 🔭 |
| Lens | Light | Camera | 📷 |
| Glass | Glass | Lens | 🔍 |
| Metal | Gunpowder | Gun | 🔫 |
| Gunpowder | Fire | Explosion | 💥 |
| Charcoal | Mineral | Gunpowder | 💣 |
| Explosion | Metal | Shrapnel | 💥 |
| Explosion | Sky | Fireworks | 🎆 |
| Fire | Stone | Fireplace | 🔥 |
| Campfire | Story | Legend | 📜 |
| Wood | Fire | Campfire | 🔥 |
| Forest | Fire | Wildfire | 🔥 |
| Rain | Sun | Rainbow | 🌈 |
| Lightning | Sand | Fulgurite | ⚡ |
| Lightning | Metal | Electromagnet | 🧲 |
| Ocean | Sun | Salt | 🧂 |
| Salt | Water | Brine | 💧 |
| Mountain | Snow | Glacier | 🏔️ |
| Glacier | Ocean | Iceberg | 🧊 |
| Desert | Night | Oasis | 🏝️ |
| Island | Volcano | Hawaii | 🌺 |
| Continent | Ice | Antarctica | 🧊 |
| Earth | Pressure | Diamond | 💎 |
| Coal | Pressure | Diamond | 💎 |
| Diamond | Ring | Engagement Ring | 💍 |
| Gold | Crown | King | 👑 |
| King | Queen | Royal Family | 👑 |
| Crown | Human | King | 👑 |
| Crown | Woman | Queen | 👸 |
| Castle | King | Kingdom | 🏰 |
| Wall | House | Castle | 🏰 |
| Brick | Mud | Adobe | 🏠 |
| City | Wall | Fortress | 🏰 |
| Warrior | Warrior | Army | ⚔️ |
| Army | Castle | Siege | ⚔️ |
| Sword | Fire | Flaming Sword | 🔥 |
| Shield | Metal | Armor | 🛡️ |
| Money | Paper | Bill | 💵 |
| Money | Metal | Coin | 🪙 |
| Gold | Paper | Money | 💰 |
| Bank | Robber | Heist | 🏦 |
| Hospital | Human | Doctor | 👨‍⚕️ |
| Sickness | Water | Medicine | 💊 |
| Medicine | Human | Doctor | 👨‍⚕️ |
| Bacteria | Human | Sickness | 🤒 |
| Dust | Life | Bacteria | 🦠 |
| Mold | Bread | Penicillin | 💊 |
| Bacteria | Time | Mold | 🍄 |
| Atom | Energy | Nuclear | ☢️ |
| Pressure | Air | Atmosphere | 🌍 |
| Atmosphere | Water | Cloud | ☁️ |
| Ozone | Atmosphere | Ozone Layer | 🌍 |
| Oxygen | Electricity | Ozone | 🌐 |
| Water | Electricity | Hydrogen | 💧 |
| Water | Electricity | Oxygen | 💨 |
| Hydrogen | Fire | Explosion | 💥 |
| Hydrogen | Hydrogen | Helium | 🎈 |
| Helium | Balloon | Flying Balloon | 🎈 |
| Rubber | Air | Balloon | 🎈 |
| Oil | Fire | Gasoline | ⛽ |
| Gasoline | Engine | Car | 🚗 |
| Oil | Earth | Petroleum | 🛢️ |
| Petroleum | Pressure | Plastic | 🧴 |
| Plastic | Ocean | Pollution | 🌍 |
| Smoke | City | Smog | 🌫️ |
| Pollution | Earth | Wasteland | 🏚️ |
| Plant | Pollution | Dead Plant | 🥀 |
| Solar Cell | House | Solar House | ☀️ |
| Wind | Engine | Windmill | 🏗️ |
| Water | Engine | Watermill | 🏗️ |
| Farm | Animal | Livestock | 🐄 |
| Farm | Plant | Crop | 🌾 |
| Farm | House | Barn | 🏠 |
| Farmer | Earth | Farm | 🌾 |
| Field | Wheat | Farm | 🌾 |
| Earth | Tool | Field | 🌾 |
| Seed | Water | Sprout | 🌱 |
| Fruit | Tree | Orchard | 🌳 |
| Grape | Farm | Vineyard | 🍇 |
| Vine | Fruit | Grape | 🍇 |
| Plant | Fence | Vine | 🌿 |
| Water | Sugar | Lemonade | 🍋 |
| Lemon | Water | Lemonade | 🍋 |
| Fruit | Yellow | Lemon | 🍋 |
| Sun | Color | Yellow | 🟡 |
| Light | Prism | Color | 🌈 |
| Cocoa | Fire | Chocolate | 🍫 |
| Tropical | Seed | Cocoa | 🍫 |
| Island | Forest | Tropical | 🌴 |
| Coffee Bean | Farm | Coffee Plantation | ☕ |
| Tropical | Seed | Coffee Bean | ☕ |
| Tea Leaf | Plant | Tea Bush | 🍵 |
| Tea Bush | Water | Tea | 🍵 |
| Cow | Chicken | Egg | 🥚 |
| Bird | Bird | Egg | 🥚 |
| Chicken | Farm | Egg | 🥚 |
| Bird | Barn | Chicken | 🐔 |
| Pig | Farm | Bacon | 🥓 |
| Sheep | Tool | Wool | 🧶 |
| Wool | Tool | Yarn | 🧵 |
| Animal | Grass | Sheep | 🐑 |
| Dog | Snow | Husky | 🐕 |
| Dog | Wolf | Husky | 🐕 |
| Cat | Wild | Lion | 🦁 |
| Lion | Crown | King | 👑 |
| Monkey | Time | Human | 👤 |
| Monkey | Tool | Human | 👤 |
| Dinosaur | Time | Fossil | 🦴 |
| Fossil | Museum | Exhibit | 🏛️ |
| Art | House | Museum | 🏛️ |
| Painting | House | Gallery | 🖼️ |
| Story | Paper | Book | 📕 |
| Human | Story | Myth | 📜 |
| Night | Story | Fairy Tale | 🧚 |
| Fairy Tale | Human | Fairy | 🧚 |
| Fairy | Forest | Elf | 🧝 |
| Mountain | Giant | Troll | 🧌 |
| Swamp | Story | Ogre | 👹 |
| Ocean | Story | Mermaid | 🧜 |
| Sand | Story | Genie | 🧞 |
| Lamp | Genie | Wish | ⭐ |
| Metal | Light | Lamp | 🪔 |
| Wish | Evil | Curse | 🔮 |
| Night | Evil | Nightmare | 😱 |
| Sleep | Night | Dream | 💭 |
| Dream | Human | Imagination | 💡 |
| Imagination | Energy | Magic | 🔮 |
| Magic | Human | Wizard | 🧙 |
| Wizard | Tower | Mage Tower | 🗼 |
| Brick | Height | Tower | 🗼 |
| Magic | Potion | Elixir | ⚗️ |
| Water | Magic | Potion | 🧪 |
| Elixir | Human | Immortality | ✨ |
| Alchemy | Metal | Transmutation | ⚗️ |
| Fire | Philosophy | Alchemy | ⚗️ |
| Transmutation | Lead | Gold | 🥇 |
| Metal | Cheap | Lead | ⬛ |

### RECIPE DESIGN NOTES FOR THE AGENT

- Recipes are **bidirectional**: Water + Fire = Fire + Water = Steam
- Some results can be reached via **multiple recipes** (e.g., Dragon from Animal+Fire OR Lizard+Fire)
- The agent should ensure **all elements are discoverable** — trace from the 4 base elements through chains to verify reachability
- If a recipe references an element not yet defined, create a bridge recipe to make it reachable
- Target: **500-720+ unique elements** total. The tables above define the core set. The agent should add additional logical combinations to fill gaps and increase discovery depth
- **Every element should participate in at least 2 recipes** (as ingredient or result)

---

## UI/UX SPECIFICATION

### Layout (Desktop & Tablet)

```
┌──────────────────────────────────────────────────────────┐
│  🔮 ELEMENTAL FORGE          [🔍 Search] [📊 150/720]   │
├──────────────┬───────────────────────────────────────────┤
│              │                                           │
│  DISCOVERED  │           WORKSPACE                      │
│  ELEMENTS    │                                           │
│              │    Drag elements here to combine          │
│  ┌────────┐  │                                           │
│  │💧Water │  │         ┌────────┐                        │
│  │🔥Fire  │  │         │🔥Fire  │ ← dragged here        │
│  │🌍Earth │  │         └────────┘                        │
│  │💨Air   │  │              +                            │
│  │♨️Steam │  │         ┌────────┐                        │
│  │🟤Mud   │  │         │💧Water │ ← drag onto Fire      │
│  │...     │  │         └────────┘                        │
│  └────────┘  │                                           │
│              │                                           │
│  Categories: │    [🧹 Clear Workspace]                   │
│  [All][🌿]   │                                           │
│  [🐾][👤]   │                                           │
├──────────────┴───────────────────────────────────────────┤
│  💡 Hint: Try combining basic elements!                  │
└──────────────────────────────────────────────────────────┘
```

### Layout (Mobile / iPhone)

```
┌─────────────────────────┐
│ 🔮 ELEMENTAL FORGE      │
│ 📊 150/720              │
├─────────────────────────┤
│                         │
│      WORKSPACE          │
│   (top 60% of screen)   │
│                         │
│    ┌──────┐  ┌──────┐   │
│    │💧    │  │🔥    │   │
│    │Water │  │Fire  │   │
│    └──────┘  └──────┘   │
│         ↕ drag          │
│                         │
├─────────────────────────┤
│ [All][🌿][🐾][🔬][👤]  │ ← Category tabs (horizontal scroll)
├─────────────────────────┤
│ ┌─────┐┌─────┐┌─────┐  │
│ │💧   ││🔥   ││🌍   │  │ ← Scrollable element grid
│ │Water││Fire ││Earth│  │
│ └─────┘└─────┘└─────┘  │
│ ┌─────┐┌─────┐┌─────┐  │
│ │💨   ││♨️   ││🟤   │  │
│ │Air  ││Steam││Mud  │  │
│ └─────┘└─────┘└─────┘  │
└─────────────────────────┘
```

### Mobile Interaction Model (CRITICAL FOR iOS)

**Touch-based combining (NOT drag-and-drop on mobile):**

1. **Tap** an element in the bottom panel → it appears in the workspace
2. **Tap** a second element → it also appears in the workspace
3. **Tap** one workspace element, then **tap** another → combination attempt
4. OR: **Long-press + drag** an element from panel to workspace (advanced users)
5. OR: **Drag** workspace elements onto each other

**The mobile UI MUST:**
- Use `touch-action: manipulation` to prevent zoom/scroll conflicts
- Handle `touchstart`, `touchmove`, `touchend` events (not just mouse events)
- Prevent rubber-band scrolling in the workspace area
- Use `-webkit-overflow-scrolling: touch` for smooth scrolling in element panel
- Support safe area insets for iPhone notch/home indicator: `env(safe-area-inset-bottom)`
- Have minimum tap targets of 44×44px (Apple HIG)
- Show visual feedback (scale/glow) on tap
- NO hover-dependent interactions

### Visual Design

**Color Palette:**
- Background: `#1a1a2e` (deep navy)
- Workspace: `#16213e` (slightly lighter navy)
- Sidebar: `#0f3460` (medium blue)
- Element card: `#1a1a2e` with `border: 1px solid #e94560` glow
- Accent: `#e94560` (coral red)
- Secondary accent: `#533483` (purple)
- Text: `#eee`
- Success flash: `#00d2ff` (cyan)
- Discovered new: golden glow animation

**Element Cards:**
- Rounded rectangle (12px radius)
- Emoji icon (24px) + element name below
- Subtle gradient background based on category
- Hover/active: gentle scale(1.05) + glow
- Newly discovered: sparkle particle effect for 2 seconds

**Discovery Animation:**
1. Two combining elements slide together
2. Flash of light (radial gradient pulse, 300ms)
3. New element materializes with scale animation (0 → 1.1 → 1.0)
4. Particle burst (8-12 small circles flying outward)
5. Toast notification: "✨ Discovered: Steam!"
6. Element count updates with a counting animation
7. If the element is already discovered: subtle shake + "Already discovered" toast

**No-Match Animation:**
1. Elements bump together briefly
2. Red X flash between them (200ms)
3. Elements bounce back to original positions
4. Subtle screen shake (2px, 150ms)

### Responsive Breakpoints

```css
/* Mobile first */
@media (max-width: 767px) {
  /* Stack layout: workspace top, elements bottom */
  /* Grid of elements: 3 columns */
  /* Larger tap targets */
}
@media (min-width: 768px) and (max-width: 1023px) {
  /* Sidebar left (narrower), workspace right */
  /* Grid of elements: 3 columns in sidebar */
}
@media (min-width: 1024px) {
  /* Full desktop layout */
  /* Grid of elements: 3-4 columns in sidebar */
}
```

---

## Feature Specifications

### 1. Element Discovery & Progress

- **Progress bar** at top showing discovered/total elements
- **Category filters** in sidebar to browse by type
- **Search bar** to find discovered elements by name
- Elements show a "NEW" badge for 30 seconds after discovery
- **Statistics panel** (accessible via ⚙️ icon):
  - Total elements discovered
  - Percentage complete
  - Time played
  - Most recent discoveries (last 10)
  - Rarest category progress

### 2. Hint System

- **Free hint every 5 minutes** (timer shown)
- Hint button reveals one undiscovered combination using already-discovered elements
- Hint shows: "Try combining [Element A] + [Element B]" with pulsing highlight on those elements
- Hints prioritize combinations that unlock new chains (elements that enable the most new recipes)

### 3. Encyclopedia / Collection View

- Toggleable view showing ALL elements (discovered = full color, undiscovered = silhouette/locked icon)
- Discovered elements show:
  - Name, emoji, category
  - Recipe that created it
  - What it can be combined with (only showing discovered combinations)
  - Lore/description text (1-2 sentences per element)
- Undiscovered elements show: "???" with category icon only

### 4. Save System (localStorage)

```javascript
const saveData = {
  discoveredElements: ['water', 'fire', 'earth', 'air', 'steam', ...],
  workspaceElements: [{id: 'water', x: 150, y: 200}, ...],
  stats: {
    totalDiscovered: 15,
    timePlayed: 3600, // seconds
    hintsUsed: 3,
    lastPlayed: '2024-01-15T10:30:00Z',
    recentDiscoveries: ['steam', 'mud', 'lava']
  },
  settings: {
    soundEnabled: true,
    animationsEnabled: true,
    darkMode: true
  }
};
// Auto-save every 30 seconds + on every discovery
// Manual save/load with export/import JSON (for backup)
```

### 5. Sound Effects (Web Audio API — Optional but Preferred)

- **Combine success:** crystalline chime (synthesized)
- **Combine fail:** soft thud
- **New discovery:** ascending arpeggio
- **Element pickup:** soft pop
- **Element drop:** soft thud
- **Hint received:** gentle bell
- All sounds generated via Web Audio API (no external files needed)
- Mute toggle in settings

### 6. Achievements

Track and display achievements as toasts:
- "First Discovery" — Discover your first element
- "Chain Reaction" — Discover 5 elements in 2 minutes
- "Naturalist" — Discover all Nature elements
- "Mad Scientist" — Discover all Science elements
- "Full Bestiary" — Discover all Animal elements
- "Mythologist" — Discover all Mythology elements
- "Completionist" — Discover ALL elements
- "Speed Runner" — Discover 50 elements in 30 minutes
- "Persistent" — Play for over 2 hours total

---

## Technical Requirements

### Performance
- **First paint < 1 second** on Codespaces port forwarding
- **Smooth 60fps animations** on iPhone 12+
- Element search: instant filtering (no debounce needed for < 1000 elements)
- Lazy-render elements outside viewport in sidebar
- Use CSS transforms for animations (GPU-accelerated)
- Use `will-change: transform` sparingly on animated elements only

### Accessibility
- All interactive elements keyboard-navigable
- ARIA labels on element cards
- High contrast mode toggle
- Minimum font size 14px on mobile
- Focus indicators visible

### iOS-Specific Requirements
- `<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover">`
- `<meta name="apple-mobile-web-app-capable" content="yes">`
- `<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">`
- PWA manifest for "Add to Home Screen" support
- 180×180 apple-touch-icon (generated as inline SVG data URI or canvas)
- Service worker for offline play (cache the single HTML file)
- Handle iOS safe areas with `env(safe-area-inset-*)`
- Prevent pull-to-refresh: `overscroll-behavior: none`
- Prevent double-tap zoom: `touch-action: manipulation`
- `position: fixed` for workspace to prevent iOS keyboard issues

### GitHub Codespaces Compatibility
- Server binds to `0.0.0.0` (not localhost)
- Works with port forwarding (no absolute URLs)
- All assets inline or served from Express (no CDN dependencies)
- No WebSocket requirements (pure HTTP)

---

## What "DONE" Looks Like

The agent has succeeded when:

1. ✅ `npm install && npm start` works with zero errors
2. ✅ Opening the forwarded port shows the complete game UI
3. ✅ All 4 base elements are visible and draggable
4. ✅ Combining Water + Fire produces Steam with animation
5. ✅ At least 500 unique elements are discoverable through valid recipe chains
6. ✅ Every element is reachable from the 4 base elements (no orphans)
7. ✅ Search, filtering, and category tabs all work
8. ✅ Progress saves to localStorage and persists across refresh
9. ✅ Hint system provides valid, useful hints
10. ✅ Encyclopedia shows discovered vs undiscovered elements
11. ✅ Mobile layout works on iPhone Safari (test at 390×844 viewport)
12. ✅ Touch interactions work: tap-to-place and drag both function
13. ✅ Discovery animations play smoothly
14. ✅ No console errors, no broken layouts, no missing functionality
15. ✅ The game is genuinely FUN to play — the discovery loop is satisfying

---

## CRITICAL CONSTRAINTS

- **ZERO placeholder content.** Every element, every recipe, every UI component must be fully implemented.
- **ZERO external CDN dependencies.** Everything must be self-contained.
- **ZERO build steps.** `npm start` is the only command needed.
- **The single `index.html` file contains the COMPLETE game.** CSS and JS are inline.
- **All recipes must form connected chains back to the 4 base elements.** Run a reachability check.
- **Mobile-first design.** If it doesn't work on iPhone, it's not done.
- **Test every tier of combinations.** Don't just implement Tier 1 and skip the rest.

---

## AGENT EXECUTION ORDER

1. Create `package.json`
2. Create `server.js`
3. Build the complete element/recipe database as a JS object (verify all chains)
4. Build `public/index.html` with all CSS, JS, and game logic inline
5. Implement drag-and-drop (desktop) AND tap-to-combine (mobile)
6. Implement discovery animations and sound effects
7. Implement save/load system
8. Implement hint system
9. Implement encyclopedia view
10. Implement search and category filtering
11. Implement achievements
12. Test: verify `npm start` works, verify mobile layout, verify recipe chains
13. Fix any issues found in testing

**Total estimated lines of code: 4,000-8,000 in index.html**

**Do NOT split into multiple files. The entire game lives in ONE HTML file.**
