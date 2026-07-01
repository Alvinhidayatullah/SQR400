"use client";

import { useState } from "react";

const HSBCForm = ({ onSubmit, initialData = {} as any }: any) => {
  const [showTechnical, setShowTechnical] = useState(false);
  const [formData, setFormData] = useState({
    institution: {
      swiftCode: initialData.institution?.swiftCode || "HBUKGB4B",
      accountNumber: initialData.institution?.accountNumber || "GB32HBUK40086810148040",
      accountName: initialData.institution?.accountName || "XA FINANCIAL LTD",
      bankName: initialData.institution?.bankName || "HSBC UK BANK PLC",
      address: initialData.institution?.address || "AYLESBURY, MARKET SQUARE, 8 MARKET SQUARE, AYLESBURY, HP 20 1TW, UK",
    },
    transaction: {
      senderReference: initialData.transaction?.senderReference || "HSBC587069248914",
      transactionCode: initialData.transaction?.transactionCode || "HBUKGB4B248914",
      bankOperationCode: initialData.transaction?.bankOperationCode || "CRED",
      valueDate: initialData.transaction?.valueDate || "2024-10-25",
      transactionTime: initialData.transaction?.transactionTime || "15:30:30",
      currency: initialData.transaction?.currency || "EUR",
      amount: initialData.transaction?.amount || "3500000",
      instructedAmount: initialData.transaction?.instructedAmount || "3500000",
      remittanceInfo: initialData.transaction?.remittanceInfo || "INVESTMENT",
      charges: initialData.transaction?.charges || "OUR",
    },
    receiverBank: {
      bankName: initialData.receiverBank?.bankName || "BANK NEGARA INDONESIA - PT (PERSERO)",
      swiftCode: initialData.receiverBank?.swiftCode || "BNINIDJAXXX",
      address: initialData.receiverBank?.address || "BNI BUILDING, FLOOR 7, JALAN JENDERAL SUDIRMAN 1, JAKARTA, INDONESIA",
    },
    beneficiary: {
      swiftCode: initialData.beneficiary?.swiftCode || "BNINIDJAXXX",
      accountNumber: initialData.beneficiary?.accountNumber || "8980888829",
      accountName: initialData.beneficiary?.accountName || "PT ALDO PUTRA MANDIRI BANDUNG",
      bankName: initialData.beneficiary?.bankName || "BANK NEGARA INDONESIA - PT (PERSERO)",
      address: initialData.beneficiary?.address || "BNI BUILDING, JALAN ASIA AFRIKA, BANDUNG, INDONESIA",
    },
    technical: {
      srcRte: initialData.technical?.srcRte || "HBUKGB4BXXX",
      destRte: initialData.technical?.destRte || "BNINIDJAXXX",
      sessionHeader: initialData.technical?.sessionHeader || "HBUKGB4BXXX",
      msgInputRef: initialData.technical?.msgInputRef || "HBUKGB4BXXX75412835942185",
      msgOutputRef: initialData.technical?.msgOutputRef || "BNINIDJAXXX76102436987104",
      chk: initialData.technical?.chk || "HBUKGB4B2119809863",
      pkiSignature: initialData.technical?.pkiSignature || "MAC-EQUIVALENT",
      trackCode: initialData.technical?.trackCode || "",
      cipher: initialData.technical?.cipher || "",
      transmissionCode: initialData.technical?.transmissionCode || "",
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
      bankId: "hsbc",
      selectedBank: "HSBC UK",
      transactionDate: new Date().toLocaleString(),
      generatedAt: new Date().toISOString(),
    });
  };

  const inputClass = "w-full px-4 py-2.5 bg-slate-950/80 border border-slate-850 focus:border-cyan-500 rounded-xl focus:ring-2 focus:ring-cyan-500/10 focus:shadow-[0_0_15px_rgba(6,182,212,0.05)] transition-all duration-300 text-base text-slate-100 placeholder-slate-650 outline-none";
  const selectClass = "w-full px-4 py-2.5 bg-slate-950/80 border border-slate-850 focus:border-cyan-500 rounded-xl focus:ring-2 focus:ring-cyan-500/10 focus:shadow-[0_0_15px_rgba(6,182,212,0.05)] transition-all duration-300 text-base text-slate-100 outline-none";
  const labelClass = "text-sm font-bold text-slate-400 block mb-1.5 uppercase tracking-widest";
  const sectionClass = "border border-slate-850 rounded-2xl p-5 bg-slate-950/20 mb-6 relative overflow-hidden";

  return (
    <form onSubmit={handleSubmit} className="bg-slate-900/30 border border-slate-850 rounded-3xl p-6 md:p-8 shadow-2xl backdrop-blur-md relative overflow-hidden">
      {/* Glow Line Indicator */}
      <div className="absolute top-0 left-6 right-6 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />

      {/* Header HSBC */}
      <div className="flex items-center gap-4 mb-6 pb-5 border-b border-slate-850">
        <div className="w-12 h-12 bg-red-650/15 text-red-400 border border-red-900/30 rounded-xl flex items-center justify-center font-black text-sm tracking-wider shadow-lg">
          HSBC
        </div>
        <div>
          <h2 className="text-base font-bold text-white tracking-widest uppercase">HSBC UK NODE</h2>
          <p className="text-sm text-slate-500 font-mono tracking-wider uppercase">MT103 Transaction Parameters Configurator</p>
        </div>
      </div>

      {/* SENDER (INSTITUTION) DETAILS */}
      <div className={sectionClass}>
        <h3 className="text-base font-bold text-slate-200 flex items-center gap-2 mb-1">
          <span>🏛️</span> SENDER (INSTITUTION) DETAILS
        </h3>
        <p className="text-sm text-slate-500 italic mb-4">F50A/F52A: Account with Institution / Sender Details</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>
              Swift Code <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className={inputClass}
              value={formData.institution.swiftCode}
              onChange={(e) => handleChange("institution", "swiftCode", e.target.value)}
              placeholder="e.g., HBUKGB4B"
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
              placeholder="e.g., GB32HBUK40086810148040"
            />
          </div>
          <div>
            <label className={labelClass}>Account Name</label>
            <input
              type="text"
              className={inputClass}
              value={formData.institution.accountName}
              onChange={(e) => handleChange("institution", "accountName", e.target.value)}
              placeholder="e.g., XA FINANCIAL LTD"
            />
          </div>
          <div>
            <label className={labelClass}>Bank Name</label>
            <input
              type="text"
              className={inputClass}
              value={formData.institution.bankName}
              onChange={(e) => handleChange("institution", "bankName", e.target.value)}
              placeholder="e.g., HSBC UK BANK PLC"
            />
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>Address</label>
            <input
              type="text"
              className={inputClass}
              value={formData.institution.address}
              onChange={(e) => handleChange("institution", "address", e.target.value)}
              placeholder="e.g., AYLESBURY, MARKET SQUARE, 8 MARKET SQUARE, AYLESBURY, HP 20 1TW, UK"
            />
          </div>
        </div>
      </div>

      {/* RECEIVER BANK DETAILS */}
      <div className={sectionClass}>
        <h3 className="text-base font-bold text-slate-200 flex items-center gap-2 mb-1">
          <span>🏦</span> RECEIVER BANK DETAILS
        </h3>
        <p className="text-sm text-slate-500 italic mb-4">F57A: Receiver Institution / Correspondent Bank</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Bank Name</label>
            <input
              type="text"
              className={inputClass}
              value={formData.receiverBank.bankName}
              onChange={(e) => handleChange("receiverBank", "bankName", e.target.value)}
              placeholder="e.g., BANK NEGARA INDONESIA - PT (PERSERO)"
            />
          </div>
          <div>
            <label className={labelClass}>Swift Code</label>
            <input
              type="text"
              className={inputClass}
              value={formData.receiverBank.swiftCode}
              onChange={(e) => handleChange("receiverBank", "swiftCode", e.target.value)}
              placeholder="e.g., BNINIDJAXXX"
            />
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>Address</label>
            <input
              type="text"
              className={inputClass}
              value={formData.receiverBank.address}
              onChange={(e) => handleChange("receiverBank", "address", e.target.value)}
              placeholder="e.g., BNI BUILDING, FLOOR 7, JALAN JENDERAL SUDIRMAN 1, JAKARTA, INDONESIA"
            />
          </div>
        </div>
      </div>

      {/* BENEFICIARY CUSTOMER DETAILS */}
      <div className={sectionClass}>
        <h3 className="text-base font-bold text-slate-200 flex items-center gap-2 mb-1">
          <span>👤</span> BENEFICIARY CUSTOMER DETAILS
        </h3>
        <p className="text-sm text-slate-500 italic mb-4">F59: Beneficiary Customer Name and Address</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>
              Account Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className={inputClass}
              value={formData.beneficiary.accountNumber}
              onChange={(e) => handleChange("beneficiary", "accountNumber", e.target.value)}
              placeholder="e.g., 8980888829"
              required
            />
          </div>
          <div>
            <label className={labelClass}>
              Account Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className={inputClass}
              value={formData.beneficiary.accountName}
              onChange={(e) => handleChange("beneficiary", "accountName", e.target.value)}
              placeholder="e.g., PT ALDO PUTRA MANDIRI BANDUNG"
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
              placeholder="e.g., BNINIDJAXXX"
            />
          </div>
          <div>
            <label className={labelClass}>Bank Name</label>
            <input
              type="text"
              className={inputClass}
              value={formData.beneficiary.bankName}
              onChange={(e) => handleChange("beneficiary", "bankName", e.target.value)}
              placeholder="e.g., BANK NEGARA INDONESIA - PT (PERSERO)"
            />
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>Address</label>
            <input
              type="text"
              className={inputClass}
              value={formData.beneficiary.address}
              onChange={(e) => handleChange("beneficiary", "address", e.target.value)}
              placeholder="e.g., BNI BUILDING, JALAN ASIA AFRIKA, BANDUNG, INDONESIA"
            />
          </div>
        </div>
      </div>

      {/* TRANSACTION DETAILS */}
      <div className={sectionClass}>
        <h3 className="text-base font-bold text-slate-200 flex items-center gap-2 mb-1">
          <span>📝</span> TRANSACTION DETAILS
        </h3>
        <p className="text-sm text-slate-500 italic mb-4">SWIFT Fields: F20, F21, F23B, F32A, F33B, F70, F71A, F77B</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>{"Sender's Reference (F20)"}</label>
            <input
              type="text"
              className={inputClass}
              value={formData.transaction.senderReference}
              onChange={(e) => handleChange("transaction", "senderReference", e.target.value)}
              placeholder="e.g., HSBC587069248914"
            />
          </div>
          <div>
            <label className={labelClass}>Transaction Code (F21)</label>
            <input
              type="text"
              className={inputClass}
              value={formData.transaction.transactionCode}
              onChange={(e) => handleChange("transaction", "transactionCode", e.target.value)}
              placeholder="e.g., HBUKGB4B248914"
            />
          </div>
          <div>
            <label className={labelClass}>Bank Operation Code (F23B)</label>
            <select
              className={selectClass}
              value={formData.transaction.bankOperationCode}
              onChange={(e) => handleChange("transaction", "bankOperationCode", e.target.value)}
            >
              <option value="CRED">CRED - Credit</option>
              <option value="DEBT">DEBT - Debt</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className={labelClass}>Value Date</label>
              <input
                type="date"
                className="w-full px-3 py-2 bg-slate-950 border-2 border-slate-800 focus:border-red-600 rounded-xl text-sm text-slate-100 outline-none focus:ring-2 focus:ring-red-900/30"
                value={formData.transaction.valueDate}
                onChange={(e) => handleChange("transaction", "valueDate", e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass}>Tx Time</label>
              <input
                type="text"
                className={inputClass}
                value={formData.transaction.transactionTime}
                onChange={(e) => handleChange("transaction", "transactionTime", e.target.value)}
                placeholder="HH:MM:SS"
              />
            </div>
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
              <option value="GBP">GBP - British Pound</option>
              <option value="IDR">IDR - Indonesian Rupiah</option>
              <option value="SGD">SGD - Singapore Dollar</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>
              Amount <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              className={inputClass}
              value={formData.transaction.amount}
              onChange={(e) => handleChange("transaction", "amount", e.target.value)}
              placeholder="e.g., 3500000"
              required
            />
          </div>
          <div>
            <label className={labelClass}>Instructed Amount</label>
            <input
              type="number"
              className={inputClass}
              value={formData.transaction.instructedAmount}
              onChange={(e) => handleChange("transaction", "instructedAmount", e.target.value)}
              placeholder="e.g., 3500000"
            />
          </div>
          <div>
            <label className={labelClass}>Details of Charges (F71A)</label>
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
          <div className="md:col-span-2">
            <label className={labelClass}>Remittance Information (F70)</label>
            <input
              type="text"
              className={inputClass}
              value={formData.transaction.remittanceInfo}
              onChange={(e) => handleChange("transaction", "remittanceInfo", e.target.value)}
              placeholder="e.g., INVESTMENT"
            />
          </div>
        </div>
      </div>

      {/* TECHNICAL SETTINGS */}
      <div className="border border-slate-800 rounded-2xl p-5 bg-slate-950/20 mb-6">
        <button
          type="button"
          onClick={() => setShowTechnical(!showTechnical)}
          className="flex justify-between items-center w-full text-slate-300 hover:text-white font-bold text-base tracking-wide transition-colors outline-none"
        >
          <span>⚙️ TECHNICAL SWIFT SETTINGS</span>
          <span>{showTechnical ? "▲ Hide" : "▼ Show"}</span>
        </button>
        {showTechnical && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-800/80">
            <div>
              <label className={labelClass}>Source Route (SRC RTE)</label>
              <input
                type="text"
                className={inputClass}
                value={formData.technical.srcRte}
                onChange={(e) => handleChange("technical", "srcRte", e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass}>Destination Route (DEST RTE)</label>
              <input
                type="text"
                className={inputClass}
                value={formData.technical.destRte}
                onChange={(e) => handleChange("technical", "destRte", e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass}>Session Header</label>
              <input
                type="text"
                className={inputClass}
                value={formData.technical.sessionHeader}
                onChange={(e) => handleChange("technical", "sessionHeader", e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass}>Message Input Ref</label>
              <input
                type="text"
                className={inputClass}
                value={formData.technical.msgInputRef}
                onChange={(e) => handleChange("technical", "msgInputRef", e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass}>Message Output Ref</label>
              <input
                type="text"
                className={inputClass}
                value={formData.technical.msgOutputRef}
                onChange={(e) => handleChange("technical", "msgOutputRef", e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass}>Checksum (CHK)</label>
              <input
                type="text"
                className={inputClass}
                value={formData.technical.chk}
                onChange={(e) => handleChange("technical", "chk", e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass}>PKI Signature</label>
              <input
                type="text"
                className={inputClass}
                value={formData.technical.pkiSignature}
                onChange={(e) => handleChange("technical", "pkiSignature", e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass}>Track Code (Auto if empty)</label>
              <input
                type="text"
                className={inputClass}
                value={formData.technical.trackCode}
                onChange={(e) => handleChange("technical", "trackCode", e.target.value)}
                placeholder="e.g. HBUK248914"
              />
            </div>
            <div>
              <label className={labelClass}>Cipher (Auto if empty)</label>
              <input
                type="text"
                className={inputClass}
                value={formData.technical.cipher}
                onChange={(e) => handleChange("technical", "cipher", e.target.value)}
                placeholder="e.g. PTZH_DETH-HBUK..."
              />
            </div>
            <div>
              <label className={labelClass}>Transmission Code (Auto if empty)</label>
              <input
                type="text"
                className={inputClass}
                value={formData.technical.transmissionCode}
                onChange={(e) => handleChange("technical", "transmissionCode", e.target.value)}
                placeholder="e.g. PRT_TPZH..."
              />
            </div>
          </div>
        )}
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

export default HSBCForm;
