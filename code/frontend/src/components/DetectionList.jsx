// components/DetectionList.jsx
const COLOURS = {
  fire:    'bg-orange-500',
  fight:   'bg-pink-500',
  weapon:  'bg-blue-500',
  default: 'bg-purple-500',
}

function ConfBar({ value }) {
  const pct = Math.round(value * 100)
  const col =
    pct >= 80 ? 'bg-red-500' :
    pct >= 60 ? 'bg-orange-500' :
                'bg-yellow-500'

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
        <div className={`h-full ${col} rounded-full transition-all`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs font-mono text-slate-400 w-10 text-right">{pct}%</span>
    </div>
  )
}

export default function DetectionList({ detections }) {
  if (!detections.length) {
    return (
      <div className="card p-6 text-center text-slate-500 text-sm">
        No detections to display.
      </div>
    )
  }

  return (
    <div className="card overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-800">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-400">
          Detections  ({detections.length})
        </h2>
      </div>

      <ul className="divide-y divide-slate-800/60 max-h-96 overflow-y-auto">
        {detections.map((det, i) => {
          const dot = COLOURS[det.model.toLowerCase()] ?? COLOURS.default
          const [x1, y1, x2, y2] = det.bbox.map(Math.round)
          return (
            <li key={i} className="px-6 py-3 hover:bg-slate-800/40 transition-colors">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${dot} shrink-0`} />
                  <span className="text-slate-200 text-sm font-medium capitalize">
                    {det.class_name}
                  </span>
                  <span className="text-xs text-slate-500 capitalize">({det.model})</span>
                </div>
                <span className="text-xs font-mono text-slate-500">
                  [{x1},{y1},{x2},{y2}]
                </span>
              </div>
              <ConfBar value={det.confidence} />
            </li>
          )
        })}
      </ul>
    </div>
  )
}
