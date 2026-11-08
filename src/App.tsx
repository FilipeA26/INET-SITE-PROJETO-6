import { lazy, Suspense, useEffect } from "react";
import { Outlet, Route, Routes, useLocation } from "react-router-dom";
import Lenis from "lenis";
import Header from "./components/Header";
import Footer from "./components/Footer";
import BackToTop from "./components/BackToTop";
import WhatsAppButton from "./components/WhatsAppButton";
import PageCurtain from "./components/t3/PageCurtain";
import Home from "./pages/Home";
import { FiberTube, ReelUnfold } from "./components/lusion";

// páginas internas carregadas sob demanda (o mapa e os medidores não pesam na inicial)
const Internet = lazy(() => import("./pages/Internet"));
const Tv = lazy(() => import("./pages/Tv"));
const Fixo = lazy(() => import("./pages/Fixo"));
const Movel = lazy(() => import("./pages/Movel"));
const Entretenimento = lazy(() => import("./pages/Entretenimento"));
const Velocidade = lazy(() => import("./pages/Velocidade"));
const Cobertura = lazy(() => import("./pages/Cobertura"));
const Suporte = lazy(() => import("./pages/Suporte"));
const FaleConosco = lazy(() => import("./pages/FaleConosco"));
const Eventos = lazy(() => import("./pages/Eventos"));
const Avaliacoes = lazy(() => import("./pages/Avaliacoes"));
const Combo = lazy(() => import("./pages/Combo"));
const NotFound = lazy(() => import("./pages/NotFound"));

let lenis: Lenis | null = null;

// altura do menu flutuante + respiro: toda âncora pousa com o título logo abaixo dele
const HEADER_OFFSET = -90;

/** Rolagem suave com inércia; âncoras "#" deslizam com a mesma curva. */
function useSmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    lenis = new Lenis({ lerp: 0.075, wheelMultiplier: 0.9 });
    let raf = requestAnimationFrame(function loop(t) {
      lenis?.raf(t);
      raf = requestAnimationFrame(loop);
    });
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
      if (!a) return;
      const el = document.querySelector(a.getAttribute("href")!);
      if (!el) return;
      e.preventDefault();
      lenis?.scrollTo(el as HTMLElement, { offset: HEADER_OFFSET, duration: 1.8, easing: (x) => 1 - Math.pow(1 - x, 4) });
    };
    document.addEventListener("click", onClick);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("click", onClick);
      lenis?.destroy();
      lenis = null;
    };
  }, []);
}

/** Na troca de página volta ao topo; em links com "#seção", vai até a seção. */
function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) {
      lenis ? lenis.scrollTo(0, { immediate: true }) : window.scrollTo(0, 0);
      return;
    }
    // páginas internas carregam sob demanda: espera a seção existir (até ~3 s) antes de rolar
    let tries = 0;
    let t = 0;
    let ro: ResizeObserver | null = null;
    const scrollTo = (el: HTMLElement) => (lenis ? lenis.scrollTo(el, { offset: HEADER_OFFSET }) : el.scrollIntoView());
    // blocos que montam depois (globo, Wi-Fi 6, mapa) mudam a altura da página: durante ~3 s
    // o destino é recalculado a cada mudança, até a pessoa rolar por conta própria
    const stop = () => {
      ro?.disconnect();
      ro = null;
      ["wheel", "touchstart", "keydown"].forEach((ev) => window.removeEventListener(ev, stop));
    };
    const go = () => {
      const el = document.querySelector<HTMLElement>(hash);
      if (!el) {
        if (tries++ < 30) t = window.setTimeout(go, 100);
        return;
      }
      scrollTo(el);
      ro = new ResizeObserver(() => scrollTo(el));
      ro.observe(document.body);
      ["wheel", "touchstart", "keydown"].forEach((ev) => window.addEventListener(ev, stop, { passive: true }));
      t = window.setTimeout(stop, 3000);
    };
    t = window.setTimeout(go, 150);
    return () => {
      window.clearTimeout(t);
      stop();
    };
  }, [pathname, hash]);
  return null;
}

function Layout() {
  useSmoothScroll();
  return (
    <div id="top" className="relative isolate min-h-screen bg-[#EFF3F9]">
      <ScrollManager />
      <PageCurtain />
      <Header />
      <FiberTube />
      <main id="conteudo" tabIndex={-1} className="relative z-10 outline-none">
        <Suspense fallback={<div className="min-h-screen" aria-busy="true" />}>
          <Outlet />
        </Suspense>
      </main>
      <div className="relative z-10">
        <Footer />
      </div>
      <BackToTop />
      <WhatsAppButton />
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="internet" element={<Internet />} />
        <Route path="tv" element={<Tv />} />
        <Route path="telefone-fixo" element={<Fixo />} />
        <Route path="movel" element={<Movel />} />
        <Route path="entretenimento" element={<Entretenimento />} />
        <Route path="teste-de-velocidade" element={<Velocidade />} />
        <Route path="cobertura" element={<Cobertura />} />
        <Route path="suporte" element={<Suporte />} />
        <Route path="fale-conosco" element={<FaleConosco />} />
        <Route path="eventos" element={<Eventos />} />
        <Route path="avaliacoes" element={<Avaliacoes />} />
        <Route path="monte-seu-combo" element={<Combo />} />
        <Route path="reel" element={<ReelUnfold />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
