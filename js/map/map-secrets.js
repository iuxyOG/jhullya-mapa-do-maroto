(function () {
  const { qs, state, saveState, events, config } = window.APP;
  let sequence = [];
  let sequenceTimer = null;
  let ronVisible = false;

  const init = () => {
    const container = qs('#map-container');
    if (!container) return;

    container.addEventListener('pointermove', (e) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      if (Math.hypot(x - 12, y - 22) < 8) {
        revealRon(container, e.clientX, e.clientY);
      }
    });

    events.addEventListener('mission:update', () => {
      maybeShowRare();
    });

    container.addEventListener('click', (e) => {
      const target = e.target.closest('.pin');
      if (!target) return;
      const id = target.dataset.id;
      if (!id) return;
      trackSequence(id);
    });

    maybeShowRare();
  };

  const revealRon = (container, x, y) => {
    if (state.secrets.ron || ronVisible) return;
    ronVisible = true;
    const glow = document.createElement('div');
    glow.style.position = 'absolute';
    glow.style.left = `${x - container.getBoundingClientRect().left - 40}px`;
    glow.style.top = `${y - container.getBoundingClientRect().top - 40}px`;
    glow.style.width = '80px';
    glow.style.height = '80px';
    glow.style.borderRadius = '50%';
    glow.style.background = 'radial-gradient(circle, rgba(255,150,80,0.4), transparent 70%)';
    glow.style.pointerEvents = 'none';
    container.appendChild(glow);
    if (state.soundOn) window.APP.audio.beep();

    const ron = document.createElement('button');
    ron.className = 'pin';
    ron.style.left = '12%';
    ron.style.top = '22%';
    ron.innerHTML = '<span class="pin-label">Ron Escondido</span>';
    ron.addEventListener('click', () => {
      state.secrets.ron = true;
      if (!state.stamps.includes('ron')) state.stamps.push('ron');
      saveState();
      window.APP.toast('Bem Weasley: você achou o Ron!');
      window.APP.particles.confetti();
      glow.remove();
      ron.remove();
    });
    container.appendChild(ron);
  };

  const maybeShowRare = () => {
    const done = Object.keys(state.missionsDone).length;
    if (done < 6 || state.secrets.rare) return;
    const pins = qs('#map-pins');
    if (pins.querySelector('[data-id="rare"]')) return;
    const pin = document.createElement('button');
    pin.className = 'pin';
    pin.dataset.id = 'rare';
    pin.style.left = '92%';
    pin.style.top = '14%';
    pin.innerHTML = '<span class="pin-label">Ponto Raro</span>';
    pin.addEventListener('click', () => {
      state.secrets.rare = true;
      if (!state.stamps.includes('rare')) state.stamps.push('rare');
      saveState();
      window.APP.modal.open(`<h3>Ponto Raro</h3><p>Ink burst liberado. Selo raro ativado.</p>`, { id: 'rare' });
      window.APP.ink.burst();
      pin.classList.add('done');
    });
    pins.appendChild(pin);
  };

  const trackSequence = (id) => {
    if (state.secrets.sequence) return;
    if (sequenceTimer) clearTimeout(sequenceTimer);
    sequence.push(id);
    sequenceTimer = setTimeout(() => { sequence = []; }, 10000);
    if (sequence.length > config.secretSequenceIds.length) sequence.shift();
    const match = config.secretSequenceIds.every((m, idx) => sequence[idx] === m);
    if (match) {
      state.secrets.sequence = true;
      if (!state.stamps.includes('malfeito')) state.stamps.push('malfeito');
      saveState();
      window.APP.ink.writeMessage('Malfeito Feito', 1200);
      window.APP.toast('Sequência secreta ativada.');
      sequence = [];
    } else if (sequence.length === config.secretSequenceIds.length) {
      window.APP.toast('A tinta se apaga e recomeça.');
      sequence = [];
    }
  };

  const mapRespond = (text) => {
    if (state.secrets.mapResponded) return;
    state.secrets.mapResponded = true;
    saveState();
    window.APP.toast(text);
  };

  window.APP.mapSecrets = { init, mapRespond };
})();
