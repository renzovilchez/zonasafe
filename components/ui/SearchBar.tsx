"use client";

import { useState } from "react";
import { Destination } from "@/components/Map/DestinationMarkers";

interface Props {
  destinations: Destination[];
  onSelect: (destination: Destination) => void;
}

export default function SearchBar({ destinations, onSelect }: Props) {
  const [query, setQuery] = useState("");

  const filtered = destinations.filter((d) =>
    d.name.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-1000 w-[90%] max-w-md">
      <div className="bg-white rounded-lg shadow-lg p-2 flex gap-2">
        <div className="border rounded-lg p-2">
          <select name="category" id="category">
            <option value="">Categorías</option>
            <option value="mercados">Mercados</option>
            <option value="fabricas">Fábricas</option>
            <option value="galerias">Galerías</option>
          </select>
        </div>

        <input
          type="text"
          placeholder="Buscar destino..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full px-3 py-2 border rounded outline-none"
        />

        {query && (
          <ul className="mt-2 max-h-60 overflow-y-auto">
            {filtered.map((d) => (
              <li
                key={d.id}
                onClick={() => {
                  onSelect(d);
                  setQuery("");
                }}
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
              >
                {d.name}
              </li>
            ))}

            {filtered.length === 0 && (
              <li className="px-3 py-2 text-gray-500 text-sm">
                Sin resultados
              </li>
            )}
          </ul>
        )}

        <button className="bg-blue-500 text-white px-3 py-2 rounded">
          buscar
        </button>
      </div>
    </div>
  );
}
