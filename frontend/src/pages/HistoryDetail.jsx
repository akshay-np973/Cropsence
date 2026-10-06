import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getPrediction } from '../api'

function formatDate(str) {
  if (!str) return ''
  return new Date(str).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export default function HistoryDetail() {
  const { id } = useParams()
  const { data, isLoading, isError } = useQuery({
    queryKey: ['prediction', id],
    queryFn: () => getPrediction(id),
  })

  if (isLoading) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}>
      <div className="spinner" style={{ width: 32, height: 32 }} />
    </div>
  )

  if (isError || !data) return (
    <div className="container" style={{ padding: 48, textAlign: 'center' }}>
      <p style={{ color: 'var(--error)' }}>Prediction not found.</p>
      <Link to="/history" className="btn btn-secondary" style={{ marginTop: 16 }}>← Back to History</Link>
    </div>
  )

  const conditionFields = [
    { label: 'Nitrogen', key: 'nitrogen', unit: 'mg/kg' },
    { label: 'Phosphorus', key: 'phosphorus', unit: 'mg/kg' },
    { label: 'Potassium', key: 'potassium', unit: 'mg/kg' },
    { label: 'Temperature', key: 'temperature', unit: '°C' },
    { label: 'Humidity', key: 'humidity', unit: '%' },
    { label: 'Soil pH', key: 'ph', unit: '' },
    { label: 'Rainfall', key: 'rainfall', unit: 'mm' },
  ]

  return (
    <div className="container" style={{ padding: '32px 24px 80px' }}>
      <div style={{ marginBottom: 8, fontSize: 13, color: 'var(--text-muted)' }}>
        <Link to="/history" style={{ color: 'var(--text-muted)' }}>History</Link> / Prediction detail
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20, marginBottom: 32 }}>
        <div>
          <span className="eyebrow" style={{ display: 'block', marginBottom: 4 }}>Saved Prediction</span>
          <h2 style={{ textTransform: 'capitalize', fontSize: 36 }}>{data.crop}</h2>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 8 }}>
            <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{formatDate(data.created_at)}</span>
            <span className="badge badge-recommended">{data.confidence}% confidence</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="card">
            <div className="card-header"><span className="card-title">Conditions Used</span></div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
              {conditionFields.map(({ label, key, unit }) => (
                <div key={key} style={{ background: 'var(--bg-surface)', borderRadius: 8, padding: '10px 12px' }}>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>{label}</div>
                  <div style={{ fontWeight: 600 }}>{data[key]} <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{unit}</span></div>
                </div>
              ))}
            </div>
          </div>

          {data.explanation && (
            <div className="card">
              <div className="card-header">
                <span className="card-title">Why This Crop?</span>
                <span className="badge badge-recommended">AI Explanation</span>
              </div>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7 }}>{data.explanation}</p>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 12 }}>This is an explanation of the ML prediction, not a separate prediction.</p>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {data.alternatives && data.alternatives.length > 0 && (
            <div className="card">
              <div className="card-header"><span className="card-title">Alternative Predictions</span></div>
              {data.alternatives.map((a) => (
                <div key={a.crop} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)', fontSize: 14 }}>
                  <span style={{ textTransform: 'capitalize' }}>{a.crop}</span>
                  <span style={{ color: 'var(--text-muted)' }}>{a.probability}%</span>
                </div>
              ))}
            </div>
          )}
          <div style={{ display: 'flex', gap: 10 }}>
            <Link to="/history" className="btn btn-ghost">← Back to History</Link>
            <Link to="/predict" className="btn btn-primary">New Prediction</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
