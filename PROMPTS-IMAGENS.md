# Prompts para gerar imagens – Mapa do Maroto (Jhullya Isabela)

Use estes prompts em ferramentas como DALL·E, Midjourney, Stable Diffusion ou Cursor (Generate Image). Ajuste tamanho e proporção conforme a ferramenta (ex.: 1200x630 para redes sociais, 512x512 para ícones).

---

## 1. Imagem para compartilhar (Open Graph / redes sociais)

**Uso:** `og:image` e `twitter:image` – aparece ao compartilhar o link no WhatsApp, Twitter, etc.

**Proporção sugerida:** 1200 x 630 px

**Prompt (inglês):**
```
Elegant dark blue and gold illustration, Marauder's Map style, old parchment unrolling with soft glowing blue lines and star constellations, romantic and magical mood, subtle pink accent, no text, cinematic lighting, digital painting, 16:9.
```

**Prompt (português para IAs em PT):**
```
Ilustração elegante em azul escuro e dourado, estilo Mapa do Maroto, pergaminho antigo desenrolando com linhas azuis suaves e constelações, clima romântico e mágico, toque rosa suave, sem texto, luz cinematográfica, pintura digital, proporção 16:9.
```

---

## 2. Ícone do app / favicon (alternativa em PNG)

**Uso:** `favicon.ico`, `apple-touch-icon` ou ícone do PWA em 192x192 / 512x512.

**Proporção:** quadrado (1:1), ex.: 512 x 512 px

**Prompt:**
```
Minimal app icon, circular, glowing blue star or compass rose on dark navy background, soft gold outline, magical and romantic, no text, flat design with subtle gradient, centered.
```

**Alternativa (coração + mapa):**
```
Minimal icon, small glowing heart and tiny star on dark blue circle, soft blue and pink glow, romantic gift app, no text, 512x512.
```

---

## 3. Textura de pergaminho para o mapa

**Uso:** substituir ou complementar a textura procedural do mapa (background do canvas do mapa).

**Proporção:** retangular, ex.: 2048 x 1024 px (ou 2:1)

**Prompt:**
```
Seamless old parchment texture, aged paper, warm beige and cream, subtle fiber and stain, no writing, no lines, tiling texture, top-down view, soft shadows, vintage map background.
```

**Alternativa (mais “mágico”):**
```
Old magical parchment texture, warm beige, very subtle blue and gold shimmer, aged paper, no text, seamless, 2:1 ratio, fantasy map background.
```

---

## 4. Carta / envelope (ilustração da intro)

**Uso:** imagem de fundo ou decoração na tela da carta (opcional).

**Proporção:** ex.: 800 x 500 px ou 4:3

**Prompt:**
```
Elegant sealed envelope on dark blue background, wax seal with heart symbol, soft blue and pink light, romantic and magical, no text on envelope, subtle glow, digital painting.
```

**Alternativa (carta aberta):**
```
Open letter on dark atmospheric background, parchment paper, soft glowing text lines in blue and gold, romantic mood, stars in background, no readable words, fantasy style.
```

---

## 5. Varinha mágica (tela de resultados)

**Uso:** ilustração ao lado ou atrás do SVG da varinha.

**Proporção:** horizontal, ex.: 600 x 200 px

**Prompt:**
```
Elegant magic wand, curved, golden wood with blue glowing tip, soft light trail, on dark blue background, romantic fantasy style, no hand, isolated, horizontal composition.
```

---

## 6. Constelação / patrono (atmosfera)

**Uso:** fundo decorativo do painel do patrono ou da tela de resultados.

**Proporção:** ex.: 800 x 400 px ou 2:1

**Prompt:**
```
Constellation of stars connected by thin glowing lines, soft blue and white on dark navy, dreamy and romantic, subtle pink glow, no animal shape, abstract star map, night sky.
```

---

## 7. Moldura do mapa (borda vintage)

**Uso:** borda ou frame ao redor do container do mapa (CSS com `border-image` ou img atrás).

**Proporção:** depende do uso (ex.: só as bordas em strip).

**Prompt:**
```
Vintage map frame border, dark wood and gold, ornate corners, symmetrical, no center content, only frame, fantasy style, 8k, seamless edges for tiling.
```

**Alternativa (mais simples):**
```
Simple elegant frame, dark blue with thin gold line, rounded corners, minimal, for map or document, no interior design.
```

---

## 8. Pin / marcador do mapa

**Uso:** ícone dos pins (substituir o círculo azul por uma imagem, se quiser).

**Proporção:** quadrado pequeno, ex.: 64 x 64 ou 128 x 128 px

**Prompt:**
```
Map pin icon, glowing blue gem or crystal, top view, soft light, minimal, transparent background, fantasy game style, 64x64.
```

**Alternativa:**
```
Small glowing blue star pin for map, minimal, top-down, soft glow, no text, PNG style.
```

---

## 9. Fundo do loading (opcional)

**Uso:** imagem de fundo atrás do loader “Preparando algo especial para você”.

**Proporção:** 1920 x 1080 ou 16:9

**Prompt:**
```
Dark blue gradient background, subtle stars and soft pink glow in center, no characters, no text, romantic and magical, blurry bokeh lights, calm atmosphere.
```

---

## 10. Bússola decorativa

**Uso:** ícone ou ilustração da bússola no canto do mapa.

**Proporção:** quadrado, ex.: 256 x 256 px

**Prompt:**
```
Minimal compass rose, blue and gold, glowing needle, dark navy background, round, fantasy map style, no text, centered, 256x256.
```

---

## Dicas ao usar os prompts

- **Sem texto:** na maioria dos prompts evite pedir texto legível; o projeto já tem títulos e nomes em HTML.
- **Cores:** azul escuro (#0a1020, #1f4b8f), azul claro (#9ad7ff), dourado (#d4b56a), rosa suave (#e8a0b5).
- **Estilo:** romântico, mágico, “Mapa do Maroto”, pergaminho antigo, sem personagens de franquia.
- **Resolução:** para rede social use 1200x630; para ícones 512x512 ou 192x192; para textura 2048x1024.

Depois de gerar, salve na pasta do projeto (ex.: `assets/`) e referencie no HTML/CSS (ex.: `<meta property="og:image" content="assets/og-image.png" />`).
