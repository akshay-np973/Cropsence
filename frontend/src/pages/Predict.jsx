import { useState, useCallback } from 'react'
import { useMutation } from '@tanstack/react-query'
import FormField from '../components/FormField'
import AssistModal from '../components/AssistModal'
import WeatherWidget from '../components/WeatherWidget'
import { runPrediction } from '../api'
import { usePredictionStore, useToastStore } from '../store'

const FIELDS = [
  { key: 'nitrogen',    label: 'Nitrogen (N)',    unit: 'mg/kg', min: 0,   max: 500,  hint: 'Available nitrogen in the soil' },
  { key: 'phosphorus',  label: 'Phosphorus (P)',  unit: 'mg/kg', min: 0,   max: 500,  hint: 'Available phosphorus in the soil' },
  { key: 'potassium',   label: 'Potassium (K)',   unit: 'mg/kg', min: 0,   max: 500,  hint: 'Available potassium in the soil' },
  { key: 'temperature', label: 'Temperature',     unit: '°C',    min: -10, max: 60,   hint: 'Current field temperature' },
  { key: 'humidity',    label: 'Humidity',        unit: '%',     min: 0,   max: 100,  hint: 'Relative humidity at field level' },
  { key: 'ph',          label: 'Soil pH',         unit: '',      min: 0,   max: 14,   hint: 'Measure of soil acidity or alkalinity' },
  { key: 'rainfall',    label: 'Rainfall',        unit: 'mm',    min: 0,   max: 500,  hint: 'Expected or recent rainfall' },
]

function validate(values) {
  const errors = {}
  FIELDS.forEach(({ key, min, max }) => {
    const raw = values[key]
    if (raw === '' || raw === undefined || raw === null) { errors[key] = 'Required.'; return }
    const num = parseFloat(raw)
    if (isNaN(num)) { errors[key] = 'Enter a valid number.'; return }
    if (num < min || num > max) errors[key] = `Must be between ${min} and ${max}.`
  })
  return errors
}

// ── Result View ───────────────────────────────────────────────────────────────
function ResultView({ result, onNewPrediction }) {
  return (
    <div className="container" style={{ padding: '40px 24px' }}>
      <div style={{ marginBottom: 24 }}>
        <button style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: 14 }} onClick={onNewPrediction}>← New Prediction</button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 12 }}>
          <h2 style={{ fontSize: 40 }}>{result.crop.charAt(0).toUpperCase() + result.crop.slice(1)}</h2>
          <span className="badge badge-recommended">{result.confidence}% confidence</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Conditions used */}
          <div className="card">
            <div className="card-header"><span className="card-title">Conditions Used</span></div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
              {Object.entries(result.inputs).map(([k, v]) => (
                <div key={k} style={{ background: 'var(--bg-surface)', borderRadius: 8, padding: '10px 12px' }}>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>{k}</div>
                  <div style={{ fontWeight: 600 }}>{v}</div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Explanation */}
          {result.explanation && (
            <div className="card">
              <div className="card-header">
                <span className="card-title">Why This Crop?</span>
                <span className="badge badge-recommended">AI Explanation</span>
              </div>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7 }}>{result.explanation}</p>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 12 }}>This is an explanation of the ML prediction, not a separate prediction.</p>
            </div>
          )}
        </div>

        {/* Alternatives */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {result.alternatives && result.alternatives.length > 0 && (
            <div className="card">
              <div className="card-header"><span className="card-title">Alternatives</span></div>
              {result.alternatives.map((a) => (
                <div key={a.crop} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)', fontSize: 14 }}>
                  <span style={{ textTransform: 'capitalize' }}>{a.crop}</span>
                  <span style={{ color: 'var(--text-muted)' }}>{a.probability}%</span>
                </div>
              ))}
            </div>
          )}
          <button className="btn btn-ghost btn-full" onClick={onNewPrediction}>New Prediction</button>
        </div>
      </div>
    </div>
  )
}

