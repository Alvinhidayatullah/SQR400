"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-slate-100 font-mono p-4">
      <div className="bg-red-950/30 border border-red-500/30 p-8 rounded-3xl max-w-lg text-center shadow-2xl backdrop-blur-md relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-red-500 to-transparent" />
        <span className="text-4xl mb-4 block">⚠️</span>
        <h2 className="text-xl font-bold tracking-widest text-red-400 mb-2 uppercase">System Fault Detected</h2>
        <p className="text-sm text-slate-400 mb-6 font-sans">
          A critical error occurred while attempting to process the interface tree.
        </p>
        <button
          onClick={() => reset()}
          className="px-6 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/30 rounded-xl transition-all uppercase tracking-widest text-sm font-bold"
        >
          Initialize Recovery
        </button>
      </div>
    </div>
  );
}
