import React, { type ReactNode } from "react";
import Lines, { Rise } from "../Lines";
import WorkCard, { type WorkCardProps } from "./WorkCard";

export interface WorkGridProps {
  /** ID para âncoras na página */
  id?: string;
  /** Chapéu ou tag da seção */
  tag?: string;
  /** Título editorial (aceita array para animação de linhas) */
  title?: ReactNode[];
  /** Subtítulo ou texto de contextualização (lado direito no desktop estilo Lusion) */
  lead?: string;
  /** Variante do fundo da seção com corte limpo (Apple) */
  variant?: "snow" | "ink" | "blue";
  /** Tema dos cards ("dark" ou "light") */
  theme?: "dark" | "light";
  /** Lista estruturada de cards de mídia */
  items?: WorkCardProps[];
  /** Conteúdo livre (caso queira compor manualmente os WorkCards) */
  children?: ReactNode;
  /** Classes extras para a seção */
  className?: string;
}

/** Proporções de aspecto assimétricas alternadas para quebrar a monotonia visual */
const ASYMMETRIC_ASPECTS = [
  "aspect-[16/11]", // Card 1: Paisagem ampla
  "aspect-[4/5]",   // Card 2: Retrato alto cinemático
  "aspect-[4/5]",   // Card 3: Retrato alto
  "aspect-[16/10]", // Card 4: Paisagem clássica
];

/**
 * WorkGrid - Grade Assimétrica de Mídia Inspirada no Lusion.co (Teste 3)
 *
 * Características essenciais:
 * 1. 2 Colunas no desktop com ritmo assimétrico (aspectos variados e offset vertical).
 * 2. Margem lateral proporcional max(6vw, 60px): preenche o vazio das laterais sem engessar em container estreito.
 * 3. Fundo por seção com corte limpo (Apple): claro-neve, azul-noite de contraste e azul INET.
 * 4. Tema claro sem cartão branco sobre fundo claro: o card mantém corpo escuro de alta legibilidade.
 */
export default function WorkGrid({
  id,
  tag,
  title,
  lead,
  variant = "snow",
  theme,
  items,
  children,
  className = "",
}: WorkGridProps) {
  const isSnow = variant === "snow";
  const isBlue = variant === "blue";
  const activeTheme = theme || (isSnow ? "light" : "dark");

  const bgStyles = isSnow
    ? "bg-[#F0F1FA] text-[#07152D]"
    : isBlue
    ? "bg-[#0062EC] text-white"
    : "bg-[#010818] text-white";

  const tagStyles = isSnow ? "text-[#0062EC]" : isBlue ? "!text-white/90 font-semibold" : "text-lime";
  const leadStyles = isSnow ? "text-[#334155]" : isBlue ? "!text-white/90" : "!text-white/70";
  const borderStyles = isSnow ? "border-black/10" : isBlue ? "border-white/20" : "border-white/10";

  return (
    <section
      id={id}
      data-contrast={!isSnow ? "dark" : undefined}
      aria-label={tag || "Destaques"}
      className={`relative isolate py-20 sm:py-24 lg:py-32 transition-colors duration-500 ${bgStyles} ${className}`}
    >
      <div className="w-full px-5 sm:px-8 lg:px-[max(6vw,60px)] relative z-10">
        {/* Cabeçalho editorial estilo Lusion: Título à esquerda, lead explicativo à direita */}
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
              {title && <Lines className={`h-lg ${isSnow ? "!text-[#07152D]" : "!text-white [&_span]:!text-white"}`} lines={title} />}
            </div>

            {lead && (
              <Rise delay={0.2} className="max-w-xl lg:text-right">
                <p className={`lead leading-relaxed ${leadStyles}`}>{lead}</p>
              </Rise>
            )}
          </div>
        )}

        {/* Grade de 2 colunas com ritmo assimétrico */}
        {children ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-14 xl:gap-20 items-start">
            {children}
          </div>
        ) : items && items.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-14 xl:gap-20 items-start">
            {items.map((item, index) => {
              const isOdd = index % 2 === 1;
              const defaultAspect = ASYMMETRIC_ASPECTS[index % ASYMMETRIC_ASPECTS.length];
              const defaultOffsetY = isOdd ? "md:mt-16 lg:mt-24" : "";

              return (
                <WorkCard
                  key={item.id || index}
                  aspect={item.aspect || defaultAspect}
                  offsetY={item.offsetY !== undefined ? item.offsetY : defaultOffsetY}
                  theme={item.theme || activeTheme}
                  {...item}
                />
              );
            })}
          </div>
        ) : null}
      </div>
    </section>
  );
}
