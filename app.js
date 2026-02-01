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
        { q: 'Uma sala perfeita teria:', a: ['Livros antigos', 'Janelas para o ceu', 'Um laboratorio', 'Velas e mapas'] },
        { q: 'Voce prefere:', a: ['Tramas sutis', 'Risos leves', 'Perguntas dificeis', 'Conversas profundas'] },
        { q: 'Qual cor te abraça?', a: ['Azul', 'Dourado', 'Prata', 'Verde'] },
        { q: 'Qual e seu superpoder?', a: ['Empatia', 'Inventividade', 'Foco', 'Calma'] },
        { q: 'Que trilha ecoa?', a: ['Piano', 'Cordas', 'Sinos', 'Vento'] },
      ]
    },
    {
      part: 'Varinha',
      questions: [
        { q: 'Que madeira chama?', a: ['Carvalho azul', 'Salgueiro', 'Nogueira lunar', 'Cedro'] },
        { q: 'O que vibra no nucleo?', a: ['Fio de estrela', 'Pena cintilante', 'Raiz marinha', 'Sopro de aurora'] },
        { q: 'Qual forma?', a: ['Fina e longa', 'Curta e precisa', 'Curva e suave', 'Firme e media'] },
        { q: 'Qual temperatura?', a: ['Fria e clara', 'Quente e dourada', 'Neutra e serena', 'Eletrica e viva'] },
      ]
    },
    {
      part: 'Patrono',
      questions: [
        { q: 'Um lugar seguro parece:', a: ['Biblioteca', 'Beira-mar', 'Observatorio', 'Floresta'] },
        { q: 'Quem te guia?', a: ['Ciencia', 'Amizade', 'Lua', 'Riso'] },
        { q: 'O som preferido:', a: ['Chuva leve', 'Passos na neve', 'Brisa', 'Risada curta'] },
      ]
    }
  ];

  let quizIndex = { part: 0, question: 0 };

  const init = () => {
    initModal();
    initToast();
    initIntro();
    initQuiz();
    initTopbar();
    window.APP.footprints.init();

    if (state.quizDone) {
      transitions.showScreen(screens.map);
      window.APP.mapEngine.init();
    }
  };

  const initIntro = () => {
    const envelope = qs('#envelope');
    const start = qs('#btn-start');
    const skip = qs('#btn-skip');

    const openEnvelope = () => {
      envelope.classList.add('open');
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
        toast('Escolha uma opcao antes de continuar.');
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
    if (pick.includes('Ciencia')) return 'Coruja de Neblina';
    if (pick.includes('Lua')) return 'Cervo Astral';
    if (pick.includes('Riso')) return 'Raposa Cintilante';
    return 'Lobo Calmo';
  };

  const animateResults = () => {
    qs('#wand-text').textContent = `${state.results.wand} • ${state.results.house}`;
    qs('#patronus-text').textContent = state.results.patronus;
    const path = qs('#wand-path');
    path.style.transition = 'stroke-dashoffset 1.6s ease';
    requestAnimationFrame(() => { path.style.strokeDashoffset = '0'; });
    animateSpark();
    drawConstellation();

    qs('#btn-to-map').addEventListener('click', () => {
      transitions.showScreen(screens.map);
      window.APP.mapEngine.init();
    }, { once: true });
  };

  const animateSpark = () => {
    const spark = qs('#wand-spark');
    const path = qs('#wand-path');
    const length = path.getTotalLength();
    let start = performance.now();
    const step = (t) => {
      const p = Math.min(1, (t - start) / 1400);
      const pt = path.getPointAtLength(length * p);
      spark.setAttribute('cx', pt.x);
      spark.setAttribute('cy', pt.y);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const drawConstellation = () => {
    const canvas = qs('#patronus-canvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const stars = Array.from({ length: 12 }).map(() => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: 1 + Math.random() * 2,
    }));
    ctx.strokeStyle = 'rgba(140, 210, 255, 0.5)';
    ctx.beginPath();
    stars.forEach((s, i) => {
      if (i === 0) ctx.moveTo(s.x, s.y);
      else ctx.lineTo(s.x, s.y);
    });
    ctx.stroke();
    stars.forEach((s) => {
      ctx.fillStyle = 'rgba(170, 230, 255, 0.9)';
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    });
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
    window.APP.toast = (msg) => {
      el.textContent = msg;
      el.classList.add('show');
      setTimeout(() => el.classList.remove('show'), 1800);
    };
  };

  qs('#btn-restart')?.addEventListener('click', () => {
    window.APP.resetState();
    location.reload();
  });

  document.addEventListener('DOMContentLoaded', init);
})();
