const LEGEND = [
  { color: "#639922", label: "Seguro" },
  { color: "#EF9F27", label: "Precaución" },
  { color: "#E24B4A", label: "Peligro" },
];

function MapLegend() {
  return (
    <div className="absolute bottom-6 left-4 z-1000 bg-white/95 backdrop-blur-sm rounded-xl border border-gray-100 shadow-sm px-3 py-2.5 flex flex-col gap-2">
      <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">
        Zonas
      </p>
      {LEGEND.map(({ color, label }) => (
        <div key={label} className="flex items-center gap-2">
          <span
            className="w-3 h-3 rounded-sm shrink-0"
            style={{ backgroundColor: color }}
          />
          <span className="text-xs text-gray-600">{label}</span>
        </div>
      ))}
    </div>
  );
}

export default MapLegend;
