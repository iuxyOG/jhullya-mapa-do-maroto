(function () {
  const key = "marauder-state-v1";
  const defaultState = {
    introOpened: false,
    quizDone: false,
    quizAnswers: {},
    results: { house: "", wand: "", patronus: "" },
    map: { x: 0, y: 0, scale: 1 },
    missionsDone: {},
    stamps: [],
    secrets: { ron: false, rare: false, sequence: false, mapResponded: false },
    mode: "day",
    soundOn: false,
    soundHintShown: false,
  };

  const load = () => {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return structuredClone(defaultState);
      const parsed = JSON.parse(raw);
      return { ...structuredClone(defaultState), ...parsed };
    } catch (err) {
      return structuredClone(defaultState);
    }
  };

  const save = (state) => {
    localStorage.setItem(key, JSON.stringify(state));
  };

  const state = load();

  window.APP.state = state;
  window.APP.saveState = () => save(state);
  window.APP.resetState = () => {
    Object.assign(state, structuredClone(defaultState));
    save(state);
  };
})();
