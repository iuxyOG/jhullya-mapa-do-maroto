(function () {
  const { qs, qsa, state, saveState, transitions, prefersReduced } = window.APP;

  const screens = {
    intro: '#screen-intro',
    quiz: '#screen-quiz',
    results: '#screen-results',
    map: '#screen-map',
    outro: '#screen-outro',
  };

  const quizData = [
    {
      part: 'Casa',
      questions: [
        { q: 'Qual energia te representa hoje?', a: ['Serena', 'Corajosa', 'Curiosa', 'Leal'] },
        { q: 'Uma sala perfeita teria:', a: ['Livros antigos', 'Janelas para o céu', 'Um laboratório', 'Velas e mapas'] },
        { q: 'Você prefere:', a: ['Tramas sutis', 'Risos leves', 'Perguntas difíceis', 'Conversas profundas'] },
        { q: 'Qual cor te abraça?', a: ['Azul', 'Dourado', 'Prata', 'Verde'] },
        { q: 'Qual é seu superpoder?', a: ['Empatia', 'Inventividade', 'Foco', 'Calma'] },
        { q: 'Que trilha ecoa?', a: ['Piano', 'Cordas', 'Sinos', 'Vento'] },
      ]
    },
    {
      part: 'Varinha',
      questions: [
        { q: 'Que madeira chama?', a: ['Carvalho azul', 'Salgueiro', 'Nogueira lunar', 'Cedro'] },
        { q: 'O que vibra no núcleo?', a: ['Fio de estrela', 'Pena cintilante', 'Raiz marinha', 'Sopro de aurora'] },
        { q: 'Qual forma?', a: ['Fina e longa', 'Curta e precisa', 'Curva e suave', 'Firme e média'] },
        { q: 'Qual temperatura?', a: ['Fria e clara', 'Quente e dourada', 'Neutra e serena', 'Elétrica e viva'] },
      ]
    },
    {
      part: 'Patrono',
      questions: [
        { q: 'Um lugar seguro parece:', a: ['Biblioteca', 'Beira-mar', 'Observatório', 'Floresta'] },
        { q: 'Quem te guia?', a: ['Ciência', 'Amizade', 'Lua', 'Riso'] },
        { q: 'O som preferido:', a: ['Chuva leve', 'Passos na neve', 'Brisa', 'Risada curta'] },
      ]
    }
  ];

  let quizIndex = { part: 0, question: 0 };

  const init = () => {
    initModal();
    initToast();
    initSoundHint();
    initSkipLink();
    initIntro();
    initQuiz();
    initTopbar();
    window.APP.footprints.init();

    if (state.quizDone) {
      transitions.showScreen(screens.map);
      window.APP.mapEngine.init();
    }
  };

  const initSkipLink = () => {
    const skip = qs('.skip-link');
    const main = qs('#main');
    if (skip && main) skip.addEventListener('click', () => { main.focus(); });
  };

  const initSoundHint = () => {
    if (state.soundHintShown || state.soundOn) return;
    state.soundHintShown = true;
    saveState();
    setTimeout(() => {
      window.APP.toast('Clique em Som para ativar os efeitos sonoros.');
    }, 1200);
  };

  const initIntro = () => {
    const envelope = qs('#envelope');
    const start = qs('#btn-start');
    const skip = qs('#btn-skip');

    const openEnvelope = () => {
      envelope.classList.add('open');
      envelope.closest('.intro-wrap')?.classList.add('envelope-opened');
      state.introOpened = true;
      saveState();
      if (state.soundOn) window.APP.audio.paper();
    };

    envelope.addEventListener('click', openEnvelope);
    envelope.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openEnvelope(); }
    });

    start.addEventListener('click', () => {
      transitions.showScreen(screens.quiz);
      startQuiz();
    });

    skip.addEventListener('click', () => {
      transitions.showScreen(screens.map);
      window.APP.mapEngine.init();
    });
  };

  const initQuiz = () => {
    qs('#quiz-prev').addEventListener('click', () => {
      if (quizIndex.question > 0) quizIndex.question--;
      else if (quizIndex.part > 0) { quizIndex.part--; quizIndex.question = quizData[quizIndex.part].questions.length - 1; }
      renderQuestion();
    });
    qs('#quiz-next').addEventListener('click', () => {
      if (!state.quizAnswers[answerKey()]) {
        toast('Escolha uma opção antes de continuar.');
        return;
      }
      if (quizIndex.question < quizData[quizIndex.part].questions.length - 1) quizIndex.question++;
      else if (quizIndex.part < quizData.length - 1) { quizIndex.part++; quizIndex.question = 0; }
      else finishQuiz();
      renderQuestion();
    });
  };

  const startQuiz = () => {
    quizIndex = { part: 0, question: 0 };
    renderQuestion();
  };

  const answerKey = () => `p${quizIndex.part}-q${quizIndex.question}`;

  const renderQuestion = () => {
    const part = quizData[quizIndex.part];
    const question = part.questions[quizIndex.question];
    qs('#quiz-step').textContent = `Parte ${quizIndex.part + 1} de ${quizData.length}`;
    qs('#quiz-title').textContent = part.part;
    qs('#quiz-question').textContent = question.q;
    const answers = qs('#quiz-answers');
    const card = qs('#quiz-card');
    card.classList.remove('animating');
    requestAnimationFrame(() => card.classList.add('animating'));
    setTimeout(() => card.classList.remove('animating'), 500);
    answers.innerHTML = '';
    question.a.forEach((opt) => {
      const card = document.createElement('div');
      card.className = 'quiz-answer';
      card.textContent = opt;
      if (state.quizAnswers[answerKey()] === opt) card.classList.add('selected');
      card.addEventListener('click', (e) => {
        qsa('.quiz-answer', answers).forEach((el) => el.classList.remove('selected'));
        card.classList.add('selected');
        state.quizAnswers[answerKey()] = opt;
        saveState();
        card.classList.add('ripple');
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--x', `${e.clientX - rect.left}px`);
        card.style.setProperty('--y', `${e.clientY - rect.top}px`);
        setTimeout(() => card.classList.remove('ripple'), 400);
      });
      answers.appendChild(card);
    });
  };

  const finishQuiz = () => {
    state.quizDone = true;
    state.results.house = deriveHouse();
    state.results.wand = deriveWand();
    state.results.patronus = derivePatronus();
    saveState();
    transitions.showScreen(screens.results);
    animateResults();
  };

  const deriveHouse = () => {
    const answers = Object.values(state.quizAnswers).join(' ');
    if (answers.includes('Corajosa')) return 'Grifinoria das Estrelas';
    if (answers.includes('Curiosa')) return 'Corvinal Azul';
    if (answers.includes('Leal')) return 'Lufana Serena';
    return 'Sonserina Suave';
  };

  const deriveWand = () => {
    const pick = state.quizAnswers['p1-q0'] || 'Carvalho azul';
    return `${pick} com fio de estrela`;
  };

  const derivePatronus = () => {
    const pick = state.quizAnswers['p2-q1'] || 'Lua';
    if (pick.includes('Ciência')) return 'Coruja de Neblina';
    if (pick.includes('Lua')) return 'Cervo Astral';
    if (pick.includes('Riso')) return 'Raposa Cintilante';
    return 'Lobo Calmo';
  };

  const animateResults = () => {
    qs('#wand-text').textContent = `${state.results.wand} • ${state.results.house}`;
    qs('#patronus-text').textContent = state.results.patronus;
    const patronusPanel = qs('#patronus-text').closest('.result-panel');
    if (patronusPanel && !patronusPanel.querySelector('.patronus-romantic')) {
      const romantic = document.createElement('p');
      romantic.className = 'patronus-romantic';
      romantic.textContent = 'Sua luz guia este mapa.';
      qs('#patronus-text').after(romantic);
    }
    const path = qs('#wand-path');
    const spark = qs('#wand-spark');
    requestAnimationFrame(() => { path.classList.add('drawn'); });
    animateSpark(() => { if (spark) spark.classList.add('spark-ready'); });
    drawConstellation();

    qs('#btn-to-map').addEventListener('click', () => {
      transitions.showScreen(screens.map);
      window.APP.mapEngine.init();
    }, { once: true });
  };

  const animateSpark = (onComplete) => {
    const spark = qs('#wand-spark');
    const path = qs('#wand-path');
    if (!spark || !path) return;
    const length = path.getTotalLength();
    const duration = 1600;
    let start = performance.now();
    const step = (t) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 1.2);
      const pt = path.getPointAtLength(length * eased);
      spark.setAttribute('cx', pt.x);
      spark.setAttribute('cy', pt.y);
      if (p < 1) requestAnimationFrame(step);
      else if (onComplete) onComplete();
    };
    requestAnimationFrame(step);
  };

  const drawConstellation = () => {
    const canvas = qs('#patronus-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;
    const starCount = 14;
    const reducedMotion = window.APP.prefersReduced;
    const stars = Array.from({ length: starCount }, () => ({
      x: 0.1 * w + Math.random() * 0.8 * w,
      y: 0.1 * h + Math.random() * 0.8 * h,
      r: 1.2 + Math.random() * 2,
      phase: Math.random() * Math.PI * 2,
    }));

    function drawFrame(twinklePhase) {
      ctx.clearRect(0, 0, w, h);
      ctx.save();

      var nebulaGrad = ctx.createRadialGradient(w * 0.5, h * 0.5, 0, w * 0.5, h * 0.5, w * 0.7);
      nebulaGrad.addColorStop(0, 'rgba(90, 160, 220, 0.08)');
      nebulaGrad.addColorStop(0.5, 'rgba(140, 200, 255, 0.04)');
      nebulaGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = nebulaGrad;
      ctx.fillRect(0, 0, w, h);

      ctx.strokeStyle = 'rgba(140, 210, 255, 0.45)';
      ctx.lineWidth = 1.2;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(stars[0].x, stars[0].y);
      for (let i = 1; i < stars.length; i++) {
        ctx.lineTo(stars[i].x, stars[i].y);
      }
      ctx.stroke();

      stars.forEach((s, i) => {
        const twinkle = 0.7 + 0.3 * Math.sin(twinklePhase + s.phase);
        ctx.fillStyle = `rgba(170, 230, 255, ${0.85 * twinkle})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = `rgba(200, 240, 255, ${0.5 * twinkle})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r * 0.5, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.restore();
    }

    let start = performance.now();
    let lineProgress = 0;
    const lineDuration = 1200;

    function animateLines(now) {
      const elapsed = now - start;
      lineProgress = Math.min(1, elapsed / lineDuration);
      const seg = 1 / (stars.length - 1);
      ctx.clearRect(0, 0, w, h);
      ctx.save();
      var nebulaGrad = ctx.createRadialGradient(w * 0.5, h * 0.5, 0, w * 0.5, h * 0.5, w * 0.7);
      nebulaGrad.addColorStop(0, 'rgba(90, 160, 220, 0.08)');
      nebulaGrad.addColorStop(0.5, 'rgba(140, 200, 255, 0.04)');
      nebulaGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = nebulaGrad;
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = 'rgba(140, 210, 255, 0.5)';
      ctx.lineWidth = 1.2;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(stars[0].x, stars[0].y);
      const drawTo = 1 + Math.floor(lineProgress * (stars.length - 1));
      const partial = lineProgress * (stars.length - 1) - (drawTo - 1);
      for (let i = 1; i < drawTo; i++) ctx.lineTo(stars[i].x, stars[i].y);
      if (drawTo < stars.length && partial > 0) {
        const ax = stars[drawTo - 1].x;
        const ay = stars[drawTo - 1].y;
        const bx = stars[drawTo].x;
        const by = stars[drawTo].y;
        ctx.lineTo(ax + (bx - ax) * partial, ay + (by - ay) * partial);
      }
      ctx.stroke();
      for (let i = 0; i < drawTo; i++) {
        const s = stars[i];
        ctx.fillStyle = 'rgba(170, 230, 255, 0.9)';
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      if (drawTo < stars.length && partial > 0) {
        const s = stars[drawTo];
        ctx.fillStyle = `rgba(170, 230, 255, ${0.5 + 0.4 * partial})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
      if (lineProgress < 1) requestAnimationFrame(animateLines);
      else if (reducedMotion) drawFrame(0);
      else startTwinkle();
    }

    function startTwinkle() {
      let twinkleStart = performance.now();
      function twinkle(t) {
        const phase = (t - twinkleStart) * 0.002;
        drawFrame(phase);
        if (canvas.isConnected) requestAnimationFrame(twinkle);
      }
      requestAnimationFrame(twinkle);
    }

    if (reducedMotion) {
      ctx.save();
      const nebulaGrad = ctx.createRadialGradient(w * 0.5, h * 0.5, 0, w * 0.5, h * 0.5, w * 0.7);
      nebulaGrad.addColorStop(0, 'rgba(90, 160, 220, 0.08)');
      nebulaGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = nebulaGrad;
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = 'rgba(140, 210, 255, 0.5)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(stars[0].x, stars[0].y);
      stars.slice(1).forEach((s) => ctx.lineTo(s.x, s.y));
      ctx.stroke();
      stars.forEach((s) => {
        ctx.fillStyle = 'rgba(170, 230, 255, 0.9)';
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.restore();
      return;
    }
    requestAnimationFrame(animateLines);
  };

  const initTopbar = () => {
    qs('#btn-sound').addEventListener('click', () => {
      state.soundOn = !state.soundOn;
      saveState();
      qs('#btn-sound').setAttribute('aria-pressed', state.soundOn ? 'true' : 'false');
      if (state.soundOn) window.APP.audio.toggle();
    });
    qs('#btn-mode').addEventListener('click', () => {
      const mode = state.mode === 'night' ? 'day' : 'night';
      window.APP.mapEngine.setMode(mode);
      qs('#btn-mode').setAttribute('aria-pressed', mode === 'night' ? 'true' : 'false');
      if (mode === 'night') window.APP.footprints.vivid();
    });
    qs('#btn-centralize').addEventListener('click', () => {
      window.APP.mapGestures.centralize();
    });

    qs('#btn-outro').addEventListener('click', () => {
      transitions.showScreen(screens.outro);
    });

    window.APP.events.addEventListener('outro:unlocked', () => {
      window.APP.toast('O mapa está completo — você é incrível. ♥', 3200);
    }, { once: true });

    window.APP.events.addEventListener('map:zoom', (e) => {
      const z = Math.round(e.detail * 100);
      qs('#hud-zoom').textContent = `${z}%`;
    });
    qs('#btn-sound').setAttribute('aria-pressed', state.soundOn ? 'true' : 'false');
    qs('#btn-mode').setAttribute('aria-pressed', state.mode === 'night' ? 'true' : 'false');
  };

  const initModal = () => {
    const modal = qs('#modal');
    const content = qs('#modal-content');
    let focusable = [];
    let lastFocus = null;

    const open = (htmlOrNode, mission) => {
      lastFocus = document.activeElement;
      content.innerHTML = '';
      if (typeof htmlOrNode === 'string') content.innerHTML = htmlOrNode;
      else content.appendChild(htmlOrNode);
      modal.classList.add('active');
      modal.setAttribute('aria-hidden', 'false');
      focusable = qsa('button, [href], input, textarea, select, [tabindex]:not([tabindex="-1"])', modal);
      if (focusable[0]) focusable[0].focus();
      if (state.soundOn) window.APP.audio.paper();
    };

    const close = () => {
      modal.classList.remove('active');
      modal.setAttribute('aria-hidden', 'true');
      if (lastFocus) lastFocus.focus();
    };

    modal.addEventListener('click', (e) => {
      if (e.target.dataset.close) close();
    });

    document.addEventListener('keydown', (e) => {
      if (modal.classList.contains('active')) {
        if (e.key === 'Escape') close();
        if (e.key === 'Tab') {
          const first = focusable[0];
          const last = focusable[focusable.length - 1];
          if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
          else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
        }
      }
    });

    window.APP.modal = { open, close };
  };

  const initToast = () => {
    const el = qs('#toast');
    window.APP.toast = (msg, durationMs) => {
      el.textContent = msg;
      el.classList.add('show');
      setTimeout(() => el.classList.remove('show'), durationMs || 2200);
    };
  };

  qs('#btn-restart')?.addEventListener('click', () => {
    window.APP.resetState();
    location.reload();
  });

  const registerSW = () => {
    if (!('serviceWorker' in navigator)) return;
    navigator.serviceWorker.register('sw.js').catch(() => {});
  };

  const LOADER_MIN_MS = 2400;

  const hideLoaderAndStart = () => {
    document.body.classList.add('loader-done');
    init();
    registerSW();
  };

  let loaderMinElapsed = false;
  let windowLoaded = false;

  const maybeHideLoader = () => {
    if (loaderMinElapsed && windowLoaded) hideLoaderAndStart();
  };

  document.addEventListener('DOMContentLoaded', () => {
    if (document.readyState === 'complete') windowLoaded = true;
    setTimeout(() => {
      loaderMinElapsed = true;
      maybeHideLoader();
    }, LOADER_MIN_MS);
  });

  window.addEventListener('load', () => {
    windowLoaded = true;
    maybeHideLoader();
  });
})();
