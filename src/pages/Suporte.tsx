import { Link } from "react-router-dom";
import { Download, ExternalLink, Gauge, MessageCircle, MonitorSmartphone, Power, UserRound, Wifi } from "lucide-react";
import { Rise } from "../components/Lines";
import { CtaBand, PageHero, Section, usePageMeta } from "../components/ui";
import { ANYDESK_URL, COMPANY, EMAILS, PHONES, waLink } from "../data/inet";

const STEPS = [
  <>Envie um <strong className="text-white">“Olá”</strong> para o WhatsApp <strong className="text-white">(33) 3536-3939</strong>.</>,
  <>Toque em <strong className="text-white">“SIM”</strong> para confirmar que você já é cliente.</>,
  <>Digite o seu <strong className="text-white">CPF ou CNPJ</strong>.</>,
  <>Digite <strong className="text-white">“2”</strong> para escolher <strong className="text-white">suporte técnico</strong>.</>,
  <>Digite de <strong className="text-white">1 a 6</strong> para a opção desejada e aguarde o atendimento.</>,
];

export default function Suporte() {
  usePageMeta("Suporte técnico 24h", "Suporte técnico da INET 24 horas pelo WhatsApp (33) 3536-3939. Passo a passo do atendimento, acesso remoto por AnyDesk, teste de velocidade e Central do Cliente.");

  return (
    <>
      <PageHero
        tag="Suporte técnico"
        title={["Estamos online", <span className="italic text-lime">24 horas.</span>]}
        lead="O suporte técnico pelo WhatsApp funciona 24 horas por dia. Veja o passo a passo para ser atendido mais rápido."
      >
        <a href={waLink("Olá")} target="_blank" rel="noreferrer" className="btn-lime"><MessageCircle size={16} /> Abrir atendimento</a>
        <a href={`tel:${PHONES[2].tel}`} className="btn-ghost">Ligar {PHONES[2].display}</a>
      </PageHero>

      <Section tag="Suporte pelo WhatsApp" title={["Passo a passo", "do atendimento."]}>
        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {STEPS.map((s, i) => (
            <Rise as="li" key={i} delay={i * 0.06} className="card h-full p-6">
              <span className="font-display text-4xl font-light text-lime">{i + 1}</span>
              <p className="mt-4 text-sm leading-relaxed text-white/75">{s}</p>
            </Rise>
          ))}
        </ol>
      </Section>

      <Section tag="Antes de chamar" title={["Dicas rápidas", "para sua conexão."]}>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { icon: Power, title: "Reinicie o roteador", text: "Desligue o roteador da tomada, aguarde alguns segundos e ligue de novo. Confira se os cabos estão bem encaixados." },
            { icon: Wifi, title: "Sinal fraco em algum cômodo?", text: "Paredes e obstáculos enfraquecem o Wi-Fi. Entenda como a rede mesh resolve isso.", to: "/internet#wifi-mesh", cta: "Entender o Wi-Fi Mesh" },
            { icon: Gauge, title: "Internet lenta?", text: "Meça por cabo, no servidor Inet Telecom, antes de abrir o chamado.", to: "/teste-de-velocidade", cta: "Testar a velocidade" },
          ].map((c, i) => (
            <Rise key={c.title} delay={i * 0.06} className="h-full">
              <div className="card flex h-full flex-col p-7">
                <c.icon size={22} aria-hidden="true" className="card-icon text-lime" />
                <h3 className="mt-5 font-display text-xl">{c.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/65">{c.text}</p>
                {c.to && <Link to={c.to} className="card-link mt-auto pt-5">{c.cta} →</Link>}
              </div>
            </Rise>
          ))}
        </div>
      </Section>

      <Section tag="Acesso remoto" title={["Precisa de ajuda", "no computador?"]}>
        <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
          <Rise>
            <div className="card p-8">
              <MonitorSmartphone size={26} aria-hidden="true" className="card-icon text-lime" />
              <p className="lead mt-5">Solicite um acesso remoto: com sua autorização, o técnico vê a tela e ajuda a resolver.</p>
              <a href={ANYDESK_URL} className="btn-lime mt-6"><Download size={16} /> Baixar o AnyDesk</a>
            </div>
          </Rise>
          <Rise delay={0.1}>
            <ol className="space-y-4">
              {[
                "Baixe o AnyDesk e instale ou execute no computador.",
                "Abra o AnyDesk e envie ao técnico o “ID de acesso remoto”, a sequência de nove dígitos na janela principal.",
                "Quando aparecer o pedido de conexão remota, clique em “Aceitar”.",
              ].map((s, i) => (
                <li key={s} className="flex gap-4 border-b border-white/10 pb-4">
                  <span className="font-display text-lime">0{i + 1}</span>
                  <span className="text-white/80">{s}</span>
                </li>
              ))}
            </ol>
          </Rise>
        </div>
      </Section>

      <Section tag="Mais canais" title={["Outras formas", "de atendimento."]}>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Rise className="h-full">
            <a href={COMPANY.clientArea} target="_blank" rel="noreferrer" className="card flex h-full flex-col p-7">
              <UserRound size={22} aria-hidden="true" className="card-icon text-lime" />
              <h3 className="mt-5 font-display text-xl">Central do Cliente</h3>
              <p className="mt-2 text-sm text-white/65">Faturas e dados do seu contrato.</p>
              <span className="card-link mt-auto pt-5">Acessar <ExternalLink size={13} aria-hidden="true" /></span>
            </a>
          </Rise>
          <Rise delay={0.06} className="h-full">
            <div className="card h-full p-7">
              <h3 className="font-display text-xl">Telefones</h3>
              <ul className="mt-4 space-y-2 text-sm">
                {PHONES.map((p) => <li key={p.tel}><a href={`tel:${p.tel}`} className="text-white/80 transition-colors duration-500 hover:text-lime">{p.display} <span className="text-white/45">· {p.label}</span></a></li>)}
              </ul>
            </div>
          </Rise>
          <Rise delay={0.12} className="h-full">
            <div className="card h-full p-7">
              <h3 className="font-display text-xl">E-mail do suporte</h3>
              <a href={`mailto:${EMAILS[0].email}`} className="mt-4 block break-all text-sm text-lime underline">{EMAILS[0].email}</a>
              <Link to="/fale-conosco" className="card-link mt-5">Outros setores →</Link>
            </div>
          </Rise>
        </div>
      </Section>

      <CtaBand title={["Ainda com", <span className="italic text-lime">problemas?</span>]} text="Nossa equipe técnica responde 24 horas pelo WhatsApp.">
        <a href={waLink("Olá")} target="_blank" rel="noreferrer" className="btn-lime">Abrir atendimento</a>
        <Link to="/fale-conosco" className="btn-ghost">Fale conosco</Link>
      </CtaBand>
    </>
  );
}
