
## Abissal — Rodada 4 — 2026-10-26

Entregues: src/components/DeepSea.tsx, deepsea-preview.html e src/deepsea-preview.tsx. App.tsx e demais arquivos de colegas não foram editados por Abissal.

Canvas 2D sem recursos externos: quatro camadas de leito marinho com parallax crescente, raios suaves, plâncton, três peixes discretos somente no desktop, três cabos electric/ciano/lime com pulsos. Progresso calculado pela altura real do documento, suavizado com lerp independente da taxa de quadros; costa e cidade ilustrativas emergem nos últimos 42% da viagem. Não representa infraestrutura real nem localização geográfica de Teófilo Otoni. Vinheta e véu escuro central preservam leitura.

Acessibilidade/desempenho: aria-hidden, pointer-events-none, fixed inset-0 z-0; DPR máximo 2 desktop e 1,5 mobile; 16 partículas mobile contra 48 desktop; pausa via IntersectionObserver e visibilitychange; prefers-reduced-motion gera quadro estático e reage a mudanças da preferência. Cleanup completo de RAF, listeners e observer.

Integração: importar DeepSea e montar no início do Layout. Recomendo Layout relative isolate, fundo z-0 e conteúdo relativo z-10. Evitar z-index negativo atrás do bg-navy-ink. SideRails pode continuar z-0 e ser montado depois. As superfícies opacas das seções escondem o oceano: avaliar composição com Moldura. Globo de Meridiano é local no painel de planos, sem dependência deste componente.

Provas: npx.cmd tsc -b passou; npx.cmd vite build passou, com aviso de chunk grande no projeto, inclusive Wifi6Router3D, sem erro. Detector impeccable retornou []. Prévia servida em http://localhost:8091/deepsea-preview.html. Portal Abissal Preview. Console capturado sem mensagens. DOM sem overflow horizontal em 375, 768, 1024, 1440 e 1920. Inspeção visual dos pixels reais do canvas exportados em 375x812 e 1440x900: C:/Users/yuzzi/AppData/Local/Temp/abissal-mobile.jpg e abissal-desktop.jpg. Captura completa do portal bloqueada por janela sem renderização; exportação do canvas contornou a captura da decoração, mas NÃO comprova composição com texto. Reduced-motion, aba oculta e interseção foram implementados e revisados no código, sem medição em runtime. Sem benchmark de FPS. Sem review independente. App real ainda depende da montagem autorizada ao Maestro; não declaro composição final verificada.

Servidor 8091 permanece ativo. Arquivos de preview mantidos conforme autorização. Nenhuma dependência instalada, nenhum commit/deploy.

## Revisão de presença e profundidade — 2026-10-26

Alteração desta revisão: somente src/components/DeepSea.tsx. Sem edição de App, Home, Footer, planos ou arquivos dos colegas. Mantidos os previews anteriores.

### Correções pedidas pelo Maestro

- Cabos: removido o ponto de convergência visível no lado direito. Agora são três curvas Bézier independentes, com ambas as extremidades fora do viewport (x inicial menor que -0,22 W e final maior que 1,22 W). Cruzam o leito de borda a borda. Controles e altura mudam com o progresso suavizado da rolagem. Pulsos avançam no sentido da costa. Brilho em múltiplas espessuras e núcleo claro, sem filtro blur aplicado por quadro.
- Rochas: eliminadas as arestas lineares do relevo anterior. Contornos agora usam curvas quadráticas e ruído determinístico de maior escala; afloramentos assimétricos em Bézier têm gradiente de volume e luz azul de contorno. Camadas com contraste maior e parallax crescente.
- Raios: gradiente transversal com bordas transparentes e desvanecimento vertical; textura calculada em canvas auxiliar de meia resolução só no resize. Eliminei os triângulos de borda dura e as faixas de sobreposição que surgiram na primeira revisão.
- Costa: transição começa aos 52% e completa aos 80%, portanto já está perceptível perto de 70%. O horizonte sobe de 34% para 20% da altura da tela: a cidade aparece acima do rodapé, atrás das seções finais, em vez de ficar escondida por ele. A paisagem continua ilustrativa, sem alegar rota real da INET.
- Texto: mantido véu central escuro, superfícies navy e vinheta mais leve nas bordas. Cabos e raios aparecem mais nas áreas livres e através dos fundos translúcidos.

