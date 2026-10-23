import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { Hand } from "lucide-react";
import PluckFibers from "./PluckFibers";
import GestureHint from "./GestureHint";
import Lines, { Rise } from "./Lines";
import { SPRING } from "../motion";

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const [hint, setHint] = useState(true);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const p = useSpring(scrollYProgress, SPRING);
  const fade = useTransform(p, [0, 0.85], [1, 0]);
  const lift = useTransform(p, [0, 1], ["0%", "-12%"]);
  const textY = useTransform(p, [0, 1], ["0%", "22%"]);

  return (
    <section ref={ref} className="relative min-h-[100svh] overflow-hidden bg-navy-ink">
      <motion.div style={{ opacity: fade, y: lift }} className="absolute inset-0">
        <PluckFibers className="absolute inset-0" onFirstPluck={() => setHint(false)} />
      </motion.div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy-ink via-navy-ink/50 to-transparent" />

      <motion.div style={{ y: textY }} className="wrap pointer-events-none relative z-10 flex min-h-[100svh] flex-col justify-end pb-20">
        <Rise><p className="tag">Internet 100% fibra óptica · Teófilo Otoni</p></Rise>
        <Lines as="h1" delay={0.1} className="h-xl mt-5 max-w-4xl" lines={["A internet fibra", <span className="italic text-lime">mais escolhida da cidade.</span>]} />
        <Rise delay={0.45}>
          <p className="lead mt-6 max-w-xl">
            Planos de até 1 Giga com Wi-Fi grátis, TV, telefone fixo e chip 5G. Suporte técnico 24 horas pelo WhatsApp.
          </p>
        </Rise>
        <Rise delay={0.6} className="pointer-events-auto mt-9 flex flex-wrap items-center gap-3">
          <a href="#planos" className="btn-lime">Ver planos</a>
          <Link to="/cobertura" className="btn-ghost">Lojas e cobertura</Link>
        </Rise>
      </motion.div>

      <GestureHint icon={Hand} kind="drag" label="Passe o dedo pelas fibras" visible={hint} className="absolute right-5 top-24 z-10 hidden sm:inline-flex sm:right-12" />
      <span data-node="center" className="absolute bottom-0 left-1/2" />
    </section>
  );
}
