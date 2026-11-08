
## Execução Ourives — nota-maest-2 — 27/10/2026

Concluído no P6 por autorização explícita de `docs/tarefas/nota-maest-2.md`. Sem commit, push, deploy ou dependências novas. Teste 2 e Teste 3 somente lidos. As alterações que já existiam no checkout foram preservadas.

### Entrega e decisões
- `src/App.tsx`: import do FiberTube passa de fundos para lusion. Copiado integralmente do Teste 2 para `src/components/lusion/FiberTube.tsx`: SVG absoluto, bainha azul/núcleo verde, desenho pela rolagem, margens fora do conteúdo, z-0 abaixo do main z-10. Nenhum WebGL acrescentado.
- `src/pages/Home.tsx`: removidos Thread, homeRef e imports sem uso; lista de serviços substituída por ServiceCards; ConnectFinale imediatamente após #duvidas. SmartHomeMedia, título de Serviços e seção 04 preservados.
- `src/components/lusion/ServiceCards.tsx`: adaptação visual do ValueCards para seis Links completos; dois leques de três em desktop, empilhamento em celular. Conteúdo literal das seis entradas antigas, sem rodapé invertido nem rótulo em caixa-alta. Inclinação se abre pela rolagem usando SPRING de src/motion.ts; redução de movimento em JS e CSS. Foco lime de 4 px observado.
- `src/components/lusion/ConnectFinale.tsx`: copiado do Teste 2 e compactado, sem altura mínima. Título clamp(2.5rem,6vw,5rem), padding 48/64 px; texto e botão preservados. Todos os três telefones e nomes das quatro lojas vêm diretamente de inet.ts; razão social/cidade/UF também. Partículas 2D pausam fora da seção por IntersectionObserver, dpr máximo 2; arte SVG estática e CSS/JS para movimento reduzido.
- SectionBackdrop não monta o v6 em nenhuma chamada atual: somente renderiza FiberTube quando fiberTube é string; busca em src não encontrou chamadas fiberTube=. Nenhuma segunda instância foi observada, portanto não foi necessário editar esse arquivo.

### Provas observadas
`npx.cmd tsc -b` e `npx.cmd vite build`: saída 0. Build Vite 5.4.11 concluído em 5,78 s; aviso de chunk >500 kB (Wifi6Router3D) registrado, sem erro. Usados os executáveis .cmd do Windows.

| Medida | 1440×900 | 375×900 |
| --- | ---: | ---: |
| scrollHeight antes | 9275 | 10447 |
| scrollHeight depois | 10256 | 12034 |
| scrollHeight ocultando o tubo | 10256 | 12034 |
| scrollWidth = innerWidth | 1440 = 1440 | 375 = 375 |
| overflow | false | false |
| altura do contato | 495,19 | 565,19 |
| distância contato → rodapé | 0 | 0 |
| borda inferior do rodapé no documento | 10256,05 | 12034,44 |
| tubos montados | 1 | 1 |

O acréscimo de altura vem das cartas e do conteúdo de contato. O SVG acrescenta zero pixels; não há faixa vazia após o rodapé nem entre ele e o contato (diferença subpixel de arredondamento <1 px).

Capturas realizadas via cap.mjs headless e variante instrumentada baseada no mesmo script, sem computer use ou navegador interativo. Inspecionadas visualmente as cinco posições 0/0.3/0.6/0.9/1 em ambos os tamanhos e detalhes services/cards/finale. Tubo visível nas margens e respiros, cartas legíveis e rodapé encerrando a página. Pastas: `docs/relatorios/nota-maest-2-desktop/` e `docs/relatorios/nota-maest-2-mobile/`. Antes: `nota-maest-2-antes/` e `nota-maest-2-antes-desktop/`.

Cliques programáticos nos seis Links confirmaram pathname correto nas seis rotas. Teclado Tab + foco confirmou `focusVisible:true` e `rgb(112, 224, 0) solid 4px`. Emulação de prefers-reduced-motion: seis transforms none, canvas do contato display none, overflow false. Evidência: `docs/relatorios/nota-maest-2-interacoes.jsonl`; métricas/console: `evidencias.jsonl` em cada pasta de captura. Console sem error/EXCEPTION; persistem os avisos anteriores de posição de container do Framer Motion e future flags do React Router. Detector Impeccable sobre arquivos alterados: `[]`.

### Git diff --stat
O checkout já estava amplamente alterado antes desta tarefa. Estatística contra HEAD para os arquivos rastreados tocados (inclui alterações anteriores, não é contagem exclusiva desta execução):

```text
 src/App.tsx        | 55 ++++++++++++++++++++++++++++++--------
 src/pages/Home.tsx | 78 ++++++++++++++++++++++++++++++++----------------------
 2 files changed, 90 insertions(+), 43 deletions(-)
```

