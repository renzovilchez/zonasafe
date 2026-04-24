"use client";

import { useState } from "react";
import { Destination } from "@/components/Map/DestinationMarkers";

interface Props {
  destinations: Destination[];
  onSelect: (destination: Destination) => void;
}

const CATEGORIES = [
  { value: "all", label: "Todas" },
  { value: "market", label: "Mercados" },
  { value: "factory", label: "Fábricas" },
  { value: "gallery", label: "Galerías" },
];

export default function SearchBar({ destinations, onSelect }: Props) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [submitted, setSubmitted] = useState(false);

  const filtered = destinations.filter((d) => {
    const matchesQuery = d.name.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = category === "all" || d.category === category;
    return matchesQuery && matchesCategory;
  });

  const handleSearch = () => setSubmitted(true);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleSelect = (d: Destination) => {
    onSelect(d);
    setQuery("");
    setSubmitted(false);
  };

  const showResults = submitted && query.length > 0;

  return (
    <div className="absolute top-20 left-1/2 -translate-x-1/2 z-1000 w-[90%] max-w-md">
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
        <div className="flex items-center gap-0">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="h-11 pl-3 pr-2 text-sm text-gray-600 border-r border-gray-100 bg-gray-50 outline-none cursor-pointer shrink-0"
          >
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Buscar destino..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSubmitted(false);
            }}
            onKeyDown={handleKeyDown}
            className="flex-1 h-11 px-3 text-sm text-gray-800 outline-none placeholder:text-gray-400"
          />

          <button
            onClick={handleSearch}
            className="h-11 w-11 flex items-center justify-center shrink-0 transition-colors"
            style={{ color: "#185FA5" }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </button>
        </div>

        {showResults && (
          <ul className="max-h-60 overflow-y-auto border-t border-gray-100">
            {filtered.map((d) => (
              <li
                key={d.id}
                onClick={() => handleSelect(d)}
                className="px-4 py-2.5 hover:bg-gray-50 cursor-pointer flex items-center gap-3"
              >
                <span className="text-sm text-gray-800">{d.name}</span>
                <span className="ml-auto text-[11px] text-gray-400">
                  {CATEGORIES.find((c) => c.value === d.category)?.label}
                </span>
              </li>
            ))}
            {filtered.length === 0 && (
              <li className="px-4 py-3 text-sm text-gray-400">
                Sin resultados
              </li>
            )}
          </ul>
        )}
      </div>
    </div>
  );
}
