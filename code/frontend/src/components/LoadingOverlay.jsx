// components/LoadingOverlay.jsx
export default function LoadingOverlay() {
  return (
    <div className="card p-10 flex flex-col items-center gap-5 text-center">
      {/* Pulse ring */}
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-2 border-brand-500/30 animate-ping" />
        <div className="absolute inset-2 rounded-full border-2 border-brand-500 animate-spin border-t-transparent" />
      </div>
      <div>
        <p className="text-slate-200 font-medium">Analysing image…</p>
        <p className="text-slate-500 text-sm mt-1">Running all threat detection models in parallel</p>
      </div>
    </div>
  )
}
