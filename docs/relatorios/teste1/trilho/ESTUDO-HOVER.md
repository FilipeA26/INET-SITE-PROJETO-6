# Teste 1 — item e — estudo do hover Featured Work

Trilho, 27/10/2026. Fase 1: somente estudo. Nenhum arquivo em src/ foi criado ou alterado nesta fase. Implementação depende da mensagem PODE CODAR do Maestro, conforme a instrução desta rodada. Não entrei nas pastas TESTE2/TESTE3.

## Evidência visual

Li a nota image-c-users-yuzzi-maest-3 e a nota referencias-3. Abri as seis imagens PNG relevantes às linhas1–13, incluindo a imagem5 (7bd2a0bc-317e-44ba-86a1-6a131cd555a9.png). A imagem5 mostra o card Atlas com desfoque; sozinha não prova duração nem amplitude da tremida.

Usei o capwheel do Vigia exclusivamente em Edge headless, perfil isolado, GPU, sem tocar no desktop. Home em1440x900:7 passos de600px e ponteiro em380,620; Home em375x812:7 passos de500px sem hover. About em1440/375:4 passos de600/500px, apenas para aprendizagem, sem levar esse formato ao P6. Os quatro processos terminaram sem exceções; scrollY0 e altura900/812 confirmam a rolagem virtual, por isso não usei scrollTo como prova de avanço.

Na sequência home1440/fw-1440-hover-antes.jpg, hover-0ms, hover-150ms, hover-400ms, hover-900ms e hover-depois, todas abertas e olhadas: o card Everswap responde à entrada com mudança de perspectiva/paralaxe e desfoque visível, depois estabiliza. O contorno externo do card permanece estável; a textura interna e sua profundidade mudam. A aproximação continua enquanto o mouse fica sobre ele. O efeito não é simplesmente mover o retângulo HTML inteiro de um lado a outro. Os instantes são aproximados, com captura/CDP e movimento de aproximação em8 passos: não medem a curva exata.

Na Home mobile abri frames03,05,07: card Play Reel estático no layout, depois Featured Work em uma coluna e imagens legíveis. Não simulei toque para provar ausência de hover no Lusion; a nossa versão terá esse bloqueio explícito. Em about1440/about375 abri00,02,04: cena de partículas/figura e texto mudando com a rolagem. Não apareceu uma cena WebGL preta. Esses elementos do about estão fora da implementação do P6.

## O que o JS oficial confirma

Fontes: https://lusion.co/ , https://lusion.co/about/ e https://lusion.co/_astro/hoisted.CUO_IjfL.js . HTML das duas rotas e JS foram salvos aqui. featured-evidence.txt referencia offsets do bundle salvo, que podem mudar em versões futuras.

HomeFeaturedSection cria ProjectItemList, cujos ProjectItem são as mídias do Featured Work. O constructor carrega home.webp e home_depth.webp de cada projeto e usa UfxMesh. O material declara PARALLAX_SAMPLES12 e BLUR_SAMPLES6. É uma renderização WebGL com mapa de profundidade, não um filter:blur CSS.

No ProjectItem:
- mouseenter/mouseleave controlam isHover; a entrada só é aceita quando a página está ociosa e a lista não está em transição.
- hoverRatio cresce pelo delta de tempo até1. Nos limiares0/0.2/0.3 troca shiftXYTarget por vetores aleatórios; o deslocamento é suavizado e depois amortecido.
- o alvo de foco recebe oscilação cos(time*20) e sin(time*30), com envelope que cai a zero quando hoverRatio vai de0 a0.3. Isso corresponde aproximadamente aos primeiros300ms de hover sem interrupção; é leitura do código, não duração cronometrada da captura.
- focusPosMotion e zoomMotion usam SecondOrderDynamics. zoomMotion passa ao alvo1 no hover. O shader desloca as amostras da textura segundo a profundidade e calcula blurriness pela distância ao plano de foco, com6 amostras por pixel para blur.
- não identifiquei separação RGB no shader deste card. Há efeitos globais com nomes relacionados a RGB em outras partes do bundle; isso não é evidência de que este hover use RGB.
- a atualização/visibilidade do mesh é condicionada à faixa ativa/viewport. Não é um renderer novo por card.

