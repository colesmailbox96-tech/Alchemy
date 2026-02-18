/**
 * Physics simulation for Alchemy workspace elements.
 * Adds gravity, solid stacking (sand-like), and fluid spreading (water-like) behaviors.
 */
var AlchemyPhysics = (function () {
  'use strict';

  // Physics type classification based on element IDs
  var FLUID_IDS = new Set([
    'water', 'sea', 'ocean', 'puddle', 'river', 'lake', 'rain', 'dew',
    'flood', 'waterfall', 'wave', 'tide', 'spring', 'lava', 'mud', 'oil',
    'petroleum', 'acid', 'blood', 'milk', 'honey', 'mercury', 'quicksand',
    'swamp', 'marsh', 'bog', 'sleet', 'potion', 'ink', 'paint', 'juice',
    'soup', 'broth', 'tea', 'coffee', 'wine', 'beer', 'alcohol', 'sap',
    'syrup', 'magma', 'slime'
  ]);

  var GAS_IDS = new Set([
    'air', 'wind', 'cloud', 'fog', 'mist', 'steam', 'smoke', 'gas',
    'oxygen', 'nitrogen', 'hydrogen', 'helium', 'atmosphere', 'breeze',
    'vapor', 'haze', 'exhaust', 'fume', 'aroma', 'scent', 'smell'
  ]);

  // Categories that are typically abstract / non-physical
  var ABSTRACT_CATEGORIES = new Set([
    'concept', 'myth', 'space', 'human', 'life', 'animal'
  ]);

  /**
   * Determine the physics type for an element.
   * @param {string} id - Element ID
   * @param {object} elementData - Element data { name, emoji, category }
   * @returns {'solid'|'fluid'|'gas'|'none'}
   */
  function getPhysicsType(id, elementData) {
    if (!elementData) return 'none';
    if (FLUID_IDS.has(id)) return 'fluid';
    if (GAS_IDS.has(id)) return 'gas';
    if (ABSTRACT_CATEGORIES.has(elementData.category)) return 'none';
    // Weather elements float
    if (elementData.category === 'weather') return 'gas';
    // Materials, tools, plants, food, technology, science, place, nature (solids)
    return 'solid';
  }

  // Constants
  var GRAVITY = 1.8;
  var FLUID_SPREAD = 0.6;
  var GAS_RISE = -0.8;
  var TERMINAL_VELOCITY = 12;
  var DAMPING = 0.85;
  var GROUND_BOUNCE = 0.3;
  var SETTLE_THRESHOLD = 0.5;

  /**
   * Physics controller - manages physics simulation for workspace elements.
   * @param {HTMLElement} workspaceEl - The workspace-area element
   * @param {function} getElementData - Function to get element data by ID
   */
  function PhysicsController(workspaceEl, getElementData) {
    this.workspace = workspaceEl;
    this.getElementData = getElementData;
    this.bodies = new Map(); // workspaceId -> body state
    this.animFrameId = null;
    this.running = false;
  }

  PhysicsController.prototype.start = function () {
    if (this.running) return;
    this.running = true;
    this._tick = this._tick.bind(this);
    this.animFrameId = requestAnimationFrame(this._tick);
  };

  PhysicsController.prototype.stop = function () {
    this.running = false;
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
  };

  /**
   * Register a workspace element for physics simulation.
   * @param {HTMLElement} el - The workspace-element DOM node
   */
  PhysicsController.prototype.addBody = function (el) {
    var wsId = el.getAttribute('data-workspace-id');
    var elId = el.getAttribute('data-element-id');
    var data = this.getElementData(elId);
    var physType = getPhysicsType(elId, data);

    if (physType === 'none') return;

    var body = {
      el: el,
      type: physType,
      vy: 0,
      vx: 0,
      settled: false,
      dragging: false
    };

    // Add a CSS class for visual feedback
    el.classList.add('physics-' + physType);

    this.bodies.set(wsId, body);

    if (!this.running) this.start();
  };

  /**
   * Remove a workspace element from physics simulation.
   */
  PhysicsController.prototype.removeBody = function (el) {
    var wsId = el.getAttribute('data-workspace-id');
    this.bodies.delete(wsId);
    if (this.bodies.size === 0) this.stop();
  };

  /**
   * Mark a body as being dragged (pause its physics).
   */
  PhysicsController.prototype.setDragging = function (el, isDragging) {
    var wsId = el.getAttribute('data-workspace-id');
    var body = this.bodies.get(wsId);
    if (body) {
      body.dragging = isDragging;
      body.settled = false;
      body.vy = 0;
      body.vx = 0;
    }
  };

  /**
   * Clear all bodies (e.g., on workspace clear).
   */
  PhysicsController.prototype.clearAll = function () {
    this.bodies.clear();
    this.stop();
  };

  /**
   * Main physics tick.
   */
  PhysicsController.prototype._tick = function () {
    if (!this.running) return;

    var wsRect = this.workspace.getBoundingClientRect();
    var wsHeight = this.workspace.offsetHeight;
    var wsWidth = this.workspace.offsetWidth;
    var allSettled = true;

    var bodiesArr = Array.from(this.bodies.values());

    for (var i = 0; i < bodiesArr.length; i++) {
      var body = bodiesArr[i];
      if (body.dragging || body.settled) continue;

      allSettled = false;

      var el = body.el;
      var x = parseFloat(el.style.left) || 0;
      var y = parseFloat(el.style.top) || 0;
      var w = el.offsetWidth;
      var h = el.offsetHeight;

      // Apply physics based on type
      if (body.type === 'solid') {
        // Gravity - falls down like sand pixels
        body.vy += GRAVITY;
        body.vy = Math.min(body.vy, TERMINAL_VELOCITY);
      } else if (body.type === 'fluid') {
        // Gravity + lateral spread
        body.vy += GRAVITY * 0.8;
        body.vy = Math.min(body.vy, TERMINAL_VELOCITY * 0.7);
        // Random lateral spread
        body.vx += (Math.random() - 0.5) * FLUID_SPREAD;
        body.vx *= DAMPING;
      } else if (body.type === 'gas') {
        // Float upward
        body.vy += GAS_RISE;
        body.vy = Math.max(body.vy, -TERMINAL_VELOCITY * 0.4);
        // Drift sideways
        body.vx += (Math.random() - 0.5) * 0.5;
        body.vx *= DAMPING;
      }

      // Update position
      y += body.vy;
      x += body.vx;

      // Ground collision
      var maxY = wsHeight - h;
      var maxX = wsWidth - w;

      if (body.type === 'gas') {
        // Gas rises to top
        if (y <= 0) {
          y = 0;
          body.vy = 0;
          body.vx *= DAMPING;
          if (Math.abs(body.vx) < SETTLE_THRESHOLD) {
            body.settled = true;
          }
        }
        // Gas also settles if stuck below top
        if (y >= maxY) {
          y = maxY;
          body.vy *= -0.5;
        }
      } else {
        // Solid / fluid hits bottom
        if (y >= maxY) {
          y = maxY;
          body.vy *= -GROUND_BOUNCE;

          if (body.type === 'fluid') {
            // Fluid spreads on landing
            body.vx += (Math.random() - 0.5) * 2;
          }

          // Check if settled
          if (Math.abs(body.vy) < SETTLE_THRESHOLD) {
            body.vy = 0;
            if (body.type === 'solid' || Math.abs(body.vx) < SETTLE_THRESHOLD) {
              body.settled = true;
            }
          }
        }
      }

      // Clamp horizontal bounds
      if (x < 0) {
        x = 0;
        body.vx *= -0.5;
      }
      if (x > maxX) {
        x = maxX;
        body.vx *= -0.5;
      }

      // Stacking: check collisions with other settled bodies below
      for (var j = 0; j < bodiesArr.length; j++) {
        if (i === j) continue;
        var other = bodiesArr[j];
        if (!other.settled) continue;

        var otherEl = other.el;
        var ox = parseFloat(otherEl.style.left) || 0;
        var oy = parseFloat(otherEl.style.top) || 0;
        var ow = otherEl.offsetWidth;
        var oh = otherEl.offsetHeight;

        // Check if this body would overlap the other
        if (x + w > ox && x < ox + ow && y + h > oy && y < oy + oh) {
          if (body.vy > 0 && y + h - body.vy <= oy + 2) {
            // Land on top of other element
            y = oy - h;
            body.vy *= -GROUND_BOUNCE;

            if (body.type === 'fluid') {
              // Fluid slides off
              body.vx += (x + w / 2 > ox + ow / 2) ? 2 : -2;
            }

            if (Math.abs(body.vy) < SETTLE_THRESHOLD) {
              body.vy = 0;
              if (body.type === 'solid' || Math.abs(body.vx) < SETTLE_THRESHOLD) {
                body.settled = true;
              }
            }
          }
        }
      }

      el.style.left = Math.round(x) + 'px';
      el.style.top = Math.round(y) + 'px';
    }

    if (allSettled) {
      this.stop();
    } else {
      this.animFrameId = requestAnimationFrame(this._tick);
    }
  };

  return {
    PhysicsController: PhysicsController,
    getPhysicsType: getPhysicsType
  };
})();

// Export for testing
if (typeof module !== 'undefined') {
  module.exports = AlchemyPhysics;
}
