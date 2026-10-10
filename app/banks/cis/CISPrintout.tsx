import React, { useEffect } from "react";
import Image from "next/image";

const BorderWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="w-full h-full relative border-[8px] border-double border-black p-[4px]">
    <div className="w-full h-full border-[3px] border-black p-8 relative flex flex-col">
      {children}
    </div>
  </div>
);

const CISPrintout = ({ data, onBack, isPublic = false }: { data: any, onBack?: () => void, isPublic?: boolean }) => {
  useEffect(() => {
    if (!isPublic) {
      document.body.classList.add("print-mode");
      return () => document.body.classList.remove("print-mode");
    }
  }, [isPublic]);

  const company = data.companyInfo || {};
  const bank = data.bankInfo || {};
  const meta = data.meta || {};

  return (
    <div className={isPublic ? "w-full flex flex-col items-center" : "bg-slate-900 border border-slate-800 rounded-3xl p-6 print:bg-white print:border-none print:p-0 shadow-2xl text-slate-100"}>
      
      {/* Back and Print buttons */}
      {!isPublic && (
        <div className="flex flex-wrap justify-between gap-3 mb-6 no-print">
          {onBack ? (
            <button
              onClick={onBack}
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl font-bold transition-all duration-200 text-sm border border-slate-700"
            >
              ← Back to Form
            </button>
          ) : <div />}
          <button
            onClick={() => window.print()}
            className="px-6 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white rounded-xl font-bold transition-all duration-200 text-sm shadow-lg shadow-cyan-500/20"
          >
            🖨️ Print / Download PDF
          </button>
        </div>
      )}
      {isPublic && (
        <div className="flex justify-center mb-6 no-print w-full">
          <button
            onClick={() => window.print()}
            className="px-8 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white rounded-xl font-bold transition-all duration-200 shadow-xl shadow-cyan-500/20 flex items-center gap-2"
          >
            <span className="text-xl">🖨️</span> Print / Download PDF
          </button>
        </div>
      )}

      {/* Pages Container */}
      <div 
        className={`flex flex-col items-center gap-8 ${isPublic ? 'my-0 print:my-0' : 'my-4'} print:my-0 print:gap-0 ${isPublic ? 'bg-transparent py-0' : 'bg-slate-950/60 py-8 px-4 rounded-2xl'} print:bg-white print:p-0`}
      >
        
        {/* PAGE 1: APPENDIX A */}
        <div className={`w-[210mm] min-h-[297mm] mx-auto bg-white p-[10mm] text-black ${isPublic ? 'shadow-2xl' : 'shadow-2xl'} print:shadow-none print:p-[10mm] relative font-sans text-sm break-after-page`} style={{ fontFamily: '"Arial", sans-serif' }}>
          <BorderWrapper>
            
            {/* Header / Logo */}
            <div className="w-full flex justify-start mb-6 mt-4">
              <div className="relative w-full max-w-[450px] h-[80px]">
                <Image 
                  src="/images/pat.png" 
                  alt="PAT Logo" 
                  layout="fill"
                  objectFit="contain"
                  objectPosition="left"
                />
              </div>
            </div>

            {/* Title */}
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold tracking-widest font-sans" style={{ transform: "scaleY(1.2)" }}>CLIENT INFORMATION SHEET</h1>
            </div>

            {/* Subtitle */}
            <div className="text-center mb-6 font-bold uppercase text-lg tracking-wide">
              <div>APPENDIX A.</div>
              <div>COMPANY INFORMATION</div>
            </div>

            {/* Table */}
            <table className="w-full border-collapse border-2 border-black text-[12.5px] font-bold tracking-wide">
              <tbody>
                <tr className="border-b-2 border-black">
                  <td className="w-1/3 border-r-2 border-black py-2.5 px-3 uppercase">COMPANY NAME:</td>
                  <td className="w-2/3 py-2.5 px-3 uppercase">{company.companyName}</td>
                </tr>
                <tr className="border-b-2 border-black">
                  <td className="border-r-2 border-black py-2.5 px-3 uppercase">COMPANY REG. ADDRESS:</td>
                  <td className="py-2.5 px-3 uppercase">{company.companyRegAddress}</td>
                </tr>
                <tr className="border-b-2 border-black">
                  <td className="border-r-2 border-black py-2.5 px-3 uppercase">COMPANY REG. NO:</td>
                  <td className="py-2.5 px-3 uppercase">{company.companyRegNo}</td>
                </tr>
                <tr className="border-b-2 border-black">
                  <td className="border-r-2 border-black py-2.5 px-3 uppercase">REPRESENTED BY:</td>
                  <td className="py-2.5 px-3 uppercase">{company.representedBy}</td>
                </tr>
                <tr className="border-b-2 border-black">
                  <td className="border-r-2 border-black py-2.5 px-3 uppercase">TITLE:</td>
                  <td className="py-2.5 px-3 uppercase">{company.title}</td>
                </tr>
                <tr className="border-b-2 border-black">
                  <td className="border-r-2 border-black py-2.5 px-3 uppercase">PASSPORT №:</td>
                  <td className="py-2.5 px-3 uppercase">{company.passportNo}</td>
                </tr>
                <tr className="border-b-2 border-black">
                  <td className="border-r-2 border-black py-2.5 px-3 uppercase">DATE OF ISSUE:</td>
                  <td className="py-2.5 px-3 uppercase">{company.dateOfIssue}</td>
                </tr>
                <tr className="border-b-2 border-black">
                  <td className="border-r-2 border-black py-2.5 px-3 uppercase">DATE OF EXPIRY:</td>
                  <td className="py-2.5 px-3 uppercase">{company.dateOfExpiry}</td>
                </tr>
                <tr className="border-b-2 border-black">
                  <td className="border-r-2 border-black py-2.5 px-3 uppercase">PLACE OF ISSUE:</td>
                  <td className="py-2.5 px-3 uppercase">{company.placeOfIssue}</td>
                </tr>
                <tr className="border-b-2 border-black">
                  <td className="border-r-2 border-black py-2.5 px-3 uppercase">BANK NAME:</td>
                  <td className="py-2.5 px-3 uppercase">{bank.bankName}</td>
                </tr>
                <tr className="border-b-2 border-black">
                  <td className="border-r-2 border-black py-2.5 px-3 uppercase">BANK ADDRESS:</td>
                  <td className="py-2.5 px-3 uppercase">{bank.bankAddress}</td>
                </tr>
                <tr className="border-b-2 border-black">
                  <td className="border-r-2 border-black py-2.5 px-3 uppercase">SWIFT CODE:</td>
                  <td className="py-2.5 px-3 uppercase">{bank.swiftCode}</td>
                </tr>
                <tr className="border-b-2 border-black">
                  <td className="border-r-2 border-black py-2.5 px-3 uppercase">ACCOUNT NUMBER :</td>
                  <td className="py-2.5 px-3 uppercase">{bank.accountNumber}</td>
                </tr>
                <tr className="border-b-2 border-black">
                  <td className="border-r-2 border-black py-2.5 px-3 uppercase">IBAN :</td>
                  <td className="py-2.5 px-3 uppercase">{bank.iban}</td>
                </tr>
                <tr className="border-b-2 border-black">
                  <td className="border-r-2 border-black py-2.5 px-3 uppercase">ACCOUNT NAME:</td>
                  <td className="py-2.5 px-3 uppercase">{bank.accountName}</td>
                </tr>
                <tr className="border-b-2 border-black">
                  <td className="border-r-2 border-black py-2.5 px-3 uppercase">BANK OFFICER:</td>
                  <td className="py-2.5 px-3 uppercase">{bank.bankOfficer}</td>
                </tr>
                <tr>
                  <td className="border-r-2 border-black py-2.5 px-3 uppercase">BANK E-MAIL:</td>
                  <td className="py-2.5 px-3 text-blue-700 underline font-normal uppercase">{bank.bankEmail}</td>
                </tr>
              </tbody>
            </table>

            {/* Oath and Signature Section */}
            <div className="mt-8 text-[12.5px] font-bold tracking-wide uppercase">
              <p className="mb-6 leading-relaxed">
                I, {company.representedBy}, HEREBY SWEAR UNDER PENALTY OF PERJURY, THAT THE INFORMATION PROVIDED HEREIN IS ACCURATE AND TRUE AS OF THIS DATE: <span className="text-blue-700">{meta.oathDate}</span>
              </p>
              
              <p className="mb-4">
                FOR AND ON BEHALF OF {company.companyName}:
              </p>

              <div className="relative w-full max-w-[350px] h-[120px] mb-6">
                <Image 
                  src="/pat-signature.jpeg" 
                  alt="Signature and Stamp" 
                  layout="fill"
                  objectFit="contain"
                  className="opacity-95 mix-blend-multiply origin-left"
                />
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex items-end">
                  <span className="mr-2">SIGNATURE:</span>
                  <div className="border-b-2 border-black w-64 max-w-[300px]"></div>
                </div>
                <div>
                  NAME: {company.representedBy}
                </div>
              </div>
            </div>

          </BorderWrapper>
        </div>

        {/* PAGE 2: APPENDIX B */}
        <div className={`w-[210mm] min-h-[297mm] mx-auto bg-white p-[10mm] text-black ${isPublic ? 'shadow-2xl' : 'shadow-2xl'} print:shadow-none print:p-[10mm] relative font-sans text-sm break-after-page`} style={{ fontFamily: '"Arial", sans-serif' }}>
          <BorderWrapper>
            <div className="text-center mb-8 mt-12 font-bold uppercase text-lg tracking-wide">
              <div>APPENDIX B.</div>
              <div>PASSPORT COPY</div>
            </div>
            
            <div className="w-full flex-grow flex justify-center items-start mt-8">
              <div className="relative w-full max-w-[650px] h-[600px]">
                <Image 
                  src="/images/canvas.png" 
                  alt="Passport Copy" 
                  layout="fill"
                  objectFit="contain"
                />
              </div>
            </div>
          </BorderWrapper>
        </div>

      </div>
    </div>
  );
};

export default CISPrintout;
