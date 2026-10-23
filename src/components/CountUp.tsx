import { useEffect, useRef } from "react";
import { animate, useInView } from "framer-motion";
import { EASE } from "../motion";

/** Número que conta de 0 até o valor quando entra na tela. */
export default function CountUp({ to, className = "" }: { to: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });

  useEffect(() => {
    if (!inView || !ref.current) return;
    const el = ref.current;
    const controls = animate(0, to, {
      duration: 1.8,
      ease: EASE,
      onUpdate: (v) => (el.textContent = Math.round(v).toString()),
    });
    return () => controls.stop();
  }, [inView, to]);

  return (
    <span ref={ref} className={className}>
      0
    </span>
  );
}
