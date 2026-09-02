// components/Header.jsx
import { ScanEye } from 'lucide-react'

export default function Header() {
  const pipelineModels = [
    { name: 'Fire Detection', dotColor: 'bg-orange-500', bgColor: 'bg-orange-500/10', textColor: 'text-orange-400', border: 'border-orange-500/20' },
    { name: 'Fight Detection', dotColor: 'bg-yellow-500', bgColor: 'bg-yellow-500/10', textColor: 'text-yellow-400', border: 'border-yellow-500/20' },
    { name: 'Weapon Detection', dotColor: 'bg-red-500', bgColor: 'bg-red-500/10', textColor: 'text-red-400', border: 'border-red-500/20' },
  ]

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/70 border-b border-slate-900">
      <div className="px-4 md:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 shadow-inner">
            <ScanEye className="w-5 h-5 text-blue-400 animate-pulse" />
          </div>

          <div>
            {/* Increased text size and tweaked font weight/tracking */}
            <h1 className="text-lg md:text-xl font-extrabold text-white tracking-tight leading-none">
              ThreatLens
            </h1>
            <p className="text-[10px] md:text-xs text-slate-500 font-medium mt-1">
              AI Vision Monitoring Platform
            </p>
          </div>
        </div>

        {/* Right Side: Individual Model Pipeline Status Badges */}
        <div className="hidden sm:flex items-center gap-2.5">
          {pipelineModels.map((model) => (
            <div
              key={model.name}
              className={`flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-medium border ${model.bgColor} ${model.textColor} ${model.border}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${model.dotColor} shadow-sm`} />
              {model.name}
            </div>
          ))}
        </div>

      </div>
    </header>
  )
}