/**
 * Game engine for Alchemy.
 * Manages element discovery, combination logic, and persistence.
 */
class AlchemyGame {
  constructor(elements, recipes, startingElements) {
    this.elements = elements;
    this.recipes = recipes;
    this.startingElements = startingElements;

    // Build lookup: "id1+id2" -> result id
    this.recipeLookup = new Map();
    for (const r of recipes) {
      const key = r.ingredients[0] + '+' + r.ingredients[1];
      this.recipeLookup.set(key, r.result);
    }

    // Load or initialize discovered elements
    this.discovered = new Set();
    this._load();
  }

  /** Total number of elements in the game */
  get totalElements() {
    return Object.keys(this.elements).length;
  }

  /** Number of discovered elements */
  get discoveredCount() {
    return this.discovered.size;
  }

  /** Get element info by ID */
  getElement(id) {
    return this.elements[id] || null;
  }

  /** Check if an element has been discovered */
  isDiscovered(id) {
    return this.discovered.has(id);
  }

  /** Get all discovered element IDs, sorted by name */
  getDiscoveredElements() {
    return Array.from(this.discovered).sort((a, b) => {
      const nameA = this.elements[a].name.toLowerCase();
      const nameB = this.elements[b].name.toLowerCase();
      return nameA.localeCompare(nameB);
    });
  }

  /** Get discovered elements filtered by category */
  getDiscoveredByCategory(category) {
    if (category === 'all') return this.getDiscoveredElements();
    return this.getDiscoveredElements().filter(id => this.elements[id].category === category);
  }

  /** Get all unique categories from discovered elements */
  getDiscoveredCategories() {
    const cats = new Set();
    for (const id of this.discovered) {
      cats.add(this.elements[id].category);
    }
    return Array.from(cats).sort();
  }

  /**
   * Try to combine two elements.
   * @param {string} id1 - First element ID
   * @param {string} id2 - Second element ID
   * @returns {{ result: string|null, isNew: boolean }}
   */
  combine(id1, id2) {
    // Sort alphabetically for consistent lookup
    const sorted = [id1, id2].sort();
    const key = sorted[0] + '+' + sorted[1];
    const resultId = this.recipeLookup.get(key);

    if (!resultId) {
      return { result: null, isNew: false };
    }

    const isNew = !this.discovered.has(resultId);
    if (isNew) {
      this.discovered.add(resultId);
      this._save();
    }

    return { result: resultId, isNew };
  }

  /** Reset the game to starting state */
  reset() {
    this.discovered = new Set(this.startingElements);
    this._save();
  }

  /** Save discovered elements to localStorage */
  _save() {
    try {
      localStorage.setItem('alchemy-discovered', JSON.stringify(Array.from(this.discovered)));
    } catch (e) {
      // localStorage may not be available
    }
  }

  /** Load discovered elements from localStorage */
  _load() {
    try {
      const saved = localStorage.getItem('alchemy-discovered');
      if (saved) {
        const arr = JSON.parse(saved);
        this.discovered = new Set(arr);
        // Ensure starting elements are always discovered
        for (const id of this.startingElements) {
          this.discovered.add(id);
        }
      } else {
        this.discovered = new Set(this.startingElements);
      }
    } catch (e) {
      this.discovered = new Set(this.startingElements);
    }
  }
}

// Export for testing
if (typeof module !== 'undefined') {
  module.exports = { AlchemyGame };
}
