import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { Router, Share2, Smartphone } from "lucide-react";
import Lines, { Rise } from "./Lines";
import { DUR, EASE } from "../motion";

/*
 * Planta baixa (vista de cima) em coordenadas do SVG 1000 x 560.
 * O sinal de cada ponto é calculado de verdade: perde força com a distância
 * e a cada parede que a linha reta até o roteador/ponto Mesh atravessa.
 */

type Pt = [number, number];
type Mode = "single" | "mesh";
type Room = { name: string; poly: Pt[]; label: Pt };

const RANGE = 600; // alcance em unidades do desenho
const WALL_LOSS = 0.25; // perda por parede atravessada

const OUTER: Pt[] = [[60, 110], [480, 110], [480, 40], [900, 40], [900, 520], [60, 520]];

// paredes internas; os vãos entre segmentos são as portas
const WALLS: [number, number, number, number][] = [
  [360, 110, 360, 190], [360, 240, 360, 320], [360, 375, 360, 520], // quartos | corredor
  [60, 300, 280, 300], [330, 300, 360, 300], // quarto 1 | quarto 2
  [360, 390, 400, 390], [440, 390, 490, 390], [530, 390, 560, 390], // corredor | banheiros
  [470, 390, 470, 520], [560, 390, 560, 520], // entre banheiros | banheiro e sala
  [480, 110, 480, 200], [480, 250, 480, 300], // corredor | cozinha
  [480, 300, 500, 300], [580, 300, 900, 300], // cozinha | sala
  [720, 40, 720, 180], [720, 230, 720, 300], // cozinha | varanda
];

const ROOMS: Room[] = [
  { name: "Quarto 1", poly: [[60, 110], [360, 110], [360, 300], [60, 300]], label: [210, 150] },
  { name: "Quarto 2", poly: [[60, 300], [360, 300], [360, 520], [60, 520]], label: [210, 480] },
  { name: "Corredor", poly: [[360, 110], [480, 110], [480, 300], [560, 300], [560, 390], [360, 390]], label: [420, 150] },
  { name: "Banheiro", poly: [[360, 390], [470, 390], [470, 520], [360, 520]], label: [415, 490] },
  { name: "Lavabo", poly: [[470, 390], [560, 390], [560, 520], [470, 520]], label: [515, 490] },
  { name: "Cozinha", poly: [[480, 40], [720, 40], [720, 300], [480, 300]], label: [600, 80] },
  { name: "Varanda", poly: [[720, 40], [900, 40], [900, 300], [720, 300]], label: [810, 80] },
  { name: "Sala", poly: [[560, 300], [900, 300], [900, 520], [560, 520]], label: [790, 350] },
];

const ROUTER: Pt = [300, 262];
const MESH_NODES: Pt[] = [[470, 345], [640, 232]];

// caminho do celular pelas portas da casa (fecha o ciclo)
const WALK: Pt[] = [
  [200, 205], [330, 215], [420, 215], [420, 330], [540, 345], [540, 250], [640, 150], [700, 205], [800, 205], [830, 130],
  [800, 205], [700, 205], [600, 262], [540, 330], [680, 420], [840, 462], [680, 420], [540, 345], [420, 345], [420, 445],
  [420, 345], [330, 348], [200, 430], [330, 348], [420, 330], [420, 215], [330, 215],
];
const SPEED = 105; // unidades por segundo

/* ---------- geometria ---------- */

function crosses(a: Pt, b: Pt, w: [number, number, number, number]) {
  const [x1, y1, x2, y2] = w;
  const d = (b[0] - a[0]) * (y2 - y1) - (b[1] - a[1]) * (x2 - x1);
  if (d === 0) return false;
  const t = ((x1 - a[0]) * (y2 - y1) - (y1 - a[1]) * (x2 - x1)) / d;
  const u = ((x1 - a[0]) * (b[1] - a[1]) - (y1 - a[1]) * (b[0] - a[0])) / d;
  return t > 0 && t < 1 && u >= 0 && u <= 1;
}

function signalFrom(ap: Pt, p: Pt) {
  const dist = Math.hypot(p[0] - ap[0], p[1] - ap[1]);
  const walls = WALLS.reduce((n, w) => n + (crosses(ap, p, w) ? 1 : 0), 0);
  return Math.max(0, Math.min(1, 1 - dist / RANGE - walls * WALL_LOSS));
}

