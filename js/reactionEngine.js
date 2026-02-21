/**
 * Reaction engine for Alchemy sand simulation.
 * Checks particle counts in a reaction zone against the recipe book
 * and triggers combination results.
 */
var AlchemyReactionEngine = (function () {
  'use strict';

  // Minimum particle count per material to trigger a recipe
  var REACTION_THRESHOLD = 30;
  // Cooldown in frames (~60fps => 60 frames = 1 second)
  var COOLDOWN_FRAMES = 60;
  // Check every N frames to save CPU
  var CHECK_INTERVAL = 6;

  /**
   * ReactionEngine
   * @param {object} game - AlchemyGame instance (has combine(), getElement())
   * @param {object} sim - ParticleSim instance
   * @param {object} config - optional { threshold, cooldownFrames, checkInterval }
   */
  function ReactionEngine(game, sim, config) {
    this.game = game;
    this.sim = sim;

    this.threshold = (config && config.threshold) || REACTION_THRESHOLD;
    this.cooldownFrames = (config && config.cooldownFrames) || COOLDOWN_FRAMES;
    this.checkInterval = (config && config.checkInterval) || CHECK_INTERVAL;

    // Zone bounds (set externally)
    this.zone = { x: 0, y: 0, w: 0, h: 0 };

    // Cooldown tracking: "id1+id2" -> frames remaining
    this._cooldowns = {};
    this._frameCount = 0;

    // Callback for when a reaction triggers
    this.onReaction = null; // function(resultId, isNew)
  }

  /**
   * Set the reaction zone dimensions.
   */
  ReactionEngine.prototype.setZone = function (x, y, w, h) {
    this.zone.x = x;
    this.zone.y = y;
    this.zone.w = w;
    this.zone.h = h;
  };

  /**
   * Call every frame. Checks for reactions at the configured interval.
   */
  ReactionEngine.prototype.update = function () {
    this._frameCount++;

    // Decrement cooldowns
    for (var key in this._cooldowns) {
      this._cooldowns[key]--;
      if (this._cooldowns[key] <= 0) {
        delete this._cooldowns[key];
      }
    }

    // Only check on interval frames
    if (this._frameCount % this.checkInterval !== 0) return;

    // Count particles by material in the zone
    var z = this.zone;
    var counts = this.sim.countInZone(z.x, z.y, z.w, z.h);

    // Get all material IDs with enough particles
    var availableMaterials = [];
    for (var matId in counts) {
      if (counts[matId] >= this.threshold) {
        availableMaterials.push(matId);
      }
    }

    if (availableMaterials.length < 1) return;

    // Try cross-element pairs first (more intuitive for mixing)
    for (var i = 0; i < availableMaterials.length; i++) {
      for (var j = i + 1; j < availableMaterials.length; j++) {
        var id1 = availableMaterials[i];
        var id2 = availableMaterials[j];
        var sorted = [id1, id2].sort();
        var key = sorted[0] + '+' + sorted[1];
        if (this._cooldowns[key]) continue;

        var result = this.game.combine(id1, id2);
        if (result.result) {
          this.sim.removeFromZone(id1, this.threshold, z.x, z.y, z.w, z.h);
          this.sim.removeFromZone(id2, this.threshold, z.x, z.y, z.w, z.h);
          this._cooldowns[key] = this.cooldownFrames;
          if (this.onReaction) {
            this.onReaction(result.result, result.isNew);
          }
          return;
        }
      }
    }

    // Then try same-element combos (needs 2x threshold)
    for (var i = 0; i < availableMaterials.length; i++) {
      var id1 = availableMaterials[i];
      if (counts[id1] < this.threshold * 2) continue;
      var key = id1 + '+' + id1;
      if (this._cooldowns[key]) continue;

      var result = this.game.combine(id1, id1);
      if (result.result) {
        this.sim.removeFromZone(id1, this.threshold * 2, z.x, z.y, z.w, z.h);
        this._cooldowns[key] = this.cooldownFrames;
        if (this.onReaction) {
          this.onReaction(result.result, result.isNew);
        }
        return;
      }
    }
  };

  /**
   * Reset cooldowns (e.g., on clear).
   */
  ReactionEngine.prototype.reset = function () {
    this._cooldowns = {};
    this._frameCount = 0;
  };

  return {
    ReactionEngine: ReactionEngine,
    REACTION_THRESHOLD: REACTION_THRESHOLD,
    COOLDOWN_FRAMES: COOLDOWN_FRAMES,
    CHECK_INTERVAL: CHECK_INTERVAL
  };
})();

// Export for testing
if (typeof module !== 'undefined') {
  module.exports = AlchemyReactionEngine;
}
