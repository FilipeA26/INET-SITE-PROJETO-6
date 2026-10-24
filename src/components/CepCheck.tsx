import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Loader2, MapPin, SearchX } from "lucide-react";
import { EASE } from "../motion";
import { COVERAGE_CITIES, waLink } from "../data/inet";

type Addr = { cep: string; logradouro: string; bairro: string; localidade: string; uf: string };
type State =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "error"; msg: string }
  | { kind: "result"; addr: Addr; covered: boolean };

const norm = (t: string) => t.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
const mask = (v: string) => v.replace(/\D/g, "").slice(0, 8).replace(/^(\d{5})(\d)/, "$1-$2");

/**
 * Consulta de CEP: busca o endereço no ViaCEP e diz se a cidade é atendida pela
 * fibra da INET. A confirmação da rua e do número fica com o atendimento, pelo
 * WhatsApp, com a mensagem já preenchida.
 */
export default function CepCheck() {
  const [cep, setCep] = useState("");
  const [number, setNumber] = useState("");
  const [state, setState] = useState<State>({ kind: "idle" });

  async function submit(e: FormEvent) {
    e.preventDefault();
    const digits = cep.replace(/\D/g, "");
    if (digits.length !== 8) return setState({ kind: "error", msg: "Digite os 8 números do CEP." });
    setState({ kind: "loading" });
    try {
      const res = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
      const data = await res.json();
      if (!res.ok || data.erro) return setState({ kind: "error", msg: "CEP não encontrado. Confira os números." });
      const covered = data.uf === "MG" && COVERAGE_CITIES.some((c) => norm(c) === norm(data.localidade));
      setState({ kind: "result", addr: data, covered });
    } catch {
      setState({ kind: "error", msg: "Não foi possível consultar agora. Tente de novo ou fale com a gente pelo WhatsApp." });
    }
  }

  const addrText = (a: Addr) => [a.logradouro, number && `nº ${number}`, a.bairro, `${a.localidade}/${a.uf}`, `CEP ${a.cep}`].filter(Boolean).join(", ");

  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,#021A4A,#010818_65%)] p-7 sm:p-10">
      <div aria-hidden="true" className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-lime/10 blur-3xl" />
      <form onSubmit={submit} className="relative grid gap-3 sm:grid-cols-[1fr_140px_auto]" noValidate>
        <label className="block">
          <span className="text-sm text-white/70">CEP da sua casa</span>
          <input
            inputMode="numeric"
            autoComplete="postal-code"
            placeholder="00000-000"
            value={cep}
            onChange={(e) => setCep(mask(e.target.value))}
            className="mt-2 h-14 w-full rounded-2xl border border-white/15 bg-white/[0.04] px-5 font-display text-xl tracking-wider outline-none transition-colors duration-500 placeholder:text-white/30 focus:border-lime"
          />
        </label>
        <label className="block">
          <span className="text-sm text-white/70">Número</span>
          <input
            inputMode="numeric"
            placeholder="Opcional"
            value={number}
            onChange={(e) => setNumber(e.target.value.slice(0, 8))}
            className="mt-2 h-14 w-full rounded-2xl border border-white/15 bg-white/[0.04] px-5 text-lg outline-none transition-colors duration-500 placeholder:text-white/30 focus:border-lime"
          />
        </label>
        <button type="submit" disabled={state.kind === "loading"} className="btn-lime h-14 self-end disabled:opacity-60">
          {state.kind === "loading" ? <Loader2 size={18} className="animate-spin" aria-hidden="true" /> : <MapPin size={18} aria-hidden="true" />}
          Verificar
        </button>
      </form>

      <div aria-live="polite" className="relative">
        <AnimatePresence mode="wait">
          {state.kind === "error" && (
            <motion.p key="err" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.5, ease: EASE }} className="mt-5 text-sm text-[#ffb02e]">
              {state.msg}
            </motion.p>
          )}
          {state.kind === "result" && (
            <motion.div key={state.addr.cep} initial={{ opacity: 0, y: 12, filter: "blur(6px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} exit={{ opacity: 0 }} transition={{ duration: 0.7, ease: EASE }} className="mt-7 flex flex-col gap-5 rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:flex-row sm:items-center">
              {state.covered ? <CheckCircle2 size={36} aria-hidden="true" className="shrink-0 text-lime" /> : <SearchX size={36} aria-hidden="true" className="shrink-0 text-white/50" />}
              <div className="flex-1">
                <p className="font-display text-2xl">
                  {state.covered ? <>A INET está em <span className="text-lime">{state.addr.localidade}</span>!</> : <>Ainda não chegamos a {state.addr.localidade}.</>}
                </p>
                <p className="mt-1 text-sm text-white/60">{addrText(state.addr)}</p>
                <p className="mt-2 text-sm text-white/70">
                  {state.covered
                    ? "Envie seu endereço e a equipe confirma a fibra na sua rua e agenda a instalação."
                    : "Deixe seu contato: avisamos quando a fibra da INET chegar à sua região."}
                </p>
              </div>
              <a
                href={waLink(state.covered
                  ? `Olá! Quero confirmar se a fibra da INET atende meu endereço: ${addrText(state.addr)}.`
                  : `Olá! Gostaria de ser avisado quando a INET chegar ao meu endereço: ${addrText(state.addr)}.`)}
                target="_blank"
                rel="noreferrer"
                className={state.covered ? "btn-lime" : "btn-ghost"}
              >
                {state.covered ? "Confirmar no WhatsApp" : "Quero ser avisado"}
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <p className="relative mt-5 text-xs text-white/45">Endereço consultado no ViaCEP. A confirmação da disponibilidade na rua é feita pela equipe da INET.</p>
    </div>
  );
}
