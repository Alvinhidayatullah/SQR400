"use client";

import HSBCPrintout from "../banks/hsbc/HSBCPrintout";

const TransactionResult = ({ data, onBack }) => {
  // Cek bank ID, render sesuai bank
  if (data?.bankId === "hsbc") {
    return <HSBCPrintout data={data} onBack={onBack} />;
  }

  // Default fallback untuk bank lain (sementara)
  return (
    <div className="bg-gray-200 rounded-2xl p-4 md:p-6">
      <div className="flex flex-wrap justify-between gap-3 mb-6">
        <button onClick={onBack} className="px-5 py-2.5 bg-gray-300 hover:bg-gray-400 rounded-lg font-semibold transition text-base">
          ← Back to Form
        </button>
        <button onClick={() => window.print()} className="px-5 py-2.5 bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-900 hover:to-black text-white rounded-lg font-semibold transition text-base shadow-md">
          🖨️ Print / Download PDF
        </button>
      </div>
      <div className="bg-white rounded-2xl p-8 shadow-2xl">
        <div className="text-center">
          <p className="text-lg font-bold text-gray-800">✅ Transaction Generated Successfully</p>
          <p className="text-base text-gray-500 mt-2">Bank: {data?.selectedBank || "Unknown"}</p>
          <p className="text-base text-gray-500">
            Amount: {data?.transaction?.currency || "USD"} {data?.transaction?.amount || "0"}
          </p>
          <p className="text-base text-gray-500 mt-4">Printout untuk bank ini sedang dalam pengembangan.</p>
          <p className="text-sm text-gray-400 mt-2">Saat ini hanya HSBC yang memiliki format printout lengkap.</p>
        </div>
      </div>
    </div>
  );
};

export default TransactionResult;
