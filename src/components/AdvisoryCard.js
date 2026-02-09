"use client";
import { Cloud, Mountain, Eye, Timer } from "lucide-react";

export default function AdvisoryCard({ riskData, showDetailedAdvisory }) {
  const total = riskData?.total ?? 0;
  const hasEvaluated = !!riskData;
  const showDetails = hasEvaluated && showDetailedAdvisory;

  // Extract hazards from GeoJSON route data if available, otherwise use mock
  const hazards = hasEvaluated
    ? riskData.routeData?.features?.map((f) => ({
        title:
          f.properties.risk_level === "CRITICAL"
            ? "Critical Segment"
            : "Route Advisory",
        desc: f.properties.advisory,
        icon:
          f.properties.risk_level === "CRITICAL" ? (
            <Timer size={16} />
          ) : (
            <Cloud size={16} />
          ),
      })) || [
        {
          title: total > 50 ? "Severe Weather" : "Marginal VFR",
          desc:
            total > 50 ? "Thunderstorms in flight path" : "Ceiling at 1,500 ft",
          icon: <Cloud size={16} />,
        },
        {
          title: "Terrain Proximity",
          desc: "Flight path near mountains",
          icon: <Mountain size={16} />,
        },
      ]
    : [];

  return (
    <div className="bg-[#1a1a1a] rounded-lg p-4 border border-[var(--border-color)] flex flex-col h-full 2xl:p-4 2xl:gap-4">
      {!showDetails ? (
        <div className="flex-1 flex items-center justify-center text-center text-[var(--text-muted)] italic border border-dashed border-[var(--border-color)] rounded-sm p-8">
          <p>Click &​quot;View Detailed Advisory&​quot; to see advisory</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 2xl:gap-4">
            <div className="col">
              <h3 className="text-sm md:text-xs text-[var(--text-secondary)] mb-4 font-normal 2xl:text-xs 2xl:font-medium 2xl:mb-3">
                Key Hazards
              </h3>
              {hazards.map((h, i) => (
                <div key={i} className="flex gap-2 mb-5 bg-[#2a2a2a] p-3 rounded-sm 2xl:mb-3 2xl:gap-2">
                  <div className="text-[var(--accent-blue)] ">
                    {h.icon}
                  </div>
                  <div>
                    <h4 className="text-sm md:text-xs font-semibold mb-1 2xl:text-xs">
                      {h.title}
                    </h4>
                    <p className="text-xs md:text-[10px] text-[var(--text-muted)] leading-[1.4] 2xl:text-[10px]">
                      {h.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="col">
              <h3 className="text-sm md:text-xs text-[var(--text-secondary)] mb-4 font-normal 2xl:text-xs 2xl:font-medium 2xl:mb-3">
                Detailed Advisory
              </h3>
              <div className="flex gap-3 mb-5 bg-[#2a2a2a] p-3 rounded-sm 2xl:mb-3 2xl:gap-2">
                <div className="text-[var(--accent-blue)] mt-1">
                  <Timer size={16} />
                </div>
                <div>
                  <h4 className="text-sm md:text-xs font-semibold mb-1 2xl:text-xs">
                    Risk Level:{" "}
                    {total > 60 ? "HIGH" : total > 30 ? "MEDIUM" : "LOW"}
                  </h4>
                  <p className="text-xs md:text-[10px] text-[var(--text-muted)] leading-[1.4] 2xl:text-[10px]">
                    Overall score is {total}/100
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#2a2a2a] p-4 rounded-sm 2xl:p-3">
            <h3 className="text-xs text-[var(--text-secondary)] mb-2 2xl:text-xs">
              Recommended Actions
            </h3>
            <ul className="list-disc pl-5 text-xs text-[var(--accent-blue)] leading-[1.6] 2xl:text-xs">
              {total > 60 ? (
                <>
                  <li>ABORT or significant delay recommended</li>
                  <li>Reroute through safer airspace</li>
                </>
              ) : (
                <>
                  <li>Standard pre-flight procedures</li>
                  <li>Monitor weather updates</li>
                </>
              )}
            </ul>
            <p className="text-[10px] text-[var(--text-muted)] mt-3 italic 2xl:text-[10px]">
              Recommendation based on FAA PAVE +5P model
            </p>
          </div>
        </>
      )}

      <button 
        className="bg-[#0a2d51] border border-[#0c3a68] text-white w-full py-3 rounded-sm font-medium cursor-pointer mt-auto hover:bg-[#0c3a68] disabled:opacity-50 disabled:cursor-not-allowed 2xl:py-2 2xl:text-sm"
        disabled={!hasEvaluated}
      >
        Run What-IF Analysis
      </button>
    </div>
  );
}