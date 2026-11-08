TESTE 2 · sua tarefa. Projeto: C:\Users\yuzzi\OneDrive\Desktop\Maestro Works\Site\INET SITE TESTE 2 (servidor já rodando em http://localhost:8087; não rode outro na mesma porta). Sem git commit.
Antes de começar, leia a nota do Maestri image-c-users-yuzzi-maest-3 (maestri note read; abra as imagens .png com a sua ferramenta de leitura de arquivo). Leia também as notas referencias-3 e https-stock-adobe-com-br-ima: cabos de fibra brilhando no fundo do mar. A fibra do Filipe é ESTA, na paleta INET (#03256C #003F99 #0062EC #38B000 #70E000), sem vermelho. E leia src/motion.ts, src/App.tsx, src/components/Thread.tsx e src/components/SideRails.tsx.
Arquivos SEUS (só você mexe neles): src/App.tsx, src/components/lusion/FiberTube.tsx, src/components/lusion/ReelUnfold.tsx, src/components/lusion/index.ts.
1) FiberTube: o efeito de fundo do lusion.co.
- Um tubo grosso e contínuo que serpenteia por TRÁS do conteúdo pela página inteira e se desenha com a rolagem, com inércia (o Lenis já existe).
- No lusion é uma faixa azul grossa de ponta arredondada, com curvas amplas, que cruza a tela entre as seções. Na INET ela é um CABO DE FIBRA ÓPTICA: corpo em gradiente da paleta, brilho interno e pulsos de luz correndo pelo cabo.
- Técnica: SVG com stroke-dashoffset ligado ao scroll (mais leve) ou canvas 2D. Escolha e justifique no relatório.
- No Teste 2 ele substitui a Thread e as fibras do SideRails: tire as duas do App, mas não apague os arquivos.
- Não pode atrapalhar a leitura: passa pelas margens e só cruza a tela entre as seções.
- No celular: mais fino e mais simples. Com prefers-reduced-motion: aparece desenhado inteiro e parado.
2) ReelUnfold: a "puxada do vídeo" do lusion (PLAY REEL).
- Um painel que entra pequeno, inclinado e curvado em 3D (perspective + rotateX/rotateY + skew em CSS/framer-motion; ou um plano curvo em R3F).
- Com a rolagem ele desentorta e cresce até ocupar a tela inteira, preso (sticky) durante o efeito.
- Dentro do painel, só conteúdo REAL da INET: as imagens de public/ (inet-tv-receptor.webp, câmeras, celular...) ou o componente src/components/fundos/CinematicCanvas.tsx.
- Duas palavras grandes atravessam o painel, tiradas do próprio site, por exemplo "INET" e "FIBRA". Nada inventado.
- Exporte o componente pelo lusion/index.ts. Não edite Home.tsx: quem coloca na Home é o Lumen.
Provas antes de dizer pronto:
- npx tsc -b e npx vite build sem erro;
- capturas a 375 e 1440, OLHADAS: node C:\Users\yuzzi\.claude\scripts\cap.mjs saida.png 1440x900 http://localhost:8087/ 0,0.2,0.4,0.6,0.8;
- sem rolagem horizontal; console limpo.
Relatório em docs/relatorios/foton.md. Ao terminar: maestri ask "Claude Code" "FÓTON PRONTO: <resumo + provas>"
