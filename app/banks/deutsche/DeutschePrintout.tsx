"use client";

// Code-128 structured barcode element (optimized width & height for authentic SWIFT receipts)
const Barcode = ({ value }) => {
  if (!value) return null;

  // Generate pattern based on character values
  let pattern = "101100101011"; // start code
  for (let i = 0; i < value.length; i++) {
    const charCode = value.charCodeAt(i);
    const charPattern = ((charCode * 12345) % 4096).toString(2).padStart(12, "0");
    pattern += charPattern.replace(/1/g, "11").replace(/0/g, "0");
  }
  pattern += "11010011011"; // stop code

  const elements = [];
  let x = 0;
  let idx = 0;

  while (idx < pattern.length) {
    let width = 0;
    const currentVal = pattern[idx];
    while (idx < pattern.length && pattern[idx] === currentVal) {
      width += 1.1; // crisp horizontal scaling to fill right margin
      idx++;
    }
    if (currentVal === "1") {
      elements.push(<rect key={x} x={x} y={0} width={width} height={44} fill="black" />);
    }
    x += width;
  }

  return (
    <div className="flex flex-col items-start">
      <svg width={Math.ceil(x)} height="44" className="block">
        {elements}
      </svg>
      <span
        style={{
          fontFamily: "Courier, 'Courier New', monospace",
          fontSize: "12px",
          fontWeight: "bold",
          color: "black",
          marginTop: "3px",
        }}
      >
        {value}
      </span>
    </div>
  );
};

