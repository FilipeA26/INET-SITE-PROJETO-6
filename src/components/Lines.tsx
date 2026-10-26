import { useCallback, useEffect, useLayoutEffect, useRef, type ReactNode } from "react";
import { motion } from "framer-motion";
import { DUR, EASE, STAGGER } from "../motion";

/**
 * Encaixa o título na largura disponível: cada linha escrita no código continua sendo
 * uma linha só (nunca quebra sozinha nem sai da tela) e, quando a maior delas não cabe,
 * o título todo diminui na mesma proporção. Roda na montagem, ao carregar as fontes e
 * a cada mudança de tamanho.
 */
function useFit(ref: React.RefObject<HTMLElement>) {
  const raf = useRef(0);

  const fit = useCallback(() => {
    const node = ref.current;
    if (!node) return;
    node.style.fontSize = ""; // volta ao tamanho da classe antes de medir
    const avail = node.clientWidth;
    if (!avail) return;
    let widest = 0;
    node.querySelectorAll<HTMLElement>("[data-line]").forEach((line) => {
      const range = document.createRange();
      range.selectNodeContents(line);
      widest = Math.max(widest, range.getBoundingClientRect().width);
    });
    if (widest <= avail) return;
    const base = parseFloat(getComputedStyle(node).fontSize);
    node.style.fontSize = `${((base * (avail - 1)) / widest).toFixed(2)}px`;
  }, [ref]);

  const schedule = useCallback(() => {
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(fit);
  }, [fit]);

  useLayoutEffect(fit, [fit]);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    document.fonts?.ready.then(schedule);
    const ro = new ResizeObserver(schedule);
    ro.observe(node);
    return () => {
      cancelAnimationFrame(raf.current);
      ro.disconnect();
    };
  }, [ref, schedule]);
}

/**
 * Revela o texto linha por linha, subindo de dentro de uma máscara.
 * É a mesma animação de entrada para todos os títulos do site.
 */
export default function Lines({ lines, className = "", delay = 0, as = "h2" }: { lines: ReactNode[]; className?: string; delay?: number; as?: "h1" | "h2" | "p" }) {
  const Tag = motion[as];
  const ref = useRef<HTMLHeadingElement>(null);
  useFit(ref);
  return (
    <Tag
      ref={ref}
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-12% 0px" }}
      transition={{ staggerChildren: STAGGER, delayChildren: delay }}
    >
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden pb-[0.08em]">
          <motion.span
            data-line
            className="block whitespace-nowrap"
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
export function Rise({ children, delay = 0, className = "", as = "div" }: { children: ReactNode; delay?: number; className?: string; as?: "div" | "li" }) {
  const Tag = as === "li" ? motion.li : motion.div;
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y: 28, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: DUR, ease: EASE, delay }}
    >
      {children}
    </Tag>
  );
}
