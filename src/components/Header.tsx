import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Phone, X } from "lucide-react";
import { EASE } from "../motion";
import { COMPANY, PHONES, SOCIAL, waLink } from "../data/inet";

export const SERVICES = [
  { to: "/internet", label: "Internet e Wi-Fi", text: "Fibra óptica, roteadores e Wi-Fi Mesh" },
  { to: "/movel", label: "Chip móvel", text: "Internet 5G, ligações e benefícios" },
  { to: "/tv", label: "INET TV", text: "Canais, rádio, filmes e entretenimento" },
  { to: "/telefone-fixo", label: "Telefone fixo", text: "Telefonia residencial e empresarial" },
  { to: "/entretenimento", label: "Entretenimento", text: "HBO Max, Disney+ e Deezer" },
  { to: "/monte-seu-combo", label: "Monte seu combo", text: "Escolha o plano e os adicionais" },
];

export const NAV_LINKS = [
  { to: "/cobertura", label: "Cobertura" },
  { to: "/teste-de-velocidade", label: "Velocidade" },
  { to: "/eventos", label: "INET Eventos" },
  { to: "/avaliacoes", label: "Avaliações" },
  { to: "/suporte", label: "Suporte 24h" },
  { to: "/fale-conosco", label: "Fale conosco" },
];

/**
 * Header estilo Lusion para o Teste 3 (Tema Claro-Neve):
 * - Logo INET azul (/inet-logo.png) para fundo claro à esquerda.
 * - Pílulas flutuantes à direita: "Fale conosco •" (escura) e "Menu ••" (clara).
 * - Menu abre um painel em tela cheia com transição elegante na curva oficial EASE.
 * - Navegação acessível por teclado, fecha no Esc e na troca de rota.
 */
