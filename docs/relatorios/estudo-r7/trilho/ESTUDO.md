# Rodada 7 — estudo Refokus e contrato dos componentes

Referências inspecionadas por cap.mjs headless em 1440x900 e 375x812, sete posições por rota. Home atual Refokus: hero com logo 3D, mídia humana à esquerda do texto no desktop, mídia acima no celular, portfólio em faixas largas e rodapé ocupando quase toda a largura. A Home capturada não mostrou celulares girando; não afirmo reprodução literal de uma cena que não apareceu.

HTML e scripts oficiais consultados: https://www.refokus.com/ e https://js.refokus.com/main.js. No código customizado, aboutUs() usa GSAP timeline/ScrollTrigger com trigger .video-scroll_track, start top top, end bottom bottom e scrub 2. A faixa .video-scroll_middle passa de minWidth 30% para 90%; .video-scroll_img escala 2 para 1, com mídias adjacentes encolhendo. O HTML /about confirma essa estrutura. Nossa adaptação usa transform scale/x e sticky, sem animar layout nem adicionar GSAP/Three/vídeo ao site.

## API

- ScrollSpin default de src/components/giro/ScrollSpin.tsx. Props: children ReactNode; variant phone|box (default phone); label string (nome acessível); className string (cena); mediaClassName string (objeto). Cena sticky com perspectiva1200, rotateY -48/0/48 no desktop e -24/0/24 no mobile, rotateX/Z e escala. Trecho190svh desktop/155svh mobile. Movimento reduzido = cena no fluxo normal, sem giro ou espaço artificial. Imagens carregadas por children.
- InetPhone default de src/components/giro/InetPhone.tsx. Sem props: moldura neutra e asset existente /movel/site-mobile.webp, lazy, dimensões declaradas. Não inventa marca/modelo/recursos.
- SideToCenter default de src/components/giro/SideToCenter.tsx. Props: children ReactNode; side left|right (default left); label, className, mediaClassName. Cena170svh com sticky, entra24% da lateral e escala0,62 até1 nos primeiros70% do trecho; perspectiva1400 e pequeno rotateY até0. overflow-x:clip contém a mídia sem criar scroll container. Movimento reduzido deixa mídia estática no fluxo normal.

Moldura monta as cenas nas páginas Móvel/TV, fora de grid/Rise e sem ancestor overflow-hidden. Não aninhar ScrollSpin/SideToCenter. TV usa /inet-tv-receptor.webp (imagem real já no projeto, com controle). Nenhum asset ou vídeo de referência é usado no produto. Todos os hooks usam a pilha Framer Motion existente, sem loops próprios ou renderer3D adicional. FPS real não medido.

## Uso integrado pelo Moldura

```tsx
import ScrollSpin from '../components/giro/ScrollSpin';
import InetPhone from '../components/giro/InetPhone';
import SideToCenter from '../components/giro/SideToCenter';

<ScrollSpin variant="phone" label="Celular INET com movimento pela rolagem">
  <InetPhone />
</ScrollSpin>

<SideToCenter variant="box" side="right" label="Receptor INET TV da lateral ao centro">
  <img src="/inet-tv-receptor.webp" width={760} height={732}
    alt="Receptor INET TV com controle remoto" loading="lazy" decoding="async"
    className="mx-auto block max-h-[65svh] h-auto w-full object-contain" />
</SideToCenter>
```

SideToCenter ganhou variant?: 'media' | 'box', default media. Box combina crescimento e deslocamento com rotateY de42 graus no lado inicial, passando por0 e chegando a28 no lado oposto, e rotateX16/0/-10. Assim a TV tem giro e entrada em uma única cena, sem repetir trechos longos. As montagens ficam fora de grids/Rise e são propriedade do Moldura.

## Verificação final

npx.cmd tsc -b passou; npx.cmd vite build passou após montagem e variante box (aviso conhecido de chunk3D >500kB). Detector Impeccable nos três componentes novos e SideRails retornou []. Capturas locais por cap.mjs em375x812 e1440x900, /movel e /tv, frações0,0.1,0.2,0.3,0.5,1. Abri e inspecionei as posições1,2,3 de Móvel nos dois tamanhos, e1,2,3 desktop/1,2 mobile da TV. Registram orientação diferente do celular e receptor entrando pela direita antes de crescer no centro. Sem overflow nos quatro cenários:375/375 e1440/1440. Sem erros/exception no console final; permanecem dois avisos React Routerv7 e um de posição do container no Framer.

Limitações: rotação é CSS3D de uma imagem/moldura, não reconstrução volumétrica do hardware ou verso inventado. Capturas espaçadas não medem FPS ou cadência por quadro. prefers-reduced-motion conferido no código, sem emulação nessa rodada. Não usei vídeos externos, material da Adobe, novos assets comerciais ou dependências novas. Nenhum controle de desktop/tela do Windows. Thread preservado nesta rodada.
