function MapHeader() {
  return (
    <header
      style={{ backgroundColor: "#185FA5" }}
      className="fixed top-0 left-0 right-0 z-1001 shadow-sm"
    >
      <div className="w-full px-4 py-2.5 flex items-center justify-start gap-3 md:max-w-5xl md:mx-auto">
        <img src="/icons/icon-192.png" className="w-8 h-8 rounded-lg" />

        <div className="flex flex-col leading-tight">
          <span className="font-semibold text-white text-sm tracking-tight">
            ZonaSafe
          </span>
          <span className="text-[11px] text-blue-200">
            El Porvenir · Trujillo
          </span>
        </div>
      </div>
    </header>
  );
}

export default MapHeader;
