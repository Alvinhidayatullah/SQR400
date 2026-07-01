"use client";

import { bankConfigs } from "../utils/bankConfig";

const BankSelector = ({ selectedBank, onSelectBank }) => {
  const banks = Object.values(bankConfigs);

  // Helper for bank badge colors
  const getBadgeStyle = (id) => {
    switch (id) {
      case "hsbc":
        return "bg-red-600 text-white";
      case "bni":
        return "bg-teal-600 text-white";
      case "deutsche":
        return "bg-blue-900 text-white";
      case "mandiri":
        return "bg-yellow-500 text-slate-900";
      case "bca":
        return "bg-blue-600 text-white";
      case "citi":
        return "bg-blue-500 text-white";
      case "standard":
        return "bg-emerald-600 text-white";
      case "dbs":
        return "bg-red-700 text-white";
      default:
        return "bg-slate-600 text-white";
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl mb-8">
      <h3 className="text-sm font-bold tracking-wider text-slate-400 uppercase mb-4 flex items-center gap-2">
        <span>🏦</span> Select Active SWIFT Terminal
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
        {banks.map((bank) => {
          const isSelected = selectedBank === bank.id;
          return (
            <button
              key={bank.id}
              type="button"
              onClick={() => onSelectBank(bank.id)}
              className={`flex flex-col items-center justify-between p-4 rounded-xl border text-center transition-all duration-300 relative overflow-hidden group ${
                isSelected
                  ? "bg-slate-800 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.3)] scale-[1.03]"
                  : "bg-slate-950/40 border-slate-800 hover:border-slate-700 hover:bg-slate-900/55 hover:scale-[1.01]"
              }`}
            >
              {/* Top Accent Line */}
              <div
                className={`absolute top-0 left-0 right-0 h-1 transition-all duration-300 ${
                  isSelected ? "bg-blue-500" : "bg-transparent group-hover:bg-slate-700"
                }`}
              />

              {/* Initials/Logo Badge */}
              <div
                className={`w-12 h-12 rounded-lg flex items-center justify-center font-black text-xs tracking-wider mb-3 shadow-md uppercase transition-transform duration-300 group-hover:scale-110 ${getBadgeStyle(
                  bank.id
                )}`}
              >
                {bank.id.substring(0, 3)}
              </div>

              {/* Bank Name */}
              <span className="text-xs font-bold text-slate-200 block truncate w-full">
                {bank.name}
              </span>

              {/* Swift Code */}
              <span className="text-[10px] font-mono text-slate-500 block mt-1 tracking-tight">
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
