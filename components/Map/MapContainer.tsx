"use client";
import dynamic from "next/dynamic";

const LeafletMap = dynamic(() => import("./LeafletMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50 gap-4">
      <div className="relative">
        <div className="w-16 h-16 rounded-2xl bg-[#185FA5]/10 flex items-center justify-center">
          <div className="w-8 h-8 rounded-lg bg-[#185FA5] animate-pulse" />
        </div>
        <span className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-slate-50" />
      </div>
      <div className="flex flex-col items-center gap-1.5">
        <div className="shimmer-bg h-4 w-40 rounded-lg" />
        <div className="shimmer-bg h-3 w-28 rounded-lg" />
      </div>
    </div>
  ),
});

export default function MapContainer({ zones }: any) {
  return <LeafletMap zones={zones} />;
}