### Provas desta revisão

- npx.cmd tsc -b: passou, código de saída 0.
- npx.cmd vite build: passou, código de saída 0, 9,95 s. Persiste aviso de chunks grandes no projeto, em particular Wifi6Router3D; não é erro de build.
- Capturas FINAIS feitas exclusivamente no Edge headless com perfil isolado usando o cap.mjs indicado pelo Maestro. Depois da proibição não usei novamente tela Windows, computer use, foco/restauração de janelas ou portal.
- Site real: http://localhost:8086/ e http://localhost:8086/internet. Quatro paradas por rota/largura: 0%, 50%, 80% e 100%. Total de 16 capturas em 1440x900 e 375x900; todas abertas e inspecionadas. Sem captura de preview como substituto do site real.
- Saída do script: overflow false nas quatro combinações de rota/largura. Home 1440: scrollWidth/clientWidth 1440/1440; Home 375: 375/375. Internet 1440: 1440/1440; Internet 375: 375/375.
- Console: sem exceções e sem erros capturados. Há avisos de flags futuras do React Router e aviso Framer sobre contêiner de scroll non-static. Portanto NÃO declaro console totalmente limpo. Não alterei arquivos de colegas para tratar esses avisos.
- Reduced-motion: teste anterior no Edge headless confirmou canvas sem mudança entre dois quadros separados por 500 ms; a lógica de pausa não foi alterada nesta revisão. Visibilitychange e IntersectionObserver continuam revisados no código, sem benchmark de runtime ou FPS.
- Revisão independente, somente leitura: disposition ship. Confirmou cabos sem origem visível, relevos suaves com luz de borda, raios difusos, cidade antes do rodapé e texto legível. Ressalvou que pontos verdes e percursos com nós na Home pertencem a outros componentes da composição, não ao DeepSea.

### Evidência visual final

Pasta: C:/Users/yuzzi/AppData/Local/Temp/abissal-r4-final/

Home desktop: _-1440-0.jpg, _-1440-1.jpg, _-1440-2.jpg, _-1440-3.jpg.
Home celular: _-375-0.jpg, _-375-1.jpg, _-375-2.jpg, _-375-3.jpg.
Internet desktop: _internet-1440-0.jpg, _internet-1440-1.jpg, _internet-1440-2.jpg, _internet-1440-3.jpg.
Internet celular: _internet-375-0.jpg, _internet-375-1.jpg, _internet-375-2.jpg, _internet-375-3.jpg.

O índice 2 é 80%: veja especialmente _-1440-2.jpg e _internet-375-2.jpg para a chegada à costa ANTES do rodapé. O índice 3 confirma que, no desktop, a cidade fica na região acima do rodapé. No celular, o rodapé ocupa mais que uma tela e atenua a cidade ao chegar ao último pixel; ela já foi exibida antes na seção de dúvidas.

Limites: sem medição numérica de contraste, FPS ou consumo. Não foram recapturados 768/1024/1920 nesta revisão; o teste anterior não mostrou overflow nesses tamanhos. Nenhuma dependência instalada; nenhum commit/deploy. Mantida a identidade existente sem alteração de tokens ou sistema visual.

Revisão documental independente: continuidade da identidade confirmada por comparação com tailwind.config.js, Header, Thread, SideRails e PlanGlobe. Nenhuma mudança de tokens, tipografia, espaçamentos ou sistema compartilhado; somente tons locais do cenário. Não exige criar DESIGN.md/PRODUCT.md fora do escopo.
