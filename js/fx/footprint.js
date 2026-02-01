(function () {
  const { qs, prefersReduced } = window.APP;
  const maxFootprints = 35;
  let footprints = [];
  let lastPos = null;
  let canvas, ctx;
  let vividUntil = 0;

  const init = () => {
    canvas = qs('#footprint-canvas');
    if (!canvas) return;
    ctx = canvas.getContext('2d');
  };

  const onMove = (dx, dy, pos) => {
    if (!ctx || prefersReduced) return;
    const x = (pos.x * -1) + canvas.width * 0.5;
    const y = (pos.y * -1) + canvas.height * 0.5;
    if (!lastPos) lastPos = { x, y };
    const dist = Math.hypot(x - lastPos.x, y - lastPos.y);
    if (dist < 30) return;
    lastPos = { x, y };
    addFootprint(x, y, Math.atan2(dy, dx));
    render();
  };

  const addFootprint = (x, y, angle) => {
    if (footprints.length >= maxFootprints) footprints.shift();
    footprints.push({ x, y, angle, life: 1, size: 14 + Math.random() * 6 });
  };

  const render = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const now = performance.now();
    footprints.forEach((f) => {
      f.life *= 0.97;
      const glow = now < vividUntil;
      ctx.save();
      ctx.translate(f.x, f.y);
      ctx.rotate(f.angle);
      ctx.globalAlpha = f.life;
      ctx.filter = glow ? 'blur(1px)' : 'blur(0.5px)';
      ctx.fillStyle = glow ? 'rgba(90,180,255,0.5)' : 'rgba(30,18,10,0.5)';
      ctx.beginPath();
      ctx.ellipse(0, 0, f.size * 0.45, f.size * 0.8, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
    footprints = footprints.filter((f) => f.life > 0.12);
  };

  const vivid = () => {
    vividUntil = performance.now() + 10000;
  };

  window.APP.footprints = { init, onMove, vivid };
})();
