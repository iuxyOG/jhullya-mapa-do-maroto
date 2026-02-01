(function () {
  const { qs, events, state } = window.APP;
  let canvas, ctx, pointer = { x: 0.5, y: 0.5 };

  const init = () => {
    canvas = qs('#lighting-canvas');
    if (!canvas) return;
    ctx = canvas.getContext('2d');
    resize();
    window.addEventListener('resize', resize);
    canvas.parentElement.addEventListener('pointermove', onMove);
    events.addEventListener('mode:change', draw);
    draw();
  };

  const resize = () => {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    draw();
  };

  const onMove = (e) => {
    const rect = canvas.getBoundingClientRect();
    pointer.x = (e.clientX - rect.left) / rect.width;
    pointer.y = (e.clientY - rect.top) / rect.height;
    draw();
  };

  const draw = () => {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const cx = pointer.x * canvas.width;
    const cy = pointer.y * canvas.height;
    const glow = state.mode === 'night' ? 'rgba(90,180,255,0.45)' : 'rgba(255,220,160,0.35)';
    const dark = state.mode === 'night' ? 'rgba(5,10,20,0.65)' : 'rgba(20,10,5,0.5)';
    const grd = ctx.createRadialGradient(cx, cy, 80, cx, cy, canvas.width * 0.7);
    grd.addColorStop(0, glow);
    grd.addColorStop(1, dark);
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = 'rgba(255,255,255,0.15)';
    ctx.lineWidth = 2;
    ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);
  };

  window.APP.lighting = { init, draw };
})();
