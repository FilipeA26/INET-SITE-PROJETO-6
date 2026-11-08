
## Trilho — Rodada 4 — 26/10/2026

Arquivos: src/components/Thread.tsx e SideRails.tsx alterados; src/data/laterais.ts criado. Nenhuma página, App.tsx ou CSS central editado.

Thread: removida a segunda inércia de 0,07. A cabeça lê o scroll efetivo escrito pelo Lenis, com filtragem limitada a 1 px em Y; rolagens rápidas não acumulam atraso. Pulsos e nós preservados. RAF pausa fora da Home e em aba oculta; movimento reduzido remove pulsos e RAF contínuo. Observadores e listeners limpos no desmontar.

Laterais: dados tipados derivados de inet.ts, com cobertura, WhatsApp comercial, central do cliente, medidor oficial e duas lojas com endereço confirmado. Contexto por data-lateral, IDs existentes e rota; planos e rodapé confirmados. Transições EASE, links internos pelo router e externos com noreferrer. Só cards recebem ponteiro. Faixa calculada por --content-max com fallback 72rem; compatível com 80rem em >=1536. Exibição >=1440 e faixa real >=136px por lado; em 1440 a barra de rolagem deixa 136,5px, por isso o corte original de 148 foi ajustado. Cards ficam no meio das laterais e não sobrepõem conteúdo ou WhatsApp nas capturas inspecionadas.

Provas:
- npx.cmd tsc -b: sucesso.
- npx.cmd vite build: sucesso; aviso de chunk >500kB do pacote 3D existente, sem erro.
- Impeccable detect nos dois componentes: [] sem achados.
- Portal localhost:8092: capturas efetivamente abertas e inspecionadas em 375x812 e 1440x900. Capturas temporárias maestri-portal-ea5975b1-a0b4-4a12-bac0-311ef09c8d7f.png e maestri-portal-fd3d61c2-7571-40f5-8b6b-e836b83f1c42.png.
- Sem overflow horizontal medido em 375, 768, 1024, 1440 e 1920. Rails ocultos nas três primeiras; 1920: faixa 312,5px com content-max 80rem.
- Medição após rolagem: scroll=3210, alvo Y=3747,6, cabeça Y=3747,5989; diferença ~0,0011px após estabilização. Não medi FPS nem atraso quadro a quadro durante gesto.
- Rodapé: contexto mudou para Loja Centro e Loja Grão Pará com links Como chegar.
- Console: leitura final vazia; na primeira carga houve aviso Framer Motion de container sem posição não estática. Não alterei componentes de terceiros para remover esse aviso.

Limites: reduced-motion e pausa em aba oculta verificados no código, sem emulação automatizada. Não validei disponibilidade dos destinos externos. Nenhum commit, instalação, deploy ou alteração de dados comerciais. Servidor 8092 e portal Trilho QA disponíveis para revisão.

Coordenação feita pela skill Maestri: C:/Users/yuzzi/.agents/skills/maestri/SKILL.md. Moldura inicialmente sem cota; depois Maestro confirmou marcadores e variável, integrados pelo contrato existente.

## Revisão solicitada pelo Maestro — cards compactos

Alterado somente src/components/SideRails.tsx. Abaixo de 200px de faixa lateral livre, renderiza ícone e rótulo curto sem quebra (WhatsApp, Cobertura, Minha conta, Velocidade e nome curto da loja). Card completo somente a partir de 200px livres. Links internos/externos mantidos; title nativo e aria-label contêm título, informação e ação completos. Telefone no card completo usa whitespace-nowrap.

Verificação desta revisão: npx.cmd tsc -b e npx.cmd vite build passaram. Build conserva aviso de chunk 3D acima de 500kB. Detector Impeccable: []. Capturas abertas e efetivamente inspecionadas em 1440x900, 1600x900 e 1920x1080. Em 1440: faixa 136,5px, botão compacto 112,5px, rótulos WhatsApp/Cobertura sem quebra. Em 1600: faixa 152,5px, compacto 128,5px. Em 1920: faixa 312,5px e card completo de 188px, telefone (33) 3536-3939 em uma linha. Nenhum overflow horizontal nos três tamanhos. Conferidos title, aria-label e white-space via DOM. Capturas do portal estavam inicialmente bloqueadas pela janela minimizada; após restaurar a janela foi possível inspecionar todas.

Capturas temporárias inspecionadas: 1440 maestri-portal-46458dbd-19ce-47f4-bfdf-b37b857ef62a.png; 1600 maestri-portal-98f2705f-20a2-4ece-ab2e-161fcb3ba263.png; 1920 maestri-portal-b4b3042c-068d-46a0-a320-c1e8dfd9a826.png. Todas em C:/Users/yuzzi/AppData/Local/Temp.

