import { useRef, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Briefcase, CheckCircle2, CreditCard, Headset, Mail, MapPin, MessageCircle, Package, ShoppingBag, WifiOff } from "lucide-react";
import { Rise } from "../components/Lines";
import { PageHero, Section, usePageMeta } from "../components/ui";
import { EASE } from "../motion";
import { COMPANY, EMAILS, PHONES, STORES, waLink } from "../data/inet";

type Need = { id: string; icon: typeof Headset; title: string; text: string; action: { label: string; href?: string; to?: string } };

const NEEDS: Need[] = [
  { id: "contratar", icon: ShoppingBag, title: "Quero contratar", text: "Planos, disponibilidade e contratação.", action: { label: "Falar com vendas", href: waLink("Olá! Quero contratar um plano da INET.") } },
  { id: "sem-internet", icon: WifiOff, title: "Estou sem internet", text: "Problemas de conexão e lentidão.", action: { label: "Ir para o suporte", to: "/suporte" } },
  { id: "fatura", icon: CreditCard, title: "Faturas e pagamentos", text: "Segunda via, débitos e dados do contrato.", action: { label: "Central do Cliente", href: COMPANY.clientArea } },
  { id: "produtos", icon: Package, title: "Dúvidas sobre produtos", text: "Internet, TV, telefone fixo e chip.", action: { label: "Perguntar no WhatsApp", href: waLink("Olá! Tenho uma dúvida sobre os produtos da INET.") } },
  { id: "suporte", icon: Headset, title: "Suporte técnico", text: "Atendimento 24 horas pelo WhatsApp.", action: { label: "Abrir atendimento", href: waLink("Olá") } },
  { id: "trabalhe", icon: Briefcase, title: "Trabalhe conosco", text: "Envie seu currículo em PDF.", action: { label: "rh@inetminas.com.br", href: "mailto:rh@inetminas.com.br?subject=Curr%C3%ADculo" } },
];

const SUBJECTS = ["Contratação de serviços", "Informações sobre produtos", "Suporte técnico", "Problemas de conexão", "Faturas e pagamentos", "Outro assunto"];

type Errors = Partial<Record<"name" | "phone" | "subject" | "message", string>>;

/**
 * Formulário sem servidor: não há backend de envio no projeto, então a mensagem
 * validada é entregue por um canal oficial real (WhatsApp ou e-mail do setor).
 */
