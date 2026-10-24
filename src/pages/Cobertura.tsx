import CityMap from "../components/CityMap";
import CepCheck from "../components/CepCheck";
import { CtaBand, Faq, Note, PageHero, Section, usePageMeta } from "../components/ui";
import { PHONES, waLink } from "../data/inet";

export default function Cobertura() {
  usePageMeta("Cobertura e lojas", "Consulte pelo CEP se a fibra da INET atende o seu endereço. Lojas em Teófilo Otoni (Centro, Grão Pará e Concórdia) e Carlos Chagas.");

  return (
    <>
      <PageHero
        tag="Cobertura · Teófilo Otoni e Carlos Chagas – MG"
        title={["Tem INET", <span className="italic text-lime">na sua casa?</span>]}
        lead="Digite seu CEP e veja se a fibra da INET chega até você. Depois, encontre a loja mais perto no mapa."
      >
        <a href="#cep" className="btn-lime">Consultar meu CEP</a>
        <a href={`tel:${PHONES[0].tel}`} className="btn-ghost">Ligar {PHONES[0].display}</a>
      </PageHero>

      <Section id="cep" tag="Consulta de cobertura" title={["Verifique pelo", <span className="italic text-lime">seu CEP.</span>]}>
        <CepCheck />
      </Section>

      <Section id="lojas" tag="Lojas" title={["Quatro lojas", "perto de você."]}>
        <CityMap />
        <Note>
          O mapa mostra a cidade e as lojas da INET; ele não representa a área técnica de cobertura. As posições dos marcadores são aproximadas: use “Como chegar” para a localização exata. Mapa © colaboradores do OpenStreetMap.
        </Note>
      </Section>

      <Section tag="Dúvidas" title={["Cobertura", "e atendimento."]}>
        <Faq
          items={[
            { q: "Como saber se tem INET na minha rua?", a: "Use a consulta por CEP acima: ela mostra se a INET atende a sua cidade e já abre o WhatsApp com o seu endereço para a equipe confirmar a rua e o número." },
            { q: "A cobertura do telefone fixo é a mesma da internet?", a: "Sim, a telefonia fixa usa a mesma rede de fibra óptica da INET." },
            { q: "Posso contratar presencialmente?", a: "Sim. A INET tem três lojas em Teófilo Otoni (Centro, Grão Pará e Concórdia) e uma em Carlos Chagas." },
          ]}
        />
      </Section>

      <CtaBand title={["Leve a fibra", <span className="italic text-lime">para sua casa.</span>]} text="Envie seu endereço e a equipe confirma a disponibilidade.">
        <a href={waLink("Olá! Quero saber se a INET atende o meu endereço: ")} target="_blank" rel="noreferrer" className="btn-lime">Falar no WhatsApp</a>
      </CtaBand>
    </>
  );
}
