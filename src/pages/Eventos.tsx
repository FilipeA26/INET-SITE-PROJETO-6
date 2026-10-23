import { useRef, type PointerEvent } from "react";
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { ArrowRight, CalendarDays, ExternalLink, Instagram, MapPin, Mic2, Music, Sparkles, Trophy, Users } from "lucide-react";
import Lines, { Rise } from "../components/Lines";
import { CtaBand, Note, PageHero, Section, usePageMeta } from "../components/ui";
import { SPRING } from "../motion";
import { waLink } from "../data/inet";

const IMS_URL = "https://ims-cultura-esporte.gnacib.chatgpt.site/";
const IMS_IG = "https://www.instagram.com/projetoims/";

// Conteúdo do site do IMS (revisado pelo projeto em 20/10/2026)
const IMS_STATS = [
  { n: "09", label: "atletas apoiados" },
  { n: "04", label: "artistas e bandas" },
  { n: "02", label: "projetos de formação" },
];
const IMS_SPORTS = ["Beach tennis", "Corrida", "Futevôlei", "Jiu-jítsu", "Triatlo"];
const IMS_ARTISTS = [
  { role: "Banda", name: "Banda Varandas" },
  { role: "Cantor", name: "Pedro Lauar" },
  { role: "DJ", name: "DJ Wnuk" },
  { role: "Dupla sertaneja", name: "Gustavo & Gabriel" },
];
const IMS_PROJECTS = [
  { sport: "Voleibol · Formação esportiva", name: "Vôlei do Mucuri", text: "Escola de vôlei e formação de atletas em Teófilo Otoni, com equipes femininas e masculinas. O esporte como caminho de desenvolvimento e transformação social." },
  { sport: "Futebol · Categorias de base", name: "Bananinha Academy", text: "Centro de formação de atletas de futebol, com trabalho nas categorias de base e participação em competições." },
];
// Agenda da semana 19/10 a 25/10/2026 no site do IMS; ela muda toda semana
const IMS_AGENDA = [
  { day: "24", month: "OUT", type: "Esporte", title: "2º Open Bio Extratus", place: "07h30 · CBA Colatina Beach Arena · Colatina", text: "Dupla Fernanda Reis e Marcelle Garcia, categoria A. Entrada gratuita." },
  { day: "24", month: "OUT", type: "Música", title: "Buteco do Trapiche: Gustavo & Gabriel e Brianne Fernandes", place: "22h00 · Buteco do Trapiche · Teófilo Otoni", text: "Participação de Pedro Lauar. Av. Dr. Luís Boali, 130." },
];

// PROVISÓRIO: sem dados reais do INET Music Show; substituir quando a INET enviar line-up, datas e fotos
const SHOW_LINEUP = [
  { slot: "Atração principal", name: "A confirmar" },
  { slot: "Show de abertura", name: "A confirmar" },
  { slot: "Palco local", name: "Talentos da cidade" },
];
// PROVISÓRIO
const SHOW_FACTS = [
  { icon: CalendarDays, label: "Data", value: "Em breve" },
  { icon: MapPin, label: "Local", value: "Teófilo Otoni · MG" },
  { icon: Users, label: "Clientes INET", value: "Vantagens exclusivas" },
];

