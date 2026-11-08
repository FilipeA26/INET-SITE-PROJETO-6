import { useEffect, useRef } from "react";

interface CinematicCanvasProps {
  className?: string;
  intensity?: number;
}

/**
 * CinematicCanvas - Fundo cinematográfico encapsulado por seção.
 * Inspirado em lusion.co e activetheory.net:
 * - Profundidade de campo e névoa atmosférica (igloo.inc)
 * - Partículas de luz bioluminescentes e filamentos de fibra fluindo organicamente
 * - Micro-grão analógico 35mm
 * - Zero cabos nas margens laterais; preenchimento contínuo de ponta a ponta (100%)
 * - IntersectionObserver: pausa estrita quando a seção está fora da viewport
 * - Pausa em aba oculta e devicePixelRatio limitado a no máximo 2
 * - Versão estática graciosa em prefers-reduced-motion
 */
export default function CinematicCanvas({ className = "", intensity = 1.0 }: CinematicCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    let width = 0;
    let height = 0;
    let animId = 0;
    let isVisible = false;
    let lastTime = performance.now();
    let time = 0;

    // Canvas estático para micro-grão cinematográfico 35mm
    const grainCanvas = document.createElement("canvas");
    grainCanvas.width = 192;
    grainCanvas.height = 192;
    const gCtx = grainCanvas.getContext("2d");
    if (gCtx) {
      const gImg = gCtx.createImageData(192, 192);
      const buf = new Uint32Array(gImg.data.buffer);
      for (let i = 0; i < buf.length; i++) {
        const val = Math.floor(Math.random() * 255);
        buf[i] = (22 << 24) | (val << 16) | (val << 8) | val;
      }
      gCtx.putImageData(gImg, 0, 0);
    }

    // Partículas de plâncton bioluminescente suaves
    const particleCount = 28;
    const particles = Array.from({ length: particleCount }, (_, i) => ({
      xFrac: ((i * 37) % 100) / 100,
      yFrac: ((i * 53) % 100) / 100,
      radius: 0.6 + (i % 3) * 0.5,
      speedY: 0.006 + (i % 5) * 0.003,
      swayFreq: 0.3 + (i % 4) * 0.15,
      swayAmp: 0.015 + (i % 3) * 0.01,
      alpha: 0.08 + (i % 4) * 0.06,
      isLime: i % 5 === 0,
    }));

    const resize = () => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      width = Math.max(1, Math.floor(rect.width));
      height = Math.max(1, Math.floor(rect.height));

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (motionQuery.matches) {
        drawFrame();
      }
    };

    resize();
    const ro = new ResizeObserver(() => resize());
    ro.observe(canvas);

    const drawFrame = () => {
      if (width <= 0 || height <= 0) return;

      // 1. Fundo base azul-noite profundo (paleta INET #010818 -> #020F2E)
      const grad = ctx.createLinearGradient(0, 0, 0, height);
      grad.addColorStop(0, "#010818");
      grad.addColorStop(0.5, "#020f2e");
      grad.addColorStop(1, "#010818");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // 2. Luz volumétrica suave localizada (light leak no topo/centro - estilo activetheory.net)
      const breath = 0.88 + 0.12 * Math.sin(time * 0.5);
      const leakGrad = ctx.createRadialGradient(
        width * 0.5,
        height * 0.15,
        0,
        width * 0.5,
        height * 0.15,
        Math.max(width, height) * 0.7
      );
      leakGrad.addColorStop(0, `rgba(0, 98, 236, ${0.12 * intensity * breath})`);
      leakGrad.addColorStop(0.4, `rgba(92, 200, 255, ${0.04 * intensity * breath})`);
      leakGrad.addColorStop(1, "rgba(1, 8, 24, 0)");
      ctx.fillStyle = leakGrad;
      ctx.fillRect(0, 0, width, height);

      // 3. Filamentos orgânicos de fibra ótica abissal fluindo suavemente no leito
      // Curvas contínuas sem cabos cortando margens
      const lines = [
        { yBase: 0.80, color: "#0062ec", alpha: 0.22, amp: 24, freq: 0.0018, speed: 0.22 },
        { yBase: 0.86, color: "#5cc8ff", alpha: 0.18, amp: 18, freq: 0.0024, speed: 0.30 },
        { yBase: 0.92, color: "#70e000", alpha: 0.15, amp: 14, freq: 0.0030, speed: 0.26 },
      ];

      for (const line of lines) {
        ctx.save();
        ctx.beginPath();
        const startY = height * line.yBase + Math.sin(time * line.speed) * line.amp;
        ctx.moveTo(0, startY);

        const segments = 24;
        const stepX = width / segments;
        for (let i = 1; i <= segments; i++) {
          const x = i * stepX;
          const y =
            height * line.yBase +
            Math.sin(x * line.freq + time * line.speed) * line.amp +
            Math.cos(x * line.freq * 0.5 + time * 0.15) * (line.amp * 0.4);
          ctx.lineTo(x, y);
        }

        ctx.strokeStyle = line.color;
        ctx.globalAlpha = line.alpha * intensity;
        ctx.lineWidth = 1.6;
        ctx.stroke();

        // Núcleo luminoso sutil
        ctx.strokeStyle = "#e8f7ff";
        ctx.globalAlpha = line.alpha * 0.4 * intensity;
        ctx.lineWidth = 0.8;
        ctx.stroke();
        ctx.restore();
      }

      // 4. Plâncton abissal suave
      ctx.save();
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const sway = Math.sin(time * p.swayFreq + i) * p.swayAmp;
        const px = ((p.xFrac + sway) % 1 + 1) % 1 * width;
        const py = ((p.yFrac - time * p.speedY) % 1 + 1) % 1 * height;

        ctx.fillStyle = p.isLime ? "#70e000" : "#5cc8ff";
        ctx.globalAlpha = p.alpha * intensity;
        ctx.beginPath();
        ctx.arc(px, py, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // 5. Textura de micro-grão 35mm
      ctx.save();
      ctx.globalAlpha = 0.024;
      const grainPat = ctx.createPattern(grainCanvas, "repeat");
      if (grainPat) {
        ctx.fillStyle = grainPat;
        ctx.fillRect(0, 0, width, height);
      }
      ctx.restore();
    };

    const loop = (now: number) => {
      animId = 0;
      if (document.hidden || !isVisible || motionQuery.matches) return;

      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      time += dt;

      drawFrame();
      animId = requestAnimationFrame(loop);
    };

    // IntersectionObserver: pausa o loop quando a seção sai da tela
    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        isVisible = entry ? entry.isIntersecting : false;
        if (isVisible && !motionQuery.matches) {
          lastTime = performance.now();
          if (!animId) animId = requestAnimationFrame(loop);
        } else {
          if (animId) {
            cancelAnimationFrame(animId);
            animId = 0;
          }
        }
      },
      { rootMargin: "80px" }
    );
    io.observe(canvas);

    const onVisibilityChange = () => {
      if (document.hidden) {
        if (animId) {
          cancelAnimationFrame(animId);
          animId = 0;
        }
      } else if (isVisible && !motionQuery.matches) {
        lastTime = performance.now();
        if (!animId) animId = requestAnimationFrame(loop);
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      if (animId) cancelAnimationFrame(animId);
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [intensity]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`absolute inset-0 h-full w-full pointer-events-none -z-10 ${className}`}
    />
  );
}
