/**
 * Dados institucionais e comerciais da INET.
 *
 * Fonte: site anterior inetminas.com.br, recuperado do Internet Archive
 * (capturas de jun/2025 e out/2025; imagens dos planos publicadas em 2023/07 e 2023/11).
 * Nada aqui foi inventado. Itens marcados com `validar` precisam de confirmação da
 * empresa antes da publicação (preços podem ter mudado desde a captura).
 */

export const COMPANY = {
  name: "INET",
  legalName: "INET TELECOMUNICAÇÕES LTDA",
  cnpj: "13.635.858/0001-74",
  site: "https://inetminas.com.br",
  city: "Teófilo Otoni",
  state: "MG",
  contractPdf: "https://inetminas.com.br/wp-content/uploads/2023/04/contrato_prestacao_servico.pdf",
  clientArea: "https://ixc.inetminas.com.br/central_assinante_web/login",
};

export const PHONES = [
  { label: "Telefone e WhatsApp", display: "(33) 3536-3939", tel: "+553335363939" },
  { label: "Telefone", display: "(33) 3508-0811", tel: "+553335080811" },
  { label: "Ligação gratuita", display: "0800 500 3939", tel: "08005003939" },
];

export const WHATSAPP = "553335363939";
export const waLink = (msg = "Olá! Venho do site inetminas.com.br.") =>
  `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`;

export const EMAILS = [
  { area: "Suporte", email: "suporte@inetminas.com.br" },
  { area: "Financeiro", email: "financeiro@inetminas.com.br" },
  { area: "Agendamento", email: "agendamento@inetminas.com.br" },
  { area: "Fiscal", email: "fiscal@inetminas.com.br" },
  { area: "Compras", email: "compras@inetminas.com.br" },
  { area: "Infraestrutura", email: "infraestrutura@inetminas.com.br" },
  { area: "Marketing", email: "marketing@inetminas.com.br" },
  { area: "Recursos Humanos", email: "rh@inetminas.com.br" },
];

export const SOCIAL = [
  { name: "Instagram", url: "https://www.instagram.com/inetminas/" },
  { name: "Facebook", url: "https://www.facebook.com/inetminas" },
  { name: "YouTube", url: "https://www.youtube.com/channel/UCwotmrFpg8PryQXwD7Qaywg" },
];

/**
 * Lojas. Endereços confirmados no site anterior. As coordenadas são aproximadas
 * (geocodificação da rua no OpenStreetMap), por isso o mapa usa o link oficial
 * "Como chegar" publicado pela INET para a localização exata.
 * validar: a loja da Av. Alfredo Sá aparece como "Concórdia" na página inicial
 * antiga e como "Teó Shopping" na página de contato.
 */
export const STORES = [
  { name: "Loja Centro", address: "Avenida Getúlio Vargas, 1055 – Centro", maps: "https://goo.gl/maps/EW259th22mrKUd3G8", lat: -17.8678, lng: -41.5079 },
  { name: "Loja Grão Pará", address: "Rua Doutor Onofre, 156 – Grão Pará", maps: "https://goo.gl/maps/GNgwSJFek2yKAFJN6", lat: -17.8603, lng: -41.5073 },
  { name: "Loja Concórdia", address: "Avenida Alfredo Sá, 2225 – Concórdia (Teó Shopping)", maps: "https://goo.gl/maps/KcoupwZpWDgsDGzf8", lat: -17.8557, lng: -41.5146 },
];

export const CITY_CENTER: [number, number] = [-17.8595, -41.5087];

/** Medidores oficiais usados no site anterior (servidor "Inet Telecom"). */
export const SPEEDTESTS = [
  { id: "minhaconexao", name: "Minha Conexão", embed: "https://www.minhaconexao.com.br/widgets/speedometer?provider=inet-telecom", url: "https://www.minhaconexao.com.br/" },
  { id: "speedtest", name: "Speedtest INET", embed: "https://inetminas.speedtestcustom.com/", url: "https://inetminas.speedtestcustom.com/" },
];
export const NPERF_URL = "https://www.nperf.com/pt/";

export type Plan = {
  id: string;
  name: string;
  price: string;
  speed: string;
  unit: "Mega" | "Giga";
  extra?: string;
  includes: string[];
  perks: string[];
  description: string;
  note?: string;
};

export type PlanGroup = { id: string; label: string; plans: Plan[] };

const STD = ["Clube de Vantagens INET", "Sem custo de instalação", "Wi-Fi grátis"];
const PREPAID = "Taxa de instalação R$ 230,00 à vista ou em 3x no cartão · plano pré-pago · mínimo de 30 dias";

