import { useEffect, useRef, type RefObject } from "react";

/**
 * Um único fio de fibra que atravessa a página inteira e liga as seções.
 * Ele se desenha acompanhando a rolagem (com inércia), tem um ponto de luz
 * na ponta e pulsos de dados correndo pelo trecho já aceso.
 * Cada seção marca um nó com <span data-node="left|right|center" />.
 */
export default function Thread({ container }: { container: RefObject<HTMLElement> }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const baseRef = useRef<SVGPathElement>(null);
  const litRef = useRef<SVGPathElement>(null);
  const headRef = useRef<SVGGElement>(null);
  const pulsesRef = useRef<SVGGElement>(null);
  const nodesRef = useRef<SVGGElement>(null);

  useEffect(() => {
    const main = container.current!;
    const svg = svgRef.current!;
    const base = baseRef.current!;
    const lit = litRef.current!;
    let total = 1, raf = 0, shown = 0;
    let nodeLens: number[] = [];

    // comprimento do fio cuja altura é y (o fio sempre desce, então dá para buscar)
    const lengthAtY = (y: number) => {
      let lo = 0, hi = total;
      for (let i = 0; i < 22; i++) {
        const mid = (lo + hi) / 2;
        if (base.getPointAtLength(mid).y < y) lo = mid;
        else hi = mid;
      }
      return lo;
    };

    const build = () => {
      const w = main.clientWidth, h = main.scrollHeight;
      svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
      svg.style.height = `${h}px`;
      // fica na faixa livre fora do texto (o conteúdo começa em 20px no celular, 40px+ no resto)
      const margin = w < 640 ? 8 : 26;
      const top = main.getBoundingClientRect().top + window.scrollY;
      const pts = [...main.querySelectorAll<HTMLElement>("[data-node]")].map((el) => {
        const side = el.dataset.node;
        const y = el.getBoundingClientRect().top + window.scrollY - top;
        const x = side === "left" ? margin : side === "right" ? w - margin : w / 2;
        return { x, y };
      });
      if (pts.length < 2) return;
      let d = `M ${pts[0].x} ${pts[0].y}`;
      for (let i = 1; i < pts.length; i++) {
        const a = pts[i - 1], b = pts[i];
        const dy = b.y - a.y;
        d += ` C ${a.x} ${a.y + dy * 0.55}, ${b.x} ${b.y - dy * 0.55}, ${b.x} ${b.y}`;
      }
      base.setAttribute("d", d);
      lit.setAttribute("d", d);
      total = base.getTotalLength();
      lit.style.strokeDasharray = `${total}`;
      nodeLens = pts.map((p) => lengthAtY(p.y));
      nodesRef.current!.innerHTML = pts
        .map((p) => `<circle cx="${p.x}" cy="${p.y}" r="5" fill="#010818" stroke="rgba(255,255,255,0.35)" stroke-width="1.5" />`)
        .join("");
    };

    const frame = (now: number) => {
      const top = main.getBoundingClientRect().top + window.scrollY;
      const targetY = window.scrollY + window.innerHeight * 0.6 - top;
      const target = Math.max(0, Math.min(total, lengthAtY(targetY)));
      shown += (target - shown) * 0.07; // inércia: a luz "alcança" a rolagem com suavidade
      lit.style.strokeDashoffset = `${total - shown}`;

      const p = base.getPointAtLength(shown);
      headRef.current!.setAttribute("transform", `translate(${p.x} ${p.y})`);

      // pulsos de dados correndo do início até a ponta
      const pulses = pulsesRef.current!.children;
      for (let i = 0; i < pulses.length; i++) {
        const k = ((now / 1000) * 0.18 + i / pulses.length) % 1;
        const q = base.getPointAtLength(k * shown);
        pulses[i].setAttribute("transform", `translate(${q.x} ${q.y})`);
        (pulses[i] as SVGElement).style.opacity = shown > 40 ? String(Math.sin(k * Math.PI)) : "0";
      }
      // nós acendem quando a luz passa por eles
      const nodes = nodesRef.current!.children;
      for (let i = 0; i < nodes.length; i++) {
        const on = shown >= nodeLens[i] - 2;
        nodes[i].setAttribute("fill", on ? "#70E000" : "#010818");
        nodes[i].setAttribute("stroke", on ? "rgba(112,224,0,0.6)" : "rgba(255,255,255,0.35)");
      }
      raf = requestAnimationFrame(frame);
    };

    build();
    const ro = new ResizeObserver(() => build());
    ro.observe(main);
    window.addEventListener("load", build);
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("load", build);
    };
  }, [container]);

  return (
    <svg ref={svgRef} className="pointer-events-none absolute left-0 top-0 z-0 w-full" aria-hidden="true">
      <defs>
        <linearGradient id="thread-g" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#70E000" />
          <stop offset="0.5" stopColor="#5CC8FF" />
          <stop offset="1" stopColor="#70E000" />
        </linearGradient>
        <radialGradient id="head-g">
          <stop offset="0" stopColor="#fff" />
          <stop offset="0.25" stopColor="#B6FF6A" stopOpacity="0.8" />
          <stop offset="1" stopColor="#70E000" stopOpacity="0" />
        </radialGradient>
      </defs>
      <path ref={baseRef} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" />
      <path ref={litRef} fill="none" stroke="url(#thread-g)" strokeWidth="2" strokeLinecap="round" style={{ filter: "drop-shadow(0 0 6px rgba(112,224,0,0.7))" }} />
      <g ref={nodesRef} />
      <g ref={pulsesRef}>
        {[0, 1, 2, 3].map((i) => (
          <circle key={i} r="3" fill="#fff" style={{ filter: "drop-shadow(0 0 6px #70E000)" }} />
        ))}
      </g>
      <g ref={headRef}>
        <circle r="26" fill="url(#head-g)" />
        <circle r="3.5" fill="#fff" />
      </g>
    </svg>
  );
}
