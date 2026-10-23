import { AnimatePresence, motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { DUR, EASE } from "../motion";

/**
 * Dica de gesto: um ícone que repete o movimento esperado (arrastar, deslizar,
 * segurar, pinçar). Some com suavidade assim que o gesto é reconhecido.
 */
const moves = {
  drag: { x: [0, 26, 0], y: 0, scale: 1 },
  swipe: { x: [18, -18, 18], y: 0, scale: 1 },
  hold: { x: 0, y: 0, scale: [1, 0.82, 0.82, 1] },
  pinch: { x: 0, y: 0, scale: [1, 1.25, 1] },
};

export default function GestureHint({ icon: Icon, label, kind, visible, className = "" }: { icon: LucideIcon; label: string; kind: keyof typeof moves; visible: boolean; className?: string }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -6, filter: "blur(6px)" }}
          transition={{ duration: DUR * 0.8, ease: EASE }}
          className={`pointer-events-none inline-flex items-center gap-3 rounded-full border border-white/15 bg-navy-ink/50 py-2 pl-2 pr-4 text-xs text-white/80 backdrop-blur-md ${className}`}
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-lime/15 text-lime">
            <motion.span animate={moves[kind]} transition={{ duration: 1.8, ease: "easeInOut", repeat: Infinity }}>
              <Icon size={15} />
            </motion.span>
          </span>
          {label}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