function signalAt(p: Pt, mode: Mode) {
  const aps = mode === "mesh" ? [ROUTER, ...MESH_NODES] : [ROUTER];
  return Math.max(...aps.map((ap) => signalFrom(ap, p)));
}

function centroid(poly: Pt[]): Pt {
  const n = poly.length;
  return [poly.reduce((s, p) => s + p[0], 0) / n, poly.reduce((s, p) => s + p[1], 0) / n];
}

function inside(p: Pt, poly: Pt[]) {
  let hit = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i];
    const [xj, yj] = poly[j];
    if (yi > p[1] !== yj > p[1] && p[0] < ((xj - xi) * (p[1] - yi)) / (yj - yi) + xi) hit = !hit;
  }
  return hit;
}

/* ---------- níveis de sinal ---------- */

const LEVELS = [
  { min: 0.45, bars: 4, label: "Sinal ótimo", color: "#70E000" },
  { min: 0.28, bars: 3, label: "Sinal bom", color: "#C6E000" },
  { min: 0.1, bars: 2, label: "Sinal fraco", color: "#FF9F1C" },
  { min: -1, bars: 0, label: "Sem sinal", color: "#FF4D5E" },
];
const levelOf = (s: number) => LEVELS.find((l) => s >= l.min)!;

/** Barrinhas de sinal desenhadas no SVG (ou fora dele). */
function Bars({ bars, color, x = 0, y = 0, scale = 1 }: { bars: number; color: string; x?: number; y?: number; scale?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={i * 7} y={-(i + 1) * 5} width={5} height={(i + 1) * 5} rx={1.2} fill={i < bars ? color : "rgba(255,255,255,0.16)"} style={{ transition: "fill .8s" }} />
      ))}
    </g>
  );
}

/** Ondas que saem de um ponto, perdendo força (opacidade e cor) conforme se afastam. */
function Waves({ at, r, reduce, delay = 0 }: { at: Pt; r: number; reduce: boolean; delay?: number }) {
  if (reduce) {
    return (
      <g>
        {[0.3, 0.6, 0.9].map((k) => (
          <circle key={k} cx={at[0]} cy={at[1]} r={r * k} fill="none" stroke="#70E000" strokeOpacity={0.5 - k * 0.4} strokeWidth={2} />
        ))}
      </g>
    );
  }
  return (
    <g>
      {[0, 1, 2].map((i) => (
        <circle key={i} cx={at[0]} cy={at[1]} r={10} fill="none" strokeWidth={2.5}>
          <animate attributeName="r" from="10" to={r} dur="3.6s" begin={`${delay + i * 1.2}s`} repeatCount="indefinite" />
          <animate attributeName="stroke-opacity" values="0.9;0.45;0" keyTimes="0;0.45;1" dur="3.6s" begin={`${delay + i * 1.2}s`} repeatCount="indefinite" />
          <animate attributeName="stroke" values="#70E000;#C6E000;#FF9F1C;#FF4D5E" dur="3.6s" begin={`${delay + i * 1.2}s`} repeatCount="indefinite" />
        </circle>
      ))}
    </g>
  );
}

/** Móveis bem discretos, só para a planta parecer uma casa. */
function Furniture() {
  const f = { fill: "rgba(255,255,255,0.035)", stroke: "rgba(255,255,255,0.12)", strokeWidth: 1.5 };
  return (
    <g aria-hidden="true">
      {/* camas */}
      <rect x={110} y={170} width={120} height={95} rx={8} {...f} />
      <rect x={118} y={176} width={48} height={22} rx={5} {...f} />
      <rect x={174} y={176} width={48} height={22} rx={5} {...f} />
      <rect x={110} y={350} width={95} height={110} rx={8} {...f} />
      <rect x={118} y={356} width={79} height={24} rx={5} {...f} />
      <rect x={300} y={120} width={44} height={110} rx={4} {...f} />
      {/* banheiros */}
      <rect x={378} y={470} width={30} height={36} rx={14} {...f} />
      <rect x={422} y={430} width={36} height={80} rx={6} {...f} />
      <rect x={498} y={470} width={30} height={36} rx={14} {...f} />
      {/* cozinha */}
      <rect x={492} y={110} width={30} height={150} rx={4} {...f} />
      <rect x={560} y={150} width={110} height={60} rx={6} {...f} />
      {[575, 610, 645].map((x) => <rect key={x} x={x} y={130} width={20} height={14} rx={3} {...f} />)}
      {[575, 610, 645].map((x) => <rect key={`b${x}`} x={x} y={216} width={20} height={14} rx={3} {...f} />)}
      {/* varanda */}
      <circle cx={810} cy={170} r={22} {...f} />
      <rect x={760} y={240} width={46} height={26} rx={6} transform="rotate(-20 783 253)" {...f} />
      <rect x={830} y={240} width={46} height={26} rx={6} transform="rotate(20 853 253)" {...f} />
      {/* sala */}
      <rect x={650} y={480} width={200} height={28} rx={6} {...f} />
      <rect x={700} y={400} width={100} height={46} rx={8} {...f} />
      <rect x={880} y={330} width={10} height={120} rx={3} {...f} />
    </g>
  );
}

