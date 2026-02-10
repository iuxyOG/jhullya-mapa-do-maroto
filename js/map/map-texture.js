(function () {
  const { qs, clamp, config } = window.APP;
  const textureKey = `marauder-texture-${config.mapTextureVersion}`;

  const generate = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#d9c9a8';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    const rand = (seed) => {
      let x = Math.sin(seed) * 10000;
      return x - Math.floor(x);
    };

    for (let y = 0; y < canvas.height; y++) {
      for (let x = 0; x < canvas.width; x++) {
        const idx = (y * canvas.width + x) * 4;
        const n = rand(x * 12.9898 + y * 78.233) * 0.6 + rand(x * 2.11 + y * 9.73) * 0.4;
        const fiber = Math.sin((x + y) * 0.02) * 0.08 + Math.sin(x * 0.12) * 0.05;
        const base = 218 + n * 16 + fiber * 12;
        data[idx] = clamp(base + 4, 0, 255);
        data[idx + 1] = clamp(base - 6, 0, 255);
        data[idx + 2] = clamp(base - 20, 0, 255);
        data[idx + 3] = 255;
      }
    }
    ctx.putImageData(imageData, 0, 0);

    const addStain = (cx, cy, r, alpha) => {
      const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      grd.addColorStop(0, `rgba(120, 90, 50, ${alpha})`);
      grd.addColorStop(1, 'rgba(120, 90, 50, 0)');
      ctx.fillStyle = grd;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
    };

    for (let i = 0; i < 12; i++) {
      addStain(Math.random() * canvas.width, Math.random() * canvas.height, 60 + Math.random() * 120, 0.08);
    }

    ctx.strokeStyle = 'rgba(120, 100, 80, 0.25)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, canvas.height * 0.45);
    ctx.lineTo(canvas.width, canvas.height * 0.55);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(canvas.width * 0.2, 0);
    ctx.lineTo(canvas.width * 0.8, canvas.height);
    ctx.stroke();

    const edge = ctx.createRadialGradient(canvas.width * 0.5, canvas.height * 0.5, canvas.width * 0.2, canvas.width * 0.5, canvas.height * 0.5, canvas.width * 0.7);
    edge.addColorStop(0, 'rgba(0,0,0,0)');
    edge.addColorStop(1, 'rgba(40,30,20,0.35)');
    ctx.fillStyle = edge;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const mask = ctx.getImageData(0, 0, canvas.width, canvas.height);
    for (let y = 0; y < canvas.height; y++) {
      for (let x = 0; x < canvas.width; x++) {
        if (x < 30 || y < 20 || x > canvas.width - 30 || y > canvas.height - 20) {
          const idx = (y * canvas.width + x) * 4 + 3;
          const rough = (Math.random() * 0.8 + 0.2) * ((x + y) % 5 === 0 ? 0.4 : 1);
          mask.data[idx] = mask.data[idx] * rough;
        }
      }
    }
    ctx.putImageData(mask, 0, 0);

    return canvas.toDataURL('image/png');
  };

  const apply = async () => {
    const canvas = qs('#map-texture');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const drawToCanvas = (img) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };

    const parchmentImg = new Image();
    parchmentImg.onload = () => {
      drawToCanvas(parchmentImg);
    };
    parchmentImg.onerror = () => {
      let dataUrl = localStorage.getItem(textureKey);
      if (!dataUrl) {
        dataUrl = generate();
        try { localStorage.setItem(textureKey, dataUrl); } catch (err) { /* ignore */ }
      }
      const img = new Image();
      img.onload = () => drawToCanvas(img);
      img.src = dataUrl;
    };
    parchmentImg.src = 'assets/parchment.png';
  };

  window.APP.mapTexture = { apply };
})();