const DeutschePrintout = ({ data, onBack }) => {
  const formatNumber = (num) => {
    if (!num) return "0.00";
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(parseFloat(num));
  };

  const getFormattedDates = (valueDateStr) => {
    let dateObj = new Date();
    if (valueDateStr) {
      const parts = valueDateStr.split("-");
      if (parts.length === 3) {
        dateObj = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
      }
    }
    
    const day = String(dateObj.getDate()).padStart(2, "0");
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const year = dateObj.getFullYear();
    
    return {
      dateStr: `${day}/${month}/${year}`,
      timeStr: `19:17:41`
    };
  };

  // Data mapping
  const institution = data.institution || {};
  const transaction = data.transaction || {};
  const beneficiary = data.beneficiary || {};

  const dates = getFormattedDates(transaction.valueDate);
  const amtFormatted = formatNumber(transaction.amount);
  const currencyUpper = (transaction.currency || "EUR").toUpperCase();
  const charges = (transaction.charges || "OUR").toUpperCase();

  const senderRef = (transaction.senderReference || "DE72461936640139").toUpperCase();
  const senderSwift = (institution.swiftCode || "DEUTDEFFXXX").toUpperCase();
  const receiverSwift = (beneficiary.swiftCode || "BRINIDJA").toUpperCase();

  const preStyle = {
    fontFamily: "Courier, 'Courier New', monospace",
    fontWeight: "bold", // PDF shows very bold and dark Courier text
    fontSize: "9.5px",
    lineHeight: "10.5px",
    color: "#000000",
    letterSpacing: "0px",
    width: "100%",
  };

  const page1Text = `MESSAGE REFERENCE: 1856734949-1247881431                       CUSTOMER'S COPY
----------------------------INSTANCE TYPE AND TRANSMISSION----------------------------
*** NOTIFICATION (TRANSMISSION) OF ORIGINAL SENT TO SWIFT (ACK)
*** NETWORK DELIVERY STATUS   : RECEIVED
*** PRIORITY/DELIVERY         : URGENT SAME DAY
*** MESSAGE INPUT REFERENCE   : 1917 250624${senderSwift}2893429278
*** MESSAGE OUTPUT REFERENCE  : 1917 250624${receiverSwift}XXXX8546387563

--------------------------------SWIFT MESSAGE HEADER--------------------------------
***SWIFT INPUT      : SWIFT MT103TT CASH TRANSFER
FROM:
***SENDER           : ${senderSwift}
***BANK NAME        : ${(institution.bankName || "DEUTSCHE BANK AG").toUpperCase()}
***BANK ADDRESS     : ${(institution.address || "TAUNUSANLAGE 12, 60254 FRANKFURT AM MAIN, GERMANY").toUpperCase()}
***ACCOUNT NAME     : ${(institution.accountName || "AVANTULO S.A.").toUpperCase()}
***ACCOUNT NUMBER   : ${(institution.accountNumber || "DE60500700100361982244").toUpperCase()}
***SWIFT CODE       : ${senderSwift}
TO:
***BANK NAME        : ${(beneficiary.bankName || "PTBANKRAKYATINDONESIA (PERSERO) TBK").toUpperCase()}
***BANK ADDRESS     : ${(beneficiary.address || "BANKBRIUNITSEMPLAKJL.RAYA SEMPLAKNO.36,RT.02/RW.01").toUpperCase()}
***ACCOUNT NAME     : ${(beneficiary.accountName || "IMAN KUKUH PRIBADI").toUpperCase()}
***ACCOUNT NUMBER   : ${(beneficiary.accountNumber || "0811-01-021431-50-8").toUpperCase()}
***SWIFT CODE       : ${receiverSwift}
-----------------------------------MESSAGE TEXT-----------------------------------
*** F20:      TRANSACTION REFERENCE CODE     : ${senderRef}
*** F23B:     BANK OPERATION CODE            : CRED
*** F32A:     CURRENCY/INSTRUCTED
              DATE                           : ${dates.dateStr}
              CURRENCY                       : ${currencyUpper}
              AMOUNT                         : €${amtFormatted}
*** F33B:     CURRENCY/ORIGINAL ORDERED AMOUNT
              CURRENCY                       : ${currencyUpper}
              AMOUNT                         : €${amtFormatted}
*** F50K:     ORDERING CUSTOMER-NAME & ADDRESS
              ACCOUNT NUMBER                 : ${(institution.accountNumber || "DE60500700100361982244").toUpperCase()}
              ACCOUNT NAME                   : ${(institution.accountName || "AVANTULO S.A.").toUpperCase()}
              ACCOUNT ADDRESS                : ${(institution.address || "AVANTULO TOWER SI, II, II & SOHO CENTRE CALLE 50").toUpperCase()}
*** F52A:     ORDERING INSTITUTION
              SENDER                         : ${senderSwift}
              BANK NAME                      : ${(institution.bankName || "DEUTSCHE BANK AG").toUpperCase()}
              BANK ADDRESS                   : ${(institution.address || "TAUNUSANLAGE 12, 60254 FRANKFURT AM MAIN, GERMANY").toUpperCase()}
*** F57A:     ACCOUNT WITH INSTITUTION
              RECEIVER SWIFT                 : ${receiverSwift}
              BANK RECEIVER                  : ${(beneficiary.bankName || "PTBANKRAKYATINDONESIA (PERSERO) TBK").toUpperCase()}
              BANK ADDRESS                   : ${(beneficiary.address || "BANKBRIUNITSEMPLAKJL.RAYA SEMPLAKNO.36,RT.02/RW.01").toUpperCase()}
*** F59       BENEFICIARY CUSTOMER
              ACCOUNT NAME                   : ${(beneficiary.accountName || "IMAN KUKUH PRIBADI").toUpperCase()}
              ACCOUNT NUMBER                 : ${(beneficiary.accountNumber || "0811-01-021431-50-8").toUpperCase()}
*** F70:      REMITTANCE INFORMATION         : ${(transaction.remittanceInfo || "INVESTMENT AGREEMENT NUMBER:DCL-PRC-01").toUpperCase()}
*** F71A:     DETAILS OF CHARGES             : ${charges}
*** F72:      SENDER TO RECEIVER INFORMATION : FOR INVESTMENT
            /// PLEASE ADVISE THE BENEFICIARY OF THIS SWIFT THIS TRANSFER IS VALID FOR PAYMENT
            /// UPON IDENTIFICATION, THE DAY OF RECEIPT. THIS IRREVOCABLE CASH BACKED SWIFT
            /// SWIFT MT103TT CASH TRANSFER CAN BE RELIED UPON FOR FULL CASH.
*** F77B:     REGULATORY REPORTING: €${amtFormatted}
*** F79:      NARRATIVE
/// FOR AND ON BEHALF OF OUR CLIENT ${(institution.accountName || "AVANTULO S.A.").toUpperCase()}, WITH ACCOUNT NUMBER:
${(institution.accountNumber || "DE60500700100361982244").toUpperCase()}, WE ${(institution.bankName || "DEUTSCHE BANK AG").toUpperCase()}, TAUNUSANLAGE 12, 60254 FRANKFURT AM MAIN, GERMANY
HEREBY CONFIRM WITH FULL BANKING RESPONSIBILITY THAT THE ABOVE FUNDS ARE GOOD, CLEAN, CLEAR AND
TAXED FUNDS OF NON-CRIMINAL ORIGIN, FREE FROM ANY LIENS OR ENCUMBRANCES AND PAID FOR INVESTMENTS
PURPOSES SWIFT MT103TT CASH TRANSFER WITH UETR CODE IS FOR IMMEDIATE CASH-INSTANT SAME DAY
VALUE AND NO MAIL OR SWIFT CONFIRMATION SHALL FOLLOW.

FOR AND ON BEHALF OF ${(institution.bankName || "DEUTSCHE BANK AG").toUpperCase()}, TAUNUSANLAGE 12, 60254 FRANKFURT AM MAIN, GERMANY.
AUTOMATED MESSAGE DOESN'T NEED ANY SIGNATURE

AUTHORIZED OFFICER 1: MR. JAMES VON MOLTKE, CHIEF FINANCIAL OFFICER (PIN: J78414M )
AUTHORIZED OFFICER 2: MR. CARSTEN LEWERENZ, HEAD OF BUSINESS CUSTOMERS (PIN: 53329)
FOR AND ON BEHALF OF DEUTSCHE BANK AG
TAUNUSANLAGE 12, 60254 FRANKFURT AM MAIN, GERMANY.`;

  const page2Text = `--------------------------------MESSAGE TRAILER--------------------------------
HK:8983417752320
PKI-SIGNATURE:3728030272
TRACKING CODE:52E8F5B282
--------------------------------INTERVENTIONS----------------------------------
CONFIRMED AND RECEIVED
TRANSACTION STATUS: APPROVED
SWIFT MESSAGE: SWIFT MT103TT CASH TRANSFER
SWIFT COVERAGE: YES
CATEGORY: NETWORK REPORT
CREATION DATE & TIME: ${dates.dateStr} ${dates.timeStr}
APPLICATION: SWIFT
OPERATION: SYSTEM
RECEIVER: ${receiverSwift}
TEXT:{1:F01${senderSwift}2893429278}{2:I103${receiverSwift}X}{3:119:STP}{4:${senderRef}}
5:{MAC:00000000}{PDE:}{S:{SAC:}}{COP:P}

ANSWERBACK AND ACKNOWLEDGMENT MESSAGE AUTOMATED FILE TRANSFER (AFT) GATEWAY RESPONSE VALIDATION
    SERVICE PROVIDER LOG/APPLICATION GENERATED REPORT ACKNOWLEDGMENT AND AUTHENTICATION
                   ACK/NAG DELIVERY FTA/FTI CONFIRMATION STATEMENT PASS/ACK STATUS

0050 CNT, ---------------------------------------------------------------------- VALID
0060 RFF-DTM, ------------------------------------------------------------------ VALID
0070 RFF, ---------------------------------------------------------------------- VALID
0080 DTM, ---------------------------------------------------------------------- VALID
0090 NAD-CTA-COM, -------------------------------------------------------------- VALID
0100 NAD, ---------------------------------------------------------------------- VALID
0120 COM, ---------------------------------------------------------------------- VALID
0130 ERC-FTX-5G4, -------------------------------------------------------------- VALID
0140 ERC, ---------------------------------------------------------------------- VALID
0150 FTX, ---------------------------------------------------------------------- VALID
0160 RFF-FTX, ------------------------------------------------------------------ VALID
0170 REF, ---------------------------------------------------------------------- VALID
0180 FTX, ---------------------------------------------------------------------- VALID
0190 UNT, ---------------------------------------------------------------------- VALID

{XMT DELIVERY REPORT}
MESSAGE TYPE: SWIFT MT103TT CASH TRANSFER
PRIORITY: URGENT
RECEIVED: ${receiverSwift}
TRANSACTION REFERENCE NUMBER: ${senderRef}
TRANSACTION STATUS: APPROVED
AMOUNT TRANSFERRED: €${amtFormatted}
DATE OF EXECUTION: ${dates.dateStr} ${dates.timeStr}
INPUT-OUTPUT: ACK NAK DUP AUTH
--------------------------------CONFIRMED AND RECEIVED---------------------------------
TRANSACTION STATUS: APPROVED
AMOUNT TRANSFERRED: €${amtFormatted}
DATE OF EXECUTION: ${dates.dateStr} ${dates.timeStr}
--------------------------------END OF TRANSMISSION------------------------------------`;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 print:bg-white print:p-0 shadow-2xl">
      {/* Back and Print buttons */}
      <div className="flex flex-wrap justify-between gap-3 mb-6 no-print">
        <button
          onClick={onBack}
          className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl font-bold transition-all duration-200 text-sm border border-slate-700"
        >
          ← Back to Form
        </button>
        <button
          onClick={() => window.print()}
          className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-bold transition-all duration-200 text-sm shadow-lg shadow-blue-500/20"
        >
          🖨️ Print / Download PDF
        </button>
      </div>

      {/* Pages Container */}
      <div className="flex flex-col items-center gap-8 my-4 print:my-0 print:gap-0 bg-slate-950/60 py-8 px-4 rounded-2xl print:bg-white print:p-0">
        
        {/* PAGE 1 */}
        <div className="swift-page print-page relative flex flex-col bg-white" id="deutsche-printout-page1">
          <div className="w-[620px] mx-auto flex flex-col h-full">
            
            {/* Header: Barcode (Left), Logo (Right) */}
            <div className="flex justify-between items-start mb-2 w-full pt-4">
              <div className="flex flex-col">
                <img 
                  src="/logos/deutsche-barcode.png" 
                  alt="Barcode" 
                  className="h-[48px] object-contain mix-blend-multiply"
                />
                <div className="font-mono text-[11px] font-bold mt-1 whitespace-pre leading-snug">
                  {`FROM:      ${senderSwift}      ${dates.dateStr}\nTO:        ${receiverSwift}      ${dates.timeStr}`}
                </div>
              </div>
              
              <div className="flex items-center mt-2 pr-4">
                <img 
                  src="/logos/deutsche-logo.png" 
                  alt="Deutsche Bank Logo" 
                  className="h-[75px] object-contain"
                />
              </div>
            </div>
            
            {/* Page 1 SWIFT Text */}
            <pre className="whitespace-pre select-text" style={preStyle}>
              {page1Text}
            </pre>

            {/* Footer with Signatures & Stamp */}
            <div className="mt-2 flex flex-col w-full relative">
              <img 
                src="/logos/deutsche-signatures.png" 
                alt="Authorized Signatures and Stamps" 
                className="w-[95%] h-auto object-contain mx-auto mix-blend-multiply -mt-16"
              />
            </div>

          </div>
        </div>

        {/* PAGE 2 */}
        <div className="swift-page print-page relative flex flex-col bg-white" id="deutsche-printout-page2">
          <div className="w-[620px] mx-auto flex flex-col h-full">
            
            {/* Header: Barcode (Left), Logo (Right) */}
            <div className="flex justify-between items-start mb-6 w-full pt-4">
              <div className="flex flex-col">
                <img 
                  src="/logos/deutsche-barcode.png" 
                  alt="Barcode" 
                  className="h-[48px] object-contain mix-blend-multiply"
                />
              </div>
              
              <div className="flex items-center mt-2 pr-4">
                <img 
                  src="/logos/deutsche-logo.png" 
                  alt="Deutsche Bank Logo" 
                  className="h-[75px] object-contain"
                />
              </div>
            </div>
            
            {/* Page 2 Interventions Text */}
            <pre className="whitespace-pre select-text" style={preStyle}>
              {page2Text}
            </pre>
            
            {/* Footer with Signatures & Stamp */}
            <div className="mt-6 flex flex-col w-full relative">
              <img 
                src="/logos/deutsche-signatures.png" 
                alt="Authorized Signatures and Stamps" 
                className="w-[95%] h-auto object-contain mx-auto mix-blend-multiply"
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DeutschePrintout;
