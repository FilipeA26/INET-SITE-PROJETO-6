import { useEffect, useRef, useState } from "react";
import { animate, motion, useMotionValue, useTransform, type MotionValue } from "framer-motion";
import { useDrag } from "@use-gesture/react";
import { ArrowLeft, ArrowRight, Check, Hand, MoveHorizontal } from "lucide-react";
import GestureHint from "./GestureHint";
import MeshCanvas from "./MeshCanvas";
import Lines, { Rise } from "./Lines";
import { DUR, EASE } from "../motion";

// Valores provisórios — trocar pelos planos reais da INET
export const plans = [
  { speed: "400", unit: "Mega", price: "89,90", perks: ["Wi-Fi 6", "Instalação grátis", "Sem franquia"], ideal: "Para casas conectadas", details: ["Até 6 aparelhos ao mesmo tempo", "Streaming em Full HD", "Suporte pelo WhatsApp"] },
  { speed: "700", unit: "Mega", price: "109,90", perks: ["Wi-Fi 6", "Instalação grátis", "Sem franquia"], ideal: "Mais escolhido", details: ["Até 12 aparelhos ao mesmo tempo", "Streaming em 4K e jogos", "Suporte prioritário"] },
  { speed: "1", unit: "Giga", price: "149,90", perks: ["Wi-Fi 6 mesh", "Instalação grátis", "Sem franquia"], ideal: "Para home office e famílias", details: ["Aparelhos sem limite prático", "Upload alto para chamadas", "Suporte VIP"] },
];

const SPRING_SNAP = { type: "spring" as const, stiffness: 140, damping: 24, mass: 0.9 };
const HOLD_MS = 550;

/**
 * Carrossel de planos com gestos:
 * - swipe/arraste horizontal (com inércia e elástico nas pontas) troca de plano;
 * - segurar (long press) vira o card e mostra os detalhes;
 * - duplo toque escolhe o plano (usado no "deslize para assinar").
 */
