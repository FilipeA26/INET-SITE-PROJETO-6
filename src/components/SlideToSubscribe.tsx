import { useEffect, useRef, useState } from "react";
import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { useDrag } from "@use-gesture/react";
import { ArrowRight, Check } from "lucide-react";
import Lines, { Rise } from "./Lines";
import { plans } from "./PlanCarousel";
import { waLink } from "../lib";

const KNOB = 64;
const SPRING_BACK = { type: "spring" as const, stiffness: 260, damping: 26 };

/**
 * "Deslize para assinar": o gesto só é reconhecido depois de 85% do trilho
 * (como um swipe com limiar); soltando antes, o botão volta com mola.
 */
export default function SlideToSubscribe({ selected }: { selected: number }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [max, setMax] = useState(300);
  const [done, setDone] = useState(false);
  const x = useMotionValue(0);
  const fill = useTransform(x, (v) => v + KNOB);
  const labelOpacity = useTransform(x, [0, max * 0.5], [1, 0]);
  const plan = plans[selected];

  useEffect(() => {
    const m = () => setMax((trackRef.current?.clientWidth ?? 380) - KNOB - 8);
    m();
    window.addEventListener("resize", m);
    return () => window.removeEventListener("resize", m);
  }, []);

  const complete = () => {
    setDone(true);
    animate(x, max, SPRING_BACK);
    window.open(waLink(`Olá! Quero assinar o plano de ${plan.speed} ${plan.unit} da INET.`), "_blank", "noreferrer");
    window.setTimeout(() => {
      setDone(false);
      animate(x, 0, SPRING_BACK);
    }, 2400);
  };

  const bind = useDrag(
    ({ active, offset: [ox] }) => {
      if (done) return;
      if (active) x.set(ox);
      else if (ox > max * 0.85) complete();
      else animate(x, 0, SPRING_BACK);
    },
    { axis: "x", bounds: { left: 0, right: max }, rubberband: 0.12, from: () => [x.get(), 0], pointer: { touch: true } },
  );

  return (
    <section id="assinar" className="relative py-32 text-white">
      <span data-node="right" className="absolute top-12" />
      <span data-node="right" className="absolute bottom-12" />
      <div className="wrap text-center">
        <Rise><p className="tag">04 — Assinar</p></Rise>
        <Lines className="h-lg mx-auto mt-5" lines={["Pronto para", <span className="italic text-lime">ligar a luz?</span>]} />
        <Rise delay={0.2}>
          <p className="mt-5 text-white/65">
            Plano escolhido: <strong>{plan.speed} {plan.unit}</strong> · R$ {plan.price}/mês
            <a href="#planos" className="ml-2 underline underline-offset-4">trocar</a>
          </p>
        </Rise>

        <Rise delay={0.3}>
          <div ref={trackRef} className="relative mx-auto mt-10 h-[72px] max-w-md overflow-hidden rounded-full border border-white/15 bg-navy-ink/80 p-1 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.9)]" style={{ touchAction: "pan-y" }}>
            <motion.div style={{ width: fill }} className="absolute inset-y-1 left-1 rounded-full bg-gradient-to-r from-electric to-lime/80" />
            <motion.span style={{ opacity: done ? 0 : labelOpacity }} className="pointer-events-none absolute inset-0 flex items-center justify-center pl-12 text-sm font-semibold text-white">
              Deslize para assinar
            </motion.span>
            {done && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pointer-events-none absolute inset-0 flex items-center justify-center pr-12 text-sm font-semibold text-navy-ink">
                Abrindo o WhatsApp…
              </motion.span>
            )}
            <motion.button
              {...(bind() as object)}
              style={{ x, width: KNOB, touchAction: "none" }}
              onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), complete())}
              aria-label={`Assinar o plano de ${plan.speed} ${plan.unit}`}
              className="relative z-10 flex h-16 cursor-grab items-center justify-center rounded-full bg-lime text-navy shadow-lg active:cursor-grabbing"
            >
              {done ? <Check size={22} /> : <ArrowRight size={22} />}
            </motion.button>
          </div>
        </Rise>
      </div>
    </section>
  );
}
