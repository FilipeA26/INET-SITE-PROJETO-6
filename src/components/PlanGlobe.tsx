import { useEffect, useRef } from "react";

type Coordinate = [number, number];
type Land = { points: Coordinate[]; coastlines: Coordinate[][] };
type Vector = [number, number, number];
const ORIGIN: Coordinate = [-41.51, -17.86];
// Decorative routes express connectivity, not a claim of INET coverage.
const DESTINATIONS: Coordinate[] = [[-74, 40.7], [-9.1, 38.7], [18.4, -33.9], [139.7, 35.7], [151.2, -33.9]];
const vector = ([lng, lat]: Coordinate): Vector => {
  const p = lat * Math.PI / 180, l = lng * Math.PI / 180;
  return [Math.cos(p) * Math.sin(l), Math.sin(p), Math.cos(p) * Math.cos(l)];
};
const start = vector(ORIGIN);
const routes = DESTINATIONS.map((destination) => {
  const end = vector(destination);
  const angle = Math.acos(Math.max(-1, Math.min(1, start.reduce((sum, v, i) => sum + v * end[i], 0))));
  return Array.from({ length: 81 }, (_, i): Vector => {
    const t = i / 80, a = Math.sin((1 - t) * angle) / Math.sin(angle), b = Math.sin(t * angle) / Math.sin(angle);
    const altitude = 1.015 + Math.sin(t * Math.PI) * .23;
    return start.map((v, axis) => (v * a + end[axis] * b) * altitude) as Vector;
  });
});

/** Live orthographic Earth. No WebGL dependency or downloaded video. */
export default function PlanGlobe() {
  const host = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const container = host.current, surface = canvas.current;
    if (!container || !surface) return;
    const ctx = surface.getContext("2d", { alpha: true });
    if (!ctx) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let land: Land | null = null, width = 0, height = 0, visible = false;
    let frame = 0, last = 0, time = 0, disposed = false;
    const controller = new AbortController();
    const draw = () => {
      if (!land || !width || !height) return;
      const mobile = width < 600;
      const radius = Math.min(width * (mobile ? .86 : .46), height * .64);
      const cx = width / 2, cy = height * .47;
      // Start with the Atlantic and Brazil facing the visitor.
      const rotation = .58 + time * .035, tilt = -.12;
      const project = (v: Vector) => {
        const x = v[0] * Math.cos(rotation) + v[2] * Math.sin(rotation);
        const z = -v[0] * Math.sin(rotation) + v[2] * Math.cos(rotation);
        const y = v[1] * Math.cos(tilt) - z * Math.sin(tilt);
        return { x: cx + x * radius, y: cy - y * radius, z: v[1] * Math.sin(tilt) + z * Math.cos(tilt) };
      };
      ctx.clearRect(0, 0, width, height);
      // Soft atmospheric limb approximates the Fresnel falloff of a sphere.
      const atmosphere = ctx.createRadialGradient(cx, cy, radius * .90, cx, cy, radius * 1.10);
      atmosphere.addColorStop(0, 'rgba(0,98,236,0)');
      atmosphere.addColorStop(.48, 'rgba(92,200,255,.30)');
      atmosphere.addColorStop(.63, 'rgba(0,98,236,.17)');
      atmosphere.addColorStop(1, 'rgba(0,98,236,0)');
      ctx.fillStyle = atmosphere; ctx.fillRect(0, 0, width, height);
      const ocean = ctx.createRadialGradient(cx - radius * .36, cy - radius * .4, 0, cx, cy, radius);
      ocean.addColorStop(0, '#03256C'); ocean.addColorStop(.67, '#020F2E'); ocean.addColorStop(1, '#021638');
      ctx.beginPath(); ctx.arc(cx, cy, radius, 0, Math.PI * 2); ctx.fillStyle = ocean; ctx.fill();
      const trace = (coordinates: Vector[], color: string, lineWidth: number) => {
        ctx.beginPath(); let pen = false;
        for (const v of coordinates) {
          const p = project(v);
          if (p.z < .015) { pen = false; continue; }
          if (!pen) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y);
          pen = true;
        }
        ctx.strokeStyle = color; ctx.lineWidth = lineWidth; ctx.stroke();
      };
      if (!mobile) for (const ring of land.coastlines) trace(ring.map(vector), 'rgba(0,98,236,.42)', .65);
      for (let i = 0; i < land.points.length; i += mobile ? 2 : 1) {
        const p = project(vector(land.points[i]));
        if (p.z <= 0) continue;
        ctx.globalAlpha = .28 + p.z * .68;
        ctx.fillStyle = i % 5 === 0 ? '#0062EC' : '#5CC8FF';
        ctx.beginPath(); ctx.arc(p.x, p.y, mobile ? 1.1 : 1.25, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalAlpha = 1;
      routes.slice(0, mobile ? 3 : 5).forEach((route, i) => {
        trace(route, 'rgba(92,200,255,.32)', mobile ? .75 : 1);
        const progress = (time * .065 + i * .19) % 1;
        const pulse = project(route[Math.floor(progress * 80)]);
        if (pulse.z <= .015) return;
        ctx.fillStyle = '#70E000'; ctx.beginPath(); ctx.arc(pulse.x, pulse.y, 2.2, 0, Math.PI * 2); ctx.fill();
      });
      const origin = project(start);
      if (origin.z > 0) {
        ctx.strokeStyle = 'rgba(112,224,0,.5)'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.arc(origin.x, origin.y, 6, 0, Math.PI * 2); ctx.stroke();
        ctx.fillStyle = '#70E000'; ctx.beginPath(); ctx.arc(origin.x, origin.y, 2.5, 0, Math.PI * 2); ctx.fill();
      }
    };
    const tick = (now: number) => {
      frame = 0;
      if (!visible || document.hidden || motion.matches || disposed) return;
      // Cap at 30 fps; elapsed time excludes paused intervals.
      if (now - last >= 1000 / 30) { time += Math.min((now - last) / 1000, .05); last = now; draw(); }
      frame = requestAnimationFrame(tick);
    };
    const sync = () => {
      cancelAnimationFrame(frame); frame = 0; last = performance.now();
      if (visible && !document.hidden) { draw(); if (!motion.matches) frame = requestAnimationFrame(tick); }
    };
    const resize = new ResizeObserver(() => {
      width = container.clientWidth; height = container.clientHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, width < 600 ? 1.25 : 2);
      surface.width = Math.round(width * dpr); surface.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); sync();
    });
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); });
    resize.observe(container); observer.observe(container);
    document.addEventListener('visibilitychange', sync); motion.addEventListener('change', sync);
    fetch(`${import.meta.env.BASE_URL}plan-globe-land.json`, { signal: controller.signal })
      .then(response => { if (!response.ok) throw new Error('Globe land unavailable'); return response.json() as Promise<Land>; })
      .then(data => { if (!disposed) { land = data; sync(); } })
      .catch(() => { /* Decorative failure leaves the readable navy panel intact. */ });
    return () => {
      disposed = true; controller.abort(); cancelAnimationFrame(frame); resize.disconnect(); observer.disconnect();
      document.removeEventListener('visibilitychange', sync); motion.removeEventListener('change', sync);
    };
  }, []);
  return <div ref={host} aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[0.85]"><canvas ref={canvas} className="h-full w-full" /></div>;
}
