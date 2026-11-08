import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform, useInView } from "framer-motion";
import { Zap, AppWindow, ShieldCheck, Headset } from "lucide-react";
import { SPRING } from "../../motion";

interface CardData {
  id: string;
  index: string;
  icon: typeof Zap;
  title: string;
  text: string;
  fanAngle: number;
  xOffsetPixels: number;
}

// As 4 cartas do bloco "04 — Por que INET" da Home com textos exatos do site
const CARDS: CardData[] = [
  {
    id: "rapida",
    index: "01",
    icon: Zap,
    title: "Internet ultrarrápida",
    text: "Filmes e jogos sem travar.",
    fanAngle: -13.5,
    xOffsetPixels: -420,
  },
  {
    id: "streaming",
    index: "02",
    icon: AppWindow,
    title: "Streaming incluso",
    text: "HBO Max, Disney+ e Deezer nos planos.",
    fanAngle: -4.5,
    xOffsetPixels: -140,
  },
  {
    id: "estabilidade",
    index: "03",
    icon: ShieldCheck,
    title: "Estabilidade",
    text: "Fibra de ponta a ponta.",
    fanAngle: 4.5,
    xOffsetPixels: 140,
  },
  {
    id: "suporte",
    index: "04",
    icon: Headset,
    title: "Suporte 24 horas",
    text: "Todos os dias, a qualquer hora.",
    fanAngle: 13.5,
    xOffsetPixels: 420,
  },
];

