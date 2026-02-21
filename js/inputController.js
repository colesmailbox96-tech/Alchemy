/**
 * Input controller for Alchemy sand pouring.
 * iOS-first pointer/touch controls:
 *  - Single finger: move spout position
 *  - Press-and-hold: pour particles
 *  - Tap-to-toggle: accessibility mode for pouring
 */
var AlchemyInputController = (function () {
  'use strict';

  /**
   * InputController
   * @param {HTMLCanvasElement} canvas - the arena canvas
   * @param {object} renderer - ArenaRenderer to convert coords
   */
  function InputController(canvas, renderer) {
    this.canvas = canvas;
    this.renderer = renderer;

    // Spout state
    this.spoutX = 0;
    this.spoutY = 0;
    this.isPouring = false;
    this.toggleMode = false; // tap-to-toggle pour

    // Pointer tracking
    this._pointerId = -1;
    this._pointerDown = false;

    // Bind handlers
    this._onPointerDown = this._onPointerDown.bind(this);
    this._onPointerMove = this._onPointerMove.bind(this);
    this._onPointerUp = this._onPointerUp.bind(this);
    this._onPointerCancel = this._onPointerCancel.bind(this);

    this._setupListeners();
  }

  InputController.prototype._setupListeners = function () {
    var canvas = this.canvas;
    canvas.addEventListener('pointerdown', this._onPointerDown, { passive: false });
    canvas.addEventListener('pointermove', this._onPointerMove, { passive: false });
    canvas.addEventListener('pointerup', this._onPointerUp, { passive: false });
    canvas.addEventListener('pointercancel', this._onPointerCancel, { passive: false });

    // Prevent default touch behaviors (scrolling, zooming) on canvas
    canvas.addEventListener('touchstart', function (e) { e.preventDefault(); }, { passive: false });
    canvas.addEventListener('touchmove', function (e) { e.preventDefault(); }, { passive: false });
  };

  InputController.prototype._onPointerDown = function (e) {
    // Only track single finger
    if (this._pointerId >= 0 && e.pointerId !== this._pointerId) return;
    e.preventDefault();
    this._pointerId = e.pointerId;
    this._pointerDown = true;

    var pos = this.renderer.cssToCanvas(e.clientX, e.clientY);
    this.spoutX = pos.x;
    this.spoutY = pos.y;

    if (this.toggleMode) {
      this.isPouring = !this.isPouring;
    } else {
      this.isPouring = true;
    }

    this.canvas.setPointerCapture(e.pointerId);
  };

  InputController.prototype._onPointerMove = function (e) {
    if (!this._pointerDown && !this.toggleMode) return;
    if (this._pointerId >= 0 && e.pointerId !== this._pointerId) return;
    e.preventDefault();

    var pos = this.renderer.cssToCanvas(e.clientX, e.clientY);
    this.spoutX = pos.x;
    this.spoutY = pos.y;
  };

  InputController.prototype._onPointerUp = function (e) {
    if (e.pointerId !== this._pointerId) return;
    this._pointerDown = false;
    this._pointerId = -1;

    if (!this.toggleMode) {
      this.isPouring = false;
    }
  };

  InputController.prototype._onPointerCancel = function (e) {
    if (e.pointerId !== this._pointerId) return;
    this._pointerDown = false;
    this._pointerId = -1;
    this.isPouring = false;
  };

  /**
   * Get current spout state for rendering.
   */
  InputController.prototype.getSpoutState = function (materialColor) {
    return {
      x: this.spoutX,
      y: this.spoutY,
      active: this.isPouring,
      color: materialColor || '#ffffff'
    };
  };

  /**
   * Clean up event listeners.
   */
  InputController.prototype.destroy = function () {
    this.canvas.removeEventListener('pointerdown', this._onPointerDown);
    this.canvas.removeEventListener('pointermove', this._onPointerMove);
    this.canvas.removeEventListener('pointerup', this._onPointerUp);
    this.canvas.removeEventListener('pointercancel', this._onPointerCancel);
  };

  return { InputController: InputController };
})();

// Export for testing
if (typeof module !== 'undefined') {
  module.exports = AlchemyInputController;
}
