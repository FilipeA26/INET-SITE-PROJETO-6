import { useEffect, useRef, type PointerEvent, type ReactNode } from 'react';

export type HoverJitterProps = {
  children: ReactNode;
  className?: string;
  mediaClassName?: string;
  intensity?: 1 | 2 | 3;
  disabled?: boolean;
};

/** Impulso finito na mídia; a expansão do card deve permanecer no elemento pai. */
export default function HoverJitter({ children, className = '', mediaClassName = '', intensity = 2, disabled = false }: HoverJitterProps) {
  const host = useRef<HTMLDivElement>(null);
  const media = useRef<HTMLDivElement>(null);
  const animation = useRef<Animation | null>(null);
  const enabled = useRef(false);
  const base = useRef('none');

  const cancel = () => {
    if (animation.current) {
      animation.current.onfinish = null;
      animation.current.cancel();
      animation.current = null;
    }
    if (media.current) media.current.style.willChange = '';
  };
  const track = (next: Animation) => {
    animation.current = next;
    next.onfinish = () => {
      if (animation.current !== next) return;
      animation.current = null;
      if (media.current) media.current.style.willChange = '';
    };
  };

  useEffect(() => {
    const fine = matchMedia('(hover: hover) and (pointer: fine)');
    const reduce = matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => {
      cancel();
      enabled.current = !disabled && fine.matches && !reduce.matches;
      // Folga estática só no mouse: o deslocamento não revela frestas na moldura.
      base.current = enabled.current ? 'scale(1.02)' : 'none';
      if (media.current) media.current.style.transform = base.current;
    };
    const visibility = () => { if (document.hidden) cancel(); };
    const observer = new IntersectionObserver(([entry]) => { if (!entry.isIntersecting) cancel(); });
    if (host.current) observer.observe(host.current);
    fine.addEventListener('change', update);
    reduce.addEventListener('change', update);
    document.addEventListener('visibilitychange', visibility);
    update();
    return () => {
      cancel();
      observer.disconnect();
      fine.removeEventListener('change', update);
      reduce.removeEventListener('change', update);
      document.removeEventListener('visibilitychange', visibility);
    };
  }, [disabled]);

  const enter = (event: PointerEvent<HTMLDivElement>) => {
    const node = media.current;
    if (!node || !enabled.current || event.pointerType !== 'mouse' || document.hidden || typeof node.animate !== 'function') return;
    cancel();
    const amount = Math.max(1, Math.min(3, intensity));
    const rect = node.getBoundingClientRect();
    const overscan = 1 + 2 * (amount + 1) / Math.max(80, Math.min(rect.width, rect.height));
    base.current = `scale(${Math.max(1.02, overscan)})`;
    node.style.transform = base.current;
    node.style.willChange = 'transform, filter';
    const samples = [
      [0, 0, 0, 0], [.14, 1, -.5, .65], [.28, -.8, .4, .4],
      [.43, .6, -.25, .25], [.62, -.35, .15, .1], [.82, .15, -.05, 0], [1, 0, 0, 0],
    ];
    track(node.animate(samples.map(([offset, x, y, blur]) => ({
      offset, transform: `translate3d(${x * amount}px, ${y * amount}px, 0) ${base.current}`,
      filter: `blur(${blur}px)`,
    })), { duration: 360, easing: 'linear', fill: 'none' }));
  };
  const leave = () => {
    const node = media.current;
    if (!node || !animation.current) return;
    const current = getComputedStyle(node);
    const from = { transform: current.transform, filter: current.filter };
    cancel();
    if (!enabled.current || document.hidden) return;
    node.style.willChange = 'transform, filter';
    track(node.animate([from, { transform: base.current, filter: 'blur(0px)' }], {
      duration: 120, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', fill: 'none',
    }));
  };

  return <div ref={host} data-hover-jitter className={`relative overflow-hidden ${className}`} onPointerEnter={enter} onPointerLeave={leave} onPointerCancel={cancel}>
    <div ref={media} data-hover-jitter-media className={`h-full w-full ${mediaClassName}`} style={{ transformOrigin: 'center' }}>
      {children}
    </div>
  </div>;
}