/** Celular com o site do IMS: inclina seguindo o ponteiro e flutua com a rolagem. */
function PhoneMockup() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [10, -10]), SPRING);
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-14, 14]), SPRING);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useSpring(useTransform(scrollYProgress, [0, 1], [60, -60]), SPRING);
  const glare = useTransform(mx, [-0.5, 0.5], ["0%", "100%"]);

  const move = (e: PointerEvent<HTMLDivElement>) => {
    if (reduce || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const leave = () => { mx.set(0); my.set(0); };

  return (
    <div ref={ref} onPointerMove={move} onPointerLeave={leave} className="relative mx-auto w-full max-w-[340px] py-6 [perspective:1200px]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-1/4 mx-auto h-2/3 w-3/4 rounded-full bg-lime/20 blur-[90px]" />
      <motion.a
        href={IMS_URL}
        target="_blank"
        rel="noreferrer"
        aria-label="Abrir o site do IMS em uma nova aba"
        style={reduce ? undefined : { rotateX: rx, rotateY: ry, y }}
        className="relative block rounded-[3rem] bg-gradient-to-b from-[#1b2a4d] to-[#060d22] p-[11px] shadow-[0_50px_100px_-30px_rgba(0,0,0,0.95),inset_0_0_0_1.5px_rgba(255,255,255,0.14)] [transform-style:preserve-3d]"
      >
        {/* botões laterais */}
        <span aria-hidden="true" className="absolute -left-[3px] top-28 h-10 w-[3px] rounded-l bg-[#24345a]" />
        <span aria-hidden="true" className="absolute -left-[3px] top-44 h-16 w-[3px] rounded-l bg-[#24345a]" />
        <span aria-hidden="true" className="absolute -right-[3px] top-36 h-20 w-[3px] rounded-r bg-[#24345a]" />
        <div className="relative overflow-hidden rounded-[2.4rem] bg-[#06122b]">
          {/* captura em 390x836 do site do IMS */}
          <img src="/eventos/ims-mobile.png" alt="Site do IMS aberto no celular: “O talento é daqui. O movimento é de todos.”" width={390} height={836} loading="lazy" className="block h-auto w-full" />
          {/* ilha dinâmica */}
          <span aria-hidden="true" className="absolute left-1/2 top-2.5 h-6 w-24 -translate-x-1/2 rounded-full bg-black" />
          {/* reflexo que acompanha a inclinação */}
          <motion.span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,transparent_35%,rgba(255,255,255,0.14)_50%,transparent_65%)] bg-[length:250%_100%]"
            style={{ backgroundPositionX: glare }}
          />
        </div>
      </motion.a>
    </div>
  );
}

