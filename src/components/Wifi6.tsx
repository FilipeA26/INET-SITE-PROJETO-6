import { Component, lazy, Suspense, useEffect, useRef, useState, type ReactNode } from "react";
import { useInView } from "framer-motion";
import { Gauge, Move3d, Radar, Smartphone, Timer } from "lucide-react";
import Lines, { Rise } from "./Lines";

// o three.js só é baixado quando a seção se aproxima da tela
const Router3D = lazy(() => import("./Wifi6Router3D"));

const PERKS = [
  { icon: Gauge, title: "Mais velocidade", text: "Até 40% mais desempenho que o Wi-Fi 5, aproveitando melhor a velocidade da fibra." },
  { icon: Smartphone, title: "Mais aparelhos ao mesmo tempo", text: "Celulares, TVs, câmeras e casa inteligente conectados sem disputa pela rede." },
  { icon: Timer, title: "Menor latência", text: "Resposta mais rápida em jogos online, chamadas de vídeo e reuniões." },
  { icon: Radar, title: "Mais alcance e estabilidade", text: "Sinal mais eficiente pelos cômodos e menos interferência de vizinhos." },
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

/** Ilustração estática usada enquanto o 3D carrega ou quando não há WebGL. */
function RouterStill() {
  return (
    <svg viewBox="0 0 400 300" className="h-full w-full" role="img" aria-label="Roteador Wi-Fi 6 da INET">
      <defs>
        <linearGradient id="w6body" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#003F99" />
          <stop offset="1" stopColor="#03256C" />
        </linearGradient>
      </defs>
      {[0, 1, 2].map((i) => (
        <path key={i} d={`M ${200 - 60 - i * 40} ${110 - i * 22} A ${60 + i * 40} ${60 + i * 40} 0 0 1 ${200 + 60 + i * 40} ${110 - i * 22}`} fill="none" stroke="#70E000" strokeOpacity={0.55 - i * 0.15} strokeWidth="3" strokeLinecap="round" />
      ))}
      {[-75, -25, 25, 75].map((x, i) => (
        <rect key={x} x={200 + x - 6} y={70} width="12" height="110" rx="6" fill="#03256C" stroke="#0062EC" strokeOpacity="0.5" transform={`rotate(${(i - 1.5) * 6} ${200 + x} 180)`} />
      ))}
      <rect x="80" y="170" width="240" height="56" rx="18" fill="url(#w6body)" stroke="#0062EC" strokeOpacity="0.6" />
      {[0, 1, 2, 3, 4].map((i) => <circle key={i} cx={160 + i * 20} cy="206" r="4" fill="#70E000" />)}
      <ellipse cx="200" cy="246" rx="120" ry="8" fill="#000" opacity="0.4" />
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
      <div aria-hidden="true" className="pointer-events-none absolute -right-40 top-10 h-[520px] w-[520px] rounded-full bg-electric/20 blur-[130px]" />
      <div aria-hidden="true" className="pointer-events-none absolute -left-24 bottom-0 h-[320px] w-[320px] rounded-full bg-lime/10 blur-[110px]" />
      <div className="wrap relative grid items-center gap-12 lg:grid-cols-[1fr_1.05fr]">
        <div>
          <Rise><p className="tag">{tag}</p></Rise>
          <Lines className="h-lg mt-4" lines={["A fibra chega inteira", <span className="italic text-lime">em cada cômodo.</span>]} />
          <Rise delay={0.2}>
            <p className="lead mt-5 max-w-xl">
              O Wi-Fi 6 é a nova geração de redes sem fio: entrega mais velocidade, atende muito mais aparelhos ao mesmo tempo e deixa a conexão mais estável para toda a família.
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
          <p className="mt-6 text-xs leading-relaxed text-white/45">Ganhos variam conforme o roteador, os aparelhos (que também precisam ser compatíveis com Wi-Fi 6) e o ambiente. Confirme com a INET quais planos incluem roteador Wi-Fi 6.</p>
        </div>

        <Rise delay={0.15}>
          <div ref={stage} className="relative aspect-square w-full overflow-hidden rounded-[2rem] border border-white/10 bg-[radial-gradient(80%_70%_at_50%_40%,#03256C,#010818_75%)]">
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
          </div>
        </Rise>
      </div>
    </section>
  );
}
