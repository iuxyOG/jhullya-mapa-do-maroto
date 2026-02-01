(function () {
  const { qs, state, saveState, events } = window.APP;

  const init = () => {
    window.APP.mapTexture.apply();
    window.APP.mapRender.build();
    window.APP.mapGestures.init();
    window.APP.mapMissions.init();
    window.APP.mapSecrets.init();
    window.APP.lighting.init();
    setMode(state.mode);

    updateHUD();
    events.addEventListener('mission:update', updateHUD);
  };

  const updateHUD = () => {
    const done = Object.keys(state.missionsDone).length;
    const total = window.APP.mapMissions.list.length;
    const progress = Math.round((done / total) * 100);
    qs('#hud-progress').textContent = `${progress}%`;
    qs('#hud-stamps').textContent = state.stamps.length;
    const outroBtn = qs('#btn-outro');
    if (done >= window.APP.config.minMissionsForOutro) {
      outroBtn.hidden = false;
    }
  };

  const setMode = (mode) => {
    state.mode = mode;
    saveState();
    document.documentElement.dataset.mode = mode;
    events.dispatchEvent(new CustomEvent('mode:change', { detail: mode }));
  };

  window.APP.mapEngine = { init, updateHUD, setMode };
})();
