# Vigia — checklist da Rodada 5 (INET)

Revisor: Vigia (Claude). Não edito código; só este arquivo.
Fonte das notas: lidas no disco do workspace do Maestri
(`~/.maestri/workspaces/f4585c0c-…/notes/*.md`), porque `maestri note read` respondeu
"No connection to note" para as seis — elas não estão ligadas ao nó do Vigia no canvas.

Legenda: **OK** (conferido com prova) · **FALTA** (ainda não feito) · **QUEBROU** (feito com defeito)
· **SUBSTITUÍDO** (a nota nova manda o contrário; não cobrar) · **PARCIAL**.

Dono por item: Trilho (laterais e bolinha) · Moldura (centralização, cards abertos) ·
Abissal (fundo) · Meridiano (Monte seu combo) · Maestro (dados em `src/data/inet.ts`).

---

## A. `tirar-esses-cards-latera` + pedido de hoje (prioridade máxima)

| # | Item | Dono | Situação | Prova |
|---|------|------|----------|-------|
| A1 | Tirar os cards laterais (SideRails) | Trilho | **OK** | `SideRails.tsx` agora só desenha 4 fibras decorativas, sem cards; captura `final/_-1440-0.jpg` sem 'Cobertura'/'Minha conta' |
| A2 | Voltar com a estrutura centralizada | Moldura | **OK** | coluna central 208–1232 px a 1440 em todas as 6 rotas capturadas |
| A3 | Só planos de 700, 800 e 1000 Mega (1 Giga) | Maestro | OK (internet) · PENDENTE-FILIPE (combos) | grupo "principais" em `inet.ts:110-112` OK. Decisão do Maestro: a regra vale para os planos de INTERNET; os grupos "Com telefone fixo" (300/650/700) e "Com chip móvel" (300/650) ficam em Fixo/Móvel até o Filipe dizer se ainda existem |
| A4 | Aba "Monte seu combo": plano + Mesh + câmera + INET TV (sim/não) + streaming → valor fictício → leva ao comercial | Meridiano | **OK** (reconferido) | rota `App.tsx:138`, `pages/Combo.tsx`, `data/combo.ts`; total soma certo, streaming incluso = R$ 0, WhatsApp do comercial. Defeitos enviados ao Meridiano: especificações inventadas de câmera/Mesh, rótulo 'CONFIGURAÇÃO' sobre título, preço encostando no '/mês' a 1440, quebras a 375 e barra 'Contratar' cobrindo o rodapé |
| A5 | Evitar cards quadrados; conteúdo abre até as bordas, sem vazio lateral | Moldura | **PARCIAL** | blocos abertos com divisórias na maioria das seções (ex.: Wi-Fi 6); margens preenchidas pelo fundo, não por conteúdo. Ainda há caixas: painel do roteador Wi-Fi 6 (quadrado, cantos retos) e as caixas Mesh/TV/Resumo do combo |

## B. `https-stock-adobe-com-br-ima` (substitui partes de `adicionar-mais-dinamismo-ao` e `referencias-3`)

| # | Item | Dono | Situação | Prova |
|---|------|------|----------|-------|
| B1 | Fundo animado inspirado na imagem (cabos brilhando no leito marinho escuro e acidentado), desenhado em código, sem baixar a imagem | Abissal | **OK** | canvas: leito facetado, cabos com núcleo claro e halo, bolhas de luz; nenhuma imagem baixada |
| B2 | Sempre na paleta: electric #0062EC, ciano #5CC8FF, lime #70E000 — **nada de vermelho** | Abissal | **OK** | grep sem vermelho em `DeepSea.tsx`; capturas só azul/ciano/lime |
| B3 | Bolinha que segue a página **sem o traçado** — só ela indo | Trilho | **OK** | `Thread.tsx:100` o caminho fica em `<defs>` sem stroke; só a cabeça (`:108-109`) aparece |
| B4 | Bolinha **mais lenta** que hoje | Trilho | **OK no código** | `Thread.tsx:65-67` lerp 0,05 a 60 Hz, independente da taxa de quadros. Velocidade não medida em movimento |

## C. `organizacao-do-hud` (continua valendo)

