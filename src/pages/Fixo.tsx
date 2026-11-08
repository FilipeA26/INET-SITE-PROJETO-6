import React from "react";
import { ArrowLeftRight, AudioLines, Building2, Coins, Home as HomeIcon, PhoneCall, Server, ShieldCheck } from "lucide-react";
import { useReducedMotion } from "framer-motion";
import PlanCarousel from "../components/PlanCarousel";
import Lines, { Rise, Fit } from "../components/Lines";
import LusionSection from "../components/t3p/LusionSection";
import { Faq } from "../components/ui";
import { PHONES, waLink } from "../data/inet";

function VideoHero() {
  const reduce = useReducedMotion();
  return (
    <section className="relative isolate flex min-h-[85svh] items-end py-20 overflow-hidden bg-[#010818] text-white">
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
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,#010818_0%,rgba(1,12,34,0.88)_45%,rgba(2,26,74,0.45)_100%)]" />
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 -z-10 h-48 bg-gradient-to-t from-[#010818] to-transparent" />
      <div className="w-full px-5 sm:px-8 lg:px-[max(6vw,60px)]">
        <Rise><Fit className="tag">Telefone fixo</Fit></Rise>
        <Lines as="h1" className="h-xl mt-5 max-w-5xl !text-white" lines={["Ligue à vontade,", <span className="italic text-lime">sem limite.</span>]} />
        <Rise delay={0.2}>
          <p className="lead mt-6 max-w-2xl text-white/80">
            Telefonia fixa usando a fibra óptica como base: áudio digital, livre de interferências ou chiados, e ligações ilimitadas para qualquer fixo ou celular do país.
          </p>
        </Rise>
        <Rise delay={0.35} className="mt-9 flex flex-wrap gap-3">
          <a href="#planos" className="btn-lime">Planos com telefone</a>
          <a href={waLink("Olá! Quero um telefone fixo da INET.")} target="_blank" rel="noreferrer" className="btn-ghost">
            Falar com um vendedor
          </a>
        </Rise>
      </div>
    </section>
  );
}

export default function Fixo() {
  return (
    <>
      {/* 1. Hero: Azul-noite com vídeo de fundo */}
      <VideoHero />

      {/* 2. Vantagens: Claro-neve (corte limpo) */}
      <LusionSection
        tag="Vantagens"
        title={["Tudo o que você precisa", "em um plano de telefonia."]}
        variant="snow"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          <div data-contrast="dark" className="rounded-[1.75rem] border border-black/10 bg-[#07152D] p-8 text-white shadow-lg">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-lime mb-6">
              <PhoneCall size={22} aria-hidden="true" />
            </span>
            <h3 className="font-display text-xl !text-white">Ligue à vontade</h3>
            <p className="mt-3 text-sm !text-white/80 leading-relaxed">Ligações ilimitadas para qualquer lugar do Brasil.</p>
          </div>

          <div data-contrast="dark" className="rounded-[1.75rem] border border-black/10 bg-[#07152D] p-8 text-white shadow-lg">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-lime mb-6">
              <ShieldCheck size={22} aria-hidden="true" />
            </span>
            <h3 className="font-display text-xl !text-white">Segurança</h3>
            <p className="mt-3 text-sm !text-white/80 leading-relaxed">Segurança e estabilidade em suas ligações.</p>
          </div>

          <div data-contrast="dark" className="rounded-[1.75rem] border border-black/10 bg-[#07152D] p-8 text-white shadow-lg">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-lime mb-6">
              <AudioLines size={22} aria-hidden="true" />
            </span>
            <h3 className="font-display text-xl !text-white">Alta tecnologia</h3>
            <p className="mt-3 text-sm !text-white/80 leading-relaxed">Seu telefone fixo usando o poder da fibra óptica, com áudio digital.</p>
          </div>

          <div data-contrast="dark" className="rounded-[1.75rem] border border-black/10 bg-[#07152D] p-8 text-white shadow-lg">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-lime mb-6">
              <ArrowLeftRight size={22} aria-hidden="true" />
            </span>
            <h3 className="font-display text-xl !text-white">Portabilidade</h3>
            <p className="mt-3 text-sm !text-white/80 leading-relaxed">Traga o seu número de outra operadora para a INET.</p>
          </div>
        </div>
      </LusionSection>

      {/* 3. Para Casa e Empresa: Azul INET (Corte limpo) */}
      <LusionSection
        tag="Para casa e empresa"
        title={["Uma linha para", <span className="italic !text-white">cada necessidade.</span>]}
        variant="blue"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <div className="rounded-[2.5rem] border border-white/20 bg-[#010C22]/85 p-8 sm:p-12 text-white shadow-xl backdrop-blur-md">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-lime mb-6">
              <HomeIcon size={24} aria-hidden="true" />
            </span>
            <h3 className="font-display text-2xl sm:text-3xl font-light !text-white">Telefone para sua casa</h3>
            <p className="mt-4 leading-relaxed !text-white/85">
              Falar com quem se ama é uma das melhores coisas da vida, e melhor ainda é falar à vontade: máxima qualidade de áudio, sem interrupções ou chiados, e chamadas ilimitadas para fixos e celulares de todo o Brasil.
            </p>
            <p className="mt-6 text-sm text-lime font-medium">Já tem telefone em casa? Faça a portabilidade e traga seu número para a INET.</p>
          </div>

          <div className="rounded-[2.5rem] border border-white/20 bg-[#010C22]/85 p-8 sm:p-12 text-white shadow-xl backdrop-blur-md">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-lime mb-6">
              <Building2 size={24} aria-hidden="true" />
            </span>
            <h3 className="font-display text-2xl sm:text-3xl font-light !text-white">Telefone para sua empresa</h3>
            <p className="mt-4 leading-relaxed !text-white/85">
              Comunicação eficiente é a chave para o sucesso dos negócios. Com telefonia de alta qualidade pela fibra, sua empresa liga e recebe ligações à vontade, sem interrupções ou chiados, para você se concentrar no crescimento do negócio.
            </p>
            <p className="mt-6 text-sm text-lime font-medium">Também com portabilidade do número atual.</p>
          </div>
        </div>
      </LusionSection>

      {/* 4. Planos: Azul-noite de contraste */}
      <section id="planos" data-contrast="dark" className="py-20 sm:py-28 bg-[#010818] text-white">
        <div className="w-full px-5 sm:px-8 lg:px-[max(6vw,60px)]">
          <div className="mb-12 border-b border-white/10 pb-8">
            <p className="font-display text-[11px] font-medium uppercase tracking-[0.24em] text-lime mb-3">
              Internet + telefone
            </p>
            <Lines className="h-lg !text-white" lines={["Planos de internet", "com telefonia inclusa."]} />
          </div>
          <PlanCarousel groups={["fixo"]} />

          <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div data-contrast="dark" className="rounded-2xl border border-white/10 bg-[#07152D] p-6 text-white">
              <Server size={22} className="text-lime mb-3" />
              <h4 className="font-display text-lg !text-white">Melhor infraestrutura</h4>
              <p className="mt-2 text-xs !text-white/65">Estrutura de última geração para garantir o melhor serviço.</p>
            </div>
            <div data-contrast="dark" className="rounded-2xl border border-white/10 bg-[#07152D] p-6 text-white">
              <AudioLines size={22} className="text-lime mb-3" />
              <h4 className="font-display text-lg !text-white">Áudio digital</h4>
              <p className="mt-2 text-xs !text-white/65">Ligações pela fibra óptica com áudio digital.</p>
            </div>
            <div data-contrast="dark" className="rounded-2xl border border-white/10 bg-[#07152D] p-6 text-white">
              <Coins size={22} className="text-lime mb-3" />
              <h4 className="font-display text-lg !text-white">Melhor custo</h4>
              <p className="mt-2 text-xs !text-white/65">A melhor telefonia pelo melhor custo.</p>
            </div>
            <div data-contrast="dark" className="rounded-2xl border border-white/10 bg-[#07152D] p-6 text-white">
              <ArrowLeftRight size={22} className="text-lime mb-3" />
              <h4 className="font-display text-lg !text-white">Portabilidade</h4>
              <p className="mt-2 text-xs !text-white/65">Traga seu número para a INET.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Dúvidas: Claro-neve */}
      <LusionSection
        tag="Dúvidas"
        title={["Dúvidas sobre", "a telefonia fixa."]}
        variant="snow"
        layout="5-7"
        media={
          <div data-contrast="dark" className="rounded-[2.5rem] border border-black/10 bg-[#07152D] p-8 sm:p-12 text-white shadow-xl [&_button]:!text-white [&_button:hover]:!text-lime [&_div]:!text-white/80 [&_svg]:!text-lime">
            <Faq
              items={[
                { q: "Posso usar o mesmo número que tenho em outra operadora?", a: "Sim. Você pode solicitar a portabilidade do seu número para uma linha INET de forma simples; consulte um vendedor." },
                { q: "Qual é a cobertura da telefonia fixa?", a: "A mesma da rede de fibra óptica da INET. Para confirmar o seu endereço, fale com o atendimento." },
                { q: "Como é a qualidade da ligação?", a: "A telefonia da INET é totalmente digital, livre de ruídos e chiados durante as ligações." },
                { q: "Como faço para contratar?", a: <>Fale com um vendedor pelo telefone ou WhatsApp <a className="text-[#0062EC] underline" href={`tel:${PHONES[0].tel}`}>{PHONES[0].display}</a>.</> },
              ]}
            />
          </div>
        }
      />

      {/* 6. CTA: Claro-neve para Azul INET */}
      <section data-contrast="dark" className="py-16 sm:py-20 bg-[#0062EC] text-white">
        <div className="w-full px-5 sm:px-8 lg:px-[max(6vw,60px)] flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <Lines className="h-md !text-white [&_span]:!text-white" lines={["Ligue sem preocupação,", <span className="italic !text-white underline decoration-lime">com a fibra da INET.</span>]} />
          </div>
          <a href={waLink("Olá! Quero contratar um plano de telefone fixo da INET.")} target="_blank" rel="noreferrer" className="btn-lime shrink-0">
            Falar no WhatsApp
          </a>
        </div>
      </section>
    </>
  );
}
