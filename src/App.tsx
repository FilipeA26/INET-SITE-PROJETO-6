import { useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import Header from "./components/Header";
import Hero from "./components/Hero";
import PlanCarousel from "./components/PlanCarousel";
import Why from "./components/Why";
import CoverageMap from "./components/CoverageMap";
import SlideToSubscribe from "./components/SlideToSubscribe";
import Footer from "./components/Footer";
import Thread from "./components/Thread";
import BackToTop from "./components/BackToTop";
import { SPRING } from "./motion";

/** Rolagem suave com inércia; links "#" deslizam com a mesma suavidade. */
function useSmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ lerp: 0.075, wheelMultiplier: 0.9 });
    let raf = requestAnimationFrame(function loop(t) {
      lenis.raf(t);
      raf = requestAnimationFrame(loop);
    });
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
      if (!a) return;
      const el = document.querySelector(a.getAttribute("href")!);
      if (!el) return;
      e.preventDefault();
      lenis.scrollTo(el as HTMLElement, { duration: 1.8, easing: (x) => 1 - Math.pow(1 - x, 4) });
    };
    document.addEventListener("click", onClick);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("click", onClick);
      lenis.destroy();
    };
  }, []);
}

export default function App() {
  useSmoothScroll();
  const [selected, setSelected] = useState(1);
  const mainRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll();
  const p = useSpring(scrollYProgress, SPRING);
  // fundo escuro contínuo, só com os azuis profundos do manual da marca
  const bg = useTransform(p, [0, 0.25, 0.55, 0.8, 1], ["#010818", "#020F2E", "#03256C", "#020F2E", "#010818"]);

  return (
    <motion.div style={{ backgroundColor: bg }} className="min-h-screen">
      <Header />
      <main ref={mainRef} className="relative">
        <Thread container={mainRef} />
        <div className="relative z-10">
          <Hero />
          <PlanCarousel selected={selected} onSelect={setSelected} />
          <Why />
          <CoverageMap />
          <SlideToSubscribe selected={selected} />
          <Footer />
        </div>
      </main>
      <BackToTop />
    </motion.div>
  );
}
