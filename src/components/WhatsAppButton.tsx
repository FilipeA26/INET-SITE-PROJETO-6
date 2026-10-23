import { motion } from "framer-motion";
import { DUR, EASE } from "../motion";
import { waLink } from "../data/inet";

/** Atalho fixo no canto inferior direito para falar com os atendentes pelo WhatsApp. */
export default function WhatsAppButton() {
  return (
    <motion.a
      href={waLink()}
      target="_blank"
      rel="noreferrer"
      aria-label="Falar com a INET pelo WhatsApp"
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: DUR, ease: EASE, delay: 1.2 }}
      className="group fixed bottom-5 right-5 z-50 flex items-center"
    >
      <span className="pointer-events-none mr-3 max-w-0 overflow-hidden whitespace-nowrap rounded-full bg-white px-0 py-2 text-[13px] font-semibold text-[#075E54] opacity-0 shadow-lg transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:max-w-[220px] group-hover:px-4 group-hover:opacity-100 group-focus-visible:max-w-[220px] group-focus-visible:px-4 group-focus-visible:opacity-100">
        Fale com um atendente
      </span>
      <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_14px_40px_-10px_rgba(37,211,102,0.8)] transition-transform duration-500 group-hover:scale-105">
        <span aria-hidden="true" className="absolute inset-0 animate-[wa-ping_2.8s_cubic-bezier(0.16,1,0.3,1)_infinite] rounded-full bg-[#25D366]/50 motion-reduce:hidden" />
        <svg viewBox="0 0 32 32" width="28" height="28" aria-hidden="true" className="relative" fill="currentColor">
          <path d="M16.04 3C9.06 3 3.4 8.66 3.4 15.64c0 2.23.58 4.4 1.69 6.32L3.3 28.7l6.9-1.76a12.6 12.6 0 0 0 5.84 1.44h.01c6.97 0 12.64-5.66 12.64-12.64S23.01 3 16.04 3Zm0 23.13h-.01a10.5 10.5 0 0 1-5.35-1.47l-.38-.23-4.1 1.05 1.1-3.99-.25-.41a10.46 10.46 0 0 1-1.6-5.6c0-5.8 4.72-10.52 10.53-10.52 5.8 0 10.52 4.72 10.52 10.52 0 5.8-4.72 10.65-10.46 10.65Zm5.77-7.88c-.32-.16-1.87-.92-2.16-1.03-.29-.1-.5-.16-.71.16-.21.32-.82 1.03-1 1.24-.18.21-.37.24-.69.08-.32-.16-1.33-.49-2.54-1.57-.94-.84-1.57-1.87-1.75-2.19-.18-.32-.02-.49.14-.65.14-.14.32-.37.48-.56.16-.18.21-.32.32-.53.1-.21.05-.4-.03-.56-.08-.16-.71-1.71-.97-2.34-.26-.62-.52-.53-.71-.54h-.6c-.21 0-.56.08-.85.4-.29.32-1.11 1.09-1.11 2.65s1.14 3.07 1.3 3.28c.16.21 2.24 3.42 5.43 4.8.76.33 1.35.52 1.81.67.76.24 1.45.21 2 .13.61-.09 1.87-.77 2.14-1.5.26-.74.26-1.37.18-1.5-.08-.13-.29-.21-.61-.37Z" />
        </svg>
      </span>
    </motion.a>
  );
}
