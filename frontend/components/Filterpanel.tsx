"use client";

import { useState, useMemo, useRef, useEffect } from "react";

type FilterState = {
  level: string;
  region: string[];
  operator: string;
};

type CountryOption = {
  country_id: number;
  country_name: string;
};

type Props = {
  filters?: FilterState;
  onChange?: (filters: FilterState) => void;
  countryOptions?: CountryOption[];
};

export default function FilterPanel({
  filters = { level: "ALL", region: [], operator: "" },
  onChange = () => {},
  countryOptions = [],
}: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredCountries = useMemo(() => {
    return countryOptions.filter((c) =>
      c.country_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [countryOptions, searchTerm]);

  const toggleCountry = (id: string) => {
    onChange({
      ...filters,
      region: filters.region.includes(id) ? [] : [id],
    });
  };

  const selectedCount = filters.region.length;

  const selectedLabel = useMemo(() => {
    if (selectedCount === 0) return "SELECT GEOGRAPHIC ZONE";
    const selected = countryOptions.find((c) => String(c.country_id) === filters.region[0]);
    return selected?.country_name.toUpperCase() || "SELECT GEOGRAPHIC ZONE";
  }, [filters.region, countryOptions]);

  return (
    <div className="bg-[#06060B]/80 backdrop-blur-xl border border-slate-800/80 px-4 py-3 rounded-lg flex gap-3 items-center z-50 shadow-2xl">
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`text-[11px] font-mono px-3 py-2 rounded w-56 text-left flex justify-between items-center transition duration-200
          ${selectedCount > 0
              ? "bg-[#0A0A10] border border-amber-500/60 text-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.15)]"
              : "bg-[#050508] border border-slate-800 text-slate-400 hover:border-slate-700"
          }`}
        >
          <span className="truncate tracking-wider">{selectedLabel}</span>
          <span className="text-[9px] opacity-60 font-sans">{isOpen ? "▲" : "▼"}</span>
        </button>

        {isOpen && (
          <div className="absolute top-12 left-0 w-64 bg-[#06060B] border border-slate-800 rounded shadow-2xl flex flex-col z-50 animate-slide-in">
            <input
              autoFocus
              placeholder="SEARCH COUNTRIES..."
              className="p-2.5 text-[11px] font-mono bg-[#0A0A10] border-b border-slate-800 outline-none text-slate-200 placeholder-slate-600"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="max-h-60 overflow-y-auto p-1 custom-scrollbar">
              {filteredCountries.map((c) => {
                const id = String(c.country_id);
                return (
                  <label
                    key={id}
                    className="flex items-center gap-2.5 px-3 py-2 hover:bg-slate-900/60 cursor-pointer text-[11px] font-mono text-slate-400 hover:text-white rounded transition"
                  >
                    <input
                      type="checkbox"
                      checked={filters.region.includes(id)}
                      onChange={() => toggleCountry(id)}
                      className="accent-amber-500 rounded border-slate-800 bg-slate-950"
                    />
                    {c.country_name.toUpperCase()}
                  </label>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <input
        placeholder="FILTER OPERATOR MATRIX..."
        value={filters.operator}
        onChange={(e) => onChange({ ...filters, operator: e.target.value })}
        className={`text-[11px] font-mono px-3 py-2 rounded w-56 transition-all duration-200 outline-none
          ${filters.operator
            ? "bg-[#0A0A10] border border-amber-500/60 text-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.15)]"
            : "bg-[#050508] border border-slate-800 text-slate-300 placeholder-slate-600 hover:border-slate-700"
          }
        `}
      />
    </div>
  );
}