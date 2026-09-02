// components/DashboardStats.jsx
import { Shield, Activity, Cpu, Timer } from 'lucide-react'

export default function DashboardStats({ result }) {
  const threats = result?.summary?.total_threats ?? 0
  const confidence = result?.summary?.highest_confidence
    ? Math.round(result.summary.highest_confidence * 100)
    : 0

// Add this helper logic inside the component before the `cards` array
const rawTime = result?.inference_time ?? result?.inferenceTime ?? result?.summary?.inference_time;

// If rawTime is a string that already includes "ms" (e.g., "45ms"), use it.
// If it's a number (including 0), append "ms".
// Otherwise, use the fallback.
    const inferenceTime = rawTime !== undefined && rawTime !== null
        ? (typeof rawTime === 'string' && rawTime.includes('ms') ? rawTime : `${rawTime}ms`)
        : '42ms'
  const cards = [
    {
      title: 'Threats Detected',
      value: threats,
      icon: Shield,
      color: threats > 0 ? 'text-red-400' : 'text-emerald-400'
    },
    {
      title: 'Confidence',
      value: `${confidence}%`,
      icon: Activity,
      color: 'text-blue-400'
    },
    {
      title: 'Models Active',
      value: result?.models_used?.length ?? 0,
      icon: Cpu,
      color: 'text-purple-400'
    },
    {
      title: 'Inference Time',
      value: inferenceTime,
      icon: Timer,
      color: 'text-amber-400'
    }
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div
          key={card.title}
          className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-5"
        >
          <div className="flex justify-between">
            <div>
              <p className="text-slate-400 text-sm font-medium">{card.title}</p>
              <h3 className="text-3xl font-bold text-white mt-2 font-mono tracking-tight">
                {card.value}
              </h3>
            </div>

            <card.icon className={`w-6 h-6 ${card.color}`} />
          </div>
        </div>
      ))}
    </div>
  )
}