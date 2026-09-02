export default function ThreatLevelBadge({ confidence }) {
  const pct = confidence * 100

  let label = 'LOW'
  let style = 'bg-blue-500/20 text-blue-400'

  if (pct >= 90) {
    label = 'CRITICAL'
    style = 'bg-red-500/20 text-red-400 animate-pulse'
  } else if (pct >= 75) {
    label = 'HIGH'
    style = 'bg-orange-500/20 text-orange-400'
  } else if (pct >= 50) {
    label = 'MEDIUM'
    style = 'bg-yellow-500/20 text-yellow-400'
  }

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold ${style}`}>
      {label}
    </span>
  )
}