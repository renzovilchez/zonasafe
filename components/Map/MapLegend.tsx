function MapLegend() {
  return (
    <div className="absolute bottom-20 left-2 z-1000">
      <div className="bg-white rounded-lg shadow-lg p-2">
        <p className="text-sm font-medium">Leyenda</p>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 border border-green-500"></div>
          <p className="text-sm">Seguro</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-500 border border-yellow-500"></div>
          <p className="text-sm">Precaución</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500 border border-red-500"></div>
          <p className="text-sm">Riesgoso</p>
        </div>
      </div>
    </div>
  );
}

export default MapLegend;
