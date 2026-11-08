import React, { useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { SPRING } from "../../motion";
import InetPhone from "../giro/InetPhone";
import Lines, { Rise } from "../Lines";

export interface DeviceGiroProps {
  id?: string;
  device: "phone" | "receptor";
  initialSide?: "left" | "right";
  tag?: string;
  title: React.ReactNode[];
  lead?: string;
  badge?: string;
  actions?: React.ReactNode;
  variant?: "snow" | "ink" | "blue";
  className?: string;
}

/**
 * DeviceGiro - Aparelhos que Giram com a Rolagem (Estilo Refokus.com)
 *
 * Características:
 * 1. O celular (Móvel) e o receptor INET TV (TV) giram com a rolagem em 3D.
 * 2. Vêm da lateral para o centro e voltam com a progressão da rolagem.
 * 3. Ficam nas laterais ocupando o vazio, integrados à grade de 12 colunas do Lusion.
 * 4. prefers-reduced-motion estritamente respeitado: sem giro, aparelho estático e centralizado.
 */
export default function DeviceGiro({
  id,
  device,
  initialSide = "right",
  tag,
  title,
  lead,
  badge,
  actions,
  variant = "ink",
  className = "",
}: DeviceGiroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const isLeft = initialSide === "left";
  const isSnow = variant === "snow";
  const isBlue = variant === "blue";

  // Rastreamento suave da rolagem ao longo da seção
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const p = useSpring(scrollYProgress, SPRING);

  // Da lateral para o centro e volta para a lateral
  const x = useTransform(
    p,
    [0, 0.48, 1],
    isLeft ? ["-22vw", "0vw", "20vw"] : ["22vw", "0vw", "-20vw"]
  );

  // Giro tridimensional contínuo impulsionado pela rolagem
  const rotateY = useTransform(
    p,
    [0, 0.48, 1],
    isLeft ? [-38, 0, 34] : [38, 0, -34]
  );
  const rotateX = useTransform(p, [0, 0.48, 1], [14, 0, -10]);
  const rotateZ = useTransform(p, [0, 0.48, 1], isLeft ? [-5, 0, 5] : [5, 0, -5]);
  const scale = useTransform(p, [0, 0.48, 1], [0.82, 1.04, 0.84]);

  const bgStyles = isSnow
    ? "bg-[#F0F1FA] text-[#07152D]"
    : isBlue
    ? "bg-[#0062EC] text-white"
    : "bg-[#010818] text-white";

  const tagStyles = isSnow ? "text-[#0062EC]" : "text-lime";
  const leadStyles = isSnow ? "text-[#334155]" : isBlue ? "text-white/90" : "text-white/70";

  return (
    <section
      ref={containerRef}
      id={id}
      aria-label={typeof title[0] === "string" ? title[0] : "Aparelho em destaque"}
      data-contrast={!isSnow ? "dark" : undefined}
      className={`relative isolate py-20 sm:py-28 overflow-hidden transition-colors duration-500 ${bgStyles} ${className}`}
    >
      <div className="w-full px-5 sm:px-8 lg:px-[max(6vw,60px)]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-[3vw] items-center">
          {/* Coluna de texto editorial (5 colunas) */}
          <div className={`lg:col-span-5 ${isLeft ? "order-1 lg:order-2" : "order-1 lg:order-1"}`}>
            {tag && (
              <Rise>
                <p className={`font-display text-[11px] font-medium uppercase tracking-[0.24em] mb-3 ${tagStyles}`}>
                  {tag}
                </p>
              </Rise>
            )}

            <Lines className={`h-lg ${isSnow ? "!text-[#07152D]" : "!text-white"}`} lines={title} />

            {lead && (
              <Rise delay={0.2}>
                <p className={`lead mt-6 leading-relaxed ${leadStyles}`}>{lead}</p>
              </Rise>
            )}

            {actions && (
              <Rise delay={0.35} className="mt-8 flex flex-wrap gap-3">
                {actions}
              </Rise>
            )}
          </div>

          {/* Coluna do aparelho giratório ocupando a lateral (7 colunas) */}
          <div
            className={`lg:col-span-7 flex items-center justify-center perspective-[1400px] ${
              isLeft ? "order-2 lg:order-1" : "order-2 lg:order-2"
            }`}
          >
            <motion.div
              style={
                shouldReduceMotion
                  ? { transformStyle: "preserve-3d" }
                  : {
                      x,
                      rotateY,
                      rotateX,
                      rotateZ,
                      scale,
                      transformStyle: "preserve-3d",
                      willChange: "transform",
                    }
              }
              className="relative w-full max-w-[480px] flex items-center justify-center py-6"
            >
              {device === "phone" ? (
                <div className="w-[min(72vw,310px)] drop-shadow-[0_35px_60px_rgba(0,12,38,0.75)]">
                  <InetPhone />
                </div>
              ) : (
                <div className="w-[min(85vw,560px)] flex flex-col items-center">
                  <img
                    src="/inet-tv-receptor.webp"
                    alt="Receptor INET TV com controle remoto"
                    width={760}
                    height={732}
                    loading="lazy"
                    decoding="async"
                    className="block h-auto w-full object-contain select-none drop-shadow-[0_30px_60px_rgba(0,15,45,0.7)]"
                  />
                </div>
              )}

              {badge && (
                <div className="absolute right-2 -bottom-2 sm:right-6 sm:bottom-0 pointer-events-none z-10">
                  <span className="rounded-full border border-white/20 bg-[#010818]/85 px-4 py-1.5 text-xs font-semibold tracking-wide text-white shadow-xl backdrop-blur-md">
                    {badge}
                  </span>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
