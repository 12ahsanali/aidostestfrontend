'use client';

export default function Checklist({ riskData }) {
  const hasEvaluated = !!riskData;

  const checklistItems = [
    "Pilot readiness and fatigue",
    "Pilot experience and currency", 
    "Weather conditions and hazards",
    "Forecast weather trend",
    "Wind and crosswind environment",
    "Aircraft performance and limitations",
    "Fuel and reserve margins",
    "Operational environment and airspace",
    "External pressure and human factors",
    "Causal historical safety data"
  ];

  return (
    <div className="p-4 bg-[#1a1a1a] flex flex-col h-full relative rounded-sm border border-[var(--border-color)]">
      {!hasEvaluated && (
        <div className="absolute inset-0 bg-[rgba(0,0,0,0.7)] z-10 flex items-center justify-center rounded-sm backdrop-blur-sm">
          <span className="text-[#38bdf8] text-sm font-medium uppercase tracking-[0.05em] px-4 py-2 border border-[rgba(56,189,248,0.3)] bg-[rgba(15,23,42,0.8)] rounded-sm">
            Awaiting Evaluation
          </span>
        </div>
      )}
      
      <h3 className="text-right text-base font-normal mb-8 text-[var(--text-primary)]">
        Evaluation Coverage
      </h3>

      <div className="flex flex-col gap-2 flex-grow">
        {checklistItems.map((item, index) => (
          <label key={index} className="flex items-center gap-2 text-xs text-[var(--text-secondary)] cursor-pointer bg-[#2a2a2a] p-2 rounded-sm">
            <input 
              type="checkbox" 
              defaultChecked 
              className="accent-[#1890FF] w-3.5 h-3.5"
            />
            <span>{item}</span>
          </label>
        ))}
      </div>
    </div>
  );
}