function ContactForm() {
  const started = useRef(Date.now());
  const [values, setValues] = useState({ name: "", phone: "", subject: "", message: "", channel: "whatsapp", company: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "blocked">("idle");
  const [fallback, setFallback] = useState("");

  const set = (k: keyof typeof values) => (e: { target: { value: string } }) => setValues((v) => ({ ...v, [k]: e.target.value }));

  const validate = (): Errors => {
    const e: Errors = {};
    if (values.name.trim().length < 3) e.name = "Informe seu nome completo.";
    const digits = values.phone.replace(/\D/g, "");
    if (digits.length < 10 || digits.length > 11) e.phone = "Informe um telefone com DDD, por exemplo (33) 99999-9999.";
    if (!values.subject) e.subject = "Escolha o assunto.";
    if (values.message.trim().length < 10) e.message = "Escreva sua mensagem com pelo menos 10 caracteres.";
    if (values.message.length > 1000) e.message = "A mensagem pode ter no máximo 1000 caracteres.";
    return e;
  };

  const submit = (ev: FormEvent) => {
    ev.preventDefault();
    // proteção contra robôs: campo oculto preenchido ou envio rápido demais
    if (values.company || Date.now() - started.current < 2500) return;
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) {
      document.getElementById(`f-${Object.keys(e)[0]}`)?.focus();
      return;
    }
    setStatus("sending");
    const text = `Olá! Venho do site inetminas.com.br.\nNome: ${values.name.trim()}\nTelefone: ${values.phone.trim()}\nAssunto: ${values.subject}\n\n${values.message.trim()}`;
    const to = values.subject.startsWith("Faturas") ? "financeiro@inetminas.com.br" : values.subject.startsWith("Suporte") || values.subject.startsWith("Problemas") ? "suporte@inetminas.com.br" : "agendamento@inetminas.com.br";
    const url = values.channel === "whatsapp" ? waLink(text) : `mailto:${to}?subject=${encodeURIComponent(`[Site] ${values.subject}`)}&body=${encodeURIComponent(text)}`;
    window.setTimeout(() => {
      const w = values.channel === "whatsapp" ? window.open(url, "_blank", "noreferrer") : ((window.location.href = url), window);
      setFallback(url);
      setStatus(w ? "sent" : "blocked");
    }, 400);
  };

  const field = "mt-2 block w-full rounded-2xl border bg-white/[0.04] px-4 py-3.5 text-white placeholder:text-white/35 transition-colors duration-500 focus:border-lime focus:outline-none";
  const err = (k: keyof Errors) => errors[k] && <p id={`e-${k}`} className="mt-1.5 text-sm text-[#ffb4a8]">{errors[k]}</p>;

  return (
    <div className="card p-6 sm:p-8">
      <AnimatePresence mode="wait">
        {status === "sent" || status === "blocked" ? (
          <motion.div key="ok" role="status" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE }} className="py-8 text-center">
            <CheckCircle2 size={44} aria-hidden="true" className="mx-auto text-lime" />
            <h3 className="mt-4 font-display text-2xl">{status === "sent" ? "Mensagem pronta para envio!" : "Quase lá"}</h3>
            <p className="mx-auto mt-3 max-w-sm text-white/70">
              {status === "sent"
                ? `Abrimos o ${values.channel === "whatsapp" ? "WhatsApp" : "seu e-mail"} com a mensagem preenchida. É só confirmar o envio.`
                : "O navegador bloqueou a nova janela. Use o botão abaixo para enviar."}
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <a href={fallback} target="_blank" rel="noreferrer" className="btn-lime">Abrir novamente</a>
              <button onClick={() => (setStatus("idle"), (started.current = Date.now()))} className="btn-ghost">Nova mensagem</button>
            </div>
          </motion.div>
        ) : (
          <motion.form key="form" noValidate onSubmit={submit} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid gap-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block text-sm">
                Nome completo
                <input id="f-name" autoComplete="name" value={values.name} onChange={set("name")} aria-invalid={!!errors.name} aria-describedby={errors.name ? "e-name" : undefined} className={`${field} ${errors.name ? "border-[#ffb4a8]" : "border-white/15"}`} />
                {err("name")}
              </label>
              <label className="block text-sm">
                Telefone com DDD
                <input id="f-phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="(33) 99999-9999" value={values.phone} onChange={set("phone")} aria-invalid={!!errors.phone} aria-describedby={errors.phone ? "e-phone" : undefined} className={`${field} ${errors.phone ? "border-[#ffb4a8]" : "border-white/15"}`} />
                {err("phone")}
              </label>
            </div>
            <label className="block text-sm">
              Assunto
              <select id="f-subject" value={values.subject} onChange={set("subject")} aria-invalid={!!errors.subject} aria-describedby={errors.subject ? "e-subject" : undefined} className={`${field} ${errors.subject ? "border-[#ffb4a8]" : "border-white/15"} [&>option]:bg-navy-ink`}>
                <option value="">Selecione…</option>
                {SUBJECTS.map((s) => <option key={s}>{s}</option>)}
              </select>
              {err("subject")}
            </label>
            <label className="block text-sm">
              Mensagem
              <textarea id="f-message" rows={5} maxLength={1000} value={values.message} onChange={set("message")} aria-invalid={!!errors.message} aria-describedby={errors.message ? "e-message" : undefined} className={`${field} resize-y ${errors.message ? "border-[#ffb4a8]" : "border-white/15"}`} />
              {err("message")}
            </label>
            {/* campo isca para robôs, invisível para pessoas */}
            <input tabIndex={-1} autoComplete="off" aria-hidden="true" value={values.company} onChange={set("company")} className="absolute -left-[9999px] h-0 w-0 opacity-0" />
            <fieldset>
              <legend className="text-sm">Enviar por</legend>
              <div className="mt-2 flex flex-wrap gap-2">
                {[["whatsapp", "WhatsApp"], ["email", "E-mail"]].map(([v, l]) => (
                  <label key={v} className={`flex min-h-[44px] cursor-pointer items-center gap-2 rounded-full border px-5 text-sm transition-colors duration-500 ${values.channel === v ? "border-lime bg-lime/10 text-white" : "border-white/15 text-white/70"}`}>
                    <input type="radio" name="channel" value={v} checked={values.channel === v} onChange={set("channel")} className="accent-[#70E000]" /> {l}
                  </label>
                ))}
              </div>
            </fieldset>
            <button type="submit" disabled={status === "sending"} className="btn-lime w-full sm:w-fit">
              {status === "sending" ? "Preparando…" : "Enviar mensagem"}
            </button>
            <p className="text-xs text-white/45">Seus dados são usados apenas para responder ao seu contato.</p>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FaleConosco() {
  usePageMeta("Fale conosco", "Fale com a INET: WhatsApp e telefone (33) 3536-3939, (33) 3508-0811, 0800 500 3939, e-mails por setor e lojas em Teófilo Otoni e Carlos Chagas.");

  return (
    <>
      <PageHero
        tag="Fale conosco"
        title={["Como podemos", <span className="italic text-lime">ajudar você?</span>]}
        lead="Escolha o que você precisa e vá direto ao canal certo. Se preferir, mande uma mensagem pelo formulário."
      />

      <Section tag="Atendimento" title={["Escolha pelo", "que você precisa."]}>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {NEEDS.map((n, i) => {
            const inner = (
              <>
                <span className="card-icon flex h-12 w-12 items-center justify-center rounded-2xl bg-electric/20 text-lime"><n.icon size={22} aria-hidden="true" /></span>
                <h3 className="mt-6 font-display text-xl">{n.title}</h3>
                <p className="mt-2 text-sm text-white/65">{n.text}</p>
                <span className="card-link mt-auto pt-5">{n.action.label} →</span>
              </>
            );
            return (
              <Rise key={n.id} delay={(i % 3) * 0.06} className="h-full">
                {n.action.to ? (
                  <Link to={n.action.to} className="card flex h-full flex-col p-7">{inner}</Link>
                ) : (
                  <a href={n.action.href} target={n.action.href?.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="card flex h-full flex-col p-7">{inner}</a>
                )}
              </Rise>
            );
          })}
        </div>
      </Section>

      <Section id="formulario" tag="Formulário" title={["Mande sua", "mensagem."]}>
        <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
          <Rise><ContactForm /></Rise>
          <Rise delay={0.1} className="space-y-4">
            <div className="card p-7">
              <h3 className="font-display text-xl">Telefones</h3>
              <ul className="mt-4 space-y-2.5 text-sm">
                {PHONES.map((p) => <li key={p.tel}><a href={`tel:${p.tel}`} className="text-white/85 transition-colors duration-500 hover:text-lime">{p.display}</a> <span className="text-white/45">· {p.label}</span></li>)}
              </ul>
              <a href={waLink()} target="_blank" rel="noreferrer" className="btn-lime mt-5 w-full"><MessageCircle size={16} /> WhatsApp</a>
            </div>
            <div className="card p-7">
              <h3 className="font-display text-xl">Lojas</h3>
              <ul className="mt-4 space-y-3 text-sm">
                {STORES.map((s) => <li key={s.name}><a href={s.maps} target="_blank" rel="noreferrer" className="flex gap-2 text-white/80 transition-colors duration-500 hover:text-lime"><MapPin size={15} aria-hidden="true" className="mt-0.5 shrink-0 text-lime" />{s.address}</a></li>)}
              </ul>
            </div>
          </Rise>
        </div>
      </Section>

      <Section tag="E-mails" title={["Fale com", "o setor certo."]}>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {EMAILS.map((e, i) => (
            <Rise as="li" key={e.email} delay={(i % 4) * 0.05}>
              <a href={`mailto:${e.email}`} className="card flex items-center gap-3 p-5">
                <Mail size={18} aria-hidden="true" className="card-icon shrink-0 text-lime" />
                <span className="min-w-0"><span className="block text-sm font-semibold">{e.area}</span><span className="block truncate text-xs text-white/55">{e.email}</span></span>
              </a>
            </Rise>
          ))}
        </ul>
      </Section>
    </>
  );
}
