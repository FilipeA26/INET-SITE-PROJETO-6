/**
 * Regras de negócio e dados da simulação "Monte seu combo" da INET.
 *
 * Fontes:
 * - Planos de Internet fibra: PLAN_GROUPS "principais" (700, 800 e 1 Giga) em src/data/inet.ts
 * - INET TV: INET_TV em src/data/inet.ts (tabela de 26/10/2026: R$ 29,90)
 * - Câmeras e streaming: ADDONS em src/data/inet.ts (tabela de 26/10/2026)
 * - Wi-Fi Mesh: valor fictício R$ 29,90/mês // fictício — validar
 */

import { ADDONS, INET_TV, PLAN_GROUPS, waLink, type Plan } from "./inet";

/** Converte string de preço (ex: "99,90" ou "1.299,90") para número decimal. */
export function parseBrl(priceStr: string): number {
  if (!priceStr) return 0;
  const clean = priceStr.replace(/[^\d,.-]/g, "").replace(/\./g, "").replace(",", ".");
  const num = parseFloat(clean);
  return isNaN(num) ? 0 : num;
}

/** Formata número em Real brasileiro (R$ 00,00). */
export function formatBrl(val: number): string {
  return val.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

/** Planos de internet elegíveis para o combo (700 Mega, 800 Mega e 1 Giga). */
export const COMBO_PLANS: Plan[] =
  PLAN_GROUPS.find((g) => g.id === "principais")?.plans ?? [];

/** Adicional Wi-Fi Mesh */
export const MESH_ADDON = {
  id: "mesh",
  name: "Rede Wi-Fi Mesh",
  price: "29,90", // fictício — validar
  priceNum: 29.9, // fictício — validar
  description: "Amplia o Wi-Fi para mais cômodos.",
};

/** Opções de Câmera de Segurança */
export type CameraOptionId = "none" | "interna" | "externa";

const internalCameraPrice =
  ADDONS.smartHome.find((c) => c.name.toLowerCase().includes("interna"))?.price || "19,90";
const externalCameraPrice =
  ADDONS.smartHome.find((c) => c.name.toLowerCase().includes("externa"))?.price || "29,90";

export interface CameraOption {
  id: CameraOptionId;
  name: string;
  price: string;
  priceNum: number;
  description: string;
}

export const CAMERA_OPTIONS: CameraOption[] = [
  {
    id: "none",
    name: "Nenhuma câmera",
    price: "0,00",
    priceNum: 0,
    description: "Sem câmeras no combo.",
  },
  {
    id: "interna",
    name: "Câmera interna",
    price: internalCameraPrice,
    priceNum: parseBrl(internalCameraPrice),
    description: "Para ambientes internos.",
  },
  {
    id: "externa",
    name: "Câmera externa",
    price: externalCameraPrice,
    priceNum: parseBrl(externalCameraPrice),
    description: "Para áreas externas.",
  },
];

/** Adicional INET TV */
export const TV_ADDON = {
  id: "tv",
  name: "INET TV",
  tag: "Canais ao vivo, rádio e filmes",
  price: INET_TV.price,
  priceNum: parseBrl(INET_TV.price),
  description: "Canais ao vivo, rádio e filmes.",
};

/** Opções de Streaming */
export interface StreamingOption {
  id: string;
  name: string;
  category: string;
  price: string;
  priceNum: number;
  description: string;
  includedInPlans: string[]; // IDs dos planos que já trazem o streaming incluído
}

const findStreamingPrice = (namePattern: string, fallback: string): string => {
  return (
    ADDONS.streaming.find((s) => s.name.toLowerCase().includes(namePattern.toLowerCase()))?.price ||
    fallback
  );
};

export const STREAMING_OPTIONS: StreamingOption[] = [
  {
    id: "disney",
    name: "Disney+",
    category: "Filmes e séries",
    price: findStreamingPrice("disney", "29,90"),
    priceNum: parseBrl(findStreamingPrice("disney", "29,90")),
    description: "Filmes e séries.",
    includedInPlans: [],
  },
  {
    id: "hbo",
    name: "HBO Max",
    category: "Filmes e séries",
    price: findStreamingPrice("hbo", "29,90"),
    priceNum: parseBrl(findStreamingPrice("hbo", "29,90")),
    description: "Filmes e séries.",
    includedInPlans: ["800"], // O plano 800 Mega inclui HBO Max
  },
  {
    id: "globoplay",
    name: "GloboPlay Premium",
    category: "Filmes e séries",
    price: findStreamingPrice("globo", "29,90"),
    priceNum: parseBrl(findStreamingPrice("globo", "29,90")),
    description: "Filmes e séries.",
    includedInPlans: [],
  },
  {
    id: "deezer",
    name: "Deezer",
    category: "Música",
    price: findStreamingPrice("deezer", "14,90"),
    priceNum: parseBrl(findStreamingPrice("deezer", "14,90")),
    description: "Música.",
    includedInPlans: ["700", "1000"], // 700 Mega e 1 Giga incluem Deezer
  },
];

/** Estado da seleção do combo */
export interface ComboSelection {
  planId: string;
  hasMesh: boolean;
  cameraId: CameraOptionId;
  hasTv: boolean;
  streamings: string[];
}

/** Item discriminado do resumo */
export interface ComboSummaryItem {
  category: string;
  title: string;
  detail?: string;
  priceNum: number;
  isIncludedInPlan?: boolean;
}

/** Calcula o total do combo e a lista discriminada de itens */
export function calculateComboTotal(selection: ComboSelection) {
  const items: ComboSummaryItem[] = [];
  let total = 0;

  // 1. Plano de Internet
  const plan = COMBO_PLANS.find((p) => p.id === selection.planId) || COMBO_PLANS[0];
  if (plan) {
    const planPrice = parseBrl(plan.price);
    total += planPrice;
    items.push({
      category: "Internet Fibra",
      title: plan.name,
      detail: `${plan.speed} ${plan.unit} de velocidade`,
      priceNum: planPrice,
    });
  }

  // 2. Wi-Fi Mesh
  if (selection.hasMesh) {
    total += MESH_ADDON.priceNum;
    items.push({
      category: "Wi-Fi Avançado",
      title: MESH_ADDON.name,
      detail: "Amplia o Wi-Fi para mais cômodos",
      priceNum: MESH_ADDON.priceNum,
    });
  }

  // 3. Câmera
  if (selection.cameraId !== "none") {
    const cam = CAMERA_OPTIONS.find((c) => c.id === selection.cameraId);
    if (cam) {
      total += cam.priceNum;
      items.push({
        category: "Segurança Residencial",
        title: cam.name,
        priceNum: cam.priceNum,
      });
    }
  }

  // 4. INET TV
  if (selection.hasTv) {
    total += TV_ADDON.priceNum;
    items.push({
      category: "Televisão",
      title: TV_ADDON.name,
      detail: "Canais ao vivo, rádio e filmes",
      priceNum: TV_ADDON.priceNum,
    });
  }

  // 5. Streaming
  selection.streamings.forEach((streamId) => {
    const stream = STREAMING_OPTIONS.find((s) => s.id === streamId);
    if (!stream) return;

    // Verifica se já está incluso no plano selecionado
    const isIncluded = stream.includedInPlans.includes(selection.planId);
    const priceNum = isIncluded ? 0 : stream.priceNum;
    total += priceNum;

    items.push({
      category: "Entretenimento",
      title: stream.name,
      detail: isIncluded ? `Incluso no plano ${plan?.speed} ${plan?.unit}` : stream.category,
      priceNum,
      isIncludedInPlan: isIncluded,
    });
  });

  return {
    total,
    items,
    formattedTotal: formatBrl(total),
  };
}

/** Gera a mensagem formatada para abertura no WhatsApp com waLink() */
export function buildComboWhatsAppMessage(selection: ComboSelection): string {
  const plan = COMBO_PLANS.find((p) => p.id === selection.planId) || COMBO_PLANS[0];
  const totalData = calculateComboTotal(selection);

  const lines: string[] = [
    "Olá! Montei meu combo personalizado no site inetminas.com.br e gostaria de contratar com o setor comercial:",
    "",
    `🌐 *Plano de Internet:* ${plan?.name || "Fibra"} (${formatBrl(parseBrl(plan?.price || "0"))}/mês)`,
    `📶 *Wi-Fi Mesh:* ${selection.hasMesh ? `Sim (+ ${formatBrl(MESH_ADDON.priceNum)}/mês)` : "Não"}`,
  ];

  if (selection.cameraId === "none") {
    lines.push(`📷 *Câmera:* Nenhuma`);
  } else {
    const cam = CAMERA_OPTIONS.find((c) => c.id === selection.cameraId);
    lines.push(`📷 *Câmera:* ${cam?.name || "Câmera"} (+ ${formatBrl(cam?.priceNum || 0)}/mês)`);
  }

  lines.push(`📺 *INET TV:* ${selection.hasTv ? `Sim (+ ${formatBrl(TV_ADDON.priceNum)}/mês)` : "Não"}`);

  if (selection.streamings.length === 0) {
    lines.push(`🎬 *Streaming:* Nenhum adicional`);
  } else {
    const streamDetails = selection.streamings.map((id) => {
      const s = STREAMING_OPTIONS.find((opt) => opt.id === id);
      if (!s) return id;
      const isIncluded = s.includedInPlans.includes(selection.planId);
      return isIncluded ? `${s.name} (Incluso no plano)` : `${s.name} (+ ${formatBrl(s.priceNum)}/mês)`;
    });
    lines.push(`🎬 *Streaming:* ${streamDetails.join(", ")}`);
  }

  lines.push("");
  lines.push(`💰 *Total mensal estimado:* ${totalData.formattedTotal}/mês`);
  lines.push("");
  lines.push("Poderiam verificar a viabilidade técnica e me passar as condições de contratação para o meu endereço?");

  return lines.join("\n");
}

/** Gera a URL do WhatsApp para falar diretamente com o setor comercial */
export function getComboWhatsAppUrl(selection: ComboSelection): string {
  const message = buildComboWhatsAppMessage(selection);
  return waLink(message);
}
