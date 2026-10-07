"use client";

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
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 lg:p-8 shadow-lg mb-8">
      <h3 className="text-sm font-semibold tracking-wide text-slate-400 uppercase mb-6 flex items-center gap-2">
        <span>🏦</span> Select Bank Module
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
        {banks.map((bank) => {
          const isSelected = selectedBank === bank.id;
          return (
            <button
              key={bank.id}
              type="button"
              onClick={() => onSelectBank(bank.id)}
              className={`flex flex-col items-center justify-between p-6 min-h-[160px] rounded-2xl border text-center transition-all duration-200 relative group ${
                isSelected
                  ? "bg-slate-800 border-blue-500 shadow-md ring-1 ring-blue-500"
                  : "bg-slate-950 border-slate-800 hover:border-slate-600 hover:bg-slate-800"
              }`}
            >
              {/* Top Accent Dot */}
              <div
                className={`absolute top-4 right-4 w-2 h-2 rounded-full transition-all duration-200 ${
                  isSelected ? "bg-blue-500" : "bg-slate-700"
                }`}
              />

              {/* Bank Initials Node Avatar */}
              <div
                className={`w-14 h-14 rounded-full flex items-center justify-center font-bold text-lg tracking-wider mt-2 mb-4 transition-all duration-200 group-hover:scale-105 ${getBadgeStyle(
                  bank.id
                )}`}
              >
                {bank.id.includes("_") ? bank.id.split("_")[1].toUpperCase() : bank.id.substring(0, 3)}
              </div>

              {/* Bank Name */}
              <span className={`text-sm font-semibold block truncate w-full tracking-wide transition-colors ${isSelected ? "text-white" : "text-slate-300 group-hover:text-white"}`}>
                {bank.name}
              </span>

              {/* Swift Code */}
              <span className="text-xs font-mono text-slate-500 block mt-2 px-3 py-1 rounded bg-slate-900/50">
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
