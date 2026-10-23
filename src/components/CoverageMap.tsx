import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useGesture } from "@use-gesture/react";
import { Minus, Plus, RotateCcw, ZoomIn } from "lucide-react";
import GestureHint from "./GestureHint";
import Lines, { Rise } from "./Lines";
import { waLink } from "../lib";

// Pontos ilustrativos — trocar pelos bairros/cidades realmente atendidos
const nodes = [
  { id: "central", x: 400, y: 250, label: "Central INET", main: true },
  { id: "centro", x: 300, y: 180, label: "Centro" },
  { id: "norte", x: 420, y: 95, label: "Bairro Norte" },
  { id: "leste", x: 600, y: 210, label: "Bairro Leste" },
  { id: "sul", x: 470, y: 400, label: "Bairro Sul" },
  { id: "oeste", x: 170, y: 300, label: "Bairro Oeste" },
  { id: "distrito", x: 690, y: 380, label: "Distrito" },
  { id: "rural", x: 110, y: 120, label: "Zona Rural" },
];
const links = [["central", "centro"], ["central", "norte"], ["central", "leste"], ["central", "sul"], ["centro", "oeste"], ["leste", "distrito"], ["centro", "rural"], ["sul", "distrito"], ["norte", "rural"]];
const byId = Object.fromEntries(nodes.map((n) => [n.id, n]));
const MIN = 1, MAX = 3.5;

// "luzes da cidade": pontinhos piscando ao redor de cada bairro (gerados uma vez, com semente fixa)
let seed = 7;
const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
const cityLights = nodes.flatMap((n) =>
  Array.from({ length: n.main ? 26 : 16 }, () => {
    const a = rnd() * Math.PI * 2, r = 8 + rnd() * (n.main ? 70 : 50);
    return { x: n.x + Math.cos(a) * r, y: n.y + Math.sin(a) * r * 0.75, r: 0.8 + rnd() * 1.4, dur: 1.5 + rnd() * 3, lime: rnd() < 0.35 };
  }),
);

/**
 * Mapa da rede com gestos de transformação (como o TransformGesture do Gestouch):
 * pinça = zoom, arrastar = mover, duplo toque = aproximar, Ctrl+roda/trackpad = zoom.
 */
