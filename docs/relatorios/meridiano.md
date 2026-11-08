## Meridiano — Rodada 4 — 26/10/2026

Entregue o globo ao vivo atrás dos cards compartilhados de planos.

### Arquivos
- `src/components/PlanGlobe.tsx`: canvas com projeção ortográfica 3D, rotação lenta, oceano navy, pontos e contornos electric/ciano, atmosfera com queda radial aproximando fresnel e cinco arcos ilustrativos saindo de Teófilo Otoni (-17.86, -41.51), com pulsos lime. Os arcos não representam cobertura comercial.
- `src/components/PlanCarousel.tsx`: somente integração visual; substitui MeshCanvas local por globo lazy com Suspense, carga próxima da viewport, vinheta e fundo navy. Lógica dos planos preservada.
- `public/plan-globe-land.json`: 110.959 bytes, 3.020 pontos terrestres e costas Natural Earth 110m. Fonte e licença embutidas no JSON. Fonte: https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_land.geojson ; domínio público confirmado em https://www.naturalearthdata.com/about/terms-of-use/ .

### Desempenho e acessibilidade
Canvas evita carregar Three para este efeito; chunk PlanGlobe separado de 3,62 kB minificado / 1,81 kB gzip no build medido. Animação limitada a aproximadamente 30 fps. IntersectionObserver pausa fora da tela; visibilitychange pausa em aba oculta. Tempo pausado não avança rotação. DPR limitado a 2 no desktop e 1,25 no celular. Celular usa metade dos pontos, três arcos e omite costas. prefers-reduced-motion mostra quadro estático. Decoração aria-hidden e pointer-events-none. Fetch abortado e observadores/RAF limpos no unmount; falha de dados mantém painel navy.

### Provas
- `npx.cmd tsc -b`: passou, sem erros.
- `npx.cmd vite build`: passou. Aviso de chunk grande pertence ao Wifi6Router3D existente, não ao globo.
- Detector Impeccable dos dois componentes: [] sem achados.
- Servidor http://localhost:8093, porta strictPort.
- Portal Globo Meridiano: capturas OLHADAS em 375x900 e 1440x1000. Globo visível, card ativo e preços legíveis.
- Quatro cards reais encontrados; teclado ArrowRight chegou ao INET 800 Mega.
- Sem overflow horizontal medido em 375, 768, 1024, 1440 e 1920: scrollWidth respectivamente 360, 753, 1009, 1425 e 1905; os 15 px restantes são a barra vertical.
- Console capturado durante a inspeção: vazio.
- Captura desktop: C:/Users/yuzzi/AppData/Local/Temp/maestri-portal-6779034f-79bd-4e66-ac00-bee5d6bc53bf.png
- Captura celular: C:/Users/yuzzi/AppData/Local/Temp/maestri-portal-17955b3e-9d1d-4dc0-9780-081a47b63c03.png

### Limites e coordenação
Pausas e movimento reduzido conferidos por implementação, sem emulação de mídia ou medição instrumental de FPS/GPU. Capturas foram da Home; montagem compartilhada atende demais páginas, mas não fiz inspeção visual individual de cada rota. Não alterei inet.ts nem arquivos dos colegas. Moldura confirmou wrap 72rem/80rem; coordenação com Abissal enviada, sem alterações no fundo global. Sem dependências novas, commits ou deploy.
### Revisao pedida pelo Maestro — 26/10/2026
- PlanCarousel: aviso substituido pelo texto exato solicitado, com acentos UTF-8. Listas includes vazias deixam de renderizar; beneficios existentes usam flex-1 e justify-center nesses cards, distribuindo o espaco entre preco e CTA, sem inventar itens. DOM da 8086 confirmou apenas uma lista com os tres beneficios existentes para 100 e 350.
- PlanGlobe: opacidade global .75 para .85; pontos ligeiramente maiores e mais presentes; atmosfera ciano .22 para .30 e azul .12 para .17. Card e vinheta preservados.
- tsc -b e vite build passaram; detector dos dois componentes retornou [].
- 8086 carregada no portal; DOM confirmou dois canvas, aviso atualizado e largura 1440 sem overflow. Screenshot bloqueada: portal informa janela Maestri minimizada. Maestro avisado para restaurar. Nao alego revisao visual nova da convivencia com DeepSea nesta revisao.
- Console 8086 sem erros, com aviso Framer Motion sobre container de scroll com position static. Fora do escopo dos dois arquivos; nenhum ajuste em App/Layout.
