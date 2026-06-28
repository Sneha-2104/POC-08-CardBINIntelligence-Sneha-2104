"use client";

import { useEffect, useState } from "react";

type Props = {
  metrics: {
    total_stations: number;
    dc_fast: number;
    operators: number;
    countries: number;
  };
  onRefresh?: () => void;
  topOperators?: {
    operator_name?: string;
    operator_id?: string | number;
    count: number;
  }[];
  isOpen: boolean;
  onToggle: () => void;
};

export function Sidebar({ metrics, onRefresh, topOperators = [], isOpen, onToggle }: Props) {
  const API = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [localOperators, setLocalOperators] = useState<any[]>([]);

  useEffect(() => {
    if (topOperators.length > 0) return;
    const fetchOperators = async () => {
      try {
        const res = await fetch(`${API}/api/top-operators`);
        if (!res.ok) return;
        const data = await res.json();
        setLocalOperators(Array.isArray(data) ? data : []);
      } catch {}
    };
    fetchOperators();
  }, [topOperators]);

  const operatorsToShow = topOperators.length > 0 ? topOperators : localOperators;
  const unknownOperator = operatorsToShow.find((op) => String(op.operator_id) === "0");
  const validOperators = operatorsToShow
    .filter((op) => String(op.operator_id) !== "0")
    .sort((a, b) => (b.count ?? 0) - (a.count ?? 0));

  const finalOperators = unknownOperator
    ? [{ ...unknownOperator, operator_name: "INDEPENDENT CHARGING NETWORK" }, ...validOperators]
    : validOperators;

  return (
    <>
      {/* Dynamic Slide-Over Toggle Button Floating over Map View */}
      <button
        onClick={onToggle}
        className="absolute top-16 right-6 z-50 bg-[#06060B]/90 backdrop-blur-md border border-slate-800 text-xs font-mono text-slate-300 px-4 py-2.5 rounded-lg shadow-xl hover:border-amber-500/50 hover:text-amber-400 transition-all duration-300"
      >
        {isOpen ? "✕ CLOSE DATA STREAM" : "⚡ OPEN TELEMETRY RECON"}
      </button>

      <aside
        className={`absolute top-0 right-0 h-full w-[400px] bg-[#06060B]/95 border-l border-amber-500/10 backdrop-blur-xl flex flex-col z-40 transition-transform duration-500 cubic-bezier(0.16, 1, 0.3, 1) shadow-2xl pt-20
          ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex-1 overflow-y-auto px-6 py-4 custom-scrollbar">
          
          {/* SECTION A — METRICS */}
          <div className="mb-8">
            <p className="text-[10px] tracking-[0.25em] text-slate-500 font-mono uppercase mb-3">
              [ NODE DATA MATRIX ]
            </p>
            <div className="grid grid-cols-2 gap-3.5">
              <MetricCard label="TOTAL STATONS" value={(metrics.total_stations ?? 0).toLocaleString()} accent />
              <MetricCard label="PUBLIC CHARGERS" value={(metrics.dc_fast ?? 0).toLocaleString()} />
              <MetricCard label="VERIFIED VENDORS" value={(metrics.operators ?? 0).toLocaleString()} />
              <MetricCard label="DENSITY INDEX" value={(metrics.countries ?? 0).toLocaleString()} />
            </div>
          </div>

          {/* SECTION B — OPERATORS */}
          <div className="mb-8 border-t border-slate-900 pt-6">
            <p className="text-[10px] tracking-[0.25em] text-slate-500 font-mono uppercase mb-4">
              [ DISTRIBUTION LEADERS ]
            </p>
            <div className="space-y-2.5">
              {finalOperators.slice(0, 8).map((op, i) => {
                let name = op.operator_name || `CLUSTER SPEC ID: ${op.operator_id}`;
                return (
                  <div key={i} className="flex justify-between items-center text-xs bg-slate-950/40 border border-slate-900/60 p-2 rounded hover:border-slate-800 transition">
                    <span className="text-slate-300 font-mono truncate max-w-[240px]">
                      {name.toUpperCase()}
                    </span>
                    <span className="text-amber-400 font-mono bg-amber-500/5 px-2 py-0.5 rounded border border-amber-500/10">
                      {(op.count ?? 0).toLocaleString()}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SECTION C — CONTROLS */}
          <div className="border-t border-slate-900 pt-6">
            <p className="text-[10px] tracking-[0.25em] text-slate-500 font-mono uppercase mb-4">
              [ COMMAND SHELL OVERRIDES ]
            </p>
            <div className="flex gap-3">
              <button
                onClick={onRefresh}
                className="flex-1 font-mono text-[11px] border border-slate-800 bg-slate-950 text-slate-300 px-3 py-2.5 rounded hover:border-amber-500/40 hover:text-white transition duration-200"
              >
                REFRESH CORES
              </button>
              <a
                href={`${API}/api/stations/csv`}
                target="_blank"
                className="flex-1 font-mono text-[11px] border border-slate-800 bg-slate-950 text-slate-300 px-3 py-2.5 rounded text-center hover:border-amber-500/40 hover:text-white transition duration-200"
              >
                EXPORT RAW DAT
              </a>
            </div>
          </div>

          <div className="mt-12 text-center border-t border-slate-900/60 pt-4">
            <p className="text-[9px] font-mono text-slate-600 tracking-wider">
              AETHERNET INTEL SYSTEM // VER 1.0.4
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}

function MetricCard({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className={`bg-[#050508] border rounded-lg p-3.5 transition duration-200 hover:border-slate-700 ${accent ? "border-amber-500/20" : "border-slate-900"}`}>
      <p className={`text-base font-bold font-mono tracking-tight ${accent ? "text-amber-400" : "text-slate-100"}`}>
        {value}
      </p>
      <p className="text-[10px] text-slate-500 font-mono mt-1 tracking-wider uppercase">
        {label}
      </p>
    </div>
  );
}