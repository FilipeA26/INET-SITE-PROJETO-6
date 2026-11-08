# Moldura — Rodada 7

## Resultado

As seções agora usam a largura da página, com mídia grande, títulos que quebram por palavras e fundos próprios. A largura máxima da área principal e do rodapé passou a 100rem; os textos de leitura continuam limitados a 62 caracteres aproximados por linha. Menu, preços, cards e âncoras de 90px foram preservados.

O pedido de cards sem branco puro nas seções neve foi aplicado em um único lugar: `.tone-snow .card` usa `#E8EEF6`, borda navy/10 e ícones em verde escuro. A correção do fundo do menu sobre neve foi feita pelo Maestro no Header, que não editei.

## Estudo observado e aplicação

Capturas de desktop e celular, HTML e resultados estão em `docs/relatorios/estudo-r7/moldura/`. Nenhuma imagem, vídeo, marca ou código de apresentação desses sites foi incorporado ao produto.

| Referência | O que observei nas capturas | O que apliquei |
| --- | --- | --- |
| [Linear](https://linear.app) | Imagens grandes de interface, composição larga, divisórias e leitura com medida limitada. | Área principal mais larga, mídia do Wi-Fi/Mesh e mapa maiores, textos limitados, introduções separadas do conteúdo. |
| [Apple](https://apple.com) | Faixas de produto de ponta a ponta e alternância clara/escura, com produtos grandes. | Variantes `ink`, `mist`, `snow` e `cinematic` do Abissal; neve em benefícios e dúvidas, cenas de produto amplas. |
| [Locomotive](https://locomotive.ca/en) | Tipografia grande, listas e divisórias longas, ocupação assimétrica e alternância de fundos. | Títulos amplos, quebra natural em vez de encolhimento; consulta e dúvidas com introdução de um lado e conteúdo do outro. |
| [Cowboy](https://cowboy.com) | Mídia ampla, produto em grande escala e texto curto sobre a cena. | Painel de TV maior na Home, imagem e apresentação do receptor em grande escala; leitura curta preservada. |
| [Active Theory](https://activetheory.net) | Cena de viewport inteiro, luz localizada e partículas. Desktop iniciou no preloader e só depois mostrou a cena; no celular a cena apareceu. | Atmosferas locais do `SectionBackdrop`, sem novos cabos laterais e sem esticar textos de leitura. Não copiei o renderer. |
| [Lusion](https://lusion.co) | Mídia 3D ampla em uma moldura, tipografia compacta e enquadramento de viewport. | Integrei o `ExpandMedia` do Maestro na Home e as cenas do Trilho em Móvel e TV. |

Limite importante: Active Theory e Lusion reportaram altura igual à viewport. O `window.scrollTo` usado pelo `cap.mjs` não percorreu a navegação própria dessas cenas. As imagens mudaram ao longo das capturas, mas isso sozinho não prova que a rolagem provocou a mudança. O HTML e o bundle de entrada da Lusion foram salvos para estudo; contêm canvas/WebGL e tratamento de scroll/wheel. Não alego ter reproduzido ou verificado toda a experiência desses sites. O comportamento de expansão no INET é o componente implementado pelo Maestro, verificado no nosso site.

## Por página

- **Home:** fundos por seção; retirada da cor animada aplicada à página inteira; Hero amplo com as fibras existentes; `ExpandMedia` com `/inet-tv-receptor.webp` antes dos planos; planos sobre `mist`; TV e benefícios sobre neve; serviços em composição de duas peças maiores e quatro menores; autoatendimento sobre `ink`; dúvidas sobre `mist`. Os cards continuam presentes.
- **Internet:** planos sobre `mist`; Wi-Fi 6 com coluna de mídia maior; Mesh e casa inteligente com fundos próprios; dúvidas em neve, com título à esquerda e respostas à direita no desktop. O respiro mobile de 5rem no fim do Wi-Fi 6 permanece.
- **TV:** `SideToCenter` do Trilho com `variant="box"`, combinando entrada lateral, escala e rotação em um único trecho; imagem existente, limitada a 65svh; benefícios e dúvidas em neve; receptor em faixa ampla sobre `mist`; catálogo e planos preservados.
- **Móvel:** removido o antigo mockup com inclinação pelo ponteiro; `InetPhone` dentro de `ScrollSpin`, em faixa própria sem ancestral com `overflow-hidden`; vantagens e dúvidas em neve; portabilidade com composição dividida. Uma cena principal por página evita duplicar trechos longos.
- **Cobertura:** consulta com introdução lateral e conteúdo do outro lado; mapa e lojas usam a área ampla; dúvidas em neve. Não mudei dados, lógica do CEP, Leaflet nem o texto da tag do Filipe.
- **Combo:** Meridiano adicionou o wrapper `.combo-page` e o `SectionBackdrop`. A página recebe a largura e os componentes compartilhados. Não editei seu interior nem os cálculos.
- **Demais páginas e rodapé:** recebem a largura ampliada e os fundos dos componentes compartilhados, sem mudar o conteúdo factual.

## Arquivos e coordenação

Alterações minhas: `src/index.css`, `src/components/ui.tsx`, `Hero.tsx`, `Wifi6.tsx`, `MeshHouse.tsx`, `SmartHome.tsx`, `AppsShowcase.tsx`, `TmdbWeekly.tsx`, e páginas `Home.tsx`, `Internet.tsx`, `Tv.tsx`, `Movel.tsx`, `Cobertura.tsx`.

Dependências integradas, feitas pelos colegas: `fundos/SectionBackdrop` e `CinematicCanvas` do Abissal; `giro/ScrollSpin`, `SideToCenter` e `InetPhone` do Trilho; `expandir/ExpandMedia` do Maestro; wrapper de Combo do Meridiano. Não editei SideRails, Thread, DeepSea, Header, PlanCarousel, Combo ou os dados.

## Provas e limites

- TypeScript passou após as integrações. O erro temporário de `useScroll` na Home foi removido, pois o fundo passou a ser por seção.
- Vite build passou; permanece o aviso de chunk grande do Wi-Fi 6 3D, já existente.
- A primeira matriz local de Home, Internet, TV, Móvel, Cobertura e Combo, em 375 e 1440, passou sem overflow e sem exceções de runtime. Os avisos de desenvolvimento do Router e do Framer permanecem; não declaro console totalmente limpo.
- Capturas exclusivamente pelo `cap.mjs`, Edge headless com perfil isolado. Nenhum controle da área de trabalho, janela ou captura do Windows foi usado.
- As imagens foram olhadas. A matriz final após a troca dos cards neve para `#E8EEF6` está em `docs/relatorios/r7/final/`, com `result.txt` por rota/largura. Resultado final acrescentado abaixo quando a captura terminar.
- Não medi FPS, memória de GPU nem todos os estados interativos. O respeito a movimento reduzido nas cenas vem dos componentes dos colegas, cujo fluxo estático foi mantido na integração; não afirmo ter feito uma captura em emulação de movimento reduzido nesta rodada.
- Não acrescentei vídeos pesados, dependências ou renderers 3D. Usei as imagens existentes; os cenários de fundo são locais por seção.
- A base antiga `useCardGlow` da referência GigasNet continua inativa. Ela não foi apresentada como acabamento verificado daquela referência.
- A nota `estude-esses-sites-para-fazer` não estava conectada ao meu terminal. Avisei o Maestro e segui seu resumo completo, que determinava a nova prioridade.

Sem commit, deploy ou alteração de preços.

### Resultado da matriz final

As 12 combinações de seis rotas em 375x812 e 1440x900 reportaram `overflow: false` e zero exceções. Tsc e build finais passaram; detector Impeccable retornou `[]`. Os cards neve foram conferidos como azul-cinza, distintos do fundo, e o menu escuro ficou legível.

A inspeção detectou um lote visual inválido em `r7/final/cobertura375`: o primeiro quadro mostra o INET, mas os quadros seguintes mostram um mosaico de estudo Refokus. O log desse processo registra URL local e largura correta, portanto ele não valida as imagens. Não atribuo uma causa sem investigação. Esses quadros foram excluídos das conclusões visuais; a recaptura isolada está em `r7/cobertura375-recaptura/`.

Foi observado também que o botão flutuante do WhatsApp cobre parte de “Contratar” na barra inferior do Combo mobile. Encaminhei a imagem ao Meridiano, dono do interior da página, sem editar esse arquivo. A revisão dele e a do Vigia ficam explicitamente separadas das minhas medições de overflow.

A recaptura isolada de Cobertura em 375x812 foi aberta quadro a quadro e corresponde ao INET: consulta, mapa, lojas, dúvidas e rodapé. O log confirma `scrollWidth=375`, `clientWidth=375`, sem exceções. Ela substitui o lote visual inválido.

O Trilho conferiu as cenas montadas de celular e receptor em quatro cenários e confirmou enquadramento esperado, sem correção necessária; registro em `docs/relatorios/trilho.md`. Isso valida essas cenas naquele escopo, não constitui aprovação geral de todas as páginas. A revisão geral do Vigia estava em andamento ao fechar este registro.

## Correções após a primeira revisão do Vigia

A primeira revisão foi **REPROVADA** por três defeitos e marcou o ponto A como parcial. Foi executado um lote de correções, sem acrescentar fatos ou preços:

1. **Contraste da Home neve:** a regra anterior cobria `text-white/x`, mas não a classe semântica `.lead`. Acrescentei `.tone-snow .lead` em navy/80, além de foco verde escuro sobre neve. O parágrafo de TV ficou legível nas novas capturas.
2. **Título repetido:** o título do `ExpandMedia` passou a “Internet fibra de até 1 Giga.”, texto já existente no Hero de `Internet.tsx`. “Tudo o que conecta a sua casa.” permanece somente como título da seção de serviços da Home.
3. **Portabilidade no split:** `+2GB` recebeu `shrink-0` e `whitespace-nowrap`; o parágrafo recebeu `min-w-0 flex-1`. As imagens em 1440 e 1920 mostram número e texto separados, sem invasão.
4. **Metade direita dos heroes:** Home recebeu a imagem existente de casa inteligente, Móvel recebeu `InetPhone`, e TV recebeu a imagem existente do receptor. A API de `PageHero` ganhou mídia opcional. No desktop há um grid de texto/objeto, com mídia grande até a borda; no mobile essa mídia decorativa extra fica oculta e as cenas próprias de rolagem continuam presentes. Não acrescentei painéis, dados ou texto de catálogo fictícios.

### Provas do lote de correções

- TypeScript e Vite build passaram novamente; o build terminou em 6,48s com o mesmo aviso de chunk do roteador 3D.
- Nove combinações de Home, Móvel e TV em 375, 1440 e 1920 passaram sem overflow e sem exceções. Resultados em `docs/relatorios/r7/revisao/<rota><largura>/result.txt`.
- Os seis heroes de desktop foram abertos e olhados individualmente: quadro `0` de Home, Móvel e TV em 1440 e 1920.
- Contraste: `revisao/home1440/_-1440-4.jpg` e `home1920/_-1920-4.jpg`.
- Portabilidade: `revisao/movel1440/_movel-1440-3.jpg` e `movel1920/_movel-1920-3.jpg`.
- O Vigia foi avisado para uma nova avaliação dos três defeitos e do ponto A. O primeiro veredito não foi tratado como aprovação; a reconferência é registrada separadamente quando recebida.

### Veredito recebido

O Vigia reconferiu os três defeitos e o ponto A com capturas próprias em 375, 768, 1440 e 1920 e informou: **corrigidos e aprovado do lado do Moldura**. Esse é o escopo da aprovação recebida. TypeScript e build passaram; as imagens e os limites do estudo permanecem documentados acima.

### Ajuste posterior da imagem da expansão

A pedido do Maestro, troquei somente `imageSrc` e `alt` do `ExpandMedia` em `Home.tsx`: a expansão agora usa o receptor INET TV, enquanto o Hero mantém a imagem de casa inteligente. Isso elimina a repetição da mesma imagem em duas seções consecutivas. Tsc e build passaram; capturas headless em 375 e 1440 foram olhadas e não apresentaram overflow ou exceções. Evidências em `docs/relatorios/r7/imagem-expandida375/` e `imagem-expandida1440/`.
