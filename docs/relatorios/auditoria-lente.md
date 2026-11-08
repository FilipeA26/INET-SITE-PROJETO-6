# Auditoria Lente (Claude) · visual da nota maest-2 · 27/10/2026

Só auditoria: nenhum arquivo de `src/` foi alterado. Servidor 8086 não foi reiniciado.
Capturas em `docs/relatorios/auditoria-lente/` (cap.mjs nas cinco paradas 0/0,25/0,5/0,75/1 e uma variante
instrumentada, `lente.mjs` no scratchpad, que rola até cada seção e mede). Todas as imagens foram olhadas.

## Veredito
Entrega aprovada no visual, com **2 ajustes médios** e 3 menores. Nada grave: o tubo nunca cobre conteúdo,
não há rolagem horizontal e a página termina no rodapé.

## Medidas
| Medida | 1440×900 | 375×812 |
| --- | ---: | ---: |
| scrollWidth = innerWidth | 1440 = 1440 | 375 = 375 |
| scrollHeight / borda inferior do rodapé | 10256 / 10256 | 11904 / 11904 |
| altura do SVG do tubo | 10256 (= documento, não empurra) | 11904 |
| "Vamos nos conectar?" — altura da seção | 495 px | 565 px |
| tamanho do título | 80 px (teto do clamp) | 40 px (piso) |
| pontos do tubo testados / no topo da pilha | 763 / 0 | 580 / 0 |
| console | sem error/exception (só avisos antigos: container do Framer, future flags do Router) | idem |

Sonda do tubo: amostrei o traço a cada 25 px com `elementFromPoint` (SVG com pointer-events ligado só na medição).
Em nenhum ponto o tubo ficou acima de outro elemento — coerente com o código: `FiberTube` é `absolute z-0`
e `main` e o invólucro do rodapé são `relative z-10` (`src/App.tsx:105-112`).

## Respostas às perguntas da tarefa
- **O tubo aparece?** Sim. Fino e discreto atrás das cartas de serviço (`servicos-cartas-1440.jpg`), grosso e
  brilhante na lateral direita das Dúvidas (`duvidas-1440.jpg`, `duvidas-375.jpg`) e na margem esquerda dos
  cartões de autoatendimento no celular (`_-375-3.jpg`). No topo da Home não aparece (só a chuva do hero).
- **Passa por cima de texto/carta?** Não (sonda 0/1343). Passa *perto*: a 375 corre em x≈365, ~20 px à
  direita dos chevrons das Dúvidas; a 1440 desce em x≈1410 por dentro do rodapé, ao lado de "Voltar ao início"
  e termina junto do botão flutuante de voltar ao topo (`_-1440-4.jpg`, `finale-1440.jpg`).
- **Cartas legíveis, alinhadas, sem cortar texto?** Sim. 1440: dois leques de 3, inclinação ±9°→±3°, todo
  texto inteiro, foco e seta visíveis. 375: empilhadas sem inclinação, texto inteiro. Nenhum rótulo em
  caixa-alta, sem rodapé espelhado.
- **"Vamos nos conectar?" menor e bonito?** Menor, sim (495 px, sem 100vh; título 80 px). Bonito no desktop;
  no celular há o achado 1.

## Achados
1. **Médio · partículas sobre a linha da razão social a 375.** O "chão" das partículas
   (`ConnectFinale.tsx:170`, `floorY = height - 18`) fica na mesma faixa da linha
   "INET TELECOMUNICAÇÕES LTDA · Teófilo Otoni – MG" (`ConnectFinale.tsx:348`). O canvas é z-0 e o texto z-10,
   mas formas brancas atrás de texto branco/70 tornam "Otoni – MG" quase ilegível (`finale-375.jpg`).
   Sugestão: padding inferior maior no celular ou subir a linha acima do chão. Também a 375 há duas formas
   soltas nas bordas à altura do botão.
2. **Médio · Home 1.457 px mais longa no celular** (10447 → 11904; relatório do Ourives). As 6 cartas empilhadas
   têm `min-height:250px` com metade vazia (`ServiceCards.tsx:54`), cerca de 1.600 px só de cartas. Vai contra
   o "não estique tanto o site para baixo". Sugestão: cartas compactas (sem a área vazia), 2 colunas, ou
   carrossel com arraste e barra de progresso, como já existe na INET TV.
3. **Menor · grade de 6 cartas iguais** no desktop. O leque disfarça, mas a estrutura ainda é 3×2 de cartas
   idênticas (regra "grade de cards iguais"). O Filipe pediu "estilo cartas", então é risco de gosto, não erro.
4. **Menor · tubo termina dentro do rodapé** a 1440 (x≈1410, desce até ~y 780 da última tela), encostado no
   botão flutuante "voltar ao topo". Não cobre nada, mas o fim do cabo parece solto ali.
5. **Menor · faixa de partículas com buraco no meio** a 1440 (x≈560–870 quase vazio em `finale-1440.jpg` e
   `_-1440-4.jpg`); parece amontoado nas laterais em vez de um chão contínuo.

## Regras de gosto (arquivos novos)
- Rótulo caixa-alta sobre título: nenhum em `ServiceCards`, `ConnectFinale`, `FiberTube`.
- Emoji como ícone: nenhum (busca por faixas Unicode de emoji vazia; ícones são lucide).
- Cartão dentro de cartão: não.
- Degradê roxo-azul: não; o fundo do contato é azul-marinho → azul (`#021B5B → #002B82 → #011442`).
- Fora do escopo desta nota: o rodapé já existente usa rótulos em caixa-alta espaçada ("SERVIÇOS",
  "ATENDIMENTO"...), que fere a mesma regra.
