import { useEffect, useId, useRef } from "react";
import { useLocation } from "react-router-dom";

/**
 * Cabo de fibra óptica que serpenteia a página inteira (referência: a faixa do lusion.co).
 *
 * Técnica: um único SVG absoluto, da altura do documento, com stroke-dashoffset ligado à rolagem.
 * O navegador rola o SVG junto com a página (nada é reposicionado por quadro); a cada quadro só
 * mudam o dashoffset, a cabeça de luz e os pulsos. Sem filtros SVG (caros em área grande): o brilho
 * vem de traços sobrepostos. Nenhum contexto WebGL extra.
 *
 * Leitura: o traçado corre nas margens laterais (fora do .wrap) e só cruza a tela nas faixas vazias
 * entre o conteúdo de uma seção e o da seguinte. A geometria é recalculada quando a página muda de altura.
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
    // tabela comprimento → ponto (amostrada a cada ~6 px) para não chamar getPointAtLength por quadro
    let table: Pt[] = [];
    let step = 6;

    const pointAt = (len: number): Pt => {
      if (!table.length) return { x: 0, y: 0 };
      const f = Math.max(0, Math.min(table.length - 1, len / step));
      const i = Math.floor(f), j = Math.min(table.length - 1, i + 1), t = f - i;
      return { x: table[i].x + (table[j].x - table[i].x) * t, y: table[i].y + (table[j].y - table[i].y) * t };
    };
    /** O traçado só desce (y nunca diminui), então dá para buscar o comprimento por y. */
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
      // zera a própria altura antes de medir: o SVG absoluto não pode segurar a página alta
      svg.style.height = "0px";
      const h = root.scrollHeight;
      mobile = w < 640;
      svg.style.height = `${h}px`;
      svg.setAttribute("viewBox", `0 0 ${w} ${h}`);

      // margem real do .wrap (clamp(1.25rem, 4vw, 5rem)): o cabo fica no meio dela
      const pad = Math.min(80, Math.max(20, w * 0.04));
      const width = mobile ? 6 : Math.round(Math.min(26, Math.max(12, pad * 0.45)));
      const edge = Math.max(width / 2 + 3, pad / 2);
      svg.style.setProperty("--tube", `${width}px`);

      // blocos de nível superior: seções do conteúdo e o rodapé
      const all = [...document.querySelectorAll<HTMLElement>("main section, footer")];
      const blocks = all
        .filter((el) => !all.some((o) => o !== el && o.contains(el)))
        .filter((el) => el.getBoundingClientRect().height > 40)
        .map((el) => contentBand(el, sy))
        .sort((a, b) => a.top - b.top);

      const L = edge, R = w - edge;
      let x = L;
      let y = mobile ? 96 : 120;
      // entra pela borda esquerda logo abaixo do menu e assenta na margem
      let d = `M ${-width * 3} ${y} C ${L} ${y}, ${L} ${y + 70}, ${L} ${y + 150}`;
      y += 150;

      const minGap = width + (mobile ? 24 : 40);
      for (let i = 1; i < blocks.length; i++) {
        const top = blocks[i - 1].bottom + width / 2 + 6;
        const bottom = blocks[i].top - width / 2 - 6;
        if (bottom - top < minGap || top <= y + 40) continue;
        const next = x === L ? R : L;
        // desce reto pela margem até a faixa vazia e cruza em S largo, com tangentes verticais
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
      // cabo desenhado até `drawn`
      for (const c of cables) c.style.strokeDashoffset = `${total - drawn}`;
      if (reduced.matches) {
        head.style.opacity = "0";
        for (const p of pulses) p.style.opacity = "0";
        return;
      }
      const tip = pointAt(drawn);
      head.setAttribute("transform", `translate(${tip.x} ${tip.y}) scale(${mobile ? 0.45 : 1})`);
      head.style.opacity = drawn > 4 && drawn < total - 2 ? "1" : "0";

      // pulsos de luz descendo pelo trecho já desenhado, devagar; só os que estão perto da tela
      const speed = mobile ? 110 : 150; // px/s
      const gap = Math.max(innerHeight * 1.1, 720);
      const phase = ((now / 1000) * speed) % gap;
      const from = lengthAtY(scrollY - 120);
      const to = Math.min(drawn - 40, lengthAtY(scrollY + innerHeight + 120));
      let k = Math.ceil((from - phase) / gap);
      pulses.forEach((p, i) => {
        const s = phase + k * gap;
        k++;
        // no celular, um pulso só
        if (s > to || s < 0 || (mobile && i > 0)) { p.style.opacity = "0"; return; }
        p.style.strokeDashoffset = `${-s}`;
        // some antes de alcançar a ponta do cabo
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
      // inércia própria por cima do Lenis: o cabo alcança a rolagem com atraso suave
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
.inet-fiber-tube{overflow:hidden;--tube:26px}
.inet-fiber-tube path{fill:none;stroke-linecap:round;stroke-linejoin:round}
.inet-fiber-tube .ft-halo{stroke-width:calc(var(--tube)*1.8);opacity:.14}
.inet-fiber-tube .ft-sheath{stroke-width:var(--tube)}
.inet-fiber-tube .ft-body{stroke-width:calc(var(--tube)*.74)}
.inet-fiber-tube .ft-sheen{stroke-width:calc(var(--tube)*.3);opacity:.22}
.inet-fiber-tube .ft-core{stroke-width:max(1.5px,calc(var(--tube)*.11));opacity:.75}
.inet-fiber-tube .ft-pulse{stroke-width:max(2.5px,calc(var(--tube)*.3))}
@media (max-width:639px){.inet-fiber-tube .ft-halo,.inet-fiber-tube .ft-sheen{display:none}}
@media (prefers-reduced-motion:reduce){
  .inet-fiber-tube [data-cable]{stroke-dasharray:none!important;stroke-dashoffset:0!important}
  .inet-fiber-tube [data-pulse],.inet-fiber-tube [data-head]{display:none}
}`}</style>
      <defs>
        {/* paleta INET ao longo do cabo; "reflect" faz a cor ir e voltar pela página */}
        <linearGradient id={`${id}-body`} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="700" y2="1500" spreadMethod="reflect">
          <stop offset="0" stopColor="#003F99" />
          <stop offset=".45" stopColor="#0062EC" />
          <stop offset=".8" stopColor="#38B000" />
          <stop offset="1" stopColor="#70E000" />
        </linearGradient>
        <radialGradient id={`${id}-head`}>
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset=".3" stopColor="#70E000" stopOpacity=".85" />
          <stop offset="1" stopColor="#38B000" stopOpacity="0" />
        </radialGradient>
      </defs>
      <path data-cable="" className="ft-halo" stroke="#0062EC" />
      <path data-cable="" className="ft-sheath" stroke="#03256C" />
      <path data-cable="" className="ft-body" stroke={`url(#${id}-body)`} />
      <path data-cable="" className="ft-sheen" stroke="#FFFFFF" />
      <path data-cable="" className="ft-core" stroke="#B9F57A" />
      {[0, 1, 2].map((i) => (
        <path key={i} data-pulse="" className="ft-pulse" stroke="#E8FFD2" style={{ opacity: 0 }} />
      ))}
      <g data-head="" style={{ opacity: 0 }}>
        <circle r="22" fill={`url(#${id}-head)`} opacity=".7" />
        <circle r="3" fill="#FFFFFF" />
      </g>
    </svg>
  );
}
