import { useEffect, useRef } from "react";
import { useGesture } from "@use-gesture/react";

/**
 * Fibras penduradas que funcionam como cordas: arrastar o dedo/mouse por elas
 * (pan) faz vibrar com mola amortecida e solta um pulso de luz descendo o fio.
 * Um toque (tap) cria uma onda que empurra as fibras em volta.
 * Arrastos verticais continuam rolando a página (touch-action: pan-y).
 */
type Strand = { x: number; len: number; o: number; v: number; cy: number; lit: number; pulse: number; z: number; delay: number; ph: number };

const K = 0.04; // rigidez da mola
const C = 0.055; // amortecimento

export default function PluckFibers({ className = "", onFirstPluck }: { className?: string; onFirstPluck?: () => void }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const strands = useRef<Strand[]>([]);
  const size = useRef({ w: 0, h: 0 });
  const last = useRef<{ x: number; y: number } | null>(null);
  const plucked = useRef(false);
  const idle = useRef(performance.now());

  const pluck = (s: Strand, force: number, y: number) => {
    s.v += force;
    s.cy = Math.min(0.92, Math.max(0.15, y / (size.current.h * s.len)));
    s.lit = 1;
    if (s.pulse < 0 || s.pulse > 0.6) s.pulse = s.cy;
  };

  // atravessar fibras entre a posição anterior e a atual do ponteiro
  const sweep = (x: number, y: number, vx: number, strength: number) => {
    const prev = last.current ?? { x, y };
    const lo = Math.min(prev.x, x), hi = Math.max(prev.x, x);
    for (const s of strands.current) {
      if (s.x >= lo && s.x <= hi && y < size.current.h * s.len) {
        pluck(s, Math.max(-16, Math.min(16, vx * strength)), y);
        if (!plucked.current) {
          plucked.current = true;
          onFirstPluck?.();
        }
      }
    }
    last.current = { x, y };
    idle.current = performance.now();
  };

  const local = (cx: number, cy: number) => {
    const r = wrapRef.current!.getBoundingClientRect();
    return [cx - r.left, cy - r.top] as const;
  };

  useGesture(
    {
      onDrag: ({ xy: [cx, cy], velocity: [vx], direction: [dx], tap, first, last: end }) => {
        const [x, y] = local(cx, cy);
        if (tap) {
          // onda a partir do toque
          for (const s of strands.current) {
            const d = s.x - x;
            if (Math.abs(d) < 180) pluck(s, Math.sign(d || 1) * (1 - Math.abs(d) / 180) * 9, y);
          }
          return;
        }
        if (first) last.current = { x, y };
        sweep(x, y, vx * dx * 9, 1);
        if (end) last.current = null;
      },
      onMove: ({ xy: [cx, cy], velocity: [vx], direction: [dx], dragging }) => {
        if (dragging) return;
        const [x, y] = local(cx, cy);
        sweep(x, y, vx * dx * 4, 1); // passar o mouse dedilha de leve
      },
      onHover: ({ hovering }) => {
        if (!hovering) last.current = null;
      },
    },
    { target: wrapRef, drag: { filterTaps: true, pointer: { touch: true } }, eventOptions: { passive: true } },
  );

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0, visible = true;
    const start = performance.now();

    const build = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.clientWidth, h = canvas.clientHeight;
      size.current = { w, h };
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const gap = w < 640 ? 16 : 13;
      strands.current = Array.from({ length: Math.floor(w / gap) }, (_, i) => ({
        x: i * gap + gap / 2 + (Math.random() - 0.5) * 4,
        len: 0.55 + Math.random() * 0.38,
        o: 0, v: 0, cy: 0.5, lit: 0, pulse: -1,
        z: Math.random(),
        delay: Math.random() * 1400, // cada fibra "cai" do alto num momento diferente
        ph: Math.random() * Math.PI * 2,
      }));
    };
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(canvas);

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!visible) return;
      const { w, h } = size.current;
      // sem interação por 4 s, uma fibra é dedilhada sozinha como convite
      if (now - idle.current > 4000 && strands.current.length) {
        idle.current = now - 2600;
        const s = strands.current[Math.floor(Math.random() * strands.current.length)];
        pluck(s, (Math.random() - 0.5) * 10, h * s.len * 0.5);
      }
      // gotas de luz caindo pelas fibras, uma de cada vez, o tempo todo
      if (Math.random() < 0.06 && strands.current.length) {
        const s = strands.current[Math.floor(Math.random() * strands.current.length)];
        if (s.pulse < 0) s.pulse = 0;
      }
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";
      const t = now / 1000;

      for (const s of strands.current) {
        s.v += -K * s.o - C * s.v;
        s.o += s.v;
        s.lit *= 0.985;
        const grow = Math.min(1, Math.max(0, (now - start - s.delay) / 1600));
        if (grow <= 0) continue;
        const L = h * s.len * (1 - Math.pow(1 - grow, 4));
        const cx = s.x + s.o * 2, cyy = L * s.cy;
        const a = 0.12 + s.z * 0.22 + s.lit * 0.6;
        const g = ctx.createLinearGradient(0, 0, 0, L);
        g.addColorStop(0, "rgba(0,98,236,0.02)");
        g.addColorStop(0.6, `rgba(${s.lit > 0.2 ? "112,224,0" : "0,98,236"},${a})`);
        g.addColorStop(1, `rgba(170,210,255,${a + 0.1})`);
        ctx.strokeStyle = g;
        ctx.lineWidth = 0.8 + s.z * 0.8 + s.lit * 0.8;
        ctx.beginPath();
        ctx.moveTo(s.x, -4);
        ctx.quadraticCurveTo(cx, cyy, s.x + s.o * 0.3, L);
        ctx.stroke();

        // ponta
        const tx = s.x + s.o * 0.3;
        const tr = 3 + s.z * 3 + s.lit * 5;
        const blink = 0.55 + 0.45 * Math.sin(t * (1.2 + s.z) + s.ph); // pontas piscando
        const tg = ctx.createRadialGradient(tx, L, 0, tx, L, tr * 2);
        tg.addColorStop(0, `rgba(230,245,255,${(0.3 + s.lit * 0.6) * blink + s.lit * 0.2})`);
        tg.addColorStop(0.4, `rgba(112,224,0,${(0.12 + s.lit * 0.4) * blink})`);
        tg.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = tg;
        ctx.fillRect(tx - tr * 2, L - tr * 2, tr * 4, tr * 4);

        // pulso de luz descendo a fibra
        if (s.pulse >= 0) {
          s.pulse += 0.012;
          if (s.pulse > 1) s.pulse = -1;
          else {
            const q = s.pulse, u = 1 - q;
            const px = u * u * s.x + 2 * u * q * cx + q * q * tx;
            const py = u * u * -4 + 2 * u * q * cyy + q * q * L;
            const pg = ctx.createRadialGradient(px, py, 0, px, py, 14);
            pg.addColorStop(0, "rgba(255,255,255,0.95)");
            pg.addColorStop(0.3, "rgba(112,224,0,0.55)");
            pg.addColorStop(1, "rgba(0,0,0,0)");
            ctx.fillStyle = pg;
            ctx.fillRect(px - 14, py - 14, 28, 28);
          }
        }
      }
      ctx.globalCompositeOperation = "source-over";
      if (reduce) cancelAnimationFrame(raf);
    };

    build();
    window.addEventListener("resize", build);
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", build);
    };
  }, []);

  return (
    <div ref={wrapRef} className={className} style={{ touchAction: "pan-y" }}>
      <canvas ref={canvasRef} className="h-full w-full" aria-hidden="true" />
    </div>
  );
}