export default function PlanCarousel({ selected, onSelect }: { selected: number; onSelect: (i: number) => void }) {
  const viewRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(1);
  const [flipped, setFlipped] = useState<number | null>(null);
  const [hints, setHints] = useState({ swipe: true, hold: true });
  const x = useMotionValue(0);
  const [step, setStep] = useState(360);

  useEffect(() => {
    const measure = () => {
      const w = viewRef.current?.clientWidth ?? 360;
      setStep(Math.min(420, w * 0.78));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useEffect(() => {
    const c = animate(x, -index * step, SPRING_SNAP);
    return () => c.stop();
  }, [index, step, x]);

  const go = (i: number) => setIndex(Math.max(0, Math.min(plans.length - 1, i)));

  const bind = useDrag(
    ({ active, movement: [mx], velocity: [vx], direction: [dx], cancel, tap }) => {
      if (tap) return;
      if (active) {
        x.set(-index * step + mx);
        if (Math.abs(mx) > step * 0.6) cancel();
        return;
      }
      // swipe: velocidade alta ou arraste longo trocam de plano
      const swipe = vx > 0.4 || Math.abs(mx) > step * 0.25;
      if (swipe) {
        go(index - Math.sign(mx || -dx));
        setHints((h) => ({ ...h, swipe: false }));
      } else animate(x, -index * step, SPRING_SNAP);
    },
    { axis: "x", filterTaps: true, rubberband: 0.18, pointer: { touch: true } },
  );

  return (
    <section id="planos" className="relative overflow-hidden py-32">
      <span data-node="left" className="absolute top-12" />
      <span data-node="left" className="absolute bottom-12" />
      <div className="wrap">
        <Rise>
          <p className="tag">01 — Planos</p>
        </Rise>
        <div className="mt-5 flex flex-wrap items-end justify-between gap-6">
          <Lines className="h-lg" lines={["Deslize e", "escolha."]} />
          <div className="flex items-center gap-2">
            <button onClick={() => go(index - 1)} aria-label="Plano anterior" className="btn-ghost h-12 w-12 p-0"><ArrowLeft size={18} /></button>
            <button onClick={() => go(index + 1)} aria-label="Próximo plano" className="btn-ghost h-12 w-12 p-0"><ArrowRight size={18} /></button>
          </div>
        </div>
      </div>

      {/* painel mais claro com a malha animada (ref. Projeto 3) atrás dos cards escuros */}
      <div className="relative mx-8 mt-14 overflow-hidden rounded-[2.5rem] border border-white/10 bg-[linear-gradient(135deg,#003F99_0%,#03256C_55%,#0a4fc4_100%)] py-14 sm:mx-20">
        <MeshCanvas className="absolute inset-0 h-full w-full opacity-70 [filter:blur(1.2px)]" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-navy-ink/40" />
      <div ref={viewRef} className="relative cursor-grab select-none active:cursor-grabbing" style={{ touchAction: "pan-y" }} {...bind()}>
        <motion.div style={{ x, paddingLeft: `calc(50% - ${step / 2}px)` }} className="flex gap-0">
          {plans.map((p, i) => (
            <Card
              key={p.speed + p.unit}
              i={i}
              x={x}
              step={step}
              plan={p}
              flipped={flipped === i}
              chosen={selected === i}
              onTap={() => go(i)}
              onHold={() => {
                setFlipped((f) => (f === i ? null : i));
                setHints((h) => ({ ...h, hold: false }));
              }}
              onDouble={() => onSelect(i)}
            />
          ))}
        </motion.div>
      </div>

      <div className="wrap relative mt-10 flex flex-col items-center gap-5">
        <div className="flex gap-2" role="tablist" aria-label="Planos">
          {plans.map((p, i) => (
            <button
              key={p.speed + p.unit}
              role="tab"
              aria-selected={i === index}
              aria-label={`${p.speed} ${p.unit}`}
              onClick={() => go(i)}
              className={`h-1.5 rounded-full transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${i === index ? "w-10 bg-lime" : "w-4 bg-white/25"}`}
            />
          ))}
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          <GestureHint icon={MoveHorizontal} kind="swipe" label="Deslize para trocar" visible={hints.swipe} />
          <GestureHint icon={Hand} kind="hold" label="Segure para ver detalhes · toque 2x para escolher" visible={hints.hold} />
        </div>
      </div>
      </div>
    </section>
  );
}

function Card({
  i, x, step, plan, flipped, chosen, onTap, onHold, onDouble,
}: {
  i: number; x: MotionValue<number>; step: number; plan: (typeof plans)[number]; flipped: boolean; chosen: boolean;
  onTap: () => void; onHold: () => void; onDouble: () => void;
}) {
  // cards distantes do centro encolhem e esmaecem — tudo derivado da mesma posição x
  const dist = useTransform(x, (v) => Math.min(1, Math.abs(v + i * step) / step));
  const scale = useTransform(dist, [0, 1], [1, 0.86]);
  const opacity = useTransform(dist, [0, 1], [1, 0.4]);
  const [holding, setHolding] = useState(false);
  const timer = useRef<number>();
  const lastTap = useRef(0);
  const moved = useRef(false);

  const down = () => {
    moved.current = false;
    setHolding(true);
    timer.current = window.setTimeout(() => {
      setHolding(false);
      if (!moved.current) onHold();
    }, HOLD_MS);
  };
  const up = () => {
    clearTimeout(timer.current);
    if (holding && !moved.current) {
      const now = performance.now();
      if (now - lastTap.current < 320) onDouble();
      else onTap();
      lastTap.current = now;
    }
    setHolding(false);
  };

  return (
    <motion.div style={{ scale, opacity, width: step }} className="shrink-0 px-3 [perspective:1400px]">
      <motion.div
        onPointerDown={down}
        onPointerUp={up}
        onPointerMove={(e) => (e.movementX ** 2 + e.movementY ** 2 > 9 ? ((moved.current = true), clearTimeout(timer.current), setHolding(false)) : null)}
        onPointerLeave={() => (clearTimeout(timer.current), setHolding(false))}
        animate={{ rotateY: flipped ? 180 : 0, scale: holding ? 0.97 : 1 }}
        transition={{ duration: DUR, ease: EASE }}
        className="relative h-[440px] [transform-style:preserve-3d]"
      >
        {/* frente */}
        <div className={`absolute inset-0 flex flex-col rounded-[2rem] border p-8 [backface-visibility:hidden] ${chosen ? "border-lime bg-[#020F2E]/95 shadow-[0_0_60px_-20px_rgba(112,224,0,0.8)]" : "border-white/10 bg-[#020F2E]/90 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.8)]"}`}>
          <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em]">
            <span className="text-white/50">{plan.ideal}</span>
            {chosen && <span className="font-semibold text-lime">Escolhido</span>}
          </div>
          <p className="mt-10 font-display text-8xl font-light leading-none">
            {plan.speed}
            <span className="ml-2 text-2xl text-lime">{plan.unit}</span>
          </p>
          <p className="mt-8 font-display text-3xl">
            R$ {plan.price}<span className="text-sm text-white/45"> /mês</span>
          </p>
          <ul className="mt-auto space-y-2.5 text-sm text-white/70">
            {plan.perks.map((perk) => (
              <li key={perk} className="flex items-center gap-2.5"><Check size={14} className="text-lime" /> {perk}</li>
            ))}
          </ul>
          {/* anel de progresso do "segurar" */}
          <svg className="pointer-events-none absolute right-6 top-6 h-8 w-8 -rotate-90" viewBox="0 0 32 32" aria-hidden="true">
            <motion.circle
              cx="16" cy="16" r="13" fill="none" stroke="#70E000" strokeWidth="2" strokeLinecap="round"
              initial={false}
              animate={{ pathLength: holding ? 1 : 0, opacity: holding ? 1 : 0 }}
              transition={{ duration: holding ? HOLD_MS / 1000 : 0.3, ease: "linear" }}
            />
          </svg>
        </div>
        {/* verso: detalhes */}
        <div className="absolute inset-0 flex flex-col rounded-[2rem] border border-lime/50 bg-navy-ink p-8 [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <span className="text-xs uppercase tracking-[0.2em] text-lime">Detalhes · {plan.speed} {plan.unit}</span>
          <ul className="mt-8 space-y-5">
            {plan.details.map((d) => (
              <li key={d} className="border-b border-white/10 pb-5 font-display text-xl font-light">{d}</li>
            ))}
          </ul>
          <p className="mt-auto text-xs text-white/45">Segure de novo para voltar · toque 2x para escolher</p>
        </div>
      </motion.div>
    </motion.div>
  );
}
