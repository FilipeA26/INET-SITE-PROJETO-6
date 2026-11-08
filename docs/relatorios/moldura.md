
# Moldura ? Rodada 4 ? 26/10/2026

## Estrutura compartilhada
`--content-max: 72rem`, passando a `80rem` em 1536px. A largura ?til n?o perde mais 128px de padding interno em desktop. Margens externas fluidas de 20 a 48px. Section com ritmo em svh; se??es com id t?m padding superior de 24px e scroll-margin-top de 90px. PageHero com altura m?nima limitada por svh e conte?do livre para crescer. Cards transl?cidos com sombra deslocada e luz de borda; FeatureCard virou bloco aberto com divis?ria, evitando repeti??o de caixas. CTA mant?m painel local transl?cido. Enquadramento usa a altera??o de App feita pelo Maestro, sem edi??o minha nesse arquivo.

## Invent?rio e altera??es por se??o
- Home: hero (fundo transl?cido, espa?o superior seguro, parallax desativado com reduzir movimento); planos e assinar (marcador planos, ?ncora e respiro); INET TV (mesmo enquadramento); servi?os (id servicos, grade aberta e tom navy em entretenimento); por que INET (id por-que-inet, benef?cios sem caixas); autoatendimento (grades mais espa?adas); d?vidas (id duvidas). Fundo cont?nuo agora transl?cido; vers?o est?tica com reduzir movimento. N?o existem se??es de cobertura ou depoimentos na Home; n?o criei conte?do novo para satisfazer marcadores inexistentes.
- Internet: hero; planos/assinatura; Wi-Fi 6; Mesh; casa inteligente/seguran?a; Alexa; d?vidas; CTA. Todas recebem largura comum e ?ncoras consistentes; componentes de se??o usam section-frame.
- TV: hero; recursos TV/r?dio/on demand; sugest?es semanais; receptor; planos; d?vidas; CTA. Grades abertas e benef?cios sem caixas; sugest?es seguem ritmo comum.
- Fixo: hero em svh com espa?amento comum; vantagens; casa/empresa; planos e benef?cios; d?vidas; CTA. Colunas mais largas e benef?cios com divis?rias.
- M?vel: hero/celular; vantagens; portabilidade; Waze; planos; d?vidas; CTA. Destaques viram uma coluna abaixo de 420px, evitando compress?o de r?tulos; grades e hero comuns.
- Entretenimento: hero; apps; climas para maratonar; CTA. Grades mais abertas e ?ncora apps consistente.
- Cobertura: hero; consulta CEP; lojas/mapa; d?vidas; CTA. Recebem ajustes dos componentes compartilhados. Texto da tag previamente alterado por Filipe preservado; nenhuma altera??o de texto minha nessa p?gina.
- Suporte: hero; passo a passo; dicas e DownDetector; acesso remoto; outros canais; CTA. Passo a passo usa tr?s colunas em 1024 e cinco somente em 1280, evitando cinco faixas apertadas; demais grades abertas.
- Fale conosco: hero; necessidades; formul?rio e contatos/lojas; e-mails. Grades com mais respiro; endere?o de e-mail pode quebrar linha em vez de truncar.
- Eventos: hero; duas frentes; IMS/celular; time/projetos; agenda; Music Show; CTA. ?ncoras e ritmo comuns; estat?sticas colapsam em celular estreito, line-up vira coluna no celular.
- Avalia??es: hero; depoimentos; avaliar/QR code; CTA. Id depoimentos, grade aberta, QR responsivo e entrada est?tica com reduzir movimento.
- Velocidade: hero; medidor; dicas e instru??es; CTA. Grade aberta e enquadramento das duas ?ncoras.
- 404: hero e a??es; herda altura e largura comuns, sem altera??o de conte?do.
- Footer: marcador data-lateral lojas e fundo transl?cido. Trilho avisado dos marcadores e valores finais.

