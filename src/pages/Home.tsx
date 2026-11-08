import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Gauge, Headset, Music, Phone, Smartphone, Tv, UserRound, Wifi, ArrowUpRight,
} from "lucide-react";
import NameHero from "../components/lusion/NameHero";
import ReelUnfold from "../components/lusion/ReelUnfold";
import ValueCards from "../components/lusion/ValueCards";
import ConnectFinale from "../components/lusion/ConnectFinale";
import PlanCarousel from "../components/PlanCarousel";
import SlideToSubscribe from "../components/SlideToSubscribe";
import ProductShot from "../components/ProductShot";
import Lines, { Rise, Fit } from "../components/Lines";
import { Faq, LinkCard, usePageMeta } from "../components/ui";
import { COMPANY, INET_TV, PHONES, STORES, waLink, type Plan } from "../data/inet";

export default function Home() {
  usePageMeta("", "INET: internet fibra óptica em Teófilo Otoni com planos de até 1 Giga, Wi-Fi grátis, TV, telefone fixo e chip 5G. Atendimento (33) 3536-3939.");
  const [plan, setPlan] = useState<Plan | null>(null);
  const homeRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={homeRef} className="r7-home relative bg-[#EFF3F9] text-navy-ink">
      <div className="relative z-10">
        {/* Abertura com NameHero inspirado no lusion.co/about: nome INET gigante em azul-noite sobre o neve */}
        <NameHero />

        {/* Desdobramento do painel cinemático ReelUnfold inspirado no PLAY REEL do lusion.co */}
        <ReelUnfold />

        {/* 01 — Planos (Ritmo Lusion: margem proporcional, título gigante à esquerda, apoio existente à direita) */}
        <section data-lateral="planos" id="planos" className="section-frame relative bg-[#EFF3F9] py-20">
          <div className="w-full px-5 sm:px-10 lg:px-[max(6vw,60px)]">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 pb-8 border-b border-navy/10">
              <div className="max-w-2xl text-left">
                <Rise><Fit className="tag text-electric">01 — Planos</Fit></Rise>
                <Lines className="h-lg mt-3" lines={["Deslize e", <span className="italic text-electric">escolha o seu.</span>]} />
              </div>
              <div className="max-w-sm lg:text-right">
                <Rise delay={0.2}>
                  <p className="lead text-navy-ink/75">Fibra com Wi-Fi grátis. Escolha e deslize para assinar.</p>
                </Rise>
              </div>
            </div>

            <div className="mt-12"><PlanCarousel selected={plan} onSelect={setPlan} /></div>
            <div id="assinar" className="mt-14"><SlideToSubscribe plan={plan} /></div>
          </div>
        </section>

        {/* 02 — Propaganda INET TV */}
        <section id="inet-tv" className="section-frame relative bg-[#EBF1F9] py-20">
          <div className="w-full px-5 sm:px-10 lg:px-[max(6vw,60px)]">
            <div className="pb-8 border-b border-navy/10">
              <Rise><Fit className="tag text-electric">02 — INET TV Box</Fit></Rise>
            </div>

            <Rise delay={0.1}>
              <div className="card relative mt-10 p-8 sm:p-12 border border-navy/15 bg-[#E2E8F4]/80 text-navy-ink shadow-[0_20px_50px_-20px_rgba(3,37,108,0.12)]">
                <div aria-hidden="true" className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-electric/10 blur-3xl" />
                <div className="home-product relative grid items-center gap-10 lg:grid-cols-[1.1fr_1fr]">
                  <div>
                    <Lines className="h-lg max-w-xl" lines={["A TV que vai", <span className="italic text-electric">aonde você vai.</span>]} />
                    <p className="lead mt-5 max-w-lg text-navy-ink/75">TV ao vivo, rádios e filmes em qualquer TV, até nas que não são smart.</p>
                    <ul className="mt-8 flex flex-wrap gap-2.5">
                      {["TV ao vivo", "+30 rádios", "Filmes on demand", "Suporte 24h"].map((c) => (
                        <li key={c} className="rounded-full border border-navy/15 bg-white/60 px-4 py-2 text-sm text-navy-ink font-medium">{c}</li>
                      ))}
                    </ul>
                    <div className="mt-9 flex flex-wrap gap-3">
                      <Link to="/tv" className="btn-lime">Conhecer a INET TV <ArrowUpRight size={15} aria-hidden="true" /></Link>
                      <a href={waLink("Olá! Quero assinar a INET TV.")} target="_blank" rel="noreferrer" className="btn-ghost">Assinar pelo WhatsApp</a>
                    </div>
                    <p className="mt-6 text-sm text-navy-ink/60">INET TV por R$ {INET_TV.price}/mês.</p>
                  </div>
                  <ProductShot src="/inet-tv-receptor.webp" alt="Receptor INET TV com controle remoto" width={760} height={732} glow="#0062EC" className="r7-media-bleed mx-auto w-full" />
                </div>
              </div>
            </Rise>
          </div>
        </section>

        {/* 03 — O que a INET oferece */}
        <section id="servicos" className="section-frame relative bg-[#EFF3F9] py-20">
          <div className="w-full px-5 sm:px-10 lg:px-[max(6vw,60px)]">
            <div className="pb-8 border-b border-navy/10">
              <Rise><Fit className="tag text-electric">03 — Serviços</Fit></Rise>
              <Lines className="h-lg mt-3 max-w-4xl" lines={["Tudo o que conecta", "a sua casa."]} />
            </div>

            <div className="home-services mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <LinkCard to="/internet" icon={Wifi} title="Internet e Wi-Fi" text="Até 1 Giga e Wi-Fi 6 na casa toda." tone="#0062EC" />
              <LinkCard to="/tv" icon={Tv} title="INET TV" text="TV ao vivo e filmes com o TV Box." tone="#003F99" delay={0.06} />
              <LinkCard to="/telefone-fixo" icon={Phone} title="Telefone fixo" text="Ligações ilimitadas para todo o Brasil." tone="#38B000" delay={0.12} />
              <LinkCard to="/movel" icon={Smartphone} title="Chip móvel" text="5G com WhatsApp e Waze ilimitados." tone="#0062EC" delay={0.18} />
              <LinkCard to="/entretenimento" icon={Music} title="Entretenimento" text="HBO Max, Disney+ e Deezer." tone="#003F99" delay={0.24} />
              <LinkCard to="/teste-de-velocidade" icon={Gauge} title="Teste de velocidade" text="Meça no servidor oficial INET." cta="Testar agora" tone="#0062EC" delay={0.3} />
            </div>
          </div>
        </section>

        {/* 04 — Por que INET: Cartas de valores em leque sobre fundo azul contrastante (imagem 7 do Lusion) */}
        <ValueCards />

        {/* 05 — Autoatendimento */}
        <section id="autoatendimento" className="section-frame relative bg-[#EBF1F9] py-20">
          <div className="w-full px-5 sm:px-10 lg:px-[max(6vw,60px)]">
            <div className="pb-8 border-b border-navy/10">
              <Rise><Fit className="tag text-electric">05 — Autoatendimento</Fit></Rise>
              <Lines className="h-lg mt-3 max-w-4xl" lines={["Resolva rápido,", "sem sair de casa."]} />
            </div>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <Rise className="h-full">
                <a href={COMPANY.clientArea} target="_blank" rel="noreferrer" className="card flex h-full flex-col p-7 border border-navy/15 bg-[#E2E8F4]/80 text-navy-ink">
                  <span className="card-icon flex h-12 w-12 items-center justify-center rounded-2xl bg-electric text-white"><UserRound size={22} aria-hidden="true" /></span>
                  <h3 className="mt-8 font-display text-xl text-navy-ink font-bold">Central do Cliente</h3>
                  <p className="mt-2 text-sm text-navy-ink/70">Faturas, segunda via e dados do contrato.</p>
                  <span className="card-link mt-auto pt-5">Acessar <ArrowUpRight size={15} aria-hidden="true" /></span>
                </a>
              </Rise>
              <LinkCard to="/suporte" icon={Headset} title="Suporte técnico" text="Atendimento 24h pelo WhatsApp." cta="Ver como" delay={0.06} />
              <LinkCard to="/teste-de-velocidade" icon={Gauge} title="Teste sua velocidade" text="Do jeito certo, em 1 minuto." cta="Entenda" delay={0.12} />
              <LinkCard to="/internet#wifi-mesh" icon={Wifi} title="Melhore o Wi-Fi" text="Sinal na casa toda com Mesh." cta="Entenda" delay={0.18} />
            </div>
          </div>
        </section>

        {/* 06 — Dúvidas */}
        <section id="duvidas" className="section-frame relative bg-[#EFF3F9] py-20">
          <div className="w-full px-5 sm:px-10 lg:px-[max(6vw,60px)]">
            <div className="pb-8 border-b border-navy/10">
              <Rise><Fit className="tag text-electric">06 — Dúvidas</Fit></Rise>
              <Lines className="h-lg mt-3 max-w-4xl" lines={["Dúvidas sobre", "os serviços INET."]} />
            </div>

            <div className="mt-10">
              <Faq
                items={[
                  { q: "Qual telefone da INET para contratar ou pedir suporte?", a: <>Todos os serviços estão disponíveis pelo telefone e WhatsApp <a className="text-electric underline font-medium" href={`tel:${PHONES[0].tel}`}>{PHONES[0].display}</a> e pelo telefone <a className="text-electric underline font-medium" href={`tel:${PHONES[1].tel}`}>{PHONES[1].display}</a>. Ligação gratuita: <a className="text-electric underline font-medium" href={`tel:${PHONES[2].tel}`}>{PHONES[2].display}</a>.</> },
                  { q: "Como saber se tem INET na minha rua?", a: <>A INET trabalha para que nenhuma rua ou bairro fique sem cobertura. Para confirmar o seu endereço, fale com a gente pelo <Link className="text-electric underline font-medium" to="/fale-conosco">Fale conosco</Link>.</> },
                  { q: "Quais os benefícios de contratar a INET?", a: "Internet com ultravelocidade, estabilidade, apps exclusivos, suporte 24 horas por dia, equipamentos e infraestrutura de ponta e atendimento humanizado." },
                  { q: "A INET possui loja física?", a: <>Sim, {STORES.length} lojas em Teófilo Otoni e Carlos Chagas. <Link className="text-electric underline font-medium" to="/cobertura#lojas">Ver no mapa</Link>.</> },
                ]}
              />
            </div>
          </div>
        </section>

        {/* ConnectFinale: tela final com partículas e WhatsApp sobre fundo azul contrastante */}
        <ConnectFinale />
      </div>
    </div>
  );
}