/** Planos publicados no site anterior. validar: preços e composição atuais. */
export const PLAN_GROUPS: PlanGroup[] = [
  {
    id: "familia",
    label: "Família",
    plans: [
      { id: "plus-tv", name: "INET Plus TV", price: "99,90", speed: "650", unit: "Mega", includes: ["+ de 100 canais de TV", "App Mumo", "App Bebanca"], perks: STD, description: "Conexão de alta velocidade com download e upload rápidos para uma navegação fluida." },
      { id: "musica", name: "INET Música", price: "119,90", speed: "700", unit: "Mega", includes: ["App Deezer", "App Mumo"], perks: STD, description: "Internet para ouvir música com conexão rápida e acesso ilimitado a milhões de faixas." },
      { id: "hbo-max", name: "INET HBO Max", price: "129,90", speed: "700", unit: "Mega", includes: ["+ de 100 canais de TV", "App Mumo", "App Bebanca", "HBO Max"], perks: STD, description: "Internet rápida com HBO Max e TV incluídos." },
      { id: "gamer", name: "Plano Gamer", price: "199,90", speed: "1", unit: "Giga", includes: ["+ de 100 canais de TV", "App Deezer", "Roteador Wi-Fi 6", "Cabeamento de 1 dispositivo"], perks: ["Clube de Vantagens INET", "Sem custo de instalação", "Wi-Fi premium grátis"], description: "1 Giga com Wi-Fi premium para turbinar seus jogos. Chega de lag ou ping alto." },
    ],
  },
  {
    id: "casa-inteligente",
    label: "Casa inteligente",
    plans: [
      { id: "casa-segura", name: "INET Casa Segura", price: "119,90", speed: "400", unit: "Mega", includes: ["Câmera Wi-Fi"], perks: STD, description: "Inclui uma câmera Wi-Fi que transmite imagens para o seu smartphone." },
      { id: "sala-inteligente", name: "INET Sala Inteligente", price: "129,90", speed: "400", unit: "Mega", includes: ["Lâmpada inteligente", "Tomada inteligente", "Controle infravermelho inteligente"], perks: STD, description: "Kit sala inteligente: comandar sua casa nunca foi tão fácil." },
      { id: "wifi-mesh", name: "INET Wi-Fi Mesh", price: "129,90", speed: "650", unit: "Mega", includes: ["+ de 100 canais de TV", "App Mumo", "2 roteadores mesh"], perks: ["Clube de Vantagens INET", "Sem custo de instalação", "Wi-Fi premium grátis"], description: "Tecnologia mesh para ampliar a cobertura do Wi-Fi pela casa com eficiência e estabilidade." },
      { id: "casa-inteligente", name: "INET Casa Inteligente", price: "149,90", speed: "700", unit: "Mega", includes: ["+ de 100 canais de TV", "App Mumo", "Assistente virtual Alexa"], perks: ["Clube de Vantagens INET", "Sem custo de instalação", "Wi-Fi premium grátis"], description: "Alta velocidade + Alexa para transformar sua casa em uma casa inteligente." },
    ],
  },
  {
    id: "populares",
    label: "Populares",
    plans: [
      { id: "popular", name: "INET Popular", price: "69,90", speed: "50", unit: "Mega", includes: ["Roteador Wi-Fi"], perks: ["Wi-Fi grátis"], description: "Plano popular fibra óptica de 50 Mega com Wi-Fi grátis.", note: "Taxa de instalação R$ 230,00 à vista ou em 3x no cartão · plano pré-pago" },
      { id: "fit", name: "INET Fit", price: "74,90", speed: "80", unit: "Mega", includes: ["Roteador Wi-Fi"], perks: ["Sem custo de instalação", "Wi-Fi grátis"], description: "Plano popular fibra óptica de 80 Mega com Wi-Fi grátis." },
      { id: "basico", name: "Plano Básico", price: "84,90", speed: "200", unit: "Mega", includes: ["Roteador Wi-Fi"], perks: ["Sem custo de instalação", "Wi-Fi grátis"], description: "Plano popular fibra óptica de 200 Mega com Wi-Fi grátis." },
      { id: "economico", name: "INET Econômico", price: "89,90", speed: "300", unit: "Mega", includes: ["Roteador Wi-Fi"], perks: ["Sem custo de instalação", "Wi-Fi grátis"], description: "Plano popular fibra óptica de 300 Mega com Wi-Fi grátis." },
    ],
  },
  {
    id: "sem-fidelidade",
    label: "Sem fidelidade",
    plans: [
      { id: "livre", name: "INET Livre", price: "149,90", speed: "500", unit: "Mega", includes: ["Roteador Wi-Fi"], perks: ["Wi-Fi grátis", "Cancele quando quiser"], description: "Fibra óptica de 500 Mega sem fidelidade.", note: PREPAID },
      { id: "livre-mais", name: "INET Livre Mais", price: "169,90", speed: "700", unit: "Mega", includes: ["Roteador Wi-Fi"], perks: ["Wi-Fi grátis", "Cancele quando quiser"], description: "Fibra óptica de 700 Mega sem fidelidade.", note: PREPAID },
      { id: "livre-giga", name: "INET Livre Giga", price: "219,90", speed: "1", unit: "Giga", includes: ["Roteador Wi-Fi"], perks: ["Wi-Fi grátis", "Cancele quando quiser"], description: "Fibra óptica de 1 Giga sem fidelidade.", note: PREPAID },
    ],
  },
  {
    id: "fixo",
    label: "Com telefone fixo",
    plans: [
      { id: "combo-fixo-lite", name: "Combo Fixo Lite", price: "129,90", speed: "300", unit: "Mega", includes: ["Telefonia ilimitada", "+ de 100 canais de TV", "App Mumo", "App Bebanca"], perks: STD, description: "300 Mega com telefonia ilimitada e vários apps para a família." },
      { id: "combo-fixo", name: "Combo Fixo", price: "139,90", speed: "650", unit: "Mega", includes: ["Telefonia ilimitada", "+ de 100 canais de TV", "App Mumo", "App Bebanca"], perks: STD, description: "650 Mega com telefonia ilimitada e vários apps para a família." },
      { id: "mega-combo-fixo", name: "Mega Combo Fixo", price: "149,90", speed: "700", unit: "Mega", includes: ["Telefonia ilimitada", "+ de 100 canais de TV", "App Mumo", "App Bebanca"], perks: STD, description: "700 Mega com telefonia ilimitada e vários apps para a família." },
    ],
  },
  {
    id: "movel",
    label: "Com chip móvel",
    plans: [
      { id: "economico-10g", name: "INET Econômico + 10 Giga", price: "139,90", speed: "300", unit: "Mega", extra: "+ 10 Giga móvel", includes: ["Chip 5G", "Ligações ilimitadas para todo o Brasil", "WhatsApp ilimitado", "Waze ilimitado", "Roteador Wi-Fi"], perks: ["Chip 5G", "Sem custo de instalação", "Wi-Fi grátis"], description: "300 Mega + 10 Giga móvel com Wi-Fi grátis e ligações ilimitadas para todo o Brasil." },
      { id: "plus-tv-10g", name: "INET Plus TV + 10 Giga", price: "149,90", speed: "650", unit: "Mega", extra: "+ 10 Giga móvel", includes: ["Chip 5G", "Ligações ilimitadas para todo o Brasil", "WhatsApp ilimitado", "Waze ilimitado", "+ de 100 canais de TV", "App Mumo", "App Bebanca"], perks: ["Chip 5G", "Clube de Vantagens INET", "Sem custo de instalação", "Wi-Fi grátis"], description: "Para quem quer falar à vontade e assistir aos melhores canais." },
    ],
  },
];

