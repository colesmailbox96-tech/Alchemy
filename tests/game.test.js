/**
 * Tests for the Alchemy game engine.
 * Run with: node tests/game.test.js
 */
const assert = require('assert');
const { AlchemyGame } = require('../js/game.js');
const { STARTING_ELEMENTS, ELEMENTS, RECIPES } = require('../data/elements.js');

// Mock localStorage for Node.js
global.localStorage = {
  _data: {},
  getItem(key) { return this._data[key] || null; },
  setItem(key, val) { this._data[key] = String(val); },
  removeItem(key) { delete this._data[key]; },
  clear() { this._data = {}; }
};

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    localStorage.clear();
    fn();
    passed++;
    console.log('  ✓ ' + name);
  } catch (e) {
    failed++;
    console.log('  ✗ ' + name);
    console.log('    ' + e.message);
  }
}

console.log('Game Engine Tests');
console.log('=================\n');

// --- Data Integrity Tests ---
console.log('Data Integrity:');

test('should have 4 starting elements', function () {
  assert.strictEqual(STARTING_ELEMENTS.length, 4);
  assert.deepStrictEqual(STARTING_ELEMENTS.sort(), ['air', 'earth', 'fire', 'water']);
});

test('should have at least 550 total elements', function () {
  const count = Object.keys(ELEMENTS).length;
  assert.ok(count >= 550, 'Expected >= 550 elements, got ' + count);
});

test('every element should have name, emoji, and category', function () {
  for (const [id, el] of Object.entries(ELEMENTS)) {
    assert.ok(el.name, id + ' missing name');
    assert.ok(el.emoji, id + ' missing emoji');
    assert.ok(el.category, id + ' missing category');
  }
});

test('every recipe should reference valid elements', function () {
  for (const r of RECIPES) {
    assert.ok(ELEMENTS[r.ingredients[0]], 'Unknown ingredient: ' + r.ingredients[0]);
    assert.ok(ELEMENTS[r.ingredients[1]], 'Unknown ingredient: ' + r.ingredients[1]);
    assert.ok(ELEMENTS[r.result], 'Unknown result: ' + r.result);
  }
});

test('recipe ingredients should be alphabetically sorted', function () {
  for (const r of RECIPES) {
    assert.ok(r.ingredients[0] <= r.ingredients[1],
      'Unsorted: ' + r.ingredients.join(', '));
  }
});

test('all elements should be reachable from starting elements', function () {
  const discovered = new Set(STARTING_ELEMENTS);
  let changed = true;
  while (changed) {
    changed = false;
    for (const r of RECIPES) {
      if (discovered.has(r.ingredients[0]) && discovered.has(r.ingredients[1]) && !discovered.has(r.result)) {
        discovered.add(r.result);
        changed = true;
      }
    }
  }
  const total = Object.keys(ELEMENTS).length;
  assert.strictEqual(discovered.size, total,
    'Only ' + discovered.size + ' of ' + total + ' elements reachable');
});

// --- Game Engine Tests ---
console.log('\nGame Engine:');

test('should initialize with starting elements discovered', function () {
  const game = new AlchemyGame(ELEMENTS, RECIPES, STARTING_ELEMENTS);
  assert.strictEqual(game.discoveredCount, 4);
  for (const id of STARTING_ELEMENTS) {
    assert.ok(game.isDiscovered(id));
  }
});

test('should return correct total element count', function () {
  const game = new AlchemyGame(ELEMENTS, RECIPES, STARTING_ELEMENTS);
  assert.strictEqual(game.totalElements, Object.keys(ELEMENTS).length);
});

test('should combine water + fire = steam', function () {
  const game = new AlchemyGame(ELEMENTS, RECIPES, STARTING_ELEMENTS);
  const result = game.combine('water', 'fire');
  assert.strictEqual(result.result, 'steam');
  assert.strictEqual(result.isNew, true);
});

