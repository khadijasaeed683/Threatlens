// components/ThreatBadge.jsx
const STYLES = {
  fire:    'bg-orange-500/15 text-orange-400 border border-orange-500/30',
  fight:   'bg-pink-500/15   text-pink-400   border border-pink-500/30',
  weapon:  'bg-blue-500/15   text-blue-400   border border-blue-500/30',
  default: 'bg-purple-500/15 text-purple-400 border border-purple-500/30',
}

const ICONS = {
  fire:    '🔥',
  fight:   '⚠️',
  weapon:  '🔫',
  default: '🚨',
}

export default function ThreatBadge({ category, count }) {
  const key = category.toLowerCase()
  const style = STYLES[key] ?? STYLES.default
  const icon  = ICONS[key]  ?? ICONS.default
  return (
    <span className={`badge ${style} text-sm px-3 py-1.5`}>
      <span>{icon}</span>
      <span className="font-semibold">{count}</span>
      <span className="capitalize">{category}</span>
    </span>
  )
}
