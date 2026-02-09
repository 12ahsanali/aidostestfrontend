"use client";
import { useState, useEffect } from "react";
import { submitWhatifAnalysis } from "../../services/whatifService";
export default function WhatIfCard({ riskData, flightInfoId }) {
  const hasEvaluated = !!riskData;
  const total = riskData?.total ?? 0;

  const [inputValues, setInputValues] = useState({
    DelayDeparture: 50,
    ReducePassengerPressure: 50,
    SwitchIFRtoVFR: 50,
    IncreaseWindGustFactor: 50,
  });

  const [whatIfScores, setWhatIfScores] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setWhatIfScores(null);
    setInputValues({
      DelayDeparture: 50,
      ReducePassengerPressure: 50,
      SwitchIFRtoVFR: 50,
      IncreaseWindGustFactor: 50,
    });
  }, [flightInfoId]);

  // Add this before the return statement
  const runRiskAnalysis = async () => {
    if (!flightInfoId) {
      alert("Please select a flight first");
      return;
    }

    setLoading(true);
    try {
      const response = await submitWhatifAnalysis({
        flightinfoId: flightInfoId,
        DelayDeparture: inputValues.DelayDeparture.toString(),
        ReducePassengerPressure: inputValues.ReducePassengerPressure.toString(),
        SwitchIFRtoVFR: inputValues.SwitchIFRtoVFR.toString(),
        IncreaseWindGustFactor: inputValues.IncreaseWindGustFactor.toString(),
      });

      const scores = response.data.scores;
      const totalScore =
        scores.pilot + scores.aircraft + scores.environment + scores.external;

      setWhatIfScores({
        total: totalScore,
        pilot: scores.pilot,
        aircraft: scores.aircraft,
        environment: scores.environment,
        external: scores.external,
      });
    } catch (error) {
      console.error("Error running risk analysis:", error);
      alert("Failed to run risk analysis");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#1a1a1a] rounded-lg p-6 text-white border border-[var(--border-color)] relative overflow-hidden h-full lg:p-4 lg:pb-4 max-sm:p-3.5 max-sm:pb-3.5">
      <h3 className="text-xl font-semibold mb-4 self-end text-right lg:text-lg lg:mb-[1.2rem] max-sm:text-[0.95rem] max-sm:mb-[0.9rem]">
        What-If Analysis
      </h3>

      {!hasEvaluated ? (
        <div className="flex-1 flex items-center justify-center text-center text-[var(--text-muted)] text-xs italic border border-dashed border-[var(--border-color)] rounded p-8 min-h-[150px] lg:p-6 lg:min-h-[120px] max-sm:p-5 max-sm:min-h-[100px]">
          <p>Run evaluation to enable What-If analysis</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-8 items-start h-[calc(100%-2.7rem)] lg:gap-6 lg:grid-cols-[30%_1fr] max-sm:grid-cols-1 max-sm:gap-4 max-sm:h-auto">
          <div className="h-full flex flex-col justify-between gap-4 lg:gap-3.5 max-sm:order-2">
            <div className="flex flex-col gap-[0.6rem]">
              <div className="flex flex-col gap-[0.4rem]">
                <label className="text-xs text-[var(--text-secondary)] font-medium lg:text-[0.75rem] max-sm:text-[0.8rem]">
                  Delay Departure
                </label>
                <input
                  type="range"
                  className="range"
                  min="0"
                  max="60"
                  value={inputValues.DelayDeparture}
                  onChange={(e) =>
                    setInputValues((prev) => ({
                      ...prev,
                      DelayDeparture: parseInt(e.target.value),
                    }))
                  }
                />
                <div className="flex justify-between text-[0.7rem] text-[var(--text-muted)] lg:text-[0.6rem] max-sm:text-[0.65rem]">
                  <span>10 min</span>
                  <span>2 h</span>
                </div>
              </div>

              <div className="flex flex-col gap-[0.4rem]">
                <label className="text-xs text-[var(--text-secondary)] font-medium lg:text-[0.75rem] max-sm:text-[0.8rem]">
                  Reduce Passenger Pressure
                </label>
                <input
                  type="range"
                  className="range"
                  min="0"
                  max="100"
                  value={inputValues.ReducePassengerPressure}
                  onChange={(e) =>
                    setInputValues((prev) => ({
                      ...prev,
                      ReducePassengerPressure: parseInt(e.target.value),
                    }))
                  }
                />
              </div>

              <div className="flex flex-col gap-[0.4rem]">
                <label className="text-xs text-[var(--text-secondary)] font-medium lg:text-[0.75rem] max-sm:text-[0.8rem]">
                  Switch IFR to VFR
                </label>
                <input
                  type="range"
                  className="range"
                  min="0"
                  max="100"
                  value={inputValues.SwitchIFRtoVFR}
                  onChange={(e) =>
                    setInputValues((prev) => ({
                      ...prev,
                      SwitchIFRtoVFR: parseInt(e.target.value),
                    }))
                  }
                />
              </div>

              <div className="flex flex-col gap-[0.4rem]">
                <label className="text-xs text-[var(--text-secondary)] font-medium lg:text-[0.75rem] max-sm:text-[0.8rem]">
                  Increase Wind Gust Factor
                </label>
                <input
                  type="range"
                  className="range"
                  min="0"
                  max="100"
                  value={inputValues.IncreaseWindGustFactor}
                  onChange={(e) =>
                    setInputValues((prev) => ({
                      ...prev,
                      IncreaseWindGustFactor: parseInt(e.target.value),
                    }))
                  }
                />
              </div>
            </div>
            <button
              className="bg-[#0a2d51] text-white border border-[#0c3a68] rounded-md p-2 text-sm font-semibold cursor-pointer transition-all duration-300 whitespace-nowrap hover:bg-[#0c3a68] disabled:bg-[#333] disabled:text-[#666] disabled:cursor-not-allowed"
              onClick={runRiskAnalysis}
              disabled={loading}
            >
              {loading ? "Running..." : "Run Risk"}
            </button>
          </div>

          <div className="flex flex-col justify-between items-center text-center h-full gap-4 lg:gap-3 max-sm:order-1 max-sm:gap-3">
            <div>
              <div className="flex justify-center w-full">
                <svg
                  width="229"
                  height="203"
                  viewBox="0 0 229 203"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-[160px] h-[160px]"
                >
                  <mask id="path-1-inside-1_194_759" fill="white">
                    <path d="M159.495 36.0959C161.09 33.4363 164.518 32.5061 167.138 34.1666C177.782 40.9151 186.933 49.6558 194.035 59.8875C202.179 71.621 207.411 85.0006 209.324 98.9916C211.237 112.983 209.782 127.21 205.07 140.572C200.969 152.201 194.498 162.904 186.057 172.062C183.942 174.355 180.372 174.343 178.125 172.179C175.753 169.897 175.77 166.113 177.967 163.662C184.992 155.826 190.395 146.746 193.864 136.911C197.992 125.202 199.268 112.737 197.591 100.479C195.915 88.22 191.331 76.4971 184.195 66.2166C178.173 57.5409 170.47 50.0887 161.527 44.2581C158.805 42.4836 157.824 38.8825 159.495 36.0959Z" />
                  </mask>
                  <path
                    d="M159.495 36.0959C161.09 33.4363 164.518 32.5061 167.138 34.1666C177.782 40.9151 186.933 49.6558 194.035 59.8875C202.179 71.621 207.411 85.0006 209.324 98.9916C211.237 112.983 209.782 127.21 205.07 140.572C200.969 152.201 194.498 162.904 186.057 172.062C183.942 174.355 180.372 174.343 178.125 172.179C175.753 169.897 175.77 166.113 177.967 163.662C184.992 155.826 190.395 146.746 193.864 136.911C197.992 125.202 199.268 112.737 197.591 100.479C195.915 88.22 191.331 76.4971 184.195 66.2166C178.173 57.5409 170.47 50.0887 161.527 44.2581C158.805 42.4836 157.824 38.8825 159.495 36.0959Z"
                    fill={
                      (whatIfScores?.total || total) >= 70
                        ? "#FF383C"
                        : whatIfScores?.total || total
                          ? "#FF383C59"
                          : "#0B1220"
                    }
                    stroke={
                      whatIfScores?.total || total ? "#FF383C" : "#111111"
                    }
                    strokeWidth="2"
                    mask="url(#path-1-inside-1_194_759)"
                  />
                  <mask id="path-2-inside-2_194_759" fill="white">
                    <path d="M51.0168 172.179C48.7697 174.343 45.1992 174.355 43.0851 172.062C34.6435 162.904 28.1726 152.201 24.072 140.572C19.3599 127.21 17.9042 112.983 19.8177 98.9916C21.7311 85.0006 26.9623 71.621 35.1066 59.8875C42.2086 49.6558 51.3598 40.9151 62.0041 34.1666C64.6233 32.5061 68.0513 33.4363 69.6465 36.0959C71.3177 38.8825 70.3368 42.4836 67.6148 44.2581C58.6716 50.0887 50.9682 57.5409 44.9463 66.2166C37.8105 76.4971 33.227 88.22 31.5505 100.479C29.874 112.737 31.1494 125.202 35.2781 136.911C38.7464 146.746 44.1501 155.826 51.1742 163.662C53.3714 166.113 53.3883 169.897 51.0168 172.179Z" />
                  </mask>
                  <path
                    d="M51.0168 172.179C48.7697 174.343 45.1992 174.355 43.0851 172.062C34.6435 162.904 28.1726 152.201 24.072 140.572C19.3599 127.21 17.9042 112.983 19.8177 98.9916C21.7311 85.0006 26.9623 71.621 35.1066 59.8875C42.2086 49.6558 51.3598 40.9151 62.0041 34.1666C64.6233 32.5061 68.0513 33.4363 69.6465 36.0959C71.3177 38.8825 70.3368 42.4836 67.6148 44.2581C58.6716 50.0887 50.9682 57.5409 44.9463 66.2166C37.8105 76.4971 33.227 88.22 31.5505 100.479C29.874 112.737 31.1494 125.202 35.2781 136.911C38.7464 146.746 44.1501 155.826 51.1742 163.662C53.3714 166.113 53.3883 169.897 51.0168 172.179Z"
                    fill={
                      (whatIfScores?.total || total) < 40
                        ? "#2FA84F"
                        : whatIfScores?.total || total
                          ? "#2FA84F59"
                          : "#0B1220"
                    }
                    stroke={
                      whatIfScores?.total || total ? "#2FA84F" : "#0F192D"
                    }
                    strokeWidth="2"
                    mask="url(#path-2-inside-2_194_759)"
                  />
                  <mask id="path-3-inside-3_194_759" fill="white">
                    <path d="M69.8415 36.4211C68.1702 33.6346 69.1328 30.0018 72.0643 28.6004C85.2495 22.2974 99.7955 19 114.571 19C129.346 19 143.892 22.2974 157.077 28.6004C160.009 30.0018 160.971 33.6346 159.3 36.4211C157.705 39.0807 154.296 39.9763 151.492 38.6505C140.025 33.2277 127.396 30.3919 114.571 30.3919C101.745 30.3919 89.1168 33.2277 77.6497 38.6505C74.8461 39.9763 71.4366 39.0807 69.8415 36.4211Z" />
                  </mask>
                  <path
                    d="M69.8415 36.4211C68.1702 33.6346 69.1328 30.0018 72.0643 28.6004C85.2495 22.2974 99.7955 19 114.571 19C129.346 19 143.892 22.2974 157.077 28.6004C160.009 30.0018 160.971 33.6346 159.3 36.4211C157.705 39.0807 154.296 39.9763 151.492 38.6505C140.025 33.2277 127.396 30.3919 114.571 30.3919C101.745 30.3919 89.1168 33.2277 77.6497 38.6505C74.8461 39.9763 71.4366 39.0807 69.8415 36.4211Z"
                    fill={
                      (whatIfScores?.total || total) >= 40 &&
                      (whatIfScores?.total || total) < 70
                        ? "#F5A623"
                        : whatIfScores?.total || total
                          ? "#F5A62359"
                          : "#0B1220"
                    }
                    stroke={
                      whatIfScores?.total || total ? "#F5A623" : "#0F192D"
                    }
                    strokeWidth="2"
                    mask="url(#path-3-inside-3_194_759)"
                  />
                  <text
                    x="114.5"
                    y="86"
                    fill={
                      (whatIfScores?.total || total) > 70
                        ? "#FF383C"
                        : (whatIfScores?.total || total) >= 40
                          ? "#F5A623"
                          : (whatIfScores?.total || total) >= 0
                            ? "#2FA84F"
                            : "#9AA4B2"
                    }
                    fontSize="24"
                    fontFamily="Arial"
                    fontWeight="500"
                    textAnchor="middle"
                  >
                    {(whatIfScores?.total || total) > 70
                      ? "NO GO"
                      : (whatIfScores?.total || total) >= 40
                        ? "DELAY"
                        : (whatIfScores?.total || total) >= 0
                          ? "GO"
                          : "Status"}
                  </text>
                  <text
                    x="114.5"
                    y="132"
                    fill="white"
                    fontSize="28"
                    fontFamily="Arial"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    <tspan
                      fill={
                        (whatIfScores?.total || total) > 70
                          ? "#FF383C"
                          : (whatIfScores?.total || total) >= 40
                            ? "#F5A623"
                            : (whatIfScores?.total || total) >= 0
                              ? "#2FA84F"
                              : "#9AA4B2"
                      }
                    >
                      {whatIfScores?.total || total}
                    </tspan>
                    /100
                  </text>
                  <rect
                    x="68.5"
                    y="154.5"
                    width="93"
                    height="26"
                    rx="13"
                    fill="#2a2a2a"
                  />
                  <rect
                    x="68.5"
                    y="154.5"
                    width="93"
                    height="26"
                    rx="13"
                    stroke="#1d4ed8"
                  />
                  <path
                    d="M100.656 161.625H104.68C106.5 161.625 108.781 163 108.781 167.3C108.781 171.6 106.5 173 104.68 173H100.656V161.625ZM102.617 163.188V171.4H104.68C105.8 171.4 106.828 170.5 106.828 167.3C106.828 164.1 105.8 163.188 104.68 163.188H102.617ZM110.5 161.625H116.5V163.188H112.4V166H116V167.5H112.4V171.4H116.5V173H110.5V161.625ZM118.5 161V173H124V171.4H120.4V161H118.5ZM128.5 161.625L125.5 173H127.4L128 170.8H131L131.6 173H133.5L130.5 161.625H128.5ZM128.4 169.2L129.5 164.8L130.6 169.2H128.4ZM134.5 161.625L137 166.5V173H138.9V166.5L141.4 161.625H139.4L137.9 164.8L136.4 161.625H134.5Z"
                    fill="#F0F0F0"
                  ></path>
                </svg>
              </div>

              <p className="text-[0.75rem] text-[var(--text-secondary)] leading-[1.4] max-w-[180px] lg:text-[0.65rem] lg:max-w-[150px] max-sm:text-[0.75rem] max-sm:max-w-full">
                Delaying-in 20 minutes decreases your risk by 23 points
              </p>
            </div>
            <div className="w-full bg-[#2a2a2a] rounded p-3 flex flex-col gap-2 border border-[#3a3a3a] lg:p-2 max-sm:p-[0.45rem]">
              <span className="text-[0.7rem] text-[var(--text-muted)] self-start font-medium lg:text-[0.6rem] max-sm:text-[0.58rem]">
                Risk Over Time
              </span>
              <div className="flex gap-1 h-10 items-end justify-center lg:h-9 max-sm:h-7">
                <div className="w-[14px] h-[20%] bg-[#444] rounded lg:w-3 max-sm:w-2.5"></div>
                <div className="w-[14px] h-[50%] bg-[#ff9500] rounded lg:w-3 max-sm:w-2.5"></div>
                <div className="w-[14px] h-[75%] bg-[#ffa500] rounded lg:w-3 max-sm:w-2.5"></div>
                <div className="w-[14px] h-[90%] bg-[#1d4ed8] rounded lg:w-3 max-sm:w-2.5"></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