## Rodada 5 — remoção de cards e bolinha lenta — 26/10/2026

Notas tir ar-esses-cards-latera (nome real tirar-esses-cards-latera) e https-stock-adobe-com-br-ima lidas após o Maestro conectar os recursos. Nenhuma imagem externa baixada. Escopo entregue somente nos dois componentes atribuídos.

Arquivos alterados:
- src/components/SideRails.tsx: removidos cards, links, contextos, import de laterais.ts e observadores de seção. Restam quatro fibras finas por lado com pulsos, aura azul/verde que acompanha a rolagem com a mola existente e decoração sem receber ponteiro. Largura max(0px, (100% - var(--content-max, 72rem))/2), sem mínimo que invada a estrutura centralizada. Moldura confirmou --content-max 72rem fixo e wrap original; não há exceção 80rem. Fibras ocultas abaixo de xl; movimento reduzido sem pulsos; aba oculta pausa pulsos. src/data/laterais.ts preservado intacto.
- src/components/Thread.tsx: retirados traçado aceso, pulsos, nós e fio-base visível. A curva agora existe apenas em defs como geometria invisível. Fica somente a bolinha. Seguimento exponencial equivalente a lerp 0,05 a 60Hz, normalizado pelo delta de tempo para manter a mesma inércia em outras taxas. Tempo de quadro limitado na retomada para evitar salto após pausa. Rebuild preserva posição em vez de reiniciar no resize. RAF pausa fora da Home e com aba oculta. prefers-reduced-motion fixa a bolinha no primeiro ponto e não agenda RAF contínuo. SVG contém o brilho para não gerar overflow horizontal.

Provas:
- npx.cmd tsc -b: passou após as alterações finais.
- npx.cmd vite build: passou após as alterações finais. Aviso já existente de chunk 3D >500kB.
- git diff --check dos dois componentes: passou.
- Detector Impeccable: [] sem achados.
- Capturas SOMENTE com node C:/Users/yuzzi/.claude/scripts/cap.mjs, Edge headless em perfil isolado, URL http://localhost:8086/, paradas 0,0.5,1. Nenhum uso de tela do Windows, desktop, restauração ou foco de janela nesta rodada.
- Capturas abertas e inspecionadas em 1440x900 e 375x812: topo, meio e rodapé. Sem cards laterais; no meio a bolinha aparece isolada sem trilha. As fibras e cabos do fundo global são de outros componentes e permanecem.
- 1440: scrollWidth1440/clientWidth1440, overflow=false. Mobile final: scrollWidth375/clientWidth375, overflow=false. Primeira captura mobile reportou 451px antes da contenção do SVG e do ajuste simultâneo do Moldura nas faixas de index.css; HMR impede atribuir a causa a uma alteração única. Moldura confirmou captura própria final também 375/375.
- Console headless: nenhum erro/exception. Há aviso Framer Motion sobre container sem posição não estática e dois avisos de migração do React Router v7. Portanto console sem erros, mas não literalmente limpo de avisos. Não alterei arquivos alheios para corrigir esses avisos.

Capturas: C:/Users/yuzzi/AppData/Local/Temp/trilho-r5-1440/_-1440-0.jpg, _-1440-1.jpg, _-1440-2.jpg; e C:/Users/yuzzi/AppData/Local/Temp/trilho-r5-375/_-375-0.jpg, _-375-1.jpg, _-375-2.jpg.

Fora do escopo: combo, dados dos planos, fundo submarino e layout central das páginas pertencem aos demais responsáveis. Não medi FPS nem fiz emulação dinâmica de reduced-motion/visibilidade: esses caminhos foram conferidos no código. Capturas estáticas não comprovam sozinhas a cadência da animação. Sem commits, dependências novas ou deploy.

Coordenação e envio pelo CLI conforme skill Maestri: C:/Users/yuzzi/.agents/skills/maestri/SKILL.md.

## Rodada 6 — laterais sem corte e luz sobre o conteúdo

Nota image-c-users-yuzzi-maest lida integralmente. Alterados somente src/components/SideRails.tsx e src/components/Thread.tsx, além deste relatório por acréscimo.

SideRails: removida a aura por completo, eliminando a fonte de corte vertical em vez de apenas espalhar blur. Não há fundo próprio, overflow recortando aura nem curva SVG de moldura. Restam fibras finas, com máscara horizontal que dissolve as pontas no espaço lateral calculado por --content-max, fallback72rem. Mantidos pointer-events-none, aria-hidden, pausa dos pulsos com aba oculta e movimento reduzido.

