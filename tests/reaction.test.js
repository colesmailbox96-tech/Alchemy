/**
 * Tests for the Alchemy reaction engine.
 * Verifies particle consumption and recipe triggering logic.
 * Run with: node tests/reaction.test.js
 */
var assert = require('assert');
var { AlchemyGame } = require('../js/game.js');
var { STARTING_ELEMENTS, ELEMENTS, RECIPES } = require('../data/elements.js');
var AlchemyParticleSim = require('../js/particleSim.js');
var AlchemyReactionEngine = require('../js/reactionEngine.js');

// Mock localStorage
global.localStorage = {
  _data: {},
  getItem: function (key) { return this._data[key] || null; },
  setItem: function (key, val) { this._data[key] = String(val); },
  removeItem: function (key) { delete this._data[key]; },
  clear: function () { this._data = {}; }
};

var passed = 0;
var failed = 0;

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

console.log('Reaction Engine Tests');
console.log('=====================\n');

// --- ParticleSim Tests ---
console.log('ParticleSim:');

test('should spawn particles and track active count', function () {
  var sim = new AlchemyParticleSim.ParticleSim({ MAX_PARTICLES: 100 });
  sim.setArenaBounds(200, 200);

  assert.strictEqual(sim.activeCount, 0);
  sim.spawn(50, 50, 0, 0, 'water', '#0077ff');
  assert.strictEqual(sim.activeCount, 1);
  sim.spawn(60, 60, 0, 0, 'fire', '#ff4400');
  assert.strictEqual(sim.activeCount, 2);
});

test('should not exceed MAX_PARTICLES', function () {
  var sim = new AlchemyParticleSim.ParticleSim({ MAX_PARTICLES: 3 });
  sim.setArenaBounds(200, 200);

  assert.ok(sim.spawn(10, 10, 0, 0, 'water', '#0077ff'));
  assert.ok(sim.spawn(20, 20, 0, 0, 'water', '#0077ff'));
  assert.ok(sim.spawn(30, 30, 0, 0, 'water', '#0077ff'));
  assert.strictEqual(sim.spawn(40, 40, 0, 0, 'water', '#0077ff'), false);
  assert.strictEqual(sim.activeCount, 3);
});

test('should remove particles by index', function () {
  var sim = new AlchemyParticleSim.ParticleSim({ MAX_PARTICLES: 10 });
  sim.setArenaBounds(200, 200);

  sim.spawn(50, 50, 0, 0, 'water', '#0077ff');
  sim.spawn(60, 60, 0, 0, 'fire', '#ff4400');
  assert.strictEqual(sim.activeCount, 2);
  sim.remove(0);
  assert.strictEqual(sim.activeCount, 1);
});

test('should count particles in zone', function () {
  var sim = new AlchemyParticleSim.ParticleSim({ MAX_PARTICLES: 100 });
  sim.setArenaBounds(200, 200);

  // Spawn particles inside zone (50,50,100,100)
  for (var i = 0; i < 10; i++) {
    sim.spawn(60 + i, 60, 0, 0, 'water', '#0077ff');
  }
  for (var i = 0; i < 5; i++) {
    sim.spawn(70 + i, 70, 0, 0, 'fire', '#ff4400');
  }
  // Outside zone
  sim.spawn(10, 10, 0, 0, 'earth', '#885533');

  var counts = sim.countInZone(50, 50, 100, 100);
  assert.strictEqual(counts['water'], 10);
  assert.strictEqual(counts['fire'], 5);
  assert.strictEqual(counts['earth'], undefined);
});

test('should remove particles from zone', function () {
  var sim = new AlchemyParticleSim.ParticleSim({ MAX_PARTICLES: 100 });
  sim.setArenaBounds(200, 200);

  for (var i = 0; i < 10; i++) {
    sim.spawn(60 + i, 60, 0, 0, 'water', '#0077ff');
  }
  var removed = sim.removeFromZone('water', 3, 50, 50, 100, 100);
  assert.strictEqual(removed, 3);
  assert.strictEqual(sim.activeCount, 7);
});

test('should clear all particles', function () {
  var sim = new AlchemyParticleSim.ParticleSim({ MAX_PARTICLES: 100 });
  sim.setArenaBounds(200, 200);

  sim.spawn(50, 50, 0, 0, 'water', '#0077ff');
  sim.spawn(60, 60, 0, 0, 'fire', '#ff4400');
  sim.clearAll();
  assert.strictEqual(sim.activeCount, 0);
});

test('should update particle physics (gravity)', function () {
  var sim = new AlchemyParticleSim.ParticleSim({ MAX_PARTICLES: 10 });
  sim.setArenaBounds(200, 200);

  sim.spawn(100, 10, 0, 0, 'water', '#0077ff');
  var initialY = sim.particles[0].y;
  sim.update();
  assert.ok(sim.particles[0].y > initialY, 'particle should fall due to gravity');
});

// --- ReactionEngine Tests ---
console.log('\nReactionEngine:');

