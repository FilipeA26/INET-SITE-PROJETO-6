import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Hand } from "lucide-react";
import Lines, { Rise, Fit } from "./Lines";
import { DUR, EASE } from "../motion";

export type Slide = { src: string; label: string; credit: string };
type App = {
  name: string;
  kind: string;
  status: string;
  text: string;
  tone: string;
  pending?: boolean;
  slides: Slide[];
};

// Backdrops de filmes do TMDB (crédito "Imagem: TMDB") e fotos de shows do Unsplash.
// Origem de cada arquivo em public/apps/FONTES.md.
const TMDB = "Imagem: TMDB";
const APPS: App[] = [
  {
    name: "HBO Max",
    kind: "Filmes e séries",
    status: "No plano INET 800 Mega",
    text: "Blockbusters, clássicos do cinema e originais exclusivos para maratonar.",
    tone: "#7B2FF7",
    slides: [
      { src: "/apps/hbo-1.webp", label: "Interestelar", credit: TMDB },
      { src: "/apps/hbo-2.webp", label: "Duna: Parte Dois", credit: TMDB },
      { src: "/apps/hbo-3.webp", label: "Batman: O Cavaleiro das Trevas", credit: TMDB },
      { src: "/apps/hbo-4.webp", label: "Blade Runner 2049", credit: TMDB },
      { src: "/apps/hbo-5.webp", label: "Harry Potter e a Pedra Filosofal", credit: TMDB },
    ],
  },
  {
    name: "Disney+",
    kind: "Universos inteiros",
    status: "Disponibilidade a confirmar",
    text: "Marvel, Pixar, Avatar e as histórias da Disney em um só lugar.",
    tone: "#0063E5",
    pending: true,
    slides: [
      { src: "/apps/disney-1.webp", label: "Vingadores: Ultimato", credit: TMDB },
      { src: "/apps/disney-2.webp", label: "Viva: A Vida é Uma Festa", credit: TMDB },
      { src: "/apps/disney-3.webp", label: "Avatar: O Caminho da Água", credit: TMDB },
      { src: "/apps/disney-4.webp", label: "Deadpool & Wolverine", credit: TMDB },
      { src: "/apps/disney-5.webp", label: "Divertida Mente 2", credit: TMDB },
    ],
  },
  {
    name: "Deezer",
    kind: "Música sem limites",
    status: "Nos planos 700 Mega e 1 Giga",
    text: "Deezer Premium sem anúncios, com download para ouvir offline.",
    tone: "#A238FF",
    slides: [
      { src: "/apps/deezer-1.webp", label: "Luzes do palco", credit: "Foto: Yvette de Wit / Unsplash" },
      { src: "/apps/deezer-2.webp", label: "Noite de show", credit: "Foto: ActionVance / Unsplash" },
      { src: "/apps/deezer-3.webp", label: "Festival", credit: "Foto: Aditya Chinchure / Unsplash" },
      { src: "/apps/deezer-4.webp", label: "Mãos para o alto", credit: "Foto: Tijs van Leur / Unsplash" },
      { src: "/apps/deezer-5.webp", label: "Show ao vivo", credit: "Foto: Nainoa Shizuru / Unsplash" },
    ],
  },
];

const TICK = 3600;

/**
 * Carrossel que passa sozinho, imagem por imagem (crossfade + Ken Burns leve).
 * Com o mouse em cima: pausa e aproxima a imagem; ao sair, continua de onde parou.
 * Fora da tela ele para, para não gastar bateria.
 */
