import { ArrowLeftRight, Coins, ExternalLink, MessageCircle, Navigation, PhoneCall, Signal } from "lucide-react";
import { useRef, type PointerEvent } from "react";
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import PlanCarousel from "../components/PlanCarousel";
import Lines, { Rise, Fit } from "../components/Lines";
import { CtaBand, Faq, FeatureCard, Note, Section, usePageMeta } from "../components/ui";
import { SPRING } from "../motion";
import { waLink } from "../data/inet";

const HIGHLIGHTS = [
  { icon: Signal, label: "Rede 5G" },
  { icon: MessageCircle, label: "WhatsApp ilimitado" },
  { icon: Navigation, label: "Waze ilimitado" },
  { icon: ArrowLeftRight, label: "Portabilidade +2 GB" },
];

/** Celular com o site da INET aberto: flutua com a rolagem e inclina seguindo o mouse. */
function SitePhone() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [8, -8]), SPRING);
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-16, 16]), SPRING);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useSpring(useTransform(scrollYProgress, [0, 1], [70, -90]), SPRING);
  const rz = useSpring(useTransform(scrollYProgress, [0, 1], [4, -4]), SPRING);
  const glare = useTransform(mx, [-0.5, 0.5], ["0%", "100%"]);

  const move = (e: PointerEvent<HTMLDivElement>) => {
    if (reduce || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };

  return (
    <div ref={ref} onPointerMove={move} onPointerLeave={() => { mx.set(0); my.set(0); }} className="relative mx-auto w-full max-w-[360px] [perspective:1300px] lg:max-w-[400px]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-1/4 mx-auto h-2/3 w-3/4 rounded-full bg-lime/20 blur-[100px]" />
      <div aria-hidden="true" className="pointer-events-none absolute -right-10 top-10 h-72 w-72 rounded-full bg-[#021A4A] blur-[90px]" />
      <motion.div
        style={reduce ? undefined : { rotateX: rx, rotateY: ry, rotateZ: rz, y }}
        className="relative rounded-[3.2rem] bg-gradient-to-b from-[#1b2a4d] to-[#060d22] p-[12px] shadow-[0_60px_120px_-30px_rgba(0,0,0,0.95),inset_0_0_0_1.5px_rgba(255,255,255,0.14)] [transform-style:preserve-3d]"
      >
        <span aria-hidden="true" className="absolute -left-[3px] top-28 h-10 w-[3px] rounded-l bg-[#24345a]" />
        <span aria-hidden="true" className="absolute -left-[3px] top-44 h-16 w-[3px] rounded-l bg-[#24345a]" />
        <span aria-hidden="true" className="absolute -right-[3px] top-36 h-20 w-[3px] rounded-r bg-[#24345a]" />
        <div className="relative overflow-hidden rounded-[2.6rem] bg-[#010818]">
          {/* captura 390x844 (2x) da página inicial do site */}
          {/* barra de status com a ilha e o 5G, acima da página */}
          <div aria-hidden="true" className="relative flex h-10 items-center justify-between px-7 text-[11px] font-semibold text-white">
            <span>9:41</span>
            <span className="absolute left-1/2 top-2.5 h-6 w-24 -translate-x-1/2 rounded-full bg-black" />
            <span className="flex items-center gap-1.5">
              <Signal size={12} />
              <span className="rounded bg-lime px-1 text-[9px] font-bold leading-4 text-navy-ink">5G</span>
            </span>
          </div>
          <img src="/movel/site-mobile.webp" alt="Site da INET aberto no celular: “A internet fibra mais escolhida da cidade.”" width={780} height={1688} className="block h-auto w-full" />
          <motion.span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,transparent_35%,rgba(255,255,255,0.14)_50%,transparent_65%)] bg-[length:250%_100%]"
            style={{ backgroundPositionX: glare }}
          />
        </div>
      </motion.div>
    </div>
  );
}

export default function Movel() {
  usePageMeta("Chip móvel 5G", "Chip móvel INET com acesso à rede 5G, ligações ilimitadas para todo o Brasil, WhatsApp e Waze ilimitados. Faça a portabilidade e ganhe 2 Giga a mais.");

  return (
    <>
      <section className="relative overflow-hidden pb-16 pt-36 sm:pt-44">
        <div aria-hidden="true" className="pointer-events-none absolute -right-40 -top-40 h-[560px] w-[560px] rounded-full bg-[#021A4A]/70 blur-[130px]" />
        <div aria-hidden="true" className="pointer-events-none absolute -left-32 top-40 h-[360px] w-[360px] rounded-full bg-lime/10 blur-[110px]" />
        <div className="wrap relative grid items-center gap-14 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <Rise><Fit className="tag">Chip móvel</Fit></Rise>
            <Lines as="h1" className="h-xl mt-5" lines={["Seu celular", <span className="italic text-lime">no 5G da INET.</span>]} />
            <Rise delay={0.3}>
              <p className="lead mt-6 max-w-xl">Planos de internet com telefonia móvel: acesso à rede 5G, ligações ilimitadas para qualquer operadora do Brasil e WhatsApp ilimitado.</p>
            </Rise>
            <Rise delay={0.4}>
              <ul className="mt-8 grid max-w-lg grid-cols-2 gap-3">
                {HIGHLIGHTS.map((h) => (
                  <li key={h.label} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#010C22]/80 px-4 py-3 text-sm backdrop-blur">
                    <h.icon size={18} aria-hidden="true" className="shrink-0 text-lime" /> {h.label}
                  </li>
                ))}
              </ul>
            </Rise>
            <Rise delay={0.5} className="mt-9 flex flex-wrap gap-3">
              <a href="#planos" className="btn-lime">Planos com chip</a>
              <a href={waLink("Olá! Quero saber sobre o chip móvel da INET.")} target="_blank" rel="noreferrer" className="btn-ghost">Tirar dúvidas</a>
            </Rise>
          </div>
          <Rise delay={0.2}>
            <SitePhone />
          </Rise>
        </div>
      </section>

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
