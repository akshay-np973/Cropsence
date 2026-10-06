import { Link } from 'react-router-dom'

const features = [
  { icon: '🧪', title: 'Data-Driven Prediction', desc: 'Analyze N, P, K, temperature, humidity, rainfall, and soil pH with a pre-trained crop model.' },
  { icon: '🤖', title: 'AI Explanation', desc: 'Understand why a crop was recommended in simple, practical language — without changing the model result.' },
  { icon: '📋', title: 'Prediction History', desc: 'Review previous recommendations and the exact conditions used for every saved prediction.' },
  { icon: '🌾', title: 'Simple & Farmer Friendly', desc: 'Comfortable inputs and clear guidance for farmers, advisors, and non-technical users.' },
]

const steps = [
  { num: '01', title: 'Enter Conditions',   desc: 'Add seven soil and environmental values.' },
  { num: '02', title: 'Analyze',            desc: 'We validate and prepare your inputs.' },
  { num: '03', title: 'Get Recommendation', desc: 'The ML model predicts the crop.' },
  { num: '04', title: 'Understand',         desc: 'AI explains the result in plain language.' },
]

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section style={{ padding: '80px 0 64px', borderBottom: '1px solid var(--border)' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
          <div>
            <span className="eyebrow" style={{ display: 'block', marginBottom: 16 }}>Agriculture, Informed</span>
            <h1 style={{ background: 'linear-gradient(135deg, var(--text-primary) 60%, var(--green-400))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', marginBottom: 20 }}>
              Make Smarter Crop<br />Decisions.
            </h1>
            <p style={{ fontSize: 17, color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: 32 }}>
              Get data-driven crop recommendations using soil and environmental conditions.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 32 }}>
              <Link to="/predict" className="btn btn-primary btn-lg">Start Prediction</Link>
              <a href="#how-it-works" className="btn btn-ghost btn-lg">How It Works</a>
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {['Soil-based recommendations', 'Data-driven predictions', 'AI-assisted explanations'].map((b) => (
                <span key={b} style={{ fontSize: 12, padding: '4px 10px', borderRadius: 100, background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>{b}</span>
              ))}
            </div>
          </div>
          {/* Hero card */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="card" style={{ width: 300, gap: 12, display: 'flex', flexDirection: 'column', boxShadow: 'var(--glow), var(--shadow-lg)' }}>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Recommended Crop</span>
              <div style={{ fontSize: 32, fontWeight: 700 }}>🌾 Rice</div>
              <span className="badge badge-recommended">92% confidence</span>
              <hr className="divider" style={{ margin: '4px 0' }} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                {[['N', '90'], ['P', '42'], ['K', '43']].map(([l, v]) => (
                  <div key={l} style={{ background: 'var(--bg-surface)', borderRadius: 8, padding: '8px 10px' }}>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 2 }}>{l}</div>
                    <div style={{ fontWeight: 600, fontSize: 15 }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '80px 0', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <span className="eyebrow" style={{ display: 'block', marginBottom: 12 }}>Everything You Need</span>
            <h2>For a Smarter Crop Decision</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
            {features.map((f) => (
              <div key={f.title} className="card" style={{ gap: 12, display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontSize: 32 }}>{f.icon}</div>
                <h3 style={{ fontSize: 15 }}>{f.title}</h3>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" style={{ padding: '80px 0', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <span className="eyebrow" style={{ display: 'block', marginBottom: 12 }}>How It Works</span>
            <h2>From field conditions to a practical recommendation</h2>
            <p style={{ color: 'var(--text-secondary)', marginTop: 12, fontSize: 15 }}>Four transparent steps. Your measurements stay visible from start to finish.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
            {steps.map((s, i) => (
              <div key={s.num} className="card" style={{ position: 'relative' }}>
                {i < steps.length - 1 && <div style={{ position: 'absolute', top: '50%', right: -12, width: 24, height: 2, background: 'var(--border)', zIndex: 1 }} />}
                <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--accent)', opacity: 0.4, marginBottom: 8 }}>{s.num}</div>
                <h3 style={{ fontSize: 15, marginBottom: 6 }}>{s.title}</h3>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ marginBottom: 12 }}>Put your field data to work.</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 32, fontSize: 16 }}>Review every value, get a model-backed crop prediction, and understand the result.</p>
          <Link to="/predict" className="btn btn-primary btn-lg">Start Prediction</Link>
        </div>
      </section>
    </div>
  )
}
