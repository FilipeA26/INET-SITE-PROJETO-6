import { useEffect, useRef, type RefObject } from 'react';
import { createPortal } from 'react-dom';

/** Luz sobre o conteúdo, com geometria invisível e deslocamento limitado na tela. */
export default function Thread({ container }: { container: RefObject<HTMLElement> }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const headRef = useRef<SVGGElement>(null);

  useEffect(() => {
    const main = container.current, svg = svgRef.current, path = pathRef.current, head = headRef.current;
    if (!main || !svg || !path || !head) return;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    let total = 0, raf = 0, previous = 0, lastHit = 0;
    let firstY = 0, lastY = 0, inView = true, covered = false, nearControls = false;
    let position: { x: number; y: number } | null = null;
    let opacity = .55, blur = 0;

    const lengthAtY = (y: number) => {
      let lo = 0, hi = total;
      for (let i = 0; i < 22; i++) {
        const mid = (lo + hi) / 2;
        if (path.getPointAtLength(mid).y < y) lo = mid;
        else hi = mid;
      }
      return (lo + hi) / 2;
    };
    const paint = () => {
      if (!position) return;
      head.setAttribute('transform', `translate(${position.x} ${position.y})`);
      head.style.opacity = String(opacity);
      head.style.filter = `blur(${blur}px)`;
    };
    const build = () => {
      const w = main.clientWidth;
      svg.setAttribute('viewBox', `0 0 ${document.documentElement.clientWidth} ${innerHeight}`);
      const top = main.getBoundingClientRect().top + scrollY;
      const margin = w < 640 ? 18 : 26;
      const points = [...main.querySelectorAll<HTMLElement>('[data-node]')].map(el => ({
        x: el.dataset.node === 'left' ? margin : el.dataset.node === 'right' ? w - margin : w / 2,
        y: el.getBoundingClientRect().top + scrollY - top,
      })).sort((a, b) => a.y - b.y);
      if (points.length < 2) { total = 0; head.style.opacity = '0'; return; }
      let d = `M ${points[0].x} ${points[0].y}`;
      for (let i = 1; i < points.length; i++) {
        const a = points[i - 1], b = points[i], dy = b.y - a.y;
        d += ` C ${a.x} ${a.y + dy * .55}, ${b.x} ${b.y - dy * .55}, ${b.x} ${b.y}`;
      }
      path.setAttribute('d', d);
      total = path.getTotalLength();
      firstY = points[0].y;
      lastY = points[points.length - 1].y;
      // Inicialização única; reconstruir a curva nunca reposiciona uma luz já visível.
      if (!position) position = { x: points[0].x, y: Math.max(112, Math.min(innerHeight - 24, points[0].y + main.getBoundingClientRect().top)) };
      paint();
    };
    const sampleContent = (now: number) => {
      if (!position || now - lastHit < 120) return;
      lastHit = now;
      // Os HUDs podem usar pointer-events:none: proximidade por ret?ngulos, al?m do hit test.
      nearControls = position.y < 112 || [...document.querySelectorAll<Element>('nav,header,[class*="fixed"]')].some(el => {
        if (el === svg || svg.contains(el)) return false;
        const style = getComputedStyle(el);
        if (!el.matches('nav,header') && !(style.position === 'fixed' && Number(style.zIndex) >= 40)) return false;
        const r = el.getBoundingClientRect();
        return r.width > 0 && r.height > 0 && position!.x >= r.left - 24 && position!.x <= r.right + 24 && position!.y >= r.top - 24 && position!.y <= r.bottom + 24;
      });
      // pointer-events:none exclui a decoração do hit test. Testa também a vizinhança do núcleo.
      covered = [[0, 0], [-12, 0], [12, 0], [0, -12], [0, 12]].some(([dx, dy]) =>
        document.elementsFromPoint(position!.x + dx, position!.y + dy).some(el =>
          !svg.contains(el) && !!el.closest('h1,h2,h3,h4,p,a,button,label,input,select,textarea,img,video,canvas,article,.card,[role="button"]'),
        ),
      );
    };
    const frame = (now: number) => {
      raf = 0;
      if (document.hidden || !inView || reduced.matches || !total || !position) { previous = 0; return; }
      const dt = previous ? Math.min(50, Math.max(0, now - previous)) : 1000 / 60;
      previous = now;
      const top = main.getBoundingClientRect().top;
      const targetY = Math.max(firstY, Math.min(lastY, innerHeight * .6 - top));
      const point = path.getPointAtLength(lengthAtY(targetY));
      const target = { x: point.x, y: Math.max(112, Math.min(innerHeight - 24, point.y + top)) };
      // 0,035 a 60 Hz; limite vetorial de 480 px/s inclusive em saltos de âncora.
      const alpha = 1 - Math.pow(1 - .035, dt / (1000 / 60));
      const dx = (target.x - position.x) * alpha, dy = (target.y - position.y) * alpha;
      const distance = Math.hypot(dx, dy), step = 480 * dt / 1000;
      const scale = distance > step ? step / distance : 1;
      position.x += dx * scale;
      position.y += dy * scale;
      sampleContent(now);
      const soften = 1 - Math.exp(-dt / 240);
      opacity += ((nearControls ? .01 : covered ? .16 : .55) - opacity) * soften;
      blur += ((nearControls ? 4 : covered ? 3 : 0) - blur) * soften;
      paint();
      raf = requestAnimationFrame(frame);
    };
    const wake = () => {
      cancelAnimationFrame(raf);
      raf = 0;
      previous = 0;
      if (!document.hidden && inView && total && !reduced.matches) raf = requestAnimationFrame(frame);
    };
    const rebuild = () => { build(); wake(); };
    build();
    const resize = new ResizeObserver(rebuild);
    resize.observe(main);
    const intersection = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; head.style.visibility = inView ? 'visible' : 'hidden'; wake(); });
    intersection.observe(main);
    window.addEventListener('resize', rebuild);
    window.addEventListener('load', rebuild);
    document.addEventListener('visibilitychange', wake);
    reduced.addEventListener('change', wake);
    wake();
    return () => {
      cancelAnimationFrame(raf);
      resize.disconnect();
      intersection.disconnect();
      window.removeEventListener('resize', rebuild);
      window.removeEventListener('load', rebuild);
      document.removeEventListener('visibilitychange', wake);
      reduced.removeEventListener('change', wake);
    };
  }, [container]);

  return createPortal(<svg ref={svgRef} className="pointer-events-none fixed inset-0 z-30 h-full w-full overflow-hidden" aria-hidden="true">
    <defs>
      <path ref={pathRef} fill="none" />
      <radialGradient id="head-g">
        <stop offset="0" stopColor="#fff" />
        <stop offset="0.25" stopColor="#B6FF6A" stopOpacity="0.8" />
        <stop offset="1" stopColor="#70E000" stopOpacity="0" />
      </radialGradient>
    </defs>
    <g ref={headRef} style={{ opacity: 0 }}>
      <circle r="16" fill="url(#head-g)" />
      <circle r="2.2" fill="#fff" />
    </g>
  </svg>, document.body);
}
