export default function About() {
  const principles = [
    { icon: '🔒', title: 'No invented data', desc: 'The AI explanation never changes or invents measurement values.' },
    { icon: '🔍', title: 'Transparent steps', desc: 'Every stage is visible — inputs, validation, ML output, and explanation are separate.' },
    { icon: '🎯', title: 'Model-first', desc: 'The crop recommendation always comes from the ML model, never from the AI.' },
    { icon: '🌾', title: 'Farmer-centred', desc: 'Simple language and clear UI designed for non-technical agricultural users.' },
  ]

  const flowSteps = [
    { label: 'User Input', desc: '7 numeric values' },
    { label: 'Validation', desc: 'Range checks' },
    { label: 'ML Model', desc: 'BaggingClassifier' },
    { label: 'Crop Recommendation', desc: '22 possible crops' },
    { label: 'AI Explanation', desc: 'Groq Llama 3' },
    { label: 'Saved Prediction', desc: 'SQLite history' },
  ]

  return (
    <div className="container" style={{ padding: '48px 24px 80px' }}>
      <div style={{ maxWidth: 640, marginBottom: 60 }}>
        <span className="eyebrow" style={{ display: 'block', marginBottom: 12 }}>About CropSense</span>
        <h2 style={{ marginBottom: 16 }}>Smarter Crop Decisions Start With Better Data.</h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: 15 }}>
          CropSense combines agricultural data, a pre-trained machine-learning model, and AI-assisted explanations to make recommendations easier to understand — not harder to trust.
        </p>
      </div>

      <div style={{ marginBottom: 60 }}>
        <h3 style={{ marginBottom: 20 }}>Clear by design</h3>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', padding: '24px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)' }}>
          {flowSteps.map((s, i) => (
            <div key={s.label} style={{ display: 'contents' }}>
              <div style={{ textAlign: 'center', minWidth: 120 }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{s.label}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{s.desc}</div>
              </div>
              {i < flowSteps.length - 1 && <span style={{ color: 'var(--text-muted)', fontSize: 20 }}>→</span>}
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 style={{ marginBottom: 20 }}>Our principles</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
          {principles.map((p) => (
            <div key={p.title} className="card">
              <div style={{ fontSize: 32, marginBottom: 12 }}>{p.icon}</div>
              <h3 style={{ fontSize: 15, marginBottom: 8 }}>{p.title}</h3>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
