import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { EASE } from "../../motion";

/**
 * PageCurtain — Cortina azul INET de transição entre páginas (estilo Lusion #transition-overlay).
 *
 * Ao mudar de rota, uma cortina em azul royal/elétrico (#003F99 / #0062EC) surge cobrindo a tela
 * e desliza rapidamente para cima revelando a nova página, com a curva oficial do projeto (EASE).
 *
 * Respeita estritamente prefers-reduced-motion (desativa animação).
 */
export default function PageCurtain() {
  const { pathname } = useLocation();
  const reduced = useReducedMotion();
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (reduced) return;
    setActive(true);
    const timer = setTimeout(() => {
      setActive(false);
    }, 750);
    return () => clearTimeout(timer);
  }, [pathname, reduced]);

  if (reduced) return null;

  return (
    <AnimatePresence mode="wait">
      {active && (
        <motion.div
          key={`curtain-${pathname}`}
          className="pointer-events-none fixed inset-0 z-[100] flex flex-col items-center justify-center bg-gradient-to-b from-[#003F99] via-[#0062EC] to-[#002D70]"
          initial={{ clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)" }}
          animate={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" }}
          exit={{ clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)" }}
          transition={{ duration: 0.65, ease: EASE }}
        >
          {/* Logo sutil no centro da cortina durante o trânsito de rota */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="flex flex-col items-center gap-3"
          >
            <img
              src="/inet-logo-branca.png"
              alt="INET"
              width={140}
              height={50}
              className="h-10 sm:h-12 w-auto object-contain drop-shadow-[0_10px_25px_rgba(0,0,0,0.35)]"
            />
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#70E000] animate-pulse" />
              <span className="h-1.5 w-1.5 rounded-full bg-[#5CC8FF] animate-pulse delay-75" />
              <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse delay-150" />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
