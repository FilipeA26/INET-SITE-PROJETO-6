# Relatório de Implementação · Fóton (FiberTube & ReelUnfold)

**Projeto:** INET SITE TESTE 2 (Porta 8087)  
**Data:** 27/10/2026  
**Autor:** Fóton (Construtor INET Testes Lusion)  
**Arquivos sob minha responsabilidade:** `src/App.tsx`, `src/components/lusion/FiberTube.tsx`, `src/components/lusion/ReelUnfold.tsx`, `src/components/lusion/index.ts`. (Ajuste de tipagem autorizado pelo Maestro em `WorkCard.tsx`).

---

## 1. Item 1: FiberTube (Cabo de Fibra do Lusion.co)

### Técnica escolhida e justificativa: SVG com `stroke-dashoffset` (e não Canvas 2D)
- **Um único `<svg>` absoluto da altura do documento** montado dentro do `#top`. O navegador rola o SVG junto com o fluxo do DOM, sem reposicionar matrizes a cada quadro.
- A cada quadro rAF mudam apenas o `stroke-dashoffset`, a cabeça de luz e os pulsos luminosos de dados. Um Canvas 2D da altura da página (9.000 a 13.000 px) exigiria repintar uma área colossal a cada quadro com gerenciamento pesado de `dpr` e memória de GPU; um Canvas 2D fixo exigiria recalculação contínua de coordenadas locais. O SVG é muito mais leve, nítido e consome quase zero CPU.
- **Sem filtros SVG caros (`filter="url(#blur)"`)**: o brilho volumétrico é construído com traços sobrepostos em multi-pass:
  1. Halo externo `#0062EC` com opacidade atenuada;
  2. Bainha protetora `#03256C`;
  3. Corpo principal em gradiente linear da paleta oficial (`#003F99 → #0062EC → #38B000 → #70E000` com `spreadMethod="reflect"`);
  4. Faixa de brilho interno translúcida `#FFFFFF`;
  5. Núcleo de fibra verde-limão vibrante `#B9F57A`.
  - Zero uso de vermelho, estritamente na paleta da INET.
- **Amostragem em tabela**: na montagem, a curva é pré-amostrada a cada ~6 px em uma tabela de busca binária, eliminando chamadas repetitivas a `getPointAtLength()` dentro do laço de animação.
- **Inércia suave**: além do Lenis, o cabo persegue o avanço do scroll com amortecimento próprio (0.055 por quadro a 60 Hz ajustado pelo `dt`), pousando suavemente.
- **Pulsos de luz**: pacotes luminosos descendo pelo trecho já desenhado a 150 px/s (110 px/s no celular), espaçados em ~1,1 tela e calculados apenas no campo visual ativo.

### Traçado e preservação da leitura
- O cabo serpenteia estritamente pelo meio da margem lateral do `.wrap` (`clamp(1.25rem, 4vw, 5rem)`), ficando fora da caixa de leitura dos textos e cards.
- **Cruzamento de tela**: só cruza a tela nas faixas vazias entre o final do conteúdo de uma seção e o início da seguinte, em uma curva suave "S" com tangentes verticais (inspirado no lusion.co). Se o espaço for insuficiente, continua pela mesma margem.
- `pointer-events: none` absoluto e z-index intermediário (z-20), abaixo de menus, HUDs e botões flutuantes (z-50).

### Celular e movimento reduzido
- **Celular (< 640 px)**: espessura reduzida para 6 px, sem halo pesado, com cabeça de luz compacta e um pulso único.
- **`prefers-reduced-motion: reduce`**: tratado tanto em CSS (`stroke-dasharray: none`, pulsos ocultos) quanto em JS (desenho estático completo, laço pausado).
- Pausa estrita em aba oculta (`visibilitychange`).

---

## 2. Item 2: ReelUnfold (Puxada 3D do Vídeo / PLAY REEL)

### Técnica e mecânica de desdobramento
- **CSS 3D com Framer Motion e molas oficiais (`SPRING` de `src/motion.ts`)**:
  - Respeita rigorosamente a Regra Dura de **no máximo um canvas WebGL por página** (o WebGL da página pertence ao R3F do Wi-Fi 6).
  - Seção com `height: 250svh` e palco `sticky top-0 h-[100svh]` com `perspective: 1400px`.
  - **Entrada em folha curvada**: começa em escala 0.56, deslocado lateralmente (`x: -6%`), inclinado em 3D (`rotateX: 22deg, rotateY: -18deg, rotateZ: 3.5deg, skewY: -6deg, skewX: 2deg`) e com `borderRadius` assimétrico deformado (`26% 8% 24% 6% / 14% 10% 22% 8%`), replicando com fidelidade visual a malha 32x32 do Lusion.
  - **Tingimento azul ótico (Lusion Blue Tint)**: quando pequeno, o painel recebe uma camada com gradiente `#003F99 → #0062EC → #1A2FFB` e `mix-blend-mode: color` com opacidade inicial de 88%. Conforme o usuário rola a página, esse tingimento se dissipa suavemente até 0, fazendo as cores reais dos produtos "acenderem" na tela.
  - **Brilho especular**: feixe de luz que desliza pela curvatura do painel enquanto ele desentorta.
  - **Abertura completa**: ao alcançar 84% do progresso, o painel atinge escala 1.0, rotações e skews zerados, bordas retas (0px) e preenche a viewport de ponta a ponta.

