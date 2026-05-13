const LEGEND = [
  { color: "#639922", label: "Seguro" },
  { color: "#EF9F27", label: "Precaución" },
  { color: "#E24B4A", label: "Peligro" },
];

function MapLegend() {
  return (
    <div className="fixed bottom-6 left-4 z-999">
      <div className="bg-white/90 backdrop-blur-xl rounded-2xl border border-white/60 shadow-lg shadow-black/5 px-3 py-2.5 flex flex-col gap-2">
        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Zonas</p>
        {LEGEND.map(({ color, label }) => (
          <div key={label} className="flex items-center gap-2.5 group cursor-default">
            <span
              className="w-3.5 h-3.5 rounded-md shrink-0 transition-transform group-hover:scale-110"
              style={{ backgroundColor: color }}
            />
            <span className="text-xs font-medium text-slate-600 group-hover:text-slate-800 transition-colors">
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
export default MapLegend;
