import React, { useState } from "react";
import { Link } from "react-router-dom";
import AppsShowcase, { AutoCarousel, Dots, type Slide } from "../components/AppsShowcase";
import Lines, { Rise } from "../components/Lines";
import WorkGrid from "../components/lusion/WorkGrid";
import WorkCard from "../components/lusion/WorkCard";
import LusionSection from "../components/t3p/LusionSection";
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
  return (
    <>
      {/* 1. Hero: Claro-neve (Apple) */}
      <section className="relative isolate py-20 sm:py-28 bg-[#F0F1FA] text-[#07152D] overflow-hidden">
        <div className="w-full px-5 sm:px-8 lg:px-[max(6vw,60px)]">
          <div className="max-w-4xl">
            <Rise>
              <p className="font-display text-[11px] font-medium uppercase tracking-[0.24em] text-[#0062EC] mb-3">
                Entretenimento
              </p>
            </Rise>
            <Lines as="h1" className="h-xl !text-[#07152D]" lines={["Muito conteúdo", <span className="italic text-[#0062EC]">no seu plano.</span>]} />
            <Rise delay={0.2}>
              <p className="lead mt-6 text-[#334155] leading-relaxed max-w-2xl">
                HBO Max, Disney+ e Deezer selecionados pela equipe INET para você aproveitar filmes, séries e música com a velocidade da fibra.
              </p>
            </Rise>
          </div>
        </div>
      </section>

      {/* 2. Apps Showcase: Azul-noite de contraste */}
      <div data-contrast="dark" className="bg-[#010818] text-white">
        <AppsShowcase tag="Apps e streaming" />
      </div>

      {/* 3. WorkGrid: Claro-neve com cards escuros de contraste (não branco sobre fundo claro) */}
      <WorkGrid
        id="experiencia-streaming"
        tag="Filmes e séries"
        title={["Cinema e música", <span className="italic text-[#0062EC]">no seu plano.</span>]}
        variant="snow"
      >
        <WorkCard
          tag="01 · Filmes e séries"
          title="HBO Max no plano 800 Mega"
          subtitle="Blockbusters, clássicos do cinema e originais exclusivos para maratonar."
          imageSrc="/apps/hbo-1.webp"
          aspect="aspect-[16/11]"
          badge="Incluso 800 Mega"
          theme="light"
          href="/internet#planos"
        />
        <WorkCard
          tag="02 · Música sem limites"
          title="Deezer nos planos 700 Mega e 1 Giga"
          subtitle="Deezer Premium sem anúncios, com download para ouvir offline."
          imageSrc="/apps/deezer-1.webp"
          aspect="aspect-[4/5]"
          offsetY="md:mt-16 lg:mt-24"
          badge="700M e 1 Giga"
          theme="light"
          href="/internet#planos"
        />
      </WorkGrid>

      {/* 4. Moods: Azul-noite de contraste */}
      <section data-contrast="dark" className="py-20 sm:py-28 bg-[#010818] text-white">
        <div className="w-full px-5 sm:px-8 lg:px-[max(6vw,60px)]">
          <div className="mb-12 border-b border-white/10 pb-8">
            <p className="font-display text-[11px] font-medium uppercase tracking-[0.24em] text-lime mb-3">
              Para maratonar
            </p>
            <Lines className="h-lg !text-white" lines={["Qual é o seu", "clima de hoje?"]} />
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {MOODS.map((m, i) => (
              <Rise key={m.title} delay={i * 0.06}>
                <MoodCard m={m} offset={i * 1400} />
              </Rise>
            ))}
          </div>
        </div>
      </section>

      {/* 5. CTA: Azul INET */}
      <section data-contrast="dark" className="py-16 sm:py-20 bg-[#0062EC] text-white">
        <div className="w-full px-5 sm:px-8 lg:px-[max(6vw,60px)] flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <Lines className="h-md !text-white [&_span]:!text-white" lines={["Monte seu plano", <span className="italic !text-white underline decoration-lime">com entretenimento.</span>]} />
            <p className="mt-3 !text-white/90 max-w-xl">Nossa equipe mostra quais planos incluem cada app.</p>
          </div>
          <a href={waLink("Olá! Quero um plano da INET com apps de entretenimento.")} target="_blank" rel="noreferrer" className="btn-lime shrink-0">
            Falar no WhatsApp
          </a>
        </div>
      </section>
    </>
  );
}
