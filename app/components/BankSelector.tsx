"use client";

import { Building2, ChevronRight, CheckCircle2 } from "lucide-react";

import { bankConfigs } from "../utils/bankConfig";

const BankSelector = ({ selectedBank, onSelectBank }) => {
  const banks = Object.values(bankConfigs);

  const getBadgeStyle = (id) => {
    switch (id) {
      case "hsbc":
        return "bg-red-900 text-red-100";
      case "bni":
        return "bg-teal-900 text-teal-100";
      case "deutsche":
      case "deutsche_v2":
      case "deutsche_v3":
        return "bg-blue-900 text-blue-100";
      case "mandiri":
        return "bg-amber-900 text-amber-100";
      case "bca":
        return "bg-indigo-900 text-indigo-100";
      case "citi":
        return "bg-cyan-900 text-cyan-100";
      default:
        return "bg-slate-800 text-slate-100";
    }
  };

  return (
    <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 lg:p-8 shadow-2xl mb-8 relative overflow-hidden">
      {/* Subtle glow effect */}
      <div className="absolute top-0 left-1/4 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
      
      <h3 className="text-sm font-semibold tracking-wide text-slate-300 uppercase mb-6 flex items-center gap-2">
        <Building2 className="w-4 h-4 text-blue-400" />
        Select Bank Module
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
        {banks.map((bank) => {
          const isSelected = selectedBank === bank.id;
          return (
            <button
              key={bank.id}
              type="button"
              onClick={() => onSelectBank(bank.id)}
              className={`flex flex-col items-center justify-between p-6 min-h-[160px] rounded-2xl border text-center transition-all duration-300 relative group overflow-hidden ${
                isSelected
                  ? "bg-gradient-to-b from-blue-900/40 to-slate-900/80 border-blue-500/50 shadow-[0_8px_30px_rgb(59,130,246,0.2)] -translate-y-1"
                  : "bg-slate-900/50 border-white/5 hover:border-white/20 hover:bg-slate-800/80 hover:-translate-y-1 hover:shadow-xl"
              }`}
            >
              {/* Selected Indicator */}
              <div
                className={`absolute top-3 right-3 transition-all duration-300 ${
                  isSelected ? "opacity-100 scale-100" : "opacity-0 scale-50"
                }`}
              >
                <CheckCircle2 className="w-5 h-5 text-blue-400" />
              </div>

              {/* Bank Initials Node Avatar */}
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-lg tracking-wider mt-2 mb-4 transition-all duration-300 shadow-inner group-hover:scale-110 ${getBadgeStyle(
                  bank.id
                )} ${isSelected ? "ring-2 ring-blue-400/50 shadow-[0_0_15px_rgba(59,130,246,0.3)]" : ""}`}
              >
                {bank.id.includes("_") ? bank.id.split("_")[1].toUpperCase() : bank.id.substring(0, 3)}
              </div>

              {/* Bank Name */}
              <span className={`text-sm font-semibold block truncate w-full tracking-wide transition-colors ${isSelected ? "text-white" : "text-slate-400 group-hover:text-slate-200"}`}>
                {bank.name}
              </span>

              {/* Swift Code */}
              <div className="mt-2 flex items-center gap-1.5 text-slate-500">
                <span className="text-[10px] font-mono tracking-widest px-2 py-0.5 rounded-md border border-white/10 bg-black/30">
                  {bank.code}
                </span>
                <ChevronRight className={`w-3 h-3 transition-transform duration-300 ${isSelected ? "text-blue-400 translate-x-1" : "opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"}`} />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BankSelector;