## Arquivos de minha responsabilidade alterados
Home, Tv, Fixo, Movel, Entretenimento, Suporte, FaleConosco, Eventos, Avaliacoes, Velocidade; components/ui.tsx, Footer.tsx, Hero.tsx, AppsShowcase.tsx, MeshHouse.tsx, SmartHome.tsx, TmdbWeekly.tsx, Wifi6.tsx; index.css. Internet, Cobertura e NotFound revisados e beneficiados pelos componentes comuns. Altera??es de App, Header, Lines, dados, Thread, SideRails e PlanCarousel pertencem aos colegas.

## Provas iniciais
TypeScript executado ap?s cada p?gina. Uma execu??o em Entretenimento encontrou receiverPrice removido por altera??o simult?nea de dados; execu??o posterior passou ap?s integra??o do Maestro. Demais p?ginas e execu??o final passaram. Vite build passou, com aviso de chunk grande do Wi-Fi 6 3D. Detector Impeccable: [] sem achados mec?nicos. Clique real em Ver planos na Home em 375: se??o pousou em y=90 e t?tulo em y=146,5. Console capturado at? esta etapa sem mensagens. QA de 13 rotas nos cinco tamanhos em andamento; evid?ncia detalhada em moldura-qa.txt.

## Limites
N?o criei novo canvas nem novas anima??es cont?nuas. Preservei parallax e entradas existentes; reduzi movimento do hero e do QR. N?o auditei todos os loops preexistentes de v?deos e WebGL nem servi?os externos. O relat?rio de overflow verifica o documento em cada rota e largura; n?o substitui inspe??o de todos os estados interativos de cada widget.

## QA consolidado
65 combina??es de 13 rotas em 375, 768, 1024, 1440 e 1920px: zero overflow do documento. Todas as ?ncoras de se??o medidas t?m padding 24px e scroll-margin 90px. Capturas de desktop das 13 rotas foram inspecionadas em painel de contato (moldura-1440.jpg); mobile: Home, Internet, TV, Fixo, M?vel, Entretenimento e 404 inspecionados em capturas (moldura-375.jpg e moldura-mobile-extra.jpg). Capturas mobile das demais rotas falharam no portal; essas rotas t?m medi??o de DOM, mas n?o inspe??o visual mobile completa. Console consultado ap?s a varredura: vazio.
Navega??o direta internet#wifi-mesh inicialmente revelou mudan?a tardia de altura em 375px; Maestro corrigiu App com ResizeObserver. Revalida??o final registrada em moldura-anchors-final.txt. Em 768, 1024, 1440 e 1920 a primeira rodada j? pousava entre y89,94 e y90,44.

### Revalida??o ap?s corre??o do Maestro
Internet#wifi-mesh ap?s estabiliza??o: 375px se??o y=89,84375, t?tulo y=146,34375; 1440px se??o y=90,1875, t?tulo y=146,6875. Zero overflow em ambos. TypeScript final passou ap?s integra??o. Build final passou em 8,23s com o mesmo aviso de chunk 3D. Sem commit, push, deploy ou instala??o.

# Moldura ? Rodada 5 ? 26/10/2026

## Entrega
Coluna original restaurada exatamente em `.wrap`: mx-auto w-full max-w-6xl px-5 sm:px-10 lg:px-16. `--content-max` permanece 72rem fixo, sem media query de 80rem. Trilho avisado e confirmou. ?ncoras preservadas: scroll-margin-top 90px, padding superior 24px nas se??es com id.

Conte?do deixou caixas fechadas: `open-item` fornece divis?ria e respiro sem fundo, contorno ou cantos; `open-list` e `service-list` organizam navega??o em linhas; `open-band` cria atmosfera e linhas de largura total com texto na coluna; `media-strip` remove molduras das imagens; `edge-gallery` leva imagens de entretenimento ?s bordas da viewport. Faixas cont?m decora??o para impedir overflow. PlanCarousel n?o foi alterado nem teve regras globais de card modificadas nesta rodada.

