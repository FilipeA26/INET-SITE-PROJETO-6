import React from "react";
import { Clapperboard, Radio, Tv as TvIcon } from "lucide-react";
import PlanCarousel from "../components/PlanCarousel";
import Lines, { Rise } from "../components/Lines";
import WorkGrid from "../components/lusion/WorkGrid";
import WorkCard from "../components/lusion/WorkCard";
import LusionSection from "../components/t3p/LusionSection";
import DeviceGiro from "../components/t3p/DeviceGiro";
import { Faq } from "../components/ui";
import { INET_TV, waLink } from "../data/inet";
import TmdbWeekly from "../components/TmdbWeekly";

export default function Tv() {
  return (
    <>
      {/* 1. Hero: Claro-neve com grade 12 colunas e laterais preenchidas */}
      <section className="relative isolate py-20 sm:py-28 bg-[#F0F1FA] text-[#07152D] overflow-hidden">
        <div className="w-full px-5 sm:px-8 lg:px-[max(6vw,60px)]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-[3vw] items-center">
            <div className="lg:col-span-5">
              <Rise>
                <p className="font-display text-[11px] font-medium uppercase tracking-[0.24em] text-[#0062EC] mb-3">
                  INET TV
                </p>
              </Rise>
              <Lines as="h1" className="h-xl !text-[#07152D]" lines={["O jeito mais fácil", <span className="italic text-[#0062EC]">de assistir TV.</span>]} />
              <Rise delay={0.2}>
                <p className="lead mt-6 text-[#334155] leading-relaxed">
                  Canais de TV aberta ao vivo, estações de rádio e filmes on demand na sua TV com o receptor INET TV, mesmo que ela não seja smart.
                </p>
              </Rise>
              <Rise delay={0.35} className="mt-9 flex flex-wrap gap-3">
                <a href={waLink("Olá! Quero assinar a INET TV.")} target="_blank" rel="noreferrer" className="btn-lime">
                  Assinar a INET TV
                </a>
                <a href="#planos" className="btn-ghost !text-[#07152D] !border-black/20 hover:!border-[#0062EC] hover:!text-[#0062EC]">
                  Planos com TV
                </a>
              </Rise>
            </div>

            <div className="lg:col-span-7 flex justify-center">
              <img
                src="/inet-tv-receptor.webp"
                alt="Receptor INET TV com controle remoto"
                width={760}
                height={732}
                className="block h-auto w-full max-w-[540px] object-contain drop-shadow-[0_24px_50px_rgba(0,10,35,0.25)]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Device Giro: Receptor INET TV gira em 3D da lateral ao centro e volta (Azul-noite) */}
      <DeviceGiro
        device="receptor"
        initialSide="left"
        tag="Receptor em comodato"
        title={["Sua TV comum vira", <span className="italic text-lime">uma Smart TV.</span>]}
        lead={`O receptor INET TV traz mais conforto para usar em qualquer tipo de TV. Basta conectá-lo ao Wi-Fi pelo HDMI e usar o controle remoto. Apenas R$ ${INET_TV.price}/mês em comodato.`}
        badge={`R$ ${INET_TV.price}/mês`}
        variant="ink"
      />

      {/* 3. Recursos: Claro-neve (corte limpo) */}
      <LusionSection
        tag="O que você tem"
        title={["TV, rádio e filmes", "em qualquer tela."]}
        variant="snow"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          <div data-contrast="dark" className="rounded-[1.75rem] border border-black/10 bg-[#07152D] p-8 text-white shadow-lg">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-lime mb-6">
              <TvIcon size={22} aria-hidden="true" />
            </span>
            <h3 className="font-display text-xl !text-white">Canais de TV</h3>
            <p className="mt-3 text-sm !text-white/80 leading-relaxed">Os principais canais de TV aberta ao vivo.</p>
          </div>

          <div data-contrast="dark" className="rounded-[1.75rem] border border-black/10 bg-[#07152D] p-8 text-white shadow-lg">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-lime mb-6">
              <Radio size={22} aria-hidden="true" />
            </span>
            <h3 className="font-display text-xl !text-white">Canais de rádio</h3>
            <p className="mt-3 text-sm !text-white/80 leading-relaxed">Mais de 30 estações de rádio no seu dispositivo.</p>
          </div>

          <div data-contrast="dark" className="rounded-[1.75rem] border border-black/10 bg-[#07152D] p-8 text-white shadow-lg">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-lime mb-6">
              <Clapperboard size={22} aria-hidden="true" />
            </span>
            <h3 className="font-display text-xl !text-white">On demand</h3>
            <p className="mt-3 text-sm !text-white/80 leading-relaxed">Centenas de filmes para assistir à vontade.</p>
          </div>
        </div>
      </LusionSection>

      {/* 4. Vitrine semanal de filmes: Azul-noite de contraste */}
      <div data-contrast="dark" className="bg-[#010818] text-white">
        <TmdbWeekly />
      </div>

      {/* 5. WorkGrid: Claro-neve com cards escuros de contraste */}
      <WorkGrid
        id="experiencia-tv"
        tag="Experiência INET TV"
        title={["Sua TV completa,", <span className="italic text-[#0062EC]">ao vivo e on demand.</span>]}
        lead="Canais de TV aberta ao vivo, estações de rádio e filmes on demand na sua TV com o receptor INET TV, mesmo que ela não seja smart."
        variant="snow"
      >
        <WorkCard
          tag="01 · Filmes e Séries On Demand"
          title="Centenas de títulos para maratonar"
          subtitle="O catálogo on demand traz grandes produções para curtir em até 2 dispositivos simultâneos com a fibra da INET."
          imageSrc="/moods/fantasia-1.webp"
          aspect="aspect-[16/11]"
          badge="Até 2 telas"
          theme="light"
          href="#planos"
        />
        <WorkCard
          tag="02 · Receptor em comodato"
          title="Funciona até em TV que não é smart"
          subtitle={`Leve o receptor para onde quiser: conecte ao Wi-Fi pelo HDMI, pegue o controle remoto e curta a programação. R$ ${INET_TV.price}/mês em comodato.`}
          imageSrc="/inet-tv-receptor.webp"
          aspect="aspect-[4/5]"
          offsetY="md:mt-16 lg:mt-24"
          badge={`R$ ${INET_TV.price}/mês`}
          theme="light"
          href={waLink("Olá! Quero assinar o plano com receptor INET TV.")}
        />
      </WorkGrid>

      {/* 6. Planos: Azul-noite */}
      <section id="planos" data-contrast="dark" className="py-20 sm:py-28 bg-[#010818] text-white">
        <div className="w-full px-5 sm:px-8 lg:px-[max(6vw,60px)]">
          <div className="mb-12 border-b border-white/10 pb-8">
            <p className="font-display text-[11px] font-medium uppercase tracking-[0.24em] text-lime mb-3">
              Planos
            </p>
            <Lines className="h-lg !text-white" lines={["Internet fibra", "para assistir sem travar."]} />
          </div>
          <PlanCarousel />
        </div>
      </section>

      {/* 7. Dúvidas: Claro-neve */}
      <LusionSection
        tag="Dúvidas"
        title={["Perguntas", "frequentes."]}
        variant="snow"
        layout="5-7"
        media={
          <div data-contrast="dark" className="rounded-[2.5rem] border border-black/10 bg-[#07152D] p-8 sm:p-12 text-white shadow-xl [&_button]:!text-white [&_button:hover]:!text-lime [&_div]:!text-white/80 [&_svg]:!text-lime">
            <Faq
              items={[
                { q: "Em quantos aparelhos posso assistir ao mesmo tempo?", a: "Em até 2 dispositivos simultâneos." },
                { q: "Minha TV não é smart. Consigo assistir?", a: "Sim, com o receptor INET TV, que funciona conectado a uma rede Wi-Fi." },
                { q: "Como funciona o receptor?", a: "Basta ligar o receptor INET TV na TV pelo HDMI, conectá-lo ao Wi-Fi e usar o controle remoto. O suporte 24h ajuda na instalação: (33) 3536-3939." },
              ]}
            />
          </div>
        }
      />

      {/* 8. CTA: Azul INET */}
      <section data-contrast="dark" className="py-16 sm:py-20 bg-[#0062EC] text-white">
        <div className="w-full px-5 sm:px-8 lg:px-[max(6vw,60px)] flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <Lines className="h-md !text-white [&_span]:!text-white" lines={["Quer TV no", <span className="italic !text-white underline decoration-lime">seu plano?</span>]} />
            <p className="mt-3 !text-white/90 max-w-xl">A equipe da INET ajuda você a escolher o plano com INET TV.</p>
          </div>
          <a href={waLink("Olá! Quero um plano da INET com INET TV.")} target="_blank" rel="noreferrer" className="btn-lime shrink-0">
            Falar no WhatsApp
          </a>
        </div>
      </section>
    </>
  );
}
