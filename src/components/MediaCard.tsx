import { useRef } from "react";
import { Link } from "react-router-dom";
import { cubicBezier, motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { EASE } from "../motion";
import HoverJitter from "./giro/HoverJitter";
const mediaEase = cubicBezier(...EASE);

interface MediaCardProps {
  to: string;
  src: string;
  alt: string;
  title: string;
  description: string;
  objectPosition?: string;
}

/** Reserved geometry; only the media grows. Labels and focus never move. */
export default function MediaCard({ to, src, alt, title, description, objectPosition = "center" }: MediaCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center 65%"] });
  const scale = useTransform(scrollYProgress, [0, 1], [0.7, 1], { ease: mediaEase });
  const clipPath = useTransform(scrollYProgress, [0, 1], ["inset(6% 6% 6% 6% round 1.75rem)", "inset(0% 0% 0% 0% round 1.75rem)"], { ease: mediaEase });

  return (
    <Link to={to} className="media-card group block min-w-0 rounded-[1.75rem] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-[#5CC8FF]">
      <div ref={ref} className="relative aspect-[1.54] w-full">
        <motion.div data-media-expand className="absolute inset-0 overflow-hidden rounded-[1.75rem] bg-navy-deep" style={{ scale: reduced ? 1 : scale, clipPath: reduced ? "none" : clipPath }}>
          <HoverJitter className="h-full w-full" mediaClassName="h-full w-full">
            <img src={src} alt={alt} width={1280} height={832} loading="lazy" decoding="async" className="h-full w-full object-cover" style={{ objectPosition }} />
          </HoverJitter>
        </motion.div>
      </div>
      <div className="flex items-start justify-between gap-5 pt-5 sm:pt-6">
        <div className="min-w-0">
          <h3 className="font-display text-2xl leading-tight sm:text-3xl xl:text-4xl">{title}</h3>
          <p className="mt-3 max-w-[48ch] text-sm leading-relaxed text-white/70 sm:text-base">{description}</p>
        </div>
        <ArrowUpRight className="mt-1 shrink-0 text-lime" size={25} aria-hidden="true" />
      </div>
    </Link>
  );
}
