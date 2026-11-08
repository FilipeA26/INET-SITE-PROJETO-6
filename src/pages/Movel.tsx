import { ArrowLeftRight, Coins, ExternalLink, MessageCircle, Navigation, PhoneCall, Signal } from "lucide-react";
import PlanCarousel from "../components/PlanCarousel";
import Lines, { Rise, Fit } from "../components/Lines";
import WorkGrid from "../components/lusion/WorkGrid";
import WorkCard from "../components/lusion/WorkCard";
import { CtaBand, Faq, FeatureCard, Note, Section, usePageMeta } from "../components/ui";
import ScrollSpin from "../components/giro/ScrollSpin";
import InetPhone from "../components/giro/InetPhone";
import SectionBackdrop from "../components/fundos/SectionBackdrop";
import { waLink } from "../data/inet";

const HIGHLIGHTS = [
  { icon: Signal, label: "Rede 5G" },
  { icon: MessageCircle, label: "WhatsApp ilimitado" },
  { icon: Navigation, label: "Waze ilimitado" },
  { icon: ArrowLeftRight, label: "Portabilidade +2 GB" },
];

export default function Movel() {
  usePageMeta("Chip móvel 5G", "Chip móvel INET com acesso à rede 5G, ligações ilimitadas para todo o Brasil, WhatsApp e Waze ilimitados. Faça a portabilidade e ganhe 2 Giga a mais.");

  return (
    <>
      <section className="page-hero r7-surface relative isolate overflow-hidden">
        <SectionBackdrop variant="mist" />
        <div aria-hidden="true" className="pointer-events-none absolute -right-40 -top-40 h-[560px] w-[560px] rounded-full bg-[#021A4A]/70 blur-[130px]" />
        <div aria-hidden="true" className="pointer-events-none absolute -left-32 top-40 h-[360px] w-[360px] rounded-full bg-lime/10 blur-[110px]" />
        <div className="wrap relative hero-split">
          <div className="hero-copy">
            <Rise><Fit className="tag">Chip móvel</Fit></Rise>
            <Lines as="h1" className="h-xl mt-5" lines={["Seu celular", <span className="italic text-lime">no 5G da INET.</span>]} />
            <Rise delay={0.3}>
              <p className="lead mt-6 max-w-xl">Planos de internet com telefonia móvel: acesso à rede 5G, ligações ilimitadas para qualquer operadora do Brasil e WhatsApp ilimitado.</p>
            </Rise>
            <Rise delay={0.4}>
              <ul className="mt-8 grid max-w-lg grid-cols-1 min-[420px]:grid-cols-2 gap-3">
                {HIGHLIGHTS.map((h) => (
                  <li key={h.label} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#010C22]/80 px-4 py-3 text-sm backdrop-blur">
                    <h.icon size={18} aria-hidden="true" className="shrink-0 text-lime" /> {h.label}
                  </li>
                ))}
              </ul>
            </Rise>
            <Rise delay={0.5} className="mt-9 flex flex-wrap gap-3">
              <a href="#planos" className="btn-lime">Planos com chip</a>
              <a href={waLink("Olá! Quero saber sobre o chip móvel da INET.")} target="_blank" rel="noreferrer" className="btn-ghost">Tirar dúvidas</a>
            </Rise>
          </div>
          <div className="hero-object hero-phone" aria-hidden="true"><InetPhone /></div>
        </div>
      </section>

      <div className="relative isolate">
        <SectionBackdrop variant="cinematic" />
        <ScrollSpin variant="phone" label="Celular INET com movimento pela rolagem"><InetPhone /></ScrollSpin>
      </div>

      <Section variant="snow" tag="Vantagens" title={["Tudo o que você precisa", "em um plano móvel."]}>
        <div className="grid gap-6 xl:gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <FeatureCard icon={Signal} title="Acesso à rede 5G" text="Todos os planos de telefonia móvel podem navegar na rede 5G." />
          <FeatureCard icon={PhoneCall} title="Ligações ilimitadas" text="Fale com qualquer operadora do Brasil sem se preocupar com a duração da chamada." delay={0.06} />
          <FeatureCard icon={MessageCircle} title="WhatsApp ilimitado" text="Em todos os planos móveis, o WhatsApp é ilimitado além da franquia de dados." delay={0.12} />
          <FeatureCard icon={Navigation} title="Waze ilimitado" text="O Waze não consome do seu pacote de dados." delay={0.18} />
          <FeatureCard icon={ArrowLeftRight} title="Portabilidade" text="Traga seu número de qualquer operadora para a INET." delay={0.24} />
          <FeatureCard icon={Coins} title="Melhor custo" text="Internet em casa e no celular no mesmo plano." delay={0.3} />
        </div>
      </Section>

      <Section variant="mist" layout="split" tag="Portabilidade" title={["Traga seu número", <span className="italic text-lime">e ganhe 2 Giga.</span>]}>
        <Rise>
          <div className="card flex flex-col gap-6 p-8 sm:flex-row sm:items-center sm:p-10">
            <p className="shrink-0 whitespace-nowrap font-display text-7xl font-light text-lime">+2<span className="text-3xl">GB</span></p>
            <p className="lead min-w-0 flex-1 max-w-xl">Trazendo seu número para a INET, além de todas as vantagens, você ganha mais 2 Giga de internet para navegar à vontade.</p>
          </div>
        </Rise>
        <Note>Condição publicada no site anterior; confirme a validade da oferta com o atendimento.</Note>
      </Section>

      <Section tag="Waze ilimitado" title={["Dirigir é mais fácil", "com o Waze."]}>
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <Rise>
            <p className="lead">O Waze é um app de navegação GPS com atualizações de trânsito em tempo real enviadas pelos próprios usuários: blitz, obras, radares e muito mais. Com a INET, ele é ilimitado e não consome do seu pacote de dados.</p>
          </Rise>
          <Rise delay={0.1} className="flex flex-wrap gap-3">
            <a href="https://play.google.com/store/apps/details?id=com.waze" target="_blank" rel="noreferrer" className="btn-ghost">Google Play <ExternalLink size={14} /></a>
            <a href="https://apps.apple.com/br/app/waze-gps-e-tr%C3%A2nsito-ao-vivo/id323229106" target="_blank" rel="noreferrer" className="btn-ghost">App Store <ExternalLink size={14} /></a>
          </Rise>
        </div>
      </Section>

      <WorkGrid
        id="experiencia-movel"
        tag="Experiência móvel"
        title={["Conexão total,", <span className="italic text-lime">dentro e fora de casa.</span>]}
        lead="Navegue na rede 5G com ligações ilimitadas e use os principais aplicativos sem consumir sua franquia."
        variant="ink"
      >
        <WorkCard
          tag="01 · Rede 5G e Apps"
          title="WhatsApp e Waze sem limite"
          subtitle="Em todos os planos móveis da INET, o WhatsApp e o Waze são ilimitados além da franquia de dados. Navegue e converse à vontade."
          imageSrc="/movel/site-mobile.webp"
          aspect="aspect-[16/11]"
          badge="Zero franquia"
          href="#planos"
        />
        <WorkCard
          tag="02 · Portabilidade"
          title="Traga seu número e ganhe 2 Giga"
          subtitle="Trazendo seu número de qualquer operadora para o chip móvel 5G da INET, você ganha 2 Giga de internet a mais no seu plano."
          imageSrc="/eventos/ims-mobile.png"
          aspect="aspect-[4/5]"
          offsetY="md:mt-16 lg:mt-24"
          badge="+2 GB de bônus"
          href={waLink("Olá! Quero fazer a portabilidade para a INET e ganhar 2 GB de bônus.")}
        />
      </WorkGrid>

      <Section id="planos" tag="Internet + chip" title={["Planos de internet", "com telefonia móvel."]}>
        <PlanCarousel groups={["movel"]} />
        <Note>O site anterior também anunciava versões com 20 Giga móveis e o plano Casa Segura com chip, mas os valores não puderam ser recuperados. Confirme os planos móveis atuais com a INET.</Note>
      </Section>

      <Section variant="snow" layout="split" tag="Dúvidas" title={["Perguntas", "frequentes."]}>
        <Faq
          items={[
            { q: "O chip funciona na rede 5G?", a: "Sim, todos os planos de telefonia móvel podem navegar na rede 5G. A disponibilidade do sinal 5G depende da cobertura no local e da compatibilidade do aparelho." },
            { q: "O WhatsApp consome meus dados?", a: "Não. Em todos os planos móveis, o WhatsApp é ilimitado além da franquia de dados." },
            { q: "Posso manter meu número?", a: "Sim, pela portabilidade você traz seu número de qualquer operadora para a INET." },
            { q: "Qual é a área de cobertura móvel?", a: "Consulte o atendimento para confirmar a cobertura móvel na sua região." },
          ]}
        />
      </Section>

      <CtaBand title={["Pronto para levar a INET", <span className="italic text-lime">no seu celular?</span>]} text="Consulte nossa equipe para verificar a cobertura e escolher o melhor plano com chip móvel.">
        <a href={waLink("Olá! Quero contratar um plano de celular da INET.")} target="_blank" rel="noreferrer" className="btn-lime">Falar no WhatsApp</a>
      </CtaBand>
    </>
  );
}