export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Trava a rolagem de fundo quando o menu estiver aberto
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <header className="fixed inset-x-0 top-3 sm:top-5 z-50 pointer-events-none px-4 sm:px-8 max-w-[100rem] mx-auto">
        <div className="flex items-center justify-between">
          {/* Logo oficial azul em cápsula de vidro suave para máxima legibilidade */}
          <Link
            to="/"
            className="pointer-events-auto inline-flex items-center px-3 py-1.5 rounded-full bg-[#EFF3F9]/85 border border-navy/10 shadow-sm backdrop-blur-md transition-all duration-300 hover:scale-105 hover:bg-[#E2E8F2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric"
            aria-label="INET Telecomunicações - Início"
          >
            <img
              src="/inet-logo.png"
              alt="INET"
              width={124}
              height={44}
              className="h-6 sm:h-7 w-auto object-contain"
            />
          </Link>

          {/* Pílulas estilo Lusion */}
          <div className="pointer-events-auto flex items-center gap-2 sm:gap-3">
            {/* Pílula Escura: Fale conosco com ponto luminoso verde-limão */}
            <a
              href={waLink("Olá! Vim pelo site da INET e gostaria de falar com a equipe.")}
              target="_blank"
              rel="noreferrer"
              className="inet-dark-pill inline-flex items-center gap-2 rounded-full bg-navy-ink px-4 sm:px-5 py-2.5 text-xs sm:text-[13px] font-medium text-white shadow-md transition-all duration-300 hover:bg-navy hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric"
            >
              <span>Fale conosco</span>
              <span className="h-2 w-2 rounded-full bg-[#70E000] shadow-[0_0_8px_#70E000]" aria-hidden="true" />
            </a>

            {/* Pílula Clara: Menu com dois pontos */}
            <button
              type="button"
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-expanded={menuOpen}
              aria-controls="menu-fullscreen"
              className="inline-flex items-center gap-2 rounded-full border border-navy/15 bg-[#EFF3F9]/90 px-4 sm:px-5 py-2.5 text-xs sm:text-[13px] font-medium text-navy-ink shadow-sm backdrop-blur-md transition-all duration-300 hover:bg-[#E2E8F2] hover:border-navy/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric"
            >
              <span>{menuOpen ? "Fechar" : "Menu"}</span>
              {menuOpen ? (
                <X size={14} aria-hidden="true" />
              ) : (
                <span className="flex items-center gap-1" aria-hidden="true">
                  <span className="h-1.5 w-1.5 rounded-full bg-navy-ink" />
                  <span className="h-1.5 w-1.5 rounded-full bg-navy-ink" />
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Painel de Menu Tela Cheia (Lusion Style) */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="menu-fullscreen"
            role="dialog"
            aria-modal="true"
            aria-label="Menu principal de navegação"
            initial={{ opacity: 0, y: -24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: 0.55, ease: EASE }}
            className="fixed inset-0 z-40 flex flex-col justify-between overflow-y-auto bg-[#EFF3F9]/98 backdrop-blur-2xl px-6 py-24 sm:px-12 sm:py-28 lg:px-20 lg:py-32"
          >
            <div className="mx-auto w-full max-w-[90rem]">
              <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr]">
                {/* Coluna 1: Serviços Principais */}
                <div>
                  <span className="font-display text-xs font-semibold uppercase tracking-[0.25em] text-electric">
                    Serviços INET
                  </span>
                  <nav className="mt-6 flex flex-col space-y-4 sm:space-y-6">
                    {SERVICES.map((s) => (
                      <NavLink
                        key={s.to}
                        to={s.to}
                        className={({ isActive }) =>
                          `group flex flex-col no-underline transition-transform duration-300 hover:translate-x-2 focus-visible:outline-none ${
                            isActive ? "text-electric" : "text-navy-ink hover:text-electric"
                          }`
                        }
                      >
                        <span className="font-display text-2xl sm:text-4xl lg:text-5xl font-light tracking-tight">
                          {s.label}
                        </span>
                        <span className="mt-1 text-xs sm:text-sm text-navy-ink/60">
                          {s.text}
                        </span>
                      </NavLink>
                    ))}
                  </nav>
                </div>

                {/* Coluna 2: Institucional & Facilidades */}
                <div>
                  <span className="font-display text-xs font-semibold uppercase tracking-[0.25em] text-electric">
                    Navegação
                  </span>
                  <nav className="mt-6 flex flex-col space-y-3 sm:space-y-4">
                    {NAV_LINKS.map((item) => (
                      <NavLink
                        key={item.to}
                        to={item.to}
                        className={({ isActive }) =>
                          `font-display text-xl sm:text-2xl font-light transition-colors duration-300 hover:text-electric focus-visible:outline-none ${
                            isActive ? "text-electric font-normal" : "text-navy-ink"
                          }`
                        }
                      >
                        {item.label}
                      </NavLink>
                    ))}
                    <a
                      href={COMPANY.clientArea}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 font-display text-xl sm:text-2xl font-light text-navy-ink hover:text-electric transition-colors"
                    >
                      Central do Cliente <ArrowUpRight size={18} aria-hidden="true" />
                    </a>
                  </nav>
                </div>

                {/* Coluna 3: Atendimento & Contatos Rápidos */}
                <div className="flex flex-col justify-between">
                  <div>
                    <span className="font-display text-xs font-semibold uppercase tracking-[0.25em] text-electric">
                      Central de Atendimento
                    </span>
                    <ul className="mt-6 space-y-3 text-sm text-navy-ink/80">
                      {PHONES.map((p) => (
                        <li key={p.tel}>
                          <a
                            href={`tel:${p.tel}`}
                            className="inline-flex items-center gap-2 font-medium hover:text-electric transition-colors"
                          >
                            <Phone size={14} className="text-electric" aria-hidden="true" />
                            {p.display}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-10 border-t border-navy/10 pt-6">
                    <p className="text-xs text-navy-ink/60 leading-relaxed">
                      Atendimento presencial em Teófilo Otoni e Carlos Chagas.
                      Suporte técnico 24 horas por dia, 7 dias por semana.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Rodapé interno do menu */}
            <div className="mx-auto mt-16 w-full max-w-[90rem] border-t border-navy/10 pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-navy-ink/50">
              <span>INET Telecomunicações · Conectando Teófilo Otoni</span>
              <div className="flex gap-4">
                {SOCIAL.map((s) => (
                  <a
                    key={s.name}
                    href={s.url}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-electric transition-colors"
                  >
                    {s.name}
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
