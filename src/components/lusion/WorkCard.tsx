import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { EASE, SPRING } from "../../motion";

export interface WorkCardProps {
  /** Identificador opcional da âncora */
  id?: string;
  /** Caminho da imagem em public/ */
  imageSrc?: string;
  /** Caminho do vídeo em public/ (opcional, priorizado se fornecido) */
  videoSrc?: string;
  /** Imagem de pôster ou fallback do vídeo */
  posterSrc?: string;
  /** Texto alternativo acessível */
  alt?: string;
  /** Chapéu ou categoria acima do título (ex: "01 · Fibra Óptica") */
  tag?: string;
  /** Título principal do projeto/recurso */
  title: React.ReactNode;
  /** Subtítulo ou legenda descritiva como no lusion */
  subtitle?: string;
  /** Link de destino opcional (interno iniciado com /, âncora com # ou externo https/wa.me) */
  href?: string;
  /** Se o link abre em nova aba */
  external?: boolean;
  /** Proporção do aspecto (ex: "aspect-[16/11]", "aspect-[4/5]", "aspect-[16/10]") */
  aspect?: string;
  /** Selo ou etiqueta complementar */
  badge?: string;
  /** Deslocamento vertical para ritmo assimétrico (ex: "md:mt-16 lg:mt-24") */
  offsetY?: string;
  /** Classes extras para o container */
  className?: string;
}

/**
 * WorkCard - Card de Mídia Inspirado no Featured Work do Lusion.co
 *
 * Características:
 * 1. Crescimento por rolagem: o card começa reduzido (~86% da escala, com cantos mais arredondados)
 *    e cresce suavemente para 100% à medida que entra na área de visualização.
 * 2. Hover com micro-tremida e blur: ao passar o mouse, a mídia executa uma micro-rotação/deslocamento
 *    de 1 a 2px e um desfoque óptico (blur), retornando com a mola oficial do projeto (SPRING).
 * 3. Tipografia editorial Lusion: categoria, título fluido e legenda posicionados embaixo da mídia.
 * 4. Acessibilidade total: respeita prefers-reduced-motion e (hover: hover) em CSS e JS.
 */