Thread: SVG agora em portal no document.body, fixed z30, acima das seções z10 e abaixo de menu/botões z50. A geometria continua invisível. A posição exibida é mantida em coordenadas da tela e não é redefinida por build/resize/âncora. O alvo vem da curva na posição efetiva da página; a luz viaja até ele com lerp0,035 normalizado pelo delta de tempo, com limite vetorial de480px/s. Assim uma rolagem instantânea não desloca o SVG inteiro nem teleporta o núcleo. RAF pausa fora da Home/aba oculta. Movimento reduzido mantém a posição estática e não agenda RAF.

Atenuação: elementsFromPoint em cinco pontos do núcleo, no máximo a cada120ms, buscando texto, links, imagens, vídeo, canvas, campos e cards. Sobreposição suaviza opacidade de0,85 para0,22 e blur de0 para5px com constante de240ms. O overlay não recebe cliques nem entra no próprio hit-test. Reconstrução de geometria não redefine a posição já exibida.

Provas:
- npx.cmd tsc -b: passou. A primeira tentativa encontrou useCardGlow temporariamente indefinido em ui.tsx durante a edição do Moldura; ele corrigiu e a repetição passou.
- npx.cmd vite build: passou. Aviso de chunk3D >500kB continua.
- git diff --check: passou. Detector Impeccable: [].
- Capturas somente pelo cap.mjs headless autorizado, URL8086. Home e /movel em1440x900 e1920x1080, paradas0,0.5,1; Home também375x812. Os screenshots de meio de página dos cinco cenários foram abertos e olhados, com foco nos limites laterais. Não aparece o corte de aura nas antigas coordenadas. Sem overflow:1440/1440,1920/1920 e375/375.
- As primeiras capturas1440 coincidiram com erro temporário useCardGlow e foram descartadas e refeitas. Capturas finais dos cinco cenários sem erro/exception. Permanecem aviso Framer de posição de container e dois avisos React Routerv7, portanto console não está literalmente sem avisos.

Pastas de evidência em C:/Users/yuzzi/AppData/Local/Temp/: trilho-r6-home1440, trilho-r6-home1920, trilho-r6-movel1440, trilho-r6-movel1920, trilho-r6-home375. Arquivos _-1440-N.jpg ou _movel-1440-N.jpg e equivalentes para1920/375, N0,1,2.

Limites: não medi FPS, velocidade quadro a quadro nem automatizei mudança de prefers-reduced-motion. A inspeção de capturas confirma composição/cortes; a proteção contra teleporte e a transição sobre conteúdo foram verificadas por leitura do fluxo e limites numéricos, não por vídeo ou série temporal. Itens hero/fundo submarino, cards interativos, preços e exemplos cinematográficos pertencem aos outros responsáveis e não foram alterados. Sem desktop/computer-use, sem commits/deploy/instalações.

Coordenação pela skill Maestri: C:/Users/yuzzi/.agents/skills/maestri/SKILL.md.

## Correção de proximidade dos HUDs — Rodada 6

Alterado somente Thread.tsx. Inicialização e alvo agora ficam abaixo de112px, preservando a faixa do menu de90px e o halo. Halo reduzido de52px para32px de diâmetro; núcleo de7px para4,4px; opacidade livre de0,85 para0,55. Menu/nav, barra de progresso e controles fixed com z-index>=40 entram em teste de proximidade por retângulo expandido24px, inclusive se pointer-events:none; perto deles a opacidade cai suavemente para0,01. Sobre conteúdo comum fica0,16 com blur3px. Inércia e limite de velocidade preservados.

npx.cmd tsc -b passou; npx.cmd vite build passou com aviso conhecido de chunk3D. git diff --check passou. Recapturas feitas exclusivamente com cap.mjs em1440x900, Home, paradas0,0.4,0.8. As três capturas foram abertas e inspecionadas: C:/Users/yuzzi/AppData/Local/Temp/trilho-r6-hud1440/_-1440-0.jpg, _-1440-1.jpg, _-1440-2.jpg. Sem overflow1440/1440; sem exceções, com os avisos conhecidos Framer/Router.

O disco grande sobre Velocidade na captura0.4 permanece, mas foi identificado como puxador64px h16 bg-lime do SlideToSubscribe, não como luz Thread: a bolinha do Thread aparece à direita em y~540 e agora é menor. Moldura verificou e confirmou; Maestro decidiu manter o puxador passando atrás do menu translúcido. Portanto não alterei SlideToSubscribe nem escondi esse controle. Não medi série temporal da proximidade HUD.

## Rodada 7 — SideRails removido e apresentações por rolagem

Entregues SideRails.tsx devolvendo null, src/components/giro/ScrollSpin.tsx, SideToCenter.tsx e InetPhone.tsx. Thread.tsx não alterado nesta rodada. Props exportadas com tipos; API e exemplos em docs/relatorios/estudo-r7/trilho/ESTUDO.md. Moldura montou as cenas em Movel.tsx e Tv.tsx; não editei páginas ou App.tsx. Maestro removeu SideRails/DeepSea do App.

