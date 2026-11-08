import { useEffect, useRef, useState, type ReactNode } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';

export type ScrollSpinProps = {
  children: ReactNode;
  variant?: 'phone' | 'box';
  label?: string;
  className?: string;
  mediaClassName?: string;
};

/** Cena sticky: rolagem controla a orientação, sem loop, vídeo ou renderer 3D. */
export default function ScrollSpin({ children, variant = 'phone', label = 'Apresentação do produto', className = '', mediaClassName = '' }: ScrollSpinProps) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const [compact, setCompact] = useState(false);
  useEffect(() => {
    const query = matchMedia('(max-width: 767px)');
    const update = () => setCompact(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const rotateY = useTransform(scrollYProgress, [0, .5, 1], compact ? [-24, 0, 24] : [-48, 0, 48]);
  const rotateX = useTransform(scrollYProgress, [0, .5, 1], variant === 'box' ? [18, 0, -12] : [9, 0, -7]);
  const rotateZ = useTransform(scrollYProgress, [0, .5, 1], [-4, 0, 4]);
  const scale = useTransform(scrollYProgress, [0, .5, 1], compact ? [.86, 1, .9] : [.76, 1, .85]);

  return <section ref={ref} aria-label={label} data-scroll-spin={variant} className={`relative isolate ${className}`} style={{ minHeight: reduced ? undefined : compact ? '155svh' : '190svh' }}>
    <div className="flex items-center justify-center px-5" style={{ position: reduced ? 'relative' : 'sticky', top: reduced ? undefined : 96, height: reduced ? undefined : 'calc(100svh - 112px)', paddingBlock: reduced ? 48 : 20, perspective: 1200 }}>
      <motion.div className={`relative ${variant === 'phone' ? 'w-[min(62vw,300px,calc(43svh_-_77px))]' : 'w-[min(80vw,680px)]'} ${mediaClassName}`} style={{ transformStyle: 'preserve-3d', ...(reduced ? {} : { rotateY, rotateX, rotateZ, scale }) }}>
        {children}
      </motion.div>
    </div>
  </section>;
}
