function MapHeader() {
  return (
    <header
      className="fixed top-0 left-0 right-0 z-1001 safe-top"
      style={{ background: "linear-gradient(135deg, #185FA5 0%, #1a6bb8 100%)" }}
    >
      <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(circle_at_20%_50%,white_0%,transparent_60%)]" />
      <div className="relative w-full px-4 py-2.5 flex items-center justify-start gap-3 md:max-w-5xl md:mx-auto">
        <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center shadow-inner shadow-white/5">
          <img src="/icons/icon-192.png" className="w-7 h-7" />
        </div>
        <div className="flex flex-col leading-tight">
          <span className="font-bold text-white text-base tracking-tight">ZonaSafe</span>
          <span className="text-[11px] text-blue-200/90 font-medium">El Porvenir · Trujillo</span>
        </div>
      </div>
    </header>
  );
}
export default MapHeader;
