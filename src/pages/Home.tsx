import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import {
  AppWindow, Gauge, Headset, Music, Phone, ShieldCheck, Smartphone, Tv, UserRound, Wifi, Zap, ArrowUpRight, Quote,
} from "lucide-react";
import Hero from "../components/Hero";
import Thread from "../components/Thread";
import PlanCarousel from "../components/PlanCarousel";
import SlideToSubscribe from "../components/SlideToSubscribe";
import CityMap from "../components/CityMap";
import Lines, { Rise } from "../components/Lines";
import { FeatureCard, Faq, LinkCard, usePageMeta } from "../components/ui";
import { SPRING } from "../motion";
import { COMPANY, PHONES, STORES, TESTIMONIALS, type Plan } from "../data/inet";

export default function Home() {
  usePageMeta("", "INET: internet fibra óptica em Teófilo Otoni com planos de até 1 Giga, Wi-Fi grátis, TV, telefone fixo e chip 5G. Atendimento (33) 3536-3939.");
  const [plan, setPlan] = useState<Plan | null>(null);
  const homeRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: homeRef, offset: ["start start", "end end"] });
  const p = useSpring(scrollYProgress, SPRING);
  // fundo escuro contínuo, só com os azuis profundos do manual da marca
  const bg = useTransform(p, [0, 0.3, 0.55, 0.8, 1], ["#010818", "#020F2E", "#03256C", "#020F2E", "#010818"]);

  return (
    <motion.div ref={homeRef} style={{ backgroundColor: bg }} className="relative">
      <Thread container={homeRef} />
      <div className="relative z-10">
        <Hero />

        {/* o que a INET oferece */}
        <section className="relative py-24 sm:py-32">
          <span data-node="right" className="absolute top-12" />
          <span data-node="right" className="absolute bottom-12" />
          <div className="wrap">
            <Rise><p className="tag">01 — Serviços</p></Rise>
            <Lines className="h-lg mt-4 max-w-3xl" lines={["Tudo o que conecta", "a sua casa."]} />
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <LinkCard to="/internet" icon={Wifi} title="Internet e Wi-Fi" text="Fibra óptica de até 1 Giga e Wi-Fi Mesh para a casa toda." tone="#0062EC" />
              <LinkCard to="/tv" icon={Tv} title="INET TV" text="NetFibra TV: canais abertos, rádios e filmes no celular, PC e smart TV." tone="#003F99" delay={0.06} />
              <LinkCard to="/telefone-fixo" icon={Phone} title="Telefone fixo" text="Ligações ilimitadas para fixo e celular de todo o Brasil." tone="#38B000" delay={0.12} />
              <LinkCard to="/movel" icon={Smartphone} title="Chip móvel" text="Chip 5G com WhatsApp e Waze ilimitados e portabilidade." tone="#0062EC" delay={0.18} />
              <LinkCard to="/entretenimento" icon={Music} title="Entretenimento" text="HBO Max, Deezer, Mumo e outros apps nos planos." tone="#7a2cff" delay={0.24} />
              <LinkCard to="/teste-de-velocidade" icon={Gauge} title="Teste de velocidade" text="Meça sua conexão no servidor oficial Inet Telecom." cta="Testar agora" tone="#70E000" delay={0.3} />
            </div>
          </div>
        </section>

        {/* planos */}
        <section id="planos" className="relative py-24 sm:py-32">
          <span data-node="left" className="absolute top-12" />
          <span data-node="left" className="absolute bottom-12" />
          <div className="wrap">
            <Rise><p className="tag">02 — Planos</p></Rise>
            <Lines className="h-lg mt-4 max-w-3xl" lines={["Deslize e", <span className="italic text-lime">escolha o seu.</span>]} />
            <Rise delay={0.2}><p className="lead mt-5 max-w-2xl">Internet fibra com Wi-Fi grátis em todos os planos. Toque duas vezes no plano para escolher e deslize para assinar.</p></Rise>
            <div className="mt-10"><PlanCarousel selected={plan} onSelect={setPlan} /></div>
            <div id="assinar" className="mt-14"><SlideToSubscribe plan={plan} /></div>
          </div>
        </section>

        {/* por que INET — conteúdo do site anterior */}
        <section className="relative py-24 sm:py-32">
          <span data-node="right" className="absolute top-12" />
          <span data-node="right" className="absolute bottom-12" />
          <div className="wrap">
            <Rise><p className="tag">03 — Por que INET</p></Rise>
            <Lines className="h-lg mt-4 max-w-3xl" lines={["Fibra óptica,", "wi-fi grátis e muito conteúdo."]} />
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <FeatureCard icon={Zap} title="Internet ultrarrápida" text="Muita velocidade para curtir filmes e jogos online com estabilidade." />
              <FeatureCard icon={AppWindow} title="Muitos aplicativos" text="Apps para curtir TV, filmes, música e leitura direto do smartphone." delay={0.06} />
              <FeatureCard icon={ShieldCheck} title="Estabilidade" text="Para jogar ou assistir online, uma conexão estável de ponta a ponta." delay={0.12} />
              <FeatureCard icon={Headset} title="Suporte 24 horas" text="Nosso time está disponível 24 horas por dia, 7 dias por semana." delay={0.18} />
            </div>
          </div>
        </section>

        {/* autoatendimento */}
        <section id="autoatendimento" className="relative py-24 sm:py-32">
          <span data-node="left" className="absolute top-12" />
          <span data-node="left" className="absolute bottom-12" />
          <div className="wrap">
            <Rise><p className="tag">04 — Autoatendimento</p></Rise>
            <Lines className="h-lg mt-4 max-w-3xl" lines={["Resolva rápido,", "sem sair de casa."]} />
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Rise className="h-full">
                <a href={COMPANY.clientArea} target="_blank" rel="noreferrer" className="card flex h-full flex-col p-7">
                  <span className="card-icon flex h-12 w-12 items-center justify-center rounded-2xl bg-lime text-navy-ink"><UserRound size={22} aria-hidden="true" /></span>
                  <h3 className="mt-8 font-display text-xl">Central do Cliente</h3>
                  <p className="mt-2 text-sm text-white/65">Faturas, segunda via e dados do contrato.</p>
                  <span className="card-link mt-auto pt-5">Acessar <ArrowUpRight size={15} aria-hidden="true" /></span>
                </a>
              </Rise>
              <LinkCard to="/suporte" icon={Headset} title="Suporte técnico" text="Passo a passo do atendimento 24h pelo WhatsApp." cta="Ver como" delay={0.06} />
              <LinkCard to="/teste-de-velocidade" icon={Gauge} title="Teste sua velocidade" text="Do jeito certo, no servidor Inet Telecom." cta="Entenda" delay={0.12} />
              <LinkCard to="/internet#wifi-mesh" icon={Wifi} title="Melhore o Wi-Fi" text="Entenda a rede mesh e leve sinal à casa toda." cta="Entenda" delay={0.18} />
            </div>
          </div>
        </section>

        {/* depoimentos */}
        <section className="relative py-24 sm:py-32">
          <span data-node="right" className="absolute top-12" />
          <span data-node="right" className="absolute bottom-12" />
          <div className="wrap">
            <Rise><p className="tag">05 — Depoimentos</p></Rise>
            <Lines className="h-lg mt-4 max-w-3xl" lines={["Quem é INET", "não troca."]} />
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {TESTIMONIALS.map((t, i) => (
                <Rise key={t.handle} delay={(i % 3) * 0.06} className="h-full">
                  <figure className="card flex h-full flex-col p-7">
                    <Quote size={26} aria-hidden="true" className="card-icon text-lime" />
                    <blockquote className="mt-4 flex-1 font-display text-xl font-light leading-snug">“{t.text}”</blockquote>
                    <figcaption className="mt-6 text-sm"><span className="font-semibold">{t.name}</span> <span className="text-white/50">{t.handle}</span></figcaption>
                  </figure>
                </Rise>
              ))}
            </div>
          </div>
        </section>

        {/* lojas no mapa */}
        <section className="relative py-24 sm:py-32">
          <span data-node="left" className="absolute top-12" />
          <span data-node="left" className="absolute bottom-12" />
          <div className="wrap">
            <Rise><p className="tag">06 — Lojas</p></Rise>
            <Lines className="h-lg mt-4 max-w-3xl" lines={["Três lojas em", <span className="italic text-lime">Teófilo Otoni.</span>]} />
            <Rise delay={0.2}><p className="lead mt-5 max-w-2xl">Seja qual for a loja, ficaremos felizes em receber você.</p></Rise>
            <div className="mt-10"><CityMap className="h-[52vh] min-h-[340px]" /></div>
          </div>
        </section>

        {/* dúvidas — do site anterior */}
        <section className="relative py-24 sm:py-32">
          <span data-node="right" className="absolute top-12" />
          <span data-node="center" className="absolute bottom-0 left-1/2" />
          <div className="wrap">
            <Rise><p className="tag">07 — Dúvidas</p></Rise>
            <Lines className="h-lg mt-4 max-w-3xl" lines={["Dúvidas sobre", "os serviços INET."]} />
            <div className="mt-10">
              <Faq
                items={[
                  { q: "Qual telefone da INET para contratar ou pedir suporte?", a: <>Todos os serviços estão disponíveis pelo telefone e WhatsApp <a className="text-lime underline" href={`tel:${PHONES[0].tel}`}>{PHONES[0].display}</a> e pelo telefone <a className="text-lime underline" href={`tel:${PHONES[1].tel}`}>{PHONES[1].display}</a>. Ligação gratuita: <a className="text-lime underline" href={`tel:${PHONES[2].tel}`}>{PHONES[2].display}</a>.</> },
                  { q: "Como saber se tem INET na minha rua?", a: <>A INET trabalha para que nenhuma rua ou bairro fique sem cobertura. Para confirmar o seu endereço, fale com a gente pelo <Link className="text-lime underline" to="/fale-conosco">Fale conosco</Link>.</> },
                  { q: "Quais os benefícios de contratar a INET?", a: "Internet com ultravelocidade, estabilidade, apps exclusivos, suporte 24 horas por dia, equipamentos e infraestrutura de ponta e atendimento humanizado." },
                  { q: "A INET possui loja física?", a: <>Sim, três lojas em Teófilo Otoni: {STORES.map((s) => s.address).join("; ")}.</> },
                ]}
              />
            </div>
          </div>
        </section>
      </div>
    </motion.div>
  );
}
