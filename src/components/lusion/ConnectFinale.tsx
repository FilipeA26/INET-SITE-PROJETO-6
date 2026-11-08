import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, MessageCircle, Phone, MapPin } from "lucide-react";
import { PHONES, STORES, waLink } from "../../data/inet";

type ShapeType = "circle" | "cross" | "square" | "triangle";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  shape: ShapeType;
  size: number;
  rotation: number;
  vrot: number;
  opacity: number;
  floorOffset: number;
}

export default function ConnectFinale() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const buttonRef = useRef<HTMLAnchorElement>(null);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let rafId = 0;
    let isVisible = true;
    let mouseX = -9999;
    let mouseY = -9999;

    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const shapes: ShapeType[] = ["circle", "cross", "square", "triangle"];
    let particles: Particle[] = [];

    function resize() {
      if (!canvas || !section) return;
      const rect = section.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      const count = width < 640 ? 140 : 340;

      if (reduced) {
        particles = Array.from({ length: count }, (_, i) => ({
          x: (width / count) * i + (Math.random() - 0.5) * 15,
          y: height - 15 - Math.random() * 35,
          vx: 0,
          vy: 0,
          shape: shapes[i % shapes.length],
          size: 5 + Math.random() * 5,
          rotation: Math.random() * Math.PI * 2,
          vrot: 0,
          opacity: 0.4 + Math.random() * 0.5,
          floorOffset: Math.random() * 25,
        }));
        drawStatic();
        return;
      }

      particles = Array.from({ length: count }, (_, i) => ({
        x: Math.random() * width,
        y: Math.random() * (height * 0.65),
        vx: (Math.random() - 0.5) * 1.5,
        vy: 0.5 + Math.random() * 2,
        shape: shapes[i % shapes.length],
        size: 5 + Math.random() * 6,
        rotation: Math.random() * Math.PI * 2,
        vrot: (Math.random() - 0.5) * 0.05,
        opacity: 0.45 + Math.random() * 0.45,
        floorOffset: Math.random() * 30,
      }));
    }

    function drawStatic() {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.scale(dpr, dpr);
      for (const p of particles) {
        drawParticle(ctx, p);
      }
      ctx.restore();
    }

    function drawParticle(c: CanvasRenderingContext2D, p: Particle) {
      c.save();
      c.translate(p.x, p.y);
      c.rotate(p.rotation);
      c.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
      c.strokeStyle = `rgba(255, 255, 255, ${p.opacity})`;
      c.lineWidth = 1.5;

      switch (p.shape) {
        case "circle":
          c.beginPath();
          c.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          c.fill();
          break;
        case "square":
          c.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
          break;
        case "cross":
          c.beginPath();
          c.moveTo(-p.size / 2, 0);
          c.lineTo(p.size / 2, 0);
          c.moveTo(0, -p.size / 2);
          c.lineTo(0, p.size / 2);
          c.stroke();
          break;
        case "triangle":
          c.beginPath();
          c.moveTo(0, -p.size / 2);
          c.lineTo(p.size / 2, p.size / 2);
          c.lineTo(-p.size / 2, p.size / 2);
          c.closePath();
          c.fill();
          break;
      }
      c.restore();
    }

    function animate() {
      if (!isVisible || !canvas || !ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.scale(dpr, dpr);

      let btnRect: { left: number; right: number; top: number; bottom: number; cx: number } | null = null;
      if (buttonRef.current && section) {
        const sRect = section.getBoundingClientRect();
        const bRect = buttonRef.current.getBoundingClientRect();
        btnRect = {
          left: bRect.left - sRect.left - 10,
          right: bRect.right - sRect.left + 10,
          top: bRect.top - sRect.top - 8,
          bottom: bRect.bottom - sRect.top + 8,
          cx: bRect.left - sRect.left + bRect.width / 2,
        };
      }

      const floorY = height - 18;

      for (const p of particles) {
        p.vy += 0.12;
        p.vx *= 0.985;
        p.vy *= 0.985;

        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.vrot;

        if (p.x < 10) {
          p.x = 10;
          p.vx = Math.abs(p.vx) * 0.5;
        } else if (p.x > width - 10) {
          p.x = width - 10;
          p.vx = -Math.abs(p.vx) * 0.5;
        }

        const targetFloor = floorY - p.floorOffset;
        if (p.y >= targetFloor) {
          p.y = targetFloor;
          p.vy = -p.vy * 0.22;
          p.vx *= 0.85;
          p.vrot *= 0.85;
        }

        if (btnRect) {
          if (p.x >= btnRect.left && p.x <= btnRect.right && p.y >= btnRect.top && p.y <= btnRect.bottom) {
            if (p.x > btnRect.cx) {
              p.vx += 1.4;
            } else {
              p.vx -= 1.4;
            }
            if (p.y < btnRect.top + 16) {
              p.y = btnRect.top;
              p.vy = -Math.abs(p.vy) * 0.35;
            }
          }
        }

        const dx = p.x - mouseX;
        const dy = p.y - mouseY;
        const dist = Math.hypot(dx, dy);
        const radius = 135;

        if (dist < radius && dist > 0.001) {
          const force = ((radius - dist) / radius) * 8.5;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        }

        drawParticle(ctx, p);
      }

      ctx.restore();
      rafId = requestAnimationFrame(animate);
    }

    const onPointerMove = (e: PointerEvent) => {
      const rect = section.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };

    const onPointerLeave = () => {
      mouseX = -9999;
      mouseY = -9999;
    };

    section.addEventListener("pointermove", onPointerMove, { passive: true });
    section.addEventListener("pointerleave", onPointerLeave, { passive: true });

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        isVisible = entry.isIntersecting;
        if (isVisible && !reduced) {
          cancelAnimationFrame(rafId);
          rafId = requestAnimationFrame(animate);
        } else {
          cancelAnimationFrame(rafId);
        }
      },
      { threshold: 0.05 }
    );

    observer.observe(section);
    resize();
    window.addEventListener("resize", resize, { passive: true });

    if (!reduced) {
      rafId = requestAnimationFrame(animate);
    }

    return () => {
      cancelAnimationFrame(rafId);
      observer.disconnect();
      section.removeEventListener("pointermove", onPointerMove);
      section.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("resize", resize);
    };
  }, [reduced]);

  return (
    <section
      ref={sectionRef}
      data-contrast="dark"
      className="inet-connect-finale relative min-h-[85svh] w-full overflow-clip bg-gradient-to-b from-[#021B5B] via-[#002B82] to-[#011442] text-white flex flex-col justify-between py-16 sm:py-24"
      aria-label="Vamos nos conectar?"
    >
      {/* Arte estática por baixo caso WebGL/Canvas não renderize (regra 4) */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-28 w-full opacity-30"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="15%" cy="85%" r="4" fill="#ffffff" />
        <rect x="25%" y="82%" width="6" height="6" fill="#ffffff" />
        <circle cx="38%" cy="88%" r="3" fill="#ffffff" />
        <rect x="52%" y="84%" width="5" height="5" fill="#ffffff" />
        <circle cx="70%" cy="86%" r="4" fill="#ffffff" />
        <rect x="85%" y="80%" width="6" height="6" fill="#ffffff" />
      </svg>

      {/* Canvas 2D interativo das partículas */}
      <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 z-0 h-full w-full" />

      {/* Conteúdo principal sobreposto com margem no estilo Lusion */}
      <div className="relative z-10 mx-auto w-full max-w-5xl px-5 sm:px-10 lg:px-[max(6vw,60px)] flex flex-col items-center text-center">
        <span className="tag text-lime tracking-[0.25em]">FALE COM A INET</span>

        <h2 className="font-display font-light text-5xl sm:text-7xl lg:text-8xl tracking-[-0.03em] text-white mt-4 max-w-4xl leading-[1.04]">
          Vamos nos <span className="italic text-lime font-normal">conectar?</span>
        </h2>

        <p className="lead mt-6 max-w-2xl text-white/85">
          Planos de até 1 Giga com Wi-Fi grátis, TV, telefone fixo e chip 5G. Suporte técnico 24 horas pelo WhatsApp.
        </p>

        {/* Botão-pílula de WhatsApp comercial */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <a
            ref={buttonRef}
            href={waLink("Olá! Quero contratar a internet fibra da INET.")}
            target="_blank"
            rel="noreferrer"
            className="btn bg-lime text-navy-ink text-base font-bold px-8 py-4 rounded-full shadow-[0_20px_50px_-10px_rgba(112,224,0,0.55)] flex items-center gap-2.5 transition-transform hover:scale-105"
          >
            <MessageCircle size={20} className="shrink-0 text-navy-ink" />
            <span>Conversar pelo WhatsApp</span>
            <ArrowUpRight size={17} className="shrink-0 text-navy-ink" />
          </a>
        </div>

        {/* Telefones reais e atendimento */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm text-white/80">
          <div className="flex items-center gap-2">
            <Phone size={14} className="text-lime" />
            <span>Central e WhatsApp: <strong className="text-white">{PHONES[0].display}</strong></span>
          </div>
          <span className="hidden sm:inline text-white/30">•</span>
          <div className="flex items-center gap-2">
            <span>Ligação gratuita: <strong className="text-white">{PHONES[2].display}</strong></span>
          </div>
        </div>

        {/* Lojas físicas */}
        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-white/70">
          <MapPin size={13} className="text-lime" />
          <span>4 lojas: Centro, Grão Pará, Concórdia e Carlos Chagas.</span>
        </div>
      </div>

      <div className="relative z-10 text-center mt-12 text-[11px] font-mono uppercase tracking-widest text-white/50">
        INET TELECOMUNICAÇÕES LTDA · TEÓFILO OTONI - MG
      </div>
    </section>
  );
}
