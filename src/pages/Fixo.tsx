import { ArrowLeftRight, AudioLines, Building2, Coins, Home as HomeIcon, PhoneCall, Server, ShieldCheck } from "lucide-react";
import { useReducedMotion } from "framer-motion";
import PlanCarousel from "../components/PlanCarousel";
import Lines, { Rise } from "../components/Lines";
import { CtaBand, Faq, FeatureCard, Section, usePageMeta } from "../components/ui";
import { PHONES, waLink } from "../data/inet";

/** Hero com vídeo de fundo (Pexels, ver public/fixo/FONTES.md) e véu escuro para a leitura. */
function VideoHero() {
  const reduce = useReducedMotion();
  return (
    <section className="relative isolate flex min-h-[88svh] items-end overflow-hidden pb-16 pt-36 sm:pb-24 sm:pt-44">
      {reduce ? (
        <img src="/fixo/telefone-poster.webp" alt="" aria-hidden="true" className="absolute inset-0 -z-10 h-full w-full object-cover" />
      ) : (
        <video
          className="absolute inset-0 -z-10 h-full w-full object-cover"
          src="/fixo/telefone.mp4"
          poster="/fixo/telefone-poster.webp"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
        />
      )}
      {/* véu escuro nos azuis profundos da INET */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,#010818_0%,rgba(1,12,34,0.88)_45%,rgba(2,26,74,0.45)_100%)]" />
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 -z-10 h-48 bg-gradient-to-t from-[#010818] to-transparent" />
      <div aria-hidden="true" className="pointer-events-none absolute -left-32 top-40 -z-10 h-[360px] w-[360px] rounded-full bg-lime/10 blur-[110px]" />
      <div className="wrap">
        <Rise><p className="tag">Telefone fixo</p></Rise>
        <Lines as="h1" className="h-xl mt-5 max-w-5xl" lines={["Ligue à vontade,", <span className="italic text-lime">sem limite.</span>]} />
        <Rise delay={0.3}>
          <p className="lead mt-6 max-w-2xl">Telefonia fixa usando a fibra óptica como base: áudio digital, livre de interferências ou chiados, e ligações ilimitadas para qualquer fixo ou celular do país.</p>
        </Rise>
        <Rise delay={0.45} className="mt-9 flex flex-wrap gap-3">
          <a href="#planos" className="btn-lime">Planos com telefone</a>
          <a href={waLink("Olá! Quero um telefone fixo da INET.")} target="_blank" rel="noreferrer" className="btn-ghost">Falar com um vendedor</a>
        </Rise>
      </div>
    </section>
  );
}

export default function Fixo() {
  usePageMeta("Telefone fixo", "Telefonia fixa INET pela fibra óptica: ligações ilimitadas para fixo e celular de todo o Brasil, áudio digital sem chiado e portabilidade do seu número.");

  return (
    <>
      <VideoHero />

      <Section tag="Vantagens" title={["Tudo o que você precisa", "em um plano de telefonia."]}>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <FeatureCard icon={PhoneCall} title="Ligue à vontade" text="Ligações ilimitadas para qualquer lugar do Brasil." />
          <FeatureCard icon={ShieldCheck} title="Segurança" text="Segurança e estabilidade em suas ligações." delay={0.06} />
          <FeatureCard icon={AudioLines} title="Alta tecnologia" text="Seu telefone fixo usando o poder da fibra óptica, com áudio digital." delay={0.12} />
          <FeatureCard icon={ArrowLeftRight} title="Portabilidade" text="Traga o seu número de outra operadora para a INET." delay={0.18} />
        </div>
      </Section>

      <Section tag="Para casa e empresa" title={["Uma linha para", "cada necessidade."]}>
        <div className="grid gap-4 lg:grid-cols-2">
          <Rise className="h-full">
            <article className="card h-full p-8">
              <HomeIcon size={24} aria-hidden="true" className="card-icon text-lime" />
              <h3 className="h-md mt-5">Telefone para sua casa</h3>
              <p className="mt-4 leading-relaxed text-white/70">Falar com quem se ama é uma das melhores coisas da vida, e melhor ainda é falar à vontade. Mantenha a familiaridade da linha tradicional com a tecnologia da fibra: máxima qualidade de áudio, sem interrupções ou chiados, e chamadas ilimitadas para fixos e celulares de todo o Brasil.</p>
              <p className="mt-4 text-sm text-white/55">Já tem telefone em casa? Faça a portabilidade e traga seu número para a INET.</p>
            </article>
          </Rise>
          <Rise delay={0.08} className="h-full">
            <article className="card h-full p-8">
              <Building2 size={24} aria-hidden="true" className="card-icon text-lime" />
              <h3 className="h-md mt-5">Telefone para sua empresa</h3>
              <p className="mt-4 leading-relaxed text-white/70">Comunicação eficiente é a chave para o sucesso dos negócios. Com telefonia de alta qualidade pela fibra, sua empresa liga e recebe ligações à vontade, sem interrupções ou chiados, para você se concentrar no crescimento do negócio.</p>
              <p className="mt-4 text-sm text-white/55">Também com portabilidade do número atual.</p>
            </article>
          </Rise>
        </div>
      </Section>

      <Section id="planos" tag="Internet + telefone" title={["Planos de internet", "com telefonia inclusa."]}>
        <PlanCarousel groups={["fixo"]} />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <FeatureCard icon={Server} title="Melhor infraestrutura" text="Estrutura de última geração para garantir o melhor serviço." />
          <FeatureCard icon={AudioLines} title="Áudio digital" text="Ligações pela fibra óptica com áudio digital." delay={0.06} />
          <FeatureCard icon={Coins} title="Melhor custo" text="A melhor telefonia pelo melhor custo." delay={0.12} />
          <FeatureCard icon={ArrowLeftRight} title="Portabilidade" text="Traga seu número para a INET." delay={0.18} />
        </div>
      </Section>

      <Section tag="Dúvidas" title={["Dúvidas sobre", "a telefonia fixa."]}>
        <Faq
          items={[
            { q: "Posso usar o mesmo número que tenho em outra operadora?", a: "Sim. Você pode solicitar a portabilidade do seu número para uma linha INET de forma simples; consulte um vendedor." },
            { q: "Qual é a cobertura da telefonia fixa?", a: "A mesma da rede de fibra óptica da INET. Para confirmar o seu endereço, fale com o atendimento." },
            { q: "Como é a qualidade da ligação?", a: "A telefonia da INET é totalmente digital, livre de ruídos e chiados durante as ligações." },
            { q: "Como faço para contratar?", a: <>Fale com um vendedor pelo telefone ou WhatsApp <a className="text-lime underline" href={`tel:${PHONES[0].tel}`}>{PHONES[0].display}</a>.</> },
          ]}
        />
      </Section>

      <CtaBand title={["Traga seu número", <span className="italic text-lime">para a INET.</span>]} text="Contrate o telefone fixo para sua casa ou empresa com quem entende de fibra.">
        <a href={waLink("Olá! Quero contratar telefone fixo da INET.")} target="_blank" rel="noreferrer" className="btn-lime">Falar no WhatsApp</a>
        <a href={`tel:${PHONES[0].tel}`} className="btn-ghost">Ligar {PHONES[0].display}</a>
      </CtaBand>
    </>
  );
}
