import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Hand } from "lucide-react";
import Lines, { Rise } from "./Lines";
import { DUR, EASE } from "../motion";

type Slide = { src: string; label: string; credit: string };
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

const TICK = 1700;

/** Card com imagens que passam por dentro dele quando ativo (hover, foco ou toque). */
function AppCard({ app, delay }: { app: App; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [hovering, setHovering] = useState(false);
  const [touch, setTouch] = useState(false);
  const [idx, setIdx] = useState(0);
  // no celular não há hover: o card acende quando fica centralizado na tela
  const centered = useInView(ref, { margin: "-35% 0px -35% 0px" });

  useEffect(() => {
    setTouch(window.matchMedia("(hover: none)").matches);
  }, []);

  const active = hovering || (touch && centered);

  useEffect(() => {
    if (!active || reduce || app.slides.length < 2) return;
    const t = window.setInterval(() => setIdx((i) => (i + 1) % app.slides.length), TICK);
    return () => window.clearInterval(t);
  }, [active, reduce, app.slides.length]);

  const slide = app.slides[idx];

  return (
    <Rise delay={delay} className="h-full">
      <div
        ref={ref}
        tabIndex={0}
        onPointerEnter={(e) => e.pointerType === "mouse" && setHovering(true)}
        onPointerLeave={(e) => e.pointerType === "mouse" && setHovering(false)}
        onFocus={() => setHovering(true)}
        onBlur={() => setHovering(false)}
        onClick={() => touch && setHovering((h) => !h)}
        className="card group relative block h-[440px] cursor-default select-none sm:h-[500px]"
        aria-label={`${app.name}: ${app.text}`}
      >
        {/* fundo em repouso: aura na cor do app */}
        <div aria-hidden="true" className="card-media" style={{ background: `radial-gradient(110% 80% at 85% 0%, ${app.tone}66, transparent 62%), linear-gradient(180deg,#020F2E,#010818)` }} />

        {/* imagens que passam dentro do card */}
        <motion.div
          aria-hidden="true"
          className="absolute inset-0 overflow-hidden"
          initial={false}
          animate={{ opacity: active ? 1 : 0, clipPath: active ? "inset(0% 0% 0% 0% round 0px)" : "inset(12% 8% 30% 8% round 28px)" }}
          transition={{ duration: DUR * 0.8, ease: EASE }}
        >
          <AnimatePresence initial={false} mode="popLayout">
            <motion.img
              key={slide.src}
              src={slide.src}
              alt=""
              loading="lazy"
              decoding="async"
              draggable={false}
              className="absolute inset-0 h-full w-full object-cover"
              initial={{ opacity: 0, scale: 1.14, x: "6%" }}
              animate={{ opacity: 1, scale: 1.04, x: "0%" }}
              exit={{ opacity: 0, scale: 1, x: "-4%" }}
              transition={{ duration: DUR * 1.1, ease: EASE }}
            />
          </AnimatePresence>
          <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${app.tone}55, transparent 55%)`, mixBlendMode: "soft-light" }} />
        </motion.div>

        <div className="absolute inset-0 bg-gradient-to-t from-[#010818] via-[#010818]/70 to-[#010818]/10" />

        {/* legenda e crédito da imagem atual */}
        <AnimatePresence>
          {active && (
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
          )}
        </AnimatePresence>

        <div className="relative flex h-full flex-col justify-end p-7 sm:p-8">
          <p className="font-display text-[11px] uppercase tracking-[0.28em] text-white/55">{app.kind}</p>
          <h3 className="mt-2 font-display text-4xl font-light tracking-[-0.02em] sm:text-5xl">{app.name}</h3>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-white/75">{app.text}</p>
          <div className="mt-5 flex items-center justify-between gap-3">
            <span className={`w-fit rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] ${app.pending ? "border border-white/30 text-white/80" : "bg-lime text-navy-ink"}`}>{app.status}</span>
            {app.slides.length > 1 && (
              <span aria-hidden="true" className="flex gap-1.5">
                {app.slides.map((s, i) => (
                  <span key={s.src} className={`h-1 rounded-full transition-all duration-700 ${active && i === idx ? "w-6 bg-lime" : "w-1.5 bg-white/30"}`} />
                ))}
              </span>
            )}
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
      <div aria-hidden="true" className="pointer-events-none absolute -left-40 top-24 h-[420px] w-[420px] rounded-full bg-navy/40 blur-[120px]" />
      <div className="wrap relative">
        <Rise><p className="tag">{tag}</p></Rise>
        <div className="mt-4 flex flex-wrap items-end justify-between gap-6">
          <Lines className="h-lg max-w-3xl" lines={["Filmes, séries e música", <span className="italic text-lime">junto com a sua fibra.</span>]} />
          <Rise delay={0.2}>
            <p className="flex items-center gap-2 text-sm text-white/55">
              <Hand size={16} aria-hidden="true" className="text-lime" />
              <span className="hidden sm:inline">Passe o mouse nos cards</span>
              <span className="sm:hidden">Role ou toque nos cards</span>
            </p>
          </Rise>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {APPS.map((a, i) => <AppCard key={a.name} app={a} delay={(i % 3) * 0.06} />)}
        </div>

        <p className="mt-6 text-xs leading-relaxed text-white/45">
          Cada app está disponível apenas nos planos indicados; confirme as condições com o atendimento. Marcas citadas pertencem aos seus titulares. Imagens ilustrativas: backdrops de filmes via TMDB e fotos de shows do Unsplash, com crédito nos cards. Os títulos variam conforme o catálogo de cada plataforma.
        </p>
      </div>
    </section>
  );
}
