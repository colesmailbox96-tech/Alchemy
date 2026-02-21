/**
 * UI controller for Alchemy game.
 * Sand-pouring simulation: select material from sidebar, pour particles on canvas.
 * Reaction zone detects combinations and triggers recipe results.
 */
(function () {
  'use strict';

  // Initialize game
  const game = new AlchemyGame(ELEMENTS, RECIPES, STARTING_ELEMENTS);

  // DOM references
  const sidebar = document.getElementById('element-list');
  const workspace = document.getElementById('workspace-area');
  const sandCanvas = document.getElementById('sand-arena');
  const searchInput = document.getElementById('search-input');
  const categorySelect = document.getElementById('category-select');
  const discoveredCountEl = document.getElementById('discovered-count');
  const totalCountEl = document.getElementById('total-count');
  const clearBtn = document.getElementById('clear-btn');
  const discoveryPopup = document.getElementById('discovery-popup');
  const discoveryEmoji = document.getElementById('discovery-emoji');
  const discoveryName = document.getElementById('discovery-name');
  const hintOverlay = document.getElementById('hint-overlay');
  const hintClose = document.getElementById('hint-close');
  const progressBar = document.getElementById('progress-bar');
  const resetBtn = document.getElementById('reset-btn');
  const sidebarToggle = document.getElementById('sidebar-toggle');
  const sidebarEl = document.getElementById('sidebar');
  const togglePourBtn = document.getElementById('toggle-pour-btn');
  const debugBtn = document.getElementById('debug-btn');
  const selectedMaterialEl = document.getElementById('selected-material');
  const selectedEmojiEl = document.getElementById('selected-emoji');
  const selectedNameEl = document.getElementById('selected-name');

  // ===== Material Color Map =====
  // Map category -> particle color
  var CATEGORY_COLORS = {
    basic: '#7c5cfc',
    nature: '#22c55e',
    life: '#f472b6',
    animal: '#fb923c',
    plant: '#4ade80',
    human: '#e879f9',
    tool: '#94a3b8',
    material: '#a78bfa',
    food: '#fbbf24',
    weather: '#38bdf8',
    space: '#818cf8',
    myth: '#c084fc',
    science: '#2dd4bf',
    place: '#f97316',
    concept: '#f43f5e',
    technology: '#06b6d4'
  };

  // Override colors for the 4 starting elements for visual clarity
  var ELEMENT_COLORS = {
    water: '#2196f3',
    fire: '#ff5722',
    earth: '#8d6e63',
    air: '#b0bec5'
  };

  function getMaterialColor(elementId) {
    if (ELEMENT_COLORS[elementId]) return ELEMENT_COLORS[elementId];
    var el = game.getElement(elementId);
    if (el && CATEGORY_COLORS[el.category]) return CATEGORY_COLORS[el.category];
    return '#ffffff';
  }

  // ===== Sand Simulation State =====
  var sim = new AlchemyParticleSim.ParticleSim();
  var renderer = new AlchemyArenaRenderer.ArenaRenderer(sandCanvas);
  var input = new AlchemyInputController.InputController(sandCanvas, renderer);
  var reactionEngine = new AlchemyReactionEngine.ReactionEngine(game, sim);

  // Active material selection
  var activeMaterialId = null;
  var activeMaterialColor = '#ffffff';

  // Spawn rate & performance
  var SPAWN_RATE = 4; // particles per frame when pouring
  var SPAWN_SPREAD = 6; // random spread from spout position

  // FPS tracking
  var showDebug = false;
  var fpsFrames = 0;
  var fpsTime = 0;
  var currentFps = 60;
  var FPS_LOW_THRESHOLD = 30;
  var degradedMode = false;

  // Animation
  var animFrameId = null;

  // ===== Initialization =====
  function init() {
    totalCountEl.textContent = game.totalElements;
    updateDiscoveredCount();
    populateCategories();
    renderSidebar();
    setupEventListeners();
    showHintIfFirstVisit();
    initSandSim();
  }

  function initSandSim() {
    // Size canvas
    renderer.resize();
    sim.setArenaBounds(renderer.width, renderer.height);

    // Set up reaction zone (center-bottom of arena)
    var zoneW = renderer.width * 0.4;
    var zoneH = renderer.height * 0.3;
    var zoneX = (renderer.width - zoneW) / 2;
    var zoneY = renderer.height - zoneH - 4;
    reactionEngine.setZone(zoneX, zoneY, zoneW, zoneH);
    renderer.reactionZone = { x: zoneX, y: zoneY, w: zoneW, h: zoneH };

    // Reaction callback
    reactionEngine.onReaction = function (resultId, isNew) {
      if (isNew) {
        showDiscovery(resultId);
        updateDiscoveredCount();
        renderSidebar();
        highlightNewDiscovery(resultId);
      }
      // Spawn some result particles for visual flair
      var resultColor = getMaterialColor(resultId);
      var cx = renderer.width / 2;
      var cy = renderer.height * 0.7;
      for (var i = 0; i < 15; i++) {
        sim.spawn(
          cx + (Math.random() - 0.5) * 40,
          cy + (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 3,
          -Math.random() * 2,
          resultId,
          resultColor
        );
      }
    };

    // Select first starting element by default
    selectMaterial('water');

    // Start animation loop
    startLoop();
  }

  function startLoop() {
    fpsTime = performance.now();
    animFrameId = requestAnimationFrame(tick);
  }

  // ===== Main Animation Loop =====
  function tick(now) {
    animFrameId = requestAnimationFrame(tick);

    // FPS tracking
    fpsFrames++;
    var elapsed = now - fpsTime;
    if (elapsed >= 1000) {
      currentFps = Math.round(fpsFrames * 1000 / elapsed);
      fpsFrames = 0;
      fpsTime = now;

      // Adaptive quality: degrade if FPS is low
      if (currentFps < FPS_LOW_THRESHOLD && !degradedMode) {
        degradedMode = true;
        SPAWN_RATE = 2;
      } else if (currentFps >= 50 && degradedMode) {
        degradedMode = false;
        SPAWN_RATE = 4;
      }
    }

    // Spawn particles if pouring
    if (input.isPouring && activeMaterialId) {
      var rate = degradedMode ? 2 : SPAWN_RATE;
      for (var i = 0; i < rate; i++) {
        sim.spawn(
          input.spoutX + (Math.random() - 0.5) * SPAWN_SPREAD,
          input.spoutY + (Math.random() - 0.5) * SPAWN_SPREAD,
          (Math.random() - 0.5) * 0.5,
          Math.random() * 1.5 + 0.5,
          activeMaterialId,
          activeMaterialColor
        );
      }
    }

    // Physics update
    sim.update();

    // Reaction check
    reactionEngine.update();

    // Render
    var spout = input.getSpoutState(activeMaterialColor);
    renderer.draw(sim, spout);

    // Debug overlay (drawn at low frequency to avoid DOM thrash)
    if (showDebug) {
      renderer.drawDebug(currentFps, sim.activeCount, sim.config.MAX_PARTICLES);
    }
  }

  // ===== Material Selection =====
  function selectMaterial(elementId) {
    activeMaterialId = elementId;
    activeMaterialColor = getMaterialColor(elementId);

    var el = game.getElement(elementId);
    if (el) {
      selectedEmojiEl.textContent = el.emoji;
      selectedNameEl.textContent = el.name;
      selectedMaterialEl.classList.remove('hidden');
    }

    // Update sidebar highlight
    var cards = sidebar.querySelectorAll('.element-card');
    for (var i = 0; i < cards.length; i++) {
      cards[i].classList.toggle('selected',
        cards[i].getAttribute('data-element-id') === elementId);
    }
  }

  function showHintIfFirstVisit() {
    if (!localStorage.getItem('alchemy-hint-seen')) {
      hintOverlay.classList.remove('hidden');
    }
  }

  // ===== Sidebar Rendering =====
  function renderSidebar() {
    const query = searchInput.value.toLowerCase().trim();
    const category = categorySelect.value;
    let elements = game.getDiscoveredByCategory(category);

    if (query) {
      elements = elements.filter(function (id) {
        return game.getElement(id).name.toLowerCase().includes(query);
      });
    }

    sidebar.innerHTML = '';
    for (const id of elements) {
      const el = game.getElement(id);
      const card = document.createElement('div');
      card.className = 'element-card';
      if (id === activeMaterialId) card.className += ' selected';
      card.setAttribute('data-element-id', id);
      card.setAttribute('data-category', el.category);
      card.innerHTML = '<span class="emoji">' + el.emoji + '</span><span class="name">' + escapeHtml(el.name) + '</span>';
      sidebar.appendChild(card);
    }
  }

  function populateCategories() {
    const categories = [
      'all', 'basic', 'nature', 'life', 'animal', 'plant', 'human',
      'tool', 'material', 'food', 'weather', 'space', 'myth',
      'science', 'place', 'concept', 'technology'
    ];
    categorySelect.innerHTML = '';
    for (const cat of categories) {
      const option = document.createElement('option');
      option.value = cat;
      option.textContent = cat === 'all' ? 'All Categories' : capitalize(cat);
      categorySelect.appendChild(option);
    }
  }

  function updateDiscoveredCount() {
    discoveredCountEl.textContent = game.discoveredCount;

    const total = game.totalElements;

    // Guard against invalid or zero total elements to avoid NaN/Infinity widths
    if (!Number.isFinite(total) || total <= 0) {
      progressBar.style.width = '0%';
      return;
    }

    let pct = (game.discoveredCount / total) * 100;

    // Handle any unexpected non-finite result
    if (!Number.isFinite(pct)) {
      pct = 0;
    }

    // Clamp percentage to [0, 100] to avoid layout issues
    pct = Math.max(0, Math.min(100, pct));
    progressBar.style.width = pct + '%';
  }

  // ===== Event Listeners =====
  function setupEventListeners() {
    // Sidebar: click to select material for pouring
    sidebar.addEventListener('click', function (e) {
      var card = e.target.closest('.element-card');
      if (!card) return;
      var elementId = card.getAttribute('data-element-id');
      if (!elementId || !game.getElement(elementId)) return;
      selectMaterial(elementId);
    });

    // Search
    searchInput.addEventListener('input', renderSidebar);

    // Category filter
    categorySelect.addEventListener('change', renderSidebar);

    // Clear workspace (clear all particles)
    clearBtn.addEventListener('click', function () {
      sim.clearAll();
      reactionEngine.reset();
    });

    // Reset game
    resetBtn.addEventListener('click', function () {
      if (confirm('Reset all progress? This will remove all discovered elements.')) {
        game.reset();
        sim.clearAll();
        reactionEngine.reset();
        updateDiscoveredCount();
        renderSidebar();
        selectMaterial('water');
      }
    });

    // Toggle pour mode (tap-to-toggle)
    togglePourBtn.addEventListener('click', function () {
      input.toggleMode = !input.toggleMode;
      togglePourBtn.classList.toggle('active', input.toggleMode);
      if (!input.toggleMode) {
        input.isPouring = false;
      }
    });

    // Debug toggle
    debugBtn.addEventListener('click', function () {
      showDebug = !showDebug;
      debugBtn.classList.toggle('active', showDebug);
    });

    // Discovery popup dismiss
    discoveryPopup.addEventListener('click', function () {
      discoveryPopup.classList.add('hidden');
    });

    // Hint close
    hintClose.addEventListener('click', function () {
      hintOverlay.classList.add('hidden');
      localStorage.setItem('alchemy-hint-seen', '1');
    });

    // Sidebar toggle for mobile
    sidebarToggle.addEventListener('click', function () {
      sidebarEl.classList.toggle('collapsed');
    });

    // Window resize
    window.addEventListener('resize', function () {
      renderer.resize();
      sim.setArenaBounds(renderer.width, renderer.height);
      // Update reaction zone
      var zoneW = renderer.width * 0.4;
      var zoneH = renderer.height * 0.3;
      var zoneX = (renderer.width - zoneW) / 2;
      var zoneY = renderer.height - zoneH - 4;
      reactionEngine.setZone(zoneX, zoneY, zoneW, zoneH);
      renderer.reactionZone = { x: zoneX, y: zoneY, w: zoneW, h: zoneH };
    });
  }

  // ===== Discovery Popup =====
  function showDiscovery(elementId) {
    var el = game.getElement(elementId);
    discoveryEmoji.textContent = el.emoji;
    discoveryName.textContent = el.name;
    discoveryPopup.classList.remove('hidden');

    // Auto-dismiss after 1.5s
    setTimeout(function () {
      discoveryPopup.classList.add('hidden');
    }, 1500);
  }

  function highlightNewDiscovery(elementId) {
    var card = sidebar.querySelector('.element-card[data-element-id="' + elementId + '"]');
    if (card) {
      card.classList.add('new-discovery');
    }
  }

  // ===== Utilities =====
  function escapeHtml(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  // Start
  init();
})();

