import { ArrowLeftRight, Coins, ExternalLink, MessageCircle, Navigation, PhoneCall, Signal } from "lucide-react";
import PlanCarousel from "../components/PlanCarousel";
import { Rise } from "../components/Lines";
import { CtaBand, Faq, FeatureCard, Note, PageHero, Section, usePageMeta } from "../components/ui";
import { waLink } from "../data/inet";

export default function Movel() {
  usePageMeta("Chip móvel 5G", "Chip móvel INET com acesso à rede 5G, ligações ilimitadas para todo o Brasil, WhatsApp e Waze ilimitados. Faça a portabilidade e ganhe 2 Giga a mais.");

  return (
    <>
      <PageHero
        tag="Chip móvel"
        title={["Seu celular", <span className="italic text-lime">no 5G da INET.</span>]}
        lead="Planos de internet com telefonia móvel: acesso à rede 5G, ligações ilimitadas para qualquer operadora do Brasil e WhatsApp ilimitado."
      >
        <a href="#planos" className="btn-lime">Planos com chip</a>
        <a href={waLink("Olá! Quero saber sobre o chip móvel da INET.")} target="_blank" rel="noreferrer" className="btn-ghost">Tirar dúvidas</a>
      </PageHero>

      <Section tag="Vantagens" title={["Tudo o que você precisa", "em um plano móvel."]}>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <FeatureCard icon={Signal} title="Acesso à rede 5G" text="Todos os planos de telefonia móvel podem navegar na rede 5G." />
          <FeatureCard icon={PhoneCall} title="Ligações ilimitadas" text="Fale com qualquer operadora do Brasil sem se preocupar com a duração da chamada." delay={0.06} />
          <FeatureCard icon={MessageCircle} title="WhatsApp ilimitado" text="Em todos os planos móveis, o WhatsApp é ilimitado além da franquia de dados." delay={0.12} />
          <FeatureCard icon={Navigation} title="Waze ilimitado" text="O Waze não consome do seu pacote de dados." delay={0.18} />
          <FeatureCard icon={ArrowLeftRight} title="Portabilidade" text="Traga seu número de qualquer operadora para a INET." delay={0.24} />
          <FeatureCard icon={Coins} title="Melhor custo" text="Internet em casa e no celular no mesmo plano." delay={0.3} />
        </div>
      </Section>

      <Section tag="Portabilidade" title={["Traga seu número", <span className="italic text-lime">e ganhe 2 Giga.</span>]}>
        <Rise>
          <div className="card flex flex-col gap-6 p-8 sm:flex-row sm:items-center sm:p-10">
            <p className="font-display text-7xl font-light text-lime">+2<span className="text-3xl">GB</span></p>
            <p className="lead max-w-xl">Trazendo seu número para a INET, além de todas as vantagens, você ganha mais 2 Giga de internet para navegar à vontade.</p>
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

      <Section id="planos" tag="Internet + chip" title={["Planos de internet", "com telefonia móvel."]}>
        <PlanCarousel groups={["movel"]} />
        <Note>O site anterior também anunciava versões com 20 Giga móveis e o plano Casa Segura com chip, mas os valores não puderam ser recuperados. Confirme os planos móveis atuais com a INET.</Note>
      </Section>

      <Section tag="Dúvidas" title={["Perguntas", "frequentes."]}>
        <Faq
          items={[
            { q: "O chip funciona na rede 5G?", a: "Sim, todos os planos de telefonia móvel podem navegar na rede 5G. A disponibilidade do sinal 5G depende da cobertura no local e da compatibilidade do aparelho." },
            { q: "O WhatsApp consome meus dados?", a: "Não. Em todos os planos móveis, o WhatsApp é ilimitado além da franquia de dados." },
            { q: "Posso manter meu número?", a: "Sim, pela portabilidade você traz seu número de qualquer operadora para a INET." },
            { q: "Qual é a área de cobertura móvel?", a: "Consulte o atendimento para confirmar a cobertura móvel na sua região." },
          ]}
        />
      </Section>

      <CtaBand title={["Fale à vontade,", <span className="italic text-lime">navegue no 5G.</span>]} text="Contrate seu plano com chip móvel e faça a portabilidade com a ajuda da nossa equipe.">
        <a href={waLink("Olá! Quero um plano com chip móvel da INET.")} target="_blank" rel="noreferrer" className="btn-lime">Falar no WhatsApp</a>
      </CtaBand>
    </>
  );
}