export function AutoCarousel({ slides, hovering, onIndex, interval = TICK, offset = 0 }: { slides: Slide[]; hovering: boolean; onIndex?: (i: number) => void; interval?: number; offset?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const inView = useInView(ref, { margin: "10% 0px" });
  const [idx, setIdx] = useState(0);
  const running = inView && !hovering && !reduce && slides.length > 1;

  useEffect(() => {
    if (!running) return;
    // o primeiro passo pode atrasar (offset) para os cards não trocarem todos juntos
    let t = window.setTimeout(function step() {
      setIdx((i) => (i + 1) % slides.length);
      t = window.setTimeout(step, interval);
    }, idx === 0 && offset ? interval + offset : interval);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, interval, slides.length]);

  useEffect(() => { onIndex?.(idx); }, [idx, onIndex]);

  const slide = slides[idx];
  return (
    <div ref={ref} aria-hidden="true" className="absolute inset-0 overflow-hidden">
      <motion.div className="absolute inset-0" animate={{ scale: hovering ? 1.08 : 1 }} transition={{ duration: DUR, ease: EASE }}>
        <AnimatePresence initial={false}>
          <motion.img
            key={slide.src}
            src={slide.src}
            alt=""
            decoding="async"
            draggable={false}
            className="absolute inset-0 h-full w-full object-cover will-change-transform"
            initial={{ opacity: 0, scale: reduce ? 1 : 1.12 }}
            animate={{ opacity: 1, scale: reduce ? 1 : 1.02, transition: { opacity: { duration: DUR, ease: EASE }, scale: { duration: (interval + 1600) / 1000, ease: "linear" } } }}
            exit={{ opacity: 0, transition: { duration: DUR, ease: EASE } }}
          />
        </AnimatePresence>
      </motion.div>
      {/* pré-carrega a próxima imagem */}
      {slides.length > 1 && <link rel="preload" as="image" href={slides[(idx + 1) % slides.length].src} />}
    </div>
  );
}

/** Pontinhos de progresso do carrossel. */
export function Dots({ count, active }: { count: number; active: number }) {
  return (
    <span aria-hidden="true" className="flex gap-1.5">
      {Array.from({ length: count }, (_, i) => (
        <span key={i} className={`h-1 rounded-full transition-all duration-700 ${i === active ? "w-6 bg-lime" : "w-1.5 bg-white/30"}`} />
      ))}
    </span>
  );
}

function AppCard({ app, delay, offset }: { app: App; delay: number; offset: number }) {
  const [hovering, setHovering] = useState(false);
  const [idx, setIdx] = useState(0);
  const slide = app.slides[idx];

  return (
    <Rise delay={delay} className="h-full">
      <div
        tabIndex={0}
        onPointerEnter={(e) => e.pointerType === "mouse" && setHovering(true)}
        onPointerLeave={(e) => e.pointerType === "mouse" && setHovering(false)}
        onFocus={() => setHovering(true)}
        onBlur={() => setHovering(false)}
        className="card group relative block h-[440px] cursor-default select-none sm:h-[500px]"
        aria-label={`${app.name}: ${app.text}`}
      >
        <div aria-hidden="true" className="absolute inset-0" style={{ background: `radial-gradient(110% 80% at 85% 0%, ${app.tone}66, transparent 62%), linear-gradient(180deg,#010C22,#010818)` }} />
        <AutoCarousel slides={app.slides} hovering={hovering} onIndex={setIdx} offset={offset} />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ background: `linear-gradient(135deg, ${app.tone}55, transparent 55%)`, mixBlendMode: "soft-light" }} />
        <div className="absolute inset-0 bg-gradient-to-t from-[#010818] via-[#010818]/70 to-[#010818]/10" />

        {/* legenda e crédito da imagem atual */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.p
            key={slide.src}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="absolute right-5 top-5 max-w-[62%] rounded-2xl bg-black/45 px-3 py-1 text-right text-[11px] text-white/80 backdrop-blur"
          >
            {slide.label} <span className="text-white/45">· {slide.credit}</span>
          </motion.p>
        </AnimatePresence>

        <div className="relative flex h-full flex-col justify-end p-7 sm:p-8">
          <p className="font-display text-[11px] uppercase tracking-[0.28em] text-white/55">{app.kind}</p>
          <h3 className="mt-2 font-display text-4xl font-light tracking-[-0.02em] sm:text-5xl">{app.name}</h3>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-white/75">{app.text}</p>
          <div className="mt-5 flex items-center justify-between gap-3">
            <span className={`w-fit rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] ${app.pending ? "border border-white/30 text-white/80" : "bg-lime text-navy-ink"}`}>{app.status}</span>
            <Dots count={app.slides.length} active={idx} />
          </div>
        </div>

        <ArrowUpRight aria-hidden="true" size={22} className="card-icon absolute left-7 top-7 text-lime opacity-70 sm:left-8 sm:top-8" />
      </div>
    </Rise>
  );
}

/** Seção "Aplicativos para clientes INET": cards que ganham vida no hover/toque. */
export default function AppsShowcase({ id = "apps", tag = "Aplicativos para clientes INET" }: { id?: string; tag?: string }) {
  return (
    <section id={id} className="relative py-20 sm:py-28">
      <div aria-hidden="true" className="pointer-events-none absolute -left-40 top-24 h-[420px] w-[420px] rounded-full bg-[#021A4A]/50 blur-[120px]" />
      <div className="wrap relative">
        <Rise><Fit className="tag">{tag}</Fit></Rise>
        <div className="mt-4 flex flex-wrap items-end justify-between gap-6">
          <Lines className="h-lg max-w-4xl" lines={["Filmes, séries e música", <span className="italic text-lime">junto com a sua fibra.</span>]} />
          <Rise delay={0.2}>
            <p className="flex items-center gap-2 text-sm text-white/55">
              <Hand size={16} aria-hidden="true" className="text-lime" />
              <span className="hidden sm:inline">Passe o mouse para pausar</span>
              <span className="sm:hidden">As imagens passam sozinhas</span>
            </p>
          </Rise>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {APPS.map((a, i) => <AppCard key={a.name} app={a} delay={(i % 3) * 0.06} offset={i * 1100} />)}
        </div>

        <p className="mt-6 text-xs leading-relaxed text-white/45">
          Cada app está disponível apenas nos planos indicados; confirme as condições com o atendimento. Marcas citadas pertencem aos seus titulares. Imagens ilustrativas: backdrops de filmes via TMDB e fotos de shows do Unsplash, com crédito nos cards. Os títulos variam conforme o catálogo de cada plataforma.
        </p>
      </div>
    </section>
  );
}
