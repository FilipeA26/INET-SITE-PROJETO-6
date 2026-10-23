import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { DUR, EASE, STAGGER } from "../motion";

/**
 * Revela o texto linha por linha, subindo de dentro de uma máscara.
 * É a mesma animação de entrada para todos os títulos do site.
 */
export default function Lines({ lines, className = "", delay = 0, as = "h2" }: { lines: ReactNode[]; className?: string; delay?: number; as?: "h1" | "h2" | "p" }) {
  const Tag = motion[as];
  return (
    <Tag
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-12% 0px" }}
      transition={{ staggerChildren: STAGGER, delayChildren: delay }}
    >
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden pb-[0.08em]">
          <motion.span
            className="block"
            variants={{ hidden: { y: "105%", opacity: 0 }, show: { y: "0%", opacity: 1 } }}
            transition={{ duration: DUR, ease: EASE }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}

/** Entrada padrão para blocos (cards, parágrafos): sobe e aparece. */
export function Rise({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: DUR, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}
