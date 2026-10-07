"use client";

import React, { useEffect, useState } from "react";
import Head from "next/head";
import QRCode from "react-qr-code";

const formatNumber = (numStr: any) => {
   if (!numStr) return "";
   const num = parseFloat(numStr.replace(/,/g, ""));
   if (isNaN(num)) return numStr;
   return num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const formatAmountStr = (amount: any, currency: any) => {
   return `${formatNumber(amount)}`;
};

const getPageBreakStyle = () => ({
   pageBreakAfter: "always",
   breakAfter: "page",
});

const DeutschePrintoutV3 = ({ data, onBack, isPublic = false }: { data: any, onBack?: () => void, isPublic?: boolean }) => {
   const [baseUrl, setBaseUrl] = useState("");

   useEffect(() => {
      if (typeof window !== "undefined") {
         setBaseUrl(window.location.origin);
      }
   }, []);

   const { institution, transaction, beneficiary, meta } = data;
   let postDateFormatted = transaction.valueDate ? new Date(transaction.valueDate).toLocaleDateString("en-GB").replace(/\//g, ".") : "30.06.2025";
   if (transaction.settlementDate) {
      postDateFormatted = transaction.settlementDate;
   }
   const postTime = transaction.postTime || "11:49:54";

   
   let topHeaderDate = transaction.valueDate 
      ? new Date(transaction.valueDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase() 
      : "MONDAY, JUNE 30, 2025";
   if (transaction.topHeaderDate) {
      topHeaderDate = transaction.topHeaderDate.toUpperCase();
   }
   
   const acksDateStr = transaction.valueDate
      ? (() => {
           const d = new Date(transaction.valueDate);
           const day = String(d.getDate()).padStart(2, '0');
           const month = String(d.getMonth() + 1).padStart(2, '0');
           const year = d.getFullYear();
           return `${day}${month}-${year}`;
        })()
      : "3006-2025";

   const swiftDateStr = transaction.valueDate
      ? (() => {
           const d = new Date(transaction.valueDate);
           const day = String(d.getDate()).padStart(2, '0');
           const month = String(d.getMonth() + 1).padStart(2, '0');
           const year = String(d.getFullYear()).slice(2);
           return `${year}${month}${day}`;
        })()
      : "250630";

   const tableDateStr = transaction.valueDate
      ? (() => {
           const d = new Date(transaction.valueDate);
           const day = String(d.getDate()).padStart(2, '0');
           const month = String(d.getMonth() + 1).padStart(2, '0');
           const year = d.getFullYear();
           return `${day}/${month}/${year}`;
        })()
      : "21/05/2025";

   const generateMT103Text = (isPage2 = false) => {
      return `${topHeaderDate} ${postTime}
INTERNATIONAL SWIFT I/103.202 ACKS-${acksDateStr}-1 CUSTOMER'S COPY ${institution.address}
-------------------------------INSTANT TYPE, AND TRANSMISSION---------------------------------------
/ User: ${meta?.user}
/ Document History: ${meta?.documentHistory}
/ Post Date: ${postDateFormatted} ${postTime}
/ Message Type/Type: MT103 CASH WIRE TRANSFER VIA COMMON ACCOUNT
/ Message Reference: ${transaction.messageReference || "DEUTDEFF25210509445214461835"}
/ SENDER: ${institution.swiftCode}
/ BANK NAME: ${institution.bankName}
/ BANK ADDRESS: ${institution.address}
/ BANK ACCOUNT NAME: ${institution.accountName}
/ BANK ACCOUNT NO: ${institution.accountNumber}
/ RECEIVER: ${beneficiary.swiftCode}
/ BANK NAME: ${beneficiary.bankName}
/ BANK ADDRESS: ${beneficiary.address}
/ ACCOUNT NAME: ${beneficiary.accountName}
/ ACCOUNT/SORT NUMBER: ${beneficiary.bankCode ? beneficiary.bankCode + beneficiary.accountNumber : beneficiary.accountNumber}
/ Session Number: ${transaction.sessionNumber || "3476"}
/ Message Number: ${transaction.messageNumber || "987654"}
:20: Sender's Reference
/ ${transaction.senderReference}
:21: Transaction Code
/ ${transaction.transactionCode}
:23B: Bank Operation Code
/ ${transaction.bankOperationCode || "CASH"}
:32A: Value Date/ Currency/Interbank Settled Amount
/ ${swiftDateStr}
/ ${transaction.currency}
/ ${formatNumber(transaction.amount)}
:33B: Currency/Instructed Amount
/ ${transaction.currency}
/ ${formatNumber(transaction.amount)}
:50F: Ordering Customer-Name & Address
0/ ${institution.accountNumber}
1/ ${institution.accountName}
2/ ${institution.address?.split(',')[0] || ''}
3/ ${institution.country || 'GERMANY'}
4/ ${institution.swiftCode}
:57A: Account with Institution
/ ${beneficiary.swiftCode}
/ ${beneficiary.bankName}
/ ${beneficiary.address}
:59: Beneficiary Customer
/ ${beneficiary.bankCode ? beneficiary.bankCode + beneficiary.accountNumber : beneficiary.accountNumber}
/ ${beneficiary.accountName}
:70: Remittance Information
${transaction.remittanceInfo ? transaction.remittanceInfo.split('\n').map((line: string) => `/ ${line}`).join('\n') : "/ KELL-IN/UEF/MT103/202/1,9B/05-2025"}
:71A: Details of Transaction
/ AGREEMENT NUMBER: ${transaction.remittanceInfo ? transaction.remittanceInfo.split('\n')[0].replace('AGREEMENT NUMBER:', '').trim() : "KELL-IN/UEF/MT103/202/1,9B/05-2025"}
/ AGREEMENT DATE: ${transaction.agreementDate || "MAY 19, 2025"}
:71F: Sender's Charges
/ ${transaction.currency}
/ ${formatNumber(transaction.senderCharges || 798.00)}
-------------------------------------------------------------------------------------`;
   };

   const generateMT202Text = () => {
      return `-------------------------------------------------------------------------------------
ANSWER BACK PAGE CONFIRMATION SYSTEM
/ User: ${meta?.user}
/ Document History: ${meta?.documentHistory}
/ Post Date: ${postDateFormatted} ${postTime}
/ Message Type/Type: MT-202
/ Message Reference: ${transaction.messageReference || "DEUTDEFF25210509445214461835"}
/ SENDER: ${institution.swiftCode}
/ BANK NAME: ${institution.bankName}
/ BANK ADDRESS: ${institution.address}
/ BANK ACCOUNT NAME: ${institution.accountName}
/ BANK ACCOUNT NO: ${institution.accountNumber}
/ RECEIVER: ${beneficiary.swiftCode}
/ BANK NAME: ${beneficiary.bankName}
/ BANK ADDRESS: ${beneficiary.address}
/ ACCOUNT NAME: ${beneficiary.accountName}
/ ACCOUNT/SORT NUMBER: ${beneficiary.bankCode ? beneficiary.bankCode + beneficiary.accountNumber : beneficiary.accountNumber}
/ Session Number: ${transaction.sessionNumber || "3476"}
/ Message Number: ${transaction.messageNumber || "987654"}
-------------------------------------------------------------------------------------
:20: Sender Reference Number
/ ${transaction.senderReference}
:21: Related Ref
/ ${transaction.senderReference}
:32A: Value Date, Currency Code, Amount
/ ${swiftDateStr}
/ ${transaction.currency}
/ ${formatNumber(transaction.amount)}
:58A: Beneficiary Institution-Bic
/ ${beneficiary.swiftCode}
/ ${beneficiary.bankName}
/ ${beneficiary.address}
:50F: Ordering Customer-Name & Address
0/ ${institution.accountNumber}
1/ ${institution.accountName}
2/ MORGARTENSTRASSE 3, 6003 LUZERN, SWITZERLAND
3/ ${institution.swiftCode}
:59: Beneficiary Customer- Name & Address
0/ ${beneficiary.bankCode ? beneficiary.bankCode + beneficiary.accountNumber : beneficiary.accountNumber}
1/ ${beneficiary.accountName}
2/ 300 DELAWARE AVE, SUITE 210, WILMINGTON, DE19801, USA
3/ ${beneficiary.swiftCode}
-------------------------------------------------------------------------------------`;
   };

   const generateNetworkDeliveryText = () => {
      const validLines = [
         "02829298 CNT,",
         "071392 RFF-DTM,",
         "08D28270 RFF,",
         "092875 DTM,",
         "0D92020 USB-CTA-COM,",
         "87293 USB,",
         "OD8282 CTA,",
         "OD828291 COM,",
         "071392 ERC-FTX-5G4,",
         "87293 ERC,",
         "0892894 FTX,",
         "09203395 RFF-FTX,",
         "0829396 REF,",
         "0829397 FTX,",
         "02829298 UNT,"
      ];
      
      const indentedValidBlock = validLines.map(line => {
         const dotsNeeded = 61 - line.length - 5;
         return "                    " + line + ".".repeat(Math.max(0, dotsNeeded)) + "VALID";
      }).join('\n');

      return `${indentedValidBlock}

SERVER GLOBAL ID (ORIGIN) : DE0584
SERVER GLOBAL IP  : 100.311.60.2/25/131.340/134 IDENTITY
CODE : 43C DB JS DE 16DEXX
APPLICATION WIRE TRANSFER INTERNATIONAL

NETWORK DELIVERY STATUS       : NETWORK ACK
PRIORITY                      : DELIVERY
URGENT                        : DELIVERED
REMARK                        : OK
AMOUNT                        : €${formatNumber(transaction.amount)}
ORIGIN                        : ${institution.bankName}//${institution.address}
DESTINATION                   : ${beneficiary.bankName}//${beneficiary.address}
SIZE                          : OK
DELIVERED END MESSAGE         : MT103 CASH WIRE TRANSFER VIA COMMON ACCOUNT
MAC                           : AZ0006UZ415IT16
CHK                           : CHK12479643218W019
DATE                          : ${postDateFormatted}
TIME                          : ${postTime}`;
   };

   return (
      <div translate="no" className={`notranslate min-h-screen pb-10 print:pb-0 ${isPublic ? 'bg-slate-900' : 'bg-gray-200'}`}>
         <style dangerouslySetInnerHTML={{
            __html: `
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-area, #printable-area * {
            visibility: visible;
          }
          #printable-area {
            width: 100%;
            background: white !important;
            padding: 0 !important;
            margin: 0 !important;
          }
            .print-page-wrapper {
               margin: 0 auto !important;
            }
          .page-break {
            page-break-after: always;
            break-after: page;
          }
          @page {
            size: A4 portrait;
            margin: 0;
          }
          @page landscape_page {
            size: A4 landscape;
            margin: 0;
          }
          body {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            background-color: white !important;
          }
          .print-page-wrapper {
            width: 750px !important;
            min-width: 750px !important;
            height: 1050px !important;
            overflow: hidden !important;
            position: relative !important;
            box-shadow: none !important;
            margin: 0 auto !important;
            page-break-after: always;
            break-after: page;
          }
          .print-page-wrapper:last-child {
            page-break-after: auto !important;
            break-after: auto !important;
          }
          .no-print {
            display: none !important;
          }
          .print-bg {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .print-landscape-wrapper {
             width: 750px !important;
             min-width: 750px !important;
             height: 1050px !important;
             margin: 0 auto !important;
             padding: 0 !important;
             overflow: hidden !important;
             position: relative !important;
             break-after: page;
             page-break-after: always !important;
          }
          .print-landscape-inner {
             width: 1050px !important;
             height: 750px !important;
             position: absolute !important;
             top: 50% !important;
             left: 50% !important;
             transform: translate(-50%, -50%) rotate(-90deg) !important;
             transform-origin: center center !important;
          }
        }
        .print-landscape-wrapper {
          width: 1050px;
          min-width: 1050px;
          height: 750px;
          overflow: hidden;
          position: relative;
          box-shadow: none;
          margin: 0 auto;
          page-break-after: always;
          break-after: page;
        }
      `}} />

         {/* Control Actions */}
         <div className="max-w-5xl mx-auto pt-6 px-4 mb-6 flex flex-wrap justify-end gap-3 no-print">
            {!isPublic && (
               <button onClick={onBack} className="px-5 py-2.5 bg-gray-300 hover:bg-gray-400 rounded-lg font-semibold transition text-base text-gray-800 mr-auto">
                  ← Back to Form
               </button>
            )}
            <button onClick={() => window.print()} className="px-5 py-2.5 bg-gradient-to-r from-blue-700 to-blue-900 hover:from-blue-800 hover:to-blue-950 text-white rounded-lg font-semibold transition text-base shadow-md">
               🖨️ Download / Save as PDF
            </button>
         </div>

         <div id="printable-area" className="w-full overflow-x-auto pb-10 printable-container">
            <div className="w-fit mx-auto print:mx-0 flex flex-col print:block gap-8 print:gap-0 items-center print:items-start min-w-[750px] print:w-full print:min-w-0">

            {/* PAGE 1 */}
            <div className="print-page-wrapper w-[750px] p-0 bg-white text-black relative shadow-2xl print:shadow-none" style={{ minHeight: '1050px' }}>
               <div className="flex justify-between items-start mb-4">
                  <div className="text-[#0018a8]">
                     <h1 className="text-3xl font-sans tracking-tight">Deutsche Bank</h1>
                     <h2 className="text-xl font-sans text-blue-500">OnlineBanking & Brokerage</h2>
                  </div>
                  <div className="text-right text-[#0018a8] flex flex-col items-end">
                     <div className="flex items-center gap-2">
                        <div className="w-10 h-10 border-[2px] border-[#0018a8] relative p-1 shrink-0">
                           <div className="w-full h-full bg-white border border-[#0018a8]">
                              <div className="w-[120%] h-[2.5px] bg-[#0018a8] origin-bottom-left -rotate-45 absolute bottom-1.5 left-1"></div>
                           </div>
                        </div>
                     </div>
                     <h2 className="text-[14px] font-sans font-bold mt-1">Deutsche Bank Aktiengesellschaft</h2>
                     <div className="mt-0.5 font-bold text-[11px] underline"><a href="https://www.deutsche-bank.de">https://www.deutsche-bank.de</a></div>
                  </div>
               </div>

               <div className="font-mono text-[11.5px] leading-[1.4] px-8 pt-6 whitespace-pre-wrap text-black">
                  {generateMT103Text(false)}
               </div>
            </div>

            {/* PAGE 1-B (MT202) */}
            <div className="print-page-wrapper w-[750px] p-0 bg-white text-black relative shadow-2xl print:shadow-none" style={{ minHeight: '1050px' }}>
               <div className="flex justify-between items-start mb-4">
                  <div className="text-[#0018a8]">
                     <h1 className="text-3xl font-sans tracking-tight">Deutsche Bank</h1>
                     <h2 className="text-xl font-sans text-blue-500">OnlineBanking & Brokerage</h2>
                  </div>
                  <div className="text-right text-[#0018a8] flex flex-col items-end">
                     <div className="flex items-center gap-2">
                        <div className="w-10 h-10 border-[2px] border-[#0018a8] relative p-1 shrink-0">
                           <div className="w-full h-full bg-white border border-[#0018a8]">
                              <div className="w-[120%] h-[2.5px] bg-[#0018a8] origin-bottom-left -rotate-45 absolute bottom-1.5 left-1"></div>
                           </div>
                        </div>
                     </div>
                     <h2 className="text-[14px] font-sans font-bold mt-1">Deutsche Bank Aktiengesellschaft</h2>
                     <div className="mt-0.5 font-bold text-[11px] underline"><a href="https://www.deutsche-bank.de">https://www.deutsche-bank.de</a></div>
                  </div>
               </div>
               <div className="font-mono text-[11.5px] leading-[1.4] px-8 pt-6 whitespace-pre-wrap text-black">
                  {generateMT202Text()}
               </div>
            </div>

            {/* PAGE 1-C (Network Delivery) */}
            <div className="print-page-wrapper w-[750px] p-0 bg-white text-black relative shadow-2xl print:shadow-none" style={{ minHeight: '1050px' }}>
               <div className="flex justify-between items-start mb-4">
                  <div className="text-[#0018a8]">
                     <h1 className="text-3xl font-sans tracking-tight">Deutsche Bank</h1>
                     <h2 className="text-xl font-sans text-blue-500">OnlineBanking & Brokerage</h2>
                  </div>
                  <div className="text-right text-[#0018a8] flex flex-col items-end">
                     <div className="flex items-center gap-2">
                        <div className="w-10 h-10 border-[2px] border-[#0018a8] relative p-1 shrink-0">
                           <div className="w-full h-full bg-white border border-[#0018a8]">
                              <div className="w-[120%] h-[2.5px] bg-[#0018a8] origin-bottom-left -rotate-45 absolute bottom-1.5 left-1"></div>
                           </div>
                        </div>
                     </div>
                     <h2 className="text-[14px] font-sans font-bold mt-1">Deutsche Bank Aktiengesellschaft</h2>
                     <div className="mt-0.5 font-bold text-[11px] underline"><a href="https://www.deutsche-bank.de">https://www.deutsche-bank.de</a></div>
                  </div>
               </div>
               <div className="font-mono text-[11.5px] leading-[1.4] px-8 pt-6 whitespace-pre-wrap text-black">
                  {generateNetworkDeliveryText()}
               </div>
               <div className="mt-4 flex justify-end">
                  <div className="pr-4 shrink-0">
                     <a href={data.slug ? `${baseUrl}/doc/${data.slug}` : baseUrl} target="_blank" rel="noopener noreferrer">
                        <QRCode
                           value={data.slug ? `${baseUrl}/doc/${data.slug}` : baseUrl}
                           size={110}
                           level="H"
                           fgColor="#000000"
                           bgColor="#FFFFFF"
                        />
                     </a>
                  </div>
               </div>
            </div>

             {/* PAGE 2 */}
            <div className="print-page-wrapper w-[750px] p-0 bg-black text-gray-200 print-bg shadow-2xl print:shadow-none relative" style={{ minHeight: '1050px', backgroundColor: 'black' }}>
               {/* Full Page Background Image */}
               <div className="absolute inset-0 z-0">
                  <img src="/deutsche-v2-bg.jpeg" alt="Deutsche Background" className="w-full h-full object-fill" />
               </div>
               
               <div className="relative z-10 pt-[160px] pl-[15px]">
                  <div className="font-mono text-[11.5px] leading-[1.4] whitespace-pre-wrap text-white font-semibold tracking-wide">
                     {generateMT103Text(true)}
                  </div>
               </div>
            </div>

            {/* PAGE 3 */}
            <div className="print-page-wrapper w-[750px] p-0 bg-black text-gray-200 print-bg shadow-2xl print:shadow-none relative" style={{ minHeight: '1050px', backgroundColor: 'black' }}>
               {/* Full Page Background Image */}
               <div className="absolute inset-0 z-0">
                  <img src="/deutsche-v2-bg.jpeg" alt="Deutsche Background" className="w-full h-full object-fill" />
               </div>
               
               <div className="relative z-10 pt-[160px] pl-[15px]">
                  <div className="font-mono text-[11.5px] leading-[1.4] whitespace-pre-wrap text-white font-semibold tracking-wide">
                     {generateMT202Text()}
                  </div>
               </div>
            </div>

            {/* PAGE 4 (Network Delivery Status) */}
            <div className="print-page-wrapper w-[750px] p-0 bg-black text-gray-200 print-bg shadow-2xl print:shadow-none relative" style={{ minHeight: '1050px', backgroundColor: 'black' }}>
               {/* Full Page Background Image */}
               <div className="absolute inset-0 z-0">
                  <img src="/deutsche-v2-bg.jpeg" alt="Deutsche Background" className="w-full h-full object-fill" />
               </div>
               
               <div className="relative z-10 pt-[160px] pl-[15px]">
                  <div className="font-mono text-[11.5px] leading-[1.4] whitespace-pre-wrap text-white font-semibold tracking-wide">
                     {generateNetworkDeliveryText()}
                  </div>
               </div>
            </div>

            {/* PAGE 5 (Landscape Override) */}
            <div className="print-landscape-wrapper bg-white shadow-2xl print:shadow-none print-bg overflow-hidden relative">
               <div className="print-landscape-inner absolute inset-0 w-full h-full">
                  <img src="/deutsche-landscape-bg.jpeg" alt="Background" className="absolute inset-0 w-full h-full object-fill z-0" />
                  <div className="absolute inset-0 z-10 font-sans text-black whitespace-nowrap tracking-tight">
                  {/* Account Box */}
                  <div style={{ top: '25.5%', left: '6%', width: '16%', height: '7%' }} className="absolute text-[10.5px] leading-tight text-center flex flex-col justify-center">
                     {institution.accountCode}<br/>{institution.accountNumber}
                  </div>
                  
                  {/* Instruction Type Box */}
                  <div style={{ top: '25.5%', left: '22%', width: '36%', height: '7%' }} className="absolute text-[10.5px] leading-tight text-center flex flex-col justify-center">
                     {transaction.instructionType || "MT 103 - Internal Receipt Instruction"}<br/>Instruction Sub Type: {transaction.instructionSubType || "CASH WIRE TRANSFER"}
                  </div>
                  
                  {/* GBS Screen Box */}
                  <div style={{ top: '25.5%', left: '59%', width: '17%', height: '7%' }} className="absolute text-[10px] leading-tight flex justify-between items-center px-2">
                     <span>Indicator: MAT3D</span>
                     <span>Date {postDateFormatted}</span>
                  </div>
                  
                  {/* References Left */}
                  <div style={{ top: '36.5%', left: '7%', width: '29%' }} className="absolute text-[10.5px] leading-[1.4]">
                     References: {institution.swiftCode}<br/>
                     Sender: {institution.bankName}<br/>
                     Account Name: {institution.accountName}
                  </div>
                  
                  {/* References Right */}
                  <div style={{ top: '36%', left: '38%', width: '40%' }} className="absolute text-[10px] leading-[1.1]">
                     References: {beneficiary.swiftCode}<br/>
                     Receiver: {beneficiary.accountName}<br/>
                     Client {beneficiary.bankName}<br/>
                     Account No.: {beneficiary.bankCode ? beneficiary.bankCode + beneficiary.accountNumber : beneficiary.accountNumber}
                  </div>
                  
                  {/* Status Left */}
                  <div style={{ top: '47.5%', left: '7%', width: '29%' }} className="absolute text-[10.5px]">
                     <div className="grid grid-cols-[80px_60px_auto] px-2 items-center">
                        <span>Received</span>
                        <span>Amount:</span>
                        <span className="font-bold text-right tracking-tight">{formatNumber(transaction.amount)}</span>
                     </div>
                  </div>
                  <div style={{ top: '52%', left: '7%', width: '29%' }} className="absolute text-[10.5px]">
                     <div className="flex justify-center gap-6">
                        <span className="underline">Internal</span>
                        <span className="underline">External</span>
                     </div>
                  </div>
                  <div style={{ top: '53.5%', left: '7%', width: '29%' }} className="absolute text-[10.5px]">
                     <div className="flex justify-between px-2 pr-4">
                        <span>Currency:</span>
                        <span>{transaction.currency} {transaction.currencyFraction || "1/4"}</span>
                        <span>Released by:</span>
                     </div>
                  </div>
                  <div style={{ top: '56%', left: '7%', width: '29%' }} className="absolute text-[10.5px]">
                     <div className="pl-2">
                        <span className="underline">PARTICIPANT:</span> {transaction.participant || "NOT.MOD"}
                     </div>
                  </div>
                  
                  {/* User Activity */}
                  <div style={{ top: '47.5%', left: '38%', width: '42%' }} className="absolute text-[10.5px] leading-[1.4] flex flex-col gap-1">
                     <div className="flex">
                        <span className="w-[130px]">Keyed by:</span>
                        <span className="w-[70px] text-center">{postDateFormatted}</span>
                        <span className="w-[30px] text-center">-</span>
                        <span className="w-[70px] text-center">09:44:52</span>
                     </div>
                     <div className="flex">
                        <span className="w-[130px]">Cancelled/Modified by:</span>
                     </div>
                     <div className="flex">
                        <span className="w-[130px]">Received by:</span>
                        <span className="w-[70px] text-center">{postDateFormatted}</span>
                        <span className="w-[30px] text-center">-</span>
                        <span className="w-[70px] text-center">{meta.receivedTime}</span>
                     </div>
                  </div>
                  
                  {/* Status Bottom */}
                  <div style={{ top: '64.5%', left: '7%', width: '29%' }} className="absolute text-[10.5px] flex justify-between px-2 pr-6">
                     <span>NEW:</span>
                     <span>MTCH/NMAT</span>
                     <span>NAMT.CMIS</span>
                  </div>
                  
                  {/* Recipient Country */}
                  <div style={{ top: '62%' , left: '45%' }} className="absolute text-[10.5px]">
                     Recipient Country: {transaction.country || 'GERMANY'}
                  </div>
                  
                  {/* Securities */}
                  <div style={{ top: '73%', left: '7%' }} className="absolute text-[10.5px] leading-relaxed">
                     Ref. Code: {meta.refCode}<br/>
                     Description: {transaction.securitiesDescription || "CASH WIRE TRANSFER"}
                  </div>
               </div>
            </div>
            </div>

            {/* PAGE 6 (Landscape Detail Override) */}
            <div className="print-landscape-wrapper bg-white shadow-2xl print:shadow-none print-bg overflow-hidden relative" style={{ pageBreakAfter: 'auto' }}>
               <div className="print-landscape-inner absolute inset-0 w-full h-full">
                  <img src="/deutsche-landscape-2-bg.jpeg" alt="Background 2" className="absolute inset-0 w-full h-full object-fill z-0" />
                  
                  <div className="absolute inset-0 z-10 font-sans text-black whitespace-nowrap tracking-tight">
                     
                     {/* Top Right Logo Text */}
                     <div className="absolute top-[13%] right-[8%] text-[10px] leading-[1.2] font-sans text-right">
                        SWIFT BIC: {institution.swiftCode}<br/>
                        <a href="https://www.db.com" className="text-blue-600 underline text-[9.5px]">www.db.com</a>
                     </div>

                     {/* Top Left Text */}
                     <div className="absolute top-[17%] left-[10%] text-[11px] leading-snug font-sans">
                        To: {institution.accountName}<br/>
                        Address: {institution.address}<br/>
                        Attn: {institution.signatory}
                     </div>

                     {/* Top Right Date Text */}
                     <div className="absolute top-[23%] right-[8%] text-[11px] leading-snug font-sans text-right">
                        <div className="flex justify-end gap-2"><span>Date:</span> <span>{tableDateStr}</span></div>
                        <div className="flex justify-end gap-2"><span>Transfer Reference No:</span> <span>{transaction.senderReference}</span></div>
                     </div>

                     {/* The Table */}
                     <div className="absolute top-[43%] left-[5%] right-[5%] border border-black text-[10.5px] font-sans tracking-tight bg-transparent z-20">
                        {/* Row 1 */}
                        <div className="flex border-b border-black bg-[#d1d5db]/80">
                           <div className="w-[50%] border-r border-black text-center py-0.5">Account Holder:</div>
                           <div className="w-[50%] text-center py-0.5">Account Signatory:</div>
                        </div>
                        {/* Row 2 */}
                        <div className="flex border-b border-black bg-white/70 backdrop-blur-sm">
                           <div className="w-[50%] border-r border-black text-center py-1 font-bold text-[13px]">{institution.accountName}</div>
                           <div className="w-[50%] text-center py-1 font-bold text-[13px]">{institution.signatory}</div>
                        </div>
                        {/* Row 3 */}
                        <div className="flex border-b border-black bg-[#d1d5db]/80">
                           <div className="w-[9%] border-r border-black text-center py-0.5">Type</div>
                           <div className="w-[20%] border-r border-black text-center py-0.5">Account Number</div>
                           <div className="w-[7%] border-r border-black text-center py-0.5">Currency</div>
                           <div className="w-[9%] border-r border-black text-center py-0.5">Date</div>
                           <div className="w-[14%] border-r border-black text-center py-0.5">Debit</div>
                           <div className="w-[12%] border-r border-black text-center py-0.5">Credit</div>
                           <div className="w-[29%] text-center py-0.5">Beneficiary</div>
                        </div>
                        {/* Row 4 */}
                        <div className="flex border-b border-black bg-white/70 backdrop-blur-sm">
                           <div className="w-[9%] border-r border-black text-center py-2 flex items-center justify-center">Corporate</div>
                           <div className="w-[20%] border-r border-black text-center py-2 flex items-center justify-center">{institution.accountCode}{institution.accountNumber}</div>
                           <div className="w-[7%] border-r border-black text-center py-2 flex items-center justify-center">{transaction.currency}</div>
                           <div className="w-[9%] border-r border-black text-center py-2 flex items-center justify-center">{tableDateStr}</div>
                           <div className="w-[14%] border-r border-black text-center py-2 flex items-center justify-center">{formatNumber(transaction.amount)}</div>
                           <div className="w-[12%] border-r border-black text-center py-2 flex items-center justify-center"></div>
                           <div className="w-[29%] py-1 px-1.5 text-[9.5px] leading-[1.2] text-left">
                              Bank Name: {beneficiary.bankName}<br/>
                              Account name: {beneficiary.accountName}<br/>
                              Account number: {beneficiary.bankCode ? beneficiary.bankCode + beneficiary.accountNumber : beneficiary.accountNumber}<br/>
                              SWIFT CODE:{beneficiary.swiftCode}
                           </div>
                        </div>
                        {/* Row 5 */}
                        <div className="flex border-b border-black bg-[#d1d5db]/80">
                           <div className="w-full text-center py-0.5">SWIFT Transmission / Additional Fee: {transaction.swiftFee}</div>
                        </div>
                        {/* Row 6 */}
                        <div className="flex border-b border-black bg-[#d1d5db]/80">
                           <div className="w-[10%] border-r border-black text-center py-0.5">Date</div>
                           <div className="w-[35%] border-r border-black text-center py-0.5">Previous Balance / Euro</div>
                           <div className="w-[14%] border-r border-black text-center py-0.5">Debit</div>
                           <div className="w-[12%] border-r border-black text-center py-0.5">Authority</div>
                           <div className="w-[29%] text-center py-0.5">Current Balance / Euro</div>
                        </div>
                        {/* Row 7 */}
                        <div className="flex border-b border-black bg-white/70 backdrop-blur-sm">
                           <div className="w-[10%] border-r border-black text-center py-1 flex items-center justify-center">{tableDateStr}</div>
                           <div className="w-[35%] border-r border-black text-center py-1 flex items-center justify-end pr-8">{formatNumber(transaction.previousBalance)}</div>
                           <div className="w-[14%] border-r border-black text-center py-1 flex items-center justify-end pr-2">{formatNumber(transaction.amount)}</div>
                           <div className="w-[12%] border-r border-black text-center py-1 flex items-center justify-center">CASHWIRE</div>
                           <div className="w-[29%] text-center py-1 flex items-center justify-end pr-10">{formatNumber(transaction.currentBalance)}</div>
                        </div>
                        {/* Row 8 */}
                        <div className="flex bg-white/70 backdrop-blur-sm">
                           <div className="w-[10%] border-r border-black text-center py-1 flex items-center justify-center">{tableDateStr}</div>
                           <div className="w-[35%] border-r border-black text-center py-1 flex items-center justify-end pr-8">{formatNumber(transaction.previousBalance)}</div>
                           <div className="w-[14%] border-r border-black text-center py-1 flex items-center justify-end pr-2">{formatNumber(transaction.senderCharges)}</div>
                           <div className="w-[12%] border-r border-black text-center py-1 flex items-center justify-center">Additional Fee</div>
                           <div className="w-[29%] text-center py-1 flex items-center justify-end pr-10">{formatNumber(transaction.currentBalance)}</div>
                        </div>
                     </div>


                  </div>
               </div>
            </div>
            
            {/* PAGE 7 (Remittance Advice) */}
            <div className="print-landscape-wrapper bg-white shadow-2xl print:shadow-none overflow-hidden relative" style={{ pageBreakAfter: 'auto' }}>
               <div className="print-landscape-inner absolute inset-0 w-full h-full bg-white font-sans text-black pt-6 px-12 pb-4">
                  {/* Outer Border */}
                  <div className="absolute inset-4 border border-gray-300 pointer-events-none"></div>

                  {/* Top Header */}
                  <div className="flex justify-between items-start mb-2">
                     <div className="flex flex-col">
                        <h1 className="text-[#0018a8] font-bold text-[36px] tracking-tight leading-none mb-1">Deutsche Bank</h1>
                        <h2 className="text-[#0099cc] font-semibold text-[22px] tracking-tight leading-none">Global Transaction Banking</h2>
                     </div>
                     <div className="mt-[-5px]">
                        <svg width="70" height="70" viewBox="0 0 100 100">
                           <rect x="4" y="4" width="92" height="92" fill="none" stroke="#0018a8" strokeWidth="8"/>
                           <path d="M 28 85 L 18 80 L 72 15 L 82 20 Z" fill="#0018a8"/>
                        </svg>
                     </div>
                  </div>

                  {/* Top Info */}
                  <div className="flex justify-between items-start mt-2 text-[12px] leading-snug">
                     <div className="flex flex-col gap-[2px]">
                        <div>Date: {tableDateStr}</div>
                        <div>Sender:</div>
                        <div>{institution.accountName}</div>
                        <div>{institution.address}</div>
                        <div>IBAN: DE43500700100{institution.accountNumber}</div>
                     </div>
                     <div className="flex flex-col text-right">
                        <div>Deutsche Bank AG</div>
                        <div>Taunusanlage 12, 60325 Frankfurt am Main</div>
                     </div>
                  </div>

                  {/* Title */}
                  <div className="text-center font-bold text-[16px] tracking-wider mt-4 mb-4">
                     REMITTANCE ADVICE
                  </div>

                  {/* Account Info */}
                  <div className="flex gap-16 text-[10.5px] font-bold mb-3">
                     <div>ACCOUNT HOLDER: <span className="font-normal">{institution.accountName}</span></div>
                     <div>ACCOUNT SIGNATORY: <span className="font-normal">{institution.signatory}</span></div>
                  </div>

                  {/* Table 1 */}
                  <div className="text-[10.5px] w-full mb-4">
                     <div className="flex font-bold pb-2 border-b border-transparent">
                        <div className="w-[18%]">ACCOUNT TYPE</div>
                        <div className="w-[20%] text-center">BENEFICIARY/NUMBER</div>
                        <div className="w-[12%] text-center">CURRENCY</div>
                        <div className="w-[15%] text-center">DATE</div>
                        <div className="w-[15%] text-right pr-6">AMOUNT</div>
                        <div className="w-[20%]"></div>
                     </div>
                     <div className="flex pt-1 items-start">
                        <div className="w-[18%] leading-snug">Corporate account<br/>{institution.accountName}</div>
                        <div className="w-[20%] text-center pt-1">{institution.accountNumber}</div>
                        <div className="w-[12%] text-center pt-1">{transaction.currency}</div>
                        <div className="w-[15%] text-center pt-1">{tableDateStr}</div>
                        <div className="w-[15%] text-right pr-6 pt-1">{formatNumber(transaction.amount)}</div>
                        <div className="w-[20%] text-[10px] leading-snug pl-4">
                           {beneficiary.accountName}<br/>
                           Address: {beneficiary.address}<br/>
                           {beneficiary.bankName}<br/>
                           Address: {beneficiary.bankAddress || "222 BROADWAY, NEW YORK, NY 10038, USA"}<br/>
                           SWIFT: {beneficiary.swiftCode}<br/>
                           ACCOUNT NUMBER: {beneficiary.bankCode ? beneficiary.bankCode + beneficiary.accountNumber : beneficiary.accountNumber}
                        </div>
                     </div>
                  </div>

                  {/* Table 2 */}
                  <div className="text-[10.5px] w-full mt-6">
                     <div className="flex font-bold pb-2 border-b border-transparent">
                        <div className="w-[15%]">DATE</div>
                        <div className="w-[25%] text-center">PREV.BALANCE</div>
                        <div className="w-[20%] text-center">AUTHORITY</div>
                        <div className="w-[20%] text-center">AMOUNT</div>
                        <div className="w-[20%] text-right pr-8">BALANCE</div>
                     </div>
                     <div className="flex pt-2">
                        <div className="w-[15%]">{tableDateStr}</div>
                        <div className="w-[25%] text-center">{transaction.currency === 'EUR' ? '€' : transaction.currency === 'USD' ? '$' : transaction.currency === 'GBP' ? '£' : transaction.currency}{formatNumber(transaction.previousBalance)}</div>
                        <div className="w-[20%] text-center">CASH TRANSFER</div>
                        <div className="w-[20%] text-center">{transaction.currency === 'EUR' ? '€' : transaction.currency === 'USD' ? '$' : transaction.currency === 'GBP' ? '£' : transaction.currency}{formatNumber(transaction.amount)}</div>
                        <div className="w-[20%] text-right pr-8">{transaction.currency === 'EUR' ? '€' : transaction.currency === 'USD' ? '$' : transaction.currency === 'GBP' ? '£' : transaction.currency}{formatNumber(transaction.currentBalance)}</div>
                     </div>
                  </div>

                  {/* Signatures & Stamp */}
                  <div className="flex items-center mt-12 relative w-full">
                     <div className="flex gap-4 text-[11px] ml-16 z-10 w-full">
                        <span>Senior Corporate Officer</span>
                        <span className="font-bold uppercase ml-8">{transaction.participant || 'OLE MATTHIESSEN'}</span>
                     </div>

                  </div>
               </div>
            </div>
         </div>
         </div>
      </div>
   );
};

export default DeutschePrintoutV3;