/** Depoimentos publicados no site anterior. */
export const TESTIMONIALS = [
  { text: "Super satisfeita com a Inet, recomendo a todos!", name: "Karolaynne Sousa", handle: "@karolsousa.99" },
  { text: "Muito top! A Inet é a melhor internet que já tive!", name: "William Alef", handle: "@william.alef" },
  { text: "Uso para trabalho e lazer, a Inet nunca me deixa na mão!", name: "Vinicius Couto", handle: "@vinis_c" },
  { text: "Amo a Inet! Internet rápida, não trava, a melhor!", name: "Cíntia Cantão", handle: "@cintiacantao" },
  { text: "Uso a internet para trabalho e estou super satisfeito!", name: "Luiz Antonio", handle: "@lluisantonio5" },
  { text: "Internet boa demais, a Inet me atende em tudo!", name: "Welington Martins", handle: "@didifilme" },
];

export const NETFIBRA = {
  web: "https://netfibratv.com.br/",
  playStore: "https://play.google.com/store/apps/details?id=br.com.netfibratv.mobile",
  appStore: "https://apps.apple.com/br/app/net-fibra-iptv/id6443505002",
  receiverPrice: "19,90", // validar
};

export const ANYDESK_URL = "https://download.anydesk.com/AnyDesk.exe";
