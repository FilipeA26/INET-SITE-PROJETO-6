import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Art, { type ArtKind } from "../components/Art";
import { Rise } from "../components/Lines";
import { CtaBand, Note, PageHero, Section, usePageMeta } from "../components/ui";
import { waLink } from "../data/inet";

type Service = {
  name: string;
  art: ArtKind;
  status: string;
  text: string;
  cta: { label: string; to?: string; href?: string };
  pending?: boolean;
};

const SERVICES: Service[] = [
  {
    name: "HBO Max",
    art: "drama",
    status: "No plano INET HBO Max",
    text: "Plataforma de streaming com o conteúdo da HBO, filmes campeões de bilheteria, séries para maratonar e originais exclusivos.",
    cta: { label: "Conhecer o plano", to: "/internet#planos" },
  },
  {
    name: "Deezer",
    art: "music",
    status: "Nos planos INET Música e Gamer",
    text: "Deezer Premium: novas faixas e playlists sem interrupções, música ilimitada e download para ouvir offline no smartphone.",
    cta: { label: "Conhecer os planos", to: "/internet#planos" },
  },
  {
    name: "Mumo",
    art: "audio",
    status: "Em diversos planos",
    text: "App de entretenimento em áudio: música, rádios locais, notícias, esportes, humor, fofoca e muito mais.",
    cta: { label: "Ver planos com Mumo", to: "/internet#planos" },
  },
  {
    name: "NetFibra TV",
    art: "tv",
    status: "Nos planos com TV",
    text: "Canais de TV aberta ao vivo e rádios no smartphone, tablet, computador ou smart TV.",
    cta: { label: "Conhecer a INET TV", to: "/tv" },
  },
  {
    name: "Bebanca",
    art: "read",
    status: "Nos planos Plus TV e combos",
    text: "App de leitura incluído em planos da INET.",
    cta: { label: "Ver planos", to: "/internet#planos" },
  },
  {
    name: "Disney+",
    art: "magic",
    status: "Disponibilidade a confirmar",
    text: "Pergunte ao atendimento se há oferta com Disney+ para o seu plano.",
    cta: { label: "Consultar condições", href: waLink("Olá! A INET tem alguma oferta com Disney+?") },
    pending: true,
  },
];

const MOODS: { title: string; text: string; art: ArtKind }[] = [
  { title: "Fantasia épica", text: "Reinos, dragões e batalhas pelo trono.", art: "fantasy" },
  { title: "Drama criminal", text: "Tensão, escolhas difíceis e reviravoltas.", art: "crime" },
  { title: "Sobrevivência", text: "Suspense para maratonar sem pausa.", art: "survival" },
];

function EntCard({ s, delay }: { s: Service; delay: number }) {
  const body = (
    <>
      <Art kind={s.art} />
      <div className="absolute inset-0 bg-gradient-to-t from-[#010818] via-[#010818]/70 to-transparent" />
      <div className="relative flex h-full flex-col justify-end p-7">
        <span className={`w-fit rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] ${s.pending ? "border border-white/30 text-white/80" : "bg-lime text-navy-ink"}`}>{s.status}</span>
        <h3 className="mt-4 font-display text-3xl">{s.name}</h3>
        <p className="mt-2 text-sm leading-relaxed text-white/75">{s.text}</p>
        <span className="card-link mt-5">{s.cta.label} <ArrowRight size={15} aria-hidden="true" /></span>
      </div>
    </>
  );
  const cls = "card block h-[440px]";
  return (
    <Rise delay={delay} className="h-full">
      {s.cta.to ? (
        <Link to={s.cta.to} className={cls}>{body}</Link>
      ) : (
        <a href={s.cta.href} target="_blank" rel="noreferrer" className={cls}>{body}</a>
      )}
    </Rise>
  );
}

export default function Entretenimento() {
  usePageMeta("Entretenimento", "Apps e streaming nos planos da INET: HBO Max, Deezer, Mumo, NetFibra TV e Bebanca. Confira quais planos incluem cada serviço.");

  return (
    <>
      <PageHero
        tag="Entretenimento"
        title={["Muito conteúdo", <span className="italic text-lime">no seu plano.</span>]}
        lead="Aplicativos selecionados pela equipe INET para deixar você ainda mais conectado: séries, filmes, música, rádio, TV e leitura."
      />

      <Section tag="Apps e streaming" title={["Escolha o que", "combina com você."]}>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s, i) => <EntCard key={s.name} s={s} delay={(i % 3) * 0.06} />)}
        </div>
        <Note>
          Cada serviço está disponível apenas nos planos indicados, conforme o site anterior da INET. Ofertas e planos podem mudar: confirme as condições com o atendimento. Marcas citadas pertencem aos seus respectivos titulares.
        </Note>
      </Section>

      <Section tag="Para maratonar" title={["Qual é o seu", "clima de hoje?"]}>
        <div className="grid gap-4 md:grid-cols-3">
          {MOODS.map((m, i) => (
            <Rise key={m.title} delay={i * 0.06}>
              <Link to="/internet#planos" className="card block h-72">
                <Art kind={m.art} />
                <div className="absolute inset-0 bg-gradient-to-t from-[#010818] via-transparent to-transparent" />
                <div className="relative flex h-full flex-col justify-end p-7">
                  <h3 className="font-display text-2xl">{m.title}</h3>
                  <p className="mt-1 text-sm text-white/70">{m.text}</p>
                </div>
              </Link>
            </Rise>
          ))}
        </div>
      </Section>

      <CtaBand title={["Monte seu plano", <span className="italic text-lime">com entretenimento.</span>]} text="Nossa equipe mostra quais planos incluem cada app.">
        <a href={waLink("Olá! Quero um plano da INET com apps de entretenimento.")} target="_blank" rel="noreferrer" className="btn-lime">Falar no WhatsApp</a>
      </CtaBand>
    </>
  );
}
