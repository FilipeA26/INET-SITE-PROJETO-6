import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { ChevronDown, Menu, UserRound, X } from "lucide-react";
import { DUR, EASE, SPRING } from "../motion";
import { COMPANY } from "../data/inet";

export const SERVICES = [
  { to: "/internet", label: "Internet e Wi-Fi", text: "Fibra óptica e Wi-Fi Mesh" },
  { to: "/tv", label: "INET TV", text: "NetFibra TV: canais, rádio e filmes" },
  { to: "/telefone-fixo", label: "Telefone fixo", text: "Ligações ilimitadas pela fibra" },
  { to: "/movel", label: "Chip móvel", text: "5G, WhatsApp e Waze ilimitados" },
  { to: "/entretenimento", label: "Entretenimento", text: "HBO Max, Deezer, Mumo e mais" },
];
const MAIN = [
  { to: "/teste-de-velocidade", label: "Velocidade" },
  { to: "/cobertura", label: "Cobertura" },
  { to: "/suporte", label: "Suporte" },
];

/**
 * Menu flutuante: pílula de vidro quase transparente que acompanha a tela inteira
 * sem cobrir o site. No celular vira um painel em tela cheia.
 */
export default function Header() {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, SPRING);
  const { pathname } = useLocation();
  const [drop, setDrop] = useState(false);
  const [mobile, setMobile] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);
  const servicesActive = SERVICES.some((s) => pathname.startsWith(s.to));

  useEffect(() => {
    setDrop(false);
    setMobile(false);
  }, [pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && (setDrop(false), setMobile(false));
    const onClick = (e: MouseEvent) => dropRef.current && !dropRef.current.contains(e.target as Node) && setDrop(false);
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobile ? "hidden" : "";
  }, [mobile]);

  const item = ({ isActive }: { isActive: boolean }) =>
    `relative rounded-full px-4 py-2 text-[13px] transition-colors duration-500 ${isActive ? "bg-white/10 text-white" : "text-white/65 hover:text-white"}`;

  return (
    <>
      <a href="#conteudo" className="sr-only z-[80] rounded-full bg-lime px-4 py-2 font-semibold text-navy-ink focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
        Pular para o conteúdo
      </a>
      <motion.div style={{ scaleX: progress }} className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-gradient-to-r from-electric via-[#5CC8FF] to-lime" />

      <motion.header
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: DUR, ease: EASE, delay: 0.2 }}
        className="fixed inset-x-0 top-3 z-50 flex justify-center px-3 sm:top-4"
      >
        <nav aria-label="Menu principal" className="flex w-full max-w-fit items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] p-1.5 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.6)] backdrop-blur-md">
          <Link to="/" aria-label="INET – página inicial" className="flex min-h-[40px] items-center px-3">
            <img src="/inet-logo-branca.png" alt="INET" width={68} height={24} className="h-6 w-auto" />
          </Link>

          <div ref={dropRef} className="relative hidden lg:block">
            <button
              aria-expanded={drop}
              aria-controls="menu-servicos"
              onClick={() => setDrop((d) => !d)}
              className={`flex items-center gap-1 rounded-full px-4 py-2 text-[13px] transition-colors duration-500 ${servicesActive || drop ? "bg-white/10 text-white" : "text-white/65 hover:text-white"}`}
            >
              Serviços <ChevronDown size={14} aria-hidden="true" className={`transition-transform duration-500 ${drop ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence>
              {drop && (
                <motion.ul
                  id="menu-servicos"
                  initial={{ opacity: 0, y: -8, filter: "blur(6px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -8, filter: "blur(6px)" }}
                  transition={{ duration: 0.5, ease: EASE }}
                  className="absolute left-0 top-[calc(100%+12px)] w-72 rounded-3xl border border-white/10 bg-navy-ink/90 p-2 backdrop-blur-xl"
                >
                  {SERVICES.map((s) => (
                    <li key={s.to}>
                      <NavLink to={s.to} className={({ isActive }) => `block rounded-2xl px-4 py-3 transition-colors duration-500 hover:bg-white/5 ${isActive ? "bg-white/10" : ""}`}>
                        <span className="block text-sm font-semibold">{s.label}</span>
                        <span className="block text-xs text-white/55">{s.text}</span>
                      </NavLink>
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>

          {MAIN.map((m) => (
            <NavLink key={m.to} to={m.to} className={(s) => `${item(s)} hidden lg:block`}>
              {m.label}
            </NavLink>
          ))}
          <a href={COMPANY.clientArea} target="_blank" rel="noreferrer" className="hidden items-center gap-1.5 rounded-full px-4 py-2 text-[13px] text-white/65 transition-colors duration-500 hover:text-white xl:flex">
            <UserRound size={14} aria-hidden="true" /> Central do Cliente
          </a>
          <Link to="/fale-conosco" className="rounded-full bg-lime/90 px-4 py-2 text-[13px] font-semibold text-navy-ink transition-colors duration-500 hover:bg-lime">
            Fale conosco
          </Link>
          <button
            onClick={() => setMobile(true)}
            aria-label="Abrir menu"
            aria-expanded={mobile}
            aria-controls="menu-movel"
            className="flex h-10 w-10 items-center justify-center rounded-full text-white/80 lg:hidden"
          >
            <Menu size={20} />
          </button>
        </nav>
      </motion.header>

      <AnimatePresence>
        {mobile && (
          <motion.div
            id="menu-movel"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="fixed inset-0 z-[70] overflow-y-auto bg-navy-ink/95 backdrop-blur-xl lg:hidden"
          >
            <div className="flex items-center justify-between px-5 pt-5">
              <img src="/inet-logo-branca.png" alt="INET" className="h-7 w-auto" />
              <button onClick={() => setMobile(false)} aria-label="Fechar menu" className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15">
                <X size={20} />
              </button>
            </div>
            <motion.nav
              aria-label="Menu móvel"
              initial="h"
              animate="s"
              transition={{ staggerChildren: 0.05, delayChildren: 0.1 }}
              className="px-5 pb-10 pt-8"
            >
              {[{ to: "/", label: "Início" }, ...SERVICES, ...MAIN, { to: "/fale-conosco", label: "Fale conosco" }].map((l) => (
                <motion.div key={l.to} variants={{ h: { opacity: 0, y: 14 }, s: { opacity: 1, y: 0 } }} transition={{ duration: 0.6, ease: EASE }}>
                  <NavLink end to={l.to} className={({ isActive }) => `block border-b border-white/10 py-4 font-display text-2xl ${isActive ? "text-lime" : "text-white"}`}>
                    {l.label}
                  </NavLink>
                </motion.div>
              ))}
              <a href={COMPANY.clientArea} target="_blank" rel="noreferrer" className="btn-ghost mt-8 w-full">
                <UserRound size={16} /> Central do Cliente
              </a>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
