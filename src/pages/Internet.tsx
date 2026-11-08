import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Gauge } from "lucide-react";
import PlanCarousel from "../components/PlanCarousel";
import Wifi6 from "../components/Wifi6";
import MeshHouse from "../components/MeshHouse";
import WorkGrid from "../components/lusion/WorkGrid";
import WorkCard from "../components/lusion/WorkCard";
import LusionSection from "../components/t3p/LusionSection";
import SlideToSubscribe from "../components/SlideToSubscribe";
import Lines, { Rise } from "../components/Lines";
import { Faq } from "../components/ui";
import { waLink, type Plan } from "../data/inet";

export default function Internet() {
  const [plan, setPlan] = useState<Plan | null>(null);

  return (
    <>
      {/* 1. Hero: Claro-neve (Apple) com grade 12 colunas e margem proporcional max(6vw, 60px) */}
      <section className="relative isolate py-20 sm:py-28 bg-[#F0F1FA] text-[#07152D] overflow-hidden">
        <div className="w-full px-5 sm:px-8 lg:px-[max(6vw,60px)]">
          <div className="max-w-4xl">
            <Rise>
              <p className="font-display text-[11px] font-medium uppercase tracking-[0.24em] text-[#0062EC] mb-3">
                Internet e Wi-Fi
              </p>
            </Rise>
            <Lines as="h1" className="h-xl !text-[#07152D]" lines={["Internet fibra", <span className="italic text-[#0062EC]">de até 1 Giga.</span>]} />
            <Rise delay={0.2}>
              <p className="lead mt-6 text-[#334155] leading-relaxed max-w-2xl">
                Internet fibra óptica para jogar online, assistir filmes e acessar suas redes sociais com alta estabilidade, Wi-Fi grátis e aplicativos incluídos nos planos.
              </p>
            </Rise>
            <Rise delay={0.35} className="mt-9 flex flex-wrap gap-3">
              <a href="#planos" className="btn-lime">Ver planos</a>
              <a href={waLink("Olá! Quero saber se a internet da INET atende o meu endereço.")} target="_blank" rel="noreferrer" className="btn-ghost !text-[#07152D] !border-black/20 hover:!border-[#0062EC] hover:!text-[#0062EC]">
                Consultar disponibilidade
              </a>
            </Rise>
          </div>
        </div>
      </section>

      {/* 2. Planos: Azul-noite de contraste (corte limpo) */}
      <section id="planos" data-contrast="dark" className="py-20 sm:py-28 bg-[#010818] text-white">
        <div className="w-full px-5 sm:px-8 lg:px-[max(6vw,60px)]">
          <div className="mb-12 border-b border-white/10 pb-8">
            <p className="font-display text-[11px] font-medium uppercase tracking-[0.24em] text-lime mb-3">
              Planos de internet
            </p>
            <Lines className="h-lg !text-white" lines={["Escolha pelo seu", "jeito de usar."]} />
          </div>
          <PlanCarousel selected={plan} onSelect={setPlan} />
          <div className="mt-14"><SlideToSubscribe plan={plan} /></div>
        </div>
      </section>

      {/* 3. Wi-Fi 6: Claro-neve */}
      <div className="bg-[#F0F1FA] text-[#07152D]">
        <Wifi6 />
      </div>

      {/* 4. Mesh House: Azul-noite */}
      <div data-contrast="dark" className="bg-[#010818] text-white">
        <MeshHouse id="wifi-mesh" />
      </div>

      {/* 5. WorkGrid: Casa Inteligente (Claro-neve com cards escuros de contraste) */}
      <WorkGrid
        id="casa-inteligente"
        tag="Casa inteligente"
        title={["Sua casa conectada", <span className="italic text-[#0062EC]">em cada detalhe.</span>]}
        variant="snow"
      >
        <WorkCard
          tag="01 · Automação residencial"
          title="Controle por voz com Alexa"
          subtitle="Lâmpadas, TV e rotinas conectadas na rede Wi-Fi da INET para responder aos seus comandos de voz."
          videoSrc="/casa/alexa.mp4"
          posterSrc="/casa/alexa-poster.webp"
          imageSrc="/casa-inteligente.webp"
          aspect="aspect-[16/11]"
          badge="Automação Wi-Fi"
          theme="light"
          href={waLink("Olá! Quero saber mais sobre automação e Wi-Fi na INET.")}
        />
        <WorkCard
          tag="02 · Segurança residencial"
          title="Câmera Wi-Fi Intelbras Mibo"
          subtitle="Acompanhe tudo ao vivo no celular com imagem nítida, visão noturna e gravação sem travar com a fibra da INET."
          videoSrc="/casa/seg.mp4"
          posterSrc="/casa/seg-poster.webp"
          imageSrc="/casa/mibo.webp"
          aspect="aspect-[4/5]"
          offsetY="md:mt-16 lg:mt-24"
          badge="Ao vivo no celular"
          theme="light"
          href={waLink("Olá! Quero saber sobre a câmera Intelbras Mibo e fibra INET.")}
        />
      </WorkGrid>

      {/* 6. Dúvidas: Azul-noite */}
      <LusionSection
        tag="Dúvidas"
        title={["Perguntas", "frequentes."]}
        variant="ink"
        layout="5-7"
        media={
          <div data-contrast="dark" className="rounded-[2.5rem] border border-white/10 bg-[#07152D] p-8 sm:p-12 text-white shadow-xl [&_button]:!text-white [&_button:hover]:!text-lime [&_div]:!text-white/80 [&_svg]:!text-lime">
            <Faq
              items={[
                { q: "O Wi-Fi está incluído nos planos?", a: "Sim. Os planos publicados pela INET incluem roteador Wi-Fi grátis; alguns incluem Wi-Fi premium, roteador Wi-Fi 6 ou 2 roteadores mesh." },
                { q: "O sinal está fraco em alguns cômodos. O problema é o plano?", a: "Normalmente não. O sinal do roteador enfraquece a cada parede ou obstáculo. Uma rede mesh distribui o sinal pela casa toda." },
                { q: "Tem plano sem fidelidade?", a: "Sim, a linha INET Livre (500 Mega, 700 Mega e 1 Giga) permite cancelar quando quiser. Esses planos são pré-pagos, com mínimo de 30 dias e taxa de instalação de R$ 230,00 à vista ou em 3x no cartão." },
                { q: "Como saber a velocidade real da minha conexão?", a: <>Faça o teste com um computador ligado por cabo ao roteador, seguindo as orientações da página <Link className="text-lime underline" to="/teste-de-velocidade">Teste de velocidade</Link>.</> },
              ]}
            />
          </div>
        }
      />

      {/* 7. CTA: Azul INET */}
      <section data-contrast="dark" className="py-16 sm:py-20 bg-[#0062EC] text-white">
        <div className="w-full px-5 sm:px-8 lg:px-[max(6vw,60px)] flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <Lines className="h-md !text-white [&_span]:!text-white" lines={["Pronto para", <span className="italic !text-white underline decoration-lime">ligar a luz?</span>]} />
            <p className="mt-3 !text-white/90 max-w-xl">Fale com a nossa equipe para confirmar a disponibilidade no seu endereço e escolher o plano ideal.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a href={waLink("Olá! Quero contratar a internet fibra da INET.")} target="_blank" rel="noreferrer" className="btn-lime">
              Falar no WhatsApp
            </a>
            <Link to="/teste-de-velocidade" className="btn-ghost !border-white/30 !text-white hover:!border-lime hover:!text-lime">
              <Gauge size={16} /> Testar velocidade
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
