# Mapa do Maroto - Jhullya Isabela (fan-made)

Experiencia premium fan-made, sem fins comerciais, inspirada em magia, ciencia e humor leve Weasley.

## Rodar local

```bash
python3 -m http.server 5173
```

Abra `http://localhost:5173` no navegador.

## Publicar no GitHub Pages

1. Crie um repositorio no GitHub.
2. Copie todos os arquivos deste projeto para a raiz do repositorio.
3. Faça commit e push para a branch `main`.
4. Em Settings → Pages, selecione a branch `main` e a pasta `/root`.
5. Aguarde o link publicado.

## Personalizar (nome, data, cores)

- `js/core.js`: altere `config.name` e `config.date`.
- `styles.css`: ajuste as variaveis em `:root` (ex.: `--bg`, `--blue`, `--accent`).

## Notas

- Sem assets oficiais ou imagens com copyright. Tudo e procedural (CSS/SVG/Canvas).
- Sem bundler, sem npm. Apenas HTML/CSS/JS estaticos.
- Audio totalmente procedural via WebAudio (sem mp3).
