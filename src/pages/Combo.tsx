import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Camera,
  Check,
  ChevronDown,
  ChevronUp,
  Film,
  Info,
  MessageCircle,
  Radio,
  ShieldCheck,
  Sparkles,
  Tv,
  Wifi,
} from "lucide-react";
import { DUR, EASE } from "../motion";
import { Faq, PageHero, Section, usePageMeta } from "../components/ui";
import SectionBackdrop from "../components/fundos/SectionBackdrop";
import {
  CAMERA_OPTIONS,
  COMBO_PLANS,
  calculateComboTotal,
  formatBrl,
  getComboWhatsAppUrl,
  MESH_ADDON,
  parseBrl,
  STREAMING_OPTIONS,
  TV_ADDON,
  type CameraOptionId,
  type ComboSelection,
} from "../data/combo";

export default function Combo() {
  usePageMeta(
    "Monte seu combo",
    "Monte seu combo personalizado da INET: internet fibra de até 1 Giga, Wi-Fi Mesh, câmeras inteligentes, INET TV e os melhores streamings. Simule o valor e fale com o comercial."
  );

  // Estado da seleção interativa: inicia com plano 800 Mega (com HBO Max incluso a R$ 0) e sem adicionais
  const [selection, setSelection] = useState<ComboSelection>({
    planId: "800",
    hasMesh: false,
    cameraId: "none",
    hasTv: false,
    streamings: ["hbo"],
  });

  // Drawer / expansão do resumo no mobile
  const [mobileSummaryOpen, setMobileSummaryOpen] = useState(false);

  // Cálculos consolidados em tempo real
  const summary = useMemo(() => calculateComboTotal(selection), [selection]);
  const whatsappUrl = useMemo(() => getComboWhatsAppUrl(selection), [selection]);
  const selectedPlan = useMemo(
    () => COMBO_PLANS.find((p) => p.id === selection.planId) || COMBO_PLANS[0],
    [selection.planId]
  );

  // Handlers
  const handleSelectPlan = (planId: string) => {
    setSelection((prev) => {
      // Ajusta streamings se o novo plano já inclui algum
      const nextStreamings = [...prev.streamings];
      if (planId === "800" && !nextStreamings.includes("hbo")) {
        nextStreamings.push("hbo");
      }
      if ((planId === "700" || planId === "1000") && !nextStreamings.includes("deezer")) {
        nextStreamings.push("deezer");
      }
      return { ...prev, planId, streamings: nextStreamings };
    });
  };

  const handleToggleMesh = () => {
    setSelection((prev) => ({ ...prev, hasMesh: !prev.hasMesh }));
  };

  const handleSelectCamera = (cameraId: CameraOptionId) => {
    setSelection((prev) => ({ ...prev, cameraId }));
  };

  const handleToggleTv = () => {
    setSelection((prev) => ({ ...prev, hasTv: !prev.hasTv }));
  };

  const handleToggleStreaming = (streamingId: string) => {
    setSelection((prev) => {
      const exists = prev.streamings.includes(streamingId);
      const streamings = exists
        ? prev.streamings.filter((id) => id !== streamingId)
        : [...prev.streamings, streamingId];
      return { ...prev, streamings };
    });
  };

  return (
    <div className="combo-page relative min-h-screen bg-navy-ink text-white">
      <SectionBackdrop variant="mist" glowPosition="top" glowIntensity={0.22} className="overflow-visible">
        {/* Estilos específicos do simulador:
          1. Oculta rótulos caixa-alta sobre títulos (diretriz de design do Filipe)
          2. Posiciona o atalho flutuante do WhatsApp no espaço reservado à direita no mobile
          3. Reserva respiro no final do rodapé para que a barra fixa nunca encubra o copyright */}
      <style>{`
        .page-hero .tag {
          display: none !important;
        }
        @media (max-width: 1023px) {
          a[aria-label="Falar com a INET pelo WhatsApp"] {
            bottom: 5.5rem !important;
            right: 1rem !important;
          }
          footer {
            padding-bottom: 6.5rem !important;
          }
        }
      `}</style>

      {/* Cabeçalho da página */}
      <PageHero
        tag=""
        title={["Monte seu combo,", <span key="hero-accent" className="italic text-lime">do seu jeito.</span>]}
        lead="Escolha a velocidade da sua fibra óptica, amplie o alcance do Wi-Fi, adicione segurança para sua residência e escolha seus streamings favoritos. Tudo reunido em uma única mensalidade."
      >
        <a href="#etapas-combo" className="btn-lime">
          Começar simulação
        </a>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
          className="btn-ghost"
        >
          <MessageCircle size={16} aria-hidden="true" />
          Falar com o comercial
        </a>
      </PageHero>

      {/* Seção principal do construtor: layout aberto em faixas largas com resumo lateral */}
      <section id="etapas-combo" className="relative pb-28 pt-10 sm:pb-36 lg:pb-24">
        <div className="wrap">
          <div className="lg:grid lg:grid-cols-12 lg:gap-12 xl:gap-16">
            {/* Coluna esquerda: os 5 passos do combo em faixas abertas */}
            <div className="space-y-14 lg:col-span-7 xl:col-span-8">

              {/* ETAPA 1: Plano de Internet Fibra */}
              <div className="border-b border-white/10 pb-12">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-electric/20 font-display text-xs font-bold text-lime">
                      01
                    </span>
                    <h2 className="font-display text-2xl font-light text-white sm:text-3xl">
                      Plano de Internet Fibra
                    </h2>
                  </div>
                  <span className="text-xs uppercase tracking-widest text-lime">Obrigatório</span>
                </div>
                <p className="mt-2 text-sm text-white/65">
                  Selecione a velocidade que melhor atende à sua rotina. Sem custo de instalação.
                </p>

                {/* Linhas abertas de planos - sem cards fechados */}
                <div
                  role="radiogroup"
                  aria-label="Escolha seu plano de internet fibra"
                  className="mt-6 divide-y divide-white/10 border-y border-white/10"
                >
                  {COMBO_PLANS.map((plan) => {
                    const isSelected = selection.planId === plan.id;
                    const priceVal = parseBrl(plan.price);

                    return (
                      <div
                        key={plan.id}
                        role="radio"
                        aria-checked={isSelected}
                        tabIndex={0}
                        onClick={() => handleSelectPlan(plan.id)}
                        onKeyDown={(e) => {
                          if (e.key === " " || e.key === "Enter") {
                            e.preventDefault();
                            handleSelectPlan(plan.id);
                          }
                        }}
                        className={`group relative flex cursor-pointer flex-col gap-4 py-5 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] sm:flex-row sm:items-center sm:justify-between sm:py-6 ${
                          isSelected
                            ? "bg-white/[0.04] px-4 -mx-4 rounded-xl sm:px-6 sm:-mx-6"
                            : "hover:bg-white/[0.02] px-4 -mx-4 sm:px-6 sm:-mx-6"
                        }`}
                      >
                        {/* Linha indicadora lateral no selecionado */}
                        <div
                          aria-hidden="true"
                          className={`absolute left-0 top-3 bottom-3 w-1 rounded-full bg-lime transition-all duration-500 ${
                            isSelected ? "opacity-100 scale-y-100" : "opacity-0 scale-y-50"
                          }`}
                        />

                        {/* Informações principais */}
                        <div className="flex items-start gap-4">
                          {/* Seletor visual */}
                          <div
                            aria-hidden="true"
                            className={`mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-colors duration-300 ${
                              isSelected
                                ? "border-lime bg-lime text-navy-ink shadow-[0_0_12px_rgba(112,224,0,0.6)]"
                                : "border-white/30 bg-transparent group-hover:border-white/60"
                            }`}
                          >
                            {isSelected && <Check size={14} strokeWidth={3} />}
                          </div>

                          <div>
                            <div className="flex flex-wrap items-center gap-2.5">
                              <span className="font-display text-xl font-bold tracking-tight text-white sm:text-2xl">
                                {plan.speed} {plan.unit}
                              </span>
                              {plan.id === "1000" && (
                                <span className="rounded-full bg-lime/20 px-2.5 py-0.5 text-[11px] font-semibold text-lime">
                                  Wi-Fi 6 incluso
                                </span>
                              )}
                            </div>
                            <p className="mt-1 text-sm text-white/70 max-w-xl">
                              {plan.description}
                            </p>

                            {/* Tags de benefícios inclusos no plano */}
                            <div className="mt-3 flex flex-wrap gap-1.5">
                              {plan.includes.map((inc) => (
                                <span
                                  key={inc}
                                  className="inline-flex items-center gap-1 rounded-md bg-white/5 px-2 py-0.5 text-xs text-white/75"
                                >
                                  <Check size={11} className="text-lime" />
                                  {inc}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Preço e ação */}
                        <div className="flex flex-col items-end justify-center min-w-[120px] sm:min-w-[150px] text-right shrink-0 whitespace-nowrap">
                          <span className="block text-[11px] text-white/50 uppercase tracking-wider mb-0.5">Mensalidade</span>
                          <div className="inline-flex items-baseline justify-end tabular-nums">
                            <span className="text-xs sm:text-sm font-semibold text-white/70 mr-1">R$</span>
                            <span className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
                              {plan.price}
                            </span>
                            <span className="text-[11px] sm:text-xs text-white/50 font-normal">/mês</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ETAPA 2: Rede Wi-Fi Mesh */}
              <div className="border-b border-white/10 pb-12">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-electric/20 font-display text-xs font-bold text-lime">
                      02
                    </span>
                    <h2 className="font-display text-2xl font-light text-white sm:text-3xl">
                      Rede Wi-Fi Mesh
                    </h2>
                  </div>
                  <span className="text-xs uppercase tracking-widest text-white/50">Opcional</span>
                </div>
                <p className="mt-2 text-sm text-white/65">
                  Amplia o sinal de Wi-Fi para mais cômodos.
                </p>

                {/* Faixa aberta com switch */}
                <div
                  onClick={handleToggleMesh}
                  className={`mt-6 flex cursor-pointer flex-col gap-4 rounded-2xl border border-white/10 p-5 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] sm:flex-row sm:items-center sm:justify-between sm:p-6 ${
                    selection.hasMesh
                      ? "border-lime/40 bg-gradient-to-r from-electric/15 to-transparent shadow-[0_0_25px_rgba(0,98,236,0.15)]"
                      : "bg-white/[0.02] hover:bg-white/[0.04]"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      aria-hidden="true"
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl transition-colors duration-500 ${
                        selection.hasMesh ? "bg-lime text-navy-ink" : "bg-white/10 text-white/70"
                      }`}
                    >
                      <Wifi size={22} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-display text-lg font-semibold text-white sm:text-xl">
                          {MESH_ADDON.name}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-white/70 max-w-xl">
                        {MESH_ADDON.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-6 pl-15 sm:pl-0">
                    <div className="min-w-[120px] sm:min-w-[150px] text-right shrink-0 whitespace-nowrap">
                      <span className="block text-[11px] text-white/50 uppercase tracking-wider mb-0.5">Adicional</span>
                      <div className="inline-flex items-baseline justify-end tabular-nums text-lime">
                        <span className="font-display text-lg sm:text-xl font-bold tracking-tight">
                          + {formatBrl(MESH_ADDON.priceNum)}
                        </span>
                        <span className="text-[11px] sm:text-xs text-white/50 font-normal text-white/60">/mês</span>
                      </div>
                    </div>

                    {/* Interruptor switch acessível */}
                    <button
                      type="button"
                      role="switch"
                      aria-checked={selection.hasMesh}
                      aria-label="Incluir Rede Wi-Fi Mesh no combo"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleMesh();
                      }}
                      className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] focus:outline-none focus-visible:outline-lime ${
                        selection.hasMesh ? "bg-lime" : "bg-white/20"
                      }`}
                    >
                      <span
                        aria-hidden="true"
                        className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-navy-ink shadow-lg ring-0 transition duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                          selection.hasMesh ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* ETAPA 3: Câmera de Segurança */}
              <div className="border-b border-white/10 pb-12">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-electric/20 font-display text-xs font-bold text-lime">
                      03
                    </span>
                    <h2 className="font-display text-2xl font-light text-white sm:text-3xl">
                      Câmera de Segurança Residencial
                    </h2>
                  </div>
                  <span className="text-xs uppercase tracking-widest text-white/50">Opcional</span>
                </div>
                <p className="mt-2 text-sm text-white/65">
                  Câmeras de segurança para sua residência.
                </p>

                {/* Opções em faixas contínuas abertas */}
                <div
                  role="radiogroup"
                  aria-label="Opções de câmera de segurança"
                  className="mt-6 divide-y divide-white/10 border-y border-white/10"
                >
                  {CAMERA_OPTIONS.map((cam) => {
                    const isSelected = selection.cameraId === cam.id;

                    return (
                      <div
                        key={cam.id}
                        role="radio"
                        aria-checked={isSelected}
                        tabIndex={0}
                        onClick={() => handleSelectCamera(cam.id)}
                        onKeyDown={(e) => {
                          if (e.key === " " || e.key === "Enter") {
                            e.preventDefault();
                            handleSelectCamera(cam.id);
                          }
                        }}
                        className={`group relative flex cursor-pointer flex-col gap-4 py-5 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] sm:flex-row sm:items-center sm:justify-between sm:py-6 ${
                          isSelected
                            ? "bg-white/[0.04] px-4 -mx-4 rounded-xl sm:px-6 sm:-mx-6"
                            : "hover:bg-white/[0.02] px-4 -mx-4 sm:px-6 sm:-mx-6"
                        }`}
                      >
                        <div
                          aria-hidden="true"
                          className={`absolute left-0 top-3 bottom-3 w-1 rounded-full bg-lime transition-all duration-500 ${
                            isSelected ? "opacity-100 scale-y-100" : "opacity-0 scale-y-50"
                          }`}
                        />

                        <div className="flex items-start gap-4">
                          <div
                            aria-hidden="true"
                            className={`mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-colors duration-300 ${
                              isSelected
                                ? "border-lime bg-lime text-navy-ink shadow-[0_0_12px_rgba(112,224,0,0.6)]"
                                : "border-white/30 bg-transparent group-hover:border-white/60"
                            }`}
                          >
                            {isSelected && <Check size={14} strokeWidth={3} />}
                          </div>

                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-display text-base font-semibold text-white sm:text-lg">
                                {cam.name}
                              </span>
                            </div>
                            <p className="mt-1 text-sm text-white/70 max-w-xl">
                              {cam.description}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-col items-end justify-center min-w-[120px] sm:min-w-[150px] text-right shrink-0 whitespace-nowrap">
                          <span className="block text-[11px] text-white/50 uppercase tracking-wider mb-0.5">
                            {cam.id === "none" ? "Status" : "Adicional"}
                          </span>
                          <div className="inline-flex items-baseline justify-end tabular-nums">
                            <span className={`font-display text-lg sm:text-xl font-bold tracking-tight ${cam.id === "none" ? "text-white/60 font-normal text-base sm:text-lg" : "text-white"}`}>
                              {cam.id === "none" ? "Sem custo" : `+ ${formatBrl(cam.priceNum)}`}
                            </span>
                            {cam.id !== "none" && <span className="text-[11px] sm:text-xs text-white/50 font-normal">/mês</span>}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ETAPA 4: INET TV */}
              <div className="border-b border-white/10 pb-12">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-electric/20 font-display text-xs font-bold text-lime">
                      04
                    </span>
                    <h2 className="font-display text-2xl font-light text-white sm:text-3xl">
                      INET TV
                    </h2>
                  </div>
                  <span className="text-xs uppercase tracking-widest text-white/50">Opcional</span>
                </div>
                <p className="mt-2 text-sm text-white/65">
                  Canais ao vivo, rádio e filmes diretamente na sua TV ou aplicativo.
                </p>

                {/* Faixa aberta com switch */}
                <div
                  onClick={handleToggleTv}
                  className={`mt-6 flex cursor-pointer flex-col gap-4 rounded-2xl border border-white/10 p-5 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] sm:flex-row sm:items-center sm:justify-between sm:p-6 ${
                    selection.hasTv
                      ? "border-lime/40 bg-gradient-to-r from-electric/15 to-transparent shadow-[0_0_25px_rgba(0,98,236,0.15)]"
                      : "bg-white/[0.02] hover:bg-white/[0.04]"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      aria-hidden="true"
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl transition-colors duration-500 ${
                        selection.hasTv ? "bg-lime text-navy-ink" : "bg-white/10 text-white/70"
                      }`}
                    >
                      <Tv size={22} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-display text-lg font-semibold text-white sm:text-xl">
                          {TV_ADDON.name}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-white/70 max-w-xl">
                        {TV_ADDON.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-6 pl-15 sm:pl-0">
                    <div className="min-w-[120px] sm:min-w-[150px] text-right shrink-0 whitespace-nowrap">
                      <span className="block text-[11px] text-white/50 uppercase tracking-wider mb-0.5">Adicional</span>
                      <div className="inline-flex items-baseline justify-end tabular-nums text-lime">
                        <span className="font-display text-lg sm:text-xl font-bold tracking-tight">
                          + {formatBrl(TV_ADDON.priceNum)}
                        </span>
                        <span className="text-[11px] sm:text-xs text-white/50 font-normal text-white/60">/mês</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      role="switch"
                      aria-checked={selection.hasTv}
                      aria-label="Incluir INET TV no combo"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleTv();
                      }}
                      className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] focus:outline-none focus-visible:outline-lime ${
                        selection.hasTv ? "bg-lime" : "bg-white/20"
                      }`}
                    >
                      <span
                        aria-hidden="true"
                        className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-navy-ink shadow-lg ring-0 transition duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                          selection.hasTv ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* ETAPA 5: Streaming e Entretenimento */}
              <div>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-electric/20 font-display text-xs font-bold text-lime">
                      05
                    </span>
                    <h2 className="font-display text-xl font-light text-white sm:text-3xl break-words">
                      Streaming e Entretenimento
                    </h2>
                  </div>
                  <span className="text-xs uppercase tracking-widest text-white/50">Múltipla escolha</span>
                </div>
                <p className="mt-2 text-sm text-white/65">
                  Assista e ouça o que você adora. Se o streaming já fizer parte do seu plano de internet escolhido, o valor extra é zero!
                </p>

                {/* Lista aberta de streamings */}
                <div
                  role="group"
                  aria-label="Escolha seus streamings adicionais"
                  className="mt-6 divide-y divide-white/10 border-y border-white/10"
                >
                  {STREAMING_OPTIONS.map((stream) => {
                    const isSelected = selection.streamings.includes(stream.id);
                    const isIncludedInPlan = stream.includedInPlans.includes(selection.planId);

                    return (
                      <div
                        key={stream.id}
                        role="checkbox"
                        aria-checked={isSelected}
                        tabIndex={0}
                        onClick={() => handleToggleStreaming(stream.id)}
                        onKeyDown={(e) => {
                          if (e.key === " " || e.key === "Enter") {
                            e.preventDefault();
                            handleToggleStreaming(stream.id);
                          }
                        }}
                        className={`group relative flex cursor-pointer flex-col gap-4 py-5 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] sm:flex-row sm:items-center sm:justify-between sm:py-6 ${
                          isSelected
                            ? "bg-white/[0.04] px-4 -mx-4 rounded-xl sm:px-6 sm:-mx-6"
                            : "hover:bg-white/[0.02] px-4 -mx-4 sm:px-6 sm:-mx-6"
                        }`}
                      >
                        <div
                          aria-hidden="true"
                          className={`absolute left-0 top-3 bottom-3 w-1 rounded-full bg-lime transition-all duration-500 ${
                            isSelected ? "opacity-100 scale-y-100" : "opacity-0 scale-y-50"
                          }`}
                        />

                        <div className="flex items-start gap-4">
                          {/* Caixa de seleção acessível */}
                          <div
                            aria-hidden="true"
                            className={`mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border transition-colors duration-300 ${
                              isSelected
                                ? "border-lime bg-lime text-navy-ink shadow-[0_0_12px_rgba(112,224,0,0.6)]"
                                : "border-white/30 bg-transparent group-hover:border-white/60"
                            }`}
                          >
                            {isSelected && <Check size={14} strokeWidth={3} />}
                          </div>

                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-display text-base font-semibold text-white sm:text-lg">
                                {stream.name}
                              </span>
                              <span className="text-xs text-white/50">
                                • {stream.category}
                              </span>
                              {isIncludedInPlan && (
                                <span className="rounded-full bg-lime/20 px-2.5 py-0.5 text-[11px] font-semibold text-lime">
                                  Já incluso no plano {selectedPlan?.speed} {selectedPlan?.unit}!
                                </span>
                              )}
                            </div>
                            {stream.description &&
                              stream.description.replace(/\.$/, "").trim().toLowerCase() !==
                                stream.category.trim().toLowerCase() && (
                                <p className="mt-1 text-sm text-white/70 max-w-xl">
                                  {stream.description}
                                </p>
                              )}
                          </div>
                        </div>

                        <div className="flex flex-col items-end justify-center min-w-[120px] sm:min-w-[150px] text-right shrink-0 whitespace-nowrap">
                          <span className="block text-[11px] text-white/50 uppercase tracking-wider mb-0.5">
                            {isIncludedInPlan ? "Benefício" : "Adicional"}
                          </span>
                          <div className="inline-flex items-baseline justify-end tabular-nums">
                            <span className={`font-display text-lg sm:text-xl font-bold tracking-tight ${isIncludedInPlan ? "text-lime" : "text-white"}`}>
                              {isIncludedInPlan
                                ? "R$ 0,00"
                                : `+ ${formatBrl(stream.priceNum)}`}
                            </span>
                            {!isIncludedInPlan && <span className="text-[11px] sm:text-xs text-white/50 font-normal">/mês</span>}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Coluna direita: Resumo fixo no Desktop (Sticky Sidebar) */}
            <div className="hidden lg:col-span-5 lg:block xl:col-span-4">
              <div className="sticky top-28 rounded-3xl border border-white/10 bg-gradient-to-b from-[#020F2E]/90 to-navy-ink/95 p-6 shadow-2xl backdrop-blur-xl xl:p-8">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div>
                    <h3 className="font-display text-xl font-light text-white">
                      Resumo do Combo
                    </h3>
                  </div>
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-lime/10 text-lime">
                    <Sparkles size={16} />
                  </span>
                </div>

                {/* Lista discriminada de itens */}
                <div className="mt-5 divide-y divide-white/5 text-sm">
                  {summary.items.map((item, idx) => (
                    <div key={idx} className="flex items-start justify-between py-3">
                      <div>
                        <span className="block text-xs uppercase tracking-wider text-white/40">
                          {item.category}
                        </span>
                        <span className="font-medium text-white">{item.title}</span>
                        {item.detail && (
                          <span className="block text-xs text-white/60">{item.detail}</span>
                        )}
                      </div>
                      <div className="min-w-[85px] sm:min-w-[100px] text-right shrink-0 whitespace-nowrap tabular-nums">
                        <span
                          className={`font-display font-semibold ${
                            item.isIncludedInPlan ? "text-lime text-xs" : "text-white text-sm"
                          }`}
                        >
                          {item.isIncludedInPlan
                            ? "Incluso"
                            : `${formatBrl(item.priceNum)}`}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Divisor e Total */}
                <div className="mt-6 border-t border-white/10 pt-5">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-xs uppercase tracking-wider text-white/50 block mb-0.5">
                        Total Mensal Estimado
                      </span>
                      <div className="inline-flex items-baseline whitespace-nowrap tabular-nums">
                        <span className="font-display text-3xl font-bold tracking-tight text-lime xl:text-4xl">
                          {summary.formattedTotal}
                        </span>
                        <span className="text-xs text-white/60 font-normal">/mês</span>
                      </div>
                    </div>
                  </div>

                  {/* Frase discreta de simulação requerida */}
                  <div className="mt-4 flex items-start gap-2 rounded-xl bg-white/[0.03] p-3 text-xs text-white/60">
                    <Info size={15} className="mt-0.5 shrink-0 text-lime" />
                    <span>
                      Valores para simulação. Condições de adesão, instalação e viabilidade de endereço são confirmadas diretamente pelo comercial.
                    </span>
                  </div>

                  {/* Botão de WhatsApp */}
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-lime mt-6 flex w-full items-center justify-center gap-2 py-4 text-center font-display text-base font-semibold shadow-[0_12px_30px_rgba(112,224,0,0.3)] hover:shadow-[0_16px_40px_rgba(112,224,0,0.5)]"
                  >
                    <MessageCircle size={18} />
                    Falar com o comercial
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Barra de resumo fixa no rodapé para Celular e Tablet */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-navy-ink/95 px-3 py-2.5 shadow-[0_-10px_35px_rgba(0,0,0,0.7)] backdrop-blur-xl lg:hidden">
        <div className="mx-auto flex max-w-lg items-center justify-between gap-3 px-1 sm:px-4">
          <div className="min-w-0 flex-1">
            <button
              type="button"
              onClick={() => setMobileSummaryOpen((v) => !v)}
              className="flex items-center gap-1 text-[11px] font-medium text-white/60 hover:text-white"
            >
              <span>{summary.items.length} itens no combo</span>
              {mobileSummaryOpen ? <ChevronDown size={13} /> : <ChevronUp size={13} />}
            </button>
            <div className="inline-flex items-baseline whitespace-nowrap tabular-nums">
              <span className="font-display text-xl font-bold text-lime sm:text-2xl tracking-tight">
                {summary.formattedTotal}
              </span>
              <span className="text-[11px] text-white/60 font-normal">/mês</span>
            </div>
          </div>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="btn-lime min-h-[40px] px-3.5 py-2 text-xs font-semibold shrink-0"
          >
            <MessageCircle size={15} />
            <span>Contratar</span>
          </a>
        </div>

        {/* Modal / gaveta com detalhamento dos itens no mobile */}
        <AnimatePresence>
          {mobileSummaryOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: EASE }}
              className="overflow-hidden border-t border-white/10 mt-3 pt-3"
            >
              <div className="max-h-60 overflow-y-auto divide-y divide-white/5 pr-1">
                {summary.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between py-2 text-xs">
                    <div>
                      <span className="font-medium text-white">{item.title}</span>
                      {item.detail && <span className="block text-white/50">{item.detail}</span>}
                    </div>
                    <span className={item.isIncludedInPlan ? "text-lime font-medium" : "text-white"}>
                      {item.isIncludedInPlan ? "Incluso" : formatBrl(item.priceNum)}
                    </span>
                  </div>
                ))}
              </div>
              <p className="mt-2 text-[10px] text-white/50">
                * Simulação com valores estimados. A contratação definitiva é realizada via atendimento comercial.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Dúvidas frequentes sobre o Combo */}
      <Section tag="Tire suas dúvidas" title={["Perguntas sobre", <span key="faq-acc" className="italic text-lime">o seu combo.</span>]}>
        <Faq
          items={[
            {
              q: "O que acontece ao clicar em 'Falar com o comercial'?",
              a: "Você será direcionado diretamente para uma conversa no WhatsApp da INET com todas as suas escolhas já pré-configuradas. Um atendente de Teófilo Otoni irá confirmar a viabilidade técnica no seu endereço e finalizar o pedido sem burocracia.",
            },
            {
              q: "Posso adicionar ou remover itens depois da contratação?",
              a: "Sim. Os serviços adicionais do combo podem ser ativados ou alterados a qualquer momento pelo canal de atendimento comercial.",
            },
            {
              q: "A instalação do combo possui custo inicial?",
              a: "A instalação padrão da fibra óptica da INET não tem custo nos planos residenciais publicados.",
            },
            {
              q: "Como funciona a cobrança de múltiplos serviços?",
              a: "Todos os serviços contratados no combo são unificados em uma única fatura mensal, facilitando a gestão e o pagamento pelo aplicativo ou boleto.",
            },
          ]}
        />
      </Section>
      </SectionBackdrop>
    </div>
  );
}