| # | Item | Situação | Prova |
|---|------|----------|-------|
| C1 | Ordem: INET · Serviços▾ · Cobertura · Velocidade · INET Eventos · Avaliações · Atendimento▾ · Ver planos · Fale conosco | OK no código | `Header.tsx:130-152` |
| C2 | Serviços: Internet e Wi-Fi · Chip móvel · INET TV · Telefone fixo · Entretenimento (com as descrições da nota) | OK + 1 extra | `Header.tsx:9-13` batem com a nota; `:14` acrescenta "Monte seu combo" (pedido novo A4 — aceitável, a nota do HUD dizia só reordenar) |
| C3 | Atendimento: Suporte técnico · Financeiro · Comercial | OK | `Header.tsx:27-29` |
| C4 | Ícone verde de INET Eventos preservado | **OK** | todas as capturas 1440 |
| C5 | Mobile: todos os itens na mesma ordem, sem corte | OK no código (gaveta não capturada aberta) | `Header.tsx:193` |
| C6 | Visual do menu idêntico (só ordem) | **OK** | pílula, cores e botões iguais à R4 nas capturas |

## D. `precos`

| # | Item | Situação | Prova |
|---|------|----------|-------|
| D1 | 700 Mega R$ 99,90 | OK | `inet.ts:110` |
| D2 | 800 Mega R$ 119,90 | OK | `inet.ts:111` |
| D3 | 1 Giga R$ 199,90 (site antigo, com aviso) | OK | `inet.ts:112` + `note` |
| D4 | 100 Mega R$ 79,90 e 350 Mega R$ 84,90 | SUBSTITUÍDO por A3 (fora do site) | |
| D5 | INET TV 29,90; Disney+ 29,90; HBO Max 29,90; GloboPlay Premium 29,90; Deezer 14,90 | OK nos dados | `inet.ts:145-154` |
| D6 | Câmera interna 19,90; externa 29,90; Alexa 49,90 | OK nos dados | `inet.ts:157-159` |
| D7 | Fixo 49,90 (10 dias portabilidade); Móvel 44,90 (5 dias) | OK nos dados | `inet.ts:161-162` |
| D8 | Monte seu combo usa esses preços (exceto o que for fictício, ex.: Mesh, que não tem preço na nota) | **OK** | `combo.ts` lê `PLAN_GROUPS`, `INET_TV`, `ADDONS`; Mesh R$ 29,90 marcado 'fictício — validar' |
| D9 | Nenhum texto fala em 100/350 Mega ou "até 800 Mega" | **OK** (final) | grep: só comentário em `inet.ts:102` e dicas técnicas de Velocidade ("acima de 100 Mega/Mbps" = gigabit, não é plano) |
| D10 | FAQ de `Internet.tsx:46` cita "INET Livre (500 Mega, 700 Mega e 1 Giga)" — 500 Mega não está entre os planos mostrados | PENDENTE-FILIPE (Maestro: não mexer) | |

## E. `adicionar-mais-dinamismo-ao` (Rodada 4)

| # | Item | Situação |
|---|------|----------|
| E1 | Mais dinamismo e profundidade | mantém |
| E2 | Evitar abas laterais vazias com cards JSON nas laterais | **SUBSTITUÍDO** por A1/A5 (tirar cards; abrir o conteúdo até as bordas) |
| E3 | Enquadrar cada seção ao clicar no HUD, em todas as telas | mantém (Moldura validou na R4; reconferir) |
| E4 | Fundo com fibras pelo mar chegando a um local | mantém, refinado por B1/B2 |
| E5 | Globo girando atrás dos planos, na paleta | mantém (PlanGlobe) |
| E6 | Luzinha lateral "mais linear e fluida, acompanhando os movimentos" | **SUBSTITUÍDO** por B3/B4 (sem traçado e mais lenta) |
| E7 | Usar mais os espaços laterais | **SUBSTITUÍDO** em parte: usar a largura com conteúdo aberto (A5), não com cards nas laterais |

## F. `referencias-3`

