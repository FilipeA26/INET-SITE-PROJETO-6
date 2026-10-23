import { Component, lazy, Suspense, useEffect, useRef, useState, type ReactNode } from "react";
import { useInView } from "framer-motion";
import { Gauge, Move3d, Radar, Smartphone, Timer } from "lucide-react";
import Lines, { Rise } from "./Lines";

// o three.js só é baixado quando a seção se aproxima da tela
const Router3D = lazy(() => import("./Wifi6Router3D"));

const PERKS = [
  { icon: Gauge, title: "Mais velocidade", text: "Até 1500 Mbps somando as duas faixas (1201 Mbps em 5 GHz), para a fibra chegar inteira ao seu aparelho." },
  { icon: Smartphone, title: "Mais aparelhos ao mesmo tempo", text: "Celulares, TVs, câmeras e casa inteligente conectados sem disputa pela rede." },
  { icon: Timer, title: "Menor latência", text: "Resposta mais rápida em jogos online, chamadas de vídeo e reuniões." },
  { icon: Radar, title: "Mais alcance e estabilidade", text: "Antenas que reduzem a interferência e, com HarmonyOS Mesh+, vários roteadores HUAWEI formam uma só rede." },
];

function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(window.WebGLRenderingContext && (c.getContext("webgl2") || c.getContext("webgl")));
  } catch {
    return false;
  }
}

class GLBoundary extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

/** Ilustração estática do HUAWEI WiFi AX2S, usada enquanto o 3D carrega ou quando não há WebGL. */
function RouterStill() {
  return (
    <svg viewBox="0 0 400 300" className="h-full w-full" role="img" aria-label="Roteador HUAWEI WiFi AX2S">
      <defs>
        <linearGradient id="w6body" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#D5DBE4" />
        </linearGradient>
        <linearGradient id="w6ant" x1="0" x2="1">
          <stop offset="0" stopColor="#E6EAF0" />
          <stop offset="1" stopColor="#FFFFFF" />
        </linearGradient>
      </defs>
      {[0, 1, 2].map((i) => (
        <path key={i} d={`M ${200 - 70 - i * 40} ${70 - i * 18} A ${70 + i * 40} ${70 + i * 40} 0 0 1 ${200 + 70 + i * 40} ${70 - i * 18}`} fill="none" stroke="#70E000" strokeOpacity={0.5 - i * 0.14} strokeWidth="3" strokeLinecap="round" />
      ))}
      {/* 4 antenas chatas articuladas na traseira */}
      {[112, 172, 232, 292].map((x) => (
        <g key={x}>
          <path d={`M ${x - 9} 196 L ${x + 9} 196 L ${x + 11} 72 Q ${x + 11} 66 ${x + 5} 66 L ${x - 5} 66 Q ${x - 11} 66 ${x - 11} 72 Z`} fill="url(#w6ant)" />
          <rect x={x - 9} y="190" width="18" height="10" rx="3" fill="#C9D0DA" />
        </g>
      ))}
      {/* corpo em cunha: alto atrás, fino na frente */}
      <path d="M 80 200 L 320 200 Q 352 200 360 222 L 366 236 Q 368 244 358 244 L 42 244 Q 32 244 34 236 L 40 222 Q 48 200 80 200 Z" fill="url(#w6body)" />
      <rect x="40" y="240" width="320" height="4" rx="2" fill="#B8C0CC" />
      <circle cx="200" cy="214" r="9" fill="#D9DEE6" />
      <path d="M 196 209 v 10 M 204 209 v 10 M 196 214 h 8" stroke="#8A94A6" strokeWidth="2" />
      <circle cx="200" cy="238" r="2.5" fill="#70E000" />
      <ellipse cx="200" cy="258" rx="150" ry="8" fill="#000" opacity="0.45" />
    </svg>
  );
}

