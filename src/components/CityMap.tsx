import { useEffect, useRef, useState } from "react";
import { ExternalLink, MapPin, RotateCcw } from "lucide-react";
import { CITY_CENTER, STORES } from "../data/inet";
import "leaflet/dist/leaflet.css";

/**
 * Mapa interativo de Teófilo Otoni (Leaflet + OpenStreetMap).
 * Mostra só o que é confirmado: a cidade e as lojas da INET. Não representa
 * área de cobertura técnica. O Leaflet é carregado só quando o mapa aparece.
 */
export default function CityMap({ className = "h-[60vh] min-h-[380px]" }: { className?: string }) {
  const boxRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<import("leaflet").Map | null>(null);
  const markers = useRef<import("leaflet").Marker[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const [active, setActive] = useState(0);

  useEffect(() => {
    const el = boxRef.current!;
    let cancelled = false;
    const io = new IntersectionObserver(async ([e]) => {
      if (!e.isIntersecting || mapRef.current) return;
      io.disconnect();
      setStatus("loading");
      try {
        const L = (await import("leaflet")).default;
        if (cancelled) return;
        const map = L.map(el, { center: CITY_CENTER, zoom: 14, scrollWheelZoom: false, zoomControl: true, attributionControl: true });
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19,
          className: "inet-tiles",
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        })
          .on("tileerror", () => setStatus((s) => (s === "ready" ? s : "error")))
          .on("load", () => setStatus("ready"))
          .addTo(map);
        const icon = L.divIcon({ className: "", html: '<span class="inet-pin"></span>', iconSize: [16, 16], iconAnchor: [8, 8] });
        markers.current = STORES.map((s, i) =>
          L.marker([s.lat, s.lng], { icon, title: s.name, keyboard: true })
            .addTo(map)
            .bindPopup(`<strong>${s.name}</strong><br/>${s.address}<br/><a href="${s.maps}" target="_blank" rel="noreferrer">Como chegar</a>`)
            .on("click", () => setActive(i)),
        );
        // rolar a página não dá zoom sem querer: o zoom pela roda só liga após clicar no mapa
        map.on("click", () => map.scrollWheelZoom.enable());
        map.on("mouseout", () => map.scrollWheelZoom.disable());
        mapRef.current = map;
      } catch {
        setStatus("error");
      }
    }, { rootMargin: "200px" });
    io.observe(el);
    return () => {
      cancelled = true;
      io.disconnect();
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  const focus = (i: number) => {
    setActive(i);
    const s = STORES[i];
    mapRef.current?.flyTo([s.lat, s.lng], 16, { duration: 1.2 });
    markers.current[i]?.openPopup();
  };

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
      <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10">
        <div ref={boxRef} className={`${className} w-full`} role="region" aria-label="Mapa de Teófilo Otoni com as lojas da INET" />
        {status !== "ready" && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-navy-ink/70 text-sm text-white/60">
            {status === "error" ? "Não foi possível carregar o mapa agora. Use os links das lojas ao lado." : "Carregando mapa…"}
          </div>
        )}
        <button
          onClick={() => mapRef.current?.flyTo(CITY_CENTER, 14, { duration: 1.2 })}
          className="absolute bottom-4 right-4 z-[500] flex h-11 items-center gap-2 rounded-full border border-white/15 bg-navy-ink/85 px-4 text-xs backdrop-blur transition-colors duration-500 hover:border-lime hover:text-lime"
        >
          <RotateCcw size={14} aria-hidden="true" /> Centralizar
        </button>
      </div>

      <ul className="grid content-start gap-3 sm:grid-cols-3 lg:grid-cols-1">
        {STORES.map((s, i) => (
          <li key={s.name}>
            <div className={`card p-5 ${active === i ? "border-lime/50" : ""}`}>
              <button onClick={() => focus(i)} className="flex w-full items-start gap-3 text-left">
                <MapPin size={18} aria-hidden="true" className="mt-0.5 shrink-0 text-lime" />
                <span>
                  <span className="block font-display text-lg">{s.name}</span>
                  <span className="block text-sm text-white/60">{s.address}</span>
                </span>
              </button>
              <a href={s.maps} target="_blank" rel="noreferrer" className="card-link mt-3">
                Como chegar <ExternalLink size={13} aria-hidden="true" />
              </a>
            </div>
          </li>
        ))}
        <li>
          <a
            href="https://www.openstreetmap.org/?mlat=-17.8595&mlon=-41.5087#map=14/-17.8595/-41.5087"
            target="_blank"
            rel="noreferrer"
            className="card-link px-1"
          >
            Abrir Teófilo Otoni no mapa <ExternalLink size={13} aria-hidden="true" />
          </a>
        </li>
      </ul>
    </div>
  );
}
