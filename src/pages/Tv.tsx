import { Clapperboard, Radio, Router, Tv as TvIcon } from "lucide-react";
import PlanCarousel from "../components/PlanCarousel";
import SideToCenter from "../components/giro/SideToCenter";
import SectionBackdrop from "../components/fundos/SectionBackdrop";
import { Rise } from "../components/Lines";
import { CtaBand, Faq, FeatureCard, Note, PageHero, Section, usePageMeta } from "../components/ui";
import { INET_TV, waLink } from "../data/inet";
import TmdbWeekly from "../components/TmdbWeekly";
import { ReelUnfold } from "../components/expandir";


export default function Tv() {
  usePageMeta("INET TV", "INET TV: canais de TV aberta ao vivo, rádios e filmes on demand na sua TV com o receptor INET TV, mesmo que ela não seja smart. Receptor em comodato.");

  return (
    <>
      <PageHero
        media={<img src="/inet-tv-receptor.webp" alt="" width={760} height={732} className="block h-auto w-full object-contain" />}
        tag="INET TV"
        title={["O jeito mais fácil", <span className="italic text-lime">de assistir TV.</span>]}
        lead="Canais de TV aberta ao vivo, estações de rádio e filmes on demand na sua TV com o receptor INET TV, mesmo que ela não seja smart."
      >
        <a href={waLink("Olá! Quero assinar a INET TV.")} target="_blank" rel="noreferrer" className="btn-lime">Assinar a INET TV</a>
        <a href="#planos" className="btn-ghost">Planos com TV</a>
      </PageHero>


      <div className="relative isolate">
        <SectionBackdrop variant="cinematic" />
        <SideToCenter variant="box" side="right" label="Receptor INET TV da lateral ao centro">
          <img src="/inet-tv-receptor.webp" width={760} height={732} alt="Receptor INET TV com controle remoto" loading="lazy" decoding="async" className="mx-auto block max-h-[65svh] h-auto w-full object-contain" />
        </SideToCenter>
      </div>

      <Section variant="snow" tag="O que você tem" title={["TV, rádio e filmes", "em qualquer tela."]}>
        <div className="grid gap-6 xl:gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <FeatureCard icon={TvIcon} title="Canais de TV" text="Os principais canais de TV aberta ao vivo." />
          <FeatureCard icon={Radio} title="Canais de rádio" text="Mais de 30 estações de rádio no seu dispositivo." delay={0.05} />
          <FeatureCard icon={Clapperboard} title="On demand" text="Centenas de filmes para assistir à vontade." delay={0.1} />
        </div>
        <Note>
          O site anterior informa a quantidade de canais de formas diferentes (“+65”, “mais de 90 canais de TV e rádio” e “+ de 100 canais” nos planos). Confirme o número atual com a INET.
        </Note>
      </Section>

      <TmdbWeekly />

      <ReelUnfold
        title={["TV, rádio e filmes", <span key="l" className="italic text-lime"> em qualquer tela.</span>]}
        subtitle="Canais de TV aberta ao vivo, estações de rádio e filmes on demand na sua TV com o receptor INET TV, mesmo que ela não seja smart."
        splitWords={["INET", "TV"]}
        playLabel="Assistir ao vivo"
        overlayTitle="TV, rádio e filmes em qualquer tela."
        overlayDescription="Funciona até em TV que não é smart com o receptor INET TV em comodato."
        perks={[
          "Canais de TV aberta ao vivo",
          "Mais de 30 estações de rádio no seu dispositivo",
          "Centenas de filmes on demand para assistir à vontade",
          "Recurso multitela em até 2 aparelhos simultâneos",
        ]}
        cta={{
          label: "Assinar a INET TV",
          href: waLink("Olá! Quero assinar a INET TV."),
        }}
      />

      <Section variant="mist" tag="Receptor INET TV" title={["Funciona até em", "TV que não é smart."]}>
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <img src="/inet-tv-receptor.webp" alt="Receptor INET TV com controle remoto" width={760} height={732} loading="lazy" className="mx-auto h-auto w-full max-w-[680px] lg:order-2" />
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
                  <p className="text-sm text-white/60">INET TV</p>
                  <p className="font-display text-4xl">R$ {INET_TV.price}<span className="text-base text-white/50">/mês</span></p>
                  <p className="mt-1 text-xs text-white/45">Valor mensal do serviço de TV.</p>
                </div>
              </div>
            </Rise>
          </div>
        </div>
      </Section>

      <Section variant="ink" id="planos" tag="Planos" title={["Internet fibra", "para assistir sem travar."]}>
        <PlanCarousel />
      </Section>

      <Section variant="snow" layout="split" tag="Dúvidas" title={["Perguntas", "frequentes."]}>
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
