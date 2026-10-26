import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Film, MoveHorizontal, ListPlus, ListChecks, Loader2, Mail, MessageCircle, Play, Search, Star, Tv as TvIcon, X } from "lucide-react";
import Lines, { Rise, Fit } from "./Lines";
import { DUR, EASE, STAGGER } from "../motion";
import { waLink } from "../data/inet";

const KEY = import.meta.env.VITE_TMDB_KEY;
const API = "https://api.themoviedb.org/3";
const IMG = "https://image.tmdb.org/t/p";
const LIST_KEY = "inet-tv-pedidos";
const SUPPORT_EMAIL = "suporte@inetminas.com.br";

type Kind = "movie" | "tv";
type Title = {
  id: number;
  media_type: Kind;
  title: string;
  year: string;
  overview: string;
  rating: number;
  poster: string | null;
  backdrop: string | null;
};
type Detail = { genres: string[]; overview: string; trailer: string | null; runtime: string | null };

type Raw = {
  id: number;
  media_type?: string;
  title?: string;
  name?: string;
  release_date?: string;
  first_air_date?: string;
  overview?: string;
  vote_average?: number;
  poster_path?: string | null;
  backdrop_path?: string | null;
};

async function tmdb<T>(path: string, params: Record<string, string> = {}, signal?: AbortSignal): Promise<T> {
  const q = new URLSearchParams({ api_key: KEY ?? "", language: "pt-BR", region: "BR", ...params });
  const res = await fetch(`${API}${path}?${q}`, { signal });
  if (!res.ok) throw new Error(`TMDB ${res.status}`);
  return res.json() as Promise<T>;
}

function toTitle(r: Raw, fallback: Kind): Title {
  const kind = (r.media_type === "tv" || r.media_type === "movie" ? r.media_type : fallback) as Kind;
  return {
    id: r.id,
    media_type: kind,
    title: r.title ?? r.name ?? "Sem título",
    year: (r.release_date ?? r.first_air_date ?? "").slice(0, 4),
    overview: r.overview ?? "",
    rating: r.vote_average ?? 0,
    poster: r.poster_path ?? null,
    backdrop: r.backdrop_path ?? null,
  };
}

/** Lista de títulos pedidos para o INET TV, guardada no navegador (falha em silêncio se o armazenamento estiver bloqueado). */
function useWatchlist() {
  const [list, setList] = useState<Title[]>(() => {
    try {
      const raw = localStorage.getItem(LIST_KEY);
      return raw ? (JSON.parse(raw) as Title[]) : [];
    } catch {
      return [];
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(LIST_KEY, JSON.stringify(list));
    } catch {
      /* armazenamento indisponível: a lista vale só nesta visita */
    }
  }, [list]);
  const has = useCallback((t: Title) => list.some((x) => x.id === t.id && x.media_type === t.media_type), [list]);
  const toggle = useCallback((t: Title) => {
    setList((l) => (l.some((x) => x.id === t.id && x.media_type === t.media_type) ? l.filter((x) => !(x.id === t.id && x.media_type === t.media_type)) : [t, ...l]));
  }, []);
  return { list, has, toggle };
}

function Rating({ value }: { value: number }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5 text-xs font-semibold text-white backdrop-blur">
      <Star size={12} aria-hidden="true" className="fill-lime text-lime" />
      {value ? value.toFixed(1) : "–"}
    </span>
  );
}

function Poster({ t, className = "" }: { t: Title; className?: string }) {
  return t.poster ? (
    <img src={`${IMG}/w342${t.poster}`} alt="" loading="lazy" decoding="async" className={`h-full w-full object-cover ${className}`} />
  ) : (
    <div className={`flex h-full w-full items-center justify-center bg-[#020F2E] text-white/30 ${className}`}>
      {t.media_type === "tv" ? <TvIcon size={32} aria-hidden="true" /> : <Film size={32} aria-hidden="true" />}
    </div>
  );
}

function Skeletons({ n, className }: { n: number; className: string }) {
  return (
    <>
      {Array.from({ length: n }, (_, i) => (
        <div key={i} className={`animate-pulse rounded-2xl bg-white/[0.05] ${className}`} />
      ))}
    </>
  );
}

function ErrorBox({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="card flex flex-wrap items-center justify-between gap-4 p-6 text-sm text-white/70">
      Não foi possível carregar os títulos agora.
      <button onClick={onRetry} className="btn-ghost">Tentar de novo</button>
    </div>
  );
}

