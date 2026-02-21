/**
 * Particle simulation for Alchemy sand-pouring game.
 * Uses object pooling with a fixed-size array for zero per-frame allocations.
 * Includes simple spatial hash for pile approximation.
 */
var AlchemyParticleSim = (function () {
  'use strict';

  // ===== Configuration / Tuning Knobs =====
  var DEFAULT_CONFIG = {
    MAX_PARTICLES: 8000,
    GRAVITY: 0.15,
    DAMPING: 0.97,
    FLOOR_DAMPING: 0.4,
    WALL_BOUNCE: 0.3,
    PARTICLE_RADIUS_MIN: 1.5,
    PARTICLE_RADIUS_MAX: 2.5,
    GRID_CELL_SIZE: 8,
    SEPARATION_FORCE: 0.3,
    MAX_NEIGHBORS_CHECK: 4,
    PILE_HEIGHT_DAMPING: 0.85
  };

  /**
   * Create a single particle object (pooled, reused).
   */
  function createParticle() {
    return {
      active: false,
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      radius: 2,
      materialId: '',
      color: '#ffffff',
      life: 0
    };
  }

  /**
   * ParticleSim - manages the particle pool and physics update.
   * @param {object} config - optional overrides for DEFAULT_CONFIG
   */
  function ParticleSim(config) {
    this.config = {};
    for (var k in DEFAULT_CONFIG) {
      this.config[k] = (config && config[k] !== undefined) ? config[k] : DEFAULT_CONFIG[k];
    }

    // Pre-allocate particle pool
    this.particles = new Array(this.config.MAX_PARTICLES);
    for (var i = 0; i < this.config.MAX_PARTICLES; i++) {
      this.particles[i] = createParticle();
    }
    this.activeCount = 0;

    // Arena bounds (set by renderer)
    this.arenaWidth = 800;
    this.arenaHeight = 600;

    // Spatial hash grid
    this._gridCols = 0;
    this._gridRows = 0;
    this._grid = null;
    this._gridCounts = null;
    this._rebuildGrid();
  }

  /**
   * Set arena dimensions.
   */
  ParticleSim.prototype.setArenaBounds = function (w, h) {
    this.arenaWidth = w;
    this.arenaHeight = h;
    this._rebuildGrid();
  };

  /**
   * Rebuild spatial hash grid arrays.
   */
  ParticleSim.prototype._rebuildGrid = function () {
    var cs = this.config.GRID_CELL_SIZE;
    this._gridCols = Math.ceil(this.arenaWidth / cs) + 1;
    this._gridRows = Math.ceil(this.arenaHeight / cs) + 1;
    var totalCells = this._gridCols * this._gridRows;
    // Each cell stores up to MAX_NEIGHBORS_CHECK indices
    var maxPerCell = this.config.MAX_NEIGHBORS_CHECK;
    this._grid = new Int32Array(totalCells * maxPerCell);
    this._gridCounts = new Int32Array(totalCells);
  };

  /**
   * Spawn a particle at position (x, y) with the given material.
   * @returns {boolean} true if spawned, false if pool exhausted
   */
  ParticleSim.prototype.spawn = function (x, y, vx, vy, materialId, color, radius) {
    // Find an inactive particle
    for (var i = 0; i < this.config.MAX_PARTICLES; i++) {
      var p = this.particles[i];
      if (!p.active) {
        p.active = true;
        p.x = x;
        p.y = y;
        p.vx = vx || 0;
        p.vy = vy || 0;
        p.materialId = materialId;
        p.color = color || '#ffffff';
        p.radius = radius || (this.config.PARTICLE_RADIUS_MIN +
          Math.random() * (this.config.PARTICLE_RADIUS_MAX - this.config.PARTICLE_RADIUS_MIN));
        p.life = 0;
        this.activeCount++;
        return true;
      }
    }
    return false;
  };

  /**
   * Remove (deactivate) a specific particle by index.
   */
  ParticleSim.prototype.remove = function (index) {
    if (index >= 0 && index < this.config.MAX_PARTICLES && this.particles[index].active) {
      this.particles[index].active = false;
      this.activeCount--;
    }
  };

  /**
   * Remove all active particles.
   */
  ParticleSim.prototype.clearAll = function () {
    for (var i = 0; i < this.config.MAX_PARTICLES; i++) {
      this.particles[i].active = false;
    }
    this.activeCount = 0;
  };

  /**
   * Count particles by materialId inside a rectangular zone.
   * @returns {object} map of materialId -> count
   */
  ParticleSim.prototype.countInZone = function (zx, zy, zw, zh) {
    var counts = {};
    for (var i = 0; i < this.config.MAX_PARTICLES; i++) {
      var p = this.particles[i];
      if (!p.active) continue;
      if (p.x >= zx && p.x <= zx + zw && p.y >= zy && p.y <= zy + zh) {
        counts[p.materialId] = (counts[p.materialId] || 0) + 1;
      }
    }
    return counts;
  };

  /**
   * Remove up to `count` particles of a given materialId inside a zone.
   * @returns {number} actual number removed
   */
  ParticleSim.prototype.removeFromZone = function (materialId, count, zx, zy, zw, zh) {
    var removed = 0;
    for (var i = 0; i < this.config.MAX_PARTICLES && removed < count; i++) {
      var p = this.particles[i];
      if (!p.active || p.materialId !== materialId) continue;
      if (p.x >= zx && p.x <= zx + zw && p.y >= zy && p.y <= zy + zh) {
        p.active = false;
        this.activeCount--;
        removed++;
      }
    }
    return removed;
  };

  /**
   * Main physics update tick.
   * Call once per frame.
   */
  ParticleSim.prototype.update = function () {
    var cfg = this.config;
    var g = cfg.GRAVITY;
    var damp = cfg.DAMPING;
    var floorDamp = cfg.FLOOR_DAMPING;
    var wallBounce = cfg.WALL_BOUNCE;
    var w = this.arenaWidth;
    var h = this.arenaHeight;
    var cs = cfg.GRID_CELL_SIZE;
    var sepForce = cfg.SEPARATION_FORCE;
    var maxNC = cfg.MAX_NEIGHBORS_CHECK;
    var cols = this._gridCols;
    var grid = this._grid;
    var gridCounts = this._gridCounts;
    var particles = this.particles;
    var maxP = cfg.MAX_PARTICLES;

    // Clear grid
    for (var c = 0; c < gridCounts.length; c++) {
      gridCounts[c] = 0;
    }

    // Populate grid
    for (var i = 0; i < maxP; i++) {
      var p = particles[i];
      if (!p.active) continue;
      var col = (p.x / cs) | 0;
      var row = (p.y / cs) | 0;
      if (col < 0) col = 0;
      if (col >= cols) col = cols - 1;
      if (row < 0) row = 0;
      if (row >= this._gridRows) row = this._gridRows - 1;
      var cellIdx = row * cols + col;
      var cnt = gridCounts[cellIdx];
      if (cnt < maxNC) {
        grid[cellIdx * maxNC + cnt] = i;
        gridCounts[cellIdx] = cnt + 1;
      }
    }

    // Update particles
    for (var i = 0; i < maxP; i++) {
      var p = particles[i];
      if (!p.active) continue;

      // Gravity
      p.vy += g;

      // Spatial hash neighbor separation
      var col = (p.x / cs) | 0;
      var row = (p.y / cs) | 0;
      if (col < 0) col = 0;
      if (col >= cols) col = cols - 1;
      if (row < 0) row = 0;
      if (row >= this._gridRows) row = this._gridRows - 1;

      // Check 3x3 neighborhood
      for (var dr = -1; dr <= 1; dr++) {
        for (var dc = -1; dc <= 1; dc++) {
          var nr = row + dr;
          var nc = col + dc;
          if (nr < 0 || nr >= this._gridRows || nc < 0 || nc >= cols) continue;
          var nIdx = nr * cols + nc;
          var nCnt = gridCounts[nIdx];
          for (var n = 0; n < nCnt; n++) {
            var j = grid[nIdx * maxNC + n];
            if (j === i) continue;
            var q = particles[j];
            var dx = p.x - q.x;
            var dy = p.y - q.y;
            var dist2 = dx * dx + dy * dy;
            var minDist = p.radius + q.radius + 1;
            if (dist2 < minDist * minDist && dist2 > 0.01) {
              var dist = Math.sqrt(dist2);
              var overlap = minDist - dist;
              var nx = dx / dist;
              var ny = dy / dist;
              p.vx += nx * overlap * sepForce;
              p.vy += ny * overlap * sepForce;
            }
          }
        }
      }

      // Integrate
      p.x += p.vx;
      p.y += p.vy;

      // Floor collision
      var r = p.radius;
      if (p.y + r > h) {
        p.y = h - r;
        p.vy *= -floorDamp;
        p.vx *= damp;
        // Pile damping - reduce velocity near floor
        if (Math.abs(p.vy) < 0.5) p.vy = 0;
      }

      // Ceiling
      if (p.y - r < 0) {
        p.y = r;
        p.vy *= -floorDamp;
      }

      // Walls
      if (p.x - r < 0) {
        p.x = r;
        p.vx *= -wallBounce;
      }
      if (p.x + r > w) {
        p.x = w - r;
        p.vx *= -wallBounce;
      }

      // General damping
      p.vx *= damp;
      p.vy *= damp;

      p.life++;
    }
  };

  return { ParticleSim: ParticleSim, DEFAULT_CONFIG: DEFAULT_CONFIG };
})();

// Export for testing
if (typeof module !== 'undefined') {
  module.exports = AlchemyParticleSim;
}
