(function () {
  const { qs } = window.APP;

  const confetti = () => {
    const container = qs('#map-container');
    if (!container) return;
    for (let i = 0; i < 24; i++) {
      const piece = document.createElement('div');
      piece.style.position = 'absolute';
      piece.style.left = `${50 + (Math.random() - 0.5) * 200}px`;
      piece.style.top = `40px`;
      piece.style.width = '6px';
      piece.style.height = '12px';
      piece.style.background = `hsl(${200 + Math.random() * 50} 80% 60%)`;
      piece.style.opacity = '0.8';
      piece.style.transform = `rotate(${Math.random() * 60}deg)`;
      piece.style.transition = 'transform 1.2s ease, opacity 1.2s ease, top 1.2s ease';
      container.appendChild(piece);
      requestAnimationFrame(() => {
        piece.style.top = `${200 + Math.random() * 200}px`;
        piece.style.opacity = '0';
        piece.style.transform = `translateX(${(Math.random() - 0.5) * 200}px) rotate(${Math.random() * 160}deg)`;
      });
      setTimeout(() => piece.remove(), 1400);
    }
  };

  const constellationFlash = () => {
    const canvas = qs('#patronus-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 20; i++) {
      ctx.fillStyle = 'rgba(140, 210, 255, 0.6)';
      ctx.beginPath();
      ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, 2 + Math.random() * 4, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  };

  window.APP.particles = { confetti, constellationFlash };
})();