test('should combine fire + water = steam (reversed order)', function () {
  const game = new AlchemyGame(ELEMENTS, RECIPES, STARTING_ELEMENTS);
  const result = game.combine('fire', 'water');
  assert.strictEqual(result.result, 'steam');
  assert.strictEqual(result.isNew, true);
});

test('should mark element as not new on second combination', function () {
  const game = new AlchemyGame(ELEMENTS, RECIPES, STARTING_ELEMENTS);
  game.combine('water', 'fire');
  const result = game.combine('water', 'fire');
  assert.strictEqual(result.result, 'steam');
  assert.strictEqual(result.isNew, false);
});

test('should return null result for invalid combination', function () {
  const game = new AlchemyGame(ELEMENTS, RECIPES, STARTING_ELEMENTS);
  const result = game.combine('nonexistent1', 'nonexistent2');
  assert.strictEqual(result.result, null);
  assert.strictEqual(result.isNew, false);
});

test('should combine earth + water = mud', function () {
  const game = new AlchemyGame(ELEMENTS, RECIPES, STARTING_ELEMENTS);
  const result = game.combine('earth', 'water');
  assert.strictEqual(result.result, 'mud');
  assert.strictEqual(result.isNew, true);
});

test('should track discovery count after combinations', function () {
  const game = new AlchemyGame(ELEMENTS, RECIPES, STARTING_ELEMENTS);
  assert.strictEqual(game.discoveredCount, 4);
  game.combine('water', 'fire'); // steam
  assert.strictEqual(game.discoveredCount, 5);
  game.combine('earth', 'water'); // mud
  assert.strictEqual(game.discoveredCount, 6);
});

test('getElement should return element info', function () {
  const game = new AlchemyGame(ELEMENTS, RECIPES, STARTING_ELEMENTS);
  const water = game.getElement('water');
  assert.strictEqual(water.name, 'Water');
  assert.ok(water.emoji);
  assert.strictEqual(water.category, 'basic');
});

test('getElement should return null for unknown element', function () {
  const game = new AlchemyGame(ELEMENTS, RECIPES, STARTING_ELEMENTS);
  assert.strictEqual(game.getElement('nonexistent'), null);
});

test('getDiscoveredElements should return sorted array', function () {
  const game = new AlchemyGame(ELEMENTS, RECIPES, STARTING_ELEMENTS);
  const discovered = game.getDiscoveredElements();
  assert.strictEqual(discovered.length, 4);
  for (let i = 1; i < discovered.length; i++) {
    const prev = game.getElement(discovered[i - 1]).name.toLowerCase();
    const curr = game.getElement(discovered[i]).name.toLowerCase();
    assert.ok(prev <= curr, prev + ' should come before ' + curr);
  }
});

test('getDiscoveredByCategory should filter correctly', function () {
  const game = new AlchemyGame(ELEMENTS, RECIPES, STARTING_ELEMENTS);
  const basic = game.getDiscoveredByCategory('basic');
  assert.strictEqual(basic.length, 4);
  const nature = game.getDiscoveredByCategory('nature');
  assert.strictEqual(nature.length, 0);
});

test('reset should restore starting state', function () {
  const game = new AlchemyGame(ELEMENTS, RECIPES, STARTING_ELEMENTS);
  game.combine('water', 'fire');
  game.combine('earth', 'water');
  assert.strictEqual(game.discoveredCount, 6);
  game.reset();
  assert.strictEqual(game.discoveredCount, 4);
});

test('should persist discoveries via localStorage', function () {
  const game1 = new AlchemyGame(ELEMENTS, RECIPES, STARTING_ELEMENTS);
  game1.combine('water', 'fire');
  assert.strictEqual(game1.discoveredCount, 5);

  const game2 = new AlchemyGame(ELEMENTS, RECIPES, STARTING_ELEMENTS);
  assert.strictEqual(game2.discoveredCount, 5);
  assert.ok(game2.isDiscovered('steam'));
});

// --- Summary ---
console.log('\n=================');
console.log('Results: ' + passed + ' passed, ' + failed + ' failed');
if (failed > 0) {
  process.exit(1);
} else {
  console.log('All tests passed! ✅');
}
