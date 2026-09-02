import { useRef, useState } from 'react'
import { Upload, ImagePlus, ScanSearch } from 'lucide-react'

const ACCEPTED = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/bmp'
]

export default function UploadZone({ onFile, disabled }) {
  const inputRef = useRef(null)
  const [dragging, setDragging] = useState(false)

  function handleFiles(files) {
    const file = files?.[0]

    if (!file) return

    if (!ACCEPTED.includes(file.type)) {
      alert('Please upload a JPEG, PNG, WebP, or BMP image.')
      return
    }

    onFile(file)
  }

  return (
    <div
      onClick={() => !disabled && inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault()
        if (!disabled) setDragging(true)
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault()
        setDragging(false)

        if (!disabled) {
          handleFiles(e.dataTransfer.files)
        }
      }}
      className={`
        relative
        overflow-hidden
        rounded-3xl
        border
        p-12
        cursor-pointer
        transition-all
        duration-300
        flex
        flex-col
        items-center
        justify-center
        gap-5
        text-center

        ${
          disabled
            ? 'opacity-50 cursor-not-allowed border-slate-800 bg-slate-900'
            : dragging
              ? 'border-blue-400 bg-blue-500/5 scale-[1.01] shadow-[0_0_35px_rgba(59,130,246,0.15)]'
              : 'border-slate-700 bg-slate-900/70 hover:border-blue-500/40 hover:shadow-[0_0_35px_rgba(59,130,246,0.10)]'
        }
      `}
    >
      {/* Gradient layer */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-red-500/5" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-5">

        <div
          className={`
            p-5
            rounded-2xl
            border
            transition-all

            ${
              dragging
                ? 'border-blue-500/40 bg-blue-500/10'
                : 'border-slate-700 bg-slate-800/80'
            }
          `}
        >
          {dragging ? (
            <ImagePlus className="w-10 h-10 text-blue-400" />
          ) : (
            <ScanSearch className="w-10 h-10 text-slate-300" />
          )}
        </div>

        <div>
          <h3 className="text-xl font-semibold text-white">
            {dragging
              ? 'Drop image to analyse'
              : 'Upload Image'}
          </h3>

          <p className="text-slate-400 mt-2 max-w-md">
            Run Fire, Fight and Weapon Detection models
            simultaneously and receive annotated AI predictions.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 text-xs">
          <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-300">
            Fire
          </span>

          <span className="px-3 py-1 rounded-full bg-pink-500/10 text-pink-300">
            Fight
          </span>

          <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-300">
            Weapon
          </span>
        </div>

        <p className="text-xs text-slate-500">
          JPEG • PNG • WebP • BMP
        </p>

      </div>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED.join(',')}
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
        disabled={disabled}
      />
    </div>
  )
}