# Auditoria Crivo · nota maest-2 (conteúdo e código) · 27/10/2026

Escopo: `src/components/lusion/ServiceCards.tsx`, `ConnectFinale.tsx`, `FiberTube.tsx`, o trecho alterado de `src/pages/Home.tsx` e `src/App.tsx`.
Só auditoria: nenhum arquivo de `src/` foi editado.

## Resultado

**Nada inventado e nenhum defeito grave.** `npx tsc -b` saiu com código 0 (rodado por mim). As 6 rotas existem, telefones e lojas vêm direto de `inet.ts`, e não há vazamento de rAF, listener nem IntersectionObserver. Sobram 5 achados médios ou baixos (tabela abaixo).

## 1 · Conteúdo: tudo tem origem

| Texto novo | Onde está na base | Situação |
| --- | --- | --- |
| 6 títulos e 6 textos das cartas (`ServiceCards.tsx:8-13`) | backup `Home.tsx:104-109` | idênticos, caractere por caractere |
| "Vamos nos conectar?" | ConnectFinale do Teste 2 (pedido do Filipe) | ok |
| "Planos de até 1 Giga com Wi-Fi grátis, TV, telefone fixo e chip 5G. Suporte técnico 24 horas pelo WhatsApp." (`ConnectFinale.tsx:313`) | `src/components/Hero.tsx:33` (não está em `inet.ts` nem na lista antiga, mas já existia no site) | não inventado |
| Mensagem do WhatsApp "Olá! Quero contratar a internet fibra da INET." | começo da mensagem de `SlideToSubscribe.tsx:24` | ok |
| Telefones (3) | `PHONES` em `inet.ts:21-25`, via `.map` | batem (rótulo, número e `tel:`) |
| Lojas (4) | `STORES` em `inet.ts:55-61`, via `.map`, só o nome | batem; o endereço "a confirmar" de Carlos Chagas não aparece |
| Rodapé "INET TELECOMUNICAÇÕES LTDA · Teófilo Otoni - MG" | `COMPANY` | bate |
| Números "01" a "06" nas cartas | índice gerado (`padStart`) | é ordem, não é dado |

Nenhum número, preço, velocidade ou especificação foi inventado.

## 2 · Rotas

As 6 cartas apontam para `/internet`, `/tv`, `/telefone-fixo`, `/movel`, `/entretenimento` e `/teste-de-velocidade`. Todas estão declaradas em `src/App.tsx:125-130`.
Prova em execução: clique programático na carta `/internet` → `location.pathname === "/internet"`, a 1440 e a 375 px. A diferença do `App.tsx` contra o backup é uma linha só (o import `fundos/FiberTube` → `lusion/FiberTube`, comparado com `diff --strip-trailing-cr`).

## 3 · Código: medido em execução

Sonda headless (Edge + CDP, `requestAnimationFrame` instrumentado; contagem de chamadas em 1 s com a página parada):

| Situação | ConnectFinale | FiberTube | Resultado |
| --- | ---: | ---: | --- |
| 1440, topo da Home (contato fora da tela) | 0 | 100 | o contato pausa fora da tela ✔ |
| 1440, fim da Home (contato visível) | 101 | 101 | o contato anima só quando aparece ✔ |
| 375, topo | 0 | 101 | ✔ |
| Depois de ir para /internet | 0 (desmontado) | 100 | sem vazamento ✔ |

Além disso: `overflow:false` a 1440 e a 375. No console, nenhum erro nem exceção; só 3 avisos que já existiam antes (posição de contêiner do Framer Motion e duas future flags do React Router).
Nos três componentes, a limpeza remove todo `addEventListener`, `observe` e `requestAnimationFrame`. Nas cartas, `useScroll` e `useSpring` usam o `SPRING` de `src/motion.ts`.

### Achados

