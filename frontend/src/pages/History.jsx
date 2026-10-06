import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getHistory } from '../api'

function formatDate(str) {
  if (!str) return ''
  return new Date(str).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export default function History() {
  const [search, setSearch] = useState('')
  const [query, setQuery] = useState('')

  const { data, isLoading, isError } = useQuery({
    queryKey: ['history', query],
    queryFn: () => getHistory(query),
  })

  const handleSearch = (e) => { e.preventDefault(); setQuery(search) }

  return (
    <div className="container" style={{ padding: '32px 24px 80px' }}>
      <div style={{ marginBottom: 32 }}>
        <h2>Prediction History</h2>
        <p style={{ color: 'var(--text-secondary)', marginTop: 6 }}>Review crops and conditions from saved predictions.</p>
      </div>

      <form onSubmit={handleSearch} style={{ display: 'flex', gap: 10, marginBottom: 32, maxWidth: 400 }}>
        <input className="form-input" placeholder="Search by crop name…" value={search} onChange={(e) => setSearch(e.target.value)} />
        <button className="btn btn-secondary" type="submit">Search</button>
        {query && <button className="btn btn-ghost" type="button" onClick={() => { setSearch(''); setQuery('') }}>Clear</button>}
      </form>

      {isLoading && (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
          <div className="spinner" style={{ width: 32, height: 32 }} />
        </div>
      )}

      {isError && (
        <div className="card" style={{ textAlign: 'center', padding: 48 }}>
          <p style={{ color: 'var(--error)' }}>⚠ Failed to load history. Is the backend running?</p>
        </div>
      )}

      {!isLoading && !isError && data?.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: 64 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📋</div>
          <h3 style={{ marginBottom: 8 }}>No saved predictions yet</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>Your saved crop recommendations will appear here with the exact values used.</p>
          <Link to="/predict" className="btn btn-primary">Start Prediction</Link>
        </div>
      )}

      {data && data.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {data.map((p) => (
            <Link key={p.id} to={`/history/${p.id}`} style={{ textDecoration: 'none' }}>
              <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', transition: 'border-color 0.15s' }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--border-accent)'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 18, textTransform: 'capitalize', color: 'var(--text-primary)', marginBottom: 4 }}>{p.crop}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{formatDate(p.created_at)}</div>
                  </div>
                  <span className="badge badge-recommended">{p.confidence}%</span>
                </div>
                <div style={{ display: 'flex', gap: 16, fontSize: 13, color: 'var(--text-muted)' }}>
                  <span>N {p.nitrogen} · P {p.phosphorus} · K {p.potassium}</span>
                  <span>→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
