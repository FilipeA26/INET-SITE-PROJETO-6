import { ArrowUp, Instagram, MessageCircle, Phone } from "lucide-react";
import { Rise } from "./Lines";
import { PHONE, waLink } from "../lib";

export default function Footer() {
  return (
    <footer className="relative">
      {/* fim do fio: a luz termina no botão de voltar ao início */}
      <span data-node="center" className="absolute left-1/2 top-24" />
      <div className="wrap flex flex-col items-center pb-10 pt-40 text-center">
        <Rise>
          <a href="#inicio" className="group inline-flex flex-col items-center gap-4 text-white/70 transition-colors duration-500 hover:text-white">
            <span className="flex h-14 w-14 items-center justify-center rounded-full border border-white/20 transition-[transform,border-color,background-color] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1 group-hover:border-lime group-hover:bg-lime group-hover:text-navy-ink">
              <ArrowUp size={20} />
            </span>
            <span className="text-sm">Voltar ao início</span>
          </a>
        </Rise>

        <div className="mt-20 flex w-full flex-col items-center justify-between gap-5 border-t border-white/10 pt-8 text-xs text-white/50 md:flex-row">
          <img src="/inet-logo-branca.png" alt="INET Internet Fibra Óptica" className="h-7 w-auto opacity-80" />
          <div className="flex flex-wrap justify-center gap-6">
            <a href="tel:+553335363939" className="inline-flex items-center gap-1.5 hover:text-lime"><Phone size={13} /> {PHONE}</a>
            <a href={waLink()} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 hover:text-lime"><MessageCircle size={13} /> WhatsApp</a>
            <a href="https://instagram.com/inetminas" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 hover:text-lime"><Instagram size={13} /> @inetminas</a>
          </div>
          <span>© {new Date().getFullYear()} INET – Internet Fibra Óptica</span>
        </div>
      </div>
    </footer>
  );
}
