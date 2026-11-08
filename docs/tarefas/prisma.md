TESTE 2 · sua tarefa. Projeto: C:\Users\yuzzi\OneDrive\Desktop\Maestro Works\Site\INET SITE TESTE 2 (servidor já rodando em http://localhost:8087; não rode outro na mesma porta). Sem git commit.
Antes de começar, leia a nota do Maestri image-c-users-yuzzi-maest-3 (maestri note read) e veja as imagens 4 e 5 (o Featured Work do lusion.co). O que elas mostram:
- cards grandes de mídia, 2 por linha, com cantos arredondados;
- os cards CRESCEM de pequenos para grandes conforme entram na tela;
- no hover, o card dá uma TREMIDA leve (micro-rotação ou deslocamento de 1–2 px por poucos ms) e a imagem ganha um BLUR pequeno, voltando com mola.
O Filipe quer isso para preencher o vazio das laterais.
Leia também src/motion.ts, src/components/expandir/ExpandMedia.tsx (já existe; reaproveite a ideia) e src/components/ui.tsx.
Arquivos SEUS:
- src/components/lusion/WorkCard.tsx e src/components/lusion/WorkGrid.tsx (crie a pasta se não existir);
- as páginas src/pages/Internet.tsx, Tv.tsx, Movel.tsx e Entretenimento.tsx.
NÃO edite src/components/lusion/index.ts, que é do Fóton: importe pelo caminho do arquivo.
1) WorkCard: imagem que cresce com a rolagem (framer-motion useScroll/useTransform: scale de 0.86 para 1, border-radius diminuindo). Hover com tremida + blur, só com (hover: hover) e respeitando prefers-reduced-motion. Título e legenda embaixo, como no lusion. Link opcional.
2) WorkGrid: grade de 2 colunas com ritmo assimétrico: um card mais alto que o outro e deslocado. Nada de grade de cards iguais.
3) Aplique nas 4 páginas acima, numa seção onde hoje sobra vazio nas laterais. Use SÓ imagens que existem em public/ e textos que já estão na página ou em src/data/inet.ts. Nada inventado.
Provas antes de dizer pronto:
- npx tsc -b e npx vite build sem erro;
- capturas a 375 e 1440, OLHADAS: node C:\Users\yuzzi\.claude\scripts\cap.mjs saida.png 1440x900 http://localhost:8087/internet 0,0.3,0.6;
- sem rolagem horizontal; console limpo.
Relatório em docs/relatorios/prisma.md. Ao terminar: maestri ask "Claude Code" "PRISMA PRONTO: <resumo + provas>"
