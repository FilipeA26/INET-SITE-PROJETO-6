import React from "react";
import CinematicCanvas from "./CinematicCanvas";

export type SectionBackdropVariant =
  | "ink"        // Escuro profundo contínuo (#010818 / navy-ink), sem faixas laterais
  | "mist"       // Escuro profundo com luz suave localizada (light leak / radial glow suave azul/ciano)
  | "snow"       // Claro-neve (#F4F7FB, nunca branco puro) para seções de respiro alternadas estilo Apple
  | "cinematic"; // Canvas cinematográfico leve encapsulado (IntersectionObserver, sem cabos ou auras nas laterais)

export interface SectionBackdropProps {
  /** Variante visual do fundo da seção */
  variant?: SectionBackdropVariant;
  /** Classes extras para o container ou camada de fundo */
  className?: string;
  /** Conteúdo opcional: se fornecido, o componente atua como wrapper semântico da seção */
  children?: React.ReactNode;
  /** Posição da luz suave para a variante 'mist' */
  glowPosition?: "center" | "top-right" | "top-left" | "bottom" | "top";
  /** Intensidade do glow suave em 'mist' (0.05 a 0.5, padrão 0.28) */
  glowIntensity?: number;
  /** Transições sutis de borda com a seção adjacente */
  transition?: "none" | "fade-top" | "fade-bottom" | "fade-both";
  /** ID para âncoras na seção */
  id?: string;
  /** Tag HTML se usado como wrapper (padrão 'section') */
  as?: "section" | "div" | "article";
}

/**
 * SectionBackdrop - Sistema de Fundo por Seção (Rodada 7).
 * Inspirado em apple.com (alternância rítmica de seções escuras e claro-neve),
 * activetheory.net (luz suave localizada e atmosfera fotográfica sem ruídos)
 * e lusion.co (cenas cinematográficas contidas por seção).
 *
 * Remove o fundo fixo global com cabos laterais, preenchendo de ponta a ponta (100vw).
 */
export default function SectionBackdrop({
  variant = "ink",
  className = "",
  children,
  glowPosition = "top-right",
  glowIntensity = 0.28,
  transition = "none",
  id,
  as: Component = "section",
}: SectionBackdropProps) {
  // Configuração das posições de luz para a variante 'mist'
  const glowCoords: Record<string, string> = {
    "center": "50% 50%",
    "top-right": "85% 15%",
    "top-left": "15% 15%",
    "bottom": "50% 90%",
    "top": "50% 10%",
  };
  const glowOrigin = glowCoords[glowPosition] || glowCoords["top-right"];

  const renderBackgroundLayer = () => {
    switch (variant) {
      case "snow":
        return (
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none -z-10 bg-[#F4F7FB] transition-colors duration-500"
          >
            {/* Sutil vinheta de borda para profundidade sem cortar margens */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse 90% 70% at 50% 50%, rgba(255, 255, 255, 0.8) 0%, rgba(240, 244, 250, 0.4) 60%, rgba(228, 235, 245, 0.7) 100%)",
              }}
            />
          </div>
        );

      case "mist":
        return (
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none -z-10 bg-navy-ink transition-colors duration-500"
          >
            {/* Luz suave localizada (estilo light leak activetheory.net / lusion.co) */}
            <div
              className="absolute inset-0"
              style={{
                background: `radial-gradient(circle 650px at ${glowOrigin}, rgba(0, 98, 236, ${glowIntensity}) 0%, rgba(92, 200, 255, ${
                  glowIntensity * 0.45
                }) 35%, rgba(1, 8, 24, 0) 70%)`,
              }}
            />
          </div>
        );

      case "cinematic":
        return (
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none -z-10 overflow-hidden bg-navy-ink"
          >
            <CinematicCanvas intensity={1.0} />
          </div>
        );

      case "ink":
      default:
        return (
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none -z-10 bg-navy-ink transition-colors duration-500"
          />
        );
    }
  };

  const renderTransitions = () => {
    if (transition === "none") return null;

    const fadeClass = variant === "snow" ? "from-[#F4F7FB] to-transparent" : "from-navy-ink to-transparent";

    return (
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none z-0">
        {(transition === "fade-top" || transition === "fade-both") && (
          <div className={`absolute top-0 inset-x-0 h-24 bg-gradient-to-b ${fadeClass}`} />
        )}
        {(transition === "fade-bottom" || transition === "fade-both") && (
          <div className={`absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t ${fadeClass}`} />
        )}
      </div>
    );
  };

  // Se for usado como wrapper em torno do conteúdo da seção
  if (children) {
    return (
      <Component
        id={id}
        className={`relative isolate w-full overflow-hidden ${
          variant === "snow" ? "text-navy-ink" : "text-white"
        } ${className}`}
      >
        {renderBackgroundLayer()}
        {renderTransitions()}
        <div className="relative z-10 w-full">{children}</div>
      </Component>
    );
  }

  // Se for usado como camada absoluta inserida dentro de uma seção existente
  return (
    <>
      {renderBackgroundLayer()}
      {renderTransitions()}
    </>
  );
}
