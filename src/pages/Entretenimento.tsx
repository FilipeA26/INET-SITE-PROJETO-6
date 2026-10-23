import { Link } from "react-router-dom";
import Art, { type ArtKind } from "../components/Art";
import AppsShowcase from "../components/AppsShowcase";
import { Rise } from "../components/Lines";
import { CtaBand, PageHero, Section, usePageMeta } from "../components/ui";
import { waLink } from "../data/inet";

const MOODS: { title: string; text: string; art: ArtKind }[] = [
  { title: "Fantasia épica", text: "Reinos, dragões e batalhas pelo trono.", art: "fantasy" },
  { title: "Drama criminal", text: "Tensão, escolhas difíceis e reviravoltas.", art: "crime" },
  { title: "Sobrevivência", text: "Suspense para maratonar sem pausa.", art: "survival" },
];

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
