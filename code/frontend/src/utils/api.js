// utils/api.js  — thin wrapper around the ThreatLens backend

const BASE = '/api/v1'

/**
 * POST an image file to the detection endpoint.
 * @param {File} file
 * @returns {Promise<{summary, detections, annotated_image, models_used}>}
 */
export async function detectThreats(file) {
  const form = new FormData()
  form.append('file', file)

  const res = await fetch(`${BASE}/detect`, {
    method: 'POST',
    body: form,
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.detail || `Server error ${res.status}`)
  }
  return res.json()
}

/** GET /health */
export async function checkHealth() {
  const res = await fetch('/health')
  if (!res.ok) throw new Error('Backend unreachable')
  return res.json()
}
