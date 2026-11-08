# Estudo Lusion.co e Especificação Técnica do ExpandMedia (Rodada 7)

**Autor:** Meridiano (Gemini)  
**Data:** 27/10/2026  
**Inspiração Primária:** [https://lusion.co](https://lusion.co)

---

## 1. Análise do Site Lusion.co (Capturas e Arquitetura)

### 1.1 Capturas Headless Efetuadas
- **Desktop (1440x900):** Capturas salvas em `docs/relatorios/estudo-r7/meridiano/home-1440-*.jpg` nos marcos de rolagem `0, 0.1, 0.2, 0.3, 0.5, 0.7, 1`.
- **Mobile (375x812):** Capturas salvas em `docs/relatorios/estudo-r7/meridiano/home-375-*.jpg`.

### 1.2 Mecânica Observada no Lusion
1. **Container e Composição Inicial:**  
   O elemento central de mídia (ou cena 3D/vídeo) não ocupa a tela inteira de imediato; ele inicia flutuando como um cartão retangular com cantos bem arredondados (`border-radius: ~28px-32px`), margens laterais generosas e moldura escura.
2. **Expansão Cinemática com Scroll:**  
   À medida que o usuário rola:
   - A largura se expande de `~85vw` (ou `max-w-[1120px]`) até encostar nas bordas (`100vw`).
   - A altura expande de `~58vh` para a altura total da janela (`100vh`).
   - O `border-radius` transiciona gradualmente até `0px`, eliminando a sensação de "caixa" ou "card quadrado" e preenchendo 100% da viewport.
3. **Coreografia Tipográfica:**  
   - O título introdutório e os rótulos superiores sobem e esvanecem suavemente (`opacity: 1 -> 0`, `translateY: 0 -> -32px`) durante o primeiro terço da rolagem.
   - Quando a imagem atinge tela cheia (`100vw x 100vh`), uma nova camada de conteúdo imersivo (título de impacto, tópicos de valor e CTA) surge sobreposta com contraste garantido por vinhetas escuras.
4. **Desacoplamento e Desempenho:**  
   - Altura total da seção estendida (~`250vh` no desktop e ~`160vh` no mobile) para desacelerar o movimento e criar uma inércia suave, sem "pulos" ou acelerações bruscas.
   - Uso de `will-change: width, height, border-radius, transform` e camadas estritamente em CSS/Framer Motion para manter 60 fps constantes.

---

## 2. Componente `<ExpandMedia>` (`src/components/expandir/ExpandMedia.tsx`)

Criado para atender à diretriz do Filipe de transformar o site em uma experiência cinematográfica aberta de borda a borda, sem cards laterais ou caixas fechadas.

### 2.1 Principais Características
- **Zero assets externos:** Usa exclusivamente mídias já existentes no projeto (`/casa-inteligente.webp`, `/inet-tv-receptor.webp`, etc.).
- **Paleta Oficial INET:** Fundo `#010818` (navy-ink), detalhes em `#5CC8FF` (ciano), destaque em `#70E000` (lime) e azul royal `#0062EC`.
- **Acessibilidade:** Suporte completo a `prefers-reduced-motion` via `useReducedMotion()`. Em modo de movimento reduzido, renderiza uma seção estática com o produto em largura ampla, sem pinning ou escala artificial.
- **Responsividade Real:** 375 px a 1920 px sem rolagem horizontal (`overflow: false`).

---

## 3. Guia de Uso e Props para o Moldura

### 3.1 Interface TypeScript
```tsx
export interface ExpandMediaProps {
  /** Caminho relativo da imagem em /public ou importada (ex: '/casa-inteligente.webp') */
  src?: string;
  imageSrc?: string;
  /** Descrição acessível para leitores de tela */
  alt?: string;
  /** Tag superior discreta (ex: 'EXPERIÊNCIA IMERSIVA' ou 'CONECTIVIDADE') */
  eyebrow?: string;
  /** Título principal visível antes da expansão */
  title: React.ReactNode;
  /** Subtítulo contextualizador */
  subtitle?: string;
  /** Altura da rolagem desktop (padrão: '250vh') */
  desktopHeight?: string;
  /** Altura da rolagem mobile (padrão: '160vh') */
  mobileHeight?: string;
  /** Título revelado sobre a mídia quando atinge 100vw x 100vh */
  overlayTitle?: React.ReactNode;
  /** Parágrafo descritivo sobreposto na tela cheia */
  overlayDescription?: string;
  /** Lista de diferenciais com ícones de checagem */
  overlayPerks?: string[];
  /** Botão de chamada para ação */
  cta?: {
    label: string;
    href: string;
  };
  /** ID para navegação por âncora */
  id?: string;
  className?: string;
}
```

### 3.2 Exemplo de Montagem na Home (entre o Hero e os Planos)
```tsx
import { ExpandMedia } from "../components/expandir";

<ExpandMedia
  id="conexao-total"
  src="/casa-inteligente.webp"
  alt="Conexão que preenche todos os cômodos da sua casa"
  eyebrow="Fibra Residencial"
  title="A velocidade que acompanha o ritmo da sua casa inteira."
  subtitle="Do streaming em 4K na sala ao home office no quarto, sem zonas de sombra."
  overlayTitle="Potência que preenche cada metro quadrado."
  overlayDescription="Nossa malha de fibra óptica combinada com roteadores de alta performance garante sinal estável em todos os aparelhos simultaneamente."
  overlayPerks={[
    "Estabilidade inabalável para múltiplos dispositivos",
    "Sem perda de pacote em jogos e videochamadas",
    "Instalação e roteador Wi-Fi inclusos",
  ]}
  cta={{
    label: "Conhecer os planos",
    href: "#planos",
  }}
/>
```

### 3.3 Exemplo de Montagem na Cobertura / TV
```tsx
import { ExpandMedia } from "../components/expandir";

<ExpandMedia
  id="experiencia-tv"
  src="/inet-tv-receptor.webp"
  alt="Receptor INET TV e entretenimento completo"
  eyebrow="Entretenimento"
  title="Televisão, esportes e filmes com a nitidez da fibra."
  subtitle="Canais ao vivo e catálogo on demand diretamente no seu televisor."
  overlayTitle="O cinema entra na sua sala."
  overlayDescription="Transmissão 100% óptica para você assistir aos seus jogos e séries sem travamentos."
  overlayPerks={[
    "Canais ao vivo em alta definição",
    "Compatível com múltiplos aparelhos",
  ]}
  cta={{
    label: "Monte seu combo com TV",
    href: "/monte-seu-combo",
  }}
/>
```
