import { useRef, type ReactNode } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';

export type SideToCenterProps = {
  children: ReactNode;
  side?: 'left' | 'right';
  variant?: 'media' | 'box';
  label?: string;
  className?: string;
  mediaClassName?: string;
};

/** Mídia entra lateralmente e cresce; overflow clip não cria um scroll container. */
export default function SideToCenter({ children, side = 'left', variant = 'media', label = 'Apresentação visual', className = '', mediaClassName = '' }: SideToCenterProps) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const x = useTransform(scrollYProgress, [0, .7, 1], side === 'left' ? ['-24%', '0%', '0%'] : ['24%', '0%', '0%']);
  const scale = useTransform(scrollYProgress, [0, .7, 1], [.62, 1, 1]);
  const rotateY = useTransform(scrollYProgress, [0, .7, 1], variant === 'box' ? [side === 'left' ? 42 : -42, 0, side === 'left' ? -28 : 28] : [side === 'left' ? 14 : -14, 0, 0]);

  const rotateX = useTransform(scrollYProgress, [0, .7, 1], variant === 'box' ? [16, 0, -10] : [0, 0, 0]);

  return <section ref={ref} aria-label={label} data-side-to-center={side} className={`relative isolate overflow-x-clip ${className}`} style={{ minHeight: reduced ? undefined : '170svh' }}>
    <div className="flex items-center justify-center px-5 sm:px-10" style={{ position: reduced ? 'relative' : 'sticky', top: reduced ? undefined : 96, height: reduced ? undefined : 'calc(100svh - 112px)', paddingBlock: reduced ? 48 : 24, perspective: 1400 }}>
      <motion.div className={`w-full max-w-[1440px] ${mediaClassName}`} style={reduced ? undefined : { x, scale, rotateY, rotateX, transformStyle: 'preserve-3d', transformOrigin: side === 'left' ? 'left center' : 'right center' }}>
        {children}
      </motion.div>
    </div>
  </section>;
}
