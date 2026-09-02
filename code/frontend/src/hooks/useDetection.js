import { useState, useCallback } from 'react'
import { detectThreats } from '../utils/api'

const HISTORY_KEY = 'threatlens-history'

export function useDetection() {
  const [status, setStatus] = useState('idle')
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [preview, setPreview] = useState(null)

  const saveToHistory = (data) => {
    try {
      const existing = JSON.parse(
        localStorage.getItem(HISTORY_KEY) || '[]'
      )

      const item = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        summary: data.summary,
        models_used: data.models_used,
      }

      const updated = [item, ...existing].slice(0, 5)

      localStorage.setItem(
        HISTORY_KEY,
        JSON.stringify(updated)
      )
    } catch (err) {
      console.error('Failed to save history:', err)
    }
  }

  const analyze = useCallback(async (file) => {
    setStatus('loading')
    setError(null)
    setResult(null)

    if (preview) {
      URL.revokeObjectURL(preview)
    }

    const localUrl = URL.createObjectURL(file)
    setPreview(localUrl)

    try {
      const data = await detectThreats(file)

      setResult(data)
      setStatus('success')

      saveToHistory(data)
    } catch (err) {
      setError(err.message || 'Detection failed')
      setStatus('error')
    }
  }, [preview])

  const reset = useCallback(() => {
    setStatus('idle')
    setResult(null)
    setError(null)

    if (preview) {
      URL.revokeObjectURL(preview)
    }

    setPreview(null)
  }, [preview])

  return {
    status,
    result,
    error,
    preview,
    analyze,
    reset,
  }
}