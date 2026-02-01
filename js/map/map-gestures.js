(function () {
  const { qs, clamp, state, saveState, prefersReduced, events } = window.APP;

  let container, viewport;
  let minimap;
  let pointers = new Map();
  let pos = { x: 0, y: 0, scale: 1 };
  let velocity = { x: 0, y: 0 };
  let lastMove = 0;
  let inertiaId = null;
  let lastTap = 0;
  let isPanning = false;

  const contentSize = { w: 2000, h: 1000 };

  const init = () => {
    container = qs('#map-container');
    viewport = qs('#map-viewport');
    minimap = qs('#minimap-canvas');
    if (!container || !viewport) return;

    pos = { ...state.map };
    applyTransform();

    container.addEventListener('pointerdown', onPointerDown);
    container.addEventListener('pointermove', onPointerMove);
    container.addEventListener('pointerup', onPointerUp);
    container.addEventListener('pointercancel', onPointerUp);
    container.addEventListener('wheel', onWheel, { passive: false });
    container.addEventListener('dblclick', onDouble);
    if (minimap) minimap.addEventListener('click', onMinimapClick);

    window.addEventListener('resize', () => {
      clampToBounds();
      applyTransform();
    });
  };

  const onPointerDown = (e) => {
    if (e.target.closest('.pin') || e.target.closest('.map-minimap')) return;
    container.setPointerCapture(e.pointerId);
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    lastMove = performance.now();
    isPanning = true;
    stopInertia();
  };

  const onPointerMove = (e) => {
    if (!pointers.has(e.pointerId) || !isPanning) return;
    const prev = pointers.get(e.pointerId);
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pointers.size === 1) {
      const dx = e.clientX - prev.x;
      const dy = e.clientY - prev.y;
      pos.x += dx;
      pos.y += dy;
      velocity = { x: dx, y: dy };
      lastMove = performance.now();
      clampToBounds();
      applyTransform();
      window.APP.footprints.onMove(dx, dy, pos);
    } else if (pointers.size === 2) {
      const pts = Array.from(pointers.values());
      const a = pts[0], b = pts[1];
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      const prevPts = Array.from(pointers.keys()).map((id) => id === e.pointerId ? prev : pointers.get(id));
      const prevDist = Math.hypot(prevPts[0].x - prevPts[1].x, prevPts[0].y - prevPts[1].y);
      const delta = dist / prevDist;
      zoom(delta, (a.x + b.x) / 2, (a.y + b.y) / 2);
      applyTransform();
    }
  };

  const onPointerUp = (e) => {
    pointers.delete(e.pointerId);
    if (pointers.size === 0) {
      saveState();
      isPanning = false;
      if (e.pointerType === 'touch') {
        const t = performance.now();
        if (t - lastTap < 300) {
          zoom(1.2, e.clientX, e.clientY);
          applyTransform();
        }
        lastTap = t;
      }
      if (!prefersReduced) startInertia();
    }
  };

  const onWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 1.08 : 0.92;
    zoom(delta, e.clientX, e.clientY);
    applyTransform();
    saveState();
  };

  const onDouble = (e) => {
    zoom(1.2, e.clientX, e.clientY);
    applyTransform();
    saveState();
  };

  const zoom = (factor, cx, cy) => {
    const rect = container.getBoundingClientRect();
    const beforeX = (cx - rect.left - pos.x) / pos.scale;
    const beforeY = (cy - rect.top - pos.y) / pos.scale;
    pos.scale = clamp(pos.scale * factor, 0.7, 2.2);
    pos.x = cx - rect.left - beforeX * pos.scale;
    pos.y = cy - rect.top - beforeY * pos.scale;
    clampToBounds();
    state.map = { ...pos };
    events.dispatchEvent(new CustomEvent('map:zoom', { detail: pos.scale }));
  };

  const applyTransform = () => {
    viewport.style.transform = `translate(${pos.x}px, ${pos.y}px) scale(${pos.scale})`;
    state.map = { ...pos };
    events.dispatchEvent(new CustomEvent('map:zoom', { detail: pos.scale }));
    window.APP.mapRender.updateMinimapViewport(pos, container.getBoundingClientRect());
  };

  const clampToBounds = () => {
    const rect = container.getBoundingClientRect();
    const maxX = rect.width * 0.5;
    const maxY = rect.height * 0.5;
    const minX = rect.width - contentSize.w * pos.scale - maxX;
    const minY = rect.height - contentSize.h * pos.scale - maxY;
    pos.x = clamp(pos.x, minX, maxX);
    pos.y = clamp(pos.y, minY, maxY);
  };

  const startInertia = () => {
    if (prefersReduced) return;
    const decay = 0.92;
    const step = () => {
      velocity.x *= decay;
      velocity.y *= decay;
      if (Math.abs(velocity.x) < 0.1 && Math.abs(velocity.y) < 0.1) {
        stopInertia();
        return;
      }
      pos.x += velocity.x;
      pos.y += velocity.y;
      clampToBounds();
      applyTransform();
      inertiaId = requestAnimationFrame(step);
    };
    inertiaId = requestAnimationFrame(step);
  };

  const stopInertia = () => {
    if (inertiaId) cancelAnimationFrame(inertiaId);
    inertiaId = null;
  };

  const centralize = () => {
    pos = { x: 0, y: 0, scale: 1 };
    clampToBounds();
    applyTransform();
    saveState();
  };

  const onMinimapClick = (e) => {
    const rect = minimap.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    const containerRect = container.getBoundingClientRect();
    pos.x = -px * 2000 * pos.scale + containerRect.width / 2;
    pos.y = -py * 1000 * pos.scale + containerRect.height / 2;
    clampToBounds();
    applyTransform();
    saveState();
  };


  window.APP.mapGestures = { init, centralize };
})();
