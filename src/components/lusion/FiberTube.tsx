import { useEffect, useId, useRef } from "react";
import { useLocation } from "react-router-dom";

/**
 * FiberTube — Cabo de fibra óptica recolorido para o Tema Claro-Neve do Teste 3.
 *
 * Referência: a faixa azul vibrante e contínua do lusion.co (frames 01 a 12),
 * agora na paleta da INET (#003F99 / #0062EC / #38B000), com pulsos luminosos de dados
 * correndo sobre o fundo claro-neve (#EFF3F9).
 *
 * Técnica: SVG único, contínuo, da altura total da página, sem filtros pesados de blur,
 * com inércia ligada ao scroll e parada automática em aba oculta ou prefers-reduced-motion.
 */

type Pt = { x: number; y: number };

const SVG_NS = "http://www.w3.org/2000/svg";

/** Faixa vertical ocupada pelo conteúdo legível de um bloco (seção ou rodapé). */
function contentBand(el: HTMLElement, sy: number) {
  const r = el.getBoundingClientRect();
  const wraps = [...el.querySelectorAll<HTMLElement>(".wrap")]
    .map((w) => w.getBoundingClientRect())
    .filter((w) => w.height > 0 && w.width > 0);
  if (wraps.length) {
    return {
      top: Math.min(...wraps.map((w) => w.top)) + sy,
      bottom: Math.max(...wraps.map((w) => w.bottom)) + sy,
    };
  }
  const cs = getComputedStyle(el);
  return { top: r.top + sy + parseFloat(cs.paddingTop), bottom: r.bottom + sy - parseFloat(cs.paddingBottom) };
}

