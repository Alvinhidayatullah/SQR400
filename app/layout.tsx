import "./globals.scss";
import { Inter, Outfit } from "next/font/google";
import Providers from "./providers";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata = {
  title: "SQR400 | Enterprise Financial Node",
  description: "Enterprise-grade decentralized SWIFT printing node simulator and gateway.",
  openGraph: {
    title: "SQR400 | Enterprise Financial Node",
    description: "Enterprise-grade decentralized SWIFT printing node simulator and gateway.",
    url: "https://sqr400-sigma.vercel.app",
    siteName: "SQR400 Gateway",
    images: [
      {
        url: "https://sqr400-sigma.vercel.app/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "SQR400 System Dashboard",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SQR400 | Enterprise Financial Node",
    description: "Enterprise-grade decentralized SWIFT printing node simulator and gateway.",
  },
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
