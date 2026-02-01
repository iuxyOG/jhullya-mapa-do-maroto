(function () {
  const { qs } = window.APP;

  const burst = () => {
    const container = qs('#map-container');
    if (!container) return;
    const canvas = document.createElement('canvas');
    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;
    canvas.style.position = 'absolute';
    canvas.style.inset = '0';
    canvas.style.pointerEvents = 'none';
    container.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    const cx = canvas.width * 0.7;
    const cy = canvas.height * 0.2;
    let r = 0;
    const step = () => {
      r += 12;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'rgba(40,20,10,0.6)';
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(90,180,255,0.3)';
      ctx.beginPath();
      ctx.arc(cx, cy, r * 0.6, 0, Math.PI * 2);
      ctx.fill();
      if (r < 120) requestAnimationFrame(step);
      else setTimeout(() => canvas.remove(), 300);
    };
    requestAnimationFrame(step);
  };

  const writeMessage = (text, duration = 1200) => {
    const container = qs('#map-container');
    if (!container) return;
    const el = document.createElement('div');
    el.style.position = 'absolute';
    el.style.left = '50%';
    el.style.top = '18%';
    el.style.transform = 'translate(-50%, -50%)';
    el.style.fontFamily = '"Times New Roman", serif';
    el.style.fontSize = '28px';
    el.style.color = 'rgba(20,10,6,0.8)';
    el.style.letterSpacing = '2px';
    el.style.textShadow = '0 0 10px rgba(90,180,255,0.3)';
    el.style.filter = 'blur(0.2px)';
    container.appendChild(el);

    let i = 0;
    const interval = setInterval(() => {
      el.textContent = text.slice(0, i++);
      if (i > text.length) {
        clearInterval(interval);
        setTimeout(() => el.remove(), 2200);
      }
    }, Math.max(40, duration / text.length));
  };

  window.APP.ink = { burst, writeMessage };
})();
