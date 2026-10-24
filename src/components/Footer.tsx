import { Link } from "react-router-dom";
import { ArrowUp, Facebook, Instagram, MapPin, Phone, Youtube } from "lucide-react";
import { COMPANY, PHONES, SOCIAL, STORES } from "../data/inet";
import { SERVICES } from "./Header";

const icons = { Instagram, Facebook, YouTube: Youtube } as const;

export default function Footer() {
  return (
    <footer className="relative border-t border-white/10 bg-navy-ink">
      <div className="wrap py-16">
        <div className="flex flex-col items-start justify-between gap-6 border-b border-white/10 pb-12 sm:flex-row sm:items-center">
          <img src="/inet-logo-branca.png" alt="INET Internet Fibra Óptica" width={120} height={42} className="h-10 w-auto" />
          <a href="#top" className="group inline-flex items-center gap-3 text-sm text-white/70 transition-colors duration-500 hover:text-white">
            Voltar ao início
            <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 transition-[transform,border-color,background-color,color] duration-700 group-hover:-translate-y-1 group-hover:border-lime group-hover:bg-lime group-hover:text-navy-ink">
              <ArrowUp size={18} aria-hidden="true" />
            </span>
          </a>
        </div>

        <div className="grid gap-10 pt-12 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h2 className="tag">Serviços</h2>
            <ul className="mt-5 space-y-2.5 text-sm text-white/70">
              {SERVICES.map((s) => (
                <li key={s.to}><Link to={s.to} className="transition-colors duration-500 hover:text-lime">{s.label}</Link></li>
              ))}
              <li><Link to="/teste-de-velocidade" className="transition-colors duration-500 hover:text-lime">Teste de velocidade</Link></li>
            </ul>
          </div>
          <div>
            <h2 className="tag">Atendimento</h2>
            <ul className="mt-5 space-y-2.5 text-sm text-white/70">
              <li><Link to="/suporte" className="transition-colors duration-500 hover:text-lime">Suporte técnico</Link></li>
              <li><Link to="/fale-conosco" className="transition-colors duration-500 hover:text-lime">Fale conosco</Link></li>
              <li><Link to="/cobertura" className="transition-colors duration-500 hover:text-lime">Cobertura e lojas</Link></li>
              <li><Link to="/avaliacoes" className="transition-colors duration-500 hover:text-lime">Depoimentos e avaliações</Link></li>
              <li><Link to="/eventos" className="transition-colors duration-500 hover:text-lime">INET Eventos</Link></li>
              <li><a href={COMPANY.clientArea} target="_blank" rel="noreferrer" className="transition-colors duration-500 hover:text-lime">Central do Cliente</a></li>
              <li><a href={COMPANY.contractPdf} target="_blank" rel="noreferrer" className="transition-colors duration-500 hover:text-lime">Contrato de prestação de serviços</a></li>
            </ul>
          </div>
          <div>
            <h2 className="tag">Central de atendimento</h2>
            <ul className="mt-5 space-y-2.5 text-sm text-white/80">
              {PHONES.map((p) => (
                <li key={p.tel}>
                  <a href={`tel:${p.tel}`} className="inline-flex items-center gap-2 transition-colors duration-500 hover:text-lime">
                    <Phone size={14} aria-hidden="true" className="text-lime" /> {p.display}
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex gap-2">
              {SOCIAL.map((s) => {
                const Icon = icons[s.name as keyof typeof icons];
                return (
                  <a key={s.name} href={s.url} target="_blank" rel="noreferrer" aria-label={`${s.name} da INET`} className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 transition-colors duration-500 hover:border-lime hover:text-lime">
                    <Icon size={17} aria-hidden="true" />
                  </a>
                );
              })}
            </div>
          </div>
          <div>
            <h2 className="tag">Lojas em Teófilo Otoni</h2>
            <ul className="mt-5 space-y-3 text-sm text-white/70">
              {STORES.map((s) => (
                <li key={s.name}>
                  <a href={s.maps} target="_blank" rel="noreferrer" className="inline-flex gap-2 transition-colors duration-500 hover:text-lime">
                    <MapPin size={14} aria-hidden="true" className="mt-0.5 shrink-0 text-lime" /> {s.address}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="mt-14 border-t border-white/10 pt-6 text-xs text-white/40">
          © {new Date().getFullYear()} {COMPANY.legalName} · CNPJ {COMPANY.cnpj} · Teófilo Otoni – MG
        </p>
      </div>
    </footer>
  );
}
