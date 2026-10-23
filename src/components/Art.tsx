/**
 * Artes originais de fundo para os cards de entretenimento (sem imagens de
 * terceiros). Os efeitos só se movem no hover/foco do card, para não distrair.
 */
export type ArtKind = "music" | "drama" | "magic" | "audio" | "tv" | "read" | "fantasy" | "crime" | "survival";

const embers = Array.from({ length: 18 }, (_, i) => ({ left: (i * 37) % 100, delay: (i * 0.37) % 3, size: 2 + (i % 3) }));
const stars = Array.from({ length: 40 }, (_, i) => ({ x: (i * 53) % 100, y: (i * 29) % 70, r: i % 5 === 0 ? 1.6 : 0.8 }));

export default function Art({ kind }: { kind: ArtKind }) {
  switch (kind) {
    case "music":
      // shows, luzes de palco e ondas sonoras
      return (
        <div className="card-media" aria-hidden="true" style={{ background: "radial-gradient(90% 70% at 70% 10%, #a238ff88, transparent 60%), radial-gradient(70% 60% at 10% 30%, #ff3d8e66, transparent 60%), linear-gradient(160deg,#1a0633,#05010d)" }}>
          <div className="absolute inset-x-0 top-0 flex justify-around opacity-60">
            {[0, 1, 2, 3].map((i) => <span key={i} className="block h-56 w-16 origin-top bg-gradient-to-b from-white/30 to-transparent blur-md" style={{ transform: `rotate(${(i - 1.5) * 14}deg)` }} />)}
          </div>
          <div className="absolute inset-x-6 bottom-28 flex h-24 items-end gap-1.5">
            {Array.from({ length: 28 }, (_, i) => (
              <span key={i} className="art-bar flex-1 rounded-full bg-gradient-to-t from-[#ff3d8e] to-[#a238ff]" style={{ height: `${25 + ((i * 47) % 75)}%`, animationDelay: `${(i % 7) * 0.12}s` }} />
            ))}
          </div>
        </div>
      );
    case "drama":
    case "fantasy":
      // brasas subindo sobre um céu escuro (atmosfera de fantasia épica)
      return (
        <div className="card-media" aria-hidden="true" style={{ background: kind === "drama" ? "radial-gradient(80% 60% at 50% 110%, #ff6a0055, transparent 60%), linear-gradient(170deg,#1b0a35,#050208 70%)" : "radial-gradient(80% 60% at 50% 110%, #ff3b0066, transparent 60%), linear-gradient(170deg,#140608,#050102 70%)" }}>
          {embers.map((e, i) => (
            <span key={i} className="art-ember absolute bottom-0 rounded-full bg-[#ffb347]" style={{ left: `${e.left}%`, width: e.size, height: e.size, animationDelay: `${e.delay}s`, boxShadow: "0 0 8px #ff7b00" }} />
          ))}
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/70 to-transparent" />
        </div>
      );
    case "magic":
      // céu estrelado com um arco de luz
      return (
        <div className="card-media" aria-hidden="true" style={{ background: "radial-gradient(120% 80% at 50% 120%, #1d4ed8aa, transparent 60%), linear-gradient(180deg,#020a2a,#06123f)" }}>
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            {stars.map((s, i) => <circle key={i} cx={s.x} cy={s.y} r={s.r * 0.35} fill="white" className="art-twinkle" style={{ animationDelay: `${(i % 6) * 0.4}s` }} />)}
            <path d="M-5 95 Q50 20 105 95" fill="none" stroke="url(#arc)" strokeWidth="0.8" />
            <defs><linearGradient id="arc"><stop stopColor="#fff" stopOpacity="0" /><stop offset=".5" stopColor="#bfe0ff" /><stop offset="1" stopColor="#fff" stopOpacity="0" /></linearGradient></defs>
          </svg>
        </div>
      );
    case "audio":
      // ondas de rádio concêntricas
      return (
        <div className="card-media" aria-hidden="true" style={{ background: "radial-gradient(70% 60% at 50% 35%, #ff5a3c66, transparent 65%), linear-gradient(170deg,#2a0b05,#070201)" }}>
          {[1, 2, 3, 4, 5].map((r) => (
            <span key={r} className="art-ring absolute left-1/2 top-[35%] rounded-full border border-[#ff8a65]/40" style={{ width: r * 70, height: r * 70, marginLeft: -r * 35, marginTop: -r * 35, animationDelay: `${r * 0.25}s` }} />
          ))}
        </div>
      );
    case "tv":
      return (
        <div className="card-media" aria-hidden="true" style={{ background: "radial-gradient(80% 60% at 50% 30%, #6d28d977, transparent 60%), linear-gradient(170deg,#0f0626,#03010a)" }}>
          <div className="absolute left-1/2 top-[18%] h-28 w-44 -translate-x-1/2 rounded-xl border border-white/20 bg-gradient-to-br from-[#7c3aed55] to-[#0062EC55] shadow-[0_0_60px_#7c3aed66]" />
        </div>
      );
    case "read":
      return (
        <div className="card-media" aria-hidden="true" style={{ background: "radial-gradient(70% 60% at 50% 30%, #f5b70055, transparent 60%), linear-gradient(170deg,#1f1400,#070400)" }}>
          {[0, 1, 2].map((i) => (
            <span key={i} className="absolute left-1/2 top-[16%] h-32 w-24 rounded-md border border-white/15 bg-gradient-to-br from-[#ffd34d33] to-transparent" style={{ transform: `translateX(${-50 + (i - 1) * 40}%) rotate(${(i - 1) * 8}deg)` }} />
          ))}
        </div>
      );
    case "crime":
      // deserto em tons de âmbar e verde ácido
      return (
        <div className="card-media" aria-hidden="true" style={{ background: "linear-gradient(180deg,#0c1a0a 0%,#3d3a12 55%,#a8761f 100%)" }}>
          <div className="absolute inset-x-0 top-[48%] h-px bg-[#e8d36a]/60 shadow-[0_0_30px_#e8d36a]" />
          <div className="absolute inset-0 bg-[radial-gradient(60%_40%_at_70%_30%,#b7ff3b33,transparent_70%)]" />
        </div>
      );
    case "survival":
      // névoa fria sobre uma floresta escura
      return (
        <div className="card-media" aria-hidden="true" style={{ background: "linear-gradient(180deg,#1c2622 0%,#0b100e 60%,#050706 100%)" }}>
          <svg className="absolute inset-x-0 bottom-0 h-1/2 w-full" viewBox="0 0 100 50" preserveAspectRatio="none">
            <path d="M0 50 L0 30 L6 18 L10 30 L16 12 L22 30 L28 20 L34 32 L40 14 L46 30 L52 22 L58 34 L64 16 L70 30 L76 20 L82 32 L88 18 L94 30 L100 24 L100 50Z" fill="#050807" />
          </svg>
          <div className="art-fog absolute inset-x-[-20%] bottom-[18%] h-20 bg-gradient-to-r from-transparent via-white/15 to-transparent blur-xl" />
        </div>
      );
  }
}
