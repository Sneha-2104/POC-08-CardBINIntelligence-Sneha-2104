"use client";

import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import CountUp from 'react-countup';

export default function Home() {
  const [binInput, setBinInput] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [stats, setStats] = useState<any>(null);
  const [issuers, setIssuers] = useState<any[]>([]);
  const [declineReasons, setDeclineReasons] = useState<any[]>([]);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const API = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

  const COLORS = ['#F59E0B', '#10B981', '#3B82F6', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316'];

  // Issuer brand colors
  const issuerColors: Record<string, string> = {
    "Chase": "#0079C2",
    "Bank of America": "#D95A2B",
    "Wells Fargo": "#CD140A",
    "Citibank": "#004C97",
    "Capital One": "#004977",
    "American Express": "#006FCF",
    "Discover": "#FF6000",
    "Visa": "#1A1F71",
    "Mastercard": "#EB001B",
    "HSBC": "#DB0011"
  };

  // Keyboard shortcut: Ctrl+K to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const input = document.querySelector('input[type="text"]') as HTMLInputElement;
        if (input) input.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    fetchStats();
    fetchIssuers();
    fetchDeclineReasons();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch(`${API}/api/bin/stats`);
      const data = await res.json();
      setStats(data);
    } catch {}
  };

  const fetchIssuers = async () => {
    try {
      const res = await fetch(`${API}/api/bin/issuers`);
      const data = await res.json();
      setIssuers(Array.isArray(data) ? data : []);
    } catch {
      setIssuers([]);
    }
  };

  const fetchDeclineReasons = async () => {
    try {
      const res = await fetch(`${API}/api/bin/decline-reasons`);
      const data = await res.json();
      setDeclineReasons(Array.isArray(data) ? data : []);
    } catch {
      setDeclineReasons([]);
    }
  };

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
        setSearchHistory(prev => [binInput, ...prev.filter(b => b !== binInput)].slice(0, 5));
      }
    } catch (err) {
      setError("Failed to fetch data");
    }
    setLoading(false);
  };

  const exportCSV = () => {
    if (!result) return;
    const headers = Object.keys(result).join(',');
    const values = Object.values(result).join(',');
    const csv = `${headers}\n${values}`;
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bin_${result.bin}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.bin);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#050508] text-slate-100 p-6 overflow-y-auto h-screen">
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-mono text-amber-400 font-bold tracking-wider">
            🔍 BIN INTELLIGENCE
          </h1>
          <p className="text-slate-500 text-sm mt-1">Card BIN Lookup & Analytics Platform</p>
          <p className="text-slate-600 text-xs mt-2">Press <kbd className="px-2 py-0.5 bg-slate-800 rounded text-xs">Ctrl+K</kbd> to focus search</p>
        </div>

        {/* STATS ROW */}
        {stats && (
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-[#0A0A10] border border-slate-800 rounded-lg p-4 text-center hover:border-amber-500/30 transition-all">
              <p className="text-2xl font-mono text-amber-400">
                <CountUp end={stats.total} duration={1.5} />
              </p>
              <p className="text-xs text-slate-500">Total BINs</p>
            </div>
            <div className="bg-[#0A0A10] border border-slate-800 rounded-lg p-4 text-center hover:border-amber-500/30 transition-all">
              <p className="text-2xl font-mono text-amber-400">
                <CountUp end={stats.issuers} duration={1.5} />
              </p>
              <p className="text-xs text-slate-500">Issuers</p>
            </div>
            <div className="bg-[#0A0A10] border border-slate-800 rounded-lg p-4 text-center hover:border-amber-500/30 transition-all">
              <p className="text-2xl font-mono text-amber-400">
                <CountUp end={stats.countries} duration={1.5} />
              </p>
              <p className="text-xs text-slate-500">Countries</p>
            </div>
            <div className="bg-[#0A0A10] border border-slate-800 rounded-lg p-4 text-center hover:border-amber-500/30 transition-all">
              <p className="text-2xl font-mono text-amber-400">
                <CountUp end={stats.avg_decline_rate} duration={1.5} decimals={1} suffix="%" />
              </p>
              <p className="text-xs text-slate-500">Avg Decline</p>
            </div>
          </div>
        )}

        {/* SEARCH SECTION */}
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            placeholder="Enter BIN (e.g., 414700)"
            className="flex-1 bg-[#0A0A10] border border-slate-800 rounded-lg px-4 py-3 text-sm text-slate-300 focus:border-amber-500/60 focus:outline-none font-mono transition-all"
            value={binInput}
            onChange={(e) => setBinInput(e.target.value.replace(/\D/g, ''))}
            onKeyDown={(e) => e.key === "Enter" && lookupBIN()}
          />
          <button
            onClick={lookupBIN}
            className="bg-amber-500/20 border border-amber-500/40 px-8 py-3 rounded-lg text-amber-400 font-mono text-sm hover:bg-amber-500/30 hover:border-amber-500/60 transition-all duration-300 hover:scale-[1.02]"
          >
            LOOKUP
          </button>
        </div>

        {loading && <p className="text-center text-slate-500 animate-pulse">Searching...</p>}
        {error && <p className="text-center text-red-400">{error}</p>}

        {/* RESULT CARD */}
        {result && (
          <div className="bg-[#0A0A10] border border-amber-500/20 rounded-lg p-6 mb-6 animate-in fade-in duration-300">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-xs text-amber-400 font-mono">// BIN RESULT</h3>
              <button
                onClick={copyToClipboard}
                className="text-xs text-slate-500 hover:text-amber-400 transition-all"
              >
                {copied ? '✅ Copied!' : '📋 Copy BIN'}
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="p-3 bg-slate-900/50 rounded">
                <p className="text-slate-500 text-[10px]">BIN</p>
                <p className="text-slate-200 font-mono text-lg text-amber-400">{result.bin}</p>
              </div>
              <div 
                className="p-3 bg-slate-900/50 rounded"
                style={{ borderLeft: `4px solid ${issuerColors[result.issuer] || '#F59E0B'}` }}
              >
                <p className="text-slate-500 text-[10px]">Issuer</p>
                <p className="text-slate-200 font-bold">{result.issuer}</p>
              </div>
              <div className="p-3 bg-slate-900/50 rounded">
                <p className="text-slate-500 text-[10px]">Card Type</p>
                <p className="text-slate-200">{result.card_type}</p>
              </div>
              <div className="p-3 bg-slate-900/50 rounded">
                <p className="text-slate-500 text-[10px]">Country</p>
                <p className="text-slate-200">{result.country}</p>
              </div>
              <div className="p-3 bg-slate-900/50 rounded">
                <p className="text-slate-500 text-[10px]">Decline Rate</p>
                <p className="text-amber-400 font-mono">{(result.decline_rate * 100).toFixed(1)}%</p>
              </div>
              <div className="p-3 bg-slate-900/50 rounded">
                <p className="text-slate-500 text-[10px]">Top Decline Reason</p>
                <p className="text-slate-200">{result.top_decline_reason}</p>
              </div>
            </div>

            {/* EXPORT CSV BUTTON */}
            <div className="mt-4 flex gap-3">
              <button
                onClick={exportCSV}
                className="px-4 py-2 bg-slate-800/50 border border-slate-700 rounded text-xs text-slate-400 hover:text-white hover:border-amber-500/30 transition-all"
              >
                📥 Export CSV
              </button>
            </div>
          </div>
        )}

        {/* CHARTS SECTION */}
        {issuers.length > 0 && declineReasons.length > 0 && (
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div className="bg-[#0A0A10] border border-slate-800 rounded-lg p-4">
              <h3 className="text-xs text-amber-400 font-mono mb-3">// TOP ISSUERS</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={issuers.slice(0, 8)}>
                  <XAxis dataKey="issuer" tick={{ fill: '#64748B', fontSize: 10 }} />
                  <YAxis tick={{ fill: '#64748B', fontSize: 10 }} />
                  <Tooltip contentStyle={{ backgroundColor: '#0A0A10', border: '1px solid #1E293B' }} />
                  <Bar dataKey="count" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-[#0A0A10] border border-slate-800 rounded-lg p-4">
              <h3 className="text-xs text-amber-400 font-mono mb-3">// DECLINE REASONS</h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={declineReasons.slice(0, 6)}
                    dataKey="count"
                    nameKey="top_decline_reason"
                    cx="50%"
                    cy="50%"
                    outerRadius={70}
                    label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {declineReasons.slice(0, 6).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#0A0A10', border: '1px solid #1E293B' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* SEARCH HISTORY */}
        {searchHistory.length > 0 && (
          <div className="bg-[#0A0A10] border border-slate-800 rounded-lg p-4 mb-6">
            <h3 className="text-xs text-amber-400 font-mono mb-2">// RECENT SEARCHES</h3>
            <div className="flex gap-2 flex-wrap">
              {searchHistory.map((bin, i) => (
                <button
                  key={i}
                  onClick={() => { setBinInput(bin); lookupBIN(); }}
                  className="px-3 py-1 bg-slate-900/50 border border-slate-800 rounded text-xs text-slate-400 hover:text-amber-400 hover:border-amber-500/30 transition-all"
                >
                  {bin}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* FOOTER */}
        <div className="text-center text-xs text-slate-600 mt-8 font-mono border-t border-slate-900 pt-4">
          POC-08 · Card BIN Intelligence · Sneha-2104 · Real Rails Batch 5
        </div>
      </div>
    </div>
  );
}