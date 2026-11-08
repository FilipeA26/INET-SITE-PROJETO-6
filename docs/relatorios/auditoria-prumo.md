# Auditoria Prumo · nota maest-2 no P6 — fim de página e outras rotas (27/10/2026)

Só auditoria: nenhum arquivo de `src/` foi editado. Servidor `http://localhost:8086` (não reiniciado).
Ferramenta: variante instrumentada do `cap.mjs` (Edge headless + CDP), em `scratchpad/prumo.mjs`; cada rota é
rolada devagar até o fim antes de medir (monta o conteúdo preguiçoso e as revelações).

## Veredito

**Nenhum achado grave.** As 9 rotas (Home + 8) fecham no rodapé nas duas larguras, sem rolagem horizontal, com um
tubo só, e o tubo não acrescenta altura ao documento. As 6 cartas levam às rotas certas em 1440 e 375 px.

## 1 · Fim de página (`scrollHeight` − borda inferior do rodapé)

| Rota | 1440: scrollH | 1440: dif. | 375: scrollH | 375: dif. | overflow | tubos |
| --- | ---: | ---: | ---: | ---: | :---: | :---: |
| / | 10256 | −0,05 | 11904 | −0,19 | false/false | 1 |
| /internet | 9160 | 0,47 | 10665 | 0,42 | false/false | 1 |
| /tv | 11010 | 0,38 | 10221 | −0,28 | false/false | 1 |
| /movel | 7729 | 0,41 | 8707 | 0,23 | false/false | 1 |
| /entretenimento | 3800 | −0,47 | 5362 | 0,08 | false/false | 1 |
| /telefone-fixo | 5841 | −0,34 | 7745 | 0,14 | false/false | 1 |
| /teste-de-velocidade | 4156 | −0,37 | 5643 | −0,30 | false/false | 1 |
| /cobertura | 4003 | −0,06 | 5105 | −0,42 | false/false | 1 |
| /fale-conosco | 3961 | 0,03 | 6005 | −0,48 | false/false | 1 |

- Todas as diferenças < 0,5 px (arredondamento subpixel) — limite do pedido era 2 px. Rolado até o fim, a borda
  inferior do rodapé coincide com a borda da janela em todas (`lastScreenBottomIsFooter: true`).
- `scrollWidth === innerWidth` em todas (1440 = 1440; 375 = 375).
- **Tubo e altura:** `scrollHeight` com o SVG e com o SVG em `display:none` é idêntico nas 18 medições (ex.: /tv 11010 = 11010;
  / 375 → 11904 = 11904). O SVG mede exatamente a altura do documento, não a empurra.
- A Home 1440 bate com o relatório do Ourives (10256). A Home 375 deu 11904 aqui contra 12034 lá — ele mediu em 375×**900**,
  eu em 375×**812**; não é regressão.
- Dados brutos: `auditoria-prumo/1440/medidas.jsonl`, `auditoria-prumo/375/medidas.jsonl`.

## 2 · Tubo por cima de conteúdo?

Estruturalmente não pode: em `src/App.tsx:105` o `<FiberTube />` é irmão anterior do `<main className="relative z-10">` e o SVG
é `absolute z-0 pointer-events-none` (`src/components/lusion/FiberTube.tsx:237`). Conferi por um segundo caminho:

- **Geometria:** amostrei o traçado inteiro a cada 12 px e cruzei com os retângulos de todo elemento com texto, imagem,
  canvas, vídeo, botão e carta. Houve cruzamentos (ex.: imagem do receptor em /tv 1440, canvas dos heróis, FAQ claro de
  /internet, /cobertura, /movel e /telefone-fixo em 375, linha "INET TELECOMUNICAÇÕES LTDA" da Home).
- **Visual:** capturei cada um desses pontos (`auditoria-prumo/alvos/`, folhas `folha-375.jpg` e `folha-1440.jpg`) e olhei:
  em todos o tubo fica **atrás** — some sob as seções claras (FAQ) e sob imagens/cartas opacas; nenhum texto riscado.
- Capturas das 5 paradas (0/0,25/0,5/0,75/1) das 9 rotas em 1440 e 375, olhadas pelas folhas de contato em
  `auditoria-prumo/folhas/` (originais em `auditoria-prumo/1440/` e `/375/`).

### Observações (não graves, para a Lente/Maestro decidirem)
1. **375 px — tubo colado no texto:** o trecho vertical corre em x ≈ 8–10 px, e o texto começa em x = 20 px
   (heróis de /internet, /tv, /movel, /teste-de-velocidade; lista "01…07" de /teste-de-velocidade). Não sobrepõe,
   mas fica a ~10 px da letra; visto em `folhas/teste_de_velocidade-375.jpg` (3ª tela) e `folhas/movel-375.jpg` (1ª).
2. **Tubo some nas seções claras** (FAQ claro, bloco "A TV que vai aonde você vai"): é o z-0 funcionando, mas a linha
   "quebra" e reaparece abaixo. Efeito de design, não defeito.
3. **/entretenimento 1440 (4ª tela):** a curva do tubo desce junto ao canto superior direito da carta "Monte seu plano",
   encostando na borda dela (atrás, não por cima).

## 3 · Cartas da Home (clique real por CDP no centro de cada carta)

| Carta | 1440 → rota | 375 → rota | Centro clicável |
| --- | --- | --- | :---: |
| 01 Internet e Wi-Fi | /internet ✔ | /internet ✔ | sim |
| 02 INET TV | /tv ✔ | /tv ✔ | sim |
| 03 Telefone fixo | /telefone-fixo ✔ | /telefone-fixo ✔ | sim |
| 04 Chip móvel | /movel ✔ | /movel ✔ | sim |
| 05 Entretenimento | /entretenimento ✔ | /entretenimento ✔ | sim |
| 06 Teste de velocidade | /teste-de-velocidade ✔ | /teste-de-velocidade ✔ | sim |

`elementFromPoint` no centro devolve o próprio `<a>` ou o `<h3>` dentro dele (nada cobre a carta). Depois do clique a página
nova abre no topo (`scrollY: 0`) com o `h1` certo. Dados: `auditoria-prumo/*/cartas.jsonl`.

## 4 · Console
Nenhum `error` nem `EXCEPTION` nas 18 cargas. Persistem só avisos já conhecidos: future flags do React Router e
"container has a non-static position" do Framer Motion (/, /internet, /tv, /movel).

## Limites
- Não rodei `npx tsc -b` nem `vite build` (é a parte do Crivo); não olhei tema claro (o site não tem alternância nessas rotas).
- A primeira passada da Home saiu em branco porque o Git Bash converteu `/` em `C:/Program Files/Git`; refeita com
  `MSYS_NO_PATHCONV=1` e substituída. Rotas sem barra inicial não foram afetadas.
