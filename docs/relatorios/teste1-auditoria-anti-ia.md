# Auditoria anti-IA do P6 (teste da nota 29) — Vigia, 27/10/2026

Base:
- Cofre `CLAUDE CODE/Stack Técnica/29 - Menos Cara de IA · A Pilha a Favor da Marca.md`, teste rápido itens 2 a 4.
- `Criação com IAs/Site da INET/13 - Stack técnica e menos cara de IA (27-10).md`.

Busca feita no `src/` atual (com o Teste 1 em andamento). Eu não editei nada: **o Maestro decide o que entra**. As mudanças grandes (fonte, layout de seção, dependência) vão ao Filipe antes.

## O que já está limpo

| Busca da nota 29 | Resultado |
|---|---|
| `indigo`, `purple`, `violet`, `fuchsia` | 0 ocorrências em `src/` e `tailwind.config.js` |
| `Inter` | 0. Títulos em **Exo 2** (`font-display`) e texto em Poppins: 2 fontes, dentro do limite |
| Degradê roxo→azul | Nenhum. Os `from-…-to-…` são véus `navy-ink → transparent` para contraste, mais `electric → lime` em `SlideToSubscribe.tsx:63` (cores da marca) |
| Rótulo caixa-alta nas seções | `Section` e `PageHero` (`ui.tsx:61,79`) usam o `tag` só como `aria-label`. Na Home, `.tag` está escondido (`index.css:149`) |
| Números em `src/data` | Preços, telefones e "+ de 100 canais" estão em `inet.ts`, com fonte declarada ("site anterior", tabela de out/2026) |

## Lista priorizada

Legenda: **P** = pequena e segura (classe, texto, troca local); **G** = grande (layout, sistema visual, várias páginas), vai ao Filipe.

| # | Arquivo:linha | O que é | Por que tem cara de IA ou quebra regra | Tamanho |
|---|---|---|---|---|
| 1 | `src/pages/Tv.tsx:48-66` (`ReelUnfold`) | Texto sem fonte: "Catálogo on demand atualizado semanalmente", "esportes ao vivo", "Mais de 100 canais e estações de rádio" (contradiz `Tv.tsx:42`), "estabilidade total", "Compatível com qualquer TV via HDMI" | **Regra 2 do Filipe (nada inventado)**, mais o marketing genérico da tabela da nota 29. Já devolvido ao Meridiano | P |
| 2 | `src/components/expandir/ReelUnfold.tsx:45-66` (padrões usados pela TV) | "HBO Max — Ao Vivo & On Demand", "Deezer — Milhões de Faixas", "Cinema em Casa" | Número e afirmação sem fonte. Já devolvido ao Meridiano | P |
| 3 | `src/pages/Tv.tsx:49,52` | eyebrow "Streaming & Entretenimento" e playLabel "ASSISTIR AO VIVO" em caixa-alta sobre o título | Rótulo caixa-alta sobre título (vetado) | P |
| 4 | `src/components/expandir/ExpandMedia.tsx:67,233` | Padrão `eyebrow = "Experiência Imersiva"`, `uppercase tracking-[0.2em]` | Rótulo caixa-alta sobre título e texto genérico. A Home passa `eyebrow=""`, mas o padrão fica armado | P |
| 5 | `src/pages/Fixo.tsx:33`, `Movel.tsx:28`, `Eventos.tsx:171,270` | `<Fit className="tag">Telefone fixo / Chip móvel / IMS…</Fit>` visíveis acima do h1 | Rótulo caixa-alta sobre título. Na Home já está escondido; nessas páginas, não. Trocar por nada ou por numeração editorial | P |
| 6 | `src/components/DownDetectorCard.tsx:44,59`, `PlanCarousel.tsx:212,256`, `AppsShowcase.tsx:166`, `Eventos.tsx:212,282,290`, `Wifi6.tsx:128`, `TmdbWeekly.tsx:307,461` | `uppercase tracking-[0.14–0.28em]` em subtítulos, nomes de plano e selos | Padrão de gerador quando vira regra. Nos selos pequenos (Wi-Fi 6, Série/Filme) é aceitável; no h4 do DownDetector e no nome do plano em cima do preço, é o vício | P (um por um) |
| 7 | Raios: `rounded-2xl` ×29, `rounded-[2rem]` ×10, `rounded-xl` ×7, `rounded-[1.75rem]` ×6, `rounded-3xl` ×3, `[2.5rem]` ×3, `[3rem]`, `[2.6rem]`, `[2.4rem]` | **9 raios distintos** | A nota 29 pede uma escala de no máximo 3. Raio padrão do Tailwind mais valores soltos é "cara de IA" | G (sistema visual) |
| 8 | Sombras: `shadow-lg` ×5, `shadow-2xl` ×1, e ~10 sombras `rgba(0,0,0,0.6–0.95)` diferentes (ExpandMedia, ReelUnfold, card hover em `index.css:40`) | Sombras pretas genéricas e muitas variantes | A nota 29 pede no máximo 2 sombras, tingidas pelo fundo (navy), não preto. A neve já faz isso certo (`index.css:141`, navy 0.2) | G (sistema) / P por arquivo |
| 9 | `src/pages/Home.tsx:129` (`home-benefits`, 4 FeatureCards), `Movel.tsx:57`, `Tv.tsx:36`, `Fixo.tsx:55,86` (2 a 4 colunas de FeatureCard), `Suporte.tsx:42,88`, `Velocidade.tsx:135` | **Grade de cards iguais** (ícone + título + linha) | Primeiro item da lista do Filipe. A troca sugerida pela nota 29: um item grande e dois pequenos, lista com divisórias, ou o formato Featured Work do Teste 1 (item d) | G (layout de várias seções) |
| 10 | `src/pages/Home.tsx:146` (autoatendimento, 4 colunas), `FaleConosco.tsx:152,197` | Grade de 3 ou 4 caixas iguais | Igual ao item 9, com menos peso (são links de serviço; lista com divisórias resolveria) | G |
| 11 | `src/components/MediaCard.tsx:27` | `focus-visible:outline-cyan-300` | Cor da paleta padrão do Tailwind em vez do token `#5CC8FF` | P |
| 12 | `SlideToSubscribe.tsx:63` | Degradê `electric → lime` | Não é roxo-azul, mas é degradê de duas cores de destaque. O lime deveria ser raro (5% da tela) | P (opcional) |

## Sugestão de ordem (o Maestro decide)

1. Itens 1 a 3: **já, antes de copiar o P6** (texto inventado não pode ir para o teste 2).
2. Itens 4, 5, 11: pequenos e seguros, um commit lógico de limpeza.
3. Item 6: passar caso a caso (manter selos, tirar caixa-alta de subtítulos).
4. Itens 7 a 10: levar ao Filipe como proposta de sistema (escala de raio com 3 valores, 2 sombras tingidas, troca das grades de cards iguais pelo formato do Teste 1 item d).

Não verificado: o teste 1 da nota 29 ("trocar o logo"), o teste 5 (capturas lado a lado com as referências) e o modo claro (o P6 não tem tema claro).
