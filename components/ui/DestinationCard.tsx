"use client";
import { Destination } from "@/components/Map/DestinationMarkers";

const CATEGORY_LABEL: Record<string, string> = { market: "Mercado", factory: "Fábrica", gallery: "Galería" };
const CATEGORY_STYLE: Record<string, { bg: string; text: string; dot: string }> = {
  market: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
  factory: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500" },
  gallery: { bg: "bg-sky-50", text: "text-sky-700", dot: "bg-sky-500" },
};

interface Props { destination: Destination | null; onClose: () => void; onRoute: (destination: Destination) => void; }

export default function DestinationCard({ destination, onClose, onRoute }: Props) {
  if (!destination) return null;
  const style = CATEGORY_STYLE[destination.category] || CATEGORY_STYLE.market;

  return (
    <div
      className="absolute bottom-6 left-1/2 -translate-x-1/2 z-1000 w-[90%] max-w-sm safe-bottom"
      style={{ animation: "slide-up 0.35s cubic-bezier(0.16, 1, 0.3, 1)" }}
    >
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl border border-white/60 shadow-xl shadow-black/5 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#185FA5] to-[#2a7fcf]" />

        <div className="px-5 pt-4 pb-2">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${style.bg} ${style.text}`}>
                  {CATEGORY_LABEL[destination.category]}
                </span>
              </div>
              <p className="text-base font-bold text-slate-900 leading-snug">{destination.name}</p>
            </div>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-all flex items-center justify-center shrink-0 text-sm"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="px-5 pb-3 flex flex-col gap-1.5">
          {destination.address && (
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
              <span className="truncate">{destination.address}</span>
            </div>
          )}
          {destination.open_hours && (
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
              <span>{destination.open_hours}</span>
            </div>
          )}
        </div>

        <div className="border-t border-slate-100 px-5 py-3">
          <button
            onClick={() => onRoute(destination)}
            className="w-full py-3 bg-[#185FA5] text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-[#1a6bb8] active:scale-[0.97] transition-all shadow-md shadow-[#185FA5]/20"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 12h18M3 6l9-3 9 3M3 18l9 3 9-3"/></svg>
            Trazar ruta
          </button>
        </div>
      </div>
    </div>
  );
}
