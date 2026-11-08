# Teste 1: revisão final (Vigia, 27/10/2026)

Revisão dos itens a a e do Teste 1 no P6 (http://localhost:8086), branch `rodada-4-dinamismo`. O Vigia não editou código.

**Veredito geral: APROVADO COM RESSALVAS.**

## Como foi medido

- **Capturas sem janela:** `capwheel.mjs` (Edge headless + CDP, rolagem por roda, que aciona o Lenis) a 1440x900 e 375x812.
- **3 modos:**

  | Modo | Como foi emulado | O que a página viu (`matchMedia`) |
  |---|---|---|
  | NORMAL | sem emulação | — |
  | REDUCED | `setEmulatedMedia prefers-reduced-motion: reduce` | `reduced=true` |
  | TOUCH | `setTouchEmulationEnabled` | `hover:hover=false`, `pointer:coarse=true` |

- **Páginas:** Home, Internet (que contém a Casa inteligente: Segurança e Alexa), TV e Móvel.
- **Onde estão as capturas:** em `C:/Users/yuzzi/AppData/Local/Temp/claude/vigia/fin/`. As folhas de contatos estão em `vigia/tools/sheets/` (`fin-*`, `red-*`, `v6-*`, `touch-home`).
- **Provas automáticas:**
  - `npx tsc -b`: código 0.
  - `npx vite build`: código 0 (30,7 s), gerado no meu `outDir` temporário.
- **Overflow a 375:** `scrollWidth = clientWidth = 375` em `/`, `/internet`, `/tv` e `/movel`. Zero rolagem horizontal.
- **Mojibake:** nenhum (busca por `Ã.`/`Â.` no texto da página, nas 4 páginas).
- **Console:** nenhuma exceção em nenhuma das 22 rodadas (8 NORMAL, 8 REDUCED, 3 de hover e 3 de toque). Só os avisos conhecidos: 2 do React Router (future flags) e o do Framer ("container has a non-static position", só na Home).

## Por item

| Item | Dono | Veredito | Resumo |
|---|---|---|---|
| a) FiberTube | Abissal | **APROVADO COM RESSALVAS** (v6) | v4 reprovada, v6 contínua e atrás do conteúdo |
| b) ReelUnfold | Meridiano | **APROVADO** | Colisão de rótulos corrigida durante a revisão |
| c) Menu | Maestro | **APROVADO** | Escurece sobre a neve depois da correção das 09:14 |
| d) MediaCard | Moldura | **APROVADO** | Cards grandes crescem com a rolagem |
| e) HoverJitter | Trilho | **APROVADO COM RESSALVA** | Funciona; mais sutil que o lusion |
| Extra: REDUCED | Maestro | **APROVADO** | Home, TV e Móvel renderizam sem erro |

### a) FiberTube (Abissal), três versões vistas nesta revisão

**v4 (por seção), REPROVADA.** Capturada às 09:00.
- O tubo passava **por cima** do texto em seções cujo `.wrap` não tem `position`. O `FiberTube` em `z-0` pinta acima de blocos não posicionados.
- Onde aconteceu:
  - Home, título "Dúvidas sobre" e resposta da FAQ, a 1440 e a 375 (`fin/n-home/n-1440-11.jpg`, `n-375-13.jpg`);
  - `/internet`, parágrafo da Segurança "você acompanha… sem travar" (`fin/n-internet/n-1440-08.jpg`).
- Visualmente ficou **picado**: trechos soltos que terminam com ponta redonda no meio da tela (`n-1440-10`).

**v5 e v6 (tubo contínuo único, o meio-termo pedido pelo Maestro).**
- **Atrás do conteúdo:** o SVG fica no `Layout`, em `z-0`, antes do `<main z-10>`. As letras ficam por cima da fibra: o parágrafo da Segurança continua legível (`fin/v5-internet/v-1440-08.jpg`). Nos cards translúcidos a fibra aparece atenuada; nos vãos, inteira.
- **Seções claras:** a camada `#F4F7FB` cobre a fibra. Sem clareamento nem neon sobre texto escuro.
- **Continuidade:** em S amplo, de ponta a ponta. Parece **um tubo contínuo**, no estilo lusion. Ver `v6-home-1440`, `v6-internet-1440` e `fin-movel-1440`.
- **A 375:** cruza a coluna de texto na diagonal, sempre atrás das letras. A leitura se mantém (`v6-home-375`).
- **REDUCED:** traçado completo e estático; o pulso não roda (`red-*`).

