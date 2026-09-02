// components/AnnotatedImage.jsx
import { Download } from 'lucide-react'

export default function AnnotatedImage({ b64, filename = 'threatlens_result.png' }) {
  const src = `data:image/png;base64,${b64}`

  function handleDownload() {
    const a = document.createElement('a')
    a.href = src
    a.download = filename
    a.click()
  }

  return (
    <div className="card overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-400">
          Annotated Output
        </h2>
        <button
          onClick={handleDownload}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          Save PNG
        </button>
      </div>
      <img
        src={src}
        alt="Annotated detection result"
        className="w-full object-contain max-h-[560px] bg-black"
      />
    </div>
  )
}
