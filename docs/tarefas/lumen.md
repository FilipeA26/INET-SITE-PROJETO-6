# Tarefa do Lumen · TESTE 3

Projeto: `C:\Users\yuzzi\OneDrive\Desktop\Maestro Works\Site\INET SITE TESTE 3` (porta **8088**, servidor já rodando). Sem git commit. **Não mexa no Teste 2.**

O Teste 3 é a direção completa do lusion em tema **claro-neve**: fundo neve levemente azulado (nunca branco puro), texto azul-noite INET, azul vivo `#0062EC` como ação e verde-limão só como ponto de luz. É o mesmo site do Teste 2, para o Filipe comparar escuro × claro.
- O **Fóton** está trocando os tokens de cor (`index.css`, `tailwind.config.js`), o menu em pílulas, o rodapé, a cortina entre páginas e o FiberTube.
- O **Prisma** está nas páginas internas.

Eu já copiei para cá os seus `NameHero.tsx`, `ValueCards.tsx`, `ConnectFinale.tsx` e o `Home.tsx` do Teste 2, já corrigidos.

## Arquivos SEUS

`src/pages/Home.tsx` e `src/components/lusion/NameHero.tsx`, `ValueCards.tsx`, `ConnectFinale.tsx`, `ReelUnfold.tsx`.
**NÃO edite:** `index.css`, `tailwind.config.js`, `App.tsx`, `Header.tsx`, `Footer.tsx` e `FiberTube.tsx` (do Fóton); as páginas internas e `WorkCard`/`WorkGrid` (do Prisma).

## O que fazer

1. **Adapte as suas peças e as seções da Home ao tema claro.** Tire cores escuras fixas (`text-white`, `bg-navy-ink`, `white/60`...) e passe a usar os tokens. Espere o Fóton publicar os tokens novos: leia o `index.css` e o `tailwind.config.js` antes de começar; se ainda não mudaram, comece pela estrutura e deixe as cores para o fim.
2. **NameHero no claro, exatamente como o lusion.co/about:** o nome INET gigante em azul-noite sobre o neve. Ao rolar, ele voa até a linha do texto institucional.
3. **ValueCards, como na imagem 7 da nota:** o fundo da seção é azul INET forte (seção de contraste) e as cartas têm verso azul com linhas brancas finas e borda branca. A frente da carta não pode ser branca sobre fundo claro.
4. **ConnectFinale, como na imagem 8:** fundo azul INET, título branco enorme "Vamos nos conectar?", partículas brancas e o botão-pílula.
5. **Ritmo da Home no estilo lusion:**
   - margem lateral `max(6vw, 60px)`;
   - títulos grandes alinhados à esquerda, em vez de tudo centralizado;
   - texto de apoio pequeno à direita, como no "Featured Work" do lusion.
   Mude só o layout. Os textos continuam os mesmos, nada inventado.

## Provas

- `npx tsc -b` e `npx vite build` sem erro, com o código de saída;
- capturas a 375 e 1440 da Home, OLHADAS: `node C:\Users\yuzzi\.claude\scripts\cap.mjs <PASTA_DE_SAIDA> 1440x900 http://localhost:8088/ 0,0.15,0.3,0.45,0.6,0.75,0.9` (o 1º argumento é uma PASTA);
- sem rolagem horizontal; console limpo;
- `grep` mostrando que não entrou texto novo.

Relatório em `docs/relatorios/lumen-t3.md`. Ao terminar: `maestri ask "Claude Code" "LUMEN T3 PRONTO: resumo + provas"`.