## P?gina por p?gina
- Home: servi?os e autoatendimento viraram listas com ?cone, descri??o e a??o; INET TV virou faixa aberta; benef?cios continuam abertos; ?ncoras e planos preservados.
- Internet: herda coluna original; Wi-Fi 6 sem caixas de benef?cios e sem moldura no palco; Mesh sem moldura; seguran?a e Alexa em faixas abertas, benef?cios com divis?rias. CTA aberto.
- TV: receptor mais amplo com deslocamento leve para fora da coluna em desktop; pre?o em linha aberta; avisos TMDB sem caixas; CTA aberto.
- Fixo: casa e empresa em artigos com divis?rias; CTA aberto; planos preservados.
- M?vel: portabilidade em faixa, sem card; planos preservados; CTA aberto.
- Entretenimento: apps e climas em galerias sem borda nem cantos, imagens at? as bordas; t?tulos e introdu??es na coluna central.
- Cobertura: consulta CEP em faixa aberta; mapa sem moldura arredondada e lojas em lista com divis?rias; l?gica de CEP e Leaflet intacta; texto da tag do Filipe preservado.
- Suporte: atendimento em sequ?ncia aberta; dicas, acesso remoto e canais sem caixas; Downdetector aberto e servi?os com divis?rias. Removida luz decorativa que causava overflow de 60px no mobile; revalida??o sw375/cw375.
- Fale conosco: necessidades em linhas; formul?rio sem caixa externa; telefones, lojas e e-mails em blocos abertos. Campos, valida??o e envio preservados.
- Eventos: duas frentes, time, projetos, estat?sticas e agenda sem cards; Music Show em faixa; mockup do aparelho preservado.
- Avalia??es: depoimentos sem caixas; avalia??o em faixa; moldura branca do QR permanece por legibilidade e fun??o.
- Velocidade: medidor sem caixa externa; instru??es sem cards; CTA em faixa. L?gica dos medidores intacta.
- 404 e Footer: herdam coluna original; n?o exigiram altera??o espec?fica nesta rodada.

## Arquivos
index.css; components/ui.tsx, AppsShowcase.tsx, MeshHouse.tsx, SmartHome.tsx, TmdbWeekly.tsx, Wifi6.tsx; p?ginas Home, Tv, Fixo, Movel, Entretenimento, Cobertura, Suporte, FaleConosco, Eventos, Avaliacoes, Velocidade. CityMap.tsx, CepCheck.tsx e DownDetectorCard.tsx foram autorizados explicitamente pelo Maestro nesta rodada para ajustes somente de classes/layout. Internet e NotFound foram revisados e validados; herdam os componentes comuns. N?o editei Combo, PlanCarousel, dados, App, Header, Thread, SideRails ou DeepSea.

## Provas
- `npx.cmd tsc -b` ap?s cada uma das 13 p?ginas: todos passaram; execu??o adicional ap?s os ajustes de componentes passou.
- `npx.cmd vite build` passou; aviso de chunk Wi-Fi 6 3D acima de 500kB permanece.
- Detector Impeccable: [] sem achados mec?nicos.
- Capturas exclusivamente com `node C:/Users/yuzzi/.claude/scripts/cap.mjs`, Edge headless, perfil isolado, na porta 8086. Nenhum portal, controle de janela ou captura de Windows foi usado nesta rodada.
- Home e 11 p?ginas internas capturadas em 375 e 1440, nos pontos 0, 0.5 e 1. Imagens foram olhadas em pain?is de contato de in?cio, meio e fim e em capturas individuais. Evid?ncias em docs/relatorios/rodada5/, resultados de cada rota em result.txt.
- ?ltima medi??o de cada uma das 24 combina??es de rota/largura: sem overflow. Suporte teve falha inicial sw435/cw375, corrigida e recapturada em suporte375final. Home apresentou falha anterior durante integra??o; ap?s ajustes meus nas faixas e do Trilho no brilho do Thread, captura sw375/cw375. HMR impede atribuir causa ?nica nessa captura da Home.
- Logs sem exce??es de runtime; existem avisos de desenvolvimento do React Router e de container non-static do Framer em p?ginas com parallax. Portanto n?o declaro console totalmente limpo. Maestro avisado.

