import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { getWeather } from '../api'

export default function WeatherWidget({ onApply }) {
  const [city, setCity] = useState('')

  const { mutate, data, isPending, isError, error, reset } = useMutation({
    mutationFn: () => getWeather(city.trim()),
  })

  const handleFetch = () => { if (!city.trim()) return; reset(); mutate() }

  return (
    <div className="card" style={{ padding: 20 }}>
      <span className="eyebrow">Optional</span>
      <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 6, marginBottom: 12, lineHeight: 1.6 }}>
        Automatically fill current temperature and humidity from your location.
      </p>
      <div style={{ display: 'flex', gap: 8, marginBottom: data || isError ? 12 : 0 }}>
        <input
          className="form-input" placeholder="City name (e.g. Coimbatore)"
          value={city} onChange={(e) => setCity(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleFetch()}
          disabled={isPending}
        />
        <button className="btn btn-secondary btn-sm" onClick={handleFetch} disabled={isPending || !city.trim()}>
          {isPending ? <span className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} /> : 'Get'}
        </button>
      </div>
      {isError && <p style={{ color: 'var(--error)', fontSize: 13 }}>⚠ {error?.response?.data?.detail || 'Could not fetch weather'}</p>}
      {data && (
        <div style={{ background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', padding: 14, border: '1px solid var(--border)' }}>
          <p style={{ fontWeight: 600, marginBottom: 8 }}>{data.city}, {data.country}</p>
          <div style={{ display: 'flex', gap: 16, fontSize: 14, color: 'var(--text-secondary)', marginBottom: 10 }}>
            <span>🌡️ {data.temperature}°C</span>
            <span>💧 {data.humidity}%</span>
            <span style={{ textTransform: 'capitalize' }}>{data.description}</span>
          </div>
          <button className="btn btn-secondary btn-sm btn-full" onClick={() => onApply({ temperature: String(data.temperature), humidity: String(data.humidity) })}>
            Use These Values
          </button>
        </div>
      )}
    </div>
  )
}
