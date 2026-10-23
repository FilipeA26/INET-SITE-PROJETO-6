import { useEffect, useRef, useState } from "react";
import { animate, motion, useMotionValue, useTransform, type MotionValue } from "framer-motion";
import { useDrag } from "@use-gesture/react";
import { ArrowLeft, ArrowRight, Check, Hand, MoveHorizontal, Plus } from "lucide-react";
import GestureHint from "./GestureHint";
import MeshCanvas from "./MeshCanvas";
import { DUR, EASE } from "../motion";
import { PLAN_GROUPS, waLink, type Plan } from "../data/inet";

const SPRING_SNAP = { type: "spring" as const, stiffness: 140, damping: 24, mass: 0.9 };
const HOLD_MS = 550;

/**
 * Planos com gestos: deslizar troca, segurar vira o card (detalhes),
 * toque duplo escolhe. Botões e teclado fazem o mesmo para quem não usa toque.
 */
export default function PlanCarousel({
  groups = ["principais"],
  selected,
  onSelect,
}: {
  groups?: string[];
  selected?: Plan | null;
  onSelect?: (p: Plan) => void;
}) {
  const list = PLAN_GROUPS.filter((g) => groups.includes(g.id));
  const [group, setGroup] = useState(list[0].id);
  const plans = list.find((g) => g.id === group)!.plans;
  const viewRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState<string | null>(null);
  const [hints, setHints] = useState({ swipe: true, hold: true });
  const x = useMotionValue(0);
  const [step, setStep] = useState(340);

  useEffect(() => {
    const measure = () => setStep(Math.min(380, (viewRef.current?.clientWidth ?? 340) * 0.82));
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useEffect(() => {
    setIndex(Math.min(1, plans.length - 1));
    setFlipped(null);
  }, [group, plans.length]);

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
      if (vx > 0.4 || Math.abs(mx) > step * 0.25) {
        go(index - Math.sign(mx || -dx));
        setHints((h) => ({ ...h, swipe: false }));
      } else animate(x, -index * step, SPRING_SNAP);
    },
    { axis: "x", filterTaps: true, rubberband: 0.18, pointer: { touch: true } },
  );

  return (
    <div>
      {list.length > 1 && (
        <div role="tablist" aria-label="Categorias de planos" className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-2 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0">
          {list.map((g) => (
            <button
              key={g.id}
              role="tab"
              aria-selected={group === g.id}
              onClick={() => setGroup(g.id)}
              className={`min-h-[44px] shrink-0 rounded-full border px-5 text-sm transition-colors duration-500 ${group === g.id ? "border-lime bg-lime text-navy-ink" : "border-white/15 text-white/70 hover:border-white/40 hover:text-white"}`}
            >
              {g.label}
            </button>
          ))}
        </div>
      )}

      {/* painel mais claro com a malha animada atrás dos cards escuros */}
      <div className="relative mt-8 overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,#021A4A_0%,#010C22_55%,#02163D_100%)] py-10 sm:rounded-[2.5rem] sm:py-14">
        <MeshCanvas className="absolute inset-0 h-full w-full opacity-70 [filter:blur(1.2px)]" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent to-navy-ink/40" />
        <div
          ref={viewRef}
          className="relative cursor-grab select-none active:cursor-grabbing"
          style={{ touchAction: "pan-y" }}
          {...bind()}
          aria-roledescription="carrossel"
          aria-label="Planos"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "ArrowRight") go(index + 1);
            if (e.key === "ArrowLeft") go(index - 1);
          }}
        >
          <motion.div style={{ x, paddingLeft: `calc(50% - ${step / 2}px)` }} className="flex">
            {plans.map((p, i) => (
              <Card
                key={p.id}
                i={i}
                x={x}
                step={step}
                plan={p}
                active={i === index}
                flipped={flipped === p.id}
                chosen={selected?.id === p.id}
                onTap={() => go(i)}
                onHold={() => {
                  setFlipped((f) => (f === p.id ? null : p.id));
                  setHints((h) => ({ ...h, hold: false }));
                }}
                onDouble={() => onSelect?.(p)}
              />
            ))}
          </motion.div>
        </div>

        <div className="relative mt-8 flex flex-col items-center gap-5 px-4">
          <div className="flex items-center gap-3">
            <button onClick={() => go(index - 1)} disabled={index === 0} aria-label="Plano anterior" className="btn-ghost h-11 w-11 p-0 disabled:opacity-30"><ArrowLeft size={18} /></button>
            <div className="flex gap-2">
              {plans.map((p, i) => (
                <button key={p.id} onClick={() => go(i)} aria-label={`${p.name}`} aria-current={i === index} className="flex h-6 items-center">
                  <span className={`block h-1.5 rounded-full transition-all duration-700 ${i === index ? "w-10 bg-lime" : "w-4 bg-white/30"}`} />
                </button>
              ))}
            </div>
            <button onClick={() => go(index + 1)} disabled={index === plans.length - 1} aria-label="Próximo plano" className="btn-ghost h-11 w-11 p-0 disabled:opacity-30"><ArrowRight size={18} /></button>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            <GestureHint icon={MoveHorizontal} kind="swipe" label="Deslize para trocar" visible={hints.swipe} />
            <GestureHint icon={Hand} kind="hold" label="Segure para detalhes · toque 2x para escolher" visible={hints.hold} />
          </div>
        </div>
      </div>
      <p className="mt-5 text-xs leading-relaxed text-white/45">
        Valores e benefícios conforme publicados no site anterior da INET. Sujeitos a alteração e à viabilidade técnica no endereço: confirme as condições atuais com o atendimento antes de contratar.
      </p>
    </div>
  );
}

