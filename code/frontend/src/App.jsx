// App.jsx
import { RotateCcw } from 'lucide-react'
import { useDetection } from './hooks/useDetection'

import Header from './components/Header'
import UploadZone from './components/UploadZone'
import LoadingOverlay from './components/LoadingOverlay'
import ErrorBanner from './components/ErrorBanner'

import SummaryPanel from './components/SummaryPanel'
import DetectionList from './components/DetectionList'
import AnnotatedImage from './components/AnnotatedImage'

import DashboardStats from './components/DashboardStats'
import ComparisonViewer from './components/ComparisonViewer'

export default function App() {
  const {
    status,
    result,
    error,
    preview,
    analyze,
    reset,
  } = useDetection()

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">

      {/* Header */}
      <Header />

      {/* Main */}
      <main className="flex-1 max-w-[1800px] mx-auto w-full px-4 md:px-8 py-8 space-y-8">

        {/* REMOVED: The duplicate global DashboardStats component was deleted from here */}

        {/* Upload Section */}
        {(status === 'idle' || status === 'error') && (
          <section className="space-y-6">

            <div>
              <h1 className="text-4xl font-bold tracking-tight">
                AI Vision Monitoring
              </h1>

              <p className="text-slate-400 mt-2 max-w-2xl">
                Upload surveillance or scene images and run
                Fire, Fight and Weapon detection models in parallel.
                Results include annotated outputs, confidence scores,
                threat summaries and localization details.
              </p>
            </div>

            {status === 'error' && (
              <ErrorBanner
                message={error}
                onRetry={reset}
              />
            )}

            <UploadZone
              onFile={analyze}
              disabled={false}
            />

          </section>
        )}

        {/* Loading */}
        {status === 'loading' && (
          <LoadingOverlay />
        )}

        {/* Results */}
        {status === 'success' && result && (
          <section className="space-y-8">

            {/* Toolbar */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

              <div>
                <h2 className="text-2xl font-bold">
                  Analysis Complete
                </h2>

                <p className="text-slate-400 text-sm mt-1">
                  Detection pipeline finished successfully.
                </p>
              </div>

              <button
                onClick={reset}
                className="
                  flex items-center gap-2
                  px-4 py-2
                  rounded-xl
                  border border-slate-700
                  bg-slate-900
                  hover:bg-slate-800
                  transition-all
                "
              >
                <RotateCcw className="w-4 h-4" />
                Analyse Another Image
              </button>

            </div>

            {/* Summary Metrics (KEPT: This instance displays correctly only when result exists) */}
            <DashboardStats result={result} />

            {/* Main Grid */}
            <div className="grid lg:grid-cols-12 gap-6">

              {/* Left Sidebar */}
              <div className="lg:col-span-4 space-y-6">

                <SummaryPanel
                  summary={result.summary}
                  modelsUsed={result.models_used}
                />

                <DetectionList
                  detections={result.detections}
                />

              </div>

              {/* Right Content */}
              <div className="lg:col-span-8 space-y-6">

                {/* Before vs After */}
                {preview && (
                  <ComparisonViewer
                    original={preview}
                    annotated={result.annotated_image}
                  />
                )}

                {/* Full Annotated Result */}
                <AnnotatedImage
                  b64={result.annotated_image}
                />

              </div>

            </div>

          </section>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-5 text-center">
        <p className="text-xs text-slate-500">
          ThreatLens • AI-Powered Computer Vision Monitoring Platform
        </p>
      </footer>

    </div>
  )
}