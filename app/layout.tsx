import "./globals.scss";
import { Inter, Outfit } from "next/font/google";
import Providers from "./providers";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata = {
  title: "SQR400 | Swift Decentralized Gateway",
  description: "Enterprise-grade decentralized printing node simulator",
};

import { WebVitals } from "./components/WebVitals";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${outfit.variable} font-sans bg-slate-950 min-h-screen text-slate-100 antialiased selection:bg-cyan-500/30 selection:text-cyan-200`}>
        <WebVitals />
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