/* ---------------- Bloco A: sugestões da semana ---------------- */

function Weekly({ onOpen }: { onOpen: (t: Title) => void }) {
  const [tab, setTab] = useState<Kind>("movie");
  const [data, setData] = useState<Partial<Record<Kind, Title[]>>>({});
  const [error, setError] = useState(false);
  const [nonce, setNonce] = useState(0);
  const rail = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (data[tab]) return;
    const ctrl = new AbortController();
    setError(false);
    tmdb<{ results: Raw[] }>(`/trending/${tab}/week`, {}, ctrl.signal)
      .then((r) => setData((d) => ({ ...d, [tab]: r.results.map((x) => toTitle(x, tab)) })))
      .catch((e) => { if (e.name !== "AbortError") setError(true); });
    return () => ctrl.abort();
  }, [tab, nonce, data]);

  useEffect(() => { rail.current?.scrollTo({ left: 0 }); }, [tab]);

  const items = data[tab];
  const drag = useDragScroll(rail);
  const scroll = (dir: 1 | -1) => {
    const el = rail.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  };

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <Rise><Fit className="tag">Sugestões da semana</Fit></Rise>
          <Lines className="h-lg mt-4 max-w-4xl" lines={["O que está em alta", <span className="italic text-lime">para assistir hoje.</span>]} />
        </div>
        <Rise delay={0.15} className="flex items-center gap-3">
          <div role="tablist" aria-label="Tipo de título" className="flex rounded-full border border-white/15 bg-white/[0.03] p-1">
            {(["movie", "tv"] as Kind[]).map((k) => (
              <button
                key={k}
                role="tab"
                aria-selected={tab === k}
                onClick={() => setTab(k)}
                className={`relative min-h-[40px] rounded-full px-5 text-sm font-semibold transition-colors duration-500 ${tab === k ? "text-navy-ink" : "text-white/70 hover:text-white"}`}
              >
                {tab === k && <motion.span layoutId="tmdb-tab" className="absolute inset-0 rounded-full bg-lime" transition={{ duration: DUR * 0.5, ease: EASE }} />}
                <span className="relative">{k === "movie" ? "Filmes" : "Séries"}</span>
              </button>
            ))}
          </div>
          <div className="hidden gap-2 sm:flex">
            <button onClick={() => scroll(-1)} aria-label="Anteriores" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/80 transition-colors hover:border-lime hover:text-lime"><ChevronLeft size={18} /></button>
            <button onClick={() => scroll(1)} aria-label="Próximos" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/80 transition-colors hover:border-lime hover:text-lime"><ChevronRight size={18} /></button>
          </div>
        </Rise>
      </div>

      <div className="mt-10">
        {error ? (
          <ErrorBox onRetry={() => setNonce((n) => n + 1)} />
        ) : (
          <div ref={rail} {...drag.handlers} className={`-mx-5 flex gap-4 overflow-x-auto px-5 pb-4 scroll-px-5 sm:scroll-px-10 lg:scroll-px-16 ${drag.dragging ? "cursor-grabbing select-none" : "cursor-grab snap-x snap-mandatory scroll-smooth"} [scrollbar-width:none] sm:-mx-10 sm:px-10 lg:-mx-16 lg:px-16 [&::-webkit-scrollbar]:hidden`}>
            {!items ? (
              <Skeletons n={6} className="aspect-[2/3] w-[calc((100%-1rem)/2)] shrink-0 sm:w-[200px]" />
            ) : items.length === 0 ? (
              <p className="text-sm text-white/55">Nenhum título em alta nesta semana.</p>
            ) : (
              items.map((t, i) => (
                <motion.button
                  key={`${tab}-${t.id}`}
                  onClick={() => !drag.moved() && onOpen(t)}
                  draggable={false}
                  initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ duration: DUR, ease: EASE, delay: Math.min(i, 8) * STAGGER * 0.6 }}
                  className="group relative aspect-[2/3] w-[calc((100%-1rem)/2)] shrink-0 snap-start overflow-hidden rounded-2xl border border-white/10 bg-[#020F2E] text-left focus-visible:outline-offset-4 sm:w-[200px]"
                  aria-label={`${t.title}${t.year ? ` (${t.year})` : ""}: ver detalhes`}
                >
                  <Poster t={t} className="transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06] group-focus-visible:scale-[1.06]" />
                  <span className="absolute left-2.5 top-2.5"><Rating value={t.rating} /></span>
                  <span className="absolute left-2.5 top-9 font-display text-[11px] text-white/80 [text-shadow:0_1px_6px_#000]">{String(i + 1).padStart(2, "0")}</span>
                  {/* sinopse no hover/foco */}
                  <span className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-[#010818] via-[#010818]/85 to-transparent p-4 opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100">
                    <span className="font-display text-base leading-tight">{t.title}</span>
                    <span className="mt-0.5 text-xs text-lime">{t.year || "—"}</span>
                    <span className="mt-2 line-clamp-4 text-xs leading-relaxed text-white/70">{t.overview || "Sinopse indisponível em português."}</span>
                  </span>
                </motion.button>
              ))
            )}
          </div>
        )}
        {items && items.length > 2 && (
          <div className="mt-3 flex items-center gap-4">
            <span className="flex shrink-0 items-center gap-2 text-xs text-white/60">
              <MoveHorizontal size={16} aria-hidden="true" className="animate-[drag-hint_2.4s_ease-in-out_infinite] text-lime motion-reduce:animate-none" />
              Arraste para ver mais
            </span>
            <span className="relative h-[3px] flex-1 overflow-hidden rounded-full bg-white/10" aria-hidden="true">
              <span className="absolute inset-y-0 left-0 rounded-full bg-lime transition-[width] duration-300" style={{ width: `${Math.max(8, drag.progress * 100)}%` }} />
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------------- Bloco B: pedidos de conteúdo para o INET TV ---------------- */

const label = (t: Title) => `${t.title}${t.year ? ` (${t.year})` : ""} – ${t.media_type === "tv" ? "série" : "filme"}`;

function requestText(list: Title[]) {
  return `Olá, suporte INET! Gostaria de sugerir estes títulos para o INET TV:\n\n${list.map((t, i) => `${i + 1}. ${label(t)}`).join("\n")}\n\nObrigado!`;
}

function Finder({ onOpen, watch }: { onOpen: (t: Title) => void; watch: ReturnType<typeof useWatchlist> }) {
  const [query, setQuery] = useState("");
  const [term, setTerm] = useState("");
  const [results, setResults] = useState<Title[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [nonce, setNonce] = useState(0);

  // debounce de 400 ms
  useEffect(() => {
    const t = window.setTimeout(() => setTerm(query.trim()), 400);
    return () => window.clearTimeout(t);
  }, [query]);

  useEffect(() => {
    if (term.length < 2) { setResults(null); setError(false); return; }
    const ctrl = new AbortController();
    setLoading(true);
    setError(false);
    tmdb<{ results: Raw[] }>("/search/multi", { query: term, include_adult: "false" }, ctrl.signal)
      .then((r) => setResults(r.results.filter((x) => x.media_type === "movie" || x.media_type === "tv").slice(0, 12).map((x) => toTitle(x, "movie"))))
      .catch((e) => { if (e.name !== "AbortError") setError(true); })
      .finally(() => { if (!ctrl.signal.aborted) setLoading(false); });
    return () => ctrl.abort();
  }, [term, nonce]);

  return (
    <div>
      <Rise><Fit className="tag">Sugira um título</Fit></Rise>
      <Lines className="h-lg mt-4 max-w-4xl" lines={["O que você gostaria de", <span className="italic text-lime">adicionar no nosso INET TV?</span>]} />
      <Rise delay={0.1}>
        <p className="lead mt-5 max-w-2xl">
          Busque filmes e séries, monte sua lista e envie. O pedido vai direto para o setor de suporte da INET. Se preferir, fale com o <Link to="/suporte" className="text-lime underline-offset-4 hover:underline">suporte</Link>.
        </p>
      </Rise>

      <Rise delay={0.15} className="mt-8">
        <label className="relative block max-w-2xl">
          <span className="sr-only">Buscar filme ou série</span>
          <Search size={20} aria-hidden="true" className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-white/45" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Busque um filme ou uma série"
            className="h-14 w-full rounded-full border border-white/15 bg-[#020F2E] pl-14 pr-12 text-base text-white placeholder:text-white/40 transition-colors duration-500 focus:border-lime focus:outline-none"
          />
          {loading && <Loader2 size={18} aria-hidden="true" className="absolute right-5 top-1/2 -translate-y-1/2 animate-spin text-lime" />}
        </label>
      </Rise>

      <div className="mt-8" aria-live="polite">
        {error ? (
          <ErrorBox onRetry={() => setNonce((n) => n + 1)} />
        ) : results === null ? null : results.length === 0 && !loading ? (
          <p className="text-sm text-white/55">Nada encontrado para “{term}”. Tente outro nome.</p>
        ) : (
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {results.map((t, i) => {
              const saved = watch.has(t);
              return (
                <motion.li key={`${t.media_type}-${t.id}`} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: DUR * 0.8, ease: EASE, delay: i * 0.03 }} className="flex flex-col">
                  <button onClick={() => onOpen(t)} className="group relative aspect-[2/3] overflow-hidden rounded-2xl border border-white/10 focus-visible:outline-offset-4" aria-label={`${t.title}: ver detalhes`}>
                    <Poster t={t} className="transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]" />
                    <span className="absolute left-2 top-2"><Rating value={t.rating} /></span>
                    <span className="absolute right-2 top-2 rounded-full bg-black/60 px-2 py-0.5 text-[10px] uppercase tracking-[0.14em] text-white/80">{t.media_type === "tv" ? "Série" : "Filme"}</span>
                  </button>
                  <p className="mt-2 line-clamp-1 text-sm font-semibold">{t.title}</p>
                  <p className="text-xs text-white/50">{t.year || "—"}</p>
                  <button
                    onClick={() => watch.toggle(t)}
                    aria-pressed={saved}
                    className={`mt-2 inline-flex min-h-[40px] items-center justify-center gap-1.5 rounded-full border px-3 text-xs font-semibold transition-colors duration-500 ${saved ? "border-lime bg-lime text-navy-ink" : "border-white/20 text-white hover:border-lime hover:text-lime"}`}
                  >
                    {saved ? <ListChecks size={14} aria-hidden="true" /> : <ListPlus size={14} aria-hidden="true" />}
                    {saved ? "No pedido" : "Adicionar ao pedido"}
                  </button>
                </motion.li>
              );
            })}
          </ul>
        )}
      </div>

      {/* lista de pedidos */}
      <div className="card mt-12 p-6 sm:p-8">
        <h3 className="flex items-center gap-2 font-display text-xl">
          <ListChecks size={20} aria-hidden="true" className="text-lime" /> Seu pedido
          <span className="text-sm text-white/45">({watch.list.length})</span>
        </h3>
        {watch.list.length === 0 ? (
          <p className="mt-3 text-sm text-white/50">Ainda vazio. Busque um título acima e toque em “Adicionar ao pedido”.</p>
        ) : (
          <>
            <ul className="mt-5 flex flex-wrap gap-3">
              <AnimatePresence initial={false}>
                {watch.list.map((t) => (
                  <motion.li key={`${t.media_type}-${t.id}`} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.5, ease: EASE }} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#010C22] p-2 pr-3">
                    <button onClick={() => onOpen(t)} className="flex items-center gap-3 text-left">
                      <span className="block h-14 w-10 overflow-hidden rounded-lg"><Poster t={t} /></span>
                      <span>
                        <span className="block max-w-[180px] truncate text-sm font-semibold">{t.title}</span>
                        <span className="block text-xs text-white/50">{t.media_type === "tv" ? "Série" : "Filme"} · {t.year || "—"}</span>
                      </span>
                    </button>
                    <button onClick={() => watch.toggle(t)} aria-label={`Remover ${t.title} do pedido`} className="flex h-8 w-8 items-center justify-center rounded-full text-white/50 transition-colors hover:bg-white/10 hover:text-white"><X size={16} /></button>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href={waLink(requestText(watch.list))} target="_blank" rel="noreferrer" className="btn-lime">
                <MessageCircle size={16} aria-hidden="true" /> Enviar sugestão ao suporte
              </a>
              <a
                href={`mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent("Sugestão de conteúdo INET TV")}&body=${encodeURIComponent(requestText(watch.list))}`}
                className="btn-ghost"
              >
                <Mail size={16} aria-hidden="true" /> Enviar por e-mail
              </a>
            </div>
            <p className="mt-4 text-xs text-white/45">O WhatsApp ou o e-mail abre com a lista pronta; é só confirmar o envio. Os pedidos são avaliados pela equipe e não garantem a inclusão do título.</p>
          </>
        )}
      </div>
    </div>
  );
}

/* ---------------- Painel de detalhes ---------------- */

function DetailPanel({ t, onClose, watch }: { t: Title; onClose: () => void; watch: ReturnType<typeof useWatchlist> }) {
  const [detail, setDetail] = useState<Detail | null>(null);
  const [error, setError] = useState(false);
  const [play, setPlay] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => { window.removeEventListener("keydown", onKey); prev?.focus(); };
  }, [onClose]);

  useEffect(() => {
    const ctrl = new AbortController();
    type V = { results: { site: string; type: string; key: string; official?: boolean }[] };
    const pickTrailer = (v: V) => {
      const yt = v.results.filter((x) => x.site === "YouTube");
      return (yt.find((x) => x.type === "Trailer" && x.official) ?? yt.find((x) => x.type === "Trailer") ?? yt.find((x) => x.type === "Teaser"))?.key ?? null;
    };
    (async () => {
      try {
        const [info, vids] = await Promise.all([
          tmdb<{ genres?: { name: string }[]; overview?: string; runtime?: number; number_of_seasons?: number }>(`/${t.media_type}/${t.id}`, {}, ctrl.signal),
          tmdb<V>(`/${t.media_type}/${t.id}/videos`, {}, ctrl.signal),
        ]);
        let trailer = pickTrailer(vids);
        // sem trailer em português: tenta o original em inglês
        if (!trailer) trailer = pickTrailer(await tmdb<V>(`/${t.media_type}/${t.id}/videos`, { language: "en-US" }, ctrl.signal));
        const runtime = info.runtime ? `${Math.floor(info.runtime / 60)}h ${info.runtime % 60}min` : info.number_of_seasons ? `${info.number_of_seasons} temporada${info.number_of_seasons > 1 ? "s" : ""}` : null;
        setDetail({ genres: (info.genres ?? []).map((g) => g.name), overview: info.overview || t.overview, trailer, runtime });
      } catch (e) {
        if ((e as Error).name !== "AbortError") setError(true);
      }
    })();
    return () => ctrl.abort();
  }, [t]);

  const saved = watch.has(t);

  return (
    <motion.div
      className="fixed inset-0 z-[80] flex items-end justify-center bg-[#010818]/80 p-0 backdrop-blur-md sm:items-center sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: EASE }}
      onClick={onClose}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="tmdb-detail-title"
        data-lenis-prevent
        onClick={(e) => e.stopPropagation()}
        initial={{ y: 60, opacity: 0, scale: 0.98 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 40, opacity: 0 }}
        transition={{ duration: DUR * 0.7, ease: EASE }}
        className="relative max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-t-[2rem] border border-white/10 bg-[#020F2E] shadow-[0_40px_120px_-30px_#000] sm:rounded-[2rem]"
      >
        <div className="relative aspect-video w-full overflow-hidden bg-black">
          {play && detail?.trailer ? (
            <iframe
              className="absolute inset-0 h-full w-full"
              src={`https://www.youtube-nocookie.com/embed/${detail.trailer}?autoplay=1&rel=0`}
              title={`Trailer de ${t.title}`}
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
              allowFullScreen
            />
          ) : (
            <>
              {t.backdrop && <img src={`${IMG}/w1280${t.backdrop}`} alt="" className="h-full w-full object-cover" />}
              <div className="absolute inset-0 bg-gradient-to-t from-[#020F2E] via-[#020F2E]/30 to-transparent" />
              {detail?.trailer && (
                <button onClick={() => setPlay(true)} className="btn-lime absolute bottom-5 left-6 sm:left-8">
                  <Play size={16} aria-hidden="true" className="fill-current" /> Ver trailer
                </button>
              )}
            </>
          )}
        </div>
        <button ref={closeRef} onClick={onClose} aria-label="Fechar" className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur transition-colors hover:bg-black/80"><X size={18} /></button>

        <div className="p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-3 text-xs text-white/60">
            <Rating value={t.rating} />
            <span className="uppercase tracking-[0.18em]">{t.media_type === "tv" ? "Série" : "Filme"}</span>
            {t.year && <span>{t.year}</span>}
            {detail?.runtime && <span>{detail.runtime}</span>}
          </div>
          <h3 id="tmdb-detail-title" className="mt-3 font-display text-3xl font-light sm:text-4xl">{t.title}</h3>
          {detail && detail.genres.length > 0 && (
            <ul className="mt-4 flex flex-wrap gap-2">
              {detail.genres.map((g) => <li key={g} className="rounded-full border border-white/15 px-3 py-1 text-xs text-white/75">{g}</li>)}
            </ul>
          )}
          <p className="mt-5 text-sm leading-relaxed text-white/75 sm:text-base">
            {error ? t.overview || "Não foi possível carregar os detalhes." : detail ? detail.overview || "Sinopse indisponível em português." : <span className="inline-flex items-center gap-2 text-white/50"><Loader2 size={16} className="animate-spin" /> Carregando detalhes…</span>}
          </p>
          {detail && !detail.trailer && <p className="mt-3 text-xs text-white/45">Trailer indisponível para este título.</p>}
          <button
            onClick={() => watch.toggle(t)}
            aria-pressed={saved}
            className={`mt-7 ${saved ? "btn-lime" : "btn-ghost"}`}
          >
            {saved ? <ListChecks size={16} aria-hidden="true" /> : <ListPlus size={16} aria-hidden="true" />}
            {saved ? "No pedido" : "Adicionar ao pedido"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ---------------- Seção ---------------- */

/** Sugestões da semana e busca de filmes/séries com dados do TMDB (página INET TV). */
export default function TmdbWeekly({ id = "sugestoes" }: { id?: string }) {
  const watch = useWatchlist();
  const [open, setOpen] = useState<Title | null>(null);
  const close = useCallback(() => setOpen(null), []);

  if (!KEY) {
    return (
      <section id={id} className="py-10">
        <div className="wrap">
          <p className="text-xs text-white/40">As sugestões de filmes e séries estão indisponíveis no momento.</p>
        </div>
      </section>
    );
  }

  return (
    <section id={id} className="relative overflow-hidden py-20 sm:py-28">
      <div aria-hidden="true" className="pointer-events-none absolute -right-40 top-0 h-[480px] w-[480px] rounded-full bg-[#021A4A]/50 blur-[130px]" />
      <div className="wrap relative">
        <Weekly onOpen={setOpen} />
        <div className="my-20 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent sm:my-28" />
        <Finder onOpen={setOpen} watch={watch} />

        {/* atribuição mínima exigida pelos termos da API do TMDB */}
        <p className="mt-10 text-[10px] text-white/25">Dados: <a href="https://www.themoviedb.org" target="_blank" rel="noreferrer" className="hover:text-white/50">TMDB</a></p>
      </div>

      {/* portal: o painel fica fora de qualquer ancestral com transform */}
      {createPortal(
        <AnimatePresence>{open && <DetailPanel key={`${open.media_type}-${open.id}`} t={open} onClose={close} watch={watch} />}</AnimatePresence>,
        document.body,
      )}
    </section>
  );
}

/**
 * Arrastar o trilho com o mouse (no toque o navegador já rola sozinho).
 * Também informa o progresso da rolagem para a barrinha abaixo dos cards.
 */
function useDragScroll(ref: React.RefObject<HTMLDivElement>) {
  const [dragging, setDragging] = useState(false);
  const [progress, setProgress] = useState(0);
  const start = useRef({ x: 0, left: 0, moved: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => setProgress(el.scrollWidth > el.clientWidth ? (el.scrollLeft + el.clientWidth) / el.scrollWidth : 1);
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  });

  const handlers = {
    onPointerDown: (e: React.PointerEvent<HTMLDivElement>) => {
      start.current.moved = 0;
      if (e.pointerType !== "mouse" || e.button !== 0 || !ref.current) return;
      start.current = { x: e.clientX, left: ref.current.scrollLeft, moved: 0 };
      setDragging(true);
    },
    onPointerMove: (e: React.PointerEvent<HTMLDivElement>) => {
      if (!dragging || !ref.current) return;
      const dx = e.clientX - start.current.x;
      start.current.moved = Math.max(start.current.moved, Math.abs(dx));
      if (start.current.moved > 4) ref.current.setPointerCapture(e.pointerId);
      ref.current.scrollLeft = start.current.left - dx;
    },
    onPointerUp: () => setDragging(false),
    onPointerCancel: () => setDragging(false),
    onPointerLeave: () => setDragging(false),
  };

  // um clique só abre o título se o mouse quase não se mexeu
  return { handlers, dragging, progress, moved: () => start.current.moved > 6 };
}
