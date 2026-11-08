import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { motion, useScroll, useSpring, useTransform, useReducedMotion } from "framer-motion";

export type FiberTubeVariant = "reel" | "goal" | "capability" | "global";

export interface FiberTubeProps {
  /** Variante visual mantida para compatibilidade de tipagem */
  variant?: FiberTubeVariant;
  /** Opacidade global do tubo de fibra (padrão 0.85) */
  opacity?: number;
  /** Espessura customizada da bainha (se omitida, calcula 20px desktop / 10px mobile) */
  strokeWidth?: number;
  /** Classes CSS extras */
  className?: string;
  /** Habilitar pulsos de luz transitando pelo cabo */
  enablePulses?: boolean;
}

/**
 * FiberTube v6 — Fibra Óptica Submarina Contínua (Lusion.co - Item A do Teste 1).
 *
 * Ajustes de Leitura solicitados pelo Maestro:
 * 1. VÉU FIXO NO TOPO (0 a ~112px): Camada fixa de degradê navy-ink (#010818 -> transparente)
 *    posicionada rigidamente abaixo do <main>, cobrindo o tubo ao atingir a área sob o Header de vidro.
 *    Elimina qualquer interferência visual ou competição com o botão "Ver planos" no menu fixo;
 * 2. INTENSIDADE CALIBRADA: Núcleo ciano/lime atenuado para opacidade ~0.55, brilho vetorial mais estreito
 *    (outer halo 1.5x, opacidade 0.10) e bainha suave (0.72), garantindo leitura 100% confortável onde o cabo
 *    passa atrás de parágrafos;
 * 3. TRAÇADO POR VÃOS E MARGENS: Curvas Bézier fluem primariamente pelas calhas de respiro e laterais (11% a 88%),
 *    atravessando a tela nos espaços de transição entre blocos;
 * 4. ATRÁS DO CONTEÚDO: Montado no Layout em z-0, com todo o <main> em z-10 sobrepondo naturalmente a fibra;
 * 5. Seções claras (snow) continuam cobrindo suavemente a fibra com sua base #F4F7FB;
 * 6. Pausa automática imediata quando a aba está oculta (document.hidden) e versão estática sob prefers-reduced-motion;
 * 7. Zero rolagem horizontal a 375px.
 */