| # | Gravidade | Onde | Achado e prova |
| --- | --- | --- | --- |
| 1 | média | `ServiceCards.tsx:43,48` | **No celular, as 6 cartas ficam empilhadas em uma coluna com altura mínima de 250 px.** A 375 px elas vão do topo 1521 ao 2903 (+~250), cerca de 1630 px de cartas. É a maior parte do aumento do `scrollHeight` de 10447 → 12034, e o Filipe pediu "não estique tanto o site para baixo". Entre 640 e 1023 px também é 1 coluna (não existe `sm:grid-cols-2`). Sugestão: 2 colunas a partir de `sm`, altura mínima menor no celular, ou carrossel com arraste (a tarefa permitia). |
| 2 | média | `FiberTube.tsx:192` | **O laço de rAF do tubo nunca para**, nem com a página parada: 100 chamadas/s em todas as medições, e a cada quadro grava estilo em 5 traços e 3 pulsos. É de propósito (os pulsos andam com o tempo), mas no celular gasta bateria com a tela parada. Sugestão: parar o laço quando `drawn` alcançar o alvo e nenhum pulso estiver na tela, ou reduzir a taxa quando estiver parado. Só pausa com `document.hidden`. |
| 3 | baixa | `ConnectFinale.tsx:54-67,267` | O canvas só é redimensionado no `resize` da janela. Se a altura da seção mudar sem a janela mudar (fonte carregando, texto quebrando de outro jeito), o canvas fica com o tamanho antigo, porque `style.height` é fixado em px. Sugestão: trocar por `ResizeObserver(section)`. |
| 4 | baixa | `ConnectFinale.tsx:323` | O botão usa `transition-transform hover:scale-105` com a curva padrão do Tailwind, não a curva única de `motion.ts`. A seção também tem `aria-label` igual ao `h2`: o certo é `aria-labelledby` apontando para o título (evita rótulo duplicado). O link abre em nova aba (`target=_blank`) sem avisar quem usa leitor de tela. |
| 5 | baixa | `ServiceCards.tsx:27` | O nome acessível de cada carta começa com o número ("01 Internet e Wi-Fi Até 1 Giga…"): o leitor de tela lê "zero um". Sugestão: `aria-hidden` no `<span>` do número. A seção "03 — Serviços" com cartas "01…06" dentro também pode confundir a numeração visual (cabe à Lente julgar). |

Observações sem ação obrigatória:
- A 1440 px, com as cartas ainda abertas em 9°, a caixa das cartas laterais vai de x = 40 a x = 1400. O tubo (26 px, centro em x ≈ 28,8 e 1411) encosta nelas por cerca de 2 px. A carta fica **por cima** do tubo (main z-10 > tubo z-0), então o tubo não cobre texto. A conferência visual é da Lente.
- `tsconfig.json` não tem `noUnusedLocals`, então o `tsc` não pega import sobrando. Conferi à mão em `Home.tsx`: todos os imports que ficaram são usados.
- `src/components/Thread.tsx` e `src/components/fundos/FiberTube.tsx` não são mais importados por ninguém (código morto, não entra no bundle). Fica para o Maestro decidir se apaga.
- O Hero já diz "Planos de até 1 Giga com Wi-Fi grátis, TV, telefone fixo e chip 5G." (`Home.tsx:34`), e o contato repete a mesma frase no fim da mesma página. É repetição, não invenção.
- Codificação: todos os arquivos estão em UTF-8 sem BOM com CRLF, sem mojibake. O relatório do Ourives (`docs/relatorios/nota-maest-2.md`) começa com BOM.

## Provas

- `npx.cmd tsc -b` → exit 0.
- Sonda: `C:\Users\yuzzi\AppData\Local\Temp\claude\C--Users-yuzzi-OneDrive-Desktop-Maestro-Works-Site-INET-SITE-PROJETO-6--maestri-roles-0b836b11-aef6-415a-a212-509d661cee45\7975b2d2-cf9a-4a5e-93f0-4be867b467a5\scratchpad\probe.mjs`, com saídas `p1440.json` e `p375.json` na mesma pasta.
- Comparação de texto: `grep` no backup `INET SITE PROJETO 6 - BACKUP 27-10 antes da nota maest-2`.
- Não capturei imagens: a parte visual é da Lente e as rotas internas são do Prumo.
