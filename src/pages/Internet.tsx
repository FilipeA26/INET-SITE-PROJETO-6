import { useState } from "react";
import { Link } from "react-router-dom";
import { Gauge } from "lucide-react";
import PlanCarousel from "../components/PlanCarousel";
import Wifi6 from "../components/Wifi6";
import MeshHouse from "../components/MeshHouse";
import { AlexaHome, HomeSecurity } from "../components/SmartHome";
import SlideToSubscribe from "../components/SlideToSubscribe";
import { CtaBand, Faq, PageHero, Section, usePageMeta } from "../components/ui";
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

      <Wifi6 />

      <MeshHouse id="wifi-mesh" />

      <div id="casa-inteligente">
        <HomeSecurity />
        <AlexaHome />
      </div>

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
