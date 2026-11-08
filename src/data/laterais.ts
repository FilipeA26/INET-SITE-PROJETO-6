import { COMPANY, COVERAGE_CITIES, PHONES, SPEEDTESTS, STORES, waLink } from './inet';

export type LateralCard = { id: string; title: string; text: string; action: string; href: string; icon: 'chat' | 'client' | 'pin' | 'speed' | 'phone' };
export type LateralContext = 'inicio' | 'planos' | 'cobertura' | 'autoatendimento' | 'lojas';
const commercial: LateralCard = { id: 'comercial', title: 'Vamos conversar?', text: PHONES[0].display, action: 'Comercial no WhatsApp', href: waLink(), icon: 'chat' };
const client: LateralCard = { id: 'central', title: 'Já é cliente?', text: 'Central do Cliente INET', action: 'Acessar a central', href: COMPANY.clientArea, icon: 'client' };
const coverage: LateralCard = { id: 'cobertura', title: 'A INET perto de você', text: COVERAGE_CITIES.join(' e '), action: 'Consultar cobertura', href: '/cobertura', icon: 'pin' };
const speed: LateralCard = { id: 'velocidade', title: 'Como está sua conexão?', text: SPEEDTESTS[1].name, action: 'Testar velocidade', href: SPEEDTESTS[1].url, icon: 'speed' };
export const LATERAIS: Record<LateralContext, readonly LateralCard[]> = {
  inicio: [coverage, client],
  planos: [commercial, coverage],
  cobertura: [coverage, commercial],
  autoatendimento: [client, speed],
  lojas: STORES.slice(0, 2).map((store, i) => ({ id: `loja-${i}`, title: store.name, text: store.address, action: 'Como chegar', href: store.maps, icon: 'pin' })),
};