export default function WorkCard({
  id,
  imageSrc,
  videoSrc,
  posterSrc,
  alt = "INET Telecomunicações",
  tag,
  title,
  subtitle,
  href,
  external,
  aspect = "aspect-[16/11]",
  badge,
  offsetY = "",
  className = "",
}: WorkCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const [isHovered, setIsHovered] = useState(false);
  const [canHover, setCanHover] = useState(false);

  // Detecção de ponteiro com suporte a hover real (evita disparos em telas de toque)
  useEffect(() => {
    const mq = window.matchMedia("(hover: hover)");
    setCanHover(mq.matches);
    const handler = (e: MediaQueryListEvent) => setCanHover(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Controle inteligente de reprodução do vídeo: só toca quando visível na tela
  useEffect(() => {
    const v = videoRef.current;
    if (!v || shouldReduceMotion) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          v.play().catch(() => {});
        } else {
          v.pause();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(v);
    return () => observer.disconnect();
  }, [shouldReduceMotion, videoSrc]);

  // Crescimento sutil por scroll: de 0.86 para 1.0 com raio suavizado
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "center 70%"],
  });

  const smoothProgress = useSpring(scrollYProgress, SPRING);
  const scaleValue = useTransform(smoothProgress, [0, 1], [0.86, 1]);
  const radiusValue = useTransform(smoothProgress, [0, 1], ["28px", "18px"]);

  const finalScale = shouldReduceMotion ? 1 : scaleValue;
  const finalRadius = shouldReduceMotion ? "18px" : radiusValue;

  const isExternal = external ?? (href?.startsWith("http") || href?.startsWith("//") || href?.includes("wa.me"));

  // Conteúdo da mídia (vídeo ou imagem estática)
  const renderMedia = () => {
    if (videoSrc && !shouldReduceMotion) {
      return (
        <video
          ref={videoRef}
          src={videoSrc}
          poster={posterSrc || imageSrc}
          muted
          loop
          playsInline
          preload="none"
          aria-hidden="true"
          className="h-full w-full object-cover select-none"
        />
      );
    }

    const currentImg = posterSrc || imageSrc;
    if (currentImg) {
      return (
        <img
          src={currentImg}
          alt={alt}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover select-none transition-transform duration-700 ease-out"
        />
      );
    }

    return null;
  };

  return (
    <div
      ref={containerRef}
      id={id}
      className={`group relative flex flex-col ${offsetY} ${className}`}
      onPointerEnter={(e) => {
        if (e.pointerType === "mouse" && canHover) setIsHovered(true);
      }}
      onPointerLeave={(e) => {
        if (e.pointerType === "mouse") setIsHovered(false);
      }}
      onFocus={() => canHover && setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
    >
      {/* Moldura da mídia com crescimento por scroll */}
      <motion.div
        style={{
          scale: finalScale,
          borderRadius: finalRadius,
          willChange: "transform",
        }}
        className={`relative isolate w-full overflow-hidden bg-[#020F2E] border border-white/10 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.8)] transition-colors duration-500 group-hover:border-lime/40 ${aspect}`}
      >
        {/* Camada animada com tremida e blur óptico do Lusion */}
        <motion.div
          animate={
            isHovered && canHover && !shouldReduceMotion
              ? {
                  x: [0, -1.8, 1.8, -1.2, 0.8, -0.4, 0],
                  y: [0, 1.2, -1.4, 0.8, -0.6, 0.3, 0],
                  rotate: [0, -0.7, 0.8, -0.5, 0.3, -0.1, 0],
                  scale: 1.03,
                  filter: [
                    "blur(0px) brightness(1)",
                    "blur(4.5px) brightness(1.06)",
                    "blur(2.2px) brightness(1.03)",
                    "blur(1.2px) brightness(1.01)",
                  ],
                }
              : {
                  x: 0,
                  y: 0,
                  rotate: 0,
                  scale: 1,
                  filter: "blur(0px) brightness(1)",
                }
          }
          transition={
            isHovered && canHover && !shouldReduceMotion
              ? {
                  duration: 0.46,
                  ease: EASE,
                }
              : {
                  ...SPRING,
                }
          }
          className="relative h-full w-full"
        >
          {renderMedia()}

          {/* Véu sutil de luz/sombra para profundidade cinematográfica */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#010818]/60 via-transparent to-[#010818]/20 opacity-60 transition-opacity duration-500 group-hover:opacity-40"
          />
        </motion.div>

        {/* Badge flutuante sobre a mídia se configurado */}
        {badge && (
          <div className="absolute right-4 top-4 z-10 pointer-events-none">
            <span className="rounded-full border border-white/15 bg-[#010818]/80 px-3.5 py-1 text-[11px] font-medium tracking-wide text-white/85 backdrop-blur-md">
              {badge}
            </span>
          </div>
        )}

        {/* Botão de seta estilo Lusion revelado no hover */}
        {href && (
          <div className="absolute right-5 bottom-5 z-10 pointer-events-none">
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-[#010818]/70 text-white shadow-lg backdrop-blur-md transition-all duration-500 group-hover:scale-110 group-hover:border-lime group-hover:bg-lime group-hover:text-navy-ink">
              <ArrowUpRight size={18} aria-hidden="true" />
            </span>
          </div>
        )}
      </motion.div>

      {/* Legenda e metadados embaixo da mídia (estilo Lusion) */}
      <div className="mt-5 flex items-start justify-between gap-4 px-1">
        <div className="min-w-0 flex-1">
          {tag && (
            <p className="font-display text-[11px] font-medium uppercase tracking-[0.22em] text-lime">
              {tag}
            </p>
          )}
          <h3 className="mt-1 font-display text-xl sm:text-2xl font-light leading-snug tracking-[-0.01em] text-white transition-colors duration-500 group-hover:text-lime">
            {title}
          </h3>
          {subtitle && (
            <p className="mt-2 text-sm text-white/65 leading-relaxed line-clamp-2 sm:line-clamp-none">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Link de cobertura total acessível */}
      {href && (
        isExternal ? (
          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            className="absolute inset-0 z-20 rounded-2xl"
            aria-label={typeof title === "string" ? title : undefined}
          />
        ) : href.startsWith("#") ? (
          <a
            href={href}
            className="absolute inset-0 z-20 rounded-2xl"
            aria-label={typeof title === "string" ? title : undefined}
          />
        ) : (
          <Link
            to={href}
            className="absolute inset-0 z-20 rounded-2xl"
            aria-label={typeof title === "string" ? title : undefined}
          />
        )
      )}
    </div>
  );
}
