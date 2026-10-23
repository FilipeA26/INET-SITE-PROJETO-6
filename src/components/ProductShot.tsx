import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { DUR, EASE, SPRING } from "../motion";

/**
 * Foto de produto sobre o tema escuro: aura de luz da marca atrás, entrada com
 * desfoque e uma paralaxe suave ligada à rolagem (sem animação contínua).
 */
export default function ProductShot({ src, alt, width, height, glow = "#0062EC", className = "" }: { src: string; alt: string; width: number; height: number; glow?: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(useSpring(scrollYProgress, SPRING), [0, 1], ["6%", "-6%"]);

  return (
    <div ref={ref} className={`relative ${className}`}>
      <div aria-hidden="true" className="absolute inset-[12%] rounded-full blur-[70px]" style={{ background: `radial-gradient(circle, ${glow}88, transparent 70%)` }} />
      <div aria-hidden="true" className="absolute inset-x-[18%] bottom-[4%] h-[10%] rounded-[50%] bg-lime/20 blur-2xl" />
      <motion.img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
        decoding="async"
        style={{ y }}
        initial={{ opacity: 0, scale: 0.94, filter: "blur(10px)" }}
        whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
        viewport={{ once: true, margin: "-10% 0px" }}
        transition={{ duration: DUR, ease: EASE }}
        className="relative mx-auto h-auto w-full drop-shadow-[0_30px_40px_rgba(0,0,0,0.55)]"
      />
    </div>
  );
}
