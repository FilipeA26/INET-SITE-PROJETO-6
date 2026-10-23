import { Activity, ArrowUpRight, Radar, Users } from "lucide-react";
import { Rise } from "./Lines";

const DD = "https://downdetector.com.br/";

// serviços que costumam aparecer com instabilidade; cada um abre a página de status no Downdetector
const SERVICES = [
  { name: "WhatsApp", slug: "whatsapp" },
  { name: "Instagram", slug: "instagram" },
  { name: "Facebook", slug: "facebook" },
  { name: "YouTube", slug: "youtube" },
  { name: "Netflix", slug: "netflix" },
  { name: "TikTok", slug: "tiktok" },
  { name: "Spotify", slug: "spotify" },
  { name: "Discord", slug: "discord" },
  { name: "Steam", slug: "steam" },
  { name: "Free Fire", slug: "free-fire" },
];

const HOW = [
  { icon: Users, text: "Reúne, em tempo real, os relatos de problemas enviados por usuários e as menções nas redes sociais." },
  { icon: Activity, text: "Compara esse volume com o normal para o horário. Um pico fora do padrão indica uma falha no serviço." },
  { icon: Radar, text: "Mostra o gráfico das últimas 24 horas, os problemas mais relatados e as regiões afetadas." },
];

/**
 * "Já pensou que pode não ser a internet?": quando um app para, a falha pode estar
 * nos servidores dele. O card explica o Downdetector e leva direto à página de
 * status de cada serviço.
 */
export default function DownDetectorCard() {
  return (
    <Rise delay={0.1}>
      <div className="relative mt-6 overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,#021A4A,#010818_65%)] p-7 sm:p-10">
        <div aria-hidden="true" className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-[#ff5a3c]/10 blur-3xl" />
        <div className="relative grid gap-10 lg:grid-cols-[1.05fr_1fr]">
          <div>
            <p className="tag">Downdetector</p>
            <h3 className="mt-3 font-display text-3xl font-light leading-tight sm:text-4xl">
              Já pensou que pode <span className="italic text-lime">não ser a internet?</span>
            </h3>
            <p className="mt-4 leading-relaxed text-white/70">
              Quando o WhatsApp, o Instagram ou um jogo para de funcionar, a falha muitas vezes está nos servidores do próprio serviço, e não na sua conexão. Antes de reiniciar tudo, vale conferir no Downdetector.
            </p>
            <h4 className="mt-8 text-sm font-semibold uppercase tracking-[0.14em] text-white/80">Como o Downdetector funciona</h4>
            <ul className="mt-4 space-y-4">
              {HOW.map((h) => (
                <li key={h.text} className="flex gap-3 text-sm leading-relaxed text-white/65">
                  <h.icon size={18} aria-hidden="true" className="mt-0.5 shrink-0 text-lime" />
                  {h.text}
                </li>
              ))}
            </ul>
            <a href={DD} target="_blank" rel="noreferrer" className="btn-lime mt-8">
              Abrir o Downdetector <ArrowUpRight size={15} aria-hidden="true" />
            </a>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-[0.14em] text-white/80">Serviços que mais costumam cair</h4>
            <p className="mt-2 text-sm text-white/55">Toque para ver se há falhas agora:</p>
            <ul className="mt-5 grid grid-cols-2 gap-2.5">
              {SERVICES.map((s) => (
                <li key={s.slug}>
                  <a
                    href={`${DD}fora-do-ar/${s.slug}/`}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex min-h-[48px] items-center justify-between gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm transition-colors duration-500 hover:border-lime/60 hover:bg-white/[0.06]"
                  >
                    <span className="flex items-center gap-2.5">
                      <span aria-hidden="true" className="h-2 w-2 rounded-full bg-[#ffb02e] shadow-[0_0_10px_#ffb02e]" />
                      {s.name}
                    </span>
                    <ArrowUpRight size={14} aria-hidden="true" className="text-white/40 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:text-lime" />
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-xs leading-relaxed text-white/45">
              Lista dos serviços com mais relatos de instabilidade no Brasil. O status em tempo real fica no site do Downdetector, um serviço independente da Ookla, sem ligação com a INET.
            </p>
          </div>
        </div>
      </div>
    </Rise>
  );
}
