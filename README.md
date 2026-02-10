# Mapa do Maroto - Jhullya Isabela (fan-made)

Experiência premium fan-made, sem fins comerciais, inspirada em magia, ciência e humor leve Weasley. Feito para Jhullya Isabela, com carinho — 21 de setembro.

## Conteúdo do projeto

- **Introdução**: carta/envelope com convite.
- **Quiz**: Casa, Varinha e Patrono (perguntas de personalidade).
- **Resultados**: varinha animada e constelação do patrono.
- **Mapa interativo**: missões, selos, pegadas, modo noite (Modo Lua), minimapa.
- **Encerramento**: dedicatória e opção de rever a experiência.
- **PWA**: instalável no celular ou computador (ícone na área de trabalho).
- **Som**: efeitos procedurais (Web Audio); na primeira visita aparece dica para ativar.

## Rodar local

```bash
python3 -m http.server 5173
```

Abra `http://localhost:5173` no navegador. Para testar o service worker, use HTTP (não file://).

## Instalar como app (PWA)

1. Abra o site em HTTPS (ou localhost).
2. No celular: menu do navegador → “Adicionar à tela inicial” / “Instalar app”.
3. No desktop (Chrome/Edge): ícone de instalação na barra de endereço.

O ícone do app é o favicon (estrela no mapa).

## Publicar no GitHub Pages

1. Crie um repositório no GitHub.
2. Copie todos os arquivos deste projeto para a raiz do repositório (incluindo `favicon.svg`, `manifest.json`, `sw.js`).
3. Faça commit e push para a branch `main`.
4. Em Settings → Pages, selecione a branch `main` e a pasta `/ (root)`.
5. Aguarde o link publicado. O PWA funcionará em HTTPS.

## Personalizar (nome, data, cores)

- **Nome e data**: `js/core.js` → `config.name` e `config.date`.
- **Data no encerramento**: em `index.html`, na seção `#screen-outro`, o texto “21 de setembro” está na dedicatória.
- **Cores e tema**: `styles.css` → variáveis em `:root` (ex.: `--bg`, `--blue`, `--accent`).
- **Título e meta**: `index.html` (tag `<title>`, meta description e Open Graph).

## Arquivos principais

| Arquivo        | Função                          |
|----------------|----------------------------------|
| `index.html`   | Estrutura, telas, meta, favicon |
| `styles.css`   | Estilos e tema                  |
| `app.js`       | Fluxo: intro, quiz, resultados, mapa, encerramento, modal, toast, PWA |
| `js/core.js`   | Config (nome, data), helpers    |
| `js/state.js`  | Estado e localStorage           |
| `manifest.json`| PWA: nome, ícone, cores         |
| `sw.js`        | Service worker (cache offline)  |
| `favicon.svg`  | Ícone da aba e do app           |

## Notas

- Sem assets oficiais ou imagens com copyright. Tudo procedural (CSS/SVG/Canvas).
- Sem bundler, sem npm. Apenas HTML/CSS/JS estáticos.
- Áudio totalmente procedural via Web Audio (sem MP3).
- Acessibilidade: foco visível, aria-labels, redução de movimento respeitada.
