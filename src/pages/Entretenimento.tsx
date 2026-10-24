import { useState } from "react";
import { Link } from "react-router-dom";
import AppsShowcase, { AutoCarousel, Dots, type Slide } from "../components/AppsShowcase";
import { Rise } from "../components/Lines";
import { CtaBand, PageHero, Section, usePageMeta } from "../components/ui";
import { waLink } from "../data/inet";

// Backdrops do TMDB (origem em public/moods/FONTES.md)
const tmdb = (src: string, label: string): Slide => ({ src: `/moods/${src}.webp`, label, credit: "Imagem: TMDB" });

const MOODS: { title: string; text: string; slides: Slide[] }[] = [
  {
    title: "Fantasia épica",
    text: "Reinos, dragões e batalhas pelo trono.",
    slides: [tmdb("fantasia-1", "O Senhor dos Anéis"), tmdb("fantasia-2", "A Casa do Dragão"), tmdb("fantasia-3", "Harry Potter"), tmdb("fantasia-4", "Game of Thrones")],
  },
  {
    title: "Drama criminal",
    text: "Tensão, escolhas difíceis e reviravoltas.",
    slides: [tmdb("crime-1", "Breaking Bad"), tmdb("crime-2", "O Poderoso Chefão"), tmdb("crime-3", "Peaky Blinders")],
  },
  {
    title: "Sobrevivência",
    text: "Suspense para maratonar sem pausa.",
    slides: [tmdb("sobrevivencia-1", "The Last of Us"), tmdb("sobrevivencia-2", "Round 6"), tmdb("sobrevivencia-3", "Jogos Vorazes")],
  },
];

function MoodCard({ m, offset }: { m: (typeof MOODS)[number]; offset: number }) {
  const [hovering, setHovering] = useState(false);
  const [idx, setIdx] = useState(0);
  return (
    <Link
      to="/internet#planos"
      onPointerEnter={(e) => e.pointerType === "mouse" && setHovering(true)}
      onPointerLeave={(e) => e.pointerType === "mouse" && setHovering(false)}
      onFocus={() => setHovering(true)}
      onBlur={() => setHovering(false)}
      className="card block h-80"
    >
      <AutoCarousel slides={m.slides} hovering={hovering} onIndex={setIdx} interval={4200} offset={offset} />
      <div className="absolute inset-0 bg-gradient-to-t from-[#010818] via-[#010818]/40 to-transparent" />
      <p className="absolute right-4 top-4 rounded-full bg-black/45 px-3 py-1 text-[11px] text-white/80 backdrop-blur">
        {m.slides[idx].label} <span className="text-white/45">· {m.slides[idx].credit}</span>
      </p>
      <div className="relative flex h-full flex-col justify-end p-7">
        <h3 className="font-display text-2xl">{m.title}</h3>
        <p className="mt-1 text-sm text-white/70">{m.text}</p>
        <div className="mt-4"><Dots count={m.slides.length} active={idx} /></div>
      </div>
    </Link>
  );
}

export default function Entretenimento() {
  usePageMeta("Entretenimento", "Streaming e música nos planos da INET: HBO Max, Disney+ e Deezer. Confira quais planos incluem cada serviço.");

  return (
    <>
      <PageHero
        tag="Entretenimento"
        title={["Muito conteúdo", <span className="italic text-lime">no seu plano.</span>]}
        lead="HBO Max, Disney+ e Deezer selecionados pela equipe INET para você aproveitar filmes, séries e música com a velocidade da fibra."
      />

      <AppsShowcase tag="Apps e streaming" />

      <Section tag="Para maratonar" title={["Qual é o seu", "clima de hoje?"]}>
        <div className="grid gap-4 md:grid-cols-3">
          {MOODS.map((m, i) => (
            <Rise key={m.title} delay={i * 0.06}>
              <MoodCard m={m} offset={i * 1400} />
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
