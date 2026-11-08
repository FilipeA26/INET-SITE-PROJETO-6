import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { ArrowDown, ArrowUpRight, ShieldCheck, MapPin, Phone, Building2 } from "lucide-react";
import { COMPANY, COVERAGE_CITIES, PHONES, STORES, waLink } from "../../data/inet";
import { SPRING } from "../../motion";

export default function NameHero() {
  const containerRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const slotRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  // Deslocamento para centrar o nome no início e encaixar no slot no final
  const [offsets, setOffsets] = useState({ startX: 0, startY: 0, startScale: 3.2 });

  useEffect(() => {
    function measure() {
      if (!stageRef.current || !slotRef.current) return;
      const stageRect = stageRef.current.getBoundingClientRect();
      const slotRect = slotRef.current.getBoundingClientRect();

      const cx = stageRect.width / 2;
      const cy = stageRect.height / 2;
      const tx = slotRect.left - stageRect.left + slotRect.width / 2;
      const ty = slotRect.top - stageRect.top + slotRect.height / 2;

      const isMobile = stageRect.width < 768;
      const scale = isMobile ? 2.4 : 3.4;

      setOffsets({
        startX: cx - tx,
        startY: cy - ty,
        startScale: scale,
      });
    }

    measure();
    window.addEventListener("resize", measure, { passive: true });
    return () => window.removeEventListener("resize", measure);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const p = useSpring(scrollYProgress, SPRING);

  // Transformações do INET voando do centro para o texto institucional
  const flyingX = useTransform(p, [0, 0.65], [offsets.startX, 0]);
  const flyingY = useTransform(p, [0, 0.65], [offsets.startY, 0]);
  const flyingScale = useTransform(p, [0, 0.65], [offsets.startScale, 1]);

  // Transições da abertura (fade out no início)
  const openingOpacity = useTransform(p, [0, 0.22], [1, 0]);
  const openingY = useTransform(p, [0, 0.22], [0, -25]);

  // Revelação das linhas de texto complementares ("SOMOS A", "INTERNET FIBRA ÓPTICA", "DE TEÓFILO OTONI")
  const textRevealOpacity = useTransform(p, [0.22, 0.62], [0, 1]);
  const textRevealY = useTransform(p, [0.22, 0.62], [24, 0]);

  // Revelação da coluna institucional à direita
  const infoOpacity = useTransform(p, [0.32, 0.68], [0, 1]);
  const infoX = useTransform(p, [0.32, 0.68], [28, 0]);

  return (
    <section
      ref={containerRef}
      className="inet-name-hero relative min-h-[220svh] bg-navy-ink text-white"
      aria-label="Apresentação INET"
    >
      <div
        ref={stageRef}
        className="inet-name-stage sticky top-0 flex h-[100svh] w-full items-center justify-center overflow-clip px-5 sm:px-10 lg:px-16"
      >
        {/* Fundo com iluminação sutil de fibra ótica */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(0,98,236,0.16),transparent_65%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_75%,rgba(56,176,0,0.08),transparent_55%)]" />
          {/* Cruzes de grade nos quatro cantos (estilo Lusion) */}
          <span className="absolute left-6 top-24 font-mono text-xs text-white/20 sm:left-12 sm:top-28">+</span>
          <span className="absolute right-6 top-24 font-mono text-xs text-white/20 sm:right-12 sm:top-28">+</span>
          <span className="absolute bottom-10 left-6 font-mono text-xs text-white/20 sm:left-12 sm:bottom-12">+</span>
          <span className="absolute bottom-10 right-6 font-mono text-xs text-white/20 sm:right-12 sm:bottom-12">+</span>
        </div>

        {/* Tag inicial no topo da tela (some ao rolar) */}
        <motion.div
          style={reduced ? { opacity: 0 } : { opacity: openingOpacity, y: openingY }}
          className="pointer-events-none absolute top-28 z-20 text-center sm:top-32"
        >
          <span className="tag">Internet 100% fibra óptica · Teófilo Otoni</span>
          <h1 className="sr-only">INET Telecomunicações — Internet Fibra Óptica</h1>
        </motion.div>

        {/* Indicador de rolagem inicial (some ao rolar) */}
        <motion.div
          style={reduced ? { opacity: 0 } : { opacity: openingOpacity }}
          className="pointer-events-none absolute bottom-8 z-20 flex flex-col items-center gap-2 text-white/50 sm:bottom-12"
        >
          <span className="font-mono text-[11px] uppercase tracking-widest text-white/60">Role para conhecer</span>
          <ArrowDown size={14} className="animate-bounce text-lime" />
        </motion.div>

        {/* Grade principal de conteúdo institucional */}
        <div className="wrap relative z-10 grid w-full items-center gap-10 md:grid-cols-12 md:gap-8 lg:gap-14">
          {/* Coluna esquerda: frase tipográfica onde o nome INET encaixa */}
          <div className="md:col-span-7">
            <div className="font-display font-light tracking-[-0.03em] text-white">
              {/* Linha 1 */}
              <div className="overflow-clip py-0.5">
                <motion.p
                  style={reduced ? {} : { opacity: textRevealOpacity, y: textRevealY }}
                  className="text-2xl font-light text-white/80 sm:text-4xl lg:text-5xl"
                >
                  SOMOS A
                </motion.p>
              </div>

              {/* Linha 2: o slot exato do INET voando */}
              <div ref={slotRef} className="relative inline-flex items-center py-1 sm:py-2">
                <motion.div
                  style={
                    reduced
                      ? {}
                      : {
                          x: flyingX,
                          y: flyingY,
                          scale: flyingScale,
                          transformOrigin: "center center",
                        }
                  }
                  className="font-display font-black tracking-[-0.04em] text-lime select-none text-4xl sm:text-6xl lg:text-7xl drop-shadow-[0_0_35px_rgba(112,224,0,0.4)]"
                >
                  INET
                </motion.div>
              </div>

              {/* Linha 3 */}
              <div className="overflow-clip py-0.5">
                <motion.p
                  style={reduced ? {} : { opacity: textRevealOpacity, y: textRevealY }}
                  className="text-2xl font-light text-white sm:text-4xl lg:text-5xl"
                >
                  INTERNET FIBRA ÓPTICA
                </motion.p>
              </div>

              {/* Linha 4 */}
              <div className="overflow-clip py-0.5">
                <motion.p
                  style={reduced ? {} : { opacity: textRevealOpacity, y: textRevealY }}
                  className="text-xl font-medium tracking-normal text-white/65 sm:text-3xl lg:text-4xl"
                >
                  DE TEÓFILO OTONI
                </motion.p>
              </div>
            </div>
          </div>

          {/* Coluna direita: informações reais da empresa (COMPANY, STORES, PHONES) */}
          <div className="md:col-span-5">
            <motion.div
              style={reduced ? {} : { opacity: infoOpacity, x: infoX }}
              className="rounded-3xl border border-white/10 bg-[#020F2E]/85 p-6 backdrop-blur-md sm:p-8"
            >
              <div className="flex items-center gap-2">
                <Building2 size={16} className="text-lime" />
                <span className="font-mono text-xs uppercase tracking-wider text-white/60">
                  {COMPANY.legalName}
                </span>
              </div>

              <p className="mt-3 text-xs font-mono text-white/45">
                CNPJ {COMPANY.cnpj} · {COMPANY.city} / {COMPANY.state}
              </p>

              <div className="mt-5 space-y-3 border-t border-white/10 pt-4 text-xs text-white/80 sm:text-sm">
                <div className="flex items-start gap-2.5">
                  <MapPin size={16} className="mt-0.5 shrink-0 text-lime" />
                  <div>
                    <span className="font-semibold text-white">4 lojas físicas:</span>
                    <p className="text-white/70">Centro, Grão Pará, Concórdia e Carlos Chagas.</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Phone size={16} className="mt-0.5 shrink-0 text-electric" />
                  <div>
                    <span className="font-semibold text-white">Central 24 horas:</span>
                    <p className="text-white/70">{PHONES[0].display} · {PHONES[2].display}</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <ShieldCheck size={16} className="mt-0.5 shrink-0 text-leaf" />
                  <div>
                    <span className="font-semibold text-white">Fibra óptica:</span>
                    <p className="text-white/70">Planos de até 1 Giga com Wi-Fi grátis e suporte 24h.</p>
                  </div>
                </div>
              </div>

              <div className="mt-7 flex flex-wrap items-center gap-3">
                <a href="#planos" className="btn-lime text-xs sm:text-sm">
                  Ver planos
                </a>
                <Link to="/cobertura" className="btn-ghost text-xs sm:text-sm">
                  Lojas e cobertura <ArrowUpRight size={14} aria-hidden="true" />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
