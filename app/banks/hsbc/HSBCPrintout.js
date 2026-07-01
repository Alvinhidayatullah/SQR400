"use client";

import Image from "next/image";

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
    <div className="flex flex-col items-end">
      <svg width={Math.ceil(x)} height="44" className="block">
        {elements}
      </svg>
      <span
        style={{
          fontFamily: "Courier, 'Courier New', monospace",
          fontSize: "10px",
          fontWeight: "bold",
          letterSpacing: "0.2px",
          color: "black",
          marginTop: "3px",
        }}
      >
        {value}
      </span>
    </div>
  );
};

const HSBCPrintout = ({ data, onBack }) => {
  const formatNumber = (num) => {
    if (!num) return "0.00";
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(parseFloat(num));
  };

  const getFormattedDates = (valueDateStr, transactionTimeStr) => {
    let dateObj = new Date();
    if (valueDateStr) {
      const parts = valueDateStr.split("-");
      if (parts.length === 3) {
        dateObj = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
      }
    }
    
    const dayNames = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
    const monthNames = [
      "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
      "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"
    ];
    
    const dayName = dayNames[dateObj.getDay()];
    const day = String(dateObj.getDate()).padStart(2, "0");
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const year = dateObj.getFullYear();
    
    const timeStr = transactionTimeStr || "15:30:30";
    
    return {
      dateTimeStr: `${day}/${month}/${year}-${timeStr}`,
      dateLongStr: `${dayName} ${parseInt(day)} ${monthNames[dateObj.getMonth()]}, ${year}`,
      yearMonthStr: `${year}-${month}`,
      monthShort: monthNames[dateObj.getMonth()].substring(0, 3).toUpperCase(),
      dayNum: day,
      yearNum: year,
      monthNum: month
    };
  };

  const getCurrencyName = (ccy) => {
    const ccyUpper = ccy.toUpperCase();
    if (ccyUpper === "EUR" || ccyUpper === "EURO") return "EURO";
    if (ccyUpper === "USD" || ccyUpper === "US DOLLAR") return "US DOLLAR";
    if (ccyUpper === "GBP" || ccyUpper === "BRITISH POUND") return "BRITISH POUND";
    if (ccyUpper === "IDR" || ccyUpper === "RUPIAH") return "INDONESIAN RUPIAH";
    return ccyUpper;
  };

  const getCurrencySymbol = (ccy) => {
    const ccyUpper = ccy.toUpperCase();
    if (ccyUpper === "EUR" || ccyUpper === "EURO") return "€";
    if (ccyUpper === "USD" || ccyUpper === "US DOLLAR") return "$";
    if (ccyUpper === "GBP" || ccyUpper === "BRITISH POUND") return "£";
    if (ccyUpper === "IDR" || ccyUpper === "RUPIAH") return "Rp";
    return ccy;
  };

  // Data mapping
  const institution = data.institution || {};
  const transaction = data.transaction || {};
  const receiverBank = data.receiverBank || {};
  const beneficiary = data.beneficiary || {};
  const technical = data.technical || {};

  const formattedDates = getFormattedDates(transaction.valueDate, transaction.transactionTime);
  const amtFormatted = formatNumber(transaction.amount);
  const currencyUpper = (transaction.currency || "EUR").toUpperCase();
  const ccySymbol = getCurrencySymbol(currencyUpper);
  const currencyName = getCurrencyName(currencyUpper);

  const senderCode8 = (institution.swiftCode || "HBUKGB4B").substring(0, 8).toUpperCase();
  const receiverCode8 = (receiverBank.swiftCode || "BNINIDJA").substring(0, 8).toUpperCase();
  const charges = (transaction.charges || "OUR").toUpperCase();
  const chargesFormatted = charges === "OUR" ? "OURS" : charges === "BEN" ? "BENEFICIARY" : charges === "SHA" ? "SHARED" : charges;

  const senderCode4 = senderCode8.substring(0, 4);
  const suffix6 = (transaction.senderReference || "HSBC587069248914").slice(-6);
  
  const trackCode = (technical.trackCode || `${senderCode4}${suffix6}`).toUpperCase();
  const cipher = (technical.cipher || `PTZH_DETH-${senderCode4}-${formattedDates.monthShort}${formattedDates.dayNum}-${charges}103`).toUpperCase();
  const transmissionCode = (technical.transmissionCode || `PRT_TPZH${formattedDates.yearNum}${formattedDates.monthNum}${formattedDates.dayNum}`).toUpperCase();

  // Monospace alignments (94 character constraints from PDF analysis)
  const lineLength = 94;
  
  const centerDashes = (text) => {
    const dashCount = lineLength - text.length;
    const leftDashes = Math.floor(dashCount / 2);
    const rightDashes = dashCount - leftDashes;
    return "-".repeat(leftDashes) + text + "-".repeat(rightDashes);
  };

  // Header line 1: Date (left-aligned) and SWIFT ACKS (right-aligned)
  const leftCol = formattedDates.dateTimeStr;
  const rightCol = `SWIFT ACKS-8547-${formattedDates.yearMonthStr}`;
  const headerLine1 = leftCol.padEnd(lineLength - rightCol.length, " ") + rightCol;

  // Header line 2: Bank name centered
  const centerCol = `++++++++ ${institution.bankName || "HSBC UK BANK PLC"} ++++++++`.toUpperCase();
  const centerStart = Math.floor(lineLength / 2) - Math.floor(centerCol.length / 2);
  const headerLine2 = " ".repeat(centerStart) + centerCol;

  // Header line 3: Date long (left-aligned) and Message type (right-aligned)
  const dateLongStrUpper = formattedDates.dateLongStr.toUpperCase();
  const msgTypeStr = "++++++103++";
  const headerLine3 = dateLongStrUpper.padEnd(lineLength - msgTypeStr.length, " ") + msgTypeStr;

  const senderLines = [
    (institution.bankName || "HSBC UK BANK PLC").toUpperCase(),
    (institution.address || "AYLESBURY, MARKET SQUARE, 8 MARKET SQUARE, AYLESBURY, HP 20 1TW, UK").toUpperCase(),
    senderCode8
  ];
  const receiverLines = [
    (receiverBank.bankName || "BANK NEGARA INDONESIA - PT (PERSERO)").toUpperCase(),
    (receiverBank.address || "BNI BUILDING, FLOOR 7, JALAN JENDERAL SUDIRMAN 1, JAKARTA, INDONESIA").toUpperCase(),
    receiverCode8
  ];

  const senderFormatted = "SENDER    : " + senderLines.join("\n            ");
  const receiverFormatted = "RECEIVER  : " + receiverLines.join("\n            ");

  // Beneficiary formatted strictly under column 16 rules
  const beneficiaryLines = [
    `/${(beneficiary.accountNumber || "8460946829").toUpperCase()}`,
    `/${(beneficiary.swiftCode     || "BNINIDJAXXX").toUpperCase()}`,
    (beneficiary.accountName    || "PT ALDO PUTRA MANDIRI BANDUNG").toUpperCase(),
    (beneficiary.address        || "BNI BUILDING, JALAN ASIA AFRIKA, BANDUNG, INDONESIA").toUpperCase()
  ];
  const beneficiaryFormatted = "F59:            " + beneficiaryLines.join("\n                ");

  // Create Page 1 RAW SWIFT Text
  const page1Text = `${headerLine1}
${headerLine2}
${headerLine3}
SINGLE CUSTOMER CASH TRANSFER
${"-".repeat(lineLength)}
NOTIFICATION (TRANSMISSION) OF ORIGINAL SENT TO SWIFT WIRE SYSTEM
NETWORK DELIVERY STATUS   : NETWORK ACK

PRIORITY/DELIVERY         : NORMAL/DELIVERY NOTIFICATION
SRC RTE                   : ${(technical.srcRte || "HBUKGB4BXXX").toUpperCase()}
DEST RTE                  : ${(technical.destRte || "BNINIDJAXXX").toUpperCase()}
SESSION HEADER            : ${(technical.sessionHeader || "HBUKGB4BXXX").toUpperCase()}
MESSAGE INPUT REFERENCE   : ${(technical.msgInputRef || "HBUKGB4BXXX75412835942185").toUpperCase()}
MESSAGE OUTPUT REFERENCE  : ${(technical.msgOutputRef || "BNINIDJAXXX76102436987104").toUpperCase()}
${centerDashes("MESSAGE HEADER")}
${senderFormatted}
${receiverFormatted}
${centerDashes("MESSAGE TEXT")}
F20: SENDER'S REFERENCE
     ${(transaction.senderReference || "HSBC587069248914").toUpperCase()}
F21: TRANSACTION CODE
     ${(transaction.transactionCode || "HBUKGB4B248914").toUpperCase()}
F23B: BANK OPERATION CODE
      ${(transaction.bankOperationCode || "CRED").toUpperCase()}
F32A: VALUE DATE/ CUR / INTERBANK SETTLED AMOUNT
      SAME DAY / ${currencyName.toUpperCase()}
      ${ccySymbol}${amtFormatted}
F33B: CURRENCY / INSTRUCTED AMOUNT
      ${ccySymbol}${amtFormatted}
F50A:           /${(institution.accountNumber || "GB32HBUK40086810148040").toUpperCase()}
                ${(institution.accountName || "XA FINANCIAL LTD").toUpperCase()}
                ${(institution.address || "AYLESBURY, MARKET SQUARE, 8 MARKET SQUARE, AYLESBURY, HP 20 1TW, UK").toUpperCase()}
F52A:           /${senderCode8}
                ${(institution.bankName || "HSBC UK BANK PLC").toUpperCase()}
                ${(institution.address || "AYLESBURY, MARKET SQUARE, 8 MARKET SQUARE, AYLESBURY, HP 20 1TW, UK").toUpperCase()}
F57A:           /${(receiverBank.swiftCode || "BNINIDJAXXX").toUpperCase()}
                ${(receiverBank.bankName || "BANK NEGARA INDONESIA - PT (PERSERO)").toUpperCase()}
                ${(receiverBank.address || "BNI BUILDING, FLOOR 7, JALAN JENDERAL SUDIRMAN 1, JAKARTA, INDONESIA").toUpperCase()}
${beneficiaryFormatted}
F70:            /REMITTANCE INFORMATION
                ${(transaction.remittanceInfo || "INVESTMENT").toUpperCase()}
F71A:           DETAILS OF CHARGES
                ${chargesFormatted.toUpperCase()}
F72:            /SENDER TO RECEIVER INFORMATION
                PLEASE ADVICE THE BENEFICIARY OF THIS SWIFT.
                THIS TRANSFER IS VALID UPON IDENTIFICATION, THE DAY OF RECEIPT.
                THIS IRREVOCABLE CASH SWIFT/103 TRANSFER CAN BE RELIED UPON FOR FULL
                CASH.FUNDS ARE CLEAN AND CLEAR, OF NON-CRIMINAL ORIGIN.
F77B:           /REGULATORY REPORTING
                #${amtFormatted}#
${centerDashes("MESSAGE TRAILER")}
{CHK: ${(technical.chk || "HBUKGB4B2119809863").toUpperCase()}}
PKI SIGNATURE: ${(technical.pkiSignature || "MAC-EQUIVALENT").toUpperCase()}`;

  // Create Page 2 RAW SWIFT Text (strictly matches layout sequence from PDF screenshot)
  const page2Text = `-------------------------INTERVENTIONS--------------------------------------------------------
CONFIRMED AND RECEIVED
----------------------------------------------------------------------------------------------
ANSWER BACK AND ACKNOWLEDGMENT MESSAGE AUTOMATED FILE TRANSFER (AFT)
GATEWAY RESPONSE VALIDATION SERVICE PROVIDER LOG/APPLICATION GENERATED REPORT ACKNOWLEDGMENT
& AUTHENTICATION ACK NAG DELIVERY

FTA/FTI CONFIRMATION STATEMENT PASS/FAIL STATUS

0050 CNT, -------------------------------- Valid
0060 RFF-DTM, ---------------------------- Valid
0070 RFF, -------------------------------- Valid
0080 DTM, -------------------------------- Valid
0090 NAD-CTA-COM-------------------------- Valid
0100 NAD, -------------------------------- Valid
0110 CTA, -------------------------------- Valid
0120 COM, -------------------------------- Valid
0130 ERC-FTX-5G4, ------------------------ Valid
0140 ERC, -------------------------------- Valid
0150 FTX, -------------------------------- Valid
0160 RFF-FTX, ---------------------------- Valid
0170 REF, -------------------------------- Valid
0180 FTX, -------------------------------- Valid
0190 UNT, -------------------------------- Valid

--------------{XMT DELIVERY REPORT} ----------------------------------------------------------
TRACK CODE: ${trackCode}
CATEGORY: NETWORK REPORT
CREATION DATE/TIME: ${formattedDates.dateTimeStr}
APPLICATION: SWIFT / 103
OPERATION: SYSTEM
TEXT {1:F01 ${formattedDates.yearNum}${senderCode8} ${institution.accountNumber || "GB32HBUK40086810148040"}} {2:P103${receiverBank.swiftCode || "BNINIDJAXXX"} ${beneficiary.accountNumber || "8980888829"}}
{2:{254:124}{141:}
-----------------------------------------------------------------------------------------------
(+) END OF MESSAGE
${"*".repeat(lineLength)}
MESSAGE HAS BEEN TRANSMITTED SUCCESSFULLY (02) ${"*".repeat(lineLength - 47)}
CIPHER: ${cipher}
END OF TRANSMISSION
${transmissionCode}`;

  const preStyle = {
    fontFamily: "Courier, 'Courier New', monospace",
    fontWeight: "normal",
    fontSize: "11px", // exact Courier size to align 94 characters with the 620px boundary
    lineHeight: "14.2px",
    color: "#000000",
    letterSpacing: "0px",
    width: "100%",
  };

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
        <div className="swift-page print-page relative flex flex-col bg-white" id="hsbc-printout-page1">
          {/* Content Wrapper constrained strictly to 620px to prevent A4 screen/print overflow */}
          <div className="w-[620px] mx-auto flex flex-col h-full justify-between">
            <div>
              {/* Logo & Barcode Row */}
              <div className="flex justify-between items-end mb-8 w-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/logos/hsbc.jpg"
                  alt="HSBC Logo"
                  style={{ height: "42px", width: "auto", objectFit: "contain" }}
                />
                <Barcode value={transaction.senderReference || "HSBC587069248914"} />
              </div>
              
              {/* Page 1 SWIFT Text */}
              <pre className="whitespace-pre select-text" style={preStyle}>
                {page1Text}
              </pre>
            </div>
            
            {/* Footer */}
            <div className="text-[10px] font-mono text-gray-300 select-none pointer-events-none uppercase text-right mt-12">
              HSBC UK WIRE SYSTEM • PAGE 1 OF 2
            </div>
          </div>
        </div>

        {/* PAGE 2 */}
        <div className="swift-page print-page relative flex flex-col bg-white" id="hsbc-printout-page2">
          {/* Content Wrapper constrained strictly to 620px to prevent A4 screen/print overflow */}
          <div className="w-[620px] mx-auto flex flex-col h-full justify-between">
            <div>
              {/* Logo only Row */}
              <div className="flex justify-between items-end mb-8 w-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/logos/hsbc.jpg"
                  alt="HSBC Logo"
                  style={{ height: "42px", width: "auto", objectFit: "contain" }}
                />
              </div>
              
              {/* Page 2 Interventions Text */}
              <pre className="whitespace-pre select-text" style={preStyle}>
                {page2Text}
              </pre>
            </div>
            
            {/* Footer */}
            <div className="text-[10px] font-mono text-gray-300 select-none pointer-events-none uppercase text-right mt-12">
              HSBC UK WIRE SYSTEM • PAGE 2 OF 2
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default HSBCPrintout;
