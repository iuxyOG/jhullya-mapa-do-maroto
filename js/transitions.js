(function () {
  const { qs } = window.APP;

  const showScreen = (id) => {
    const next = qs(id);
    if (!next) return;
    const current = document.querySelector('.screen.active');
    const apply = () => {
      if (current) {
        current.classList.remove('active');
        current.setAttribute('aria-hidden', 'true');
      }
      next.classList.add('active');
      next.setAttribute('aria-hidden', 'false');
    };
    if (document.startViewTransition && !window.APP.prefersReduced) {
      document.startViewTransition(() => apply());
    } else {
      apply();
    }
  };

  window.APP.transitions = { showScreen };
})();
