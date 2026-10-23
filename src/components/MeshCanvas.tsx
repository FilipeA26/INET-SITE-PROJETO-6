import { useEffect, useRef } from "react";

/**
 * Malha 3D de rede em ondas, em perspectiva, com pontos de luz
 * (ref. "Broadband Internet Service Provider Website"). O relevo segue o mouse.
 */
export default function MeshCanvas({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0, h = 0, raf = 0, visible = true;
    const mouse = { x: 0.3, sx: 0.3 };
    const COLS = 46, ROWS = 30;
    const grid = new Float32Array(COLS * ROWS * 3);

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = ((e.clientX - r.left) / r.width - 0.5) * 2;
    };
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(canvas);

    // cor ao longo do eixo X: azul vivo → ciano → verde-limão
    const color = (u: number, a: number) => {
      const stops = [[0, 98, 236], [92, 200, 255], [112, 224, 0]];
      const k = u < 0.5 ? u * 2 : (u - 0.5) * 2;
      const [c0, c1] = u < 0.5 ? [stops[0], stops[1]] : [stops[1], stops[2]];
      return `rgba(${c0.map((v, i) => Math.round(v + (c1[i] - v) * k)).join(",")},${a})`;
    };

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!visible) return;
      const t = now / 1000;
      mouse.sx += (mouse.x - mouse.sx) * 0.04;
      ctx.clearRect(0, 0, w, h);

      for (let r = 0; r < ROWS; r++) {
        const Z = 0.6 + (r / (ROWS - 1)) * 4.2; // distância
        for (let c = 0; c < COLS; c++) {
          const X = (c / (COLS - 1) - 0.5) * 6;
          const hill = Math.exp(-((X - mouse.sx * 1.6) ** 2 + (Z - 2.2) ** 2) / 1.6) * 0.9;
          const Y = Math.sin(X * 1.3 + t * 0.6) * 0.18 + Math.cos(Z * 1.7 - t * 0.8) * 0.22 + hill;
          const i = (r * COLS + c) * 3;
          grid[i] = w / 2 + (X / Z) * w * 0.42;
          grid[i + 1] = h * 0.38 + ((1.1 - Y) / Z) * h * 0.55;
          grid[i + 2] = Z;
        }
      }

      ctx.globalCompositeOperation = "lighter";
      ctx.lineWidth = 1;
      // linhas da malha (horizontais e verticais)
      for (let r = 0; r < ROWS; r++) {
        ctx.beginPath();
        for (let c = 0; c < COLS; c++) {
          const i = (r * COLS + c) * 3;
          c === 0 ? ctx.moveTo(grid[i], grid[i + 1]) : ctx.lineTo(grid[i], grid[i + 1]);
        }
        ctx.strokeStyle = color(r / ROWS, 0.5 - (r / ROWS) * 0.35);
        ctx.stroke();
      }
      for (let c = 0; c < COLS; c++) {
        ctx.beginPath();
        for (let r = 0; r < ROWS; r++) {
          const i = (r * COLS + c) * 3;
          r === 0 ? ctx.moveTo(grid[i], grid[i + 1]) : ctx.lineTo(grid[i], grid[i + 1]);
        }
        ctx.strokeStyle = color(c / COLS, 0.3);
        ctx.stroke();
      }
      // nós luminosos (os mais próximos ficam grandes e desfocados)
      for (let k = 0; k < COLS * ROWS; k += 3) {
        const i = k * 3;
        const Z = grid[i + 2];
        const rad = 5 / Z;
        const g = ctx.createRadialGradient(grid[i], grid[i + 1], 0, grid[i], grid[i + 1], rad * 2.5);
        g.addColorStop(0, color((k % COLS) / COLS, 0.7 / Z + 0.1));
        g.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = g;
        ctx.fillRect(grid[i] - rad * 2.5, grid[i + 1] - rad * 2.5, rad * 5, rad * 5);
      }
      ctx.globalCompositeOperation = "source-over";
      if (reduce) cancelAnimationFrame(raf);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove);
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
}
