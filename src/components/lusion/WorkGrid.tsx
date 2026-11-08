import React, { type ReactNode } from "react";
import Lines, { Rise } from "../Lines";
import SectionBackdrop, { type SectionBackdropVariant } from "../fundos/SectionBackdrop";
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
  /** Variante do fundo da seção */
  variant?: SectionBackdropVariant;
  /** Lista estruturada de cards de mídia */
  items?: WorkCardProps[];
  /** Conteúdo livre (caso queira compor manualmente os WorkCards) */
  children?: ReactNode;
  /** Classes extras para a seção */
  className?: string;
  /** Seção sem padding padrão */
  flush?: boolean;
}

/** Proporções de aspecto assimétricas alternadas para quebrar a monotonia visual */
const ASYMMETRIC_ASPECTS = [
  "aspect-[16/11]", // Card 1: Paisagem ampla
  "aspect-[4/5]",   // Card 2: Retrato alto cinemático
  "aspect-[4/5]",   // Card 3: Retrato alto
  "aspect-[16/10]", // Card 4: Paisagem clássica
];

/**
 * WorkGrid - Grade Assimétrica de Mídia Inspirada no Lusion.co
 *
 * Características essenciais:
 * 1. 2 Colunas no desktop com ritmo assimétrico:
 *    - Um card mais alto que o outro (aspect ratios variados).
 *    - A coluna da direita tem um desfasamento vertical (offset mt-16/24).
 *    - Nada de grade de cards iguais (anti-padrão de IA).
 * 2. Largura estendida (max-w-[1400px]):
 *    - Preenche o vazio das laterais em telas amplas mantendo margens respiráveis.
 * 3. Mobile-first:
 *    - No mobile (375px), desce suavemente para 1 coluna fluida sem deslocamentos que criem vazios indesejados.
 * 4. Sem overflow-hidden na seção (atende à regra dura 5 para preservar títulos revelados).
 */
export default function WorkGrid({
  id,
  tag,
  title,
  lead,
  variant = "ink",
  items,
  children,
  className = "",
  flush = false,
}: WorkGridProps) {
  return (
    <section
      id={id}
      aria-label={tag || "Destaques"}
      className={`section-frame r7-surface tone-${variant} relative isolate ${className}`}
    >
      <SectionBackdrop variant={variant} glowPosition="top-right" glowIntensity={0.16} />

      <div className={`mx-auto w-full max-w-[1400px] px-5 sm:px-8 lg:px-12 xl:px-16 relative z-10 ${flush ? "" : ""}`}>
        {/* Cabeçalho editorial estilo Lusion: Título à esquerda, lead explicativo à direita */}
        {(title || lead || tag) && (
          <div className="mb-12 sm:mb-16 lg:mb-20 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between border-b border-white/10 pb-8 sm:pb-12">
            <div className="max-w-3xl">
              {tag && (
                <Rise>
                  <p className="tag mb-3">{tag}</p>
                </Rise>
              )}
              {title && <Lines className="h-lg" lines={title} />}
            </div>

            {lead && (
              <Rise delay={0.2} className="max-w-xl lg:text-right">
                <p className="lead text-white/70 leading-relaxed">{lead}</p>
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