test('should trigger fire + water = steam reaction', function () {
  var game = new AlchemyGame(ELEMENTS, RECIPES, STARTING_ELEMENTS);
  var sim = new AlchemyParticleSim.ParticleSim({ MAX_PARTICLES: 200 });
  sim.setArenaBounds(200, 200);

  var engine = new AlchemyReactionEngine.ReactionEngine(game, sim, {
    threshold: 5,
    cooldownFrames: 10,
    checkInterval: 1
  });
  engine.setZone(0, 0, 200, 200);

  var reactions = [];
  engine.onReaction = function (resultId, isNew) {
    reactions.push({ resultId: resultId, isNew: isNew });
  };

  // Spawn enough of each material
  for (var i = 0; i < 10; i++) {
    sim.spawn(50 + i, 50, 0, 0, 'fire', '#ff4400');
    sim.spawn(100 + i, 50, 0, 0, 'water', '#0077ff');
  }

  // Run several update cycles
  for (var f = 0; f < 10; f++) {
    engine.update();
  }

  assert.strictEqual(reactions.length, 1, 'should trigger exactly 1 reaction');
  assert.strictEqual(reactions[0].resultId, 'steam');
  assert.strictEqual(reactions[0].isNew, true);
});

test('should consume particles on reaction', function () {
  var game = new AlchemyGame(ELEMENTS, RECIPES, STARTING_ELEMENTS);
  var sim = new AlchemyParticleSim.ParticleSim({ MAX_PARTICLES: 200 });
  sim.setArenaBounds(200, 200);

  var engine = new AlchemyReactionEngine.ReactionEngine(game, sim, {
    threshold: 5,
    cooldownFrames: 10,
    checkInterval: 1
  });
  engine.setZone(0, 0, 200, 200);

  // Spawn exactly 5 of each
  for (var i = 0; i < 5; i++) {
    sim.spawn(50 + i, 50, 0, 0, 'fire', '#ff4400');
    sim.spawn(100 + i, 50, 0, 0, 'water', '#0077ff');
  }

  assert.strictEqual(sim.activeCount, 10);
  engine.update();

  // After reaction: 5 fire + 5 water consumed = 0 remaining
  assert.strictEqual(sim.activeCount, 0);
});

test('should respect cooldown after reaction', function () {
  var game = new AlchemyGame(ELEMENTS, RECIPES, STARTING_ELEMENTS);
  var sim = new AlchemyParticleSim.ParticleSim({ MAX_PARTICLES: 500 });
  sim.setArenaBounds(200, 200);

  var engine = new AlchemyReactionEngine.ReactionEngine(game, sim, {
    threshold: 5,
    cooldownFrames: 100,
    checkInterval: 1
  });
  engine.setZone(0, 0, 200, 200);

  var reactionCount = 0;
  engine.onReaction = function () { reactionCount++; };

  // Spawn 10 earth + 10 water (earth+earth=pressure needs 10, earth+water=mud)
  for (var i = 0; i < 10; i++) {
    sim.spawn(50 + i, 50, 0, 0, 'earth', '#885533');
    sim.spawn(100 + i, 50, 0, 0, 'water', '#0077ff');
  }

  // First update triggers earth+water=mud, consumes 5 of each
  // Remaining: 5 earth, 5 water -> can trigger again but cooldown blocks it
  for (var f = 0; f < 10; f++) {
    engine.update();
  }

  assert.strictEqual(reactionCount, 1, 'should only trigger once during cooldown');
});

test('should not trigger when below threshold', function () {
  var game = new AlchemyGame(ELEMENTS, RECIPES, STARTING_ELEMENTS);
  var sim = new AlchemyParticleSim.ParticleSim({ MAX_PARTICLES: 100 });
  sim.setArenaBounds(200, 200);

  var engine = new AlchemyReactionEngine.ReactionEngine(game, sim, {
    threshold: 10,
    cooldownFrames: 10,
    checkInterval: 1
  });
  engine.setZone(0, 0, 200, 200);

  var reactionCount = 0;
  engine.onReaction = function () { reactionCount++; };

  // Only 5 of each (below threshold of 10)
  for (var i = 0; i < 5; i++) {
    sim.spawn(50 + i, 50, 0, 0, 'fire', '#ff4400');
    sim.spawn(100 + i, 50, 0, 0, 'water', '#0077ff');
  }

  for (var f = 0; f < 10; f++) {
    engine.update();
  }

  assert.strictEqual(reactionCount, 0, 'should not trigger below threshold');
});

test('should handle same-element combination (water + water = puddle)', function () {
  var game = new AlchemyGame(ELEMENTS, RECIPES, STARTING_ELEMENTS);
  var sim = new AlchemyParticleSim.ParticleSim({ MAX_PARTICLES: 200 });
  sim.setArenaBounds(200, 200);

  var engine = new AlchemyReactionEngine.ReactionEngine(game, sim, {
    threshold: 5,
    cooldownFrames: 10,
    checkInterval: 1
  });
  engine.setZone(0, 0, 200, 200);

  var reactions = [];
  engine.onReaction = function (resultId, isNew) {
    reactions.push({ resultId: resultId, isNew: isNew });
  };

  // Need 2x threshold (10) for same-element combo; only water, no other materials
  for (var i = 0; i < 12; i++) {
    sim.spawn(50 + i, 50, 0, 0, 'water', '#0077ff');
  }

  for (var f = 0; f < 10; f++) {
    engine.update();
  }

  assert.strictEqual(reactions.length, 1);
  assert.strictEqual(reactions[0].resultId, 'puddle');
  assert.strictEqual(reactions[0].isNew, true);
});

