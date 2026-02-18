/**
 * Tests for the Alchemy physics engine.
 * Run with: node tests/physics.test.js
 */
const assert = require('assert');
const AlchemyPhysics = require('../js/physics.js');

const { getPhysicsType } = AlchemyPhysics;

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    passed++;
    console.log('  ✓ ' + name);
  } catch (e) {
    failed++;
    console.log('  ✗ ' + name);
    console.log('    ' + e.message);
  }
}

console.log('Physics Engine Tests');
console.log('====================\n');

// --- Physics Type Classification ---
console.log('Physics Type Classification:');

test('water should be classified as fluid', function () {
  assert.strictEqual(getPhysicsType('water', { name: 'Water', emoji: '💧', category: 'basic' }), 'fluid');
});

test('lava should be classified as fluid', function () {
  assert.strictEqual(getPhysicsType('lava', { name: 'Lava', emoji: '🌋', category: 'nature' }), 'fluid');
});

test('mud should be classified as fluid', function () {
  assert.strictEqual(getPhysicsType('mud', { name: 'Mud', emoji: '🟤', category: 'nature' }), 'fluid');
});

test('oil should be classified as fluid', function () {
  assert.strictEqual(getPhysicsType('oil', { name: 'Oil', emoji: '🛢️', category: 'material' }), 'fluid');
});

test('rain should be classified as fluid', function () {
  assert.strictEqual(getPhysicsType('rain', { name: 'Rain', emoji: '🌧️', category: 'weather' }), 'fluid');
});

test('air should be classified as gas', function () {
  assert.strictEqual(getPhysicsType('air', { name: 'Air', emoji: '💨', category: 'basic' }), 'gas');
});

test('steam should be classified as gas', function () {
  assert.strictEqual(getPhysicsType('steam', { name: 'Steam', emoji: '♨️', category: 'nature' }), 'gas');
});

test('smoke should be classified as gas', function () {
  assert.strictEqual(getPhysicsType('smoke', { name: 'Smoke', emoji: '💨', category: 'nature' }), 'gas');
});

test('cloud should be classified as gas', function () {
  assert.strictEqual(getPhysicsType('cloud', { name: 'Cloud', emoji: '☁️', category: 'weather' }), 'gas');
});

test('storm (weather category) should be classified as gas', function () {
  assert.strictEqual(getPhysicsType('storm', { name: 'Storm', emoji: '⛈️', category: 'weather' }), 'gas');
});

test('sand should be classified as solid', function () {
  assert.strictEqual(getPhysicsType('sand', { name: 'Sand', emoji: '🏖️', category: 'material' }), 'solid');
});

test('stone should be classified as solid', function () {
  assert.strictEqual(getPhysicsType('stone', { name: 'Stone', emoji: '🪨', category: 'material' }), 'solid');
});

test('brick should be classified as solid', function () {
  assert.strictEqual(getPhysicsType('brick', { name: 'Brick', emoji: '🧱', category: 'material' }), 'solid');
});

test('earth should be classified as solid', function () {
  assert.strictEqual(getPhysicsType('earth', { name: 'Earth', emoji: '🌍', category: 'basic' }), 'solid');
});

test('fire should be classified as solid (basic, not gas/fluid)', function () {
  assert.strictEqual(getPhysicsType('fire', { name: 'Fire', emoji: '🔥', category: 'basic' }), 'solid');
});

test('plant should be classified as solid', function () {
  assert.strictEqual(getPhysicsType('plant', { name: 'Plant', emoji: '🌱', category: 'plant' }), 'solid');
});

test('concept category should return none', function () {
  assert.strictEqual(getPhysicsType('time', { name: 'Time', emoji: '⏰', category: 'concept' }), 'none');
});

test('myth category should return none', function () {
  assert.strictEqual(getPhysicsType('dragon', { name: 'Dragon', emoji: '🐉', category: 'myth' }), 'none');
});

test('human category should return none', function () {
  assert.strictEqual(getPhysicsType('farmer', { name: 'Farmer', emoji: '👨‍🌾', category: 'human' }), 'none');
});

test('null element data should return none', function () {
  assert.strictEqual(getPhysicsType('nonexistent', null), 'none');
});

test('fluid IDs should override category-based classification', function () {
  // Rain is weather category but should be fluid, not gas
  assert.strictEqual(getPhysicsType('rain', { name: 'Rain', emoji: '🌧️', category: 'weather' }), 'fluid');
});

// --- Summary ---
console.log('\n====================');
console.log('Results: ' + passed + ' passed, ' + failed + ' failed');
if (failed > 0) {
  process.exit(1);
} else {
  console.log('All tests passed! ✅');
}
