import { useEffect, useRef, useState } from "react";
import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { useDrag } from "@use-gesture/react";
import { ArrowRight, Check } from "lucide-react";
import { waLink, type Plan } from "../data/inet";

const KNOB = 64;
const SPRING_BACK = { type: "spring" as const, stiffness: 260, damping: 26 };

/**
 * "Deslize para assinar": só confirma depois de 85% do trilho; soltando antes,
 * volta com mola. Enter/Espaço no teclado também confirmam.
 * Abre o WhatsApp oficial com o plano escolhido na mensagem.
 */
export default function SlideToSubscribe({ plan }: { plan: Plan | null }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [max, setMax] = useState(300);
  const [done, setDone] = useState(false);
  const x = useMotionValue(0);
  const fill = useTransform(x, (v) => v + KNOB);
  const labelOpacity = useTransform(x, [0, max * 0.5], [1, 0]);
  const msg = plan
    ? `Olá! Quero contratar o plano ${plan.name} (${plan.speed} ${plan.unit}, R$ ${plan.price}/mês). Pode verificar a disponibilidade no meu endereço?`
    : "Olá! Quero contratar a internet fibra da INET. Pode me ajudar a escolher um plano?";

  useEffect(() => {
    const m = () => setMax((trackRef.current?.clientWidth ?? 380) - KNOB - 8);
    m();
    window.addEventListener("resize", m);
    return () => window.removeEventListener("resize", m);
  }, []);

  const complete = () => {
    setDone(true);
    animate(x, max, SPRING_BACK);
    window.open(waLink(msg), "_blank", "noreferrer");
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
    <div>
      <p className="text-center text-sm text-white/65">
        {plan ? (
          <>Plano escolhido: <strong className="text-white">{plan.name}</strong> · {plan.speed} {plan.unit} · R$ {plan.price}/mês</>
        ) : (
          <>Toque duas vezes em um plano para escolhê-lo, ou fale direto com a gente.</>
        )}
      </p>
      <div ref={trackRef} className="relative mx-auto mt-6 h-[72px] max-w-md overflow-hidden rounded-full border border-white/15 bg-navy-ink/80 p-1" style={{ touchAction: "pan-y" }}>
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
          aria-label={plan ? `Assinar o plano ${plan.name} pelo WhatsApp` : "Falar com a INET pelo WhatsApp"}
          className="relative z-10 flex h-16 cursor-grab items-center justify-center rounded-full bg-lime text-navy-ink shadow-lg active:cursor-grabbing"
        >
          {done ? <Check size={22} /> : <ArrowRight size={22} />}
        </motion.button>
      </div>
    </div>
  );
}