export default function FiberTube({
  opacity = 0.85,
  strokeWidth: customWidth,
  className = "",
  enablePulses = true,
}: FiberTubeProps) {
  const location = useLocation();
  const [dimensions, setDimensions] = useState({ width: 1440, height: 5000 });
  const [mounted, setMounted] = useState(false);
  const [isTabHidden, setIsTabHidden] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  // Pausa com aba oculta (visibilitychange)
  useEffect(() => {
    const handleVis = () => setIsTabHidden(document.hidden);
    document.addEventListener("visibilitychange", handleVis);
    return () => document.removeEventListener("visibilitychange", handleVis);
  }, []);

  // Medição da altura e largura reais do documento com ResizeObserver e troca de rota
  useEffect(() => {
    setMounted(true);
    let timerA: number;
    let timerB: number;

    const measure = () => {
      const docEl = document.documentElement;
      const body = document.body;
      const topEl = document.getElementById("top");
      const h = Math.max(
        topEl?.scrollHeight || 0,
        topEl?.offsetHeight || 0,
        docEl.scrollHeight,
        body.scrollHeight,
        window.innerHeight
      );
      const w = window.innerWidth;
      setDimensions((prev) => {
        if (Math.abs(prev.height - h) > 30 || Math.abs(prev.width - w) > 10) {
          return { width: w, height: h };
        }
        return prev;
      });
    };

    measure();
    timerA = window.setTimeout(measure, 150);
    timerB = window.setTimeout(measure, 600);

    const ro = new ResizeObserver(() => measure());
    if (document.body) ro.observe(document.body);
    const topEl = document.getElementById("top");
    if (topEl) ro.observe(topEl);
    window.addEventListener("resize", measure);

    return () => {
      window.clearTimeout(timerA);
      window.clearTimeout(timerB);
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [location.pathname]);

  // useScroll global do documento com amortecimento lento e orgânico (gosto do Filipe)
  const { scrollYProgress } = useScroll();

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 65,
    damping: 24,
    restDelta: 0.0008,
  });

  // O tubo inicia com ~14% desenhado no Hero e cresce até 100% no rodapé
  const dynamicLength = useTransform(smoothProgress, [0, 1], [0.14, 1]);
  const pathLength = prefersReducedMotion ? 1 : dynamicLength;

  const { width, height } = dimensions;
  const isMobile = width < 768;

  // Espessura calibrada (v6):
  // Desktop 1440px: 20px (dentro da faixa 18 a 28 px)
  // Mobile 375px: 10px (dentro da faixa 10 a 14 px)
  const sheathStroke =
    customWidth ||
    (isMobile
      ? 10
      : Math.round(18 + Math.max(0, Math.min(1, (width - 768) / (1440 - 768))) * 4));

  const outerHaloStroke = sheathStroke * 1.5; // Brilho mais estreito (pedido do Maestro)
  const coreStroke = Math.max(2.8, sheathStroke * 0.30); // Núcleo fino
  const filamentStroke = Math.max(1.1, sheathStroke * 0.07); // Filamento branco suave
  const pulseStroke = Math.max(3.2, sheathStroke * 0.38); // Pulso de dados calibrado

  // Geração algorítmica de curvas Bézier cúbicas suaves pelas margens e vãos
  const buildContinuousTubePath = (): string => {
    // Passo vertical entre nós alternados (entre 720px e 980px)
    const stepY = Math.max(720, Math.min(980, height / 8));
    const numSegments = Math.max(5, Math.ceil(height / stepY));

    // Pontos-chave do traçado
    const points: Array<{ x: number; y: number }> = [];

    // Ponto 0: entra pelo quadrante direito superior (Hero), onde há respiro ao lado do título
    const initialX = isMobile ? width - 20 : width * 0.86;
    points.push({ x: initialX, y: 110 });

    for (let i = 1; i <= numSegments; i++) {
      const y = Math.min(height - 60, Math.round(110 + i * ((height - 180) / numSegments)));

      let x: number;
      if (isMobile) {
        // No celular (375px), viaja pelas calhas laterais de respiro (18px a 20px das bordas)
        // para máxima elegância sem cruzar a área densa de leitura central
        const isRight = i % 2 === 0;
        x = isRight ? width - 20 : 20;
      } else {
        // No desktop (1440px), viaja pelas calhas de margem e vãos livres
        if (i % 2 === 1) {
          // Lado esquerdo (calha de respiro lateral a 11-13% da largura, fora da área densa de texto)
          const offset = ((i * 37) % 5) * 0.01;
          x = width * (0.12 + offset);
        } else {
          // Lado direito (calha de respiro lateral a 86-88% da largura, atrás do vão 3D/mídia)
          const offset = ((i * 53) % 5) * 0.01;
          x = width * (0.87 - offset);
        }
      }

      points.push({ x, y });
    }

    if (points.length < 2) return "";

    // Constrói o path com tangentes verticais nos nós para continuidade C1 perfeita
    const pathParts: string[] = [`M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`];

    for (let i = 1; i < points.length; i++) {
      const pPrev = points[i - 1];
      const pCurr = points[i];
      const dy = pCurr.y - pPrev.y;

      // Pontos de controle com tangentes verticais
      const c1x = pPrev.x;
      const c1y = pPrev.y + dy * 0.52;
      const c2x = pCurr.x;
      const c2y = pCurr.y - dy * 0.52;

      pathParts.push(
        `C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${pCurr.x.toFixed(1)} ${pCurr.y.toFixed(1)}`
      );
    }

    return pathParts.join(" ");
  };

  const pathD = buildContinuousTubePath();
  const gradId = "inet-continuous-fiber-gradient-v6";
  const pulseGradId = "inet-continuous-fiber-pulse-gradient-v6";

  if (!mounted || !pathD) return null;

  const shouldAnimatePulse = enablePulses && !prefersReducedMotion && !isTabHidden;

  return (
    <>
      {/* 
        Ajuste 1: Véu FIXO no topo da viewport (0 a 112px).
        Fica abaixo do <main z-10>, cobrindo o tubo no topo da janela sob o Header de vidro.
        O botão 'Ver planos' e o menu de vidro ficam 100% legíveis sem nenhuma interferência.
      */}
      <div
        aria-hidden="true"
        className="fixed top-0 inset-x-0 h-28 pointer-events-none z-0 bg-gradient-to-b from-[#010818] via-[#010818]/95 to-transparent"
      />

      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-x-0 top-0 w-full z-0 overflow-hidden ${className}`}
        style={{
          height,
          opacity,
        }}
      >
        <svg
          className="w-full h-full block"
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ overflow: "hidden" }}
        >
          <defs>
            {/* Gradiente longitudinal contínuo da fibra: Electric #0062EC -> Royal #004AC2 -> Ciano #5CC8FF */}
            <linearGradient id={gradId} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#0062EC" />
              <stop offset="25%" stopColor="#004AC2" />
              <stop offset="50%" stopColor="#0062EC" />
              <stop offset="75%" stopColor="#004AC2" />
              <stop offset="100%" stopColor="#5CC8FF" />
            </linearGradient>

            {/* Gradiente luminoso de pulso de dados: Lime #70E000 e Branco Concentrado suave */}
            <linearGradient id={pulseGradId} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#5CC8FF" stopOpacity="0.05" />
              <stop offset="45%" stopColor="#70E000" stopOpacity="0.55" />
              <stop offset="75%" stopColor="#FFFFFF" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#70E000" stopOpacity="0.55" />
            </linearGradient>
          </defs>

          {/* 1. Halo Externo Estreito de Luz (opacidade 0.10 para brilho discreto) */}
          <motion.path
            d={pathD}
            fill="none"
            stroke="#0062EC"
            strokeWidth={outerHaloStroke}
            strokeOpacity={0.10}
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ pathLength }}
          />

          {/* 2. Bainha Principal do Cabo (~20px desktop / ~10px mobile, opacidade 0.72) */}
          <motion.path
            d={pathD}
            fill="none"
            stroke={`url(#${gradId})`}
            strokeWidth={sheathStroke}
            strokeOpacity={0.72}
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ pathLength }}
          />

          {/* 3. Núcleo Radiante de Fibra Óptica em Ciano (opacidade ~0.55 conforme pedido do Maestro) */}
          <motion.path
            d={pathD}
            fill="none"
            stroke="#5CC8FF"
            strokeWidth={coreStroke}
            strokeOpacity={0.55}
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ pathLength }}
          />

          {/* 4. Filamento Central de Luz Concentrada Suave (opacidade 0.60) */}
          <motion.path
            d={pathD}
            fill="none"
            stroke="#FFFFFF"
            strokeWidth={filamentStroke}
            strokeOpacity={0.60}
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ pathLength }}
          />

          {/* 5. Pulsos de Dados Suaves em Trânsito (opacidade 0.55, pausados em segundo plano) */}
          {shouldAnimatePulse && (
            <motion.path
              d={pathD}
              fill="none"
              stroke={`url(#${pulseGradId})`}
              strokeWidth={pulseStroke}
              strokeLinecap="round"
              strokeDasharray={isMobile ? "40 320" : "80 480"}
              strokeDashoffset={0}
              animate={{ strokeDashoffset: [-1600, 0] }}
              transition={{
                duration: 9.5,
                repeat: Infinity,
                ease: "linear",
              }}
              style={{ pathLength, opacity: 0.55 }}
            />
          )}
        </svg>
      </div>
    </>
  );
}
