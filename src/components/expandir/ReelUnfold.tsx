import React, { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { Play, Sparkles, Tv, Film, Music, ArrowRight, CheckCircle2 } from "lucide-react";

export interface ReelAppItem {
  title: string;
  category?: string;
  image: string;
  badge?: string;
  icon?: "tv" | "film" | "music";
}

export interface ReelUnfoldProps {
  /** Tag ou chapéu sobre a seção */
  eyebrow?: string;
  /** Título inicial descritivo */
  title?: React.ReactNode;
  /** Subtítulo descritivo */
  subtitle?: string;
  /** Palavras grandes que convergem para o centro no estilo Lusion (padrão: ["INET", "TV"]) */
  splitWords?: [string, string];
  /** Lista de itens/apps exibidos no tríptico do painel */
  apps?: ReelAppItem[];
  /** Badge do botão central de play */
  playLabel?: string;
  /** Título revelado quando o painel atinge a tela cheia */
  overlayTitle?: React.ReactNode;
  /** Descrição quando o painel atinge a tela cheia */
  overlayDescription?: string;
  /** Tópicos de benefícios na tela cheia */
  perks?: string[];
  /** Botão de ação opcional */
  cta?: {
    label: string;
    href: string;
  };
  /** Altura do percurso de rolagem sticky no desktop (padrão: "250vh") */
  desktopHeight?: string;
  /** ID para âncora */
  id?: string;
  /** Classes CSS extras */
  className?: string;
}

const DEFAULT_APPS: ReelAppItem[] = [
  {
    title: "Disney+",
    image: "/apps/disney-1.webp",
  },
  {
    title: "HBO Max",
    image: "/apps/hbo-1.webp",
  },
  {
    title: "Deezer",
    image: "/apps/deezer-1.webp",
  },
];

/**
 * ReelUnfold - Efeito Lusion Play Reel com desdobramento 3D (Teste 1 - Item b).
 *
 * Características:
 * 1. Ponto de partida: o painel inicia pequeno (~46% de escala) deslocado à esquerda,
 *    curvado/dobrado em 3D como uma folha (perspective: 1400px, rotateY: -16deg, rotateX: 7deg, skewY: -2.5deg).
 * 2. Visual monocromático inicial: duotone em azul elétrico puro (#0062EC) sobre as três telas de apps.
 * 3. Palavras convergentes: duas palavras grandes ("INET" e "TV") partem das margens externas e convergem ao centro.
 * 4. Desdobramento com a rolagem: desdobra suavemente até ficar totalmente plano (rotate: 0deg, skew: 0deg),
 *    centralizado (x: 0), ocupando a largura do grid (~1360px, margem de 72px) com raio de 16px.
 * 5. Transição de cor: o duotone desvanece de forma linear revelando as cores vívidas dos apps de streaming.
 * 6. Desempenho e Acessibilidade:
 *    - Somente transformações GPU (scale, translate3d, rotateX, rotateY, skewY) e opacity.
 *    - Zero animação de width/height durante a rolagem.
 *    - Celular (375px) e prefers-reduced-motion: versão estática sem scrolljacking e sem 3D pesado.
 */
export default function ReelUnfold({
  eyebrow,
  title = "TV, rádio e filmes em qualquer tela.",
  subtitle = "Canais de TV aberta ao vivo, estações de rádio e filmes on demand na sua TV com o receptor INET TV em comodato.",
  splitWords = ["INET", "TV"],
  apps = DEFAULT_APPS,
  playLabel = "Assistir ao vivo",
  overlayTitle = "TV, rádio e filmes em qualquer tela.",
  overlayDescription = "Funciona até em TV que não é smart com o receptor INET TV em comodato.",
  perks = [
    "Canais de TV aberta ao vivo",
    "Mais de 30 estações de rádio",
    "Centenas de filmes para assistir à vontade",
    "Recurso multitela em até 2 aparelhos simultâneos",
  ],
  cta = {
    label: "Assinar a INET TV",
    href: "https://wa.me/553335363939?text=Ol%C3%A1!%20Quero%20assinar%20a%20INET%20TV.",
  },
  desktopHeight = "250vh",
  id,
  className = "",
}: ReelUnfoldProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // Invocação incondicional de hooks Framer Motion no topo
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // 1. Escala GPU: 0.46 (pequeno à esquerda) -> 1.0 (largura total do grid)
  const cardScale = useTransform(scrollYProgress, [0.08, 0.72], [0.46, 1.0]);

  // 2. Translação horizontal: parte deslocado à esquerda (-24vw) e centraliza em 0vw
  const cardX = useTransform(scrollYProgress, [0.08, 0.72], ["-24vw", "0vw"]);

  // 3. Translação vertical suave para harmonizar com o cabeçalho
  const cardY = useTransform(scrollYProgress, [0.08, 0.72], ["5vh", "0vh"]);

  // 4. Desdobramento 3D (efeito folha dobrada que desdobra até ficar plana)
  const cardRotateY = useTransform(scrollYProgress, [0.08, 0.72], ["-16deg", "0deg"]);
  const cardRotateX = useTransform(scrollYProgress, [0.08, 0.72], ["7deg", "0deg"]);
  const cardSkewY = useTransform(
    scrollYProgress,
    [0.08, 0.4, 0.72],
    ["-2.5deg", "1deg", "0deg"]
  );

  // 5. Duotone azul elétrico desvanecendo para as cores vívidas
  const duotoneOpacity = useTransform(scrollYProgress, [0.12, 0.65], [0.88, 0]);
  const grayscaleValue = useTransform(scrollYProgress, [0.12, 0.65], [0.95, 0]);
  const filterStyle = useTransform(
    grayscaleValue,
    (v) => `grayscale(${v}) contrast(1.15)`
  );

  // 6. Palavras convergentes no estilo PLAY REEL ("INET" à esquerda, "TV" à direita - desvanecem antes do overlay)
  const leftWordX = useTransform(scrollYProgress, [0.12, 0.50], [-140, 0]);
  const rightWordX = useTransform(scrollYProgress, [0.12, 0.50], [140, 0]);
  const wordsOpacity = useTransform(
    scrollYProgress,
    [0.12, 0.38, 0.52, 0.64],
    [0.2, 0.85, 0.85, 0]
  );

  // 7. Rótulos individuais dos apps (desvanecem antes do overlay entrar para evitar vazamento através do degradê)
  const labelOpacity = useTransform(scrollYProgress, [0.60, 0.70], [1, 0]);

  // 8. Textos de introdução e overlay imersivo
  const introOpacity = useTransform(scrollYProgress, [0.06, 0.26], [1, 0]);
  const introY = useTransform(scrollYProgress, [0.06, 0.26], [0, -28]);

  const overlayOpacity = useTransform(scrollYProgress, [0.68, 0.88], [0, 1]);
  const overlayY = useTransform(scrollYProgress, [0.68, 0.88], [24, 0]);

  // Visualizador Estático unificado (Mobile <640px e prefers-reduced-motion)
  const renderStaticView = () => (
    <div className="relative w-full py-12 sm:py-16 text-white">
      <div className="wrap mb-8 text-center">
        {eyebrow && (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-electric/30 bg-electric/10 px-3.5 py-1 text-xs font-semibold tracking-wide text-[#5CC8FF]">
            <Sparkles size={12} className="text-lime" aria-hidden="true" />
            {eyebrow}
          </span>
        )}
        <h2 className="mt-3 font-display text-2xl sm:text-3xl font-light tracking-tight text-white">
          {title}
        </h2>
        {subtitle && (
          <p className="mx-auto mt-2 max-w-xl text-xs sm:text-sm text-white/70">
            {subtitle}
          </p>
        )}
      </div>

      <div className="wrap">
        <div className="relative mx-auto w-full max-w-[1360px] overflow-hidden rounded-2xl border border-white/10 bg-navy-deep p-4 sm:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.8)]">
          {/* Palavras integradas */}
          <div className="mb-6 flex items-center justify-center gap-4 text-center">
            <span className="font-display text-3xl font-light tracking-[0.2em] text-[#5CC8FF]">
              {splitWords[0]}
            </span>
            <span className="h-2 w-2 rounded-full bg-lime" />
            <span className="font-display text-3xl font-light tracking-[0.2em] text-white">
              {splitWords[1]}
            </span>
          </div>

          {/* Tríptico de Telas */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {apps.map((app, idx) => (
              <div
                key={idx}
                className="group relative flex flex-col overflow-hidden rounded-xl border border-white/10 bg-navy-ink/60 transition-transform duration-300 hover:border-electric/50"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-navy-ink">
                  <img
                    src={app.image}
                    alt={app.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-ink via-transparent to-transparent opacity-80" />
                  {app.badge && (
                    <span className="absolute top-2.5 left-2.5 rounded-full border border-white/20 bg-navy-ink/80 px-2.5 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
                      {app.badge}
                    </span>
                  )}
                </div>
                <div className="p-4">
                  {app.category && (
                    <span className="text-[11px] font-medium text-[#5CC8FF]">
                      {app.category}
                    </span>
                  )}
                  <h4 className="font-display text-lg font-light text-white">
                    {app.title}
                  </h4>
                </div>
              </div>
            ))}
          </div>

          {/* Rodapé descritivo */}
          <div className="mt-8 border-t border-white/10 pt-6 text-center sm:text-left sm:flex sm:items-center sm:justify-between">
            <div className="max-w-xl">
              <h3 className="font-display text-lg font-light text-white">
                {overlayTitle}
              </h3>
              <p className="mt-1 text-xs text-white/70">
                {overlayDescription}
              </p>
            </div>
            {cta && (
              <div className="mt-4 sm:mt-0 shrink-0">
                <a
                  href={cta.href}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-lime inline-flex items-center gap-2 text-xs py-2.5 px-4"
                >
                  {cta.label}
                  <ArrowRight size={14} aria-hidden="true" />
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  // Fallback direto para acessibilidade (redução de movimento)
  if (shouldReduceMotion) {
    return (
      <section id={id} className={`relative w-full bg-navy-ink ${className}`}>
        {renderStaticView()}
      </section>
    );
  }

  return (
    <section id={id} className={`relative w-full bg-navy-ink ${className}`}>
      {/* 1. MODO MOBILE (<640px): Estático, limpo, sem travamentos de scroll */}
      <div className="block sm:hidden">
        {renderStaticView()}
      </div>

      {/* 2. MODO DESKTOP (sm:block): Efeito Lusion Play Reel com perspectiva 3D e sticky */}
      <div
        ref={containerRef}
        className="relative hidden sm:block w-full"
        style={{ height: desktopHeight }}
      >
        <div className="sticky top-0 flex h-screen w-full flex-col items-center justify-center overflow-hidden [perspective:1400px]">
          {/* Cabeçalho introdutório */}
          <motion.div
            style={{ opacity: introOpacity, y: introY }}
            className="pointer-events-none absolute top-8 z-20 px-4 text-center sm:top-12"
          >
            {eyebrow && (
              <span className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-electric/30 bg-electric/10 px-3.5 py-1 text-xs font-semibold text-[#5CC8FF]">
                <Sparkles size={12} className="text-lime" aria-hidden="true" />
                {eyebrow}
              </span>
            )}
            <h2 className="font-display text-3xl font-light tracking-tight text-white sm:text-5xl lg:text-6xl max-w-4xl mx-auto leading-tight">
              {title}
            </h2>
            {subtitle && (
              <p className="mx-auto mt-3 max-w-xl text-sm text-white/65 sm:text-base">
                {subtitle}
              </p>
            )}
          </motion.div>

          {/* Palavras gigantes convergentes ("INET" e "TV") no estilo PLAY / REEL */}
          <div className="pointer-events-none absolute inset-x-0 top-1/2 z-10 flex -translate-y-1/2 items-center justify-between px-6 lg:px-20">
            <motion.div
              style={{ x: leftWordX, opacity: wordsOpacity }}
              className="select-none font-display text-6xl font-extralight tracking-[0.18em] text-white/20 sm:text-7xl lg:text-8xl xl:text-9xl"
            >
              {splitWords[0]}
            </motion.div>
            <motion.div
              style={{ x: rightWordX, opacity: wordsOpacity }}
              className="select-none font-display text-6xl font-extralight tracking-[0.18em] text-white/20 sm:text-7xl lg:text-8xl xl:text-9xl"
            >
              {splitWords[1]}
            </motion.div>
          </div>

          {/* Moldura do Grid - Card com GPU Transforms 3D desdobráveis */}
          <div className="relative flex w-full max-w-[1360px] items-center justify-center px-4 sm:px-10 lg:px-16">
            <motion.div
              style={{
                scale: cardScale,
                x: cardX,
                y: cardY,
                rotateY: cardRotateY,
                rotateX: cardRotateX,
                skewY: cardSkewY,
                transformStyle: "preserve-3d",
              }}
              className="relative isolate h-[60vh] sm:h-[68vh] w-full overflow-hidden rounded-2xl border border-white/15 bg-navy-deep shadow-[0_35px_100px_rgba(0,0,0,0.9)] will-change-transform"
            >
              {/* Tríptico de Telas de Apps (Lado a lado como na referência Lusion) */}
              <motion.div
                style={{ filter: filterStyle }}
                className="absolute inset-0 grid grid-cols-3 gap-2 bg-navy-ink p-2 sm:gap-4 sm:p-4"
              >
                {apps.map((app, idx) => (
                  <div
                    key={idx}
                    className="relative flex h-full flex-col overflow-hidden rounded-xl border border-white/10 bg-navy-deep/80"
                  >
                    <div className="relative h-full w-full overflow-hidden">
                      <img
                        src={app.image}
                        alt={app.title}
                        className="h-full w-full object-cover object-center"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-navy-ink via-navy-ink/20 to-transparent" />
                    </div>

                    <motion.div
                      style={{ opacity: labelOpacity }}
                      className="absolute bottom-0 inset-x-0 p-4 sm:p-6 bg-gradient-to-t from-navy-ink via-navy-ink/80 to-transparent"
                    >
                      {app.badge && (
                        <span className="inline-block rounded-full border border-white/15 bg-navy-ink/80 px-2.5 py-0.5 text-[10px] font-medium text-[#5CC8FF] backdrop-blur-sm">
                          {app.badge}
                        </span>
                      )}
                      <h4 className="font-display text-base sm:text-xl font-light text-white">
                        {app.title}
                      </h4>
                      {app.category && (
                        <p className="mt-1 text-[11px] sm:text-xs text-white/60">
                          {app.category}
                        </p>
                      )}
                    </motion.div>
                  </div>
                ))}
              </motion.div>

              {/* Camada Duotone em Azul Elétrico (#0062EC) sobreposta */}
              <motion.div
                style={{ opacity: duotoneOpacity }}
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-electric mix-blend-color z-10"
              />
              <motion.div
                style={{ opacity: duotoneOpacity }}
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-navy-ink/40 z-10"
              />

              {/* Botão Flutuante Central de Play no estilo Lusion (sem caixa-alta) */}
              <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
                <div className="flex items-center gap-2.5 rounded-full border border-white/20 bg-white/10 px-5 py-2.5 text-xs font-semibold text-white backdrop-blur-md shadow-lg transition-transform">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-navy-ink">
                    <Play size={12} className="ml-0.5 fill-current" />
                  </div>
                  <span>{playLabel}</span>
                </div>
              </div>

              {/* Overlay Imersivo Revelado na Abertura Completa */}
              <motion.div
                style={{ opacity: overlayOpacity, y: overlayY }}
                className="absolute inset-x-0 bottom-0 z-30 bg-gradient-to-t from-navy-ink via-navy-ink/90 to-transparent p-6 sm:p-10"
              >
                <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                  <div className="max-w-2xl">
                    <div className="inline-flex items-center gap-2 rounded-full border border-lime/30 bg-lime/10 px-3 py-1 text-xs font-medium text-lime">
                      <Sparkles size={12} aria-hidden="true" />
                      <span>Receptor em comodato</span>
                    </div>
                    <h3 className="mt-3 font-display text-2xl sm:text-3xl font-light text-white">
                      {overlayTitle}
                    </h3>
                    <p className="mt-2 text-xs sm:text-sm text-white/80 leading-relaxed">
                      {overlayDescription}
                    </p>

                    {/* Perks */}
                    {perks.length > 0 && (
                      <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 text-xs text-white/75">
                        {perks.map((perk, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <CheckCircle2 size={13} className="text-lime shrink-0" aria-hidden="true" />
                            <span>{perk}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {cta && (
                    <div className="shrink-0">
                      <a
                        href={cta.href}
                        target="_blank"
                        rel="noreferrer"
                        className="btn-lime inline-flex items-center gap-2 text-xs sm:text-sm py-3 px-6 shadow-[0_10px_30px_rgba(112,224,0,0.25)]"
                      >
                        {cta.label}
                        <ArrowRight size={15} aria-hidden="true" />
                      </a>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