Ressalvas da v6:
1. **Pulso:** pausa só com a aba oculta. Como o SVG tem a altura do documento (cerca de 10 mil px), não existe "fora da tela": o pulso anima `strokeDashoffset` o tempo todo, com a aba visível. **FPS não medido.** Se pesar num celular fraco, pausar o pulso quando `scrollY` estiver parado há mais de 3 s, ou limitar o pulso a uma janela perto da tela.
2. **Detalhes da v6 conferidos só no código:** o véu fixo do topo (`FiberTube.tsx:209`, `h-28`, `z-0`) e a opacidade menor do núcleo. Nas capturas, a fibra não aparece por trás da pílula do menu.

### b) ReelUnfold (Meridiano), APROVADO

- **Textos:** conferidos contra a página e o código aprovado ("comodato" já estava em `HEAD:src/pages/Tv.tsx`). Nenhum inventado.
- **Caixa-alta:** o playLabel "Assistir ao vivo" e o selo "Receptor em comodato" não usam caixa-alta. "INET • TV" (palavras convergentes) é a marca.
- **Achado e corrigido nesta revisão:** a 1440, os rótulos "Disney+" e "HBO Max" vazavam pelo overlay e colidiam com "Centenas de filmes…" e "Recurso multitela…" (`fin/n-tv/n-1440-08.jpg`). O Meridiano aplicou `labelOpacity` [0,60 → 0,70]; reconferido em `fin/v5-tv/v-1440-08.jpg`, sem colisão.
- **Movimento:** o painel entra inclinado e menor (`v-1440-06/07`) e se abre plano (`08`). A 375 e no REDUCED fica estático, em fluxo normal.

### c) Menu (Maestro), APROVADO

- **Antes da correção (09:00):** a 1440, sobre a seção neve, a pílula ficava clara e os itens brancos sumiam (Home "Fibra óptica…", FAQ de `/internet` e de `/tv`).
- **Depois (`Header.tsx` salvo às 09:14):** a pílula escurece sobre a neve (`fin/v5-internet/v-1440-10.jpg`, `v5-home/v-1440-09`). Sobre fundo escuro, volta ao vidro.
- **A 375:** a pílula compacta fica legível em todas as seções.

### d) MediaCard (Moldura), APROVADO

- Os dois cards grandes da Home ("Sua casa sempre à vista" e "Fale e a casa obedece") crescem com a rolagem (`v6-home-1440` 07/08; medido antes: escala 0,7 → 1 com clip-path).
- As âncoras `/internet#seguranca` e `#alexa` funcionam (conferido na rodada anterior).
- A 375, uma coluna.

### e) HoverJitter (Trilho), APROVADO COM RESSALVA

A sonda lê `[data-hover-jitter-media]` durante o hover:

| Modo | Resultado | Arquivo |
|---|---|---|
| NORMAL 1440 | Tremida (translate de ±0,3 px) e `blur` de 0,06 px → 0 nos primeiros quadros; assenta em `scale(1.02)` | `fin/h-norm.json` |
| REDUCED | `transform: none`, `filter: none`, 0 animações | `fin/h-red.json` |
| TOUCH 375 | `transform: none`, `filter: none`, 0 animações | `fin/h-touch.json` |

Ressalva: o efeito é bem mais sutil e curto que o do lusion (cerca de 200 a 360 ms, contra a rampa de 1 s com desfoque de profundidade). É uma escolha de gosto e fica com o Maestro.

### Extra: REDUCED do CinematicCanvas, APROVADO

Home, TV e Móvel renderizam a 375 e a 1440 com `prefers-reduced-motion`, com zero exceções (`fin/r-*.json`, folhas `red-*`). O `ReferenceError: drawFrame` não voltou.

## Fora do escopo, só para registro

- O rótulo caixa-alta "SEGURANÇA" sobre o título em `/internet` (e "WI-FI", "CASA INTELIGENTE COM ALEXA") continua. É o item 6 da auditoria anti-IA, decisão do Maestro.
- **Não medido:** FPS em aparelho real, 768/1024/1920 px e o modo claro (o P6 não tem).
