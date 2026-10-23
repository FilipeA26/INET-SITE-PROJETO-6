import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { DUR, EASE, SPRING } from "../motion";

const links = [
  { id: "inicio", label: "Início", mobile: false },
  { id: "planos", label: "Planos", mobile: true },
  { id: "vantagens", label: "Vantagens", mobile: false },
  { id: "cobertura", label: "Mapa", mobile: true },
];

/**
 * Menu flutuante (ref. Projeto 3): uma pílula de vidro quase transparente que
 * acompanha a tela toda sem cobrir o site. O destaque desliza até a seção atual.
 */
export default function Header() {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, SPRING);
  const [active, setActive] = useState("inicio");

  useEffect(() => {
    const ids = [...links.map((l) => l.id), "assinar"];
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  return (
    <>
      <motion.div style={{ scaleX: progress }} className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-gradient-to-r from-electric via-[#5CC8FF] to-lime" />
      <motion.nav
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: DUR, ease: EASE, delay: 0.3 }}
        className="fixed inset-x-0 top-4 z-50 flex justify-center px-3"
        aria-label="Menu principal"
      >
        <div className="flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.035] p-1.5 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.6)] backdrop-blur-md">
          <a href="#inicio" aria-label="INET – início" className="px-3">
            <img src="/inet-logo-branca.png" alt="INET" className="h-6 w-auto" />
          </a>
          {links.map((l) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              className={`relative rounded-full px-3.5 py-2 text-[13px] transition-colors duration-500 sm:px-4 ${l.mobile ? "" : "hidden md:block"} ${active === l.id ? "text-white" : "text-white/60 hover:text-white"}`}
            >
              {active === l.id && (
                <motion.span layoutId="nav-active" transition={{ duration: 0.7, ease: EASE }} className="absolute inset-0 rounded-full bg-white/10" />
              )}
              <span className="relative">{l.label}</span>
            </a>
          ))}
          <a href="#assinar" className={`rounded-full px-4 py-2 text-[13px] font-semibold transition-colors duration-500 ${active === "assinar" ? "bg-lime text-navy-ink" : "bg-lime/90 text-navy-ink hover:bg-lime"}`}>
            Assinar
          </a>
        </div>
      </motion.nav>
    </>
  );
}
