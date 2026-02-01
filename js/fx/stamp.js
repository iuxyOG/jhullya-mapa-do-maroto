(function () {
  const { qs } = window.APP;

  const play = () => {
    const container = qs('#map-container');
    if (!container) return;
    const stamp = document.createElement('div');
    stamp.style.position = 'absolute';
    stamp.style.left = '70%';
    stamp.style.top = '70%';
    stamp.style.width = '120px';
    stamp.style.height = '120px';
    stamp.style.borderRadius = '50%';
    stamp.style.background = 'radial-gradient(circle at 30% 30%, rgba(165,24,53,0.9), rgba(90,12,27,0.9))';
    stamp.style.border = '2px solid rgba(255,255,255,0.3)';
    stamp.style.transform = 'translate(-50%, -50%) scale(0.2)';
    stamp.style.opacity = '0';
    stamp.style.transition = 'transform 0.5s ease, opacity 0.5s ease';
    stamp.style.pointerEvents = 'none';
    container.appendChild(stamp);
    requestAnimationFrame(() => {
      stamp.style.opacity = '1';
      stamp.style.transform = 'translate(-50%, -50%) scale(1)';
    });
    setTimeout(() => {
      stamp.style.opacity = '0';
      stamp.style.transform = 'translate(-50%, -50%) scale(1.1)';
      stamp.remove();
    }, 900);
    if (window.APP.state.soundOn) window.APP.audio.stamp();
  };

  window.APP.stamp = { play };
})();
