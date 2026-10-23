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
  wide?: boolean;
  pending?: boolean;
  slides: Slide[];
};

// Imagens provisórias do Wikimedia Commons (licenças e autores em public/apps/FONTES.md).
// Pôsteres oficiais e fotos promocionais exigem licença dos titulares para uso comercial.
const APPS: App[] = [
  {
    name: "HBO Max",
    kind: "Séries e filmes",
    status: "No plano INET HBO Max",
    text: "Fantasia épica, dramas premiados e originais exclusivos para maratonar.",
    tone: "#7B2FF7",
    wide: true,
    slides: [
      { src: "/apps/hbo-1.jpg", label: "Dubrovnik, cenário de Game of Thrones", credit: "Kigsz · CC BY-SA 3.0" },
      { src: "/apps/hbo-2.jpg", label: "Emilia Clarke", credit: "condenastrussia · CC BY 3.0" },
      { src: "/apps/hbo-3.jpg", label: "Pedro Pascal", credit: "Gage Skidmore · CC BY-SA 3.0" },
      { src: "/apps/hbo-4.jpg", label: "Kit Harington", credit: "W!ZARD Radio Media · CC BY 3.0" },
      { src: "/apps/hbo-5.jpg", label: "Bella Ramsey", credit: "CC BY-SA 2.0" },
    ],
  },
  {
    name: "Disney+",
    kind: "Universos inteiros",
    status: "Disponibilidade a confirmar",
    text: "Star Wars, Marvel e as histórias da Disney em um só lugar.",
    tone: "#0063E5",
    pending: true,
    slides: [
      { src: "/apps/disney-1.jpg", label: "Mandalorian na Star Wars Celebration", credit: "CC BY 2.0" },
      { src: "/apps/disney-2.jpg", label: "Tom Hiddleston", credit: "CC BY-SA 4.0" },
      { src: "/apps/disney-3.jpg", label: "Grogu em órbita", credit: "NASA · domínio público" },
      { src: "/apps/disney-5.jpg", label: "Homem de Ferro", credit: "CC BY-SA 2.0" },
    ],
  },
  {
    name: "Deezer",
    kind: "Música sem limites",
    status: "Nos planos INET Música e Gamer",
    text: "Deezer Premium sem anúncios, com download para ouvir offline.",
    tone: "#A238FF",
    slides: [
      { src: "/apps/deezer-1.jpg", label: "Anitta", credit: "CC BY-SA 4.0" },
      { src: "/apps/deezer-2.jpg", label: "Ludmilla", credit: "CC BY-SA 4.0" },
      { src: "/apps/deezer-3.jpg", label: "Gusttavo Lima", credit: "CC0" },
      { src: "/apps/deezer-4.jpg", label: "Ivete Sangalo", credit: "CC BY 2.0" },
      { src: "/apps/deezer-5.jpg", label: "Alok", credit: "Agência Brasília · CC BY 2.0" },
    ],
  },
  {
    name: "Mumo",
    kind: "Entretenimento em áudio",
    status: "Em diversos planos",
    text: "Rádios locais, notícias, esportes, humor e podcasts.",
    tone: "#38B000",
    slides: [
      { src: "/apps/mumo-1.jpg", label: "Rádio ao vivo", credit: "CC BY-SA 4.0" },
      { src: "/apps/mumo-2.jpg", label: "Podcasts", credit: "CC BY 4.0" },
    ],
  },
  {
    name: "NetFibra TV",
    kind: "TV ao vivo",
    status: "Nos planos com TV",
    text: "Canais abertos e rádios no celular, no computador ou na smart TV.",
    tone: "#0062EC",
    slides: [
      { src: "/apps/netfibra-1.jpg", label: "Programação ao vivo", credit: "CC BY-SA 4.0" },
      { src: "/apps/netfibra-2.jpg", label: "Futebol na tela", credit: "domínio público" },
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
    <Rise delay={delay} className={`h-full ${app.wide ? "md:col-span-2" : ""}`}>
      <div
        ref={ref}
        tabIndex={0}
        onPointerEnter={(e) => e.pointerType === "mouse" && setHovering(true)}
        onPointerLeave={(e) => e.pointerType === "mouse" && setHovering(false)}
        onFocus={() => setHovering(true)}
        onBlur={() => setHovering(false)}
        onClick={() => touch && setHovering((h) => !h)}
        className="card group relative block h-[420px] cursor-default select-none sm:h-[460px]"
        aria-label={`${app.name}: ${app.text}`}
      >
        {/* fundo em repouso: aura na cor do app */}
        <div aria-hidden="true" className="card-media" style={{ background: `radial-gradient(110% 80% at 85% 0%, ${app.tone}66, transparent 62%), linear-gradient(180deg,#03256C33,#010818)` }} />

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

        <div className="absolute inset-0 bg-gradient-to-t from-[#010818] via-[#010818]/75 to-transparent" />

        {/* legenda e crédito da imagem atual */}
        <AnimatePresence>
          {active && (
            <motion.p
              key={slide.src}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: EASE }}
              className="absolute right-5 top-5 max-w-[70%] rounded-full bg-black/45 px-3 py-1 text-right text-[11px] text-white/80 backdrop-blur"
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
      <div aria-hidden="true" className="pointer-events-none absolute -left-40 top-24 h-[420px] w-[420px] rounded-full bg-electric/15 blur-[120px]" />
      <div className="wrap relative">
        <Rise><p className="tag">{tag}</p></Rise>
        <div className="mt-4 flex flex-wrap items-end justify-between gap-6">
          <Lines className="h-lg max-w-3xl" lines={["Séries, música e TV", <span className="italic text-lime">junto com a sua fibra.</span>]} />
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
          Cada app está disponível apenas nos planos indicados; confirme as condições com o atendimento. Marcas citadas pertencem aos seus titulares. Imagens ilustrativas do Wikimedia Commons, créditos nos cards.
        </p>
      </div>
    </section>
  );
}
