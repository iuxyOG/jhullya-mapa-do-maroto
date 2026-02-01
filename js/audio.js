(function () {
  let ctx = null;

  const ensure = () => {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    return ctx;
  };

  const noiseBurst = (duration, gain = 0.12, highpass = 800) => {
    const audio = ensure();
    const buffer = audio.createBuffer(1, audio.sampleRate * duration, audio.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
    const source = audio.createBufferSource();
    source.buffer = buffer;
    const filter = audio.createBiquadFilter();
    filter.type = "highpass";
    filter.frequency.value = highpass;
    const g = audio.createGain();
    g.gain.value = gain;
    source.connect(filter).connect(g).connect(audio.destination);
    source.start();
  };

  const beep = (freq = 640, duration = 0.12, gain = 0.1) => {
    const audio = ensure();
    const osc = audio.createOscillator();
    const g = audio.createGain();
    osc.type = "sine";
    osc.frequency.value = freq;
    g.gain.value = gain;
    osc.connect(g).connect(audio.destination);
    osc.start();
    osc.stop(audio.currentTime + duration);
  };

  const thump = () => {
    const audio = ensure();
    const osc = audio.createOscillator();
    const g = audio.createGain();
    osc.type = "triangle";
    osc.frequency.value = 110;
    g.gain.value = 0.18;
    osc.connect(g).connect(audio.destination);
    osc.start();
    osc.stop(audio.currentTime + 0.08);
  };

  window.APP.audio = {
    paper: () => noiseBurst(0.2, 0.12, 900),
    beep: () => beep(680, 0.1, 0.12),
    stamp: () => thump(),
    toggle: () => beep(420, 0.08, 0.08),
  };
})();