// ── Main Predict component ────────────────────────────────────────────────────
export default function Predict() {
  const { formValues, setFormValues, result, setResult, resetFlow } = usePredictionStore()
  const { addToast } = useToastStore()
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [step, setStep] = useState('form') // 'form' | 'review' | 'loading' | 'result'
  const [showAssist, setShowAssist] = useState(false)

  const { mutate } = useMutation({
    mutationFn: runPrediction,
    onSuccess: (data) => {
      setResult(data)
      setStep('result')
      addToast('Prediction saved to history', 'success')
    },
    onError: (err) => {
      setStep('form')
      addToast(err?.response?.data?.detail || 'Prediction failed. Check backend.', 'error')
    },
  })

  const handleChange = useCallback((e) => {
    const { name, value } = e.target
    setFormValues({ ...formValues, [name]: value })
  }, [formValues, setFormValues])

  const handleBlur = useCallback((e) => {
    setTouched((t) => ({ ...t, [e.target.name]: true }))
  }, [])

  const handleReview = () => {
    const allTouched = Object.fromEntries(FIELDS.map((f) => [f.key, true]))
    setTouched(allTouched)
    const errs = validate(formValues)
    setErrors(errs)
    if (Object.keys(errs).length === 0) setStep('review')
  }

  const handleSubmit = () => {
    setStep('loading')
    mutate({
      nitrogen: parseFloat(formValues.nitrogen),
      phosphorus: parseFloat(formValues.phosphorus),
      potassium: parseFloat(formValues.potassium),
      temperature: parseFloat(formValues.temperature),
      humidity: parseFloat(formValues.humidity),
      ph: parseFloat(formValues.ph),
      rainfall: parseFloat(formValues.rainfall),
      save: true,
    })
  }

  const handleAssistApply = (filled) => {
    setFormValues({ ...formValues, ...filled })
    addToast('Values applied from description', 'success')
  }

  const handleWeatherApply = (vals) => {
    setFormValues({ ...formValues, ...vals })
    addToast('Weather values applied', 'success')
  }

  const handleNewPrediction = () => {
    resetFlow()
    setStep('form')
    setErrors({})
    setTouched({})
  }

  // Compute errors for touched fields only
  const fieldErrors = Object.fromEntries(
    Object.entries(validate(formValues)).filter(([k]) => touched[k])
  )

  if (step === 'loading') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 200px)', gap: 20, textAlign: 'center' }}>
        <div style={{ fontSize: 48, animation: 'pulse 2s ease-in-out infinite' }}>🌱</div>
        <h2>Analyzing Your Field Conditions</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Running ML model prediction…</p>
        <div className="spinner" style={{ width: 32, height: 32 }} />
      </div>
    )
  }

  if (step === 'result' && result) {
    return <ResultView result={result} onNewPrediction={handleNewPrediction} />
  }

  if (step === 'review') {
    return (
      <div className="container" style={{ padding: '40px 24px' }}>
        <div style={{ marginBottom: 24 }}>
          <button className="btn btn-ghost btn-sm" onClick={() => setStep('form')}>← Back to Edit</button>
          <h2 style={{ marginTop: 12 }}>Review Your Values</h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: 4 }}>Confirm before submitting to the ML model.</p>
        </div>
        <div className="card" style={{ maxWidth: 600, marginBottom: 24 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {FIELDS.map(({ key, label, unit }) => (
              <div key={key} style={{ background: 'var(--bg-surface)', borderRadius: 8, padding: '12px 16px' }}>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>{label}</div>
                <div style={{ fontWeight: 600, fontSize: 18 }}>{formValues[key]} <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{unit}</span></div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button className="btn btn-ghost" onClick={() => setStep('form')}>Edit Values</button>
          <button className="btn btn-primary btn-lg" onClick={handleSubmit}>Recommend Crop</button>
        </div>
      </div>
    )
  }

  // Form step
  const soilFields = FIELDS.slice(0, 3)
  const envFields = FIELDS.slice(3)

  return (
    <div className="container" style={{ padding: '32px 24px 80px' }}>
      {showAssist && <AssistModal onApply={handleAssistApply} onClose={() => setShowAssist(false)} />}

      <div style={{ marginBottom: 24 }}>
        <span className="eyebrow">New Prediction</span>
        <h2 style={{ marginTop: 4 }}>Find the Right Crop for Your Conditions</h2>
        <p style={{ color: 'var(--text-secondary)', marginTop: 6, fontSize: 14 }}>Enter your soil and environmental conditions to receive a data-driven crop recommendation.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24, alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Soil params */}
          <div className="card">
            <div className="card-header"><span className="card-title">Soil Parameters</span></div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
              {soilFields.map(({ key, ...rest }) => (
                <FormField key={key} {...rest} name={key} value={formValues[key]} onChange={handleChange} onBlur={handleBlur} error={fieldErrors[key]} />
              ))}
            </div>
          </div>

          {/* Environmental params */}
          <div className="card">
            <div className="card-header"><span className="card-title">Environmental Parameters</span></div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
              {envFields.map(({ key, ...rest }) => (
                <FormField key={key} {...rest} name={key} value={formValues[key]} onChange={handleChange} onBlur={handleBlur} error={fieldErrors[key]} />
              ))}
            </div>
          </div>

          {/* Form actions */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: 'var(--text-muted)' }}>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '3px 9px', borderRadius: 100, background: 'var(--bg-hover)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>7 Required Values</span>
              <span>Values are used only to prepare this prediction.</span>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-ghost" onClick={() => { setFormValues({ nitrogen: '', phosphorus: '', potassium: '', temperature: '', humidity: '', ph: '', rainfall: '' }); setErrors({}); setTouched({}) }}>Clear Form</button>
              <button className="btn btn-primary" onClick={handleReview}>Recommend Crop</button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card" style={{ padding: 20 }}>
            <span className="eyebrow">Optional</span>
            <p style={{ fontSize: 14, fontWeight: 600, marginTop: 6, marginBottom: 4 }}>Need Help Entering Your Values?</p>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 12 }}>Describe your field conditions naturally and let the AI assistant help organize the information.</p>
            <button className="btn btn-secondary btn-full" onClick={() => setShowAssist(true)}>Assist Me</button>
          </div>
          <WeatherWidget onApply={handleWeatherApply} />
        </div>
      </div>
    </div>
  )
}
