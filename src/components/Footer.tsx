import { Link } from "react-router-dom";
import { ArrowUp, Facebook, Instagram, MapPin, Phone, Youtube } from "lucide-react";
import { COMPANY, PHONES, SOCIAL, STORES } from "../data/inet";
import { SERVICES } from "./Header";

const icons = { Instagram, Facebook, YouTube: Youtube } as const;

/**
 * Rodapé estilo Lusion no Tema Claro-Neve:
 * - Superfície clean e espaçosa (#E2E8F2 / #E6EDF6).
 * - Logo azul INET (/inet-logo.png) para fundo claro.
 * - Tipografia editorial em azul-noite INET (#010818 / #03256C).
 * - Dados 100% reais de COMPANY, PHONES, SOCIAL e STORES.
 */
export default function Footer() {
  return (
    <footer data-lateral="lojas" className="relative border-t border-navy/10 bg-[#E2E8F2] text-navy-ink">
      <div className="wrap py-16 sm:py-20 lg:py-24">
        {/* Topo do rodapé: Logo azul e Voltar ao início */}
        <div className="flex flex-col items-start justify-between gap-6 border-b border-navy/10 pb-12 sm:flex-row sm:items-center">
          <div className="flex flex-col gap-2">
            <img
              src="/inet-logo.png"
              alt="INET Internet Fibra Óptica"
              width={132}
              height={46}
              className="h-10 w-auto object-contain"
            />
            <p className="text-xs text-navy-ink/60 font-medium">
              Internet fibra óptica de alta performance em Teófilo Otoni e região.
            </p>
          </div>

          <a
            href="#top"
            className="group inline-flex items-center gap-3 text-sm font-medium text-navy-ink/80 transition-colors duration-500 hover:text-electric"
          >
            <span>Voltar ao início</span>
            <span className="flex h-11 w-11 items-center justify-center rounded-full border border-navy/20 bg-white/60 text-navy-ink shadow-sm transition-[transform,border-color,background-color,color] duration-500 group-hover:-translate-y-1 group-hover:border-electric group-hover:bg-electric group-hover:text-white">
              <ArrowUp size={18} aria-hidden="true" />
            </span>
          </a>
        </div>

        {/* Grade de colunas */}
        <div className="grid gap-10 pt-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* Coluna 1: Serviços */}
          <div>
            <h2 className="tag text-electric">Serviços</h2>
            <ul className="mt-5 space-y-2.5 text-sm text-navy-ink/75">
              {SERVICES.map((s) => (
                <li key={s.to}>
                  <Link to={s.to} className="transition-colors duration-300 hover:text-electric">
                    {s.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/teste-de-velocidade" className="transition-colors duration-300 hover:text-electric">
                  Teste de velocidade
                </Link>
              </li>
            </ul>
          </div>

          {/* Coluna 2: Atendimento */}
          <div>
            <h2 className="tag text-electric">Atendimento</h2>
            <ul className="mt-5 space-y-2.5 text-sm text-navy-ink/75">
              <li>
                <Link to="/suporte" className="transition-colors duration-300 hover:text-electric">
                  Suporte técnico 24h
                </Link>
              </li>
              <li>
                <Link to="/fale-conosco" className="transition-colors duration-300 hover:text-electric">
                  Fale conosco
                </Link>
              </li>
              <li>
                <Link to="/cobertura" className="transition-colors duration-300 hover:text-electric">
                  Cobertura e lojas
                </Link>
              </li>
              <li>
                <Link to="/avaliacoes" className="transition-colors duration-300 hover:text-electric">
                  Depoimentos e avaliações
                </Link>
              </li>
              <li>
                <Link to="/eventos" className="transition-colors duration-300 hover:text-electric">
                  INET Eventos
                </Link>
              </li>
              <li>
                <a
                  href={COMPANY.clientArea}
                  target="_blank"
                  rel="noreferrer"
                  className="transition-colors duration-300 hover:text-electric"
                >
                  Central do Cliente
                </a>
              </li>
              <li>
                <a
                  href={COMPANY.contractPdf}
                  target="_blank"
                  rel="noreferrer"
                  className="transition-colors duration-300 hover:text-electric"
                >
                  Contrato de adesão
                </a>
              </li>
            </ul>
          </div>

          {/* Coluna 3: Central de Atendimento & Redes */}
          <div>
            <h2 className="tag text-electric">Central Telefônica</h2>
            <ul className="mt-5 space-y-2.5 text-sm text-navy-ink/85">
              {PHONES.map((p) => (
                <li key={p.tel}>
                  <a
                    href={`tel:${p.tel}`}
                    className="inline-flex items-center gap-2 font-medium transition-colors duration-300 hover:text-electric"
                  >
                    <Phone size={14} aria-hidden="true" className="text-electric" />
                    {p.display}
                  </a>
                </li>
              ))}
            </ul>

            <div className="mt-7 flex gap-2.5">
              {SOCIAL.map((s) => {
                const Icon = icons[s.name as keyof typeof icons];
                return (
                  <a
                    key={s.name}
                    href={s.url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`${s.name} da INET`}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-navy/20 bg-white/50 text-navy-ink shadow-sm transition-[transform,border-color,color,background-color] duration-300 hover:-translate-y-0.5 hover:border-electric hover:bg-electric hover:text-white"
                  >
                    <Icon size={16} aria-hidden="true" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Coluna 4: Lojas Físicas */}
          <div>
            <h2 className="tag text-electric">Lojas Físicas</h2>
            <ul className="mt-5 space-y-3 text-sm text-navy-ink/75">
              {STORES.map((s) => (
                <li key={s.name}>
                  <a
                    href={s.maps}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex gap-2 transition-colors duration-300 hover:text-electric"
                  >
                    <MapPin size={14} aria-hidden="true" className="mt-0.5 shrink-0 text-electric" />
                    <span>{s.address}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Rodapé legal */}
        <p className="mt-14 border-t border-navy/10 pt-6 text-xs text-navy-ink/50">
          © {new Date().getFullYear()} {COMPANY.legalName} · CNPJ {COMPANY.cnpj} · Teófilo Otoni – MG
        </p>
      </div>
    </footer>
  );
}
