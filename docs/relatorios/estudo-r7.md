# Estudo R7 — como os 7 sites preenchem as laterais e trocam o fundo

Autor: Vigia (Claude), 27/10/2026. Pedido: nota do Filipe "estude-esses-sites-para-fazer".

**Método.** Os sites foram abertos num Edge sem janela, por `cap.mjs`, a 1440x900 e 375x812, em 5 a 8 paradas de rolagem.
- Lusion, Active Theory e a hero do refokus usam rolagem virtual: `scrollTo` não move a página (a altura do documento é de 900 px). Para eles, criei o `capwheel.mjs`, que rola com eventos de roda em passos de 120 a 900 px.
- O Active Theory com WebGL por software mostrou "YOUR BROWSER IS NOT SUPPORTED". Refiz com WebGL por GPU (`--use-angle=d3d11`), ainda sem janela, e a cena apareceu.
- Capturas em `docs/relatorios/estudo-r7/vigia/<site>/`.

Descrevo só o que aparece nas capturas.
- **Não medi:** FPS, curva de easing nem duração.
- **O que veio do código:** os números do refokus (30%→90%, escala 2→1). O Trilho os leu em `js.refokus.com/main.js`, e eu confirmei o efeito nas capturas do `/about`.

---

## 1. https://lusion.co — inspiração principal