/** Seção sobre Wi-Fi 6 com um roteador 3D que gira ao arrastar. */
export default function Wifi6({ id = "wifi6", tag = "Wi-Fi 6" }: { id?: string; tag?: string }) {
  const stage = useRef<HTMLDivElement>(null);
  const near = useInView(stage, { once: true, margin: "300px 0px" });
  const [gl, setGl] = useState<boolean | null>(null);

  useEffect(() => {
    if (near && gl === null) setGl(hasWebGL());
  }, [near, gl]);

  const still = <RouterStill />;

  return (
    <section id={id} className="relative overflow-hidden py-20 sm:py-28">
      <div aria-hidden="true" className="pointer-events-none absolute -right-40 top-10 h-[520px] w-[520px] rounded-full bg-navy/40 blur-[130px]" />
      <div aria-hidden="true" className="pointer-events-none absolute -left-24 bottom-0 h-[320px] w-[320px] rounded-full bg-lime/10 blur-[110px]" />
      <div className="wrap relative grid items-center gap-12 lg:grid-cols-[1fr_1.05fr]">
        <div>
          <Rise><p className="tag">{tag}</p></Rise>
          <Lines className="h-lg mt-4" lines={["A fibra chega inteira", <span className="italic text-lime">em cada cômodo.</span>]} />
          <Rise delay={0.2}>
            <p className="lead mt-5 max-w-xl">
              O Roteador HUAWEI WiFi AX2S traz o Wi-Fi 6, a nova geração de redes sem fio: mais velocidade em 5 GHz, muito mais aparelhos ao mesmo tempo e conexão estável para toda a família. Ele ainda leva cada aparelho para a melhor faixa (2,4 ou 5 GHz) automaticamente.
            </p>
          </Rise>
          <ul className="mt-10 grid gap-3 sm:grid-cols-2">
            {PERKS.map((p, i) => (
              <Rise as="li" key={p.title} delay={0.1 + i * 0.06} className="card p-5">
                <p.icon size={20} aria-hidden="true" className="card-icon text-lime" />
                <h3 className="mt-4 font-display text-lg">{p.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-white/60">{p.text}</p>
              </Rise>
            ))}
          </ul>
          <p className="mt-6 text-xs leading-relaxed text-white/45">Velocidades informadas pela HUAWEI são máximas teóricas; o desempenho real varia conforme os aparelhos (que também precisam ser compatíveis com Wi-Fi 6) e o ambiente. A troca automática de faixa exige aparelhos com 802.11v. Confirme com a INET quais planos incluem o HUAWEI WiFi AX2S.</p>
        </div>

        <Rise delay={0.15}>
          <div ref={stage} className="relative aspect-square w-full overflow-hidden rounded-[2rem] border border-white/10 bg-[radial-gradient(80%_70%_at_50%_40%,#020F2E,#010818_75%)]">
            <div aria-hidden="true" className="pointer-events-none absolute inset-x-10 bottom-10 h-24 rounded-full bg-lime/10 blur-3xl" />
            <div className="absolute inset-0">
              {near && gl ? (
                <GLBoundary fallback={<div className="p-12">{still}</div>}>
                  <Suspense fallback={<div className="p-12">{still}</div>}>
                    <Router3D onError={() => setGl(false)} />
                  </Suspense>
                </GLBoundary>
              ) : (
                <div className="p-12">{still}</div>
              )}
            </div>
            {gl && (
              <p className="pointer-events-none absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/15 bg-black/30 px-4 py-2 text-xs text-white/70 backdrop-blur">
                <Move3d size={14} aria-hidden="true" className="text-lime" /> Arraste para girar
              </p>
            )}
            <span className="absolute left-5 top-5 rounded-full bg-lime px-3 py-1 font-display text-xs font-semibold uppercase tracking-[0.18em] text-navy-ink">Wi-Fi 6</span>
            <p className="absolute right-5 top-5 text-right text-xs leading-tight text-white/60">Roteador<br /><span className="font-display text-sm text-white">HUAWEI WiFi AX2S</span></p>
          </div>
        </Rise>
      </div>
    </section>
  );
}
