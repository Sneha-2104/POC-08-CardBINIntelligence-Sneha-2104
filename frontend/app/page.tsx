"use client";

import { useState } from "react";

export default function Home() {
  const [binInput, setBinInput] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

  const lookupBIN = async () => {
    if (!binInput || binInput.length < 6) {
      setError("Please enter at least 6 digits");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch(`${API}/api/bin/lookup?bin=${binInput.substring(0, 6)}`);
      const data = await res.json();
      
      if (data.error || data.message) {
        setError(data.message || data.error);
      } else {
        setResult(data);
      }
    } catch (err) {
      setError("Failed to fetch data");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#050508] text-slate-100 flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <h1 className="text-3xl font-mono text-amber-400 text-center mb-2">
          🔍 BIN INTELLIGENCE
        </h1>
        <p className="text-center text-slate-500 text-sm mb-8">Card BIN Lookup</p>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Enter BIN (e.g., 414700)"
            className="flex-1 bg-[#0A0A10] border border-slate-800 rounded px-4 py-3 text-sm text-slate-300 focus:border-amber-500/60 focus:outline-none"
            value={binInput}
            onChange={(e) => setBinInput(e.target.value.replace(/\D/g, ''))}
            onKeyDown={(e) => e.key === "Enter" && lookupBIN()}
          />
          <button
            onClick={lookupBIN}
            className="bg-amber-500/20 border border-amber-500/40 px-6 py-3 rounded text-amber-400 font-mono text-sm hover:bg-amber-500/30 transition"
          >
            LOOKUP
          </button>
        </div>

        {loading && <p className="text-center text-slate-500 mt-4">Searching...</p>}
        {error && <p className="text-center text-red-400 mt-4">{error}</p>}

        {result && (
          <div className="mt-6 bg-[#0A0A10] border border-slate-800 rounded-lg p-6">
            <h3 className="text-xs text-amber-400 font-mono mb-3">// BIN RESULT</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><p className="text-slate-500">BIN</p><p className="text-slate-200 font-mono">{result.bin}</p></div>
              <div><p className="text-slate-500">Issuer</p><p className="text-slate-200">{result.issuer}</p></div>
              <div><p className="text-slate-500">Card Type</p><p className="text-slate-200">{result.card_type}</p></div>
              <div><p className="text-slate-500">Country</p><p className="text-slate-200">{result.country}</p></div>
              <div><p className="text-slate-500">Decline Rate</p><p className="text-slate-200">{(result.decline_rate * 100).toFixed(1)}%</p></div>
              <div><p className="text-slate-500">Top Decline Reason</p><p className="text-slate-200">{result.top_decline_reason}</p></div>
            </div>
          </div>
        )}

        <div className="text-center text-xs text-slate-600 mt-8 font-mono">
          POC-08 · Card BIN Intelligence · Sneha-2104
        </div>
      </div>
    </div>
  );
}