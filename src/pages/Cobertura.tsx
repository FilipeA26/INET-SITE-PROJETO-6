import React from "react";
import { ExternalLink, MapPin, Store } from "lucide-react";
import CityMap from "../components/CityMap";
import CepCheck from "../components/CepCheck";
import Lines, { Rise } from "../components/Lines";
import LusionSection from "../components/t3p/LusionSection";
import { Faq, Note, usePageMeta } from "../components/ui";
import { PHONES, STORES, waLink } from "../data/inet";

export default function Cobertura() {
  usePageMeta(
    "Cobertura e lojas",
    "Consulte pelo CEP se a fibra da INET atende o seu endereço. Lojas em Teófilo Otoni (Centro, Grão Pará e Concórdia) e Carlos Chagas."
  );

  return (
    <>
      {/* 1. Hero: Claro-neve (Apple) com grade de 12 colunas e laterais preenchidas (Lusion) */}
      <section className="relative isolate py-20 sm:py-28 bg-[#F0F1FA] text-[#07152D] overflow-hidden">
        <div className="w-full px-5 sm:px-8 lg:px-[max(6vw,60px)]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-[3vw] items-center">
            <div className="lg:col-span-5">
              <Rise>
                <p className="font-display text-[11px] font-medium uppercase tracking-[0.24em] text-[#0062EC] mb-3">
                  Cobertura · Teófilo Otoni e Carlos Chagas
                </p>
              </Rise>
              <Lines as="h1" className="h-xl !text-[#07152D]" lines={["Tem INET", <span className="italic text-[#0062EC]">na sua casa?</span>]} />
              <Rise delay={0.2}>
                <p className="lead mt-6 text-[#334155] leading-relaxed">
                  Digite seu CEP e veja se a fibra da INET chega até você. Depois, encontre a loja mais perto no mapa.
                </p>
              </Rise>
              <Rise delay={0.35} className="mt-9 flex flex-wrap gap-3">
                <a href="#cep" className="btn-lime">
                  Consultar meu CEP
                </a>
                <a
                  href={`tel:${PHONES[0].tel}`}
                  className="btn-ghost !text-[#07152D] !border-black/20 hover:!border-[#0062EC] hover:!text-[#0062EC]"
                >
                  Ligar {PHONES[0].display}
                </a>
              </Rise>
            </div>

            {/* Grid 7 colunas: Presença física com as 4 lojas em cartões de contraste */}
            <div className="lg:col-span-7">
              <Rise delay={0.25}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {STORES.map((s) => (
                    <div
                      key={s.name}
                      data-contrast="dark"
                      className="group rounded-2xl border border-black/10 bg-[#07152D] p-6 text-white shadow-lg transition-transform duration-500 hover:-translate-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-lime">
                          <Store size={18} aria-hidden="true" />
                        </span>
                        <a
                          href={s.maps}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 text-xs text-white/60 transition-colors duration-300 hover:text-lime"
                        >
                          Como chegar <ExternalLink size={12} aria-hidden="true" />
                        </a>
                      </div>
                      <h3 className="mt-4 font-display text-lg font-medium !text-white">{s.name}</h3>
                      <p className="mt-1 text-xs !text-white/80 leading-relaxed">{s.address}</p>
                    </div>
                  ))}
                </div>
              </Rise>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Consulta de CEP: Azul INET (#0062EC) em ritmo 5/7 colunas */}
      <LusionSection
        id="cep"
        tag="Consulta de cobertura"
        title={["Verifique pelo", <span className="italic !text-white">seu CEP.</span>]}
        variant="blue"
        layout="5-7"
        media={<CepCheck />}
      />

      {/* 3. Lojas e Mapa Interativo: Azul-noite (#010818) */}
      <LusionSection
        id="lojas"
        tag="Lojas"
        title={["Quatro lojas", <span className="italic text-lime">perto de você.</span>]}
        variant="ink"
        layout="stack"
      >
        <CityMap />
        <div className="mt-6">
          <Note>
            O mapa mostra a cidade e as lojas da INET; ele não representa a área técnica de cobertura. As posições dos marcadores são aproximadas: use “Como chegar” para a localização exata. Mapa © colaboradores do OpenStreetMap.
          </Note>
        </div>
      </LusionSection>

      {/* 4. Dúvidas: Claro-neve (#F0F1FA) com card de contraste escuro */}
      <LusionSection
        id="faq"
        tag="Dúvidas"
        title={["Cobertura", "e atendimento."]}
        variant="snow"
        layout="5-7"
        media={
          <div data-contrast="dark" className="rounded-[2.5rem] border border-black/10 bg-[#07152D] p-8 sm:p-12 text-white shadow-xl [&_button]:!text-white [&_button:hover]:!text-lime [&_div]:!text-white/80 [&_svg]:!text-lime">
            <Faq
              items={[
                {
                  q: "Como saber se tem INET na minha rua?",
                  a: "Use a consulta por CEP acima: ela mostra se a INET atende a sua cidade e já abre o WhatsApp com o seu endereço para a equipe confirmar a rua e o número.",
                },
                {
                  q: "A cobertura do telefone fixo é a mesma da internet?",
                  a: "Sim, a telefonia fixa usa a mesma rede de fibra óptica da INET.",
                },
                {
                  q: "Posso contratar presencialmente?",
                  a: "Sim. A INET tem três lojas em Teófilo Otoni (Centro, Grão Pará e Concórdia) e uma em Carlos Chagas.",
                },
              ]}
            />
          </div>
        }
      />

      {/* 5. CTA Band: Azul INET (#0062EC) */}
      <section data-contrast="dark" className="py-16 sm:py-20 bg-[#0062EC] text-white">
        <div className="w-full px-5 sm:px-8 lg:px-[max(6vw,60px)] flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <Lines className="h-md !text-white [&_span]:!text-white" lines={["Leve a fibra", <span className="italic !text-white underline decoration-lime">para sua casa.</span>]} />
            <p className="mt-3 !text-white/90 max-w-xl">Envie seu endereço e a equipe confirma a disponibilidade.</p>
          </div>
          <a
            href={waLink("Olá! Quero saber se a INET atende o meu endereço: ")}
            target="_blank"
            rel="noreferrer"
            className="btn-lime shrink-0"
          >
            Falar no WhatsApp
          </a>
        </div>
      </section>
    </>
  );
}
