import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { BellRing, Eye, Lightbulb, Moon, Music, Plug, Smartphone, Thermometer, Tv, Video } from "lucide-react";
import Lines, { Rise } from "./Lines";
import { DUR, EASE, SPRING } from "../motion";
import { waLink } from "../data/inet";

/** Vídeo de fundo mudo em loop; com "reduzir movimento" fica só o pôster. Só toca quando está na tela. */
function VideoBackdrop({ src, poster, className = "" }: { src: string; poster: string; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [still] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);

  useEffect(() => {
    const v = ref.current;
    if (!v || still) return;
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? v.play().catch(() => {}) : v.pause()), { threshold: 0.1 });
    io.observe(v);
    return () => io.disconnect();
  }, [still]);

  return still ? (
    <img src={poster} alt="" aria-hidden="true" className={`h-full w-full object-cover ${className}`} />
  ) : (
    <video ref={ref} src={src} poster={poster} muted loop playsInline preload="none" aria-hidden="true" className={`h-full w-full object-cover ${className}`} />
  );
}

function Stage({ id, video, poster, children }: { id: string; video: string; poster: string; children: ReactNode }) {
  return (
    <section id={id} className="relative py-20 sm:py-28">
      <div className="wrap">
        <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10">
          <div className="absolute inset-0">
            <VideoBackdrop src={video} poster={poster} className="scale-105" />
            <div className="absolute inset-0 bg-[linear-gradient(100deg,#010818_8%,#010818e6_42%,#01081899_70%,#01081855)]" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#010818] via-transparent to-transparent" />
          </div>
          <div className="relative p-8 sm:p-14">{children}</div>
        </div>
      </div>
    </section>
  );
}

const SECURITY = [
  { icon: Eye, title: "Ao vivo no celular", text: "Veja a casa de onde estiver, em tempo real." },
  { icon: BellRing, title: "Alerta de movimento", text: "Receba um aviso quando algo se mexer." },
  { icon: Moon, title: "Visão noturna", text: "Imagem nítida mesmo no escuro." },
  { icon: Video, title: "Gravação", text: "Reveja o que aconteceu quando precisar." },
];

/** Segurança: câmera Intelbras Mibo sobre vídeo de fundo de monitoramento. */
export function HomeSecurity() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const p = useSpring(scrollYProgress, SPRING);
  const y = useTransform(p, [0, 1], ["8%", "-8%"]);
  const rotate = useTransform(p, [0, 1], [-6, 4]);

  return (
    <Stage id="seguranca" video="/casa/seg.mp4" poster="/casa/seg-poster.webp">
      <div ref={ref} className="grid items-center gap-10 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <Rise><p className="tag">Segurança</p></Rise>
          <Lines className="h-lg mt-4 max-w-xl" lines={["Sua casa", <span className="italic text-lime">sempre à vista.</span>]} />
          <Rise delay={0.15}>
            <p className="lead mt-5 max-w-lg">Com a câmera Wi-Fi Intelbras Mibo e a fibra da INET, você acompanha tudo pelo celular, com imagem estável e sem travar.</p>
          </Rise>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {SECURITY.map((s, i) => (
              <Rise key={s.title} delay={0.1 + i * 0.06}>
                <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-[#010818]/60 p-4 backdrop-blur-md">
                  <s.icon size={20} aria-hidden="true" className="mt-0.5 shrink-0 text-lime" />
                  <span>
                    <span className="block font-semibold">{s.title}</span>
                    <span className="block text-sm text-white/65">{s.text}</span>
                  </span>
                </div>
              </Rise>
            ))}
          </div>
          <Rise delay={0.3}>
            <a href={waLink("Olá! Quero saber sobre a câmera de segurança Intelbras Mibo com a INET.")} target="_blank" rel="noreferrer" className="btn-lime mt-8">Quero proteger minha casa</a>
          </Rise>
        </div>
        <div className="relative mx-auto w-full max-w-[380px]">
          <div aria-hidden="true" className="absolute inset-[10%] rounded-full bg-[radial-gradient(circle,#0062EC66,transparent_70%)] blur-[60px]" />
          <motion.img
            src="/casa/mibo.webp"
            alt="Câmera Wi-Fi Intelbras Mibo"
            width={842}
            height={1020}
            loading="lazy"
            style={{ y, rotate }}
            initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
            whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: DUR, ease: EASE }}
            className="relative h-auto w-full drop-shadow-[0_40px_50px_rgba(0,0,0,0.7)]"
          />
          {/* ponto "gravando" sobre a lente */}
          <span aria-hidden="true" className="absolute right-[18%] top-[12%] flex items-center gap-1.5 rounded-full bg-[#010818]/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/85 backdrop-blur">
            <span className="h-2 w-2 animate-pulse rounded-full bg-[#ff4d4d]" /> Ao vivo
          </span>
        </div>
      </div>
    </Stage>
  );
}

