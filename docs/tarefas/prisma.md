# Tarefa do Prisma · TESTE 3

Projeto: `C:\Users\yuzzi\OneDrive\Desktop\Maestro Works\Site\INET SITE TESTE 3` (porta **8088**, servidor já rodando). Sem git commit. **Não mexa no Teste 2.**

O Teste 3 é a direção completa do lusion em tema **claro-neve**; o Fóton está fazendo o tema, o menu, o rodapé e as transições. Leia
`C:\Users\yuzzi\OneDrive\Desktop\Obsidian Cofres\Sites Programação\Programação\Criação com IAs\Site da INET\14 - Estudo do Lusion (27-10).md`
e a nota do Maestri `estude-esses-sites-para-fazer`.

## Arquivos SEUS

As páginas `src/pages/Internet.tsx`, `Tv.tsx`, `Movel.tsx`, `Entretenimento.tsx`, `Fixo.tsx`, `Cobertura.tsx`, os seus `src/components/lusion/WorkCard.tsx` e `WorkGrid.tsx`, e arquivos novos em `src/components/t3p/`.
**NÃO edite:** `Home.tsx`, `index.css`, `tailwind.config.js`, `App.tsx`, `Header.tsx` e `Footer.tsx`.

## O que fazer

1. **Aparelhos que giram com a rolagem, como no refokus.com.** Já existem `src/components/giro/` (`InetPhone`, `ScrollSpin`, `SideToCenter`); reaproveite-os. Nas páginas Móvel e TV:
   - o celular (Móvel) e o receptor INET TV (TV) giram com a rolagem;
   - vêm da lateral para o centro e voltam;
   - ficam nas laterais, ocupando o vazio.
   Use só imagens de `public/`.
2. **Fundo por seção, como na Apple:** cada seção das suas páginas ganha o seu próprio fundo, com um corte limpo entre elas (claro-neve, azul-noite de contraste, azul INET). Nada de um fundo único para a página toda.
3. **Laterais preenchidas como no lusion:** margem lateral `max(6vw, 60px)` e grade de 12 colunas. Os blocos ocupam colunas diferentes (texto em 5 colunas, mídia em 7, alternando os lados) em vez de tudo centralizado numa coluna estreita.
4. Revise o `WorkCard`/`WorkGrid` no tema claro: o card não pode ser branco sobre fundo claro.

## Regras

- **Nada inventado:** cada frase nova precisa existir em `src/data/inet.ts` ou em outro lugar do site. Você já errou isso uma vez no Teste 2 ("Milhões de faixas"): confira cada texto.
- Rode o `npx tsc -b` **de verdade** antes de dizer que passou. No Teste 2, o seu `WorkCard` não passava e o relatório dizia que sim.
- `prefers-reduced-motion`: sem giro, aparelhos parados.

## Provas

- `npx tsc -b` e `npx vite build` sem erro, com o código de saída colado;
- capturas a 375 e 1440 das suas páginas, OLHADAS: `node C:\Users\yuzzi\.claude\scripts\cap.mjs saida.png 1440x900 http://localhost:8088/movel 0,0.3,0.6,0.9`;
- sem rolagem horizontal; console limpo.

Relatório em `docs/relatorios/prisma-t3.md`. Ao terminar: `maestri ask "Claude Code" "PRISMA T3 PRONTO: resumo + provas"`.