| # | Item | Situação |
|---|------|----------|
| F1 | Vídeo Adobe: cabo submarino brilhando com raios de sol | referência visual mantida |
| F2 | Imagem Adobe: cabos vermelho e azul no leito marinho | **SUBSTITUÍDO** em cor por B2 (sem vermelho) |
| F3 | Vídeo Adobe: cabos entre rochas e vida marinha | referência visual mantida |

## G. Provas gerais (cada entrega)

| # | Item | Situação |
|---|------|----------|
| G1 | `npx tsc -b` sem erro | a conferir |
| G2 | `npx vite build` sem erro | a conferir |
| G3 | Capturas 375 e 1440 em /, /internet, /tv, /monte-seu-combo, /cobertura, /fale-conosco — olhadas | a conferir |
| G4 | Zero rolagem horizontal | a conferir |
| G5 | Console limpo | a conferir (R4 tinha aviso do Framer e flags do React Router) |
| G6 | Acentos sem mojibake | **QUEBROU** em `docs/relatorios/moldura.md` (gravado com "?" no lugar dos acentos) — é documento, não site; conferir o site nas capturas |
| G7 | Contraste do texto sobre o fundo | a conferir |

---

## Rodadas de conferência

### Varredura 0 — 26/10/2026 (estado de partida)
Código + capturas cap.mjs (Edge sem janela) em `C:/Users/yuzzi/AppData/Local/Temp/claude/vigia/v0/`,
rotas /, /internet, /tv, /monte-seu-combo, 1440x900 e 375x812, paradas 0 / 0,5 / 1.

- A1 FALTA — Home 1440 (`_-1440-0.jpg`): cards "Cobertura" e "Minha conta" nas laterais.
- A4 FALTA — `/monte-seu-combo` abre o 404 "Essa fibra não chega aqui." (`_monte_seu_combo-1440-0.jpg`).
- C1 OK na captura — menu na ordem da nota; ícone verde de INET Eventos presente.
- Defeito visual pequeno (sem dono definido, provavelmente Hero/GestureHint): no selo
  "Passe o dedo pelas fibras" (Home 1440, canto superior direito) um círculo escuro e o ícone
  da mão cobrem o "P".
- Observação de gosto (preexistente, não é da R5): o hero da Home e o 404 têm rótulo
  caixa-alta espaçado acima do título ("INTERNET 100% FIBRA ÓPTICA · TEÓFILO OTONI",
  "ERRO 404") — padrão que o Filipe lista como "cara de IA". Levar ao Maestro, não cobrar.
- G4 — 1ª medição: /internet e /tv a 375 deram scrollWidth 451 (overflow). Remedido logo
  depois com script de varredura de elementos: 375/375, nenhum elemento passando da borda.
  Era transitório (HMR do Moldura no meio da captura). Reconferir na próxima varredura.
- G5 PARCIAL — sem erros nem exceções; persistem 2 avisos de flags futuras do React Router
  e o aviso do Framer "container has a non-static position" (já vinham da R4).

### Varredura final — 26/10/2026
Capturas: `C:/Users/yuzzi/AppData/Local/Temp/claude/vigia/final/` — /, /internet, /tv,
/monte-seu-combo, /cobertura, /telefone-fixo; 1440x900 e 375x812; paradas 0/0,25/0,5/0,75/1
(60 capturas; olhei 15 representativas, incluindo todas as de 1440 do combo).

- G1 **OK** — `npx tsc -b` saída 0.
- G2 **OK** — `npx vite build` (saída num diretório temporário, sem tocar `dist/`) saída 0, 9,18 s;
  aviso de chunk > 500 kB do `Wifi6Router3D` (845 kB), preexistente.
- G3 **OK** — capturas feitas e olhadas (lista acima).
- G4 **OK** — 12/12 combinações rota×largura com scrollWidth = clientWidth (overflow false).
- G5 **PARCIAL** — zero erros e zero exceções; persistem 2 avisos de flags futuras do React Router e
  o aviso do Framer "non-static position" (preexistentes, fora dos arquivos da R5).
- G6 **OK** — grep de mojibake (`Ã©`, `Ã§`, `Ã£`, `â€`…) em `src/` e `index.html`: nada; acentos
  certos nas capturas.