Estudo:28 capturas headless de Refokus Home/about em375 e1440, sete posições por rota. As14 da Home foram abertas; no about foram inspecionadas as posições1,2,3 desktop e1,2 mobile. HTML e JS oficiais salvos junto. Home atual não mostra celulares girando; isso foi informado e Maestro aprovou adaptação CSS3D com assets INET. Código aboutUs do JS oficial confirma vídeo central30%→90%, imagens2→1 e scrub2. Adaptado com sticky+useScroll/useTransform, sem biblioteca/vídeo novo. Refokus3D carregou, não houve tela WebGL preta nos trechos vistos.

Móvel: ScrollSpin com perspectiva, rotateY/X/Z e escala, amplitude menor no celular; InetPhone usa /movel/site-mobile.webp em moldura neutra. TV: SideToCenter variantbox combina giro e mídia direita→centro crescendo em um único trecho sticky; usa /inet-tv-receptor.webp existente. Reduced-motion remove transformações e espaço sticky, deixando apresentação estática no fluxo. Não há loop próprio/canvas/WebGL novo, nem vídeo pesado. Não medi60fps.

Provas finais: npx.cmd tsc -b passou; npx.cmd vite build passou com aviso conhecido do chunk3D. Detector Impeccable []. Capturas locais /movel e /tv em375x812 e1440x900 feitas por cap.mjs, posições0,0.1,0.2,0.3,0.5,1, salvas em docs/relatorios/estudo-r7/trilho/local-*. Capturas centrais abertas e inspecionadas nos quatro cenários, com mudanças de orientação e crescimento visíveis entre posições. Sem overflow375/375 e1440/1440; sem exceções. Avisos Framer/container e React Routerv7 permanecem. Uma execução intermediária de tsc pegou Home sem useScroll enquanto Moldura editava; ele corrigiu e repetição passou.

Limites: não mede FPS nem verifica todos os intermediários do gesto; efeito usa plano CSS3D da fotografia, não modelo360 com verso inventado. Reduced-motion verificado em código. Pesquisa dos outros sites, fundo e estrutura das páginas pertencem aos demais responsáveis. Sem commits, instalações, deploy ou uso da tela.

Coordenação feita pela skill Maestri: C:/Users/yuzzi/.agents/skills/maestri/SKILL.md.

### Conferência das capturas finais do Moldura

Abri os arquivos1 e2 das quatro pastas docs/relatorios/r7/final/movel375, movel1440, tv375 e tv1440, além de ler result.txt. Enquadramento consistente com a implementação: celular inteiro na cena central desktop; no mobile a captura1 já está na saída, com o topo subindo atrás do menu enquanto a próxima seção entra. TV cresce para uma apresentação próxima da tela cheia; o corte inferior desktop e superior mobile na captura1 coincide com a liberação/saída do sticky, não com overflow horizontal. Nas capturas2 as cenas já foram liberadas e o conteúdo seguinte ocupa a tela. Não identifiquei correção necessária a partir dessas imagens. Os quatro resultados medem overflow=false, sem exceções; avisos Framer/Router conhecidos. Entrada lateral e orientação inicial também foram vistas nas capturas anteriores local-* do estudo. Capturas estáticas não demonstram continuidade quadro a quadro.

## SITE TESTE1 — fase1 somente estudo — hover Featured Work

Estudo concluído em docs/relatorios/teste1/trilho/ESTUDO-HOVER.md. Notas e seis PNGs relevantes abertos; HTML e JS atuais do Lusion salvos. Código ProjectItem confirma UfxMesh com mapa de profundidade, paralaxe e blur por amostras, oscilação de foco amortecida na entrada. Sequência headless por roda com hover antes/0/150/400/900ms/depois aberta: desfoque/deslocamento e estabilização confirmados. Capturas375 e1440 de Home/about vistas, sem exceções. About somente aprendizado, sem levar seu formato ao P6.

Contrato proposto: HoverJitter children, className, mediaClassName, intensity1|2|3 default2, disabled. Camada interna independente da expansão do Moldura, tremida finita~360ms, blur leve que retorna a0, só mouse com hoverfine, sem movimento reduzido/toque. Sem RGB ou shader pesado. Exemplo de uso documentado e enviado ao Moldura.

Nenhum arquivo em src/ editado/criado nesta fase. Não rodei tsc/build de componente ainda inexistente. Implementação e provas locais dependem da instrução explícita PODE CODAR. Sem desktop/tela do Windows, commits, deploy ou dependências. Sem tocar TESTE2/TESTE3.
