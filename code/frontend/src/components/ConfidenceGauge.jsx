import { CircularProgressbar } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'

export default function ConfidenceGauge({ value }) {
  const pct = Math.round(value * 100)

  return (
    <div className="w-20 h-20">
      <CircularProgressbar
        value={pct}
        text={`${pct}%`}
      />
    </div>
  )
}