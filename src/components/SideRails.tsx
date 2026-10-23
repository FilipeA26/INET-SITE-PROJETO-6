import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { SPRING } from "../motion";

// posições (em % da largura da faixa lateral) e atraso de cada fibra
const FIBERS = [
  { x: 18, delay: 0, dur: 9 },
  { x: 38, delay: 3.2, dur: 11 },
  { x: 57, delay: 1.4, dur: 8 },
  { x: 76, delay: 5.1, dur: 12 },
];

function Rail({ side }: { side: "left" | "right" }) {
  const { scrollYProgress } = useScroll();
  const p = useSpring(scrollYProgress, SPRING);
  // a aura acompanha a rolagem devagar, uma sobe enquanto a outra desce
  const y = useTransform(p, [0, 1], side === "left" ? ["10%", "70%"] : ["70%", "10%"]);
  const color = side === "left" ? "#0062EC" : "#38B000";

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed inset-y-0 z-0 hidden w-[max(0px,calc((100vw-72rem)/2))] min-w-[120px] xl:block ${side === "left" ? "left-0" : "right-0 -scale-x-100"}`}
    >
      <motion.div style={{ top: y, background: `radial-gradient(circle, ${color}55, transparent 70%)` }} className="absolute -left-1/2 h-[46vh] w-[140%] -translate-y-1/2 rounded-full blur-[80px]" />
      {FIBERS.map((f) => (
        <span key={f.x} className="absolute inset-y-0 w-px bg-gradient-to-b from-transparent via-white/[0.07] to-transparent" style={{ left: `${f.x}%` }}>
          <span
            className="side-pulse absolute left-1/2 h-24 w-[2px] -translate-x-1/2 rounded-full bg-gradient-to-b from-transparent via-[#5CC8FF] to-transparent"
            style={{ animationDelay: `${f.delay}s`, animationDuration: `${f.dur}s` }}
          />
        </span>
      ))}
      {/* curva suave que "abraça" o conteúdo, como uma moldura */}
      <svg className="absolute right-0 top-0 h-full w-16 text-white/[0.06]" viewBox="0 0 64 1000" preserveAspectRatio="none" fill="none">
        <path d="M64 0C20 160 20 340 48 500S20 840 64 1000" stroke="currentColor" strokeWidth="1" vectorEffect="non-scaling-stroke" />
      </svg>
    </div>
  );
}

/**
 * Bordas laterais suaves: nas telas largas o conteúdo fica centralizado, então as
 * laterais ganham fibras finas com pulsos de luz e uma aura que segue a rolagem,
 * para o site não parecer vazio nos cantos.
 */
export default function SideRails() {
  return (
    <>
      <Rail side="left" />
      <Rail side="right" />
    </>
  );
}
