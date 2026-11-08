# Estudo Técnico e Arquitetura: FiberTube (Teste 1 — Lusion.co Inspiration)

**Autor:** Abissal (Gemini)  
**Data:** 27/10/2026  
**Referência Principal:** [https://lusion.co](https://lusion.co) (frames `fino-1440-08..12` e nota `image-c-users-yuzzi-maest-3`)  
**Fase:** FASE 1 — SÓ ESTUDO (Aguardando autorização "PODE CODAR" do Maestro)

---

## 1. Análise Minuciosa do Efeito no Lusion.co

### 1.1 O que foi observado nas capturas (frames 08 a 12):
1. **Geometria e Espessura:**
   - O tubo é contínuo, com largura uniforme de ~24px a 28px no desktop e pontas com terminação perfeitamente arredondada (`strokeLinecap: "round"` / esfera de terminação).
   - Não se trata de uma linha geométrica rígida; as curvas são splines / Béziers cúbicas orgânicas e amplas com tangentes suaves, que serpenteiam horizontalmente e verticalmente cruzando a tela de um lado a outro.
2. **Posicionamento e Camadas (Z-Index):**
   - O tubo serpenteia **por trás** dos títulos tipográficos ("Bold Ideas, Brought to Life", "Where Creative Ideas Become Immersive Experiences"), passando sob o texto sem competir pela atenção.
   - Entra e faz laços por trás de cards de mídia (como o card azul de "Our Approach" e o container de "Play Reel").
   - Onde cruza elementos interativos menores (ex: pill badge "OUR APPROACH", "SEE ALL PROJECTS"), o badge flutua à frente com uma sombra suave.
3. **Mecânica de Scroll-Driven Growth:**
   - O avanço do tubo é estritamente atrelado à rolagem do usuário. Conforme a página rola para baixo, o tubo é "desenhado" e avança pelo layout.
   - No Lusion, o avanço é acionado pelo motor de rolagem virtual. Na INET, usaremos o `useScroll` do Framer Motion com `useTransform` ou `strokeDashoffset` nativo em SVG para sincronização de 60 fps sem peso de WebGL.

---

## 2. Transposição para a Identidade Visual da INET

Enquanto no Lusion o tubo é um elemento sólido azul opaco sobre fundo claro, na INET ele ganha a personalidade de **Fibra Óptica Submarina de Alta Velocidade**, baseada na nota `referencias-3` (cabos de fibra brilhando no fundo oceânico):

1. **Estrutura de Camadas do Traço (Multi-pass SVG):**
   - **Camada 1 (Aura / Glow Externo):** Traço espesso (~36-44px), cor `rgba(0, 98, 236, 0.18)` com filtro de desfoque (`stdDeviation="8"`).
   - **Camada 2 (Bainha Protetora Externa):** Traço de 22-26px, cor azul elétrico (`#0062EC`) ou navy profundo semitransparente (`#021B4D`).
   - **Camada 3 (Núcleo de Fibra / Core):** Traço central de 6-8px em ciano vibrante (`#5CC8FF`) com centro branco-ciano (`#F0FAFF`), simulando a luz confinada no núcleo de vidro da fibra óptica.
   - **Camada 4 (Cabeça do Pulso / Orbe Frontal):** Na ponta do avanço, uma esfera com gradiente radial (`#FFFFFF` -> `#5CC8FF` -> transparente) que ilumina a rota conforme a fibra avança.
   - **Camada 5 (Pulsos de Dados em Trânsito):** Traços intermitentes que viajam ao longo da extensão traçada (`strokeDasharray` e `strokeDashoffset` animados em CSS/rAF), representando pacotes de gigabits trafegando na rede.

2. **Garantia de Contraste e Legibilidade (Regra de Ouro):**
   - Sob os blocos de texto (títulos e parágrafos), o tubo terá opacidade atenuada (ou máscaras suaves) para assegurar que a tipografia permaneça com contraste impecável.
   - Z-index estritamente intermediário: atrás do conteúdo do `<main>` (`z-0` vs `z-10`), mas à frente da cor de fundo dos backdrops.
   - Zero interferência em eventos de ponteiro: `pointer-events: none` absoluto.

3. **Responsividade (Desktop vs Mobile 375px):**
   - **Desktop (1440px):** Espessura de ~22-26px, curvas amplas serpenteando entre $x \in [40\text{px}, W - 40\text{px}]$.
   - **Mobile (375px):** Espessura reduzida para ~10-12px, curvas contidas entre $x \in [16\text{px}, W - 16\text{px}]$, eliminando qualquer risco de `overflow-x`.
   - **Reduced Motion:** Se `prefers-reduced-motion` estiver ativo, o tubo renderiza já totalmente desenhado em opacidade suave, sem animações bruscas.

---

## 3. Especificação do Componente `FiberTube.tsx`

```tsx
// Interface planejada para src/components/fundos/FiberTube.tsx
export interface FiberTubeProps {
  /** Opacidade global da fibra (0.1 a 1.0, padrão 0.85) */
  opacity?: number;
  /** Habilitar pulsos de dados viajando pelo cabo */
  enablePulses?: boolean;
  /** Classe CSS adicional */
  className?: string;
  /** Modo de contenção: 'global' (altura total da página) ou 'section' */
  mode?: 'global' | 'section';
}
```

### Arquitetura de Implementação:
- SVG em coordenadas normalizadas ou responsivas (`viewBox` escalonado com base na altura real da página).
- Curvas calculadas com pontos de âncora alinhados estrategicamente com as seções da página (Hero -> Benefícios -> Planos -> Wi-Fi 6 -> App -> Footer).
- Animação de avanço via `motion.path` com `pathLength: scrollYProgress`.

---

## 4. Status de Conformidade

- **Nenhum arquivo em `src/` foi modificado** nesta Fase 1, respeitando integralmente a instrução do Maestro.
- O estudo visual, a análise dos frames do Lusion e o plano de engenharia estão prontos.
- Aguardando o comando formal **"PODE CODAR"** do Maestro para criar `src/components/fundos/FiberTube.tsx`.
