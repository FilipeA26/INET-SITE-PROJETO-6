# Teste 1 — Moldura — fase 1, estudo do item d

27/10/2026. Somente documentação e evidências. **Nenhum arquivo em `src/` foi alterado nesta fase. Implementação aguarda a mensagem explícita PODE CODAR do Maestro.**

## Escopo e fontes

Li a nota `image-c-users-yuzzi-maest-3`, incluindo a delimitação das linhas 4–13, e abri suas seis imagens referentes ao tubo, PLAY REEL, Featured Work e hover. A imagem `b1d8ca40-0135-4920-80bd-7ab5a10dfb31.png` é a referência direta do meu item: duas mídias grandes com cantos arredondados. A `7bd2a0bc-317e-44ba-86a1-6a131cd555a9.png` mostra o desfoque durante interação. Não usei imagens do Lusion como assets do INET.

Fontes primárias: https://lusion.co e https://lusion.co/about. HTML atual de ambas e JS `/_astro/hoisted.CUO_IjfL.js` guardados em `source/`. Consultei também `docs/relatorios/estudo-r7.md` e `docs/relatorios/estudo-r7/meridiano/estudo-lusion.md`, distinguindo sugestões antigas de observações atuais. O formato /about, valores e tela final não fazem parte da implementação deste teste.

## Capturas e observações

Usei exclusivamente Edge headless isolado pelo `capwheel.mjs` do Vigia, com porta livre, WAIT=9000 e GPU=1. Não usei a tela do Windows. A rolagem virtual do Lusion mantém `scrollY=0` e a altura do documento igual à viewport: esses números não significam que a roda deixou de funcionar. As imagens mostram o avanço real das cenas.

| Evidência olhada | Observação |
| --- | --- |
| `lusion1440/fw-1440-05.jpg` | Featured Work: título grande; mídias em duas colunas. Margens visuais de aproximadamente 72 px, vão de aproximadamente 30 px; não é uma mídia literalmente de borda a borda da viewport. |
| `lusion1440/fw-1440-07.jpg` | Linhas seguintes mantêm duas colunas; imagens próximas da proporção 1,54:1; título e categoria abaixo, fora da mídia. |
| `lusion1440/fw-1440-hover-400ms.jpg` | Registro de hover sobre outra posição do grid. Nesta execução, 7 passos já haviam passado de Everswap; não atribuo a esse frame a medição de hover do Vigia. |
| `lusion375/fw-375-07.jpg` e `-10.jpg` | Uma coluna, aproximadamente 15 px de margem. Imagem grande, categoria e título abaixo. Não comprimir duas colunas em 375 px. |
| `about1440/about-1440-03.jpg` | Cena ocupa toda a largura e textos ocupam dois lados; aprendizado de composição apenas, sem copiar o layout /about. |

Foram geradas 14 capturas da Home em 1440, 11 em 375 e 6 do /about em 1440. Examinei os frames citados; não afirmo ter examinado todos os arquivos gerados. As três execuções terminaram sem exceções reportadas. Não houve medição de FPS ou curva fina. Não fiz capturas do INET, tsc ou build nesta fase documental: não há implementação nova para validar.

## Técnica confirmada no código do Lusion

O trecho `class ProjectItem`, salvo em `source/ProjectItem-excerpt.txt`, carrega `home.webp` e `home_depth.webp` em `UfxMesh`. Define PARALLAX_SAMPLES=12 e BLUR_SAMPLES=6. Usa SecondOrderDynamics para foco/zoom, limiares de hover 0/0.2/0.3 e oscilação de foco com cos(time*20)/sin(time*30), decaindo na entrada do hover.

O fragment shader usa `getRoundedCornerMask(baseUv, u_domWH * mix(0.7,1.,u_showRatio), ...)` e UV com `mix(0.75,1.,u_showRatio)`. Portanto há uma revelação visual de menor para maior. `u_showRatio` é alimentado por showTime com expoOut em 1,5 s; também há entrada lateral e rotação que convergem em 2 s. **Não é correto afirmar que o original é simplesmente um CSS scale vinculado linearmente ao scroll.** A tradução pedida para INET será dirigida por useScroll e não uma cópia do renderer WebGL.

## Proposta concreta após PODE CODAR