## Limites e decis?es
Notas tirar-esses-cards-latera e https-stock-adobe-com-br-ima n?o estavam conectadas ao terminal e as leituras falharam; Maestro avisado. Execu??o seguiu seu briefing completo.
Combos de 300/650 nas p?ginas Fixo e M?vel foram identificados nas capturas; Maestro decidiu preserv?-los, pois filtro 700/800/1 Giga vale para planos de internet e combos aguardam Filipe.
PlanCarousel, construtor Combo, fundo animado e bolinha s?o entregas dos colegas. Dispositivos, campos de formul?rio, medidores, QR e modal de detalhes mant?m superf?cies funcionais. N?o medi 768/1024/1920 nesta rodada; esses tamanhos tiveram testes na rodada anterior, mas n?o os apresento como prova atual. Capturas em paradas fixas n?o cobrem cada estado interativo nem garantem cada se??o individualmente; especialmente o mapa lazy pode alterar altura e reposicionar uma parada. Nenhum commit, deploy, depend?ncia nova ou altera??o de conte?do factual.

## Corre??o solicitada pelo Vigia ? GestureHint
Arquivo: src/components/GestureHint.tsx. Drag reduzido de 0/26/0 para -5/5/-5; swipe de 18/-18/18 para 5/-5/5. C?rculo ganhou overflow-hidden e shrink-0; span da m?o usa flex para centraliza??o sem linha de base. Com ?cone de 15px, transla??o m?xima de 5px e c?rculo de 28px, o ?cone ocupa no m?ximo 25px e permanece contido em todos os quadros. Recorte garante separa??o dos 12px de gap at? o r?tulo, inclusive para os outros gestos. Tsc passou e Vite build passou (aviso de chunk 3D existente). Captura headless Home 1440x900 olhada: docs/relatorios/gesture-hint-fix/_-1440-0.jpg, selo vis?vel no canto superior direito, sem sobreposi??o; overflow false. Logs com avisos existentes de Router e Framer, sem exce??es. N?o alterei PlanCarousel nem Eventos: ambos recebem a corre??o de swipe pelo componente compartilhado.

# Moldura ? Rodada 6 ? 26/10/2026

## Fonte e escopo
Nota image-c-users-yuzzi-maest lida no Maestri. Compara??o feita com src-antes-rodada4 no backup indicado pelo Maestro. Restaura??o seletiva de classes/estrutura visual; nenhuma c?pia integral que pudesse sobrescrever conte?do factual, dados ou corre??es dos colegas.

## Cards restaurados
FeatureCard, LinkCard e superf?cies das p?ginas voltaram ?s classes do backup: `.card` com fundo #020F2E/80, borda branca 10%, raio 1.75rem, eleva??o no hover e realce de borda. Removidos overrides da rodada 4 que deixavam os cards em 68% e as regras abertas da rodada 5. Pain?is maiores mant?m seus raios, fundos e paddings originais do backup.
- Home: grades originais de servi?os, benef?cios e autoatendimento; painel de INET TV fechado novamente.
- Internet: caixas Wi-Fi 6, palco do roteador, Mesh e pain?is de seguran?a/Alexa restaurados.
- TV: caixa do pre?o e avisos TMDB restaurados.
- Fixo: artigos casa/empresa fechados novamente.
- M?vel: portabilidade restaurada como card.
- Entretenimento: cards de apps e climas com moldura original; fim da galeria at? a borda.
- Cobertura: CEP e mapa com moldura original; lojas em cards, destaque ativo da loja preservado.
- Suporte: passos, dicas, acesso remoto, canais e Downdetector em caixas novamente. A luz que causava overflow na rodada 5 continua removida; cores de apoio na paleta INET.
- Fale conosco: necessidades em grade, formul?rio, telefones, lojas e e-mails fechados novamente.
- Eventos: duas frentes, estat?sticas, time, projetos, agenda e Music Show restaurados.
- Avalia??es: depoimentos e painel do QR restaurados; QR responsivo e reduzir movimento preservados.
- Velocidade: medidor e instru??es em cards novamente.
- CTAs compartilhados restaurados como pain?is do backup.