function Card({
  i, x, step, plan, active, flipped, chosen, onTap, onHold, onDouble,
}: {
  i: number; x: MotionValue<number>; step: number; plan: Plan; active: boolean; flipped: boolean; chosen: boolean;
  onTap: () => void; onHold: () => void; onDouble: () => void;
}) {
  const dist = useTransform(x, (v) => Math.min(1, Math.abs(v + i * step) / step));
  const scale = useTransform(dist, [0, 1], [1, 0.88]);
  const opacity = useTransform(dist, [0, 1], [1, 0.45]);
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
    <motion.div style={{ scale, opacity, width: step }} className="shrink-0 px-2.5 [perspective:1400px]" aria-hidden={!active}>
      <motion.div
        onPointerDown={down}
        onPointerUp={up}
        onPointerMove={(e) => (e.movementX ** 2 + e.movementY ** 2 > 9 ? ((moved.current = true), clearTimeout(timer.current), setHolding(false)) : null)}
        onPointerLeave={() => (clearTimeout(timer.current), setHolding(false))}
        animate={{ rotateY: flipped ? 180 : 0, scale: holding ? 0.97 : 1 }}
        transition={{ duration: DUR, ease: EASE }}
        className="relative h-[520px] [transform-style:preserve-3d]"
      >
        {/* frente */}
        <div className={`absolute inset-0 flex flex-col rounded-[1.75rem] border p-7 [backface-visibility:hidden] ${chosen ? "border-lime bg-[#020F2E]/95 shadow-[0_0_60px_-20px_rgba(112,224,0,0.8)]" : "border-white/10 bg-[#020F2E]/90 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.8)]"}`}>
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">{plan.name}</h3>
            {chosen && <span className="text-xs font-semibold uppercase tracking-[0.18em] text-lime">Escolhido</span>}
          </div>
          <p className="mt-6 font-display text-7xl font-light leading-none">
            {plan.speed}
            <span className="ml-2 text-2xl text-lime">{plan.unit}</span>
          </p>
          {plan.extra && <p className="mt-2 font-display text-lg text-[#5CC8FF]">{plan.extra}</p>}
          <p className="mt-6 font-display text-3xl">
            {plan.price ? <>R$ {plan.price}<span className="text-sm text-white/45"> /mês</span></> : <span className="text-2xl text-white/80">Consulte</span>}
          </p>
          <ul className="mt-5 flex flex-wrap gap-1.5">
            {plan.includes.slice(0, 4).map((inc) => (
              <li key={inc} className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-white/80">
                <Plus size={10} aria-hidden="true" className="text-lime" /> {inc}
              </li>
            ))}
          </ul>
          <ul className="mt-auto space-y-2 pt-5 text-sm text-white/75">
            {plan.perks.map((perk) => (
              <li key={perk} className="flex items-center gap-2.5"><Check size={14} aria-hidden="true" className="text-lime" /> {perk}</li>
            ))}
          </ul>
          <a
            href={waLink(`Olá! Quero saber se o plano ${plan.name} (${plan.speed} ${plan.unit}) está disponível no meu endereço.`)}
            target="_blank"
            rel="noreferrer"
            tabIndex={active ? 0 : -1}
            onPointerDown={(e) => e.stopPropagation()}
            className="btn-lime mt-6 w-full"
          >
            Quero este plano
          </a>
          <svg className="pointer-events-none absolute right-5 top-5 h-8 w-8 -rotate-90" viewBox="0 0 32 32" aria-hidden="true">
            <motion.circle
              cx="16" cy="16" r="13" fill="none" stroke="#70E000" strokeWidth="2" strokeLinecap="round"
              initial={false}
              animate={{ pathLength: holding ? 1 : 0, opacity: holding ? 1 : 0 }}
              transition={{ duration: holding ? HOLD_MS / 1000 : 0.3, ease: "linear" }}
            />
          </svg>
        </div>
        {/* verso: detalhes */}
        <div className="absolute inset-0 flex flex-col rounded-[1.75rem] border border-lime/50 bg-navy-ink p-7 [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <span className="text-xs uppercase tracking-[0.2em] text-lime">{plan.name}</span>
          <p className="mt-5 font-display text-xl font-light leading-snug">{plan.description}</p>
          <ul className="mt-6 space-y-3 text-sm text-white/80">
            {plan.includes.map((d) => (
              <li key={d} className="flex gap-2.5 border-b border-white/10 pb-3"><Plus size={14} aria-hidden="true" className="mt-0.5 shrink-0 text-lime" /> {d}</li>
            ))}
          </ul>
          {plan.note && <p className="mt-4 text-xs text-white/55">{plan.note}</p>}
          <p className="mt-auto text-xs text-white/45">Segure de novo para voltar</p>
        </div>
      </motion.div>
    </motion.div>
  );
}
