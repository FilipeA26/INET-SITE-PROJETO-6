# Teste 1 — implementação do item d — Moldura

Implementação iniciada somente após o PODE CODAR explícito do Maestro em 27/10/2026.

## Entrega

- `src/components/MediaCard.tsx`: card de mídia com proporção reservada de 1,54:1, imagem arredondada, título/descrição abaixo e foco visível. useScroll/useTransform aplicam scale 0,70 → 1 e recorte 6% → 0 com a curva EASE de `motion.ts`. Não anima width/height nem usa setState por quadro. Com movimento reduzido, scale 1 e recorte desativado.
- `src/components/SmartHomeMedia.tsx`: dupla com os pôsteres existentes `casa/seg-poster.webp` e `casa/alexa-poster.webp`, textos já publicados e links aos detalhes. Duas colunas a partir de 768 px; uma no celular. A Alexa preserva o equipamento à direita com object-position.
- `src/pages/Home.tsx`: seção Serviços passa a ser liderada pela dupla de mídias largas; os seis serviços continuam acessíveis em links com divisórias, textos e ícones existentes. Não alterei Hero, ExpandMedia, planos, menu, preços ou combo.
- `src/pages/Internet.tsx`: a entrada de Casa inteligente usa a mesma dupla, apontando para Segurança e Alexa; detalhes e âncoras continuam presentes.
- `src/components/SmartHome.tsx`: detalhes deixam de repetir os pôsteres como vídeos de fundo imediatamente após a galeria. Mantidos conteúdo, recursos, aparelho Mibo, composição Alexa e CTAs. Nenhuma lógica comercial alterada.

O HoverJitter do Trilho está importado no MediaCard: link → área fixa → camada de expansão → HoverJitter → imagem. Título, descrição e seta ficam fora da tremida. Não editei o componente do colega. Ele limita a animação a mouse fino, cancela fora da tela/aba oculta e respeita movimento reduzido.

## Tradução do Lusion

Do Featured Work: duas colunas largas, imagem com proporção consistente e cantos arredondados, legenda fora da imagem; no celular uma coluna. O crescimento foi traduzido do shader/máscara do original para scale/clip-path vinculados à rolagem, conforme pedido. Não trouxe o renderer de profundidade, seus assets, cores ou som. O hover é uma aproximação leve do Trilho, não uma reprodução do shader original. Estudo e fontes em `estudo-item-d.md`.

## Verificação em andamento

`npx.cmd tsc -b` passou após a Home e após Internet/SmartHome, inclusive com HoverJitter importado. O primeiro build passou em 7,21 s. Uma repetição posterior encontrou sintaxe temporariamente inválida em `Header.tsx:154`, arquivo do Maestro; ele foi avisado e não toquei nele. A validação final será registrada abaixo após a edição concorrente estabilizar.

Capturas permitidas feitas exclusivamente com `cap.mjs`, Edge headless isolado, sem tela do Windows. Evidências em `docs/t1-moldura/`. Foram olhados os cards completos da Home desktop (duas mídias, títulos e links abaixo), Internet desktop e Internet 375 (uma coluna). Capturas carregadas reportaram sw=cw em 1440 e 375. Algumas primeiras tentativas saíram brancas antes de carregar (h=900/812) e são inválidas como prova; não confundir ausência de overflow em página branca com validação do site.

Os logs de desenvolvimento têm avisos do React Router e de Framer Motion sobre posição estática de container. Uma captura concorrente à edição do Header registrou falhas de HMR; não é console limpo final. Não medi FPS nem simulei movimento reduzido nesta captura padrão. Pedi ao Trilho a prova específica de hover/reduced-motion e ao Vigia a revisão.

## Fora do escopo

TV não ganhou outra mídia do receptor, evitando sua repetição após Hero e cena de giro. Não modifiquei Header, App, index.css, data, Combo, PlanCarousel, componentes dos colegas ou pastas de Teste 2/3. O FiberTube está sob integração do Abissal/Maestro e não foi duplicado na Home. Sem commit ou dependências novas.
