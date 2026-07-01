"use client";

import { useState } from "react";

const BCAForm = ({ onSubmit, initialData = {} }) => {
  const [formData, setFormData] = useState({
    institution: {
      swiftCode: initialData.institution?.swiftCode || "BCAIIDJA",
      accountNumber: initialData.institution?.accountNumber || "0123456789",
      accountName: initialData.institution?.accountName || "PT BCA CAPITAL UTAMA",
      bankName: initialData.institution?.bankName || "PT BANK CENTRAL ASIA TBK",
      address: initialData.institution?.address || "JALAN MH THAMRIN NO 1, JAKARTA",
    },
    transaction: {
      senderReference: initialData.transaction?.senderReference || "BCA587069248914",
      transactionCode: initialData.transaction?.transactionCode || "BCAIIDJA248914",
      bankOperationCode: initialData.transaction?.bankOperationCode || "CRED",
      valueDate: initialData.transaction?.valueDate || "2024-10-25",
      currency: initialData.transaction?.currency || "IDR",
      amount: initialData.transaction?.amount || "500000000",
      instructedAmount: initialData.transaction?.instructedAmount || "500000000",
      remittanceInfo: initialData.transaction?.remittanceInfo || "TRADE SETTLEMENT",
      charges: initialData.transaction?.charges || "OUR",
    },
    beneficiary: {
      swiftCode: initialData.beneficiary?.swiftCode || "BNINIDJAXXX",
      accountNumber: initialData.beneficiary?.accountNumber || "9876543210",
      accountName: initialData.beneficiary?.accountName || "PT GLOBAL LOGISTIK INDONESIA",
      bankName: initialData.beneficiary?.bankName || "PT BANK NEGARA INDONESIA TBK",
      address: initialData.beneficiary?.address || "KCU KEDIRI, JL. BRAWIJAYA NO. 17, JAWA TIMUR",
    },
    sender: {
      bankName: initialData.sender?.bankName || "BCA",
      senderServer: initialData.sender?.senderServer || "BCAIIDJAXXX",
      instrument: initialData.sender?.instrument || "MT103",
    },
  });

  const handleChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.institution.swiftCode || !formData.beneficiary.accountNumber) {
      alert("Please fill in required fields: Swift Code and Beneficiary Account Number");
      return;
    }

    onSubmit({
      ...formData,
      bankId: "bca",
      selectedBank: "BCA",
      transactionDate: new Date().toLocaleString(),
      generatedAt: new Date().toISOString(),
    });
  };

  const inputClass = "w-full px-4 py-2.5 bg-slate-950 border-2 border-slate-800 focus:border-blue-600 rounded-xl focus:ring-2 focus:ring-blue-900/30 transition-all duration-200 text-sm text-slate-100 placeholder-slate-600 outline-none";
  const selectClass = "w-full px-4 py-2.5 bg-slate-950 border-2 border-slate-800 focus:border-blue-600 rounded-xl focus:ring-2 focus:ring-blue-900/30 transition-all duration-200 text-sm text-slate-100 outline-none";
  const labelClass = "text-xs font-bold text-slate-400 block mb-1.5 uppercase tracking-wider";
  const sectionClass = "border border-slate-800 rounded-2xl p-5 bg-slate-950/40 mb-6";

  return (
    <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl">
      {/* Header BCA */}
      <div className="flex items-center gap-4 mb-6 pb-5 border-b border-slate-800">
        <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-xs tracking-wider shadow-lg shadow-blue-600/20">
          BCA
        </div>
        <div>
          <h2 className="text-xl font-bold text-white tracking-wide">BCA Indonesia Terminal</h2>
          <p className="text-xs text-slate-400">MT103 SWIFT Document Generator</p>
        </div>
      </div>

      {/* SENDER (INSTITUTION) DETAILS */}
      <div className={sectionClass}>
        <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2 mb-1">
          <span>🏛️</span> SENDER (INSTITUTION) DETAILS
        </h3>
        <p className="text-[10px] text-slate-500 italic mb-4">Sender Bank and Account Info</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Swift Code *</label>
            <input
              type="text"
              className={inputClass}
              value={formData.institution.swiftCode}
              onChange={(e) => handleChange("institution", "swiftCode", e.target.value)}
              required
            />
          </div>
          <div>
            <label className={labelClass}>Account Number</label>
            <input
              type="text"
              className={inputClass}
              value={formData.institution.accountNumber}
              onChange={(e) => handleChange("institution", "accountNumber", e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass}>Account Name</label>
            <input
              type="text"
              className={inputClass}
              value={formData.institution.accountName}
              onChange={(e) => handleChange("institution", "accountName", e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass}>Bank Name</label>
            <input
              type="text"
              className={inputClass}
              value={formData.institution.bankName}
              onChange={(e) => handleChange("institution", "bankName", e.target.value)}
            />
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>Address</label>
            <input
              type="text"
              className={inputClass}
              value={formData.institution.address}
              onChange={(e) => handleChange("institution", "address", e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* BENEFICIARY DETAILS */}
      <div className={sectionClass}>
        <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2 mb-1">
          <span>👤</span> BENEFICIARY CUSTOMER DETAILS
        </h3>
        <p className="text-[10px] text-slate-500 italic mb-4">Receiver/Beneficiary Info</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Account Number *</label>
            <input
              type="text"
              className={inputClass}
              value={formData.beneficiary.accountNumber}
              onChange={(e) => handleChange("beneficiary", "accountNumber", e.target.value)}
              required
            />
          </div>
          <div>
            <label className={labelClass}>Account Name *</label>
            <input
              type="text"
              className={inputClass}
              value={formData.beneficiary.accountName}
              onChange={(e) => handleChange("beneficiary", "accountName", e.target.value)}
              required
            />
          </div>
          <div>
            <label className={labelClass}>Bank Swift Code</label>
            <input
              type="text"
              className={inputClass}
              value={formData.beneficiary.swiftCode}
              onChange={(e) => handleChange("beneficiary", "swiftCode", e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass}>Bank Name</label>
            <input
              type="text"
              className={inputClass}
              value={formData.beneficiary.bankName}
              onChange={(e) => handleChange("beneficiary", "bankName", e.target.value)}
            />
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>Address</label>
            <input
              type="text"
              className={inputClass}
              value={formData.beneficiary.address}
              onChange={(e) => handleChange("beneficiary", "address", e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* TRANSACTION DETAILS */}
      <div className={sectionClass}>
        <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2 mb-1">
          <span>📝</span> TRANSACTION DETAILS
        </h3>
        <p className="text-[10px] text-slate-500 italic mb-4">Value Date, Amount and Currency Info</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Sender Reference</label>
            <input
              type="text"
              className={inputClass}
              value={formData.transaction.senderReference}
              onChange={(e) => handleChange("transaction", "senderReference", e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass}>Transaction Code</label>
            <input
              type="text"
              className={inputClass}
              value={formData.transaction.transactionCode}
              onChange={(e) => handleChange("transaction", "transactionCode", e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass}>Value Date</label>
            <input
              type="date"
              className="w-full px-3 py-2 bg-slate-950 border-2 border-slate-800 focus:border-blue-600 rounded-xl text-xs text-slate-100 outline-none focus:ring-2 focus:ring-blue-900/30"
              value={formData.transaction.valueDate}
              onChange={(e) => handleChange("transaction", "valueDate", e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass}>Currency</label>
            <select
              className={selectClass}
              value={formData.transaction.currency}
              onChange={(e) => handleChange("transaction", "currency", e.target.value)}
            >
              <option value="IDR">IDR - Indonesian Rupiah</option>
              <option value="USD">USD - US Dollar</option>
              <option value="EUR">EUR - Euro</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Amount *</label>
            <input
              type="number"
              className={inputClass}
              value={formData.transaction.amount}
              onChange={(e) => handleChange("transaction", "amount", e.target.value)}
              required
            />
          </div>
          <div>
            <label className={labelClass}>Charges</label>
            <select
              className={selectClass}
              value={formData.transaction.charges}
              onChange={(e) => handleChange("transaction", "charges", e.target.value)}
            >
              <option value="OUR">OUR - Sender pays all</option>
              <option value="BEN">BEN - Beneficiary pays all</option>
              <option value="SHA">SHA - Shared charges</option>
            </select>
          </div>
        </div>
      </div>

      {/* SUBMIT BUTTON */}
      <button
        type="submit"
        className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-755 hover:from-blue-700 hover:to-blue-800 text-white rounded-2xl font-black text-sm tracking-widest shadow-lg shadow-blue-600/20 hover:shadow-blue-600/35 transition-all duration-300 transform active:scale-[0.98] uppercase"
      >
        ⚡ Generate BCA SWIFT MT103 Document
      </button>
    </form>
  );
};

export default BCAForm;
