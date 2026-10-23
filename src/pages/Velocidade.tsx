import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, Cable, ExternalLink, Gauge, Laptop, Play, RefreshCw, Repeat, Smartphone, Unplug, Wifi, XCircle } from "lucide-react";
import { Rise } from "../components/Lines";
import { CtaBand, PageHero, Section, usePageMeta } from "../components/ui";
import { EASE } from "../motion";
import { NPERF_URL, SPEEDTESTS, waLink } from "../data/inet";

type State = "idle" | "loading" | "ready" | "error";

/**
 * Medição real: incorpora os medidores que a INET já usava, configurados para o
 * servidor "Inet Telecom". O site não lê nem inventa os números: download,
 * upload, latência e jitter aparecem dentro do próprio medidor.
 */
function SpeedTester() {
  const [tool, setTool] = useState(SPEEDTESTS[0].id);
  const [state, setState] = useState<State>("idle");
  const [run, setRun] = useState(0);
  const timer = useRef<number>();
  const t = SPEEDTESTS.find((s) => s.id === tool)!;

  const start = () => {
    setState("loading");
    setRun((r) => r + 1);
    window.clearTimeout(timer.current);
    // se o medidor não responder em 20 s, oferecemos abrir em nova aba
    timer.current = window.setTimeout(() => setState((s) => (s === "loading" ? "error" : s)), 20000);
  };
  useEffect(() => () => window.clearTimeout(timer.current), []);

  return (
    <div className="card overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 p-4 sm:p-5">
        <div role="tablist" aria-label="Escolha o medidor" className="flex flex-wrap gap-2">
          {SPEEDTESTS.map((s) => (
            <button
              key={s.id}
              role="tab"
              aria-selected={tool === s.id}
              onClick={() => (setTool(s.id), setState("idle"))}
              className={`min-h-[44px] rounded-full border px-4 text-sm transition-colors duration-500 ${tool === s.id ? "border-lime bg-lime text-navy-ink" : "border-white/15 text-white/70 hover:text-white"}`}
            >
              {s.name}
            </button>
          ))}
        </div>
        <a href={t.url} target="_blank" rel="noreferrer" className="card-link text-xs">Abrir em nova aba <ExternalLink size={13} aria-hidden="true" /></a>
      </div>

      <div className="relative h-[640px] bg-white sm:h-[624px]">
        <AnimatePresence mode="wait">
          {state === "idle" && (
            <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5, ease: EASE }} className="absolute inset-0 flex flex-col items-center justify-center gap-6 bg-[radial-gradient(70%_60%_at_50%_40%,#03256C,#010818)] px-6 text-center">
              <div className="relative flex h-40 w-40 items-center justify-center">
                <svg viewBox="0 0 120 120" className="absolute inset-0 -rotate-[225deg]" aria-hidden="true">
                  <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" strokeDasharray="245 327" strokeLinecap="round" />
                  <circle cx="60" cy="60" r="52" fill="none" stroke="url(#g-gauge)" strokeWidth="8" strokeDasharray="60 327" strokeLinecap="round" />
                  <defs><linearGradient id="g-gauge"><stop stopColor="#0062EC" /><stop offset="1" stopColor="#70E000" /></linearGradient></defs>
                </svg>
                <Gauge size={44} className="text-lime" aria-hidden="true" />
              </div>
              <div>
                <p className="font-display text-2xl">Medidor {t.name}</p>
                <p className="mt-2 max-w-md text-sm text-white/65">Mede download, upload e latência no servidor <strong className="text-white">Inet Telecom</strong>. Confirme que esse é o servidor selecionado.</p>
              </div>
              <button onClick={start} className="btn-lime"><Play size={16} aria-hidden="true" /> Iniciar teste</button>
            </motion.div>
          )}
        </AnimatePresence>

        {state !== "idle" && state !== "error" && (
          <iframe
            key={`${tool}-${run}`}
            src={t.embed}
            title={`Teste de velocidade ${t.name} – servidor Inet Telecom`}
            className="absolute inset-0 h-full w-full"
            allow="fullscreen"
            onLoad={() => (window.clearTimeout(timer.current), setState("ready"))}
          />
        )}
        {state === "loading" && (
          <div role="status" className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-4 bg-navy-ink/90 text-sm text-white/70">
            <RefreshCw className="animate-spin text-lime" aria-hidden="true" /> Carregando o medidor…
          </div>
        )}
        {state === "error" && (
          <div role="alert" className="absolute inset-0 flex flex-col items-center justify-center gap-5 bg-navy-ink px-6 text-center">
            <XCircle size={36} className="text-lime" aria-hidden="true" />
            <p className="max-w-sm text-white/75">O medidor não respondeu. Pode ser instabilidade do serviço ou bloqueio do navegador.</p>
            <div className="flex flex-wrap justify-center gap-3">
              <button onClick={start} className="btn-lime"><Repeat size={16} /> Tentar de novo</button>
              <a href={t.url} target="_blank" rel="noreferrer" className="btn-ghost">Abrir em nova aba <ExternalLink size={14} /></a>
            </div>
          </div>
        )}
      </div>

      {state === "ready" && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 p-4 sm:p-5">
          <p className="text-sm text-white/65">Resultado abaixo do contratado? Repita o teste por cabo antes de chamar o suporte.</p>
          <div className="flex gap-2">
            <button onClick={start} className="btn-ghost"><Repeat size={15} /> Repetir</button>
            <Link to="/suporte" className="btn-lime">Falar com o suporte</Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Velocidade() {
  usePageMeta("Teste de velocidade", "Teste a velocidade da sua internet INET no servidor oficial Inet Telecom e veja como medir corretamente: por cabo, em computador gigabit e sem outros aparelhos usando a rede.");

  return (
    <>
      <PageHero
        tag="Teste de velocidade"
        title={["Teste sua velocidade", <span className="italic text-lime">da forma correta.</span>]}
        lead="Veja como medir o desempenho da conexão contratada. O teste roda no servidor da própria INET, o “Inet Telecom”."
      >
        <a href="#medidor" className="btn-lime">Ir para o medidor</a>
        <a href="#como-testar" className="btn-ghost">Como testar certo</a>
      </PageHero>

      <Section id="medidor" tag="Medidor oficial" title={["Meça agora."]}>
        <Rise><SpeedTester /></Rise>
        <p className="mt-5 text-xs leading-relaxed text-white/45">
          Medidores de terceiros (Minha Conexão e Speedtest by Ookla, servidor personalizado da INET). Também é possível usar o <a href={NPERF_URL} target="_blank" rel="noreferrer" className="text-lime underline">nPerf</a> com o servidor “Inet Telecom”. Os resultados variam conforme o aparelho, o Wi-Fi ou cabo, o servidor e o uso da rede no momento do teste.
        </p>
      </Section>

      <Section id="como-testar" tag="Antes de medir" title={["O que você precisa", "saber antes do teste."]}>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { icon: Unplug, title: "Feche tudo", text: "Feche aplicativos e navegadores que usam a internet. Sem consumo de dados, o resultado é mais exato." },
            { icon: Wifi, title: "Wi-Fi não mede tudo", text: "Paredes, vidros e espelhos atrapalham a conexão do aparelho ao roteador. O teste por Wi-Fi pode oscilar." },
            { icon: Smartphone, title: "Cuidado com o celular", text: "O celular só mede o que ele suporta. Sem alto desempenho e tecnologias como Wi-Fi 6, o resultado não reflete a velocidade contratada." },
          ].map((c, i) => (
            <Rise key={c.title} delay={i * 0.06} className="h-full">
              <div className="card h-full p-7">
                <c.icon size={22} aria-hidden="true" className="card-icon text-lime" />
                <h3 className="mt-5 font-display text-xl">{c.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/65">{c.text}</p>
              </div>
            </Rise>
          ))}
        </div>

        <div className="mt-14 grid gap-10 lg:grid-cols-2">
          <Rise>
            <h3 className="h-md">Como testar corretamente</h3>
            <ol className="mt-6 space-y-3">
              {[
                "Use um dispositivo ligado por cabo: o teste é mais assertivo.",
                "Prefira dispositivos gigabit: só eles testam velocidades acima de 100 Mega.",
                "Feche todos os programas e interrompa as atualizações.",
                "Use um dispositivo compatível com a velocidade contratada.",
                "Deixe apenas o dispositivo do teste conectado à internet.",
                "Evite navegar na internet durante o teste.",
                "Repita o teste ao menos duas vezes.",
              ].map((s, i) => (
                <li key={s} className="flex gap-4 border-b border-white/10 pb-3">
                  <span className="font-display text-lime">{String(i + 1).padStart(2, "0")}</span>
                  <span className="text-white/80">{s}</span>
                </li>
              ))}
            </ol>
          </Rise>
          <Rise delay={0.1}>
            <h3 className="h-md">Vamos lá?</h3>
            <p className="mt-6 leading-relaxed text-white/70">
              Medir pelo Wi-Fi é mais fácil, mas o celular foi feito para mobilidade, não para alta velocidade. Para testar de verdade:
            </p>
            <ul className="mt-5 space-y-4">
              <li className="flex gap-3"><Cable size={18} aria-hidden="true" className="mt-0.5 shrink-0 text-lime" /><span className="text-white/80">Ligue o cabo de rede no computador (desktop ou notebook) e na porta LAN do roteador. Desligue o Wi-Fi dos outros aparelhos.</span></li>
              <li className="flex gap-3"><Laptop size={18} aria-hidden="true" className="mt-0.5 shrink-0 text-lime" /><span className="text-white/80">Confira se a porta de rede do computador é gigabit para testes acima de 100 Mbps.</span></li>
              <li className="flex gap-3"><AlertTriangle size={18} aria-hidden="true" className="mt-0.5 shrink-0 text-lime" /><span className="text-white/80">Feche abas e apps em segundo plano, como torrents e streaming, e confirme o servidor “Inet Telecom”.</span></li>
            </ul>
            <p className="mt-6 text-sm text-white/55">A ausência de qualquer um desses requisitos pode influenciar o teste e não entregar o resultado esperado.</p>
          </Rise>
        </div>
      </Section>

      <CtaBand title={["Resultado abaixo", <span className="italic text-lime">do esperado?</span>]} text="Depois de testar por cabo, fale com o suporte técnico 24 horas pelo WhatsApp.">
        <a href={waLink("Olá! Fiz o teste de velocidade e preciso de suporte técnico.")} target="_blank" rel="noreferrer" className="btn-lime">Suporte no WhatsApp</a>
        <Link to="/suporte" className="btn-ghost">Ver outras opções</Link>
      </CtaBand>
    </>
  );
}
