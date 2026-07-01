"use client";

import { bankConfigs } from "../utils/bankConfig";

const BankSelector = ({ selectedBank, onSelectBank }) => {
  const banks = Object.values(bankConfigs);

  // Helper for bank badge colors - adjusted for sleek web3 theme
  const getBadgeStyle = (id) => {
    switch (id) {
      case "hsbc":
        return "bg-red-500/10 text-red-400 border border-red-550/30";
      case "bni":
        return "bg-teal-500/10 text-teal-400 border border-teal-550/30";
      case "deutsche":
        return "bg-blue-500/10 text-blue-400 border border-blue-550/30";
      case "mandiri":
        return "bg-amber-500/10 text-amber-400 border border-amber-550/30";
      case "bca":
        return "bg-indigo-500/10 text-indigo-400 border border-indigo-550/30";
      case "citi":
        return "bg-cyan-500/10 text-cyan-400 border border-cyan-550/30";
      default:
        return "bg-slate-500/10 text-slate-400 border border-slate-550/30";
    }
  };

  return (
    <div className="bg-[#020617]/40 border border-white/5 rounded-[2rem] p-6 lg:p-8 shadow-[0_0_40px_rgba(0,0,0,0.5)] mb-10 backdrop-blur-3xl relative overflow-hidden">
      {/* Background neon visual line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />
      
      <h3 className="text-xs font-semibold tracking-widest text-slate-400 uppercase mb-6 flex items-center gap-2 font-outfit">
        <span>⛓️</span> [ ACTIVE SWIFT GATEWAY NODES ]
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-6">
        {banks.map((bank) => {
          const isSelected = selectedBank === bank.id;
          return (
            <button
              key={bank.id}
              type="button"
              onClick={() => onSelectBank(bank.id)}
              className={`flex flex-col items-center justify-between p-5 rounded-[1.5rem] border text-center transition-all duration-300 relative overflow-hidden group font-sans ${
                isSelected
                  ? "bg-slate-900/80 border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.15)] -translate-y-1"
                  : "bg-white/5 border-white/5 hover:border-white/10 hover:bg-white/10 hover:-translate-y-1"
              }`}
            >
              {/* Top Accent Dot */}
              <div
                className={`absolute top-4 right-4 w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                  isSelected ? "bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(34,211,238,0.8)]" : "bg-slate-700"
                }`}
              />

              {/* Bank Initials Node Avatar */}
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-sm tracking-wider mt-2 mb-4 shadow-md uppercase transition-all duration-300 group-hover:scale-110 font-outfit ${getBadgeStyle(
                  bank.id
                )} ${isSelected ? "ring-2 ring-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.1)]" : ""}`}
              >
                {bank.id.substring(0, 3)}
              </div>

              {/* Bank Name */}
              <span className={`text-xs font-semibold block truncate w-full tracking-wide transition-colors font-outfit ${isSelected ? "text-cyan-50" : "text-slate-300 group-hover:text-white"}`}>
                {bank.name.toUpperCase()}
              </span>

              {/* Swift Code */}
              <span className="text-[10px] font-mono text-slate-500 block mt-2 tracking-widest px-2.5 py-1 rounded-lg border border-white/5 bg-black/20">
                {bank.code}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BankSelector;
