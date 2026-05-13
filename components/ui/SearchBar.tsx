"use client";
import { useState, useRef } from "react";
import { Destination } from "@/components/Map/DestinationMarkers";

interface Props { destinations: Destination[]; onSelect: (destination: Destination) => void; }
const CATEGORIES = [
  { value: "all", label: "Todas" },
  { value: "market", label: "Mercados" },
  { value: "factory", label: "Fábricas" },
  { value: "gallery", label: "Galerías" },
];

export default function SearchBar({ destinations, onSelect }: Props) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = destinations.filter((d) => {
    const q = query.toLowerCase();
    return (d.name.toLowerCase().includes(q) || d.address?.toLowerCase().includes(q)) &&
      (category === "all" || d.category === category);
  });

  const showResults = focused && query.length > 0 && filtered.length > 0;

  const handleSelect = (d: Destination) => {
    onSelect(d);
    setQuery("");
    setFocused(false);
    inputRef.current?.blur();
  };

  return (
    <div className="absolute top-[104px] left-1/2 -translate-x-1/2 z-1000 w-[90%] max-w-md">
      <div
        className="bg-white/90 backdrop-blur-xl rounded-2xl border border-white/60 shadow-lg shadow-black/5 transition-all duration-200"
        style={{ boxShadow: focused ? "0 8px 32px rgba(24,95,165,0.12)" : undefined }}
      >
        <div className="flex items-center gap-1 px-3 py-1">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="h-9 text-xs font-medium text-slate-500 border-none bg-transparent outline-none cursor-pointer shrink-0 appearance-none px-1.5"
            style={{ backgroundImage: "none" }}
          >
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
          <input
            ref={inputRef}
            type="text"
            placeholder="Buscar destino..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 200)}
            className="flex-1 h-10 px-2 text-sm text-slate-800 outline-none bg-transparent placeholder:text-slate-400"
          />
          <button
            onClick={() => { if (query) { setQuery(""); inputRef.current?.focus(); } }}
            className="h-9 w-9 flex items-center justify-center shrink-0 text-slate-400 hover:text-[#185FA5] transition-colors rounded-xl hover:bg-slate-100"
          >
            {query ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            )}
          </button>
        </div>
        {showResults && (
          <ul className="max-h-56 overflow-y-auto border-t border-slate-100 pb-1" style={{ animation: "fade-in 0.15s ease-out" }}>
            {filtered.map((d, i) => (
              <li
                key={d.id}
                onMouseDown={() => handleSelect(d)}
                className="flex items-center gap-3 px-4 py-3 hover:bg-[#185FA5]/5 cursor-pointer active:bg-[#185FA5]/10 transition-colors"
                style={{ animation: `fade-in 0.2s ease-out ${i * 0.03}s both` }}
              >
                <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-[11px] shrink-0">
                  {d.category === "market" ? "🛒" : d.category === "factory" ? "🏭" : "🖼️"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 truncate">{d.name}</p>
                  {d.address && <p className="text-xs text-slate-400 truncate">{d.address}</p>}
                </div>
                <span className="text-[10px] font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full shrink-0">
                  {CATEGORIES.find((c) => c.value === d.category)?.label?.slice(0, -1) || d.category}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
