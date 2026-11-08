# Teste 1 — estudo do lusion.co (itens a, b, d e e)

Autor: Vigia (Claude), 27/10/2026. Pedido: nota "image-c-users-yuzzi-maest-3", linhas 4 a 13.

**Fontes**
- Capturas sem janela com o `capwheel.mjs` (rolagem por roda, WebGL por GPU, hover pelo CDP):
  - lusion.co a 1440x900, em 34 passos de 150 px;
  - lusion.co a 375x812, em 14 passos de 400 px;
  - lusion.co/about a 1440, em 18 passos de 500 px;
  - hover no card Everswap a 0, 150, 400 e 900 ms.
- Ficam em `C:/Users/yuzzi/AppData/Local/Temp/claude/vigia/t1/`.
- Código lido no bundle oficial `https://lusion.co/_astro/hoisted.CUO_IjfL.js` (1,25 MB). Os números marcados **[código]** vêm de lá; os marcados **[captura]** foram medidos nas imagens.
- Não medi FPS nem curvas finas: as capturas têm ±50 ms de erro.

---

## a) O tubo de fundo → na INET, uma fibra óptica (dono: Abissal)

| Aspecto | O que é |
|---|---|
| O que é | 4 caminhos 3D **pré-modelados** (arquivos `lines/line_reel.buf`, `line_goal`, `line_capability`, `line_office`), um por seção. Não é um tubo único da página toda: **cada seção tem o seu trecho**. **[código]** |
| Cor | Degradê de duas cores ao longo do tubo. `line_reel`: `#5a90ff` → `#2a38ee` (azul). `line_goal`: `#94fffb` → `#1285dc` (ciano → azul). `capability` e `office`: `#fff` → `#bbb`. Há oclusão de ambiente no shader (`aoThreshold`) para dar volume. **[código]** |
| Espessura | `radius = 0.008 × fit(larguraDaTela, 540→1920, 2→1)`, ou seja, proporcionalmente **mais grosso em tela pequena**. Medido: ~36 px a 1440 e ~26 px a 375. **[código + captura]** |
| Como avança | É **desenhado com a rolagem**: a cabeça cresce ao longo do caminho. `showRatio = saturate(-(topoDaSeção − f0·altura)/(f1·altura))` com easing `quadInOut`. Para o `line_reel`, f0 = 0,4 e f1 = 1,3: começa quando o topo da seção passa de 40% da tela e se completa em 1,3 tela de rolagem. A ponta é um **círculo** (cabeça arredondada, malha separada). **[código]** Nas capturas `tubo-1440-05..08`, o tubo nasce na borda esquerda, desce em arco por trás de "Brought", contorna o card do reel e sai pela base. **[captura]** |
| Frente ou trás | **Atrás** do texto e dos cards: as letras de "Brought" e o card do reel cobrem o tubo, a 1440 e a 375 (`tubo-1440-07`, `m-375-02`). Ele passa por trás do conteúdo e **sai pelas bordas da tela**, então preenche as laterais. **[captura]** |
| Desempenho | `depthTest:false`, transparente, um mesh por seção, e só atualiza quando a seção está na tela. **[código]** |

**Para a INET (fibra óptica):**
- Um caminho SVG ou canvas **por seção**, atrás do conteúdo (z abaixo do texto), saindo pelas bordas.
- Desenho progressivo com `strokeDashoffset` (ou `pathLength` do Framer) atrelado ao `useScroll` da seção, com `quadInOut`.
- Cabeça arredondada (`stroke-linecap: round`) com um **brilho** na ponta, que é o "pulso de luz" de uma fibra, como no cabo submarino da nota "referencias-3".
- Degradê electric `#0062EC` → ciano `#5CC8FF`, em azul-noite (nunca roxo).
- Espessura de ~2,5% da largura em 1440 e proporcionalmente maior no celular.
- Animar só `stroke-dashoffset` e `opacity`, e pausar fora da tela.
- Com `prefers-reduced-motion`: o tubo já desenhado e estático.

## b) A "puxada do vídeo" PLAY REEL (dono: Meridiano)

| Aspecto | O que é |
|---|---|
| Técnica | O vídeo **não é DOM**: é uma malha WebGL de **32×32 segmentos** (`UfxMesh`) colada a dois elementos DOM, a miniatura pequena e o contêiner grande. A malha interpola posição e tamanho do pequeno para o grande. **[código]** |
| Início e fim | `showRatio = fit(rolagem, p, g, 0, 1)`: p é quando a **miniatura está centrada na tela**, g é quando o **contêiner grande está centrado**. Início: card de ~580x325 na coluna esquerda (x = 72). Fim: ~1290x600, com margem de 72 px e raio ~16. **[código + captura]** |
| Curvatura "folha" | Cada vértice tem um **atraso próprio**: `peso = 1 − (|x|^1.5 + (1−y)^1.5)/2` e `progressoDoVértice = smoothstep(peso·0.3, 0.7 + peso·0.3, showRatio)`. Os cantos de baixo e da direita chegam depois do canto de cima e da esquerda, e a superfície **entorta como papel** no caminho (`fino-1440-12`: trapézio com bordas curvas). **[código + captura]** |
| Extras do movimento | Desvio lateral de **até 10% da largura** no meio do trajeto: `x += mix(largura, 0, cos(t·2π)·0,5 + 0,5)·0,1`. **Leve giro em Z**: `rot = (smoothstep(t) − t)·−0,5` rad, que vale zero no começo e no fim. **[código]** |
| Cor | Duotone: `max(#1A2FFB, luminância)`, misturado com a cor real conforme `showRatio`. Cantos arredondados por máscara (`sdRoundedBox`). **[código]** |
| Texto | PLAY e REEL convergem para o centro, com uma pílula de play entre eles, que só aparece quando o progresso passa de 0,3 (`fit(ratio, 0.3, 1)`) com `expoInOut`. **[código]** |
| Celular | **Não há puxada**: card fixo com o botão de play e faixas "▶▶▶ PLAY REEL" correndo (`m-375-03/04`). **[captura]** |