1. Criar um único componente de card de mídia em arquivo próprio sob `src/components/`, sem mudar globalmente FeatureCard ou os cards de planos. Grade larga de duas colunas a partir de 768 px e uma coluna no celular. Imagem com proporção reservada, cantos arredondados, título e descrição abaixo. Usar o grid e as margens existentes do site; não adicionar 100vw com margem negativa que provoque overflow.
2. Reservar a geometria final desde o primeiro render. Animar somente a camada visual interna com scale de aproximadamente 0,70 até 1 e/ou clip-path; limites e intervalo de scroll serão ajustados nas capturas. Usar useScroll/useTransform e curva EASE do projeto, sem animar width/height, sem setState por frame e sem um segundo canvas. Título e foco do link permanecem estáveis.
3. Home, seção Serviços: substituir a predominância da grade de ícones por uma dupla de mídia com `/casa/seg-poster.webp` e `/casa/alexa-poster.webp`, títulos existentes “Sua casa sempre à vista.” e “Fale e a casa obedece.”, links `/internet#seguranca` e `/internet#alexa`. Manter os seis destinos de serviços existentes como navegação complementar, sem excluir serviços. As duas imagens foram abertas e conferidas: câmera Mibo com mão sobre o equipamento; Alexa no ambiente. Evita repetir imediatamente casa-inteligente do Hero ou receptor do ExpandMedia/INET TV. O enquadramento da Alexa deve preservar o aparelho à direita com object-position apropriado.
4. Internet, conjunto Casa inteligente: organizar as entradas de Segurança e Alexa em dupla de mídia usando os mesmos pôsteres e textos já existentes no SmartHome. Manter IDs `casa-inteligente`, `seguranca` e `alexa`, detalhes e CTAs; não apagar informações dos blocos atuais. Evitar repetir pôster como fundo imediatamente após o card: os detalhes podem usar o produto Mibo e a composição Alexa já existentes. Validar o conjunto antes de ampliar para outras páginas.
5. TV permanece fora da primeira aplicação: o receptor já aparece no Hero, na cena de giro e na seção de produto; acrescentar outro card dele reforçaria repetição. Não tocar PlanCarousel, preços, Header, Combo ou cenas dos colegas.

Essa é uma proposta de implementação, não trabalho já executado. Os valores de scale e breakpoints são decisões propostas e serão verificados visualmente; não são medições do Lusion.

## Integração com o Trilho

Contrato final de estudo recebido e conferido em `docs/relatorios/teste1/trilho/ESTUDO-HOVER.md`: `HoverJitter` recebe children, className, mediaClassName, disabled e intensity=1|2|3 (default 2). cursorLabel fica fora da primeira versão. Proposta inicial do colega: 360 ms, 2 px e blur de 0,65 px, a calibrar no INET; não são medições do original. O link envolve o componente; HoverJitter envolve apenas a mídia. Estrutura prevista: link → área da mídia → camada de expansão → HoverJitter → img; título e CTA são irmãos da área de mídia. Assim, as duas animações não disputam o mesmo transform. O componente ainda não foi criado, pois também aguarda PODE CODAR.

Hover somente com mouse e `(hover: hover) and (pointer: fine)`. Celular e prefers-reduced-motion sem tremida; com movimento reduzido a imagem deve aparecer inteira, scale 1 e sem recorte animado. Foco visível e texto legível durante todos os estados. Não importar profundidade, shaders, cromatismo vermelho ou sons do Lusion.

## Provas exigidas quando houver implementação

Rodar `npx.cmd tsc -b` por página e `npx.cmd vite build`; capturar e olhar Home/Internet em 375 e 1440, com frames antes/durante/depois da expansão, além de hover e versão reduzida. Conferir zero overflow horizontal, console, âncoras 90 px, geometria estável, título fora do recorte e imagens sem repetição imediata. Não declarar 60 fps sem medir.

## Arquivos desta entrega e pendências

Somente este relatório, capturas em `lusion1440/`, `lusion375/`, `about1440/` e fontes em `source/`. Nenhuma modificação em src, nenhum commit, nenhum acesso a TESTE 2 ou TESTE 3. Pendente: autorização explícita PODE CODAR, implementação, contrato final do hover e validação local posterior. Itens a/b/c/e são dos respectivos colegas.
