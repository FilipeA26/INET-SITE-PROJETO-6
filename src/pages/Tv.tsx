import { Clapperboard, Radio, Router, Tv as TvIcon } from "lucide-react";
import PlanCarousel from "../components/PlanCarousel";
import ProductShot from "../components/ProductShot";
import { Rise } from "../components/Lines";
import { CtaBand, Faq, FeatureCard, Note, PageHero, Section, usePageMeta } from "../components/ui";
import { INET_TV, waLink } from "../data/inet";
import TmdbWeekly from "../components/TmdbWeekly";

const CHANNELS = ["Globo", "SBT", "Record", "Band", "RedeTV!", "Rede Vida", "TV Senado", "Canção Nova", "Polishop", "Futura"];

export default function Tv() {
  usePageMeta("INET TV", "INET TV: canais de TV aberta ao vivo, rádios e filmes on demand na sua TV com o receptor INET TV, mesmo que ela não seja smart. Receptor em comodato.");

  return (
    <>
      <PageHero
        tag="INET TV"
        title={["O jeito mais fácil", <span className="italic text-lime">de assistir TV.</span>]}
        lead="Canais de TV aberta ao vivo, estações de rádio e filmes on demand na sua TV com o receptor INET TV, mesmo que ela não seja smart."
      >
        <a href={waLink("Olá! Quero assinar a INET TV.")} target="_blank" rel="noreferrer" className="btn-lime">Assinar a INET TV</a>
        <a href="#planos" className="btn-ghost">Planos com TV</a>
      </PageHero>

      <Section tag="O que você tem" title={["TV, rádio e filmes", "em qualquer tela."]}>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <FeatureCard icon={TvIcon} title="Canais de TV" text="Os principais canais de TV aberta ao vivo." />
          <FeatureCard icon={Radio} title="Canais de rádio" text="Mais de 30 estações de rádio no seu dispositivo." delay={0.05} />
          <FeatureCard icon={Clapperboard} title="On demand" text="Centenas de filmes para assistir à vontade." delay={0.1} />
        </div>
        <Note>
          O site anterior informa a quantidade de canais de formas diferentes (“+65”, “mais de 90 canais de TV e rádio” e “+ de 100 canais” nos planos). Confirme o número atual com a INET.
        </Note>
      </Section>

      <Section tag="Principais canais" title={["Os canais que você", "mais assiste."]}>
        <Rise>
          <ul className="flex flex-wrap gap-2.5">
            {CHANNELS.map((c) => (
              <li key={c} className="rounded-full border border-white/15 bg-white/[0.04] px-5 py-2.5 font-display text-lg">{c}</li>
            ))}
          </ul>
        </Rise>
        <Note>Lista conforme o site anterior. A grade pode mudar; confirme a programação atual.</Note>
      </Section>

      <TmdbWeekly />

      <Section tag="Receptor INET TV" title={["Funciona até em", "TV que não é smart."]}>
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <ProductShot src="/inet-tv-receptor.webp" alt="Receptor INET TV com controle remoto" width={760} height={732} glow="#38B000" className="mx-auto w-full max-w-[460px] lg:order-2" />
          <div>
            <Rise>
              <p className="lead">
                O receptor INET TV traz mais conforto para usar em qualquer tipo de TV, mesmo quando ela não é smart. Leve o receptor para onde quiser: basta conectá-lo a uma rede Wi-Fi, pegar o controle remoto e curtir a programação.
              </p>
            </Rise>
            <Rise delay={0.1}>
              <div className="card mt-8 flex items-center gap-6 p-7">
                <Router size={36} aria-hidden="true" className="card-icon shrink-0 text-lime" />
                <div>
                  <p className="text-sm text-white/60">Receptor em comodato</p>
                  <p className="font-display text-4xl">R$ {INET_TV.receiverPrice}<span className="text-base text-white/50">/mês</span></p>
                  <p className="mt-1 text-xs text-white/45">Valor do site anterior; confirme com o atendimento.</p>
                </div>
              </div>
            </Rise>
          </div>
        </div>
      </Section>

      <Section id="planos" tag="Planos" title={["Internet fibra", "para assistir sem travar."]}>
        <PlanCarousel />
      </Section>

      <Section tag="Dúvidas" title={["Perguntas", "frequentes."]}>
        <Faq
          items={[
            { q: "Em quantos aparelhos posso assistir ao mesmo tempo?", a: "Com o recurso multitela, em até 2 dispositivos simultâneos." },
            { q: "Minha TV não é smart. Consigo assistir?", a: "Sim, com o receptor INET TV, que funciona conectado a uma rede Wi-Fi." },
            { q: "Como funciona o receptor?", a: "Basta ligar o receptor INET TV na TV pelo HDMI, conectá-lo ao Wi-Fi e usar o controle remoto. O suporte 24h ajuda na instalação: (33) 3536-3939." },
          ]}
        />
      </Section>

      <CtaBand title={["Quer TV no", <span className="italic text-lime">seu plano?</span>]} text="A equipe da INET ajuda você a escolher o plano com INET TV.">
        <a href={waLink("Olá! Quero um plano da INET com INET TV.")} target="_blank" rel="noreferrer" className="btn-lime">Falar no WhatsApp</a>
      </CtaBand>
    </>
  );
}