### Conteúdo real da INET (sem invenções)
- **Produtos reais de `public/`**:
  - Centro (herói): Receptor INET TV Box e controle remoto (`/inet-tv-receptor.webp`);
  - Esquerda: Smartphone com conexão móvel 5G da INET (`/movel/site-mobile.webp`);
  - Direita: Câmera Wi-Fi residencial inteligente (`/casa/mibo.webp`).
- **Tipografia monumental**: "INET" e "FIBRA" em `font-display` vazada/iluminada atravessando o painel de ponta a ponta.
- **Badge ótico**: pílula central com ponto verde-limão pulsante "Fibra de ponta a ponta".
- **Cruzes óticas (`+`)**: marcadores de grade nos 4 cantos inspirados no lusion.co.

### Celular e movimento reduzido
- **Celular (< 640px)**: altura adaptada para 190svh, escala proporcional, tipografia em clamp ajustado e dispositivos secundários ocultos para manter foco nítido e zero rolagem horizontal.
- **`prefers-reduced-motion`**: o painel monta imediatamente desdobrado em tela cheia (escala 1.0, 0deg, bordas retas), sem tingimento azul nem brilho especular, estático e nítido.

---

## 3. Integração e Exportações
- `src/components/lusion/index.ts`: exporta `FiberTube` e `ReelUnfold`.
- `src/App.tsx`: monta o `FiberTube` como elemento de fundo global; inclui rota de teste/preview `/reel` para inspeção isolada do ReelUnfold.
- `src/pages/Home.tsx`: integrado pelo colega Lumen, que removeu a antiga `Thread` e montou o `ReelUnfold`.

---

## 4. Provas Técnicas e Validações

1. **Compilação TypeScript (`npx.cmd tsc -b`)**:
   - Exit Code: **0** (Zero erros em todo o projeto).
   - Ajuste autorizado pelo Maestro em `src/components/lusion/WorkCard.tsx`: tipagem de `containerRef` ajustada para compatibilidade com `div`, `a` e `Link`.
2. **Build de Produção (`npx.cmd vite build`)**:
   - Exit Code: **0** (Sucesso total, 0 erros).
3. **Inspeção Visual e Responsividade (`cap.mjs`)**:
   - **Home (`/`)**:
     - Desktop 1440px: `sw = 1440, cw = 1440, overflow = false`.
     - Mobile 375px: `sw = 375, cw = 375, overflow = false`.
   - **ReelUnfold (`/reel`)**:
     - Desktop 1440px (estágios 0, 0.2, 0.4, 0.6, 0.8, 1.0): `sw = 1440, cw = 1440, overflow = false`.
     - Mobile 375px: `sw = 375, cw = 375, overflow = false`.
   - **Reduced Motion**:
     - Testado com emulação de mídia: painel e cabo renderizados estáticos sem exceções no FiberTube/ReelUnfold.
4. **Console do Navegador**:
   - Limpo de exceções nos nossos componentes.

---

## 5. Correção de Camada (Z-Index do FiberTube)
- **Diagnóstico**: O `FiberTube` possuía `z-20` no SVG raiz. Na seção 04 (`ValueCards`), ao abrir em leque o baralho no desktop, a carta 01 ("Internet ultrarrápida") se deslocava para a esquerda e o cabo de fibra cruzava por cima do card.
- **Solução**: Ajustado o SVG de `FiberTube.tsx` para `z-0` (atrás do `<main id="conteudo" className="relative z-10">` e de todos os blocos de conteúdo e cartas). Aplicado identicamente no **Teste 2** e no **Teste 3**.
- **Validação Visual**: Re-capturado em 1440px a 70% de rolagem (`docs/relatorios/_-1440-0.jpg`). A carta "Internet ultrarrápida" agora fica 100% sobreposta e perfeitamente legível, com o cabo correndo elegantemente por trás dela. `tsc -b` e `vite build` testados com sucesso (código 0).
