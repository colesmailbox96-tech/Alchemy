/**
 * UI controller for Alchemy game.
 * Handles drag-and-drop, sidebar rendering, and discovery animations.
 */
(function () {
  'use strict';

  // Initialize game
  const game = new AlchemyGame(ELEMENTS, RECIPES, STARTING_ELEMENTS);

  // DOM references
  const sidebar = document.getElementById('element-list');
  const workspace = document.getElementById('workspace-area');
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

  // State
  let draggedEl = null;
  let dragOffsetX = 0;
  let dragOffsetY = 0;
  let workspaceIdCounter = 0;

  // ===== Initialization =====
  function init() {
    totalCountEl.textContent = game.totalElements;
    updateDiscoveredCount();
    populateCategories();
    renderSidebar();
    setupEventListeners();
    showHintIfFirstVisit();
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
      card.setAttribute('data-element-id', id);
      card.draggable = true;
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
  }

  // ===== Workspace Element Creation =====
  function createWorkspaceElement(elementId, x, y) {
    const el = game.getElement(elementId);
    if (!el) return null;

    const div = document.createElement('div');
    div.className = 'workspace-element';
    div.setAttribute('data-element-id', elementId);
    div.setAttribute('data-workspace-id', ++workspaceIdCounter);
    div.style.left = x + 'px';
    div.style.top = y + 'px';
    div.innerHTML =
      '<span class="emoji">' + el.emoji + '</span>' +
      '<span class="name">' + escapeHtml(el.name) + '</span>' +
      '<button class="remove-btn" title="Remove">✕</button>';

    // Remove button
    div.querySelector('.remove-btn').addEventListener('click', function (e) {
      e.stopPropagation();
      div.remove();
    });

    workspace.appendChild(div);
    return div;
  }

  // ===== Drag & Drop from Sidebar =====
  function setupEventListeners() {
    // Sidebar drag start
    sidebar.addEventListener('dragstart', function (e) {
      var card = e.target.closest('.element-card');
      if (!card) return;
      e.dataTransfer.setData('text/plain', card.getAttribute('data-element-id'));
      e.dataTransfer.effectAllowed = 'copy';
    });

    // Workspace: allow drop
    workspace.addEventListener('dragover', function (e) {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'copy';
    });

    // Workspace: handle drop from sidebar
    workspace.addEventListener('drop', function (e) {
      e.preventDefault();
      var elementId = e.dataTransfer.getData('text/plain');
      if (!elementId || !game.getElement(elementId)) return;
      var rect = workspace.getBoundingClientRect();
      var x = e.clientX - rect.left - 40;
      var y = e.clientY - rect.top - 16;
      createWorkspaceElement(elementId, x, y);
    });

    // Workspace element dragging (pointer events)
    workspace.addEventListener('pointerdown', onWorkspacePointerDown);
    document.addEventListener('pointermove', onPointerMove);
    document.addEventListener('pointerup', onPointerUp);

    // Search
    searchInput.addEventListener('input', renderSidebar);

    // Category filter
    categorySelect.addEventListener('change', renderSidebar);

    // Clear workspace
    clearBtn.addEventListener('click', function () {
      workspace.innerHTML = '';
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
  }

  // ===== Workspace Element Dragging =====
  function onWorkspacePointerDown(e) {
    var el = e.target.closest('.workspace-element');
    if (!el || e.target.closest('.remove-btn')) return;

    draggedEl = el;
    draggedEl.classList.add('dragging');
    draggedEl.setPointerCapture(e.pointerId);

    var rect = el.getBoundingClientRect();
    dragOffsetX = e.clientX - rect.left;
    dragOffsetY = e.clientY - rect.top;

    // Bring to front
    draggedEl.style.zIndex = 1000;
  }

  function onPointerMove(e) {
    if (!draggedEl) return;

    var wsRect = workspace.getBoundingClientRect();
    var x = e.clientX - wsRect.left - dragOffsetX;
    var y = e.clientY - wsRect.top - dragOffsetY;

    // Clamp within workspace
    x = Math.max(0, Math.min(wsRect.width - draggedEl.offsetWidth, x));
    y = Math.max(0, Math.min(wsRect.height - draggedEl.offsetHeight, y));

    draggedEl.style.left = x + 'px';
    draggedEl.style.top = y + 'px';

    // Highlight potential merge target
    highlightOverlapping(draggedEl);
  }

  function onPointerUp(e) {
    if (!draggedEl) return;

    draggedEl.classList.remove('dragging');
    var target = findOverlapping(draggedEl);

    if (target) {
      target.classList.remove('highlight');
      tryCombine(draggedEl, target);
    }

    draggedEl.style.zIndex = '';
    draggedEl = null;
  }

  // ===== Overlap Detection =====
  function findOverlapping(el) {
    var rect1 = el.getBoundingClientRect();
    var children = workspace.querySelectorAll('.workspace-element');
    for (var i = 0; i < children.length; i++) {
      var child = children[i];
      if (child === el) continue;
      var rect2 = child.getBoundingClientRect();
      if (rectsOverlap(rect1, rect2)) {
        return child;
      }
    }
    return null;
  }

  function highlightOverlapping(el) {
    var children = workspace.querySelectorAll('.workspace-element');
    for (var i = 0; i < children.length; i++) {
      children[i].classList.remove('highlight');
    }
    var target = findOverlapping(el);
    if (target) {
      target.classList.add('highlight');
    }
  }

  function rectsOverlap(r1, r2) {
    return !(r1.right < r2.left || r1.left > r2.right || r1.bottom < r2.top || r1.top > r2.bottom);
  }

  // ===== Combination Logic =====
  function tryCombine(el1, el2) {
    var id1 = el1.getAttribute('data-element-id');
    var id2 = el2.getAttribute('data-element-id');
    var result = game.combine(id1, id2);

    if (result.result) {
      // Get position for new element (midpoint)
      var r1 = el1.getBoundingClientRect();
      var r2 = el2.getBoundingClientRect();
      var wsRect = workspace.getBoundingClientRect();
      var mx = ((r1.left + r2.left) / 2) - wsRect.left;
      var my = ((r1.top + r2.top) / 2) - wsRect.top;

      // Remove the two elements
      el1.remove();
      el2.remove();

      // Create result element
      createWorkspaceElement(result.result, mx, my);

      if (result.isNew) {
        showDiscovery(result.result);
        updateDiscoveredCount();
        renderSidebar();
      }
    }
    // If no recipe exists, elements just stay where they are
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
