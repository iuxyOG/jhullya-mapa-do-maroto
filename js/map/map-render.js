(function () {
  const { qs, qsa, prefersReduced, clamp } = window.APP;
  const minimap = { canvas: null, ctx: null, w: 220, h: 120 };
  let svgDataUrl = null;
  let svgImage = null;
  let pulseRaf = null;
  let pulsePins = [];
  let pulseDone = {};

  const build = () => {
    const svg = qs('#map-svg');
    if (!svg) return;
    svg.innerHTML = `
      <defs>
        <filter id="inkbleed" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" seed="2" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" />
        </filter>
        <filter id="inkglow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <g id="map-ink" filter="url(#inkbleed)">
        <path class="ink-line" d="M120 820 C280 700 430 640 620 600" />
        <path class="ink-line" d="M620 600 C900 540 1150 420 1380 340" />
        <path class="ink-line" d="M400 300 C560 260 780 260 990 310" />
        <path class="ink-line" d="M1060 700 C1260 650 1500 620 1780 640" />
        <path class="ink-line" d="M700 780 C760 620 820 520 900 430" />
        <path class="ink-line" d="M1400 780 C1500 650 1660 520 1860 420" />
        <path class="ink-line" d="M180 520 C420 420 620 420 900 520" />
        <path class="ink-line" d="M980 520 C1180 520 1460 520 1700 480" />
        <path class="ink-line" d="M220 180 C460 140 720 140 980 180" />
      </g>
      <g id="map-text" filter="url(#inkglow)">
        <text x="320" y="260">Galeria das Estrelas</text>
        <text x="860" y="200">Corredor da Ciencia</text>
        <text x="1500" y="300">Torre da Lua</text>
        <text x="1180" y="820">Bosque Azul</text>
        <text x="320" y="840">Trilho dos Weasley</text>
        <text x="120" y="420">Pontes de Tinta</text>
        <text x="1280" y="520">Sala das Marés</text>
        <text x="900" y="620">Observatorio Sul</text>
      </g>
      <g id="map-runes">
        <text class="rune" x="260" y="180">ᚠ ᚢ ᚦ</text>
        <text class="rune" x="640" y="900">ᛉ ᛃ ᛇ</text>
        <text class="rune" x="1520" y="720">ᛝ ᛟ ᛞ</text>
      </g>
      <g id="map-blots"></g>
    `;

    const style = document.createElementNS('http://www.w3.org/2000/svg', 'style');
    style.textContent = `
      .ink-line { fill: none; stroke: #2b1b12; stroke-width: 6; stroke-linecap: round; stroke-linejoin: round; opacity: 0.85; }
      #map-text text { font-family: \"Times New Roman\", serif; font-size: 30px; fill: rgba(20,10,6,0.7); letter-spacing: 1px; }
    `;
    svg.appendChild(style);

    const blots = svg.querySelector('#map-blots');
    for (let i = 0; i < 24; i++) {
      const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      c.setAttribute('cx', 100 + Math.random() * 1800);
      c.setAttribute('cy', 120 + Math.random() * 760);
      c.setAttribute('r', 3 + Math.random() * 8);
      c.setAttribute('fill', 'rgba(30,18,10,0.35)');
      blots.appendChild(c);
    }

    if (!prefersReduced) {
      inkReveal();
    }

    svgDataUrl = serializeSvg(svg);
    svgImage = new Image();
    svgImage.src = svgDataUrl;
    initMinimap();
  };

  const inkReveal = () => {
    const container = qs('#map-ink-reveal');
    if (!container) return;
    container.innerHTML = '';
    container.classList.remove('done');
    const canvas = document.createElement('canvas');
    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    container.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    const start = performance.now();
    const duration = 1400;

    const noise = (x, y, t) => {
      return Math.sin(x * 0.02 + t * 0.002) * Math.cos(y * 0.02 - t * 0.001);
    };

    const draw = (time) => {
      const p = Math.min(1, (time - start) / duration);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'rgba(10,16,28,0.95)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.globalCompositeOperation = 'destination-out';
      const r = canvas.width * (0.15 + p * 0.8);
      const grd = ctx.createRadialGradient(canvas.width * 0.5, canvas.height * 0.5, r * 0.2, canvas.width * 0.5, canvas.height * 0.5, r);
      grd.addColorStop(0, 'rgba(0,0,0,1)');
      grd.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grd;
      ctx.beginPath();
      ctx.arc(canvas.width * 0.5, canvas.height * 0.5, r, 0, Math.PI * 2);
      ctx.fill();

      const step = 12;
      ctx.fillStyle = 'rgba(0,0,0,0.9)';
      for (let y = 0; y < canvas.height; y += step) {
        for (let x = 0; x < canvas.width; x += step) {
          const n = noise(x, y, time);
          if (n + p > 0.5) {
            ctx.fillRect(x, y, step, step);
          }
        }
      }
      ctx.globalCompositeOperation = 'source-over';

      if (p < 1) {
        requestAnimationFrame(draw);
      } else {
        canvas.style.filter = 'blur(6px)';
        container.classList.add('done');
        setTimeout(() => {
          if (canvas.parentElement) container.removeChild(canvas);
        }, 420);
      }
    };
    requestAnimationFrame(draw);
  };

  const initMinimap = () => {
    minimap.canvas = qs('#minimap-canvas');
    if (!minimap.canvas) return;
    minimap.ctx = minimap.canvas.getContext('2d');
    minimap.w = minimap.canvas.width;
    minimap.h = minimap.canvas.height;
    drawMinimapBase();
  };

  const drawMinimapBase = () => {
    if (!minimap.ctx) return;
    const ctx = minimap.ctx;
    ctx.clearRect(0, 0, minimap.w, minimap.h);
    const tex = qs('#map-texture');
    if (tex) {
      ctx.drawImage(tex, 0, 0, minimap.w, minimap.h);
    } else {
      const grd = ctx.createLinearGradient(0, 0, minimap.w, minimap.h);
      grd.addColorStop(0, '#d6c19a');
      grd.addColorStop(1, '#b89f78');
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, minimap.w, minimap.h);
    }
    ctx.strokeStyle = 'rgba(40,20,10,0.5)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(10, minimap.h - 20);
    ctx.bezierCurveTo(60, 60, 140, 40, minimap.w - 10, 20);
    ctx.stroke();
  };

  const renderMinimap = (pins, doneMap) => {
    if (!minimap.ctx) return;
    pulsePins = pins;
    pulseDone = doneMap;
    if (pulseRaf) cancelAnimationFrame(pulseRaf);
    if (prefersReduced) {
      drawMinimapFrame(0);
      return;
    }
    const tick = (t) => {
      drawMinimapFrame(t);
      pulseRaf = requestAnimationFrame(tick);
    };
    pulseRaf = requestAnimationFrame(tick);
  };

  const updateMinimapViewport = (pos, containerRect) => {
    const vp = qs('#minimap-viewport');
    if (!vp) return;
    const scale = pos.scale;
    const viewW = containerRect.width / (2000 * scale) * minimap.w;
    const viewH = containerRect.height / (1000 * scale) * minimap.h;
    const left = (-pos.x / (2000 * scale)) * minimap.w;
    const top = (-pos.y / (1000 * scale)) * minimap.h;
    vp.style.width = `${viewW}px`;
    vp.style.height = `${viewH}px`;
    vp.style.left = `${left}px`;
    vp.style.top = `${top}px`;
  };

  const serializeSvg = (svg) => {
    const clone = svg.cloneNode(true);
    clone.removeAttribute('aria-hidden');
    const data = new XMLSerializer().serializeToString(clone);
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(data)}`;
  };

  const drawMinimapFrame = (t) => {
    drawMinimapBase();
    const ctx = minimap.ctx;
    pulsePins.forEach((p) => {
      const x = (p.x / 100) * minimap.w;
      const y = (p.y / 100) * minimap.h;
      const done = pulseDone[p.id];
      ctx.fillStyle = done ? 'rgba(60,80,110,0.6)' : 'rgba(40,70,130,0.9)';
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fill();
      if (!done) {
        const pulse = 3 + Math.sin(t * 0.004 + x) * 2;
        ctx.strokeStyle = 'rgba(90,180,255,0.5)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(x, y, 4 + pulse, 0, Math.PI * 2);
        ctx.stroke();
      }
    });
  };

  window.APP.mapRender = { build, inkReveal, renderMinimap, updateMinimapViewport };
})();