export default function Eventos() {
  usePageMeta("INET Eventos", "INET Eventos: o IMS, projeto de cultura e esporte idealizado pela INET em Teófilo Otoni, e o INET Music Show.");

  return (
    <>
      <PageHero
        tag="INET Eventos"
        title={["Cultura, esporte", <span className="italic text-lime">e música ao vivo.</span>]}
        lead="A INET conecta Teófilo Otoni também fora da rede: apoiando talentos da cidade com o IMS e levando grandes shows para perto de você."
      >
        <a href="#ims" className="btn-lime">Conhecer o IMS</a>
        <a href="#music-show" className="btn-ghost">INET Music Show</a>
      </PageHero>

      {/* as duas frentes */}
      <section className="pb-6">
        <div className="wrap grid gap-4 md:grid-cols-2">
          {[
            { href: "#ims", icon: Trophy, tag: "IMS · Cultura + Esporte", title: "O talento é daqui.", text: "Atletas, artistas e projetos de formação apoiados pela INET.", tone: "#38B000" },
            { href: "#music-show", icon: Mic2, tag: "INET Music Show", title: "O palco é nosso.", text: "Shows e experiências para clientes e para a cidade.", tone: "#0062EC" },
          ].map((c, i) => (
            <Rise key={c.href} delay={i * 0.08} className="h-full">
              <a href={c.href} className="card group flex h-full min-h-[260px] flex-col p-8">
                <div aria-hidden="true" className="card-media" style={{ background: `radial-gradient(120% 90% at 100% 0%, ${c.tone}55, transparent 60%)` }} />
                <span className="card-icon relative flex h-12 w-12 items-center justify-center rounded-2xl border border-white/15 bg-white/5 text-lime">
                  <c.icon size={22} aria-hidden="true" />
                </span>
                <p className="tag relative mt-auto pt-10">{c.tag}</p>
                <h2 className="relative mt-3 font-display text-3xl font-light sm:text-4xl">{c.title}</h2>
                <p className="relative mt-2 text-sm text-white/65">{c.text}</p>
                <span className="card-link relative mt-5">Ver mais <ArrowRight size={15} aria-hidden="true" /></span>
              </a>
            </Rise>
          ))}
        </div>
      </section>

      {/* IMS */}
      <section id="ims" className="relative overflow-hidden py-20 sm:py-28">
        <div aria-hidden="true" className="pointer-events-none absolute -left-40 top-20 h-[480px] w-[480px] rounded-full bg-leaf/15 blur-[130px]" />
        <div className="wrap relative grid items-center gap-14 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <Rise><p className="tag">IMS · Cultura + Esporte</p></Rise>
            <Lines className="h-lg mt-4" lines={["O talento é daqui.", <span className="italic text-lime">O movimento é de todos.</span>]} />
            <Rise delay={0.2}>
              <p className="lead mt-5 max-w-xl">
                Um projeto idealizado pela INET que reúne artistas, atletas, projetos esportivos e empresas para valorizar os talentos de Teófilo Otoni. O apoio pode acontecer com recursos, produtos, serviços, divulgação e experiências na cidade.
              </p>
            </Rise>
            <div className="mt-10 grid grid-cols-3 gap-3">
              {IMS_STATS.map((s, i) => (
                <Rise key={s.label} delay={0.25 + i * 0.06} className="card p-5">
                  <p className="font-display text-4xl font-light text-lime sm:text-5xl">{s.n}</p>
                  <p className="mt-1 text-xs leading-snug text-white/60 sm:text-sm">{s.label}</p>
                </Rise>
              ))}
            </div>
            <Rise delay={0.4} className="mt-9 flex flex-wrap gap-3">
              <a href={IMS_URL} target="_blank" rel="noreferrer" className="btn-lime">Visitar o site do IMS <ExternalLink size={15} /></a>
              <a href={IMS_IG} target="_blank" rel="noreferrer" className="btn-ghost"><Instagram size={16} /> @projetoims</a>
            </Rise>
          </div>
          <PhoneMockup />
        </div>
      </section>

      <Section tag="Nosso time" title={["Gente com talento.", "Histórias de verdade."]}>
        <div className="grid gap-4 lg:grid-cols-2">
          <Rise className="card p-8">
            <Trophy size={22} aria-hidden="true" className="card-icon text-lime" />
            <h3 className="mt-5 font-display text-2xl">Atletas · 9 apoiados</h3>
            <ul className="mt-5 flex flex-wrap gap-2">
              {IMS_SPORTS.map((s) => (
                <li key={s} className="rounded-full border border-white/15 bg-white/[0.04] px-4 py-2 text-sm">{s}</li>
              ))}
            </ul>
          </Rise>
          <Rise delay={0.08} className="card p-8">
            <Music size={22} aria-hidden="true" className="card-icon text-lime" />
            <h3 className="mt-5 font-display text-2xl">Artistas e bandas · o som da cidade</h3>
            <ul className="mt-5 grid grid-cols-2 gap-x-6 gap-y-4">
              {IMS_ARTISTS.map((a) => (
                <li key={a.name}>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-white/45">{a.role}</p>
                  <p className="font-display text-lg">{a.name}</p>
                </li>
              ))}
            </ul>
          </Rise>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {IMS_PROJECTS.map((p, i) => (
            <Rise key={p.name} delay={i * 0.08} className="card p-8">
              <p className="tag">{p.sport}</p>
              <h3 className="mt-3 font-display text-2xl">{p.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/65">{p.text}</p>
            </Rise>
          ))}
        </div>
      </Section>

      <Section tag="Programação IMS" title={["Marque na", "sua semana."]}>
        <ol className="grid gap-4 md:grid-cols-2">
          {IMS_AGENDA.map((e, i) => (
            <Rise as="li" key={e.title} delay={i * 0.08} className="card flex gap-6 p-7">
              <div className="shrink-0 text-center">
                <p className="font-display text-5xl font-light leading-none text-lime">{e.day}</p>
                <p className="mt-1 text-xs tracking-[0.2em] text-white/55">{e.month}</p>
              </div>
              <div>
                <p className="tag">{e.type}</p>
                <h3 className="mt-2 font-display text-xl">{e.title}</h3>
                <p className="mt-1 text-sm text-white/70">{e.place}</p>
                <p className="mt-2 text-sm text-white/55">{e.text}</p>
              </div>
            </Rise>
          ))}
        </ol>
        <Note>
          Agenda de 19/10 a 25/10/2026, conforme o site do IMS (revisada em 23/10/2026). A programação muda toda semana e está sujeita a alterações pelos organizadores: confira a agenda atualizada no <a href={IMS_URL} target="_blank" rel="noreferrer" className="underline hover:text-lime">site do IMS</a>.
        </Note>
      </Section>

      {/* INET MUSIC SHOW — PROVISÓRIO: todo o conteúdo abaixo é marcador até a INET enviar os dados reais */}
      <section id="music-show" className="relative overflow-hidden py-20 sm:py-28">
        <div className="wrap">
          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(140deg,#003F99,#03256C_45%,#010818)] p-8 sm:p-14">
            <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-28 h-96 w-96 rounded-full bg-lime/20 blur-[110px]" />
            {/* feixes de luz de palco */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
              {[12, 38, 64, 88].map((left, i) => (
                <motion.span
                  key={left}
                  className="absolute -top-10 h-[140%] w-24 origin-top bg-gradient-to-b from-white/15 to-transparent blur-xl"
                  style={{ left: `${left}%` }}
                  animate={{ rotate: [i % 2 ? 14 : -14, i % 2 ? -10 : 10, i % 2 ? 14 : -14] }}
                  transition={{ duration: 7 + i, repeat: Infinity, ease: "easeInOut" }}
                />
              ))}
            </div>
            <div className="relative">
              <Rise><p className="tag flex items-center gap-2"><Sparkles size={14} aria-hidden="true" /> INET Music Show</p></Rise>
              <Lines className="h-xl mt-5 max-w-4xl" lines={["O palco", <span className="italic text-lime">é nosso.</span>]} />
              {/* PROVISÓRIO */}
              <Rise delay={0.2}>
                <p className="lead mt-6 max-w-2xl">
                  Grandes shows em Teófilo Otoni com a assinatura da INET. Line-up, datas e condições especiais para clientes serão anunciados em breve.
                </p>
              </Rise>
              <div className="mt-10 grid gap-3 sm:grid-cols-3">
                {SHOW_FACTS.map((f, i) => (
                  <Rise key={f.label} delay={0.25 + i * 0.06} className="rounded-2xl border border-white/15 bg-white/[0.05] p-5 backdrop-blur">
                    <f.icon size={18} aria-hidden="true" className="text-lime" />
                    <p className="mt-3 text-xs uppercase tracking-[0.18em] text-white/50">{f.label}</p>
                    <p className="font-display text-xl">{f.value}</p>
                  </Rise>
                ))}
              </div>
              <ul className="mt-10 divide-y divide-white/10 border-y border-white/10">
                {SHOW_LINEUP.map((a, i) => (
                  <Rise as="li" key={a.slot} delay={i * 0.06} className="flex items-baseline justify-between gap-6 py-5">
                    <span className="text-xs uppercase tracking-[0.2em] text-white/50">{a.slot}</span>
                    <span className="font-display text-2xl font-light sm:text-4xl">{a.name}</span>
                  </Rise>
                ))}
              </ul>
              <Rise delay={0.2} className="mt-9 flex flex-wrap gap-3">
                <a href={waLink("Olá! Quero saber das novidades do INET Music Show.")} target="_blank" rel="noreferrer" className="btn-lime">Quero ser avisado</a>
              </Rise>
            </div>
          </div>
          <Note>Conteúdo provisório do INET Music Show: datas, local, atrações e fotos aguardam confirmação da INET.</Note>
        </div>
      </section>

      <CtaBand title={["Sua marca pode", <span className="italic text-lime">somar ao IMS.</span>]} text="Empresas, artistas e atletas podem conversar com o IMS sobre parcerias e participação.">
        <a href={IMS_IG} target="_blank" rel="noreferrer" className="btn-lime">Falar com o IMS no Instagram</a>
        <a href={IMS_URL} target="_blank" rel="noreferrer" className="btn-ghost">Site do IMS <ExternalLink size={15} /></a>
      </CtaBand>
    </>
  );
}
