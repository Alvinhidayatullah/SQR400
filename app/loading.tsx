export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <div className="flex flex-col items-center gap-6 relative">
        <div className="w-16 h-16 border-4 border-slate-800 border-t-cyan-500 rounded-full animate-spin"></div>
        <div className="text-cyan-500 tracking-[0.3em] font-mono text-sm font-bold animate-pulse uppercase">
          Initializing Node...
        </div>
      </div>
    </div>
  );
}
