import CityMap from "../components/CityMap";
import { CtaBand, Faq, Note, PageHero, Section, usePageMeta } from "../components/ui";
import { PHONES, waLink } from "../data/inet";

export default function Cobertura() {
  usePageMeta("Cobertura e lojas", "Mapa de Teófilo Otoni com as três lojas da INET: Centro, Grão Pará e Concórdia. Consulte se a fibra da INET atende o seu endereço.");

  return (
    <>
      <PageHero
        tag="Cobertura · Teófilo Otoni – MG"
        title={["A INET em", <span className="italic text-lime">Teófilo Otoni.</span>]}
        lead="Explore o mapa da cidade e encontre a loja mais perto de você. Para saber se a fibra atende o seu endereço, consulte o atendimento."
      >
        <a href={waLink("Olá! Quero saber se a INET atende o meu endereço: ")} target="_blank" rel="noreferrer" className="btn-lime">Consultar meu endereço</a>
        <a href={`tel:${PHONES[0].tel}`} className="btn-ghost">Ligar {PHONES[0].display}</a>
      </PageHero>

      <Section tag="Mapa interativo" title={["Lojas e", "localização."]}>
        <CityMap />
        <Note>
          O mapa mostra a cidade e as lojas da INET; ele não representa a área técnica de cobertura. As posições dos marcadores são aproximadas: use “Como chegar” para a localização exata. Mapa © colaboradores do OpenStreetMap.
        </Note>
      </Section>

      <Section tag="Dúvidas" title={["Cobertura", "e atendimento."]}>
        <Faq
          items={[
            { q: "Como saber se tem INET na minha rua?", a: "A INET trabalha para que nenhuma rua ou bairro fique sem cobertura e informa ter a maior rede de fibra óptica da cidade. Para confirmar o seu endereço, envie a sua rua e número pelo WhatsApp ou ligue para a central." },
            { q: "A cobertura do telefone fixo é a mesma da internet?", a: "Sim, a telefonia fixa usa a mesma rede de fibra óptica da INET." },
            { q: "Posso contratar presencialmente?", a: "Sim. A INET tem três lojas em Teófilo Otoni: Centro, Grão Pará e Concórdia." },
          ]}
        />
      </Section>

      <CtaBand title={["Leve a fibra", <span className="italic text-lime">para sua casa.</span>]} text="Envie seu endereço e a equipe confirma a disponibilidade.">
        <a href={waLink("Olá! Quero saber se a INET atende o meu endereço: ")} target="_blank" rel="noreferrer" className="btn-lime">Falar no WhatsApp</a>
      </CtaBand>
    </>
  );
}