export default function FiberTube() {
  const ref = useRef<SVGSVGElement>(null);
  const id = useId().replace(/:/g, "");
  const { pathname } = useLocation();

  useEffect(() => {
    const svg = ref.current;
    const root = document.getElementById("top");
    if (!svg || !root) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const cables = [...svg.querySelectorAll<SVGPathElement>("[data-cable]")];
    const pulses = [...svg.querySelectorAll<SVGPathElement>("[data-pulse]")];
    const head = svg.querySelector<SVGGElement>("[data-head]")!;
    const probe = cables[0];

    let total = 0;
    let drawn = 0;
    let raf = 0;
    let last = 0;
    let dirty = true;
    let mobile = false;
    let table: Pt[] = [];
    let step = 6;

    const pointAt = (len: number): Pt => {
      if (!table.length) return { x: 0, y: 0 };
      const f = Math.max(0, Math.min(table.length - 1, len / step));
      const i = Math.floor(f), j = Math.min(table.length - 1, i + 1), t = f - i;
      return { x: table[i].x + (table[j].x - table[i].x) * t, y: table[i].y + (table[j].y - table[i].y) * t };
    };

    const lengthAtY = (y: number) => {
      let lo = 0, hi = table.length - 1;
      if (hi < 1) return 0;
      if (y <= table[0].y) return 0;
      if (y >= table[hi].y) return total;
      while (hi - lo > 1) {
        const mid = (lo + hi) >> 1;
        if (table[mid].y < y) lo = mid; else hi = mid;
      }
      const a = table[lo], b = table[hi];
      const t = b.y === a.y ? 0 : (y - a.y) / (b.y - a.y);
      return Math.min(total, (lo + t) * step);
    };

    const build = () => {
      dirty = false;
      const sy = scrollY;
      const w = document.documentElement.clientWidth;
      // Zera a própria altura antes de medir para evitar acúmulo infinito de scrollHeight
      svg.style.height = "0px";
      const h = root.scrollHeight;
      mobile = w < 640;
      svg.style.height = `${h}px`;
      svg.setAttribute("viewBox", `0 0 ${w} ${h}`);

      // Margem real do .wrap (clamp(1.25rem, 4vw, 5rem))
      const pad = Math.min(80, Math.max(20, w * 0.04));
      const width = mobile ? 6 : Math.round(Math.min(26, Math.max(12, pad * 0.45)));
      const edge = Math.max(width / 2 + 3, pad / 2);
      svg.style.setProperty("--tube", `${width}px`);

      // Seções e rodapé para mapear as faixas de conteúdo
      const all = [...document.querySelectorAll<HTMLElement>("main section, footer")];
      const blocks = all
        .filter((el) => !all.some((o) => o !== el && o.contains(el)))
        .filter((el) => el.getBoundingClientRect().height > 40)
        .map((el) => contentBand(el, sy))
        .sort((a, b) => a.top - b.top);

      const L = edge, R = w - edge;
      let x = L;
      let y = mobile ? 96 : 120;
      // Curva de entrada suave pela borda esquerda logo abaixo do topo
      let d = `M ${-width * 3} ${y} C ${L} ${y}, ${L} ${y + 70}, ${L} ${y + 150}`;
      y += 150;

      const minGap = width + (mobile ? 24 : 40);
      for (let i = 1; i < blocks.length; i++) {
        const top = blocks[i - 1].bottom + width / 2 + 6;
        const bottom = blocks[i].top - width / 2 - 6;
        if (bottom - top < minGap || top <= y + 40) continue;
        const next = x === L ? R : L;
        // Desce rente à margem lateral e cruza a tela em "S" largo somente na faixa vazia
        d += ` L ${x} ${top}`;
        const mid = (top + bottom) / 2;
        d += ` C ${x} ${mid + (bottom - top) * 0.4}, ${next} ${mid - (bottom - top) * 0.4}, ${next} ${bottom}`;
        x = next;
        y = bottom;
      }
      const end = h - (mobile ? 40 : 60);
      if (end > y) d += ` L ${x} ${end}`;

      for (const c of [...cables, ...pulses]) c.setAttribute("d", d);
      total = probe.getTotalLength();
      step = Math.max(4, total / 6000);
      table = [];
      for (let s = 0; s <= total; s += step) {
        const p = probe.getPointAtLength(s);
        table.push({ x: p.x, y: p.y });
      }
      for (const c of cables) c.style.strokeDasharray = `${total} ${total}`;
      for (const p of pulses) p.style.strokeDasharray = `${mobile ? 42 : 90} ${total + 200}`;
      if (reduced.matches) drawn = total;
      else drawn = Math.min(drawn, total);
    };

    const targetLength = () => {
      const max = root.scrollHeight - innerHeight;
      if (scrollY >= max - 4) return total;
      return lengthAtY(scrollY + innerHeight * (mobile ? 0.7 : 0.78));
    };

    const paint = (now: number) => {
      for (const c of cables) c.style.strokeDashoffset = `${total - drawn}`;
      if (reduced.matches) {
        head.style.opacity = "0";
        for (const p of pulses) p.style.opacity = "0";
        return;
      }
      const tip = pointAt(drawn);
      head.setAttribute("transform", `translate(${tip.x} ${tip.y}) scale(${mobile ? 0.45 : 1})`);
      head.style.opacity = drawn > 4 && drawn < total - 2 ? "1" : "0";

      // Pulsos luminosos descendo com ritmo suave
      const speed = mobile ? 110 : 150;
      const gap = Math.max(innerHeight * 1.1, 720);
      const phase = ((now / 1000) * speed) % gap;
      const from = lengthAtY(scrollY - 120);
      const to = Math.min(drawn - 40, lengthAtY(scrollY + innerHeight + 120));
      let k = Math.ceil((from - phase) / gap);

      pulses.forEach((p, i) => {
        const s = phase + k * gap;
        k++;
        if (s > to || s < 0 || (mobile && i > 0)) {
          p.style.opacity = "0";
          return;
        }
        p.style.strokeDashoffset = `${-s}`;
        p.style.opacity = String(Math.max(0, Math.min(1, (drawn - s) / 260)) * 0.95);
      });
    };

    const frame = (now: number) => {
      raf = 0;
      if (document.hidden) return;
      if (dirty) build();
      const dt = last ? Math.min(64, now - last) : 16.7;
      last = now;
      const target = reduced.matches ? total : targetLength();
      const a = 1 - Math.pow(1 - 0.055, dt / 16.7);
      drawn += (target - drawn) * a;
      if (Math.abs(target - drawn) < 0.5) drawn = target;
      paint(now);
      if (!reduced.matches) raf = requestAnimationFrame(frame);
    };

    const wake = () => {
      if (raf || document.hidden) return;
      last = 0;
      raf = requestAnimationFrame(frame);
    };
    const rebuild = () => {
      dirty = true;
      wake();
    };
    const onVisibility = () => (document.hidden ? (cancelAnimationFrame(raf), (raf = 0)) : wake());
    const onScroll = () => {
      if (reduced.matches) return;
      wake();
    };

    const ro = new ResizeObserver(rebuild);
    ro.observe(root);
    const main = document.getElementById("conteudo");
    if (main) ro.observe(main);
    window.addEventListener("resize", rebuild);
    window.addEventListener("load", rebuild);
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    reduced.addEventListener("change", rebuild);
    drawn = 0;
    wake();
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("resize", rebuild);
      window.removeEventListener("load", rebuild);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVisibility);
      reduced.removeEventListener("change", rebuild);
    };
  }, [pathname]);

  return (
    <svg
      ref={ref}
      aria-hidden="true"
      focusable="false"
      className="inet-fiber-tube pointer-events-none absolute left-0 top-0 z-0 w-full"
      xmlns={SVG_NS}
    >
      <style>{`
.inet-fiber-tube { overflow: hidden; --tube: 26px; }
.inet-fiber-tube path { fill: none; stroke-linecap: round; stroke-linejoin: round; }
/* No fundo claro, o halo em azul elétrico destaca a fita da mesma forma que no lusion.co */
.inet-fiber-tube .ft-halo { stroke-width: calc(var(--tube) * 1.9); opacity: 0.16; }
.inet-fiber-tube .ft-sheath { stroke-width: var(--tube); opacity: 0.95; }
.inet-fiber-tube .ft-body { stroke-width: calc(var(--tube) * 0.76); }
.inet-fiber-tube .ft-sheen { stroke-width: calc(var(--tube) * 0.28); opacity: 0.45; }
.inet-fiber-tube .ft-core { stroke-width: max(1.5px, calc(var(--tube) * 0.12)); opacity: 0.9; }
.inet-fiber-tube .ft-pulse { stroke-width: max(2.5px, calc(var(--tube) * 0.32)); }
@media (max-width: 639px) {
  .inet-fiber-tube .ft-halo, .inet-fiber-tube .ft-sheen { display: none; }
}
@media (prefers-reduced-motion: reduce) {
  .inet-fiber-tube [data-cable] { stroke-dasharray: none !important; stroke-dashoffset: 0 !important; }
  .inet-fiber-tube [data-pulse], .inet-fiber-tube [data-head] { display: none; }
}
`}</style>
      <defs>
        {/* Degradê azul vibrante INET inspirado na fita azul do lusion.co */}
        <linearGradient
          id={`${id}-body`}
          gradientUnits="userSpaceOnUse"
          x1="0"
          y1="0"
          x2="700"
          y2="1500"
          spreadMethod="reflect"
        >
          <stop offset="0" stopColor="#003F99" />
          <stop offset="0.45" stopColor="#0062EC" />
          <stop offset="0.8" stopColor="#0080FF" />
          <stop offset="1" stopColor="#38B000" />
        </linearGradient>

        <radialGradient id={`${id}-head`}>
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="0.35" stopColor="#5CC8FF" stopOpacity="0.9" />
          <stop offset="1" stopColor="#0062EC" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Camadas da Fibra Óptica no Tema Claro */}
      <path data-cable="" className="ft-halo" stroke="#0062EC" />
      <path data-cable="" className="ft-sheath" stroke="#003F99" />
      <path data-cable="" className="ft-body" stroke={`url(#${id}-body)`} />
      <path data-cable="" className="ft-sheen" stroke="#FFFFFF" />
      <path data-cable="" className="ft-core" stroke="#C8F8FF" />

      {/* Pulsos Luminosos */}
      {[0, 1, 2].map((i) => (
        <path key={i} data-pulse="" className="ft-pulse" stroke="#FFFFFF" style={{ opacity: 0 }} />
      ))}

      {/* Cabeça de Luz na Ponta */}
      <g data-head="" style={{ opacity: 0 }}>
        <circle r="22" fill={`url(#${id}-head)`} opacity="0.85" />
        <circle r="3.5" fill="#FFFFFF" />
      </g>
    </svg>
  );
}