Novos arquivos, não incluídos por git diff --stat por serem untracked (medidos com git diff --numstat --no-index NUL): FiberTube.tsx 282 linhas; ConnectFinale.tsx 353 linhas; ServiceCards.tsx 54 linhas. Somente esses cinco arquivos de src foram escritos nesta execução; demais entregáveis são relatório, scripts de verificação e capturas em docs/relatorios.

## Rodada 2

Executada por Ourives em 27/10/2026, conforme `docs/tarefas/correcoes-maest-2.md`, após leitura dos relatórios Lente, Crivo e Prumo. Somente `ServiceCards.tsx`, `ConnectFinale.tsx` e `FiberTube.tsx` foram editados em src nesta rodada. Nenhum commit/push, dependência nova ou alteração nos sites de teste.

### Correções
- Abaixo de 768 px, cartas em trilho horizontal nativo com arraste touch, scroll-snap e próxima carta parcialmente visível; sem autoavanço e sem alturas mínimas. Em desktop, alturas pelo conteúdo, alinhamento inicial em vez de stretch, seis inclinações e deslocamentos verticais assimétricos usando o SPRING existente. Números 01–06 com aria-hidden.
- Removida a simulação de confete. Agora há poucos pontos estáticos de 1–2 px em lime/azul com opacidade baixa, distribuídos pelo fundo, excluindo retângulos de textos/links/razão social mais 14 px de respiro. Decisão: pontos estáticos dispensam qualquer loop de animação no contato. Canvas 2D com ResizeObserver, IntersectionObserver, dpr ≤2 e arte SVG discreta de apoio. Contato usa aria-labelledby no h2; removida a transição de escala com curva padrão do botão.
- Tubo limitado à borda anterior ao footer, com máscara em fade nos últimos 200 px. Retirado o footer do cálculo das travessias. Loop de rAF encerra ao assentar a mola e acorda por scroll/resize; pulsos e cabeça somem ao assentar. No celular: largura 2 px e centro em x=3 ou largura−3, deixando 16 px entre a borda do tubo vertical e o conteúdo que começa em x=20.
- `Thread.tsx` e `fundos/FiberTube.tsx` preservados, sem uso no bundle, conforme proibição explícita de apagar.

### Provas da versão final

`npx.cmd tsc -b`: 0 erros. `npx.cmd vite build`: exit 0, Vite 5.4.11, 7,20 s. Permanece apenas o aviso conhecido de chunk >500 kB. Detector Impeccable nos três arquivos: `[]`.

| Medida | 375×812 | 1440×900 |
| --- | ---: | ---: |
| scrollHeight | 10471 | 10168 |
| scrollHeight com tubo oculto | 10471 | 10168 |
| scrollWidth / innerWidth | 375 / 375 | 1440 / 1440 |
| overflow da página | false | false |
| altura do trilho das cartas | 262,75 | 608 |
| altura contato | 565,19 | 495,19 |
| distância contato → footer | 0 | 0 |
| callbacks FiberTube em 1,1 s após repouso de 5 s | 0 | 0 |
| altura SVG = posição inicial footer | 9045,94 | 9564,55 |

Meta móvel atendida: 10471 ≤10700 e trilho 262,75 ≤360. Redução de 1433 px sobre os 11904 px auditados na rodada anterior em 375×812.

Arraste touch real via CDP moveu scrollLeft do trilho de 0 para 290 px; overflow da página continuou false. Todas as seis cartas foram trazidas à área visível, com centro clicável confirmado por elementFromPoint, alturas pelo conteúdo (214,38–238,75 px) e números com aria-hidden=true. Rotas e textos originais preservados. Rótulo do contato: aria-label ausente, aria-labelledby=inet-connect-title.

Capturas em `docs/relatorios/nota-maest-2-r2-mobile/` e `docs/relatorios/nota-maest-2-r2-desktop/`: cinco paradas da Home, detalhe de serviços, cartas e contato. Inspecionados visualmente cartas/contato/fim nos dois tamanhos e última carta móvel: próxima carta visível no trilho, textos legíveis, razão social sem partículas, tubo ausente do footer e fim sem faixa vazia. Edge headless/CDP por variante do cap.mjs, sem navegador interativo ou computer use.

Dados completos nos `evidencias.jsonl` dessas pastas e `nota-maest-2-r2-mobile/cartas.jsonl`; scripts reproduzíveis `nota-maest-2-r2-cap.mjs` e `nota-maest-2-r2-cartas.mjs`. Instrumentação de rAF instalada antes da aplicação, contando execuções originadas em FiberTube.tsx. Console sem error/EXCEPTION em ambas as larguras; seguem os avisos anteriores de posição de container do Framer e future flags do Router. Nenhuma alteração fora do escopo foi feita para esses avisos.