| | O que vi |
|---|---|
| Laterais | Um **tubo 3D azul grosso** atravessa as seções e sai pelas bordas esquerda e direita (frames `fino-1440-08..12`). O texto fica em **colunas assimétricas**: título enorme à esquerda, parágrafo à direita (x≈734). Os títulos são grandes e quase tocam a margem. Há cruzinhas "+" alinhadas no grid, nas margens. |
| Fundo por seção | A página é clara (#F0F1FA, aprox.). A cena 3D do topo fica dentro de uma **janela escura de cantos arredondados**, com margem em volta. Cada seção traz a própria mídia emoldurada, sem fundo único. |
| Ritmo | Rolagem suave (virtual). O vídeo fica preso enquanto troca de cena por várias rolagens. |

**A mídia que cresce até a tela (o pedido D)**, frames `lusion/fino-1440-10` a `17`:
1. **Partida:** um card pequeno de **~580x325 px** na coluna esquerda (x=72, a mesma margem do título), raio de ~16 px e imagem em **duotone azul**. O parágrafo fica à direita, e o tubo azul passa por trás do card.
2. Embaixo do card aparecem as palavras gigantes **PLAY** e **REEL**, claras e separadas (PLAY em x≈355, REEL em x≈830).
3. **No caminho**, o card cresce e vai para o centro. Durante a transição ele se **deforma**: as bordas encurvam e ele vira um trapézio, num shader WebGL (`fino-1440-12`). A cor passa do duotone para a cor real.
4. **Chegada:** **~1290x600 px**, com margem lateral de **72 px** (a mesma do grid, não 100vw), raio de ~16 e centralizado. PLAY e REEL ficam brancos sobre o vídeo, com uma pílula branca de play entre eles.
5. O card **fica preso** enquanto o vídeo troca 6 cenas. Depois sobe, e entra "Featured Work" (grade de 2 colunas larga).
6. **A 375 px:** não há crescimento. É um card fixo com botão de play e faixas de texto correndo ("▶▶ PLAY REEL") acima e abaixo.

**Copiável no nosso stack (sem WebGL):**
- Uma seção de ~250svh com filho `sticky`.
- `useScroll` + `useTransform` para animar `width` de ~40% para `calc(100% - 2*margem)`, `x` da esquerda para 0 e o filtro do duotone até `none`.
- A deformação, imitada por um `rotateX`/`skewY` pequeno que vai e volta a 0 (opcional).
- Duas palavras grandes que convergem com `x`.
- No celular, uma versão estática.

## 2. https://activetheory.net — principal para as laterais

| | O que vi (GPU, `activetheory/gpu-*.jpg`) |
|---|---|
| Laterais | **Uma única cena WebGL de ponta a ponta.** Uma nuvem de partículas (verdes, amarelas e azuis, com bokeh) ocupa a tela inteira, das bordas ao centro. Depois, **painéis 3D flutuantes em perspectiva** (telas inclinadas) enchem a metade direita. O título **"CREATIVE DIGITAL EXPERIENCES"** é enorme, monoespaçado e alinhado à esquerda, ao lado de uma coluna estreita de texto pequeno. O menu é uma pílula de vidro no canto superior direito. |
| Fundo por seção | Não há seções de HTML. A **câmera voa** por cenas diferentes (anel → floresta de partículas → painéis), e a cor da luz muda (verde-azulado → violeta). Brilho ciano nos cantos (a 375 px, um halo forte no topo). Grão visível. |
| Ritmo | Rolagem virtual e lenta. Cada rolagem é um avanço de câmera. |

**Copiável:**
- Partículas em canvas 2D ou instanciadas, ocupando 100% da largura, com profundidade por tamanho e desfoque.
- Cards em perspectiva (`rotateY` de 15 a 25°) presos na lateral.
- Título grande alinhado à margem esquerda.
- Halo de luz no canto, em vez de vinheta central.

## 3. https://www.apple.com — fundo por seção

| | O que vi |
|---|---|
| Laterais | Cada produto é um **bloco de ponta a ponta** (100vw), com o produto enorme ocupando o bloco. Mais abaixo, a grade tem 2 blocos por linha e calha de ~12 px, e cada bloco tem fundo próprio. O carrossel "Endless entertainment" **sangra pelas duas bordas**: os itens aparecem cortados à esquerda e à direita. |
| Fundo por seção | **Cor sólida por bloco**, alternando cinza-claro, preto e branco, com corte seco entre blocos. A imagem do produto faz o papel de fundo. |
| Ritmo | Rolagem nativa. Pouco movimento na Home. |
| 375 px | Um bloco por tela, empilhado, mantendo a cor própria de cada um. |

**Copiável:**
- `<section>` com fundo próprio (navy-ink, navy-deep e um bloco claro) e corte seco.
- Um carrossel que sangra até a borda (`margin-inline: calc(50% - 50vw)`).

## 4. https://linear.app

| | O que vi |
|---|---|
| Laterais | A **interface do produto em tamanho grande**, cortada na borda: o quadro de tarefas passa da margem direita (`home-1440-3`). Seções de **duas colunas assimétricas**, com o título à esquerda e o texto à direita. Uma grade de 3 colunas com **desenhos isométricos de linha** e divisórias finas verticais. Uma faixa de logos de ponta a ponta. |
| Fundo por seção | Quase preto e uniforme. A troca de seção é marcada por linhas finas e pelo brilho da interface, não pela cor. |
| Ritmo | Nativo, sem cena. |

**Copiável:** mídia que sangra só para um lado; linhas de grade finas (1 px, 6 a 8% de opacidade) delimitando colunas.

## 5. https://locomotive.ca/en

| | O que vi |
|---|---|
| Laterais | O hero é um **vídeo de ponta a ponta**, com o título no canto inferior esquerdo. O layout é **editorial assimétrico**: rótulos pequenos soltos nas bordas ("Running", "Seven Years", "2018-2024"), mídia fora do centro e uma lista de projetos com nomes serifados enormes entre **réguas finas que vão de margem a margem** (12 px). O parágrafo, em letra grande, ocupa a largura toda. O rodapé tem o endereço em texto gigante, com glifos. |
| Fundo por seção | Vídeo escuro no topo e depois branco puro. Sem gradiente. |
| 375 px | Mesma linguagem: réguas, nomes grandes e mídia à direita. |

**Copiável:** réguas horizontais de ponta a ponta entre itens de lista; metadados pequenos ancorados nas margens; texto grande ocupando a largura.

## 6. https://cowboy.com

| | O que vi |
|---|---|
| Laterais | **Foto ou vídeo de ponta a ponta** em quase todas as seções, com o título grande alinhado à esquerda. Há um **mosaico de fotos em colunas desencontradas** (alturas escalonadas) cobrindo a largura (`home-1440-5`). Uma lista presa à esquerda troca a foto à direita (`home-1440-4`). Uma faixa de prêmios em cards ocupa a largura. Abas numeradas (01. Origins… 04.) se espalham pela base de um close de tela cheia. |
| Fundo por seção | Alterna foto cheia, cinza-claro e preto, com corte seco. |
| Ritmo | Nativo. O texto "Power so natural, you're always in flow." se acende palavra por palavra com a rolagem. |

**Copiável:** mosaico escalonado (`translateY` diferente por coluna, com paralaxe leve); lista presa à esquerda com mídia à direita; texto que acende por palavra.

## 7. https://www.refokus.com — celulares e vídeo da lateral

- **Celulares girando:** **não apareceram** na Home nem no /about atuais (capturas a 1440 e 375). O HTML da Home não tem mockup de celular. Não descrevo um giro que não vi. O Trilho criou o `ScrollSpin` a partir do pedido, não de uma cena observada.
- **Vídeo puxado da lateral para o centro** (`/about`, frames `refokus-about/w-1440-10..13`): uma **fileira de mídias**. A do meio começa estreita (~30% da largura, pelo JS) com a imagem ampliada dentro (escala 2) e se abre até ~90%. As vizinhas encolhem e saem pelas bordas. Tudo é preso à rolagem (GSAP ScrollTrigger com `scrub 2`, segundo o JS lido pelo Trilho).
- **Na Home:**
  - O hero é uma **cortina de barras verticais roxas** de ponta a ponta, com o logo 3D pendurado.
  - Ao lado do texto, uma **mídia vertical presa na coluna esquerda** (392x580, x=36) enquanto o texto da direita **acende palavra por palavra**.
  - Uma faixa de logos corre de ponta a ponta.
  - Os casos aparecem em **faixas de cor cheia** (laranja), na largura toda.

**Copiável:**
- A fileira com a mídia central que se abre (`width` 30%→90% e `scale` da imagem 2→1 com `useTransform`).
- A mídia presa à esquerda.
- O texto que acende por palavra.

---

## Resumo para a INET

| Pedido | Técnica | De onde |
|---|---|---|
| A. Laterais preenchidas | Título grande na margem e colunas assimétricas | lusion, activetheory, linear |
| | Mídia que sangra até a borda | apple, linear, cowboy |
| | Réguas de ponta a ponta | locomotive |
| | Mosaico escalonado | cowboy |
| | Partículas na largura toda | activetheory |
| B. Fundo por seção | Cor sólida por bloco com corte seco | apple, cowboy |
| | Mídia emoldurada por seção | lusion |
| | Cena que muda de luz | activetheory |
| C. Giro e lateral→centro | Fileira com a mídia central abrindo de 30% a 90% | refokus /about |
| | Celular girando | não observado no refokus atual |
| D. Crescimento | Card pequeno à esquerda → ~90% da largura, preso, com duotone → cor | lusion |

Sempre dentro da paleta da INET (navy, electric, ciano e lime), sem vermelho, sem degradê roxo-azul e com versão estática para `prefers-reduced-motion` e para o celular.
