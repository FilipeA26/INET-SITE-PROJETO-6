import { useEffect, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ChevronDown, type LucideIcon } from "lucide-react";
import Lines, { Rise, Fit } from "./Lines";
import { DUR, EASE } from "../motion";

const BASE = "INET – Internet Fibra Óptica em Teófilo Otoni";

/** Título e descrição por página (SEO). */
export function usePageMeta(title: string, description: string) {
  useEffect(() => {
    document.title = title ? `${title} | INET Teófilo Otoni` : BASE;
    document.querySelector('meta[name="description"]')?.setAttribute("content", description);
    document.querySelector('meta[property="og:title"]')?.setAttribute("content", document.title);
    document.querySelector('meta[property="og:description"]')?.setAttribute("content", description);
  }, [title, description]);
}

/** Cabeçalho padrão das páginas internas, com uma aura de fibra ao fundo. */
export function PageHero({ tag, title, lead, children }: { tag: string; title: ReactNode[]; lead: string; children?: ReactNode }) {
  return (
    <section className="relative overflow-hidden pb-16 pt-36 sm:pt-44">
      <div aria-hidden="true" className="pointer-events-none absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full bg-electric/10 blur-[120px]" />
      <div aria-hidden="true" className="pointer-events-none absolute -left-32 top-40 h-[360px] w-[360px] rounded-full bg-lime/10 blur-[110px]" />
      <div className="wrap relative">
        <Rise><Fit className="tag">{tag}</Fit></Rise>
        <Lines as="h1" className="h-xl mt-5 max-w-5xl" lines={title} />
        <Rise delay={0.3}><p className="lead mt-6 max-w-2xl">{lead}</p></Rise>
        {children && <Rise delay={0.45} className="mt-9 flex flex-wrap gap-3">{children}</Rise>}
      </div>
    </section>
  );
}

export function Section({ id, tag, title, lead, children, className = "" }: { id?: string; tag?: string; title?: ReactNode[]; lead?: string; children: ReactNode; className?: string }) {
  return (
    <section id={id} className={`relative py-20 sm:py-28 ${className}`}>
      <div className="wrap">
        {tag && <Rise><Fit className="tag">{tag}</Fit></Rise>}
        {title && <Lines className="h-lg mt-4 max-w-4xl" lines={title} />}
        {lead && <Rise delay={0.2}><p className="lead mt-5 max-w-2xl">{lead}</p></Rise>}
        <div className={title || lead ? "mt-12" : ""}>{children}</div>
      </div>
    </section>
  );
}

/** Card de recurso com ícone (benefícios, características). */
export function FeatureCard({ icon: Icon, title, text, delay = 0 }: { icon: LucideIcon; title: string; text: string; delay?: number }) {
  return (
    <Rise delay={delay} className="h-full">
      <div className="card h-full p-7">
        <span className="card-icon flex h-12 w-12 items-center justify-center rounded-2xl bg-electric/20 text-lime">
          <Icon size={22} aria-hidden="true" />
        </span>
        <h3 className="mt-6 font-display text-xl">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-white/65">{text}</p>
      </div>
    </Rise>
  );
}

/** Card de navegação para um produto/página. */
export function LinkCard({ to, icon: Icon, title, text, cta = "Conhecer", tone = "#0062EC", delay = 0 }: { to: string; icon: LucideIcon; title: string; text: string; cta?: string; tone?: string; delay?: number }) {
  return (
    <Rise delay={delay} className="h-full">
      <Link to={to} className="card group flex h-full min-h-[240px] flex-col p-7 focus-visible:outline-offset-4">
        <div aria-hidden="true" className="card-media" style={{ background: `radial-gradient(120% 90% at 100% 0%, ${tone}55, transparent 60%)` }} />
        <span className="card-icon relative flex h-12 w-12 items-center justify-center rounded-2xl border border-white/15 bg-white/5 text-lime">
          <Icon size={22} aria-hidden="true" />
        </span>
        <h3 className="relative mt-auto pt-10 font-display text-2xl">{title}</h3>
        <p className="relative mt-2 text-sm text-white/65">{text}</p>
        <span className="card-link relative mt-5">{cta} <ArrowRight size={15} aria-hidden="true" /></span>
      </Link>
    </Rise>
  );
}

export type QA = { q: string; a: ReactNode };

/** Perguntas frequentes acessíveis (botão + região), com altura animada. */
export function Faq({ items }: { items: QA[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="divide-y divide-white/10 border-y border-white/10">
      {items.map((it, i) => {
        const isOpen = open === i;
        return (
          <div key={it.q}>
            <h3>
              <button
                id={`faq-q-${i}`}
                aria-expanded={isOpen}
                aria-controls={`faq-a-${i}`}
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex min-h-[56px] w-full items-center justify-between gap-6 py-5 text-left font-display text-lg transition-colors duration-500 hover:text-lime sm:text-xl"
              >
                {it.q}
                <ChevronDown aria-hidden="true" className={`shrink-0 text-lime transition-transform duration-700 ${isOpen ? "rotate-180" : ""}`} />
              </button>
            </h3>
            <motion.div
              id={`faq-a-${i}`}
              role="region"
              aria-labelledby={`faq-q-${i}`}
              initial={false}
              animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
              transition={{ duration: DUR * 0.6, ease: EASE }}
              className="overflow-hidden"
            >
              <div className="pb-6 text-white/70">{it.a}</div>
            </motion.div>
          </div>
        );
      })}
    </div>
  );
}

/** Faixa de chamada para ação no fim das páginas. */
export function CtaBand({ title, text, children }: { title: ReactNode[]; text: string; children: ReactNode }) {
  return (
    <section className="py-20 sm:py-28">
      <div className="wrap">
        <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,#021A4A,#010C22_60%)] p-8 sm:p-14">
          <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-lime/15 blur-[90px]" />
          <Lines className="h-lg relative max-w-3xl" lines={title} />
          <Rise delay={0.2}><p className="lead relative mt-5 max-w-xl">{text}</p></Rise>
          <Rise delay={0.35} className="relative mt-8 flex flex-wrap gap-3">{children}</Rise>
        </div>
      </div>
    </section>
  );
}

/** Aviso discreto para conteúdo que a empresa precisa confirmar. */
export function Note({ children }: { children: ReactNode }) {
  return <p className="mt-6 text-xs leading-relaxed text-white/45">{children}</p>;
}
