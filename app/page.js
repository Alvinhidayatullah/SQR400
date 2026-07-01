"use client";

import { useState } from "react";
import BankSelector from "./components/BankSelector";
import HSBCForm from "./banks/hsbc/HSBCForm";
import BNIForm from "./banks/bni/BNIForm";
import DeutscheForm from "./banks/deutsche/DeutscheForm";
import MandiriForm from "./banks/mandiri/MandiriForm";
import BCAForm from "./banks/bca/BCAForm";
import CitiForm from "./banks/citi/CitiForm";
import TransactionResult from "./components/TransactionResult";

export default function Home() {
  const [selectedBank, setSelectedBank] = useState("hsbc");
  const [transactionData, setTransactionData] = useState(null);
  const [showResult, setShowResult] = useState(false);

  const handleSubmit = (data) => {
    setTransactionData(data);
    setShowResult(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = () => {
    setShowResult(false);
  };

  const renderForm = () => {
    switch (selectedBank) {
      case "hsbc":
        return <HSBCForm onSubmit={handleSubmit} />;
      case "bni":
        return <BNIForm onSubmit={handleSubmit} />;
      case "deutsche":
        return <DeutscheForm onSubmit={handleSubmit} />;
      case "mandiri":
        return <MandiriForm onSubmit={handleSubmit} />;
      case "bca":
        return <BCAForm onSubmit={handleSubmit} />;
      case "citi":
        return <CitiForm onSubmit={handleSubmit} />;
      default:
        return <HSBCForm onSubmit={handleSubmit} />;
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 md:px-8 font-sans antialiased relative overflow-hidden">
      {/* Deep Space Glowing Accent Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/10 blur-[150px] pointer-events-none select-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-500/5 blur-[150px] pointer-events-none select-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="bg-slate-900/80 backdrop-blur-md border-t border-x border-slate-800 rounded-t-2xl px-6 py-5 flex flex-col sm:flex-row justify-between items-center shadow-2xl no-print">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_#10b981]" />
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-wider bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-400">
              SQR400 <span className="text-blue-500 text-lg font-bold">v5.8</span>
            </h1>
          </div>
          <span className="bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 px-4 py-1.5 rounded-full text-xs font-black shadow-lg shadow-orange-500/10 mt-2 sm:mt-0 uppercase tracking-widest">
            ⭐ Premium Plan Active
          </span>
        </div>

        {/* Navigation */}
        <div className="bg-slate-900/40 backdrop-blur-md border-b border-x border-slate-800 px-6 py-3 rounded-b-2xl flex flex-wrap gap-6 text-slate-400 text-xs font-semibold shadow-2xl no-print mb-8">
          <span className="hover:text-white cursor-pointer transition-colors duration-200 border-b border-transparent hover:border-blue-500 pb-1">
            Terminal Home
          </span>
          <span className="hover:text-white cursor-pointer transition-colors duration-200 border-b border-transparent hover:border-blue-500 pb-1">
            MT103 Switcher
          </span>
          <span className="hover:text-white cursor-pointer transition-colors duration-200 border-b border-transparent hover:border-blue-500 pb-1">
            Pricing
          </span>
          <span className="hover:text-white cursor-pointer transition-colors duration-200 border-b border-transparent hover:border-blue-500 pb-1">
            Configuration
          </span>
          <span className="hover:text-white cursor-pointer transition-colors duration-200 border-b border-transparent hover:border-blue-500 pb-1">
            Activity Log
          </span>
          <span className="hover:text-white cursor-pointer transition-colors duration-200 border-b border-transparent hover:border-blue-500 pb-1">
            Terminal Help
          </span>
        </div>

        {/* Bank Selector */}
        <div className="no-print">
          <BankSelector selectedBank={selectedBank} onSelectBank={setSelectedBank} />
        </div>

        {/* Form or Result Container */}
        <div className="transition-all duration-300">
          {!showResult ? (
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-1 md:p-2 shadow-2xl">
              {renderForm()}
            </div>
          ) : (
            <TransactionResult data={transactionData} onBack={handleBack} />
          )}
        </div>
      </div>
    </main>
  );
}
