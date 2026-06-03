"use client";

/** Stylized neighborhood map background — northwest Chicago suburbs */
export default function MapCanvasBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Terrain base */}
      <div className="absolute inset-0 bg-[#e8ede3]" />

      {/* Parks & open space */}
      <div className="absolute left-[8%] top-[18%] h-[28%] w-[22%] rounded-[40%] bg-[#c5dab8]/70" />
      <div className="absolute right-[12%] top-[55%] h-[20%] w-[18%] rounded-[35%] bg-[#c5dab8]/60" />
      <div className="absolute left-[55%] top-[8%] h-[15%] w-[12%] rounded-full bg-[#c5dab8]/50" />

      {/* Water */}
      <div className="absolute bottom-[12%] left-[30%] h-[6%] w-[45%] rounded-full bg-[#a8cce8]/50 blur-[1px]" />

      {/* Urban blocks */}
      <div className="absolute inset-0 opacity-[0.35]">
        <svg className="h-full w-full" viewBox="0 0 800 500" preserveAspectRatio="none">
          {/* Major roads */}
          <path d="M0 250 Q200 240 400 250 T800 245" stroke="#ffffff" strokeWidth="14" fill="none" strokeLinecap="round" />
          <path d="M0 250 Q200 240 400 250 T800 245" stroke="#d4d0c8" strokeWidth="8" fill="none" strokeLinecap="round" />
          <path d="M120 0 Q130 180 125 350 T120 500" stroke="#ffffff" strokeWidth="12" fill="none" />
          <path d="M120 0 Q130 180 125 350 T120 500" stroke="#d4d0c8" strokeWidth="6" fill="none" />
          <path d="M350 0 L355 500" stroke="#ffffff" strokeWidth="10" fill="none" />
          <path d="M350 0 L355 500" stroke="#d4d0c8" strokeWidth="5" fill="none" />
          <path d="M580 0 Q590 200 585 400 T580 500" stroke="#ffffff" strokeWidth="11" fill="none" />
          <path d="M580 0 Q590 200 585 400 T580 500" stroke="#d4d0c8" strokeWidth="5" fill="none" />
          <path d="M0 380 Q400 370 800 385" stroke="#ffffff" strokeWidth="9" fill="none" />
          <path d="M0 380 Q400 370 800 385" stroke="#d4d0c8" strokeWidth="4" fill="none" />
          {/* Secondary streets */}
          {[160, 240, 480, 650].map((y) => (
            <line key={`h${y}`} x1="0" y1={y} x2="800" y2={y} stroke="#e8e4dc" strokeWidth="3" />
          ))}
          {[220, 480, 680].map((x) => (
            <line key={`v${x}`} x1={x} y1="0" x2={x} y2="500" stroke="#e8e4dc" strokeWidth="2.5" />
          ))}
        </svg>
      </div>

      {/* Neighborhood labels */}
      <div className="pointer-events-none absolute left-[6%] top-[42%] text-[10px] font-semibold uppercase tracking-widest text-warm-600/40 sm:text-xs">
        Norridge
      </div>
      <div className="pointer-events-none absolute left-[38%] top-[28%] text-[10px] font-semibold uppercase tracking-widest text-warm-600/40 sm:text-xs">
        Park Ridge
      </div>
      <div className="pointer-events-none absolute right-[8%] top-[38%] text-[10px] font-semibold uppercase tracking-widest text-warm-600/40 sm:text-xs">
        Des Plaines
      </div>
      <div className="pointer-events-none absolute bottom-[22%] left-[22%] text-[10px] font-semibold uppercase tracking-widest text-warm-600/35 sm:text-xs">
        Harwood Hts
      </div>
      <div className="pointer-events-none absolute bottom-[30%] right-[28%] text-[10px] font-semibold uppercase tracking-widest text-warm-600/35 sm:text-xs">
        Elmwood Park
      </div>

      {/* Subtle vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-warm-900/5" />
    </div>
  );
}