## Preservado
Wrap original max-w-6xl de 72rem; --content-max fixo de 72rem. Scroll-margin-top 90px e padding24px nas ?ncoras. IDs e marcadores laterais. Campos que quebram e-mail em vez de truncar. Destaques de celular em uma coluna abaixo de420px. Line-up mobile em coluna. Passos do suporte em3 colunas em1024 e5 a partir1280. Corre??o GestureHint ?5px com recorte intacta. Texto da tag de Cobertura e altera??es de conte?do feitas pelo Maestro preservados.

## Hero
Section raiz recebeu data-sem-fundo e bg-navy-ink opaco. Captura Home1440 confirma hero com fibras, sem mar vis?vel. Abissal avisado do contrato; seu c?digo controla o fundo geral.

## Base interativa ainda inativa
ui.tsx exporta useCardGlow, invocado uma vez por p?gina via usePageMeta. Listener passivo delegado e requestAnimationFrame atualizam somente --mx/--my, sem estado ou render React. Base CSS opt-in `.card[data-card-glow="on"]::before`, com pointer-events none; estado ativo/toque e foco previstos; reduzir movimento desativa efeito e eleva??o. Nenhum card recebeu o atributo de ativa??o. A refer?ncia GigasNet n?o foi identificada pelo Vigia, que explicitamente pediu aguardar descri??o. Assim, n?o atribuo ? GigasNet o prot?tipo radial preparado, nem apresento item4 como entregue visualmente.

## Arquivos
components/ui.tsx, Hero.tsx, AppsShowcase.tsx, SmartHome.tsx, Wifi6.tsx, MeshHouse.tsx, TmdbWeekly.tsx, CityMap.tsx, CepCheck.tsx, DownDetectorCard.tsx; index.css; p?ginas Home, Tv, Fixo, Movel, Entretenimento, Cobertura, Suporte, FaleConosco, Eventos, Avaliacoes, Velocidade. Internet/NotFound herdam altera??es comuns. Combo, PlanCarousel, App, Header, dados, DeepSea, Thread e SideRails n?o foram editados por mim.

## Provas parciais
Tsc final passou. Vite build passou (13,03s), com aviso de chunk3D existente. Detector Impeccable: []. Capturas s? pelo cap.mjs com Edge headless isolado em8086. Home375 e1440 sem overflow; hero e cards inspecionados em imagens. Demais rotas em valida??o; resultado final acrescentado abaixo. Logs de desenvolvimento com avisos Router e Framer, sem exce??es nas capturas j? recebidas. Houve erro tempor?rio Cannot find name useCardGlow durante inser??o do hook; foi corrigido e tsc repetido com sucesso; Trilho avisado.

### Consolida??o das provas da rodada 6
Home mais 11 rotas internas em375x812 e1440x900:24 combina??es, todas sem overflow. Todas as22 medi??es de rotas internas em result.txt foram analisadas: zero exce??es. As duas medi??es da Home tamb?m passaram sem exce??es. Capturas de in?cio e meio de todas as rotas foram inspecionadas nos pain?is overview; finais capturados tamb?m est?o dispon?veis. N?o afirmo que cada estado de hover, foco e toque foi exercitado pelo script, pois cap.mjs captura navega??o/rolagem sem intera??o de ponteiro. N?o medi768/1024/1920 nesta rodada. Avisos Router/Framer permanecem e foram informados ao Maestro.
Restauro conclu?do; item4 continua dependente da refer?ncia correta, conforme mensagem expl?cita do Vigia. Nenhum acabamento foi apresentado como c?pia da GigasNet. Base compartilhada pronta mas inativa.
