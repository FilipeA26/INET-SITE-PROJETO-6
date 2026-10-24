import { motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { ArrowUpRight, Quote, Star } from "lucide-react";
import { Rise } from "../components/Lines";
import { CtaBand, PageHero, Section, usePageMeta } from "../components/ui";
import { DUR, EASE } from "../motion";
import { GOOGLE_REVIEW_URL, TESTIMONIALS, waLink } from "../data/inet";

const STEPS = ["Aponte a câmera do celular para o QR code", "Escolha de 1 a 5 estrelas", "Conte como é a sua internet INET"];

export default function Avaliacoes() {
  usePageMeta("Depoimentos e avaliações", "O que os clientes falam da INET e como avaliar a INET no Google: aponte a câmera para o QR code e deixe sua opinião.");

  return (
    <>
      <PageHero
        tag="Depoimentos e avaliações"
        title={["Quem é INET", <span className="italic text-lime">não troca.</span>]}
        lead="Veja o que os clientes contam sobre a internet da INET e deixe a sua avaliação no Google. Leva menos de um minuto."
      >
        <a href="#avaliar" className="btn-lime">Avaliar no Google</a>
      </PageHero>

      <Section tag="Depoimentos" title={["O que dizem", "nossos clientes."]}>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <Rise key={t.handle} delay={(i % 3) * 0.06} className="h-full">
              <figure className="card flex h-full flex-col p-7">
                <Quote size={26} aria-hidden="true" className="card-icon text-lime" />
                <blockquote className="mt-4 flex-1 font-display text-xl font-light leading-snug">“{t.text}”</blockquote>
                <figcaption className="mt-6 text-sm"><span className="font-semibold">{t.name}</span> <span className="text-white/50">{t.handle}</span></figcaption>
              </figure>
            </Rise>
          ))}
        </div>
      </Section>

      <Section id="avaliar" tag="Avalie a INET" title={["Sua opinião", <span className="italic text-lime">faz a diferença.</span>]}>
        <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-[radial-gradient(90%_120%_at_90%_10%,#38B00022,transparent_55%),linear-gradient(135deg,#021A4A,#010818_70%)] p-8 sm:p-14">
          <div className="relative grid items-center gap-12 lg:grid-cols-[1fr_auto]">
            <div>
              <p className="lead max-w-xl">Avaliar a INET no Google ajuda outras famílias a escolherem a melhor internet e mostra para a nossa equipe o que podemos melhorar.</p>
              <ol className="mt-8 space-y-4">
                {STEPS.map((s, i) => (
                  <Rise key={s} delay={i * 0.08}>
                    <li className="flex items-center gap-4">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-lime/50 font-display text-lime">{i + 1}</span>
                      <span className="text-white/80">{s}</span>
                    </li>
                  </Rise>
                ))}
              </ol>
              <a href={GOOGLE_REVIEW_URL} target="_blank" rel="noreferrer" className="btn-ghost mt-9">
                No celular? Toque aqui para avaliar <ArrowUpRight size={15} aria-hidden="true" />
              </a>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.92, rotate: -3 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: DUR, ease: EASE }}
              className="relative mx-auto"
            >
              <div aria-hidden="true" className="absolute -inset-6 rounded-[2.5rem] bg-lime/20 blur-2xl" />
              <div className="relative rounded-[2rem] bg-white p-5 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.8)]">
                <QRCodeSVG value={GOOGLE_REVIEW_URL} size={208} level="M" fgColor="#010818" title="QR code para avaliar a INET no Google" />
                <p className="mt-3 flex items-center justify-center gap-1.5 text-sm font-semibold text-[#010818]">
                  <Star size={15} aria-hidden="true" className="fill-[#38B000] text-[#38B000]" /> Avalie no Google
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </Section>

      <CtaBand title={["Teve algum", <span className="italic text-lime">problema?</span>]} text="Antes de avaliar, fale com a gente: queremos resolver.">
        <a href={waLink("Olá! Quero falar com a INET sobre o meu atendimento.")} target="_blank" rel="noreferrer" className="btn-lime">Falar no WhatsApp</a>
      </CtaBand>
    </>
  );
}
