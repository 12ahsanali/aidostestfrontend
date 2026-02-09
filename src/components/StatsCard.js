"use client";
import { User, Plane, MapPin, DollarSign } from "lucide-react";
import GaugeMeter from "./GaugeMeter";

export default function StatsCard({ riskData, onViewDetailedAdvisory }) {
  const pilot = riskData?.pilot ?? 0;
  const aircraft = riskData?.aircraft ?? 0;
  const environment = riskData?.environment ?? 0;
  const external = riskData?.external ?? 0;
  const total = riskData?.total ?? 0;
  const hasEvaluated = !!riskData;

  return (
    <div className="bg-[#1a1a1a] rounded-sm p-4 flex flex-col items-center gap-4 w-full h-full relative box-border 2xl:p-4 2xl:gap-4">
      {!hasEvaluated && (
        <div className="absolute top-0 left-0 right-0 bottom-0 bg-[rgba(26,26,26,0.7)] z-10 flex items-center justify-center rounded-sm backdrop-blur-sm">
          <span className="text-[#38bdf8] text-sm font-medium uppercase tracking-[0.05em] px-4 py-2 border border-[rgba(56,189,248,0.3)] bg-[rgba(45,45,45,0.8)] rounded-sm">
            Awaiting Evaluation
          </span>
        </div>
      )}
      
      <div className="w-full flex justify-end">
        <span className="text-[#f1f5f9] text-lg font-medium opacity-90">
          Risk Score
        </span>
      </div>

      <div className="relative w-full flex flex-col items-center justify-center 2xl:w-[200px] 2xl:h-[150px]">
        <GaugeMeter total={total} size="small" showBadge={true} showStatusText={true}/>
        {/* <p className="hidden text-[#94a3b8] text-lg font-medium tracking-[0.15em] mt-4 2xl:block">
          PAVE
        </p> */}
      </div>

      <div className="grid grid-cols-2 gap-[0.6rem] w-full min-w-0 max-sm:grid-cols-1">
        <div className="bg-[#2a2a2a] p-3.5 rounded-sm flex items-center gap-3.5 min-w-0 lg:p-2 lg:gap-3 max-sm:p-2.5 max-sm:gap-2.5">
          <User size={18} className="self-start mt-1 text-[#1d4ed8] opacity-80 flex-shrink-0 max-sm:w-4 max-sm:h-4" />
          <div className="min-w-0 flex-1">
            <span className="block text-base font-medium text-white whitespace-nowrap overflow-hidden text-ellipsis lg:text-sm max-sm:text-sm">
              Pilot
            </span>
            <span className="block text-sm text-[#64748b] lg:text-xs max-sm:text-xs">
              {pilot.toString().padStart(2, "0")}/25
            </span>
          </div>
        </div>

        <div className="bg-[#2a2a2a] p-3.5 rounded-sm flex items-center gap-3.5 min-w-0 lg:p-2 lg:gap-3 max-sm:p-2.5 max-sm:gap-2.5">
          <Plane size={18} className="self-start mt-1 text-[#1d4ed8] opacity-80 flex-shrink-0 max-sm:w-4 max-sm:h-4" />
          <div className="min-w-0 flex-1">
            <span className="block text-base font-medium text-white whitespace-nowrap overflow-hidden text-ellipsis lg:text-sm max-sm:text-sm">
              Aircraft
            </span>
            <span className="block text-sm text-[#64748b] lg:text-xs max-sm:text-xs">
              {aircraft.toString().padStart(2, "0")}/25
            </span>
          </div>
        </div>

        <div className="bg-[#2a2a2a] p-3.5 rounded-sm flex items-center gap-3.5 min-w-0 lg:p-2 lg:gap-3 max-sm:p-2.5 max-sm:gap-2.5">
          <MapPin size={18} className="self-start mt-1 text-[#1d4ed8] opacity-80 flex-shrink-0 max-sm:w-4 max-sm:h-4" />
          <div className="min-w-0 flex-1">
            <span className="block text-base font-medium text-white whitespace-nowrap overflow-hidden text-ellipsis lg:text-sm max-sm:text-sm">
              Environment
            </span>
            <span className="block text-sm text-[#64748b] lg:text-xs max-sm:text-xs">
              {environment.toString().padStart(2, "0")}/25
            </span>
          </div>
        </div>

        <div className="bg-[#2a2a2a] p-3.5 rounded-sm flex items-center gap-3.5 min-w-0 lg:p-2 lg:gap-3 max-sm:p-2.5 max-sm:gap-2.5">
          <DollarSign size={18} className="self-start mt-1 text-[#1d4ed8] opacity-80 flex-shrink-0 max-sm:w-4 max-sm:h-4" />
          <div className="min-w-0 flex-1">
            <span className="block text-base font-medium text-white whitespace-nowrap overflow-hidden text-ellipsis lg:text-sm max-sm:text-sm">
              External
            </span>
            <span className="block text-sm text-[#64748b] lg:text-xs max-sm:text-xs">
              {external.toString().padStart(2, "0")}/25
            </span>
          </div>
        </div>
      </div>

      <button
        className="w-full bg-[#0a2d51] border border-[#0c3a68] text-[#f8fafc] py-3 rounded-sm text-sm font-normal cursor-pointer mt-auto transition-all duration-200 hover:bg-[#0c3a68] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={onViewDetailedAdvisory}
        disabled={!hasEvaluated}
      >
        View Detailed Advisory
      </button>
    </div>
  );
}