test('should trigger earth + water = mud reaction', function () {
  var game = new AlchemyGame(ELEMENTS, RECIPES, STARTING_ELEMENTS);
  var sim = new AlchemyParticleSim.ParticleSim({ MAX_PARTICLES: 200 });
  sim.setArenaBounds(200, 200);

  var engine = new AlchemyReactionEngine.ReactionEngine(game, sim, {
    threshold: 5,
    cooldownFrames: 10,
    checkInterval: 1
  });
  engine.setZone(0, 0, 200, 200);

  var reactions = [];
  engine.onReaction = function (resultId, isNew) {
    reactions.push({ resultId: resultId, isNew: isNew });
  };

  for (var i = 0; i < 8; i++) {
    sim.spawn(50 + i, 50, 0, 0, 'earth', '#885533');
    sim.spawn(100 + i, 50, 0, 0, 'water', '#0077ff');
  }

  for (var f = 0; f < 10; f++) {
    engine.update();
  }

  assert.strictEqual(reactions.length, 1);
  assert.strictEqual(reactions[0].resultId, 'mud');
});

test('should trigger earth + fire = lava reaction', function () {
  var game = new AlchemyGame(ELEMENTS, RECIPES, STARTING_ELEMENTS);
  var sim = new AlchemyParticleSim.ParticleSim({ MAX_PARTICLES: 200 });
  sim.setArenaBounds(200, 200);

  var engine = new AlchemyReactionEngine.ReactionEngine(game, sim, {
    threshold: 5,
    cooldownFrames: 10,
    checkInterval: 1
  });
  engine.setZone(0, 0, 200, 200);

  var reactions = [];
  engine.onReaction = function (resultId, isNew) {
    reactions.push({ resultId: resultId, isNew: isNew });
  };

  for (var i = 0; i < 8; i++) {
    sim.spawn(50 + i, 50, 0, 0, 'earth', '#885533');
    sim.spawn(100 + i, 50, 0, 0, 'fire', '#ff4400');
  }

  for (var f = 0; f < 10; f++) {
    engine.update();
  }

  assert.strictEqual(reactions.length, 1);
  assert.strictEqual(reactions[0].resultId, 'lava');
});

test('should trigger air + fire = smoke reaction', function () {
  var game = new AlchemyGame(ELEMENTS, RECIPES, STARTING_ELEMENTS);
  var sim = new AlchemyParticleSim.ParticleSim({ MAX_PARTICLES: 200 });
  sim.setArenaBounds(200, 200);

  var engine = new AlchemyReactionEngine.ReactionEngine(game, sim, {
    threshold: 5,
    cooldownFrames: 10,
    checkInterval: 1
  });
  engine.setZone(0, 0, 200, 200);

  var reactions = [];
  engine.onReaction = function (resultId, isNew) {
    reactions.push({ resultId: resultId, isNew: isNew });
  };

  for (var i = 0; i < 8; i++) {
    sim.spawn(50 + i, 50, 0, 0, 'air', '#ccddff');
    sim.spawn(100 + i, 50, 0, 0, 'fire', '#ff4400');
  }

  for (var f = 0; f < 10; f++) {
    engine.update();
  }

  assert.strictEqual(reactions.length, 1);
  assert.strictEqual(reactions[0].resultId, 'smoke');
});

test('should reset cooldowns', function () {
  var game = new AlchemyGame(ELEMENTS, RECIPES, STARTING_ELEMENTS);
  var sim = new AlchemyParticleSim.ParticleSim({ MAX_PARTICLES: 200 });
  sim.setArenaBounds(200, 200);

  var engine = new AlchemyReactionEngine.ReactionEngine(game, sim, {
    threshold: 5,
    cooldownFrames: 1000,
    checkInterval: 1
  });
  engine.setZone(0, 0, 200, 200);

  var reactionCount = 0;
  engine.onReaction = function () { reactionCount++; };

  // First reaction
  for (var i = 0; i < 10; i++) {
    sim.spawn(50 + i, 50, 0, 0, 'fire', '#ff4400');
    sim.spawn(100 + i, 50, 0, 0, 'water', '#0077ff');
  }
  engine.update();
  assert.strictEqual(reactionCount, 1);

  // Reset and try again
  engine.reset();
  for (var i = 0; i < 10; i++) {
    sim.spawn(50 + i, 80, 0, 0, 'fire', '#ff4400');
    sim.spawn(100 + i, 80, 0, 0, 'water', '#0077ff');
  }
  engine.update();
  assert.strictEqual(reactionCount, 2, 'should trigger after cooldown reset');
});

// --- Summary ---
console.log('\n=====================');
console.log('Results: ' + passed + ' passed, ' + failed + ' failed');
if (failed > 0) {
  process.exit(1);
} else {
  console.log('All tests passed! ✅');
}