## Adaptação proposta para a INET, ainda não implementada

Escolha: HoverJitter leve com uma animação finita via Web Animations API ou keyframes CSS, em camada interna da mídia. O bloco do Moldura continua responsável por crescimento/clip-path; título e CTA não tremem. Sem canvas, depth map, vídeo, shader, novo RAF ou dependência. Não copiar a paralaxe contínua do original: o item e pede apenas tremida breve e blur que some.

Valores de partida propostos, a calibrar no produto após PODE CODAR:
- duração360ms, uma execução por entrada real do mouse;
- amplitude padrão2px, limitada a1–3px;
- oscilações amortecidas e determinísticas, retornando a translate(0,0), sem tremida infinita;
- blur máximo0,65px, voltando a0 antes do fim;
- cancelar/restaurar ao sair, desmontar, esconder a aba ou ativar reduced-motion;
- pointerType mouse e media query hover:hover/pointer:fine. Toque, coarse pointer e prefers-reduced-motion ficam inteiramente estáticos;
- animação apenas no filho interno. Pai mantém escala/clip-path da expansão. Pequena folga interna ou overscan constante impede frestas nas bordas durante o deslocamento;
- sem RGB, cor adicional, cursor personalizado ou rótulo nesta primeira versão. Rótulo seria opcional futuro, não necessário ao pedido nem observado de forma conclusiva nestas capturas.

## Contrato proposto ao Moldura

Arquivo futuro: src/components/giro/HoverJitter.tsx. Import default. Tipo proposto, não criado ainda:

```tsx
type HoverJitterProps = {
  children: React.ReactNode;
  className?: string;       // moldura externa: aspect ratio, clip e radius
  mediaClassName?: string;  // camada interna que recebe o efeito
  intensity?: 1 | 2 | 3;    // pixels máximos, padrão2
  disabled?: boolean;      // padrãofalse
};
```

Uso a encaixar só depois de PODE CODAR:

```tsx
<motion.div style={{ scale: cardScale, clipPath: cardClip }}>
  <Link to="/tv">
    <HoverJitter className="aspect-[16/10] overflow-hidden rounded-3xl">
      <img src="/inet-tv-receptor.webp" alt="Receptor INET TV com controle remoto"
        width={760} height={732} loading="lazy" decoding="async"
        className="h-full w-full object-contain" />
    </HoverJitter>
    {/* Título e CTA do card existente ficam fora de HoverJitter. */}
  </Link>
</motion.div>
```

Sem Link ou botão próprio no HoverJitter: semântica, URL, alt e conteúdo comercial continuam com o card do Moldura. A classe de expansão não deve ser aplicada no mesmo elemento que receberá o jitter, para as transformações não se sobrescreverem.

## Provas e limites desta fase

Prova disponível:6 PNGs de referência abertos, HTML/JS oficiais lidos, sequência desktop de hover antes/durante/depois inspecionada, capturas por roda em375 e1440, about inspecionado sem introduzir seu layout. Capturas em home1440, home375, about1440 e about375 nesta pasta; nenhum erro runtime nos quatro processos de referência.

Não rodei tsc/build nem testes locais de um componente inexistente. Não afirmo FPS60, amplitude em pixels do shader ou equivalência visual perfeita. Após PODE CODAR: implementar apenas o componente, integrar com Moldura, rodar tsc/build, capturas locais375/1440 e sequência hover, verificar retorno a estado estático, repetição/saída rápida, reduced-motion, toque e ausência de overflow. Outros itens a–d e as páginas TESTE2/TESTE3 ficam fora da minha parte.
