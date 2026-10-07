"use client";

import React, { useState } from "react";
import DeutschePrintoutV3 from "./DeutschePrintoutV3";

const DeutscheFormV3 = ({ onSubmit, initialData = {} as any }: any) => {
  const [formData, setFormData] = useState({
    institution: {
      swiftCode: initialData.institution?.swiftCode || "DEUTDEFFXXX",
      accountCode: initialData.institution?.accountCode || "DE435007001",
      accountNumber: initialData.institution?.accountNumber || "00927361600",
      accountName: initialData.institution?.accountName || "KELLCOR INVESTMENT GMBH",
      bankName: initialData.institution?.bankName || "DEUTSCHE BANK AG",
      address: initialData.institution?.address || "DEUTSCHE BANK A.G. TAUNUSANLAGE 12, FRANKFURT AM MAIN 60325 FRANKFURT GERMANY",
      signatory: initialData.institution?.signatory || "MR. OBUCHOWICZ RYSZARD ANDRZEJ",
    },
    transaction: {
      messageReference: initialData.transaction?.messageReference || "20230413DEUTDEFF992520230413",
      senderReference: initialData.transaction?.senderReference || "DEUTDEFF25300611495414461835",
      transactionCode: initialData.transaction?.transactionCode || "DEUT690754321567098723456",
      bankOperationCode: initialData.transaction?.bankOperationCode || "CASH",
      instructionType: initialData.transaction?.instructionType || "MT 103 - Internal Receipt Instruction",
      instructionSubType: initialData.transaction?.instructionSubType || "CASH WIRE TRANSFER",
      valueDate: initialData.transaction?.valueDate || "2025-06-30",
      agreementDate: initialData.transaction?.agreementDate || "MAY 19, 2025",
      topHeaderDate: initialData.transaction?.topHeaderDate || "",
      settlementDate: initialData.transaction?.settlementDate || "",
      postTime: initialData.transaction?.postTime || "11:49:54",
      currency: initialData.transaction?.currency || "EUR",
      currencyFraction: initialData.transaction?.currencyFraction || "1/4",
      amount: initialData.transaction?.amount || "1500000001456.00",
      instructedAmount: initialData.transaction?.instructedAmount || "1500000001456.00",
      remittanceInfo: initialData.transaction?.remittanceInfo || "INVOICE SETTLEMENT",
      charges: initialData.transaction?.charges || "OUR",
      senderCharges: initialData.transaction?.senderCharges || "940.00",
      swiftFee: initialData.transaction?.swiftFee || "926.62",
      previousBalance: initialData.transaction?.previousBalance || "8963003851000.00",
      currentBalance: initialData.transaction?.currentBalance || "7463003849544.00",
      messageNumber: initialData.transaction?.messageNumber || "658906",
      sessionNumber: initialData.transaction?.sessionNumber || "3216",
      country: initialData.transaction?.country || "GERMANY",
      participant: initialData.transaction?.participant || "NOT.MOD",
      securitiesDescription: initialData.transaction?.securitiesDescription || "CASH WIRE TRANSFER",
    },
    beneficiary: {
      swiftCode: initialData.beneficiary?.swiftCode || "BRINIDJA",
      accountNumber: initialData.beneficiary?.accountNumber || "0811-01-021431-50-8",
      accountName: initialData.beneficiary?.accountName || "IMAN KUKUH PRIBADI",
      bankName: initialData.beneficiary?.bankName || "PT BANK RAKYAT INDONESIA (PERSERO) TBK.",
      address: initialData.beneficiary?.address || "BANK BRI UNIT SEMPLAK JL. RAYA SEMPLAK NO.36, RT.02/RW.01 SEMPLAK, KEC. BOGOR BAR. KOTA BOGOR, JAWA BARAT INDONESIA 16114",
    },
    meta: {
      user: initialData.meta?.user || "INTMBLUSER",
      documentHistory: initialData.meta?.documentHistory || "20253006114954",
      refCode: initialData.meta?.refCode || "DEUTDEFFXXX5271U461835",
      receivedTime: initialData.meta?.receivedTime || "12:01:14",
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
      bankId: "deutsche_v3",
      selectedBank: "Deutsche Bank V2",
      transactionDate: new Date().toLocaleString(),
      generatedAt: new Date().toISOString(),
    });
  };

  const inputClass = "w-full px-4 py-2.5 bg-slate-950/80 border border-slate-850 focus:border-cyan-500 rounded-xl focus:ring-2 focus:ring-cyan-550/10 focus:shadow-[0_0_15px_rgba(6,182,212,0.05)] transition-all duration-300 text-base text-slate-100 placeholder-slate-650 outline-none";
  const textareaClass = "w-full px-4 py-2.5 bg-slate-950/80 border border-slate-850 focus:border-cyan-500 rounded-xl focus:ring-2 focus:ring-cyan-550/10 transition-all duration-300 text-base text-slate-100 placeholder-slate-650 outline-none min-h-[80px]";
  const selectClass = "w-full px-4 py-2.5 bg-slate-950/80 border border-slate-850 focus:border-cyan-500 rounded-xl focus:ring-2 focus:ring-cyan-550/10 focus:shadow-[0_0_15px_rgba(6,182,212,0.05)] transition-all duration-300 text-base text-slate-100 outline-none";
  const labelClass = "text-sm font-bold text-slate-400 block mb-1.5 uppercase tracking-widest";
  const sectionClass = "border border-slate-850 rounded-2xl p-5 bg-slate-950/20 mb-6 relative overflow-hidden";

  return (
    <form onSubmit={handleSubmit} className="bg-slate-900/30 border border-slate-850 rounded-3xl p-6 md:p-8 shadow-2xl backdrop-blur-md relative overflow-hidden">
      <div className="absolute top-0 left-6 right-6 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />

      <div className="flex items-center gap-4 mb-6 pb-5 border-b border-slate-855">
          <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center justify-center text-emerald-400 font-bold text-sm tracking-wider shadow-[0_0_15px_rgba(16,185,129,0.2)]">
            DB V3
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-widest uppercase">DEUTSCHE NODE V3 (EXTENDED)</h2>
          <p className="text-sm text-slate-500 font-mono tracking-wider uppercase">MT103 Transaction Parameters Configurator (5 Pages)</p>
        </div>
      </div>

      <div className={sectionClass}>
        <h3 className="text-base font-bold text-slate-200 flex items-center gap-2 mb-4">
          <span>🏛️</span> SENDER (INSTITUTION) DETAILS
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Swift Code *</label>
            <input type="text" className={inputClass} value={formData.institution.swiftCode} onChange={(e) => handleChange("institution", "swiftCode", e.target.value)} required />
          </div>
          <div>
            <label className={labelClass}>Account Code (First Line)</label>
            <input type="text" className={inputClass} value={formData.institution.accountCode} onChange={(e) => handleChange("institution", "accountCode", e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Account Number (Second Line)</label>
            <input type="text" className={inputClass} value={formData.institution.accountNumber} onChange={(e) => handleChange("institution", "accountNumber", e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Account Name</label>
            <input type="text" className={inputClass} value={formData.institution.accountName} onChange={(e) => handleChange("institution", "accountName", e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Bank Name</label>
            <input type="text" className={inputClass} value={formData.institution.bankName} onChange={(e) => handleChange("institution", "bankName", e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Signatory Name</label>
            <input type="text" className={inputClass} value={formData.institution.signatory} onChange={(e) => handleChange("institution", "signatory", e.target.value)} />
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>Address</label>
            <input type="text" className={inputClass} value={formData.institution.address} onChange={(e) => handleChange("institution", "address", e.target.value)} />
          </div>
        </div>
      </div>

      <div className={sectionClass}>
        <h3 className="text-base font-bold text-slate-200 flex items-center gap-2 mb-4">
          <span>👤</span> BENEFICIARY CUSTOMER DETAILS
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Account Number *</label>
            <input type="text" className={inputClass} value={formData.beneficiary.accountNumber} onChange={(e) => handleChange("beneficiary", "accountNumber", e.target.value)} required />
          </div>
          <div>
            <label className={labelClass}>Account Name *</label>
            <input type="text" className={inputClass} value={formData.beneficiary.accountName} onChange={(e) => handleChange("beneficiary", "accountName", e.target.value)} required />
          </div>
          <div>
            <label className={labelClass}>Bank Swift Code</label>
            <input type="text" className={inputClass} value={formData.beneficiary.swiftCode} onChange={(e) => handleChange("beneficiary", "swiftCode", e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Bank Name</label>
            <input type="text" className={inputClass} value={formData.beneficiary.bankName} onChange={(e) => handleChange("beneficiary", "bankName", e.target.value)} />
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>Address</label>
            <textarea className={textareaClass} value={formData.beneficiary.address} onChange={(e) => handleChange("beneficiary", "address", e.target.value)} />
          </div>
        </div>
      </div>

      <div className={sectionClass}>
        <h3 className="text-base font-bold text-slate-200 flex items-center gap-2 mb-4">
          <span>📝</span> TRANSACTION & BALANCES
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Message Reference</label>
            <input type="text" className={inputClass} value={formData.transaction.messageReference} onChange={(e) => handleChange("transaction", "messageReference", e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Sender Reference</label>
            <input type="text" className={inputClass} value={formData.transaction.senderReference} onChange={(e) => handleChange("transaction", "senderReference", e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Transaction Code</label>
            <input type="text" className={inputClass} value={formData.transaction.transactionCode} onChange={(e) => handleChange("transaction", "transactionCode", e.target.value)} />
          </div>
                    <div>
            <label className={labelClass}>Top Header Date Override (V2)</label>
            <input type="text" className={inputClass} placeholder="e.g. MONDAY, JUNE 30, 2025" value={formData.transaction.topHeaderDate || ""} onChange={(e) => handleChange("transaction", "topHeaderDate", e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Instruction Type</label>
            <input type="text" className={inputClass} value={formData.transaction.instructionType} onChange={(e) => handleChange("transaction", "instructionType", e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Instruction Sub Type</label>
            <input type="text" className={inputClass} value={formData.transaction.instructionSubType} onChange={(e) => handleChange("transaction", "instructionSubType", e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Settlement Date Override (V2)</label>
            <input type="text" className={inputClass} placeholder="e.g. 30.06.2025" value={formData.transaction.settlementDate || ""} onChange={(e) => handleChange("transaction", "settlementDate", e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Agreement Date (71A)</label>
            <input type="text" className={inputClass} placeholder="e.g. MAY 19, 2025" value={formData.transaction.agreementDate} onChange={(e) => handleChange("transaction", "agreementDate", e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Value Date</label>
            <input type="date" className={inputClass} value={formData.transaction.valueDate} onChange={(e) => handleChange("transaction", "valueDate", e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Post Time</label>
            <input type="time" step="1" className={inputClass} value={formData.transaction.postTime} onChange={(e) => handleChange("transaction", "postTime", e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Currency</label>
            <div className="flex gap-2">
              <select className={selectClass} value={formData.transaction.currency} onChange={(e) => handleChange("transaction", "currency", e.target.value)}>
                <option value="EUR">EUR - Euro</option>
                <option value="USD">USD - US Dollar</option>
                <option value="GBP">GBP - British Pound</option>
              </select>
              <input type="text" className={`${inputClass} w-24`} placeholder="e.g. 1/4" value={formData.transaction.currencyFraction} onChange={(e) => handleChange("transaction", "currencyFraction", e.target.value)} />
            </div>
          </div>
          <div>
            <label className={labelClass}>Amount *</label>
            <input type="text" className={inputClass} value={formData.transaction.amount} onChange={(e) => handleChange("transaction", "amount", e.target.value)} required />
          </div>
          <div>
            <label className={labelClass}>Previous Balance</label>
            <input type="text" className={inputClass} value={formData.transaction.previousBalance} onChange={(e) => handleChange("transaction", "previousBalance", e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Current Balance</label>
            <input type="text" className={inputClass} value={formData.transaction.currentBalance} onChange={(e) => handleChange("transaction", "currentBalance", e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Sender Charges (71F)</label>
            <input type="text" className={inputClass} value={formData.transaction.senderCharges} onChange={(e) => handleChange("transaction", "senderCharges", e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>SWIFT Additional Fee</label>
            <input type="text" className={inputClass} value={formData.transaction.swiftFee} onChange={(e) => handleChange("transaction", "swiftFee", e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Recipient Country</label>
            <input type="text" className={inputClass} value={formData.transaction.country} onChange={(e) => handleChange("transaction", "country", e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Participant</label>
            <input type="text" className={inputClass} value={formData.transaction.participant} onChange={(e) => handleChange("transaction", "participant", e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Securities Description</label>
            <input type="text" className={inputClass} value={formData.transaction.securitiesDescription} onChange={(e) => handleChange("transaction", "securitiesDescription", e.target.value)} />
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>Remittance Info (70)</label>
            <textarea className={textareaClass} value={formData.transaction.remittanceInfo} onChange={(e) => handleChange("transaction", "remittanceInfo", e.target.value)} />
          </div>
        </div>
      </div>
      
      <div className={sectionClass}>
        <h3 className="text-base font-bold text-slate-200 flex items-center gap-2 mb-4">
          <span>⚙️</span> META INFORMATION
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>User ID</label>
            <input type="text" className={inputClass} value={formData.meta.user} onChange={(e) => handleChange("meta", "user", e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Document History</label>
            <input type="text" className={inputClass} value={formData.meta.documentHistory} onChange={(e) => handleChange("meta", "documentHistory", e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Message Number</label>
            <input type="text" className={inputClass} value={formData.transaction.messageNumber} onChange={(e) => handleChange("transaction", "messageNumber", e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Session Number</label>
            <input type="text" className={inputClass} value={formData.transaction.sessionNumber} onChange={(e) => handleChange("transaction", "sessionNumber", e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Receipt Ref Code</label>
            <input type="text" className={inputClass} value={formData.meta.refCode} onChange={(e) => handleChange("meta", "refCode", e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Received Time</label>
            <input type="text" className={inputClass} value={formData.meta.receivedTime} onChange={(e) => handleChange("meta", "receivedTime", e.target.value)} />
          </div>
        </div>
      </div>

      <button
        type="submit"
        className="w-full py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-550 hover:to-blue-550 text-white rounded-2xl font-bold text-sm tracking-widest shadow-xl shadow-cyan-500/10 hover:shadow-cyan-500/25 transition-all duration-300 transform active:scale-[0.98] uppercase"
      >
        ⚡ BROADCAST TRANSACTION NODE & GENERATE MT103 (V2)
      </button>
    </form>
  );
};

export default DeutscheFormV3;
