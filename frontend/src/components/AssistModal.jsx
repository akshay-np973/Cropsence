import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { assistForm } from '../api'

const FIELD_LABELS = {
  nitrogen: 'Nitrogen (N)', phosphorus: 'Phosphorus (P)', potassium: 'Potassium (K)',
  temperature: 'Temperature', humidity: 'Humidity', ph: 'Soil pH', rainfall: 'Rainfall',
}

export default function AssistModal({ onApply, onClose }) {
  const [text, setText] = useState('')

  const { mutate, data, isPending, isError, error, reset } = useMutation({
    mutationFn: () => assistForm(text.trim()),
  })

  const handleOrganize = () => { if (text.trim().length < 5) return; reset(); mutate() }

  const handleApply = () => {
    if (!data) return
    const filled = {}
    Object.entries(data).forEach(([k, v]) => { if (v !== null && v !== undefined && k !== 'missing') filled[k] = String(v) })
    onApply(filled)
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <span className="eyebrow">Optional</span>
            <h3 style={{ marginTop: 4 }}>Assist Me</h3>
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <p className="modal-desc">Describe numeric field conditions. Missing values will be requested, not guessed.</p>
        <textarea
          className="modal-textarea" rows={4}
          placeholder='"My soil has high nitrogen and moderate phosphorus. The temperature is around 25°C and humidity is about 80%."'
          value={text} onChange={(e) => setText(e.target.value)}
          disabled={isPending}
        />
        {isError && <p style={{ color: 'var(--error)', fontSize: 13, marginBottom: 12 }}>⚠ {error?.message || 'Could not extract values'}</p>}
        {data && (
          <div className="modal-result">
            {Object.entries(FIELD_LABELS).map(([k, label]) => (
              <div key={k} className="modal-result-row">
                <span className="modal-result-label">{label}</span>
                {data[k] != null
                  ? <span className="modal-result-value">{data[k]}</span>
                  : <span className="modal-result-missing">not found</span>}
              </div>
            ))}
          </div>
        )}
        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          {!data
            ? <button className="btn btn-primary" onClick={handleOrganize} disabled={isPending || text.trim().length < 5}>
                {isPending ? <><span className="spinner" style={{ width: 16, height: 16 }} /> Analyzing…</> : 'Organize Values'}
              </button>
            : <button className="btn btn-primary" onClick={handleApply}>Apply Values</button>}
        </div>
      </div>
    </div>
  )
}