/** Verso da carta de baralho em linhas finas azuis com borda branca (SVG próprio INET) */
function CardBack({ card }: { card: CardData }) {
  return (
    <div
      style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
      className="absolute inset-0 flex flex-col justify-between overflow-hidden rounded-[1.75rem] border border-white/50 bg-gradient-to-br from-[#003F99] via-[#021B5B] to-[#010D2C] p-6 shadow-[0_25px_60px_-15px_rgba(0,18,60,0.8)]"
    >
      {/* Moldura de linhas finas geométricas brancas */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={`grad-t3-${card.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#94FFFB" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#70E000" stopOpacity="0.8" />
          </linearGradient>
          <pattern id={`dots-t3-${card.id}`} width="18" height="18" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="0.75" fill="#ffffff" fillOpacity="0.15" />
          </pattern>
        </defs>

        {/* Fundo pontilhado sutil */}
        <rect width="100%" height="100%" fill={`url(#dots-t3-${card.id})`} />

        {/* Moldura externa e interna em traço fino */}
        <rect x="10" y="10" width="calc(100% - 20px)" height="calc(100% - 20px)" rx="20" fill="none" stroke="#ffffff" strokeOpacity="0.35" strokeWidth="1" />
        <rect x="16" y="16" width="calc(100% - 32px)" height="calc(100% - 32px)" rx="16" fill="none" stroke={`url(#grad-t3-${card.id})`} strokeWidth="1" strokeDasharray="6 4" />

        {/* Nós ópticos nos quatro cantos */}
        <circle cx="26" cy="26" r="3" fill="#ffffff" />
        <circle cx="calc(100% - 26px)" cy="26" r="3" fill="#ffffff" />
        <circle cx="26" cy="calc(100% - 26px)" r="3" fill="#ffffff" />
        <circle cx="calc(100% - 26px)" cy="calc(100% - 26px)" r="3" fill="#ffffff" />

        {/* Linhas de fibra convergindo para o centro */}
        <path d="M 26 26 L 80 80 M calc(100% - 26px) 26 L calc(100% - 80px) 80 M 26 calc(100% - 26px) L 80 calc(100% - 80px) M calc(100% - 26px) calc(100% - 26px) L calc(100% - 80px) calc(100% - 80px)" stroke="#ffffff" strokeOpacity="0.3" strokeWidth="0.75" />

        {/* Arco central da logo INET */}
        <g transform="translate(132, 195) scale(0.85)">
          <path d="M -70 20 C -40 -50, 40 -50, 70 20" fill="none" stroke={`url(#grad-t3-${card.id})`} strokeWidth="3" strokeLinecap="round" />
          <path d="M -50 25 C -25 -25, 25 -25, 50 25" fill="none" stroke="#ffffff" strokeOpacity="0.5" strokeWidth="1.2" strokeLinecap="round" />
          <circle cx="0" cy="-22" r="4" fill="#ffffff" />
        </g>
      </svg>

      {/* Topo do verso */}
      <div className="relative z-10 flex items-center justify-between text-white/80">
        <span className="font-mono text-xs font-semibold tracking-wider text-lime">{card.index}</span>
        <span className="font-mono text-[11px] text-white/60">Fibra óptica INET</span>
      </div>

      {/* Centro do verso */}
      <div className="relative z-10 text-center">
        <span className="font-display text-4xl font-black tracking-wider text-white drop-shadow-[0_0_20px_rgba(0,98,236,0.8)]">
          INET
        </span>
        <p className="mt-1 font-mono text-[10px] text-white/50">
          Teófilo Otoni · MG
        </p>
      </div>

      {/* Rodapé invertido do verso */}
      <div className="relative z-10 flex items-center justify-between text-white/80 rotate-180">
        <span className="font-mono text-xs font-semibold tracking-wider text-lime">{card.index}</span>
        <span className="font-mono text-[11px] text-white/60">Fibra óptica INET</span>
      </div>
    </div>
  );
}

/** Frente da carta estilo baralho refinado sobre fundo escuro de contraste */
function CardFront({ card }: { card: CardData }) {
  const Icon = card.icon;
  return (
    <div
      style={{ backfaceVisibility: "hidden" }}
      className="absolute inset-0 flex flex-col justify-between rounded-[1.75rem] border border-white/80 bg-[#F4F7FC] p-6 text-[#010818] shadow-[0_30px_70px_-15px_rgba(0,10,40,0.6)]"
    >
      {/* Topo estilo carta de baralho */}
      <div>
        <div className="flex items-center justify-between border-b border-black/10 pb-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-base font-bold text-electric">{card.index}</span>
            <Icon size={16} className="text-electric" />
          </div>
          <span className="font-mono text-[11px] text-black/50">
            {card.title}
          </span>
        </div>
      </div>

      {/* Conteúdo central (exatamente os dados originais do site) */}
      <div className="my-auto py-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-electric/10 text-electric mb-5">
          <Icon size={24} />
        </div>
        <h3 className="font-display text-2xl font-bold leading-tight text-navy-deep">
          {card.title}
        </h3>
        <p className="mt-3 text-base leading-relaxed text-black/70">
          {card.text}
        </p>
      </div>

      {/* Rodapé espelhado de cabeça para baixo */}
      <div className="flex items-center justify-between border-t border-black/10 pt-3 rotate-180 text-black/50">
        <div className="flex items-center gap-2">
          <span className="font-mono text-base font-bold text-electric">{card.index}</span>
          <Icon size={16} className="text-electric" />
        </div>
        <span className="font-mono text-[10px]">
          {card.title}
        </span>
      </div>
    </div>
  );
}

/** Carta individual na versão Desktop */
function DesktopCard({
  card,
  index,
  progress,
  floatY,
  reduced,
}: {
  card: CardData;
  index: number;
  progress: any;
  floatY: number;
  reduced: boolean | null;
}) {
  const startFlip = 0.12 + index * 0.06;
  const endFlip = startFlip + 0.22;

  const rotateY = useTransform(progress, [0, startFlip, endFlip, 1], [180, 180, 0, 0]);

  const x = useTransform(
    progress,
    [0, 0.14, 0.48, 1],
    [0, 0, card.xOffsetPixels, card.xOffsetPixels]
  );

  const rotateZ = useTransform(
    progress,
    [0, 0.15, 0.45, 0.75, 1],
    [0, 0, card.fanAngle, card.fanAngle * 0.7, card.fanAngle * 0.7]
  );

  return (
    <motion.div
      style={
        reduced
          ? {
              position: "relative",
              transformStyle: "preserve-3d",
            }
          : {
              position: "absolute",
              transformStyle: "preserve-3d",
              x,
              rotateY,
              rotateZ,
              y: floatY,
            }
      }
      className="h-[390px] w-[265px] shrink-0 select-none cursor-default"
    >
      <CardBack card={card} />
      <CardFront card={card} />
    </motion.div>
  );
}

/** Carta individual na versão Mobile */
function MobileCard({ card }: { card: CardData }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { margin: "-18% 0px -18% 0px", once: false });
  const reduced = useReducedMotion();

  return (
    <div ref={cardRef} className="perspective-[1000px] flex justify-center py-4">
      <motion.div
        initial={reduced ? { rotateY: 0 } : { rotateY: 180 }}
        animate={reduced ? { rotateY: 0 } : { rotateY: isInView ? 0 : 180 }}
        transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
        style={{ transformStyle: "preserve-3d" }}
        className="relative h-[380px] w-[270px] select-none shadow-2xl"
      >
        <CardBack card={card} />
        <CardFront card={card} />
      </motion.div>
    </div>
  );
}

export default function ValueCards() {
  const containerRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);
  const [time, setTime] = useState(0);

  useEffect(() => {
    function checkWidth() {
      setIsMobile(window.innerWidth < 812);
    }
    checkWidth();
    window.addEventListener("resize", checkWidth, { passive: true });
    return () => window.removeEventListener("resize", checkWidth);
  }, []);

  useEffect(() => {
    if (reduced || isMobile) return;
    let rafId: number;
    function loop(t: number) {
      setTime(t / 1000);
      rafId = requestAnimationFrame(loop);
    }
    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, [reduced, isMobile]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const p = useSpring(scrollYProgress, SPRING);

  return (
    <div id="por-que-inet" data-contrast="dark" className="relative w-full">
      {!isMobile ? (
        <section
          ref={containerRef}
          className="inet-value-cards-desktop relative min-h-[280svh] bg-gradient-to-b from-[#021B5B] via-[#002776] to-[#011442] text-white"
          aria-label="Por que INET"
        >
          <div className="sticky top-0 flex h-[100svh] flex-col justify-center overflow-clip px-5 sm:px-10 lg:px-[max(6vw,60px)] pt-16">
            {/* Cabeçalho da seção com alinhamento Lusion */}
            <div className="w-full text-center mb-6 pointer-events-none">
              <span className="tag text-lime tracking-[0.25em]">04 — Por que INET</span>
              <h2 className="h-lg mt-2 text-white">
                Fibra óptica, <span className="italic text-lime">wi-fi grátis e muito conteúdo.</span>
              </h2>
            </div>

            <div
              style={{ perspective: 1300 }}
              className="relative mx-auto flex h-[410px] w-full max-w-6xl items-center justify-center mt-2"
            >
              {CARDS.map((card, i) => {
                const floatY = reduced ? 0 : Math.cos(time * 2.2 + i * 1.6) * 9;
                return (
                  <DesktopCard
                    key={card.id}
                    card={card}
                    index={i}
                    progress={p}
                    floatY={floatY}
                    reduced={reduced}
                  />
                );
              })}
            </div>
          </div>
        </section>
      ) : (
        <section className="inet-value-cards-mobile px-5 py-16 bg-gradient-to-b from-[#021B5B] via-[#002776] to-[#011442] text-white" aria-label="Por que INET">
          <div className="text-center mb-10">
            <span className="tag text-lime tracking-[0.25em]">04 — Por que INET</span>
            <h2 className="h-lg mt-2 text-white">
              Fibra óptica, <span className="italic text-lime">wi-fi grátis e muito conteúdo.</span>
            </h2>
          </div>
          <div className="space-y-6">
            {CARDS.map((card) => (
              <MobileCard key={card.id} card={card} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
