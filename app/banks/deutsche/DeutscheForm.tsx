"use client";

import { useState } from "react";

const DeutscheForm = ({ onSubmit, initialData = {} as any }: any) => {
  const [formData, setFormData] = useState({
    institution: {
      swiftCode: initialData.institution?.swiftCode || "DEUTDEBB",
      accountNumber: initialData.institution?.accountNumber || "DE1234567890123456",
      accountName: initialData.institution?.accountName || "DEUTSCHE TRADING GMBH",
      bankName: initialData.institution?.bankName || "DEUTSCHE BANK AG",
      address: initialData.institution?.address || "OTTE SUHR ALLEE 6-16, 108833, BERLIN, GERMANY",
    },
    transaction: {
      senderReference: initialData.transaction?.senderReference || "DEUT587069248914",
      transactionCode: initialData.transaction?.transactionCode || "DEUTDEBB248914",
      bankOperationCode: initialData.transaction?.bankOperationCode || "CRED",
      valueDate: initialData.transaction?.valueDate || "2024-10-25",
      currency: initialData.transaction?.currency || "EUR",
      amount: initialData.transaction?.amount || "250000",
      instructedAmount: initialData.transaction?.instructedAmount || "250000",
      remittanceInfo: initialData.transaction?.remittanceInfo || "INVOICE SETTLEMENT",
      charges: initialData.transaction?.charges || "OUR",
    },
    beneficiary: {
      swiftCode: initialData.beneficiary?.swiftCode || "BNINIDJAXXX",
      accountNumber: initialData.beneficiary?.accountNumber || "9876543210",
      accountName: initialData.beneficiary?.accountName || "PT DEUTSCHE BENEFICIARY INDO",
      bankName: initialData.beneficiary?.bankName || "PT BANK NEGARA INDONESIA TBK",
      address: initialData.beneficiary?.address || "KCU KEDIRI, JL. BRAWIJAYA NO. 17, JAWA TIMUR",
    },
    sender: {
      bankName: initialData.sender?.bankName || "DEUTSCHE BANK",
      senderServer: initialData.sender?.senderServer || "DEUTDEBBXXX",
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
      bankId: "deutsche",
      selectedBank: "Deutsche Bank",
      transactionDate: new Date().toLocaleString(),
      generatedAt: new Date().toISOString(),
    });
  };

  const inputClass = "w-full px-4 py-2.5 bg-slate-950/80 border border-slate-850 focus:border-cyan-500 rounded-xl focus:ring-2 focus:ring-cyan-550/10 focus:shadow-[0_0_15px_rgba(6,182,212,0.05)] transition-all duration-300 text-base text-slate-100 placeholder-slate-650 outline-none";
  const selectClass = "w-full px-4 py-2.5 bg-slate-950/80 border border-slate-850 focus:border-cyan-500 rounded-xl focus:ring-2 focus:ring-cyan-550/10 focus:shadow-[0_0_15px_rgba(6,182,212,0.05)] transition-all duration-300 text-base text-slate-100 outline-none";
  const labelClass = "text-sm font-bold text-slate-400 block mb-1.5 uppercase tracking-widest";
  const sectionClass = "border border-slate-850 rounded-2xl p-5 bg-slate-950/20 mb-6 relative overflow-hidden";

  return (
    <form onSubmit={handleSubmit} className="bg-slate-900/30 border border-slate-850 rounded-3xl p-6 md:p-8 shadow-2xl backdrop-blur-md relative overflow-hidden">
      {/* Glow Line Indicator */}
      <div className="absolute top-0 left-6 right-6 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />

      {/* Header Deutsche Bank */}
      <div className="flex items-center gap-4 mb-6 pb-5 border-b border-slate-855">
        <div className="w-12 h-12 bg-blue-500/10 text-blue-400 border border-blue-900/30 rounded-xl flex items-center justify-center font-black text-sm tracking-wider shadow-lg">
          DB
        </div>
        <div>
          <h2 className="text-base font-bold text-white tracking-widest uppercase">DEUTSCHE NODE</h2>
          <p className="text-sm text-slate-500 font-mono tracking-wider uppercase">MT103 Transaction Parameters Configurator</p>
        </div>
      </div>

      {/* SENDER (INSTITUTION) DETAILS */}
      <div className={sectionClass}>
        <h3 className="text-base font-bold text-slate-200 flex items-center gap-2 mb-1">
          <span>🏛️</span> SENDER (INSTITUTION) DETAILS
        </h3>
        <p className="text-sm text-slate-500 italic mb-4">Sender Bank and Account Info</p>
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
        <h3 className="text-base font-bold text-slate-200 flex items-center gap-2 mb-1">
          <span>👤</span> BENEFICIARY CUSTOMER DETAILS
        </h3>
        <p className="text-sm text-slate-500 italic mb-4">Receiver/Beneficiary Info</p>
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
        <h3 className="text-base font-bold text-slate-200 flex items-center gap-2 mb-1">
          <span>📝</span> TRANSACTION DETAILS
        </h3>
        <p className="text-sm text-slate-500 italic mb-4">Value Date, Amount and Currency Info</p>
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
              className="w-full px-3 py-2 bg-slate-950 border-2 border-slate-800 focus:border-blue-900 rounded-xl text-sm text-slate-100 outline-none focus:ring-2 focus:ring-blue-950/40"
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
              <option value="EUR">EUR - Euro</option>
              <option value="USD">USD - US Dollar</option>
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
        className="w-full py-4 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-550 hover:to-purple-550 text-white rounded-2xl font-bold text-sm tracking-widest shadow-xl shadow-cyan-500/10 hover:shadow-cyan-500/25 transition-all duration-300 transform active:scale-[0.98] uppercase"
      >
        ⚡ BROADCAST TRANSACTION NODE & GENERATE MT103
      </button>
    </form>
  );
};

export default DeutscheForm;
