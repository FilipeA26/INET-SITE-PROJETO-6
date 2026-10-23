import Lines, { Rise } from "./Lines";

const items = [
  ["Fibra até a sua casa", "Sem trechos de cobre: a luz chega direto ao seu roteador."],
  ["Estável o dia todo", "Não oscila com chuva nem com o horário de pico."],
  ["Suporte de perto", "Equipe técnica local e atendimento pelo WhatsApp."],
];

export default function Why() {
  return (
    <section id="vantagens" className="relative py-32">
      <span data-node="right" className="absolute top-12" />
      <span data-node="right" className="absolute bottom-12" />
      <div className="wrap">
        <Rise><p className="tag">02 — Por que INET</p></Rise>
        <Lines className="h-lg mt-5" lines={["Simples assim."]} />
        <div className="mt-14 grid gap-12 md:grid-cols-3">
          {items.map(([title, text], i) => (
            <Rise key={title} delay={i * 0.12} className="border-t border-white/20 pt-6">
              <p className="font-display text-sm text-lime">0{i + 1}</p>
              <h3 className="mt-3 font-display text-2xl">{title}</h3>
              <p className="mt-2 text-white/65">{text}</p>
            </Rise>
          ))}
        </div>
      </div>
    </section>
  );
}