**Para a INET, sem WebGL:**
- Um contêiner sticky; o card como `motion.div` animado só com `transform` (translate, scale e `rotateZ` pequeno), mais `clip-path: inset(... round 16px)`.
- O efeito de "folha" aproximado com **`rotateX` e `rotateY` de 8 a 15° no meio do trajeto, voltando a 0**, com `perspective` e `transform-origin` no canto superior esquerdo. Os cantos opostos parecem chegar depois.
- Uma versão mais fiel exigiria uma grade de fatias (por exemplo 6 colunas com atrasos), que é mais cara.
- Duotone com `mix-blend-mode: color` em electric, de 0,85 a 0.
- No celular, estático, como o próprio lusion.

## d) Cards que preenchem as laterais — o Featured Work (dono: Moldura)

| Aspecto | O que é |
|---|---|
| Grade | **2 colunas** de ponta a ponta do grid: margem de 72 px, cada card com ~634x411 a 1440, calha de ~29 px, raio ~16. O título fica embaixo, e acima dele uma linha pequena de categorias (`CONCEPT • WEB • DESIGN…`). **[captura]** No celular, **1 coluna**. |
| Entrada | Cada card entra **pelo lado de fora**: a coluna esquerda vem da esquerda e a direita vem da direita. `x = (1 − C)·(±0,5)·−10% da largura da tela`, `rotateZ = (1 − C)·(±0,5)·0,1` rad e `C = expoOut(tempo/2 s)`, a partir de quando o card entra na tela. A malha do card se estende **1000 px para o lado de fora** (`paddingL/R`), então a imagem pode vazar até a borda da tela durante o movimento. **[código]** |
| Ondulação | Ao rolar, `u_rippleStrength = min(0,15, forçaDaRolagem·0,5)`: a imagem ondula conforme a velocidade. **[código]** |
| Título | A primeira linha "digita" letras aleatórias até formar o texto. O ícone de seta desliza com o hover. **[código]** |

**Para a INET:**
- Cards de mídia grandes em 2 colunas na largura do grid (não 3 ou 4 cards iguais pequenos), com imagens reais do projeto.
- Entrada com `x` de ±10vw e `rotate` de ±3°, que caem para 0 com expo-out em ~1,2 a 2 s, acionada uma vez ao entrar na tela.
- Altura fixa com `aspect-ratio`, sem animar largura nem altura.
- No celular, 1 coluna, só com fade e um `y` curto.

## e) O hover dos cards: tremida e desfoque (dono: Trilho)

| Aspecto | O que é |
|---|---|
| Duração | `hoverRatio` sobe a **1 por segundo**: leva 1 s para entrar e 1 s para sair. **[código]** |
| Tremida | (1) Em **3 limiares** do hover (0; 0,2; 0,3 → nos primeiros ~300 ms), o card recebe um empurrão para uma **direção aleatória**, com amplitude que cai de 1 para 0 até o hover chegar a 0,6. O deslocamento segue o alvo com `lerp 0,2` por quadro. (2) O ponto de foco **oscila rápido** (`cos(t·20)`, `sin(t·30)`) com amplitude de 75% da altura nos primeiros 0,3 do hover, e depois para. É um **tremor curto que morre em ~0,3 s**, não um tremor contínuo. **[código]** |
| Desfoque | **Profundidade de campo** com mapa de profundidade (`home_depth.webp`), 12 amostras de paralaxe e 6 de blur. O foco **segue o mouse**, e o que está fora do plano fica desfocado. `dofRangeOffset` vai de 0 a −0,5 a 0,75/s. Há também um zoom de mola (`SecondOrderDynamics(f = 2,2, z = 0,7)`). Nas capturas, a 400 ms a imagem aproxima de leve e o título desliza ~65 px. **[código + captura]** A imagem da nota (Atlas) mostra o desfoque com uma trama fina por cima. |
| Celular | **Sem hover** (`useMobileLayout`). **[código]** |

**Para a INET, sem mapa de profundidade:**
- `filter: blur()` de 0 → ~4 px e voltando para ~1,5 px, junto de `scale` 1 → 1,04.
- Uma tremida de 3 empurrões aleatórios (±4 a 6 px, em 300 ms, amplitude caindo) no `x/y` da imagem, com mola do Framer.
- Opcional: uma camada de ruído fino (`mix-blend-mode: overlay`, opacidade 0,15).
- Só com `@media (hover: hover)`, e nada com `prefers-reduced-motion`.
- Desfoque em imagem grande custa caro: aplicar só na imagem do card em hover, com `will-change: filter` apenas durante o hover.

---

## lusion.co/about — o que vi (para aprender; o formato não entra no P6)

- **Abertura:** uma cena 3D escura de tela inteira, com "LUSION" gigante em branco sobre partículas.
- **Rolagem:** a câmera desce para um terreno lunar com um astronauta e um feixe de luz. Os textos ficam nos cantos ("WE ARE LUSION / A CREATIVE PRODUCTION STUDIO" à esquerda e "CRAFTING UNIQUE DIGITAL EXPERIENCES" à direita), presos enquanto a cena muda.
- **Depois:** frases soltas que se alternam de lado (esquerda alta, direita baixa) e um rosto feito de linhas de luz ("TEAM").
- **Lição para a INET:** texto nos **cantos opostos** com a mídia no meio, o que preenche as laterais sem centralizar tudo.