- G7 **QUEBROU no celular** — desktop OK depois do ajuste do Abissal (cabos nas margens; seção
  Wi-Fi 6 livre). A 375, cabos verticais claros e bolhas passam por cima dos parágrafos
  (`_telefone_fixo-375-1.jpg`, `_tv-375-2.jpg`, `_-375-1.jpg`). Enviado ao Abissal.
- Selo "Passe o dedo pelas fibras" — **OK** depois da correção do Moldura (`GestureHint.tsx`:
  drag/swipe ±5 px, círculo `overflow-hidden shrink-0`), conferido em `v1/_-1440-0.jpg`.
- Rótulo caixa-alta sobre título preexistente (hero/seções): o Maestro leva ao Filipe; não cobrado.
  O caso **novo** do combo ('CONFIGURAÇÃO' sobre 'Resumo do Combo') foi cobrado do Meridiano.

### Reconferência — 26/10/2026, 23:25
Capturas: `C:/Users/yuzzi/AppData/Local/Temp/claude/vigia/r2/`.
- `tsc -b` saída 0; `vite build` saída 0 (8,28 s). Overflow false e nenhum erro em
  /monte-seu-combo (1440 e 375), /telefone-fixo 375, /tv 375.
- A4 **OK** — grep sem 'Full HD', 'infravermelh', 'bidirecional', 'IP65', 'prova d', 'dois pontos',
  '2 nós', 'alta definição'; textos neutros ('Amplia o Wi-Fi para mais cômodos', 'Câmeras de
  segurança para sua residência'). 'CONFIGURAÇÃO' removido. Preços a 1440 com espaço antes do
  '/mês' e mesmo tamanho nos 3 planos. A 375, '05' inteiro, 'Adicional' separado do valor,
  rodapé (© 2026…) livre acima da barra 'Contratar'.
- G7 **OK** — a 375, os cabos ficaram finos e apagados nas bordas; parágrafos de Fixo e TV limpos.
- Sobra (não bloqueia): rótulos 'OPCIONAL'/'MÚLTIPLA ESCOLHA' e 'SIMULADOR DE PLANOS' em
  caixa-alta no combo — mesmo padrão preexistente que o Maestro leva ao Filipe.


---

# Rodada 6 — nota `image-c-users-yuzzi-maest` (vale mais que as anteriores)

Substituições: R6-2 desfaz A5 ("sem cards quadrados"); R6-3 desfaz o "véu central escuro" da R4/R5;
R6-1 tira o fundo do mar só do hero da Home (B1 continua no resto); R6-6 refina B3/B4.

| # | Item | Dono | Situação | Prova |
|---|------|------|----------|-------|
| R6-1 | Hero da Home sem fundo do mar, só fibras penduradas + animação | Abissal/Moldura | **OK** | `DeepSea.tsx` heroFade=0 na Home; `r6/_-1440-0.jpg` só fibras e pontos verdes |
| R6-2 | Cards voltam como eram | Moldura | **OK** | cards do Wi-Fi 6 e planos de volta em caixa (`r6/_internet-1440-1.jpg`); Moldura comparou com o backup da R4 |
| R6-3 | Tirar a sombra escura do corpo (véu/vinheta central) | Abissal | **OK no código** | comentário e remoção em `DeepSea.tsx:37`; laterais iluminadas nas capturas |
| R6-4 | GigasNet como referência de fundo interativo NOS CARDS | Moldura | **PENDENTE-FILIPE** | gigasnet.com.br/.net.br/.com/.net sem DNS; busca só traz nomes parecidos. Moldura deixou `useCardGlow` inativo (nenhum `data-card-glow`) |
| R6-5 | Remover a "borda" vertical (fim da faixa do SideRails, x≈144/1296) | Trilho | **OK** | `SideRails.tsx:11,23-24` sem aura e com máscara horizontal; nenhuma linha dura nas capturas a 1440 |
| R6-6 | Bolinha por cima do site, menos brilho/desfoque ao passar por algo, sem teleporte, mais lenta | Trilho | **OK no código** | `Thread.tsx:126` portal fixed z-30; `:84-87` lerp 0,035 + limite 480 px/s; `:93-94` opacidade 0,16 e blur 3 px sobre elementos. Não medido em movimento |
| R6-7 | Preços encaixando no combo (700 99,90 · 800 119,90 · 1 Giga 149,90) | Meridiano | **OK** · defeito à parte | `inet.ts:109-111`; encaixe certo a 1440 e 375. Defeito: o combo abre com TUDO marcado (R$ 329,30) — enviado ao Meridiano |
| R6-8 | Fundo premium/cinematográfico, pode cortar por seção + nota de sites | Abissal / Vigia | **PARCIAL** (estética) · contraste **OK** após correção | nota `referencias-cinematograficas` reescrita pelo Vigia (5 sites abertos com URL). DeepSea tem grão, sem névoa por distância, light leak ou corte por seção. Contraste: cabo azul com bokeh atravessa texto em /internet, /tv e combo a 1440 — enviado ao Abissal |

### Provas da varredura R6 — 26/10/2026
- `tsc -b` 0 · `vite build` 0 (6,51 s).
- cap.mjs em /, /internet, /tv, /monte-seu-combo, /cobertura, /telefone-fixo × 1440/375 × 5 paradas:
  12/12 sem overflow, zero erros/exceções (2–3 avisos conhecidos de Router/Framer). Pasta `vigia/r6/`.
- Nota anterior "referencias-cinematograficas" (do Abissal) citava "Apple Subsea Fiber", Linear/Stripe
  Press, BBC Earth sem URL e gigasnet.com.br inexistente → reescrita. Sobrou a nota duplicada
  "referencias-cinematograficas-2" (minha 1ª tentativa); não apaguei (apagar só com a palavra do Filipe).
- 23:58 — R6-7 defeito do padrão **corrigido** pelo Meridiano: `Combo.tsx:42-48` abre com 800 + HBO
  incluso, sem adicionais; captura `vigia/r6b/_monte_seu_combo-375-0.jpg` mostra "2 itens · R$ 119,90",
  sem overflow e sem erro. Aguardando o Abissal (contraste dos cabos nas páginas internas).
- 00:00 (27/10) — R6-8 contraste **corrigido** pelo Abissal (`DeepSea.tsx` 23:59): cabos fortes só nas
  margens a 1440; na coluna de texto só linhas finas do leito. Capturas `vigia/r6c/` (/internet, /tv,
  /monte-seu-combo × 1440/375 × 3 paradas): texto limpo, sem overflow, sem erro; `tsc -b` 0, build 0 (7,34 s).
  Continua PARCIAL na estética: sem névoa por distância, light leak ou corte por seção.

### Veredito R6 (Vigia): APROVADO COM RESSALVAS — itens 1, 2, 3, 5, 6, 7 OK; item 4 PENDENTE-FILIPE (URL);
item 8 com contraste OK e estética parcial.

---

## Rodada 7 — nota "estude-esses-sites-para-fazer" (vale mais que as anteriores)

Estudo: `docs/relatorios/estudo-r7.md`. Capturas dos 7 sites em `estudo-r7/vigia/`, feitas com cap.mjs e com
capwheel.mjs (rolagem por roda, para lusion, activetheory e refokus; o activetheory só renderizou com WebGL
por GPU). Nota "referencias-cinematograficas" ganhou a seção "Rodada 7". Trechos do estudo enviados a
Meridiano (lusion), Moldura (laterais), Abissal (fundo por seção) e Trilho (refokus: conferido o /about).

Revisão do site local: capturas em `C:/Users/yuzzi/AppData/Local/Temp/claude/vigia/r7/`.

| # | Ponto | Resultado | Prova |
|---|---|---|---|
| R7-A | Laterais preenchidas | PARCIAL. Há seções em split (título à esquerda, card à direita) e mídia grande no meio. Nas heroes de Home, Móvel e TV a 1440 e 1920, a metade direita continua vazia. | `r7/home/_-1440-0`, `r7/movel/_movel-1440-0` |
| R7-B | Fundo refeito por seção, sem cor nas laterais | OK. DeepSea não é usado em nenhuma página; SideRails retorna null; SectionBackdrop (ink, mist, snow, cinematic) por seção, com seções neve alternadas. CinematicCanvas pausa fora da tela e com a aba oculta, DPR ≤ 2 e reduced-motion. | `src/components/fundos/*`, `SideRails.tsx:2` |
| R7-C | Giro (celular/TV) e lateral → centro | OK. ScrollSpin no Móvel gira o celular; SideToCenter no TV traz o receptor da direita para o centro. Reduced-motion no código. Sem dependência nova. | `r7/movel/*-1440-1..3`, `r7/tv/*-1440-1..2` |
| R7-D | Mídia crescendo (lusion) | PARCIAL. O ExpandMedia na Home é sticky, vai do duotone à cor e fica sem overflow, mas começa grande e centrado (86vw) em vez de pequeno à esquerda; anima width e height. | `ExpandMedia.tsx`, `r7/home/_-1440-1..6` |

### Provas

- `npx tsc -b`: 0.
- `vite build` (outDir temporário): 0, só com o aviso de chunk > 500 kB.
- 18 combinações (Home, Móvel e TV a 375, 768, 1440 e 1920; Internet e Combo a 375 e 1440): sem overflow e sem erro ou exceção no console.

### Regressões conferidas

- Preços em `inet.ts:109-111`: 99,90, 119,90 e 149,90. OK.
- O combo abre com 800 + HBO. OK.
- O menu do header está igual. OK.
- As âncoras `#planos` e `#assinar` existem. OK.
- Os textos novos da Home já existiam no HEAD (Hero, FaleConosco, Suporte), então não são inventados.

### Defeitos devolvidos

Ao Moldura:
1. `Home.tsx:65`: o `.lead` fica branco sobre a seção neve (ilegível a 375, 768 e 1440). O `index.css:138-146` não cobre `.lead`.
2. Título "Tudo o que conecta a sua casa." repetido na Home (ExpandMedia e seção de serviços).
3. `Movel.tsx:69`: o "+2GB" sobrepõe o parágrafo no layout split a 1440 e 1920 (regressão da R7).

Ao Meridiano (ExpandMedia):
- Ponto de partida pequeno e à esquerda, como no lusion.
- Animar com scale e clip-path em vez de width e height.
- `hue-rotate(185deg)` puxa a foto azul para o laranja.

### Notas

- Erro meu: a rota do telefone fixo é `/telefone-fixo`; capturei `/fixo` e caiu no 404 (o 404 funciona).
- O Moldura relatou que um lote de capturas de `/cobertura` 375 mostrou o mosaico do refokus. Pode ter sido interferência de Edge sem janela rodando ao mesmo tempo (os meus capwheel); causa não verificada. A recaptura dele está válida.

### Veredito R7 (Vigia): REPROVADO ATÉ CORRIGIR os defeitos 1 e 3 (legibilidade e sobreposição)

- B e C estão OK.
- A e D estão parciais.
- Depois das correções, eu reconfiro.

### Reconferência R7 (Vigia)

Capturas em `C:/Users/yuzzi/AppData/Local/Temp/claude/vigia/r7b/` (Home, Móvel e TV a 375, 768, 1440 e 1920):
`tsc -b` 0, build 0, 12/12 sem overflow e com zero erros.

| Defeito | Situação | Prova |
|---|---|---|
| 1. `.lead` branco sobre a neve | CORRIGIDO (`index.css:139`, navy a 80%): legível a 375, 768 e 1440 | `r7b/home/_-1440-4`, `_-768-1` |
| 2. Título repetido | CORRIGIDO: o ExpandMedia agora usa "Internet fibra de até 1 Giga.", texto que já existe em `Internet.tsx:20` | `r7b/home/_-1440-1` |
| 3. "+2GB" sobre o texto | CORRIGIDO: `shrink-0` e `whitespace-nowrap` | `r7b/movel/_movel-1440-1`, `_movel-768-1` |
| A. Heroes vazias | OK: a 1440 e 1920, a Home mostra a casa inteligente, o Móvel o InetPhone e a TV o receptor, todos assets que já existiam. No celular e a 768, o objeto aparece abaixo do texto. | `r7b/*/*-1440-0`, `*-1920-0` |

### Veredito R7 final (Vigia): APROVADO COM RESSALVAS

- A, B e C estão OK.
- D está parcial: o ExpandMedia começa grande e centrado e anima width/height. Os ajustes foram enviados ao Meridiano e não reconferi depois disso.
- FPS não medido.
- Reduced-motion conferido só no código.

### R7-D reconferido (ExpandMedia, Meridiano)

Capturas em `C:/Users/yuzzi/AppData/Local/Temp/claude/vigia/r7c/`.

| Largura | Resultado |
|---|---|
| 1440 | OK. O card parte pequeno à esquerda, em duotone azul, e cresce com scale e x (transform) até a margem do grid. Sem overflow e sem erro. |
| 375 | A animação roda. O relatório do Meridiano dizia "estático", o que não confere. |

Defeito devolvido ao Meridiano:
- `ExpandMedia.tsx:248`: `useTransform` chamado dentro do JSX, depois de um return condicional. Viola a regra dos hooks.
- O relatório dele precisa ser corrigido no ponto do celular.

Levado ao Maestro: `casa-inteligente.webp` aparece duas vezes seguidas na Home (hero e ExpandMedia).

### Troca de imagem do ExpandMedia (Moldura)

Capturas em `C:/Users/yuzzi/AppData/Local/Temp/claude/vigia/r7d/`, a 1440: sem overflow.

- A repetição colada entre a hero e o ExpandMedia foi resolvida.
- Achado novo: `inet-tv-receptor.webp` agora aparece no ExpandMedia (`Home.tsx:28`) e de novo na seção de TV (`Home.tsx:78`), duas seções abaixo.
- O título "Internet fibra de até 1 Giga." ficou sobre a foto de um TV box, e o texto não combina com a imagem.
- Não existe foto de roteador em `public/`. Imagens que já existem: `/casa/alexa-poster.webp`, `/casa/seg-poster.webp`, `/casa/mibo.webp`.
- Decisão levada ao Maestro.

### R7-D final (ExpandMedia)

Capturas em `C:/Users/yuzzi/AppData/Local/Temp/claude/vigia/r7e/`. `tsc -b` 0. Sem overflow a 375 e a 1440.

- **Hooks:** todos no topo, antes do `return` (`ExpandMedia.tsx:82-129`, `imageFilter` em `:114`). CORRIGIDO.
- **Celular:** bloco estático em `block sm:hidden`, conferido nas capturas a 375. O sticky fica só em `sm:block`. CORRIGIDO.
- **Console:** só os 3 avisos já conhecidos (Framer non-static e 2 do React Router).
- **Pendente com o Maestro:** o receptor aparece duas vezes na Home, e o título "Internet fibra…" está sobre a foto do TV box.

**Veredito R7: APROVADO COM RESSALVAS.**
- A, B, C e D estão OK.
- Escolha da imagem do ExpandMedia: com o Maestro.
- FPS não medido.
- Reduced-motion conferido só no código.

## Teste 1 — revisão final (27/10/2026)

Relatório completo: `docs/relatorios/teste1-revisao-final.md`. Capturas em `C:/Users/yuzzi/AppData/Local/Temp/claude/vigia/fin/`.

- [x] `npx tsc -b` 0; `npx vite build` 0.
- [x] 3 modos (NORMAL, REDUCED, TOUCH) a 375 e 1440, com `matchMedia` confirmado no JSON de cada rodada.
- [x] Zero rolagem horizontal a 375 (`/`, `/internet`, `/tv`, `/movel`); sem mojibake; zero exceções; console só com os avisos conhecidos.
- [x] a) FiberTube: v4 reprovada (por cima do texto, picada); v6 contínua, atrás do `<main>`, oculta na neve. Ressalva: pulso sem pausa fora da tela; FPS não medido.
- [x] b) ReelUnfold: colisão de rótulos achada e corrigida pelo Meridiano; textos reais; sem caixa-alta.
- [x] c) Menu: escurece sobre a neve depois da correção do Maestro (09:14).
- [x] d) MediaCard: cresce com a rolagem.
- [x] e) HoverJitter: roda no NORMAL; nada no REDUCED nem no TOUCH (sonda). Ressalva: sutil.
- [x] Extra: Home, TV e Móvel renderizam no REDUCED sem erro.

**Veredito Teste 1: APROVADO COM RESSALVAS.**
