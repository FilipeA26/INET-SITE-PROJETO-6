import { useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { EASE } from "../motion";

/** Botão flutuante de voltar ao início: aparece quando a pessoa chega perto do fim. */
export default function BackToTop() {
  const { scrollYProgress } = useScroll();
  const [show, setShow] = useState(false);
  useMotionValueEvent(scrollYProgress, "change", (v) => setShow(v > 0.8));

  return (
    <AnimatePresence>
      {show && (
        <motion.a
          href="#top"
          aria-label="Voltar ao início"
          initial={{ opacity: 0, y: 16, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.9 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="fixed bottom-[5.75rem] right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-white/[0.06] text-white backdrop-blur-md transition-colors duration-500 hover:border-lime hover:bg-lime hover:text-navy-ink"
        >
          <ArrowUp size={18} />
        </motion.a>
      )}
    </AnimatePresence>
  );
}
