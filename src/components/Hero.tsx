import { useRef, useState } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { Hand } from "lucide-react";
import PluckFibers from "./PluckFibers";
import GestureHint from "./GestureHint";
import Lines, { Rise } from "./Lines";
import { SPRING } from "../motion";
import { waLink } from "../lib";

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const [hint, setHint] = useState(true);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const p = useSpring(scrollYProgress, SPRING);
  const fade = useTransform(p, [0, 0.85], [1, 0]);
  const lift = useTransform(p, [0, 1], ["0%", "-12%"]);
  const textY = useTransform(p, [0, 1], ["0%", "25%"]);

  return (
    <section ref={ref} id="inicio" className="relative min-h-[100svh] overflow-hidden bg-navy-ink">
      <motion.div style={{ opacity: fade, y: lift }} className="absolute inset-0">
        <PluckFibers className="absolute inset-0" onFirstPluck={() => setHint(false)} />
      </motion.div>
      {/* leitura do texto sobre as fibras */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy-ink via-navy-ink/40 to-transparent" />

      <motion.div style={{ y: textY }} className="wrap pointer-events-none relative z-10 flex min-h-[100svh] flex-col justify-end pb-20">
        <Rise>
          <p className="tag">Internet 100% fibra óptica</p>
        </Rise>
        <Lines as="h1" delay={0.1} className="h-xl mt-5" lines={["Sinta a", <span className="italic text-lime">fibra.</span>]} />
        <Rise delay={0.45}>
          <p className="mt-6 max-w-md text-lg text-white/65">
            Passe o dedo pelas fibras: é por fios de luz assim que a INET leva a sua internet, rápida e sem interferência.
          </p>
        </Rise>
        <Rise delay={0.6} className="pointer-events-auto mt-9 flex flex-wrap items-center gap-3">
          <a href="#planos" className="btn-lime">Ver planos</a>
          <a href={waLink()} target="_blank" rel="noreferrer" className="btn-ghost">Falar no WhatsApp</a>
        </Rise>
      </motion.div>

      <GestureHint icon={Hand} kind="drag" label="Arraste pelas fibras" visible={hint} className="absolute right-6 top-28 z-10 sm:right-12" />
      {/* início do fio que acompanha a rolagem (ref. Projeto 4) */}
      <span data-node="center" className="absolute bottom-0 left-1/2" />
    </section>
  );
}
