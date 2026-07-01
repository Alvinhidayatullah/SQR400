/**
 * Utility for formatting transaction data into a standard SWIFT MT103 message block.
 */

export const generateMT103Text = (data) => {
  if (!data) return "";

  const institution = data.institution || {};
  const transaction = data.transaction || {};
  const beneficiary = data.beneficiary || {};
  const sender = data.sender || {};
  
  // Format Date (YYMMDD)
  let valDateRaw = new Date();
  if (transaction.valueDate) {
    const parts = transaction.valueDate.split("-");
    if (parts.length === 3) {
      valDateRaw = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
    }
  }
  const yy = String(valDateRaw.getFullYear()).slice(-2);
  const mm = String(valDateRaw.getMonth() + 1).padStart(2, "0");
  const dd = String(valDateRaw.getDate()).padStart(2, "0");
  const formattedDate = `${yy}${mm}${dd}`;

  // Format Amount (decimal comma, no separators, e.g., 500000.00 -> 500000,00)
  const amtNum = parseFloat(transaction.amount) || 0;
  const amtFormatted = amtNum.toFixed(2).replace(".", ",");

  const senderSwift = (institution.swiftCode || "BCAIIDJA").padEnd(12, "X").substring(0, 12);
  const receiverSwift = (beneficiary.swiftCode || "BNINIDJA").padEnd(12, "X").substring(0, 12);

  return `{1:F01${senderSwift}0000000000}
{2:I103${receiverSwift}N}
{4:
:20:${transaction.senderReference || "REF-" + Date.now().toString().slice(-6)}
:23B:CRED
:32A:${formattedDate}${transaction.currency || "USD"}${amtFormatted}
:33B:${transaction.currency || "USD"}${amtFormatted}
:50K:/${institution.accountNumber || "SND-ACC-123"}
${(institution.accountName || "SENDER NAME").toUpperCase()}
${(institution.address || "SENDER ADDRESS").toUpperCase()}
:52A:${senderSwift.substring(0, 8)}
:57A:${receiverSwift.substring(0, 8)}
:59:/${beneficiary.accountNumber || "BEN-ACC-999"}
${(beneficiary.accountName || "BENEFICIARY NAME").toUpperCase()}
${(beneficiary.address || "BENEFICIARY ADDRESS").toUpperCase()}
:70:${(transaction.remittanceInfo || "TRADE SETTLEMENT").toUpperCase()}
:71A:${(transaction.charges || "OUR").toUpperCase()}
-}`;
};
