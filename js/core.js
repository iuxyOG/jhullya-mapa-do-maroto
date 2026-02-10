(function () {
  const qs = (sel, parent = document) => parent.querySelector(sel);
  const qsa = (sel, parent = document) => Array.from(parent.querySelectorAll(sel));
  const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const now = () => performance.now();

  const config = {
    name: "Jhullya Isabela",
    date: "21 de setembro",
    theme: "blue-dark",
    mapTextureVersion: "v4",
    minMissionsForOutro: 10,
    secretSequenceIds: ["m3", "m8", "m1", "m11"],
  };

  window.APP = {
    config,
    qs,
    qsa,
    clamp,
    lerp,
    now,
    prefersReduced: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    events: new EventTarget(),
  };
})();
