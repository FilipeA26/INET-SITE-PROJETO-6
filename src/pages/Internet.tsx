import { useState } from "react";
import { Link } from "react-router-dom";
import { BrickWall, Cctv, Gauge, Lightbulb, Router, Speaker, Wifi, Network, Signal } from "lucide-react";
import PlanCarousel from "../components/PlanCarousel";
import ProductShot from "../components/ProductShot";
import SlideToSubscribe from "../components/SlideToSubscribe";
import { Rise } from "../components/Lines";
import { CtaBand, Faq, FeatureCard, Note, PageHero, Section, usePageMeta } from "../components/ui";
import { waLink, type Plan } from "../data/inet";

export default function Internet() {
  usePageMeta("Internet fibra óptica e Wi-Fi", "Planos de internet fibra óptica da INET em Teófilo Otoni, de 50 Mega a 1 Giga, com Wi-Fi grátis. Entenda o Wi-Fi Mesh e leve sinal para a casa toda.");
  const [plan, setPlan] = useState<Plan | null>(null);

  return (
    <>
      <PageHero
        tag="Internet e Wi-Fi"
        title={["Internet fibra", <span className="italic text-lime">de até 1 Giga.</span>]}
        lead="Internet fibra óptica para jogar online, assistir filmes e acessar suas redes sociais com alta estabilidade, Wi-Fi grátis e aplicativos incluídos nos planos."
      >
        <a href="#planos" className="btn-lime">Ver planos</a>
        <a href={waLink("Olá! Quero saber se a internet da INET atende o meu endereço.")} target="_blank" rel="noreferrer" className="btn-ghost">Consultar disponibilidade</a>
      </PageHero>

      <Section id="planos" tag="Planos de internet" title={["Escolha pelo seu", "jeito de usar."]}>
        <PlanCarousel selected={plan} onSelect={setPlan} />
        <div className="mt-14"><SlideToSubscribe plan={plan} /></div>
      </Section>

      <Section id="wifi-mesh" tag="Wi-Fi em toda a casa" title={["Como levar Wi-Fi", "a cada cantinho da casa."]} lead="Entenda a importância de uma rede mesh e todos os seus benefícios.">
        <div className="grid gap-4 md:grid-cols-3">
          <FeatureCard icon={Network} title="O que é Wi-Fi Mesh?" text="Uma tecnologia formada por 2 ou mais roteadores que ampliam o alcance do Wi-Fi e distribuem a potência do sinal de forma uniforme pelos ambientes." />
          <FeatureCard icon={Signal} title="Como funciona" text="O roteador mesh conecta automaticamente seu aparelho ao ponto de acesso com melhor sinal, expandindo uma rede estável e integrada para a casa toda." delay={0.06} />
          <FeatureCard icon={Router} title="Instalação simples" text="Basta seguir as orientações do fabricante. A INET tem plano com 2 roteadores mesh incluídos." delay={0.12} />
        </div>

        <div className="mt-14 grid gap-10 lg:grid-cols-2">
          <Rise>
            <h3 className="h-md">Um roteador é suficiente para minha casa?</h3>
            <p className="mt-4 leading-relaxed text-white/70">
              Quase todo mundo já tentou se conectar ao Wi-Fi em algum cômodo e não conseguiu. Esse problema é muito comum e <strong className="text-white">não está ligado ao seu plano de internet</strong>, mas à capacidade do roteador de espalhar o sinal pela casa.
            </p>
            <p className="mt-4 leading-relaxed text-white/70">
              O roteador usa ondas de rádio, e <strong className="text-white">a cada barreira no caminho o sinal enfraquece</strong>. Qualquer parede além do cômodo do roteador já reduz o sinal; por isso ele chega fraco no cômodo seguinte e às vezes nem alcança as partes mais distantes.
            </p>
          </Rise>
          <Rise delay={0.1}>
            <h3 className="h-md">Como ter Wi-Fi de qualidade em casa?</h3>
            <p className="mt-4 leading-relaxed text-white/70">
              Entre as opções de roteadores, os modelos <strong className="text-white">mesh</strong> são os mais completos e eficazes. Uma rede mesh conta com vários roteadores trabalhando como uma rede única, distribuindo o sinal igualmente pela casa: dá para usar a internet com todo o seu potencial em qualquer cômodo.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="card p-5"><BrickWall size={20} aria-hidden="true" className="card-icon text-lime" /><p className="mt-3 text-sm text-white/70">Paredes, vidros e espelhos enfraquecem o sinal.</p></div>
              <div className="card p-5"><Wifi size={20} aria-hidden="true" className="card-icon text-lime" /><p className="mt-3 text-sm text-white/70">Com mesh, você se conecta sempre ao ponto mais próximo.</p></div>
            </div>
          </Rise>
        </div>
      </Section>

      <Section id="casa-inteligente" tag="Casa inteligente" title={["Sua casa conectada", <span className="italic text-lime">100% com você.</span>]}>
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <ProductShot src="/casa-inteligente.webp" alt="Câmeras Wi-Fi e assistente virtual Alexa" width={900} height={616} glow="#0062EC" className="mx-auto w-full max-w-[560px]" />
          <div>
            <Rise>
              <p className="lead">Conheça os produtos que deixam a sua casa conectada: planos com câmera Wi-Fi para acompanhar tudo pelo smartphone, assistente virtual Alexa e kit de sala inteligente.</p>
            </Rise>
            <div className="mt-8 grid gap-3">
              {[
                { icon: Cctv, title: "INET Casa Segura", text: "400 Mega + câmera Wi-Fi que transmite imagens para o seu smartphone." },
                { icon: Speaker, title: "INET Casa Inteligente", text: "700 Mega + assistente virtual Alexa para comandar a casa pela voz." },
                { icon: Lightbulb, title: "INET Sala Inteligente", text: "400 Mega + lâmpada, tomada e controle infravermelho inteligentes." },
              ].map((c, i) => (
                <Rise key={c.title} delay={i * 0.06}>
                  <div className="card flex items-start gap-4 p-5">
                    <span className="card-icon flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-electric/20 text-lime"><c.icon size={20} aria-hidden="true" /></span>
                    <span>
                      <span className="block font-display text-lg">{c.title}</span>
                      <span className="block text-sm text-white/65">{c.text}</span>
                    </span>
                  </div>
                </Rise>
              ))}
            </div>
            <Rise delay={0.2}>
              <a href="#planos" className="btn-lime mt-8">Ver planos casa inteligente</a>
            </Rise>
            <Note>Imagem ilustrativa. Os equipamentos incluídos podem variar conforme o plano e a disponibilidade em estoque; confirme o modelo com o atendimento.</Note>
          </div>
        </div>
      </Section>

      <Section tag="Dúvidas" title={["Perguntas", "frequentes."]}>
        <Faq
          items={[
            { q: "O Wi-Fi está incluído nos planos?", a: "Sim. Os planos publicados pela INET incluem roteador Wi-Fi grátis; alguns incluem Wi-Fi premium, roteador Wi-Fi 6 ou 2 roteadores mesh." },
            { q: "O sinal está fraco em alguns cômodos. O problema é o plano?", a: "Normalmente não. O sinal do roteador enfraquece a cada parede ou obstáculo. Uma rede mesh distribui o sinal pela casa toda." },
            { q: "Tem plano sem fidelidade?", a: "Sim, a linha INET Livre (500 Mega, 700 Mega e 1 Giga) permite cancelar quando quiser. Esses planos são pré-pagos, com mínimo de 30 dias e taxa de instalação de R$ 230,00 à vista ou em 3x no cartão." },
            { q: "Como saber a velocidade real da minha conexão?", a: <>Faça o teste com um computador ligado por cabo ao roteador, seguindo as orientações da página <Link className="text-lime underline" to="/teste-de-velocidade">Teste de velocidade</Link>.</> },
          ]}
        />
      </Section>

      <CtaBand title={["Pronto para", <span className="italic text-lime">ligar a luz?</span>]} text="Fale com a nossa equipe para confirmar a disponibilidade no seu endereço e escolher o plano ideal.">
        <a href={waLink("Olá! Quero contratar a internet fibra da INET.")} target="_blank" rel="noreferrer" className="btn-lime">Falar no WhatsApp</a>
        <Link to="/teste-de-velocidade" className="btn-ghost"><Gauge size={16} /> Testar minha velocidade</Link>
      </CtaBand>
    </>
  );
}
