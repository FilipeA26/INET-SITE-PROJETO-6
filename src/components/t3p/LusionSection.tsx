import React, { type ReactNode } from "react";
import Lines, { Rise } from "../Lines";

export type LusionSectionVariant = "snow" | "ink" | "blue";
export type LusionSectionLayout = "5-7" | "7-5" | "full" | "stack";

export interface LusionSectionProps {
  id?: string;
  tag?: string;
  title?: ReactNode[];
  lead?: string;
  variant?: LusionSectionVariant;
  layout?: LusionSectionLayout;
  media?: ReactNode;
  children?: ReactNode;
  actions?: ReactNode;
  className?: string;
}

/**
 * LusionSection - Seção com Fundo Apple e Grade Lusion de 12 Colunas
 *
 * Características:
 * 1. Margem lateral proporcional max(6vw, 60px): preenche as laterais sem engessar em container estreito.
 * 2. Alternância de fundo com corte limpo (Apple): claro-neve (#F0F1FA), azul-noite (#010818) e azul INET (#0062EC).
 * 3. Ritmo 5/7 colunas assimétrico: texto em 5 colunas e mídia em 7, alternando os lados.
 */
export default function LusionSection({
  id,
  tag,
  title,
  lead,
  variant = "snow",
  layout = "stack",
  media,
  children,
  actions,
  className = "",
}: LusionSectionProps) {
  const isSnow = variant === "snow";
  const isBlue = variant === "blue";

  const bgStyles = isSnow
    ? "bg-[#F0F1FA] text-[#07152D]"
    : isBlue
    ? "bg-[#0062EC] text-white"
    : "bg-[#010818] text-white";

  const tagStyles = isSnow
    ? "text-[#0062EC]"
    : isBlue
    ? "!text-white/90 font-semibold"
    : "text-lime";

  const leadStyles = isSnow
    ? "!text-[#334155]"
    : isBlue
    ? "!text-white/90"
    : "!text-white/70";

  const titleClass = isSnow
    ? "h-lg !text-[#07152D]"
    : isBlue
    ? "h-lg !text-white [&_span]:!text-white"
    : "h-lg !text-white";

  const borderStyles = isSnow
    ? "border-black/10"
    : isBlue
    ? "border-white/20"
    : "border-white/10";

  return (
    <section
      id={id}
      aria-label={tag || "Seção"}
      data-contrast={!isSnow ? "dark" : undefined}
      className={`relative isolate py-20 sm:py-24 lg:py-32 transition-colors duration-500 ${bgStyles} ${className}`}
    >
      <div className="w-full px-5 sm:px-8 lg:px-[max(6vw,60px)]">
        {layout === "5-7" ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-[2vw] items-center">
            <div className="lg:col-span-5">
              {tag && (
                <Rise>
                  <p className={`font-display text-[11px] font-medium uppercase tracking-[0.24em] mb-3 ${tagStyles}`}>
                    {tag}
                  </p>
                </Rise>
              )}
              {title && <Lines className={titleClass} lines={title} />}
              {lead && (
                <Rise delay={0.2}>
                  <p className={`lead mt-6 leading-relaxed ${leadStyles}`}>{lead}</p>
                </Rise>
              )}
              {actions && (
                <Rise delay={0.3} className="mt-8 flex flex-wrap gap-3">
                  {actions}
                </Rise>
              )}
              {children && <div className="mt-8">{children}</div>}
            </div>

            <div className="lg:col-span-7">
              {media}
            </div>
          </div>
        ) : layout === "7-5" ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-[2vw] items-center">
            <div className="lg:col-span-7 order-2 lg:order-1">
              {media}
            </div>

            <div className="lg:col-span-5 order-1 lg:order-2">
              {tag && (
                <Rise>
                  <p className={`font-display text-[11px] font-medium uppercase tracking-[0.24em] mb-3 ${tagStyles}`}>
                    {tag}
                  </p>
                </Rise>
              )}
              {title && <Lines className={titleClass} lines={title} />}
              {lead && (
                <Rise delay={0.2}>
                  <p className={`lead mt-6 leading-relaxed ${leadStyles}`}>{lead}</p>
                </Rise>
              )}
              {actions && (
                <Rise delay={0.3} className="mt-8 flex flex-wrap gap-3">
                  {actions}
                </Rise>
              )}
              {children && <div className="mt-8">{children}</div>}
            </div>
          </div>
        ) : (
          <div>
            {(title || lead || tag) && (
              <div className={`mb-12 sm:mb-16 lg:mb-20 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between border-b ${borderStyles} pb-8 sm:pb-12`}>
                <div className="max-w-3xl">
                  {tag && (
                    <Rise>
                      <p className={`font-display text-[11px] font-medium uppercase tracking-[0.24em] mb-3 ${tagStyles}`}>
                        {tag}
                      </p>
                    </Rise>
                  )}
                  {title && <Lines className={titleClass} lines={title} />}
                </div>

                {lead && (
                  <Rise delay={0.2} className="max-w-xl lg:text-right">
                    <p className={`lead leading-relaxed ${leadStyles}`}>{lead}</p>
                  </Rise>
                )}
              </div>
            )}

            {children}
          </div>
        )}
      </div>
    </section>
  );
}
