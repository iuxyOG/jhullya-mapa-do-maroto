(function () {
  const { qs, qsa, state, saveState, events } = window.APP;
  const pinsWrap = () => qs('#map-pins');

  const categoryLabel = { HP: 'Harry Potter', ciencia: 'Ciência', segredo: 'Segredo' };

  const list = [
    { id: 'm1', x: 18, y: 78, label: 'Bolo Tortinho', category: 'HP', type: 'info' },
    { id: 'm2', x: 28, y: 82, label: 'Oficina Weasley', category: 'HP', type: 'choice' },
    { id: 'm3', x: 46, y: 34, label: 'Ciência Relâmpago', category: 'ciencia', type: 'choice' },
    { id: 'm4', x: 56, y: 48, label: 'Laboratório', category: 'ciencia', type: 'input' },
    { id: 'm5', x: 66, y: 68, label: 'Poção Azul', category: 'HP', type: 'multi' },
    { id: 'm6', x: 76, y: 28, label: 'Observatorio', category: 'ciencia', type: 'choice' },
    { id: 'm7', x: 38, y: 56, label: 'Cifra de Cesar', category: 'segredo', type: 'input' },
    { id: 'm8', x: 82, y: 22, label: 'Torre da Lua', category: 'segredo', type: 'mode' },
    { id: 'm9', x: 62, y: 84, label: 'Floresta', category: 'segredo', type: 'click3' },
    { id: 'm10', x: 48, y: 70, label: 'Biblioteca', category: 'HP', type: 'order' },
    { id: 'm11', x: 22, y: 46, label: 'Ciência Viva', category: 'ciencia', type: 'choice' },
    { id: 'm12', x: 72, y: 44, label: 'Patrono Eco', category: 'segredo', type: 'choice' },
    { id: 'm13', x: 54, y: 18, label: 'Estrela Guia', category: 'segredo', type: 'hotcold' },
    { id: 'm14', x: 90, y: 54, label: 'Lumos / Nox', category: 'HP', type: 'toggle' },
  ];

  const init = () => {
    renderPins();
    window.APP.mapRender.renderMinimap(list, state.missionsDone);
  };

  const renderPins = () => {
    const wrap = pinsWrap();
    wrap.innerHTML = '';
    list.forEach((mission) => {
      const pin = document.createElement('button');
      pin.className = 'pin';
      pin.dataset.id = mission.id;
      pin.style.left = `${mission.x}%`;
      pin.style.top = `${mission.y}%`;
      pin.setAttribute('aria-label', mission.label);
      pin.setAttribute('aria-pressed', state.missionsDone[mission.id] ? 'true' : 'false');
      pin.innerHTML = `<span class="pin-label">${mission.label}</span>`;
      if (state.missionsDone[mission.id]) pin.classList.add('done');
      pin.addEventListener('click', () => openMission(mission));
      pin.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openMission(mission);
        }
      });
      wrap.appendChild(pin);
    });
  };

  const openMission = (mission) => {
    const content = buildContent(mission);
    window.APP.modal.open(content, mission);
  };

  const completeMission = (mission, rewardText) => {
    state.missionsDone[mission.id] = true;
    if (!state.stamps.includes(mission.id)) state.stamps.push(mission.id);
    saveState();
    window.APP.toast(`${mission.label} concluída. ${rewardText}`);
    window.APP.stamp.play();
    if (mission.id === 'm2') window.APP.footprints.vivid();
    renderPins();
    window.APP.mapRender.renderMinimap(list, state.missionsDone);
    events.dispatchEvent(new CustomEvent('mission:update', { detail: mission.id }));
  };

  const buildContent = (mission) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'mission';
    wrapper.innerHTML = `<h3>${mission.label}</h3>`;

    const info = document.createElement('p');
    info.textContent = `Categoria: ${categoryLabel[mission.category] || mission.category}`;
    wrapper.appendChild(info);

    const helper = document.createElement('div');
    helper.className = 'mission-body';
    wrapper.appendChild(helper);

    const addButton = (label, action) => {
      const btn = document.createElement('button');
      btn.className = 'primary';
      btn.textContent = label;
      btn.addEventListener('click', action);
      helper.appendChild(btn);
    };

    if (mission.type === 'info') {
      helper.innerHTML = '<p>O bolo tortinho HAPPEE BIRTHDAE esconde um detalhe: o mapa marcou este ponto para lembrar que risos valem mais que perfeicao.</p>';
      addButton('Carimbar', () => completeMission(mission, 'Selo HAPPEE BIRTHDAE recebido.'));
    }

    if (mission.type === 'choice') {
      const q = document.createElement('p');
      const options = document.createElement('div');
      options.className = 'options';
      let correct = '';
      if (mission.id === 'm2') {
        q.textContent = 'A pegadinha mais gentil e: '; correct = 'Trocar as penas por glitter azul';
        ['Transformar sapos em sapatos', 'Trocar as penas por glitter azul', 'Invocar chuva de sapos'].forEach((opt) => createOption(opt));
      }
      if (mission.id === 'm3') {
        q.textContent = 'O que chega primeiro em uma tempestade: luz ou som?'; correct = 'Luz';
        ['Som', 'Luz', 'Os dois juntos'].forEach((opt) => createOption(opt));
      }
      if (mission.id === 'm6') {
        q.textContent = 'Qual planeta do sistema solar guarda a resposta?'; correct = 'Marte';
        ['Jupiter', 'Marte', 'Venus'].forEach((opt) => createOption(opt));
      }
      if (mission.id === 'm11') {
        q.textContent = 'Qual é o maior órgão do corpo humano?'; correct = 'Pele';
        ['Cerebro', 'Pele', 'Pulmao'].forEach((opt) => createOption(opt));
      }
      if (mission.id === 'm12') {
        q.textContent = 'Qual som ecoa mais longe na floresta?'; correct = 'Respirar com calma';
        ['Respirar com calma', 'Gritar', 'Bater palmas'].forEach((opt) => createOption(opt));
      }
      helper.appendChild(q);
      helper.appendChild(options);

      function createOption(text) {
        const btn = document.createElement('button');
        btn.className = 'ghost';
        btn.textContent = text;
        btn.addEventListener('click', () => {
          if (text === correct) {
            completeMission(mission, 'Selo de escolha certa conquistado.');
            if (mission.id === 'm12') window.APP.particles.constellationFlash();
          } else {
            window.APP.toast('O mapa treme a tinta. Tente outra rota.');
          }
        });
        options.appendChild(btn);
      }
    }

    if (mission.type === 'input') {
      const label = document.createElement('p');
      const input = document.createElement('input');
      input.type = 'text';
      input.placeholder = 'Digite aqui';
      input.style.width = '100%';
      input.style.margin = '10px 0 16px';

      if (mission.id === 'm4') {
        label.textContent = 'Senha do laboratório (dica: curiosidade):';
      }
      if (mission.id === 'm7') {
        label.textContent = 'Decifre a cifra de César +3: "fdulqkr h fxulrvlgdgh"';
      }

      helper.appendChild(label);
      helper.appendChild(input);
      addButton('Confirmar', () => {
        const value = input.value.trim().toLowerCase();
        if (mission.id === 'm4') {
          if (value === 'curiosidade') {
            completeMission(mission, 'Porta aberta com ciência.');
          } else if (value === 'te amo' || value === 'amor' || value === 'jhullya') {
            window.APP.mapSecrets.mapRespond('O mapa sussurra: você é a magia que move esta tinta. ♥');
          } else if (value.includes('azul')) {
            window.APP.mapSecrets.mapRespond('O mapa responde: azul também é abraço.');
          } else {
            window.APP.toast('Senha incorreta.');
          }
        }
        if (mission.id === 'm7') {
          if (value === 'carinho e curiosidade') {
            completeMission(mission, 'Selo criptografado desbloqueado.');
          } else {
            window.APP.toast('Cifra não decifrada.');
          }
        }
      });
    }

    if (mission.type === 'multi') {
      helper.innerHTML = '<p>Escolha três ingredientes para a poção azul calma.</p>';
      const options = ['lua', 'menta', 'brilho', 'cinzas', 'sal'];
      const picks = new Set();
      options.forEach((opt) => {
        const btn = document.createElement('button');
        btn.className = 'ghost';
        btn.textContent = opt;
        btn.addEventListener('click', () => {
          if (picks.has(opt)) { picks.delete(opt); btn.classList.remove('selected'); }
          else { picks.add(opt); btn.classList.add('selected'); }
        });
        helper.appendChild(btn);
      });
      addButton('Misturar', () => {
        const ok = ['lua', 'menta', 'brilho'].every((i) => picks.has(i)) && picks.size === 3;
        if (ok) completeMission(mission, 'Poção azul confirmada.');
        else window.APP.toast('A tinta borbulha. Ingredientes errados.');
      });
    }

    if (mission.type === 'mode') {
      helper.innerHTML = '<p>Somente a noite verdadeira revela este selo.</p>';
      addButton('Verificar', () => {
        if (state.mode === 'night') completeMission(mission, 'Selo lunar desperto.');
        else window.APP.toast('O mapa pede a luz fria da lua.');
      });
    }

    if (mission.type === 'click3') {
      helper.innerHTML = '<p>Toque três pontos diferentes na floresta.</p>';
      const area = document.createElement('div');
      area.style.display = 'grid';
      area.style.gridTemplateColumns = 'repeat(3, 1fr)';
      area.style.gap = '10px';
      const hits = new Set();
      for (let i = 0; i < 6; i++) {
        const dot = document.createElement('button');
        dot.className = 'ghost';
        dot.textContent = `Folha ${i + 1}`;
        dot.addEventListener('click', () => {
          hits.add(i);
          dot.classList.add('selected');
          if (hits.size >= 3) completeMission(mission, 'Selo da floresta encontrado.');
        });
        area.appendChild(dot);
      }
      helper.appendChild(area);
    }

    if (mission.type === 'order') {
      helper.innerHTML = '<p>Organize os volumes na ordem correta.</p>';
      const items = ['Luz', 'Fogo', 'Agua', 'Ar'];
      const order = ['Agua', 'Ar', 'Fogo', 'Luz'];
      const clicked = [];
      items.forEach((item) => {
        const btn = document.createElement('button');
        btn.className = 'ghost';
        btn.textContent = item;
        btn.addEventListener('click', () => {
          clicked.push(item);
          btn.disabled = true;
          if (clicked.length === order.length) {
            if (order.every((o, i) => o === clicked[i])) {
              completeMission(mission, 'Selo da biblioteca conquistado.');
            } else {
              window.APP.toast('Sequência incorreta.');
            }
          }
        });
        helper.appendChild(btn);
      });
    }

    if (mission.type === 'hotcold') {
      helper.innerHTML = '<p>Encontre a estrela guia. Clique ate ouvir o calor certo.</p>';
      const area = document.createElement('div');
      area.style.width = '100%';
      area.style.height = '180px';
      area.style.border = '1px dashed rgba(92,192,255,0.3)';
      area.style.borderRadius = '12px';
      area.style.position = 'relative';
      area.style.margin = '12px 0';
      const target = { x: 20 + Math.random() * 60, y: 20 + Math.random() * 60 };
      const hint = document.createElement('div');
      hint.textContent = 'Frio';
      helper.appendChild(area);
      helper.appendChild(hint);
      area.addEventListener('click', (e) => {
        const rect = area.getBoundingClientRect();
        const px = ((e.clientX - rect.left) / rect.width) * 100;
        const py = ((e.clientY - rect.top) / rect.height) * 100;
        const dist = Math.hypot(px - target.x, py - target.y);
        if (dist < 10) {
          completeMission(mission, 'Estrela guia encontrada.');
        } else {
          hint.textContent = dist < 20 ? 'Quente' : dist < 35 ? 'Morno' : 'Frio';
        }
      });
    }

    if (mission.type === 'toggle') {
      helper.innerHTML = '<p>Use Lumos e Nox para revelar o detalhe oculto.</p>';
      const btnL = document.createElement('button');
      const btnN = document.createElement('button');
      btnL.className = 'ghost';
      btnN.className = 'ghost';
      btnL.textContent = 'Lumos';
      btnN.textContent = 'Nox';
      helper.appendChild(btnL);
      helper.appendChild(btnN);
      let l = false, n = false;
      btnL.addEventListener('click', () => { l = true; btnL.classList.add('selected'); });
      btnN.addEventListener('click', () => { n = true; btnN.classList.add('selected'); });
      addButton('Revelar', () => {
        if (l && n) completeMission(mission, 'Selo de luz dupla.');
        else window.APP.toast('Os dois feitiços precisam brilhar.');
      });
    }

    return wrapper;
  };

  window.APP.mapMissions = { init, list, completeMission };
})();