export default function MeshHouse({ id = "mesh", tag = "Wi-Fi na casa toda", defaultMode = "single" }: { id?: string; tag?: string; defaultMode?: Mode }) {
  const [mode, setMode] = useState<Mode>(defaultMode);
  const reduce = !!useReducedMotion();
  const stage = useRef<HTMLDivElement>(null);
  const visible = useInView(stage, { margin: "0px 0px -10% 0px" });
  const phone = useRef<SVGGElement>(null);
  const [walker, setWalker] = useState<{ room: string; s: number }>({ room: "Quarto 1", s: 1 });

  const rooms = useMemo(() => ROOMS.map((r) => ({ ...r, s: signalAt(centroid(r.poly), mode) })), [mode]);

  // comprimento acumulado do caminho do celular
  const path = useMemo(() => {
    const pts = [...WALK, WALK[0]];
    const acc = [0];
    for (let i = 1; i < pts.length; i++) acc.push(acc[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
    return { pts, acc, total: acc[acc.length - 1] };
  }, []);

  // celular andando pela casa; as barras são recalculadas em tempo real
  const modeRef = useRef(mode);
  modeRef.current = mode;
  const dist = useRef(0);
  useEffect(() => {
    const place = (d: number) => {
      const { pts, acc, total } = path;
      const k = ((d % total) + total) % total;
      let i = 1;
      while (acc[i] < k) i++;
      const t = (k - acc[i - 1]) / (acc[i] - acc[i - 1] || 1);
      const p: Pt = [pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * t, pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * t];
      phone.current?.setAttribute("transform", `translate(${p[0]} ${p[1]})`);
      const s = signalAt(p, modeRef.current);
      const room = ROOMS.find((r) => inside(p, r.poly))?.name ?? "Corredor";
      setWalker((w) => (w.room === room && levelOf(w.s) === levelOf(s) ? w : { room, s }));
    };
    if (reduce) {
      // sem animação: o celular fica parado na varanda, o cômodo mais difícil
      dist.current = path.acc[9];
      place(dist.current);
      return;
    }
    if (!visible) { place(dist.current); return; }
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      dist.current += ((now - last) / 1000) * SPEED;
      last = now;
      place(dist.current);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [visible, reduce, path, mode]);

  const wl = levelOf(walker.s);
  const isMesh = mode === "mesh";
  const offline = rooms.filter((r) => levelOf(r.s).bars === 0).map((r) => r.name);
  const desc = isMesh
    ? "Planta de uma casa com um roteador e dois pontos Mesh ligados entre si. O sinal chega forte em todos os cômodos."
    : `Planta de uma casa com um único roteador no quarto 1. O sinal enfraquece a cada parede; ${offline.length ? `ficam sem sinal: ${offline.join(", ")}.` : "alguns cômodos ficam com sinal fraco."}`;

  return (
    <section id={id} className="relative overflow-hidden py-20 sm:py-28">
      <div aria-hidden="true" className="pointer-events-none absolute -left-40 top-20 h-[460px] w-[460px] rounded-full bg-[#021A4A]/60 blur-[130px]" />
      <div className="wrap relative">
        <Rise><p className="tag">{tag}</p></Rise>
        <div className="mt-4 flex flex-wrap items-end justify-between gap-6">
          <Lines className="h-lg max-w-3xl" lines={["Um roteador é suficiente", <span className="italic text-lime">para a minha casa?</span>]} />
          {/* alternador */}
          <Rise delay={0.15}>
            <div role="group" aria-label="Como a casa está conectada" className="flex rounded-full border border-white/15 bg-white/[0.03] p-1">
              {([["single", "1 roteador", Router], ["mesh", "Rede Mesh", Share2]] as const).map(([m, label, Icon]) => (
                <button
                  key={m}
                  aria-pressed={mode === m}
                  onClick={() => setMode(m)}
                  className={`relative flex min-h-[44px] items-center gap-2 rounded-full px-5 text-sm font-semibold transition-colors duration-500 ${mode === m ? "text-navy-ink" : "text-white/70 hover:text-white"}`}
                >
                  {mode === m && <motion.span layoutId={`${id}-mode`} className="absolute inset-0 rounded-full bg-lime" transition={{ duration: DUR * 0.5, ease: EASE }} />}
                  <Icon size={16} aria-hidden="true" className="relative" />
                  <span className="relative">{label}</span>
                </button>
              ))}
            </div>
          </Rise>
        </div>
        <Rise delay={0.2}>
          <p className="lead mt-5 max-w-2xl">
            {isMesh ? "Os pontos Mesh repetem o sinal e formam uma rede só: você anda pela casa e o celular continua conectado no melhor ponto." : "O roteador espalha o Wi-Fi por ondas de rádio. A cada parede o sinal enfraquece, e os cômodos mais distantes ficam sem internet."}
          </p>
        </Rise>

        <Rise delay={0.25} className="mt-10">
          <div ref={stage} className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[radial-gradient(90%_80%_at_30%_40%,#021A4A,#010C22_55%,#010818)] p-3 sm:p-6">
            <svg viewBox="0 0 1000 560" className="block h-auto w-full" role="img" aria-labelledby={`${id}-title ${id}-desc`}>
              <title id={`${id}-title`}>{isMesh ? "Casa com rede Mesh" : "Casa com um roteador"}</title>
              <desc id={`${id}-desc`}>{desc}</desc>
              <defs>
                <filter id={`${id}-glow`} x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="6" result="b" />
                  <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
                <clipPath id={`${id}-house`}><polygon points={OUTER.map((p) => p.join(",")).join(" ")} /></clipPath>
              </defs>

              {/* cômodos coloridos pelo sinal */}
              {rooms.map((r) => {
                const l = levelOf(r.s);
                return (
                  <polygon key={r.name} points={r.poly.map((p) => p.join(",")).join(" ")} fill={l.color} fillOpacity={l.bars === 0 ? 0.13 : 0.1 + r.s * 0.12} style={{ transition: "fill .9s, fill-opacity .9s" }} />
                );
              })}
              {/* sem sinal: hachura cinza por cima */}
              {rooms.filter((r) => levelOf(r.s).bars === 0).map((r) => (
                <polygon key={`x${r.name}`} points={r.poly.map((p) => p.join(",")).join(" ")} fill="rgba(120,130,150,0.12)" />
              ))}

              <Furniture />

              {/* ondas, presas dentro da casa */}
              <g clipPath={`url(#${id}-house)`}>
                <Waves at={ROUTER} r={RANGE * 0.75} reduce={reduce} />
                {isMesh && MESH_NODES.map((n, i) => <Waves key={i} at={n} r={RANGE * 0.5} reduce={reduce} delay={0.6 + i * 0.5} />)}
              </g>

              {/* paredes grossas */}
              <polygon points={OUTER.map((p) => p.join(",")).join(" ")} fill="none" stroke="#2B3D6B" strokeWidth={18} strokeLinejoin="miter" />
              {WALLS.map((w, i) => (
                <line key={i} x1={w[0]} y1={w[1]} x2={w[2]} y2={w[3]} stroke="#2B3D6B" strokeWidth={12} strokeLinecap="square" />
              ))}

              {/* ligações de luz entre os pontos Mesh */}
              {isMesh && (
                <g filter={`url(#${id}-glow)`}>
                  {[[ROUTER, MESH_NODES[0]], [MESH_NODES[0], MESH_NODES[1]], [ROUTER, MESH_NODES[1]]].map(([a, b], i) => (
                    <line key={i} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke="#70E000" strokeWidth={3} strokeOpacity={i === 2 ? 0.35 : 0.85} strokeDasharray="10 12" strokeLinecap="round">
                      {!reduce && <animate attributeName="stroke-dashoffset" from="0" to="-44" dur="1.2s" repeatCount="indefinite" />}
                    </line>
                  ))}
                </g>
              )}

              {/* nomes e barras de cada cômodo */}
              {rooms.map((r) => {
                const l = levelOf(r.s);
                return (
                  <g key={`l${r.name}`} transform={`translate(${r.label[0]} ${r.label[1]})`}>
                    <text textAnchor="middle" y={-8} fontSize={17} fontWeight={600} fill="#fff" fillOpacity={0.85} className="font-display">{r.name}</text>
                    <Bars bars={l.bars} color={l.color} x={-13} y={14} scale={1} />
                    {l.bars === 0 && <text textAnchor="middle" y={34} fontSize={12} fill="#FF4D5E" fontWeight={600}>sem sinal</text>}
                  </g>
                );
              })}

              {/* roteador e pontos Mesh */}
              <g transform={`translate(${ROUTER[0]} ${ROUTER[1]})`} filter={`url(#${id}-glow)`}>
                <circle r={17} fill="#70E000" />
                <rect x={-8} y={-5} width={16} height={9} rx={2} fill="#010818" />
                <rect x={-6} y={-12} width={2.5} height={8} rx={1} fill="#010818" />
                <rect x={3.5} y={-12} width={2.5} height={8} rx={1} fill="#010818" />
              </g>
              {isMesh && MESH_NODES.map((n, i) => (
                <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: DUR * 0.6, ease: EASE, delay: 0.15 + i * 0.12 }}>
                  <g transform={`translate(${n[0]} ${n[1]})`} filter={`url(#${id}-glow)`}>
                    <circle r={14} fill="#70E000" />
                    <circle r={6} fill="none" stroke="#010818" strokeWidth={2.5} />
                    <circle r={1.8} fill="#010818" />
                  </g>
                </motion.g>
              ))}

              {/* celular andando */}
              <g ref={phone} aria-hidden="true">
                <circle r={22} fill={wl.color} fillOpacity={0.18} style={{ transition: "fill .6s" }} />
                <rect x={-8} y={-13} width={16} height={26} rx={4} fill="#E8EEF8" />
                <rect x={-6} y={-10} width={12} height={18} rx={1.5} fill="#010C22" />
                <Bars bars={wl.bars} color={wl.color} x={14} y={-10} scale={0.85} />
              </g>
            </svg>

            {/* painel do celular */}
            <div className="pointer-events-none mt-3 flex w-fit items-center gap-3 rounded-2xl border border-white/10 bg-[#010818]/85 px-4 py-2.5 backdrop-blur sm:absolute sm:bottom-6 sm:left-6 sm:mt-0" aria-live="polite">
              <Smartphone size={18} aria-hidden="true" className="text-white/70" />
              <div className="text-xs leading-tight">
                <p className="text-white/55">Celular na <span className="text-white">{walker.room}</span></p>
                <p className="font-semibold" style={{ color: wl.color }}>{wl.label}</p>
              </div>
              <svg width="34" height="24" viewBox="0 -22 30 24" aria-hidden="true"><Bars bars={wl.bars} color={wl.color} /></svg>
            </div>
          </div>
        </Rise>

        {/* legenda + estado de cada cômodo (também é o texto acessível no celular) */}
        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-start">
          <ul className="flex flex-wrap gap-2" aria-label="Sinal em cada cômodo">
            {rooms.map((r) => {
              const l = levelOf(r.s);
              return (
                <li key={r.name} className="flex items-center gap-2 rounded-full border border-white/10 bg-[#010C22] px-3 py-1.5 text-xs">
                  <span className="h-2 w-2 rounded-full" style={{ background: l.color, transition: "background .8s" }} aria-hidden="true" />
                  {r.name}: <span className="text-white/60">{l.label.toLowerCase()}</span>
                </li>
              );
            })}
          </ul>
          <p className="max-w-sm text-sm text-white/60">
            {isMesh ? "Os pontos Mesh repetem o sinal e formam uma rede só." : "A cada parede o sinal enfraquece."}{" "}
            <span className="text-white/40">Ilustração simplificada: o alcance real depende do roteador, dos materiais das paredes e dos aparelhos.</span>
          </p>
        </div>
      </div>
    </section>
  );
}
