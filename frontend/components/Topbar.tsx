"use client";

interface TopbarProps {
  stationCount: number;
  dataSource: string;
  isLoading: boolean;
  onOpenModal: () => void;
}

export function Topbar({ stationCount, dataSource, isLoading, onOpenModal }: TopbarProps) {
  return (
    <header className="h-16 bg-[#06060B]/90 border-b border-amber-500/10 flex items-center justify-between px-6 shrink-0 z-50 backdrop-blur-md">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isLoading ? "bg-amber-600 animate-pulse" : "bg-amber-400 animate-pulse-glow"}`} />
          <span className="text-amber-500 font-mono text-xs uppercase tracking-[0.2em] font-semibold">
            SYSTEM ENGINE
          </span>
        </div>
        <div className="h-4 w-[1px] bg-slate-800" />
        <h1 className="text-sm font-bold tracking-wider text-slate-100 font-mono uppercase">
          AETHERNET // <span className="text-amber-400">GRID MONITOR</span>
        </h1>
      </div>

      <div className="flex items-center gap-6">
        <div className="text-right hidden sm:block">
          <p className="text-[10px] text-slate-500 tracking-widest font-mono uppercase">ACTIVE MATRIX TELEMETRY</p>
          <p className="text-xs text-amber-400 font-mono font-medium">
            {isLoading ? "SYNCING..." : `${stationCount.toLocaleString()} NODES DETECTED`}
          </p>
        </div>

        <button
          onClick={onOpenModal}
          className="px-3 py-1.5 rounded border border-slate-800 text-[11px] text-slate-300 bg-slate-900/50 font-mono tracking-wider hover:border-amber-500/40 hover:text-white transition duration-200"
        >
          [ METADATA LOG ]
        </button>

        <div className="text-xs bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded text-amber-400 font-mono text-[10px] tracking-widest font-bold">
          DEV // OPERATOR
        </div>
      </div>
    </header>
  );
}