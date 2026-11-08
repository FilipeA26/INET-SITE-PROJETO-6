# Tarefa do Fóton · TESTE 3

Projeto: `C:\Users\yuzzi\OneDrive\Desktop\Maestro Works\Site\INET SITE TESTE 3` (porta **8088**; suba com `npx vite --port 8088 --strictPort` em segundo plano se ninguém tiver subido). Sem git commit. **Não mexa no Teste 2.**

## A ideia do Teste 3

O Teste 2 trouxe os efeitos do lusion para o site **escuro** de sempre. O Teste 3 é a **direção completa do lusion**: o mesmo site, agora no tema **claro-neve**, com a linguagem de interface do lusion. Ele serve para o Filipe comparar os dois caminhos. Leia a nota de estudo
`C:\Users\yuzzi\OneDrive\Desktop\Obsidian Cofres\Sites Programação\Programação\Criação com IAs\Site da INET\14 - Estudo do Lusion (27-10).md`.

## Arquivos SEUS

`src/index.css`, `tailwind.config.js`, `src/App.tsx`, `src/components/Header.tsx`, `src/components/Footer.tsx`, `src/components/lusion/FiberTube.tsx`, e arquivos novos em `src/components/t3/`.
**NÃO edite:** `src/pages/Home.tsx` nem os componentes `NameHero`, `ValueCards` e `ConnectFinale`, que o Lumen ainda está terminando no Teste 2 e que serão copiados para cá depois.

## O que fazer

1. **Tema claro-neve, inspirado no lusion:**
   - fundo como o `#f0f1fa` do lusion, mas puxado para a marca: um neve levemente azulado, NUNCA branco puro;
   - texto em azul-noite INET (`#010818`/`#03256C`);
   - azul vivo INET `#0062EC` como cor de ação; verde-limão `#70E000` só em pontos de luz;
   - cards nunca brancos sobre fundo claro: superfície um pouco **mais escura** que o fundo, ou nenhuma.
   - Troque os tokens no CSS e no tailwind.config para que o site inteiro mude sem editar página por página. Onde uma seção tiver cor escura fixa (`SectionBackdrop variant="ink"`, por exemplo), ela pode continuar escura como "seção de contraste", no estilo da Apple, que tem um fundo por seção.
2. **Menu no estilo lusion:**
   - logo INET (`/inet-logo.png`, a versão azul para fundo claro) à esquerda;
   - à direita, pílulas: "Fale conosco •" (escura, leva ao WhatsApp/`/fale-conosco`) e "Menu ••" (clara);
   - o "Menu" abre um painel de tela cheia com os links que já existem no Header, entrando com a curva do `motion.ts`;
   - teclado e foco funcionando; Esc fecha.
3. **FiberTube** recolorido para o fundo claro: o cabo azul INET em degradê, com os pulsos de luz, como a faixa azul do lusion.
4. **Transição entre páginas:** uma cortina azul INET que cobre a tela e revela a página nova (AnimatePresence já existe no App).
5. **Rodapé** no estilo lusion: grande, limpo, com os dados reais de `COMPANY` e `STORES` de `src/data/inet.ts`.

## Regras

- **Nada inventado:** texto e número só do `src/data/inet.ts` ou do que já existe no site.
- Respeitar `prefers-reduced-motion` e o contraste de leitura (AA) no tema claro.
- Para o fundo claro, use a logo azul `inet-logo.png`; a `inet-logo-branca.png` é só para fundo escuro.

## Provas

- `npx tsc -b` e `npx vite build` sem erro: rode de verdade e cole o código de saída;
- capturas a 375 e 1440 de `/`, `/internet` e `/tv`, OLHADAS: `node C:\Users\yuzzi\.claude\scripts\cap.mjs saida.png 1440x900 http://localhost:8088/ 0,0.3,0.6,0.9`;
- sem rolagem horizontal; console limpo.

Relatório em `docs/relatorios/foton-t3.md`. Ao terminar: `maestri ask "Claude Code" "FÓTON T3 PRONTO: resumo + provas"`.
