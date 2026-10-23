import { useEffect, useRef } from "react";

/**
 * Feixe de fibras ópticas que sai de trás do cursor e vai seguindo o mouse
 * (inspirado no vividmotion.co). Sem mouse/celular, o feixe passeia sozinho.
 */
export default function FiberTrail({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0, h = 0, raf = 0;

    const STRANDS = 9;
    const LENGTH = 70; // pontos no rastro
    const head = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };
    const trail: { x: number; y: number }[] = [];
    let lastMove = -1e9;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (!trail.length) {
        head.x = target.x = w * 0.7;
        head.y = target.y = h * 0.5;
      }
    };

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      const x = e.clientX - r.left, y = e.clientY - r.top;
      if (x < -40 || y < -40 || x > r.width + 40 || y > r.height + 40) return;
      target.x = x;
      target.y = y;
      lastMove = performance.now();
    };

    const frame = (now: number) => {
      const t = now / 1000;
      if (now - lastMove > 2500) {
        // passeio automático em forma de "8"
        target.x = w * (0.62 + 0.28 * Math.sin(t * 0.6));
        target.y = h * (0.5 + 0.3 * Math.sin(t * 1.2));
      }
      // seguimento mais lento = movimento mais suave
      head.x += (target.x - head.x) * 0.075;
      head.y += (target.y - head.y) * 0.075;
      trail.unshift({ x: head.x, y: head.y });
      if (trail.length > LENGTH) trail.pop();

      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";
      ctx.lineCap = "round";

      if (trail.length > 2) {
        for (let s = 0; s < STRANDS; s++) {
          const spread = (s - (STRANDS - 1) / 2) * 3.2;
          ctx.beginPath();
          for (let i = 0; i < trail.length; i++) {
            const p = trail[i];
            const q = trail[Math.min(i + 1, trail.length - 1)];
            // normal da direção do rastro, para abrir os fios em leque
            let nx = -(q.y - p.y), ny = q.x - p.x;
            const len = Math.hypot(nx, ny) || 1;
            nx /= len;
            ny /= len;
            const k = i / LENGTH;
            const wobble = Math.sin(t * 3 + i * 0.25 + s) * 6 * k;
            const off = spread * (0.3 + k * 4) + wobble;
            const x = p.x + nx * off, y = p.y + ny * off;
            i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
          }
          const tail = trail[trail.length - 1];
          const g = ctx.createLinearGradient(head.x, head.y, tail.x, tail.y);
          const core = Math.abs(s - (STRANDS - 1) / 2) < 1.5;
          g.addColorStop(0, core ? "rgba(235,255,210,0.95)" : "rgba(112,224,0,0.8)");
          g.addColorStop(0.25, "rgba(112,224,0,0.45)");
          g.addColorStop(0.6, "rgba(0,98,236,0.35)");
          g.addColorStop(1, "rgba(0,98,236,0)");
          ctx.strokeStyle = g;
          ctx.lineWidth = core ? 2 : 1.1;
          ctx.stroke();
        }
      }

      // ponta luminosa
      const r = 70;
      const glow = ctx.createRadialGradient(head.x, head.y, 0, head.x, head.y, r);
      glow.addColorStop(0, "rgba(255,255,255,0.9)");
      glow.addColorStop(0.08, "rgba(170,255,90,0.7)");
      glow.addColorStop(0.35, "rgba(112,224,0,0.18)");
      glow.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = glow;
      ctx.fillRect(head.x - r, head.y - r, r * 2, r * 2);
      ctx.globalCompositeOperation = "source-over";

      if (!reduce) raf = requestAnimationFrame(frame);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove);
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
}