// aparelhos que a Alexa comanda, em volta dela
const DEVICES = [
  { icon: Lightbulb, label: "Luzes", angle: -90 },
  { icon: Plug, label: "Tomadas", angle: -30 },
  { icon: Tv, label: "TV", angle: 30 },
  { icon: Video, label: "Câmeras", angle: 90 },
  { icon: Thermometer, label: "Ar-condicionado", angle: 150 },
  { icon: Music, label: "Música", angle: 210 },
];

const COMMANDS = ["“Alexa, apague as luzes da sala.”", "“Alexa, mostre a câmera da garagem.”", "“Alexa, toque minha playlist.”", "“Alexa, ligue o ar às 22h.”"];

/** Casa inteligente com Alexa: a voz no centro, os aparelhos conectados em volta. */
export function AlexaHome() {
  const [cmd, setCmd] = useState(0);
  useEffect(() => {
    const t = window.setInterval(() => setCmd((c) => (c + 1) % COMMANDS.length), 3200);
    return () => window.clearInterval(t);
  }, []);

  return (
    <Stage id="alexa" video="/casa/alexa.mp4" poster="/casa/alexa-poster.webp">
      <div className="grid items-center gap-12 lg:grid-cols-[1fr_1fr]">
        <div>
          <Rise><p className="tag">Casa inteligente com Alexa</p></Rise>
          <Lines className="h-lg mt-4 max-w-xl" lines={["Fale e a casa", <span className="italic text-lime">obedece.</span>]} />
          <Rise delay={0.15}>
            <p className="lead mt-5 max-w-lg">A Alexa se conecta pelo Wi-Fi a lâmpadas, tomadas, TV e câmeras compatíveis. Você comanda tudo pela voz ou pelo app, e cria rotinas que funcionam sozinhas.</p>
          </Rise>
          <div className="mt-7 h-14" aria-live="polite">
            <motion.p
              key={cmd}
              initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.8, ease: EASE }}
              className="font-display text-xl italic text-white/90 sm:text-2xl"
            >
              {COMMANDS[cmd]}
            </motion.p>
          </div>
          <ul className="mt-4 space-y-2 text-sm text-white/70">
            <li className="flex gap-2"><Smartphone size={16} aria-hidden="true" className="mt-0.5 shrink-0 text-lime" /> Configure no app Alexa em poucos minutos.</li>
            <li className="flex gap-2"><Moon size={16} aria-hidden="true" className="mt-0.5 shrink-0 text-lime" /> Rotinas: “boa noite” apaga as luzes e liga a câmera.</li>
          </ul>
          <Rise delay={0.3}>
            <a href={waLink("Olá! Quero deixar minha casa inteligente com a Alexa e a INET.")} target="_blank" rel="noreferrer" className="btn-lime mt-8">Quero uma casa inteligente</a>
          </Rise>
        </div>

        {/* a Alexa no centro, aparelhos em órbita ligados por fios de luz */}
        <div className="relative mx-auto aspect-square w-full max-w-[420px]" aria-hidden="true">
          <svg viewBox="-100 -100 200 200" className="absolute inset-0 h-full w-full">
            {DEVICES.map((d, i) => {
              const r = (d.angle * Math.PI) / 180;
              return (
                <line key={d.label} x1="0" y1="0" x2={Math.cos(r) * 72} y2={Math.sin(r) * 72} stroke="#70E000" strokeOpacity="0.35" strokeWidth="0.6" strokeDasharray="2 3" className="alexa-link" style={{ animationDelay: `${i * 0.4}s` }} />
              );
            })}
          </svg>
          <div className="absolute left-1/2 top-1/2 flex h-28 w-28 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[radial-gradient(circle_at_35%_30%,#2a3550,#0b1020)] shadow-[0_0_60px_-10px_#0062EC]">
            <span className="absolute inset-x-5 bottom-5 h-1.5 animate-pulse rounded-full bg-[#5CC8FF] shadow-[0_0_18px_#5CC8FF]" />
            <span className="absolute inset-0 animate-[wa-ping_3s_cubic-bezier(0.16,1,0.3,1)_infinite] rounded-full border border-[#5CC8FF]/50 motion-reduce:hidden" />
          </div>
          {DEVICES.map((d, i) => {
            const r = (d.angle * Math.PI) / 180;
            return (
              <motion.div
                key={d.label}
                initial={{ opacity: 0, scale: 0.6 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: EASE, delay: 0.2 + i * 0.08 }}
                className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1.5"
                style={{ left: `${50 + Math.cos(r) * 36}%`, top: `${50 + Math.sin(r) * 36}%` }}
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/15 bg-[#010818]/80 text-lime backdrop-blur-md">
                  <d.icon size={20} />
                </span>
                <span className="text-[11px] text-white/70">{d.label}</span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </Stage>
  );
}