export default function CoverageMap() {
  const boxRef = useRef<HTMLDivElement>(null);
  const [hint, setHint] = useState(true);
  const [active, setActive] = useState<string | null>("central");
  const s = useMotionValue(1), tx = useMotionValue(0), ty = useMotionValue(0);
  const scale = useSpring(s, { stiffness: 180, damping: 26 });
  const x = useSpring(tx, { stiffness: 180, damping: 26 });
  const y = useSpring(ty, { stiffness: 180, damping: 26 });

  const clampPan = (nx: number, ny: number, sc = s.get()) => {
    const r = boxRef.current!.getBoundingClientRect();
    const mx = ((sc - 1) * r.width) / 2, my = ((sc - 1) * r.height) / 2;
    return [Math.max(-mx, Math.min(mx, nx)), Math.max(-my, Math.min(my, ny))];
  };
  const zoomTo = (target: number) => {
    const sc = Math.max(MIN, Math.min(MAX, target));
    s.set(sc);
    const [nx, ny] = clampPan(tx.get(), ty.get(), sc);
    tx.set(nx);
    ty.set(ny);
    setHint(false);
  };

  useGesture(
    {
      onDrag: ({ offset: [ox, oy], tap, event, pinching, cancel }) => {
        if (pinching) return cancel();
        if (tap) {
          // duplo toque: alterna entre aproximar e afastar
          const now = performance.now();
          const el = boxRef.current as HTMLDivElement & { _lastTap?: number };
          if (el._lastTap && now - el._lastTap < 320) {
            zoomTo(s.get() > 1.5 ? 1 : 2.2);
            if (s.get() === 1) (tx.set(0), ty.set(0));
          }
          el._lastTap = now;
          (event.target as Element).closest("[data-node-id]") &&
            setActive((event.target as Element).closest("[data-node-id]")!.getAttribute("data-node-id"));
          return;
        }
        const [nx, ny] = clampPan(ox, oy);
        tx.set(nx);
        ty.set(ny);
        setHint(false);
      },
      onPinch: ({ offset: [d] }) => zoomTo(d),
    },
    {
      target: boxRef,
      drag: { from: () => [tx.get(), ty.get()], filterTaps: true, pointer: { touch: true } },
      pinch: { scaleBounds: { min: MIN, max: MAX }, rubberband: true, from: () => [s.get(), 0] },
      eventOptions: { passive: false },
    },
  );

  const reset = () => {
    s.set(1);
    tx.set(0);
    ty.set(0);
  };
  const act = active ? byId[active] : null;

  return (
    <section id="cobertura" className="relative py-32">
      <span data-node="left" className="absolute top-12" />
      <span data-node="left" className="absolute bottom-12" />
      <div className="wrap">
        <Rise><p className="tag">03 — Cobertura</p></Rise>
        <div className="mt-5 flex flex-wrap items-end justify-between gap-6">
          <Lines className="h-lg" lines={["Explore a", <span className="italic text-lime">nossa rede.</span>]} />
          <p className="max-w-xs text-sm text-white/60">Aproxime, arraste e toque nos pontos. Não achou seu bairro? Fale com a gente.</p>
        </div>

        <Rise delay={0.15} className="relative mt-12">
          <div
            ref={boxRef}
            className="relative h-[58vh] min-h-[360px] cursor-grab overflow-hidden rounded-[2rem] border border-white/15 bg-navy-ink active:cursor-grabbing"
            style={{ touchAction: "none" }}
          >
            <motion.svg style={{ scale, x, y }} viewBox="0 0 800 500" className="h-full w-full select-none" preserveAspectRatio="xMidYMid meet">
              <defs>
                <pattern id="map-grid" width="25" height="25" patternUnits="userSpaceOnUse">
                  <path d="M25 0H0V25" fill="none" stroke="rgba(255,255,255,0.05)" />
                </pattern>
                <radialGradient id="map-glow">
                  <stop offset="0" stopColor="#0062EC" stopOpacity="0.35" />
                  <stop offset="1" stopColor="#0062EC" stopOpacity="0" />
                </radialGradient>
              </defs>
              <rect x="-400" y="-250" width="1600" height="1000" fill="url(#map-grid)" />
              <circle cx="400" cy="250" r="320" fill="url(#map-glow)" />
              {cityLights.map((l, i) => (
                <circle key={i} cx={l.x} cy={l.y} r={l.r} fill={l.lime ? "#70E000" : "#FFE9A8"}>
                  <animate attributeName="opacity" values="0.15;0.9;0.15" dur={`${l.dur}s`} repeatCount="indefinite" />
                </circle>
              ))}
              {links.map(([a, b], i) => {
                const A = byId[a], B = byId[b];
                const d = `M${A.x} ${A.y} Q ${(A.x + B.x) / 2 + (i % 2 ? 30 : -30)} ${(A.y + B.y) / 2 - 25} ${B.x} ${B.y}`;
                return (
                  <g key={i}>
                    <path d={d} fill="none" stroke="rgba(92,200,255,0.35)" strokeWidth="1.5" />
                    <circle r="3.5" fill="#70E000" style={{ filter: "drop-shadow(0 0 5px #70E000)" }}>
                      <animateMotion dur={`${3 + (i % 3)}s`} begin={`${i * 0.4}s`} repeatCount="indefinite" path={d} />
                    </circle>
                  </g>
                );
              })}
              {nodes.map((n) => (
                <g key={n.id} data-node-id={n.id} className="cursor-pointer">
                  <circle cx={n.x} cy={n.y} r="22" fill="transparent" />
                  <circle cx={n.x} cy={n.y} r={n.main ? 14 : 10} fill="rgba(112,224,0,0.15)">
                    <animate attributeName="r" values={n.main ? "12;22;12" : "8;15;8"} dur="3s" repeatCount="indefinite" />
                  </circle>
                  <circle cx={n.x} cy={n.y} r={n.main ? 6 : 4.5} fill={active === n.id ? "#70E000" : "#fff"} />
                  <text x={n.x} y={n.y - 18} textAnchor="middle" fill="rgba(255,255,255,0.75)" fontSize="11" fontFamily="Poppins">
                    {n.label}
                  </text>
                </g>
              ))}
            </motion.svg>

            {/* controles para mouse/teclado */}
            <div className="absolute right-4 top-4 flex flex-col gap-2">
              {[[Plus, "Aproximar", () => zoomTo(s.get() + 0.6)], [Minus, "Afastar", () => zoomTo(s.get() - 0.6)], [RotateCcw, "Centralizar", reset]].map(([Icon, label, fn]) => {
                const I = Icon as typeof Plus;
                return (
                  <button key={label as string} onClick={fn as () => void} aria-label={label as string} className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-navy-ink/70 backdrop-blur transition-colors duration-500 hover:border-lime hover:text-lime">
                    <I size={16} />
                  </button>
                );
              })}
            </div>

            {act && (
              <motion.div
                key={act.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="absolute bottom-4 left-4 flex items-center gap-4 rounded-2xl border border-white/15 bg-navy-ink/80 px-5 py-3 backdrop-blur-md"
              >
                <span className="h-2.5 w-2.5 rounded-full bg-lime shadow-[0_0_10px_#70E000]" />
                <span className="text-sm"><strong className="font-semibold">{act.label}</strong> · fibra disponível</span>
                <a href={waLink(`Olá! Quero internet INET em: ${act.label}`)} target="_blank" rel="noreferrer" className="text-sm font-semibold text-lime">Assinar →</a>
              </motion.div>
            )}
            <GestureHint icon={ZoomIn} kind="pinch" label="Pinça ou Ctrl + roda para aproximar" visible={hint} className="absolute left-4 top-4" />
          </div>
        </Rise>
      </div>
    </section>
  );
}
