/**
 * Arena renderer for Alchemy sand simulation.
 * Renders particles on a Canvas2D with resolution scaling for iOS performance.
 */
var AlchemyArenaRenderer = (function () {
  'use strict';

  /**
   * ArenaRenderer - manages the canvas and draws particles + reaction zone.
   * @param {HTMLCanvasElement} canvas
   * @param {object} options - { resolutionScale }
   */
  function ArenaRenderer(canvas, options) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.resolutionScale = (options && options.resolutionScale) ||
      Math.min(window.devicePixelRatio || 1, 1.5) * 0.65;

    // Internal resolution
    this.width = 0;
    this.height = 0;

    // Reaction zone (set externally)
    this.reactionZone = null; // { x, y, w, h }
  }

  /**
   * Resize canvas to match its CSS container.
   * Call on window resize.
   */
  ArenaRenderer.prototype.resize = function () {
    var rect = this.canvas.getBoundingClientRect();
    var cssW = rect.width;
    var cssH = rect.height;
    var scale = this.resolutionScale;

    this.width = Math.round(cssW * scale);
    this.height = Math.round(cssH * scale);

    this.canvas.width = this.width;
    this.canvas.height = this.height;

    // CSS size stays as-is; internal buffer is scaled
    this.canvas.style.width = cssW + 'px';
    this.canvas.style.height = cssH + 'px';
  };

  /**
   * Convert CSS coordinates to internal canvas coordinates.
   */
  ArenaRenderer.prototype.cssToCanvas = function (cssX, cssY) {
    var rect = this.canvas.getBoundingClientRect();
    return {
      x: (cssX - rect.left) * this.resolutionScale,
      y: (cssY - rect.top) * this.resolutionScale
    };
  };

  /**
   * Draw a frame: clear, draw reaction zone, draw particles, draw spout.
   * @param {object} sim - ParticleSim instance
   * @param {object} spout - { x, y, active, materialId, color } or null
   */
  ArenaRenderer.prototype.draw = function (sim, spout) {
    var ctx = this.ctx;
    var w = this.width;
    var h = this.height;

    // Clear
    ctx.clearRect(0, 0, w, h);

    // Draw reaction zone
    if (this.reactionZone) {
      var rz = this.reactionZone;
      ctx.save();
      ctx.strokeStyle = 'rgba(124, 92, 252, 0.35)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([6, 4]);
      ctx.strokeRect(rz.x, rz.y, rz.w, rz.h);
      ctx.fillStyle = 'rgba(124, 92, 252, 0.06)';
      ctx.fillRect(rz.x, rz.y, rz.w, rz.h);
      ctx.restore();

      // Label
      ctx.save();
      ctx.font = '10px system-ui, sans-serif';
      ctx.fillStyle = 'rgba(124, 92, 252, 0.5)';
      ctx.textAlign = 'center';
      ctx.fillText('⚗️ Reaction Zone', rz.x + rz.w / 2, rz.y - 4);
      ctx.restore();
    }

    // Draw particles (batched by color for performance)
    var particles = sim.particles;
    var maxP = sim.config.MAX_PARTICLES;

    // Group by color for fewer state changes
    var colorGroups = {};
    for (var i = 0; i < maxP; i++) {
      var p = particles[i];
      if (!p.active) continue;
      if (!colorGroups[p.color]) colorGroups[p.color] = [];
      colorGroups[p.color].push(p);
    }

    for (var color in colorGroups) {
      ctx.fillStyle = color;
      var group = colorGroups[color];
      ctx.beginPath();
      for (var j = 0; j < group.length; j++) {
        var pp = group[j];
        ctx.moveTo(pp.x + pp.radius, pp.y);
        ctx.arc(pp.x, pp.y, pp.radius, 0, Math.PI * 2);
      }
      ctx.fill();
    }

    // Draw spout indicator
    if (spout && spout.active) {
      ctx.save();
      ctx.strokeStyle = spout.color || '#ffffff';
      ctx.lineWidth = 2;
      ctx.globalAlpha = 0.6;
      ctx.beginPath();
      // Small funnel shape
      ctx.moveTo(spout.x - 6, spout.y - 12);
      ctx.lineTo(spout.x - 2, spout.y);
      ctx.lineTo(spout.x + 2, spout.y);
      ctx.lineTo(spout.x + 6, spout.y - 12);
      ctx.stroke();
      ctx.restore();
    } else if (spout) {
      // Show crosshair when not pouring
      ctx.save();
      ctx.strokeStyle = 'rgba(255,255,255,0.25)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(spout.x, spout.y, 5, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
  };

  /**
   * Draw debug info overlay.
   */
  ArenaRenderer.prototype.drawDebug = function (fps, particleCount, maxParticles) {
    var ctx = this.ctx;
    ctx.save();
    ctx.font = '10px monospace';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.textAlign = 'left';
    ctx.fillText('FPS: ' + fps + ' | Particles: ' + particleCount + '/' + maxParticles, 4, 12);
    ctx.restore();
  };

  return { ArenaRenderer: ArenaRenderer };
})();

// Export for testing
if (typeof module !== 'undefined') {
  module.exports = AlchemyArenaRenderer;
}
