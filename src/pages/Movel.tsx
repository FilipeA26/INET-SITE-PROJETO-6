import React from "react";
import { ArrowLeftRight, Coins, ExternalLink, MessageCircle, Navigation, PhoneCall, Signal } from "lucide-react";
import PlanCarousel from "../components/PlanCarousel";
import Lines, { Rise, Fit } from "../components/Lines";
import WorkGrid from "../components/lusion/WorkGrid";
import WorkCard from "../components/lusion/WorkCard";
import LusionSection from "../components/t3p/LusionSection";
import DeviceGiro from "../components/t3p/DeviceGiro";
import InetPhone from "../components/giro/InetPhone";
import { CtaBand, Faq } from "../components/ui";
import { waLink } from "../data/inet";

const HIGHLIGHTS = [
  { icon: Signal, label: "Rede 5G" },
  { icon: MessageCircle, label: "WhatsApp ilimitado" },
  { icon: Navigation, label: "Waze ilimitado" },
  { icon: ArrowLeftRight, label: "Portabilidade +2 GB" },
];

export default function Movel() {
  return (
    <>
      {/* 1. Hero: Claro-neve (Apple) com grade de 12 colunas e laterais preenchidas */}
      <section className="relative isolate py-20 sm:py-28 bg-[#F0F1FA] text-[#07152D] overflow-hidden">
        <div className="w-full px-5 sm:px-8 lg:px-[max(6vw,60px)]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-[3vw] items-center">
            <div className="lg:col-span-5">
              <Rise>
                <p className="font-display text-[11px] font-medium uppercase tracking-[0.24em] text-[#0062EC] mb-3">
                  Chip móvel
                </p>
              </Rise>
              <Lines as="h1" className="h-xl !text-[#07152D]" lines={["Seu celular", <span className="italic text-[#0062EC]">no 5G da INET.</span>]} />
              <Rise delay={0.2}>
                <p className="lead mt-6 text-[#334155] leading-relaxed">
                  Planos de internet com telefonia móvel: acesso à rede 5G, ligações ilimitadas para qualquer operadora do Brasil e WhatsApp ilimitado.
                </p>
              </Rise>
              <Rise delay={0.3}>
                <ul className="mt-8 grid max-w-lg grid-cols-1 min-[420px]:grid-cols-2 gap-3">
                  {HIGHLIGHTS.map((h) => (
                    <li key={h.label} className="flex items-center gap-3 rounded-2xl border border-black/10 bg-white/80 px-4 py-3 text-sm font-medium text-[#07152D] shadow-sm backdrop-blur">
                      <h.icon size={18} aria-hidden="true" className="shrink-0 text-[#0062EC]" /> {h.label}
                    </li>
                  ))}
                </ul>
              </Rise>
              <Rise delay={0.4} className="mt-9 flex flex-wrap gap-3">
                <a href="#planos" className="btn-lime">Planos com chip</a>
                <a href={waLink("Olá! Quero saber sobre o chip móvel da INET.")} target="_blank" rel="noreferrer" className="btn-ghost !text-[#07152D] !border-black/20 hover:!border-[#0062EC] hover:!text-[#0062EC]">
                  Tirar dúvidas
                </a>
              </Rise>
            </div>

            <div className="lg:col-span-7 flex justify-center">
              <div className="w-[min(65vw,290px)] drop-shadow-[0_24px_50px_rgba(0,10,35,0.25)]">
                <InetPhone />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Device Giro: Celular gira com a rolagem em 3D, vem da lateral para o centro e volta (Azul-noite) */}
      <DeviceGiro
        device="phone"
        initialSide="right"
        tag="Rede 5G móvel"
        title={["Conexão 5G", <span className="italic text-lime">em movimento.</span>]}
        badge="Chip 5G INET"
        variant="ink"
      />

      {/* 3. Vantagens: Claro-neve (corte limpo) com grade de 12 colunas e cards escuros de contraste */}
      <LusionSection
        tag="Vantagens"
        title={["Tudo o que você precisa", "em um plano móvel."]}
        variant="snow"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          <div data-contrast="dark" className="rounded-[1.75rem] border border-black/10 bg-[#07152D] p-8 text-white shadow-lg">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-lime mb-6">
              <Signal size={22} aria-hidden="true" />
            </span>
            <h3 className="font-display text-xl !text-white">Acesso à rede 5G</h3>
            <p className="mt-3 text-sm !text-white/80 leading-relaxed">Todos os planos de telefonia móvel podem navegar na rede 5G.</p>
          </div>

          <div data-contrast="dark" className="rounded-[1.75rem] border border-black/10 bg-[#07152D] p-8 text-white shadow-lg">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-lime mb-6">
              <PhoneCall size={22} aria-hidden="true" />
            </span>
            <h3 className="font-display text-xl !text-white">Ligações ilimitadas</h3>
            <p className="mt-3 text-sm !text-white/80 leading-relaxed">Fale com qualquer operadora do Brasil sem se preocupar com a duração da chamada.</p>
          </div>

          <div data-contrast="dark" className="rounded-[1.75rem] border border-black/10 bg-[#07152D] p-8 text-white shadow-lg">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-lime mb-6">
              <MessageCircle size={22} aria-hidden="true" />
            </span>
            <h3 className="font-display text-xl !text-white">WhatsApp ilimitado</h3>
            <p className="mt-3 text-sm !text-white/80 leading-relaxed">Em todos os planos móveis, o WhatsApp é ilimitado além da franquia de dados.</p>
          </div>

          <div data-contrast="dark" className="rounded-[1.75rem] border border-black/10 bg-[#07152D] p-8 text-white shadow-lg">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-lime mb-6">
              <Navigation size={22} aria-hidden="true" />
            </span>
            <h3 className="font-display text-xl !text-white">Waze ilimitado</h3>
            <p className="mt-3 text-sm !text-white/80 leading-relaxed">O Waze não consome do seu pacote de dados.</p>
          </div>

          <div data-contrast="dark" className="rounded-[1.75rem] border border-black/10 bg-[#07152D] p-8 text-white shadow-lg">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-lime mb-6">
              <ArrowLeftRight size={22} aria-hidden="true" />
            </span>
            <h3 className="font-display text-xl !text-white">Portabilidade</h3>
            <p className="mt-3 text-sm !text-white/80 leading-relaxed">Traga seu número de qualquer operadora para a INET.</p>
          </div>

          <div data-contrast="dark" className="rounded-[1.75rem] border border-black/10 bg-[#07152D] p-8 text-white shadow-lg">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-lime mb-6">
              <Coins size={22} aria-hidden="true" />
            </span>
            <h3 className="font-display text-xl !text-white">Melhor custo</h3>
            <p className="mt-3 text-sm !text-white/80 leading-relaxed">Internet em casa e no celular no mesmo plano.</p>
          </div>
        </div>
      </LusionSection>

      {/* 4. Portabilidade: Azul INET (5/7 alternado) */}
      <LusionSection
        tag="Portabilidade"
        title={["Traga seu número", <span className="italic !text-white">e ganhe 2 Giga.</span>]}
        lead="Trazendo seu número para a INET, além de todas as vantagens, você ganha mais 2 Giga de internet para navegar à vontade."
        variant="blue"
        layout="5-7"
        media={
          <div className="flex items-center justify-center lg:justify-start">
            <div className="inline-flex items-center justify-center rounded-[2rem] border border-white/25 bg-[#010C22]/85 px-8 py-6 text-white shadow-2xl backdrop-blur-md">
              <p className="font-display text-5xl sm:text-6xl font-light text-lime">+2<span className="text-2xl sm:text-3xl">GB</span></p>
            </div>
          </div>
        }
      />

      {/* 5. Waze Ilimitado: Azul-noite (7/5 alternando os lados) */}
      <LusionSection
        tag="Waze ilimitado"
        title={["Dirigir é mais fácil", <span className="italic text-lime">com o Waze.</span>]}
        lead="O Waze é um app de navegação GPS com atualizações de trânsito em tempo real enviadas pelos próprios usuários: blitz, obras, radares e muito mais. Com a INET, ele é ilimitado e não consome do seu pacote de dados."
        variant="ink"
        layout="7-5"
        media={
          <div className="rounded-[2.5rem] border border-white/20 bg-gradient-to-br from-[#0B2556] to-[#04122B] p-8 sm:p-10 text-white shadow-[0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-md flex flex-col justify-center">
            <div className="flex items-center gap-4 mb-4">
              <Navigation size={32} className="text-lime" />
              <span className="font-display text-2xl font-light !text-white">Waze ilimitado</span>
            </div>
            <p className="text-sm !text-white/85 leading-relaxed">
              O Waze não consome do seu pacote de dados.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="https://play.google.com/store/apps/details?id=com.waze"
                target="_blank"
                rel="noreferrer"
                className="btn border border-white/30 bg-white/10 !text-white hover:border-lime hover:!text-lime hover:bg-white/15 transition-colors"
              >
                Google Play <ExternalLink size={14} />
              </a>
              <a
                href="https://apps.apple.com/br/app/waze-gps-e-tr%C3%A2nsito-ao-vivo/id323229106"
                target="_blank"
                rel="noreferrer"
                className="btn border border-white/30 bg-white/10 !text-white hover:border-lime hover:!text-lime hover:bg-white/15 transition-colors"
              >
                App Store <ExternalLink size={14} />
              </a>
            </div>
          </div>
        }
      />

      {/* 6. WorkGrid: Claro-neve com cards escuros de contraste (não branco sobre fundo claro) */}
      <WorkGrid
        id="experiencia-movel"
        tag="Experiência móvel"
        title={["Conexão total,", <span className="italic text-[#0062EC]">dentro e fora de casa.</span>]}
        lead="Navegue na rede 5G com ligações ilimitadas e use os principais aplicativos sem consumir sua franquia."
        variant="snow"
      >
        <WorkCard
          tag="01 · Rede 5G e Apps"
          title="WhatsApp e Waze sem limite"
          subtitle="Em todos os planos móveis da INET, o WhatsApp e o Waze são ilimitados além da franquia de dados. Navegue e converse à vontade."
          imageSrc="/movel/site-mobile.webp"
          aspect="aspect-[16/11]"
          badge="Zero franquia"
          theme="light"
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
          theme="light"
          href={waLink("Olá! Quero fazer a portabilidade para a INET e ganhar 2 GB de bônus.")}
        />
      </WorkGrid>

      {/* 7. Planos: Azul-noite de contraste */}
      <section id="planos" data-contrast="dark" className="py-20 sm:py-28 bg-[#010818] text-white">
        <div className="w-full px-5 sm:px-8 lg:px-[max(6vw,60px)]">
          <div className="mb-12 border-b border-white/10 pb-8">
            <p className="font-display text-[11px] font-medium uppercase tracking-[0.24em] text-lime mb-3">
              Internet + chip
            </p>
            <Lines className="h-lg !text-white" lines={["Planos de internet", "com telefonia móvel."]} />
          </div>
          <PlanCarousel groups={["movel"]} />
        </div>
      </section>

      {/* 8. Dúvidas: Claro-neve */}
      <LusionSection
        tag="Dúvidas"
        title={["Perguntas", "frequentes."]}
        variant="snow"
        layout="5-7"
        media={
          <div data-contrast="dark" className="rounded-[2.5rem] border border-black/10 bg-[#07152D] p-8 sm:p-12 text-white shadow-xl [&_button]:!text-white [&_button:hover]:!text-lime [&_div]:!text-white/80 [&_svg]:!text-lime">
            <Faq
              items={[
                { q: "O chip funciona na rede 5G?", a: "Sim, todos os planos de telefonia móvel podem navegar na rede 5G. A disponibilidade do sinal 5G depende da cobertura no local e da compatibilidade do aparelho." },
                { q: "O WhatsApp consome meus dados?", a: "Não. Em todos os planos móveis, o WhatsApp é ilimitado além da franquia de dados." },
                { q: "Posso manter meu número?", a: "Sim, pela portabilidade você traz seu número de qualquer operadora para a INET." },
                { q: "Qual é a área de cobertura móvel?", a: "Consulte o atendimento para confirmar a cobertura móvel na sua região." },
              ]}
            />
          </div>
        }
      />

      {/* 9. CTA Band: Azul INET */}
      <section data-contrast="dark" className="py-16 sm:py-20 bg-[#0062EC] text-white">
        <div className="w-full px-5 sm:px-8 lg:px-[max(6vw,60px)] flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <Lines className="h-md !text-white [&_span]:!text-white" lines={["Pronto para levar a INET", <span className="italic !text-white underline decoration-lime">no seu celular?</span>]} />
            <p className="mt-3 !text-white/90 max-w-xl">Consulte nossa equipe para verificar a cobertura e escolher o melhor plano com chip móvel.</p>
          </div>
          <a href={waLink("Olá! Quero contratar um plano de celular da INET.")} target="_blank" rel="noreferrer" className="btn-lime shrink-0">
            Falar no WhatsApp
          </a>
        </div>
      </section>
    </>
  );
}
