// components/SummaryPanel.jsx
import { ShieldAlert, ShieldCheck, Cpu, Download, AlertTriangle } from 'lucide-react'
import ThreatBadge from './ThreatBadge'

export default function SummaryPanel({ summary, modelsUsed }) {
  const isClear = summary.total_threats === 0

  // 1. Generate Action Protocol based on the active threat categories
  const getActionProtocol = () => {
    if (isClear) return null

    const activeThreats = Object.keys(summary.by_category)
    const hasWeapon = activeThreats.includes('weapon')
    const hasFight = activeThreats.includes('fight')
    const hasFire = activeThreats.includes('fire')

    if ((hasWeapon && hasFight) || (hasWeapon && hasFire)) {
      return {
        level: 'Critical Max',
        bg: 'bg-red-950/40 border-red-500/30',
        text: 'text-red-400',
        message: 'Critical threat signature: Weapon active alongside hostile activity/fire discharge. Immediately dispatch tactical security team and notify local authorities.'
      }
    }
    if (hasWeapon) {
      return {
        level: 'High Risk',
        bg: 'bg-amber-950/40 border-amber-500/30',
        text: 'text-amber-400',
        message: 'Weapon detected in monitoring zone. Isolate the sector, review live feeds, and alert internal security details immediately.'
      }
    }
    if (hasFire) {
      return {
        level: 'High Risk',
        bg: 'bg-orange-950/40 border-orange-500/30',
        text: 'text-orange-400',
        message: 'Thermal/Fire anomaly detected. Initiate fire suppression systems protocol and dispatch emergency response units to the localized area.'
      }
    }
    if (hasFight) {
      return {
        level: 'Medium Risk',
        bg: 'bg-yellow-950/20 border-yellow-500/30',
        text: 'text-yellow-400',
        message: 'Physical altercation detected. Dispatch nearest floor or area security personnel to de-escalate the situation.'
      }
    }
    return null
  }

  const protocol = getActionProtocol()

  // 2. Handler to download the raw detection telemetry as a JSON file
  const handleDownloadLog = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ summary, modelsUsed, generatedAt: new Date().toISOString() }, null, 2))
    const downloadAnchor = document.createElement('a')
    downloadAnchor.setAttribute("href", dataStr)
    downloadAnchor.setAttribute("download", `ThreatLens_Log_${Date.now()}.json`)
    document.body.appendChild(downloadAnchor)
    downloadAnchor.click()
    downloadAnchor.remove()
  }

  return (
    <div className="card p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-400">
          Threat Summary
        </h2>
        {isClear ? (
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
        ) : (
          <ShieldAlert className="w-5 h-5 text-red-400" />
        )}
      </div>

      {/* Status line */}
      <div className={`text-2xl font-bold ${isClear ? 'text-emerald-400' : 'text-red-400'}`}>
        {isClear ? 'No Threats Detected' : `${summary.total_threats} Threat${summary.total_threats !== 1 ? 's' : ''} Detected`}
      </div>

      {/* Badges */}
      {!isClear && (
        <div className="flex flex-wrap gap-2">
          {Object.entries(summary.by_category).map(([cat, count]) => (
            <ThreatBadge key={cat} category={cat} count={count} />
          ))}
        </div>
      )}

      {/* Confidence */}
      {summary.highest_confidence != null && (
        <p className="text-sm text-slate-400">
          Highest confidence:{' '}
          <span className="text-slate-200 font-medium font-mono">
            {(summary.highest_confidence * 100).toFixed(1)}%
          </span>
        </p>
      )}

      {/* Suggested Action Protocol Section */}
      {protocol && (
        <div className={`p-3.5 border rounded-lg ${protocol.bg} space-y-1.5 transition-all`}>
          <div className="flex items-center gap-1.5 font-bold text-xs uppercase tracking-wider">
            <AlertTriangle className={`w-3.5 h-3.5 ${protocol.text}`} />
            <span className={protocol.text}>Protocol: {protocol.level}</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {protocol.message}
          </p>
        </div>
      )}

      {/* Action Buttons & Meta Metadata */}
      <div className="space-y-3 pt-3 border-t border-slate-800">
        {/* Download Button */}
        <button
          onClick={handleDownloadLog}
          className="flex items-center justify-center gap-2 w-full py-2 px-3 text-xs font-medium text-slate-300 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/50 hover:border-slate-600 rounded-md transition-all group"
        >
          <Download className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-200 transition-colors" />
          Download Detection Log
        </button>

        {/* Models used */}
        <div className="flex items-center gap-2 pl-1">
          <Cpu className="w-3.5 h-3.5 text-slate-600" />
          <p className="text-xs text-slate-500">
            Models: <span className="text-slate-400">{modelsUsed.join(', ')}</span>
          </p>
        </div>
      </div>
    </div>
  )
}