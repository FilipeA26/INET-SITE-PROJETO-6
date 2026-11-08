import React, { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";

export interface ExpandMediaProps {
  /** Mídia customizada (ex: cena CinematicCanvas, nó 3D, vídeo) */
  media?: React.ReactNode;
  /** Conteúdo filho que atua como mídia customizada */
  children?: React.ReactNode;
  /** Caminho de imagem local existente em /public ou src/assets */
  imageSrc?: string;
  /** Alias simplificado para imageSrc */
  src?: string;
  /** Elemento customizado alternativo (ex: canvas 3D, gráfico vetorial) */
  mediaNode?: React.ReactNode;
  /** Descrição acessível da mídia */
  alt?: string;
  /** Tag ou chapéu sobre o título inicial */
  eyebrow?: string;
  /** Título inicial que convida à expansão (recolhe com a rolagem) */
  title: React.ReactNode;
  /** Subtítulo inicial contextualizando a seção */
  subtitle?: string;
  /** Altura do percurso de rolagem no desktop (padrão '250vh') */
  desktopHeight?: string;
  /** Altura do percurso de rolagem no celular/tablet (padrão '160vh') */
  mobileHeight?: string;
  /** Duas palavras grandes que convergem com a rolagem (estilo PLAY e REEL do Lusion) */
  splitWords?: [string, string];
  /** Selo ou etiqueta discreta */
  badge?: string;
  /** Título revelado sobre a mídia quando atinge expansão de tela cheia */
  overlayTitle?: React.ReactNode;
  /** Descrição explicativa sobre a mídia expandida */
  overlayDescription?: string;
  /** Destaques em tópicos exibidos na tela cheia */
  overlayPerks?: string[];
  /** Botão de ação opcional */
  cta?: {
    label: string;
    href: string;
  };
  /** ID para âncoras na página */
  id?: string;
  /** Classe extra para o container externo */
  className?: string;
}

/**
 * ExpandMedia - Seção de Expansão Cinemática Inspirada em Lusion.co (Rodada 7).
 *
 * Mecânica rigorosa:
 * 1. Ponto de partida (Desktop): o card COMEÇA PEQUENO (~46% da escala, visualmente ~580x320px)
 *    deslocado para a coluna ESQUERDA, em duotone azul puro monocromático (#0062EC),
 *    com cantos arredondados (raio 16px).
 * 2. Transição com rolagem:
 *    - Animação puramente via GPU transforms (scale de 0.46 para 1.0, x de -24vw para 0)
 *      sem recalcular width/height a cada quadro (evita reflow e mantém 60 fps).
 *    - Leve perspectiva de deformação (skewY de -1.5deg para 0deg, rotateX de 3deg para 0deg).
 *    - Transição do duotone azul para cores vívidas reais (mix-blend-color com opacidade descrescente).
 *    - Convergência das palavras de impacto para o centro.
 * 3. Estado final: o card ocupa a largura ampla do grid (margem de ~72px de cada lado)
 *    com cantos arredondados de 16px (estilo Lusion reel), revelando os detalhes imersivos e CTA.
 * 4. Celular (375px) e prefers-reduced-motion: versão limpa, estática e sem scrolljacking.
 */
export default function ExpandMedia({
  media,
  children,
  imageSrc,
  src,
  mediaNode,
  alt = "INET Telecomunicações - Fibra óptica de alta performance",
  eyebrow = "Experiência Imersiva",
  title,
  subtitle,
  desktopHeight = "250vh",
  splitWords,
  badge,
  overlayTitle,
  overlayDescription,
  overlayPerks,
  cta,
  id,
  className = "",
}: ExpandMediaProps) {
  const finalSrc = src || imageSrc;
  const finalMedia = media || children || mediaNode;
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // Todos os hooks são chamados incondicionalmente no topo do componente (regras do React)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // 1. Escala GPU: parte de 0.46 (~580px de largura) e cresce até 1.0 (largura ampla do grid ~1340px)
  const cardScale = useTransform(scrollYProgress, [0.1, 0.72], [0.46, 1.0]);

  // 2. Translação X: parte deslocado para a esquerda (-24vw no desktop) e centraliza em 0
  const cardX = useTransform(scrollYProgress, [0.1, 0.72], ["-24vw", "0vw"]);

  // 3. Translação Y sutil: inicia ligeiramente mais baixo para encaixar sob o cabeçalho
  const cardY = useTransform(scrollYProgress, [0.1, 0.72], ["6vh", "0vh"]);

  // 4. Deformação sutil de perspectiva estilo shader WebGL do Lusion
  const cardSkewY = useTransform(
    scrollYProgress,
    [0.12, 0.42, 0.72],
    ["-1.5deg", "0.6deg", "0deg"]
  );
  const cardRotateX = useTransform(
    scrollYProgress,
    [0.12, 0.42, 0.72],
    ["3deg", "1deg", "0deg"]
  );

  // 5. Duotone azul calibrado (sem puxar para laranja):
  const duotoneOpacity = useTransform(scrollYProgress, [0.12, 0.62], [0.85, 0]);
  const imageGrayscale = useTransform(scrollYProgress, [0.12, 0.62], [0.95, 0]);
  const imageFilter = useTransform(
    imageGrayscale,
    (g) => `grayscale(${g}) contrast(1.1)`
  );

  // 6. Palavras convergentes no centro (estilo PLAY e REEL)
  const wordLeftX = useTransform(scrollYProgress, [0.15, 0.68], [-110, 0]);
  const wordRightX = useTransform(scrollYProgress, [0.15, 0.68], [110, 0]);
  const wordsOpacity = useTransform(scrollYProgress, [0.18, 0.68], [0.35, 1.0]);

  // 7. Transições dos textos de introdução e conteúdo imersivo final
  const introOpacity = useTransform(scrollYProgress, [0.08, 0.28], [1, 0]);
  const introY = useTransform(scrollYProgress, [0.08, 0.28], [0, -30]);

  const overlayOpacity = useTransform(scrollYProgress, [0.68, 0.88], [0, 1]);
  const overlayY = useTransform(scrollYProgress, [0.68, 0.88], [32, 0]);

  // Renderizador estático unificado (usado no mobile e em prefers-reduced-motion)
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
        <div className="relative mx-auto w-full max-w-[1340px] overflow-hidden rounded-2xl border border-white/10 bg-navy-deep shadow-[0_20px_60px_rgba(0,0,0,0.8)]">
          {finalMedia ? (
            <div className="relative h-[48vh] min-h-[320px] w-full overflow-hidden">
              {finalMedia}
            </div>
          ) : finalSrc ? (
            <img
              src={finalSrc}
              alt={alt}
              className="h-[48vh] min-h-[320px] w-full object-cover"
              loading="lazy"
            />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-t from-navy-ink via-navy-ink/40 to-transparent p-6 sm:p-10 flex flex-col justify-end">
            {overlayTitle && (
              <h3 className="font-display text-xl sm:text-2xl font-light text-white">
                {overlayTitle}
              </h3>
            )}
            {overlayDescription && (
              <p className="mt-2 max-w-xl text-xs sm:text-sm text-white/80">
                {overlayDescription}
              </p>
            )}
            {cta && (
              <div className="mt-5">
                <a href={cta.href} className="btn-lime inline-flex items-center gap-2 text-xs sm:text-sm py-2.5 px-4">
                  {cta.label}
                  <ArrowRight size={15} aria-hidden="true" />
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  // Caso do prefers-reduced-motion: renderização direta estática para todas as telas
  if (shouldReduceMotion) {
    return (
      <section id={id} className={`relative w-full bg-navy-ink ${className}`}>
        {renderStaticView()}
      </section>
    );
  }

  return (
    <section id={id} className={`relative w-full bg-navy-ink ${className}`}>
      {/* 1. VERSÃO MOBILE (sm:hidden): Estática, sem scrolljacking, sem travamento de tela */}
      <div className="block sm:hidden">
        {renderStaticView()}
      </div>

      {/* 2. VERSÃO DESKTOP/TABLET (hidden sm:block): Efeito Lusion com sticky ~250vh e GPU transforms */}
      <div
        ref={containerRef}
        className="relative hidden sm:block w-full"
        style={{ height: desktopHeight }}
      >
        {/* Container sticky fixo na tela durante a rolagem */}
        <div className="sticky top-0 flex h-screen w-full flex-col items-center justify-center overflow-hidden">
          {/* Cabeçalho introdutório */}
          <motion.div
            style={{ opacity: introOpacity, y: introY }}
            className="pointer-events-none absolute top-10 z-20 px-4 text-center sm:top-14"
          >
            {badge && (
              <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3.5 py-1 text-xs font-medium text-white/80 backdrop-blur-md">
                <span className="h-1.5 w-1.5 rounded-full bg-lime animate-pulse" />
                {badge}
              </div>
            )}
            {eyebrow && !badge && (
              <span className="mb-2 block font-display text-xs font-semibold uppercase tracking-[0.2em] text-[#5CC8FF]">
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

          {/* Moldura do Grid com margem de ~72px (estilo Lusion final state) */}
          <div className="relative flex w-full max-w-[1360px] items-center justify-center px-4 sm:px-10 lg:px-16">
            {/* Card com GPU transform (scale + translate) sem causar reflow de layout */}
            <motion.div
              style={{
                scale: cardScale,
                x: cardX,
                y: cardY,
                skewY: cardSkewY,
                rotateX: cardRotateX,
              }}
              className="relative isolate h-[62vh] sm:h-[72vh] w-full overflow-hidden rounded-2xl border border-white/15 bg-navy-deep shadow-[0_30px_90px_rgba(0,0,0,0.9)] will-change-transform"
            >
              {/* Mídia: Nó/Cena customizada ou Imagem local */}
              <div className="relative h-full w-full overflow-hidden">
                {finalMedia ? (
                  <motion.div
                    style={{ filter: imageFilter }}
                    className="relative h-full w-full will-change-transform"
                  >
                    {finalMedia}
                  </motion.div>
                ) : finalSrc ? (
                  <motion.img
                    src={finalSrc}
                    alt={alt}
                    style={{ filter: imageFilter }}
                    className="h-full w-full object-cover object-center will-change-transform"
                    loading="lazy"
                  />
                ) : null}

                {/* Camada Duotone Azul Puro #0062EC calibrada com mix-blend-color (sem puxar para laranja) */}
                <motion.div
                  style={{ opacity: duotoneOpacity }}
                  className="pointer-events-none absolute inset-0 z-10 bg-[#0062EC] mix-blend-color"
                  aria-hidden="true"
                />

                {/* Vinheta cinematográfica profunda nos tons navy-ink */}
                <div
                  className="pointer-events-none absolute inset-0 z-15"
                  style={{
                    background:
                      "radial-gradient(ellipse 95% 85% at 50% 50%, rgba(1, 8, 24, 0.1) 0%, rgba(1, 8, 24, 0.55) 70%, rgba(1, 8, 24, 0.95) 100%)",
                  }}
                  aria-hidden="true"
                />

                {/* Gradiente inferior para contraste de texto */}
                <div
                  className="pointer-events-none absolute inset-x-0 bottom-0 z-15 h-3/5 bg-gradient-to-t from-navy-ink via-navy-ink/80 to-transparent"
                  aria-hidden="true"
                />
              </div>

              {/* Palavras convergentes estilo PLAY e REEL do Lusion */}
              {splitWords && (
                <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center gap-4 sm:gap-8 px-4">
                  <motion.span
                    style={{ x: wordLeftX, opacity: wordsOpacity }}
                    className="font-display text-4xl sm:text-7xl lg:text-8xl font-black tracking-tighter text-white/90 drop-shadow-[0_10px_30px_rgba(0,0,0,0.85)]"
                  >
                    {splitWords[0]}
                  </motion.span>
                  <motion.div
                    style={{ opacity: wordsOpacity }}
                    className="hidden sm:flex h-11 w-11 lg:h-14 lg:w-14 items-center justify-center rounded-full bg-lime text-navy-ink shadow-[0_0_35px_rgba(112,224,0,0.7)]"
                  >
                    <ArrowRight size={22} className="text-navy-ink stroke-[2.5]" />
                  </motion.div>
                  <motion.span
                    style={{ x: wordRightX, opacity: wordsOpacity }}
                    className="font-display text-4xl sm:text-7xl lg:text-8xl font-black tracking-tighter text-[#5CC8FF] drop-shadow-[0_10px_30px_rgba(0,0,0,0.85)]"
                  >
                    {splitWords[1]}
                  </motion.span>
                </div>
              )}

              {/* Conteúdo sobreposto revelado no estado final expandido */}
              <motion.div
                style={{ opacity: overlayOpacity, y: overlayY }}
                className="pointer-events-auto absolute inset-x-0 bottom-0 z-25 flex flex-col justify-end p-6 sm:p-10 lg:p-14"
              >
                <div className="max-w-2xl">
                  {overlayTitle && (
                    <h3 className="font-display text-2xl font-light leading-snug tracking-tight text-white sm:text-4xl lg:text-5xl">
                      {overlayTitle}
                    </h3>
                  )}
                  {overlayDescription && (
                    <p className="mt-3 text-xs leading-relaxed text-white/80 sm:text-sm lg:text-base">
                      {overlayDescription}
                    </p>
                  )}

                  {overlayPerks && overlayPerks.length > 0 && (
                    <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs sm:text-sm text-white/90">
                      {overlayPerks.map((perk) => (
                        <li key={perk} className="inline-flex items-center gap-2">
                          <CheckCircle2 size={16} className="text-lime shrink-0" aria-hidden="true" />
                          <span>{perk}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {cta && (
                    <div className="mt-5 sm:mt-7 flex flex-wrap items-center gap-4">
                      <a
                        href={cta.href}
                        className="btn-lime inline-flex items-center gap-2"
                      >
                        {cta.label}
                        <ArrowRight size={16} aria-hidden="true" />
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
