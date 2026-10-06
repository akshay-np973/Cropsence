import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <h3>🌱 CropSense</h3>
          <p>Smarter Crop Decisions, Powered by Data.</p>
          <p className="footer-copy">© 2026 CropSense.</p>
        </div>
        <div className="footer-col">
          <h4>Explore</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/predict">Predict</Link></li>
            <li><Link to="/history">History</Link></li>
            <li><Link to="/about">About</Link></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Technology</h4>
          <ul>
            <li><span style={{ color: 'var(--text-muted)', fontSize: 13 }}>Machine Learning</span></li>
            <li><span style={{ color: 'var(--text-muted)', fontSize: 13 }}>AI Assistance</span></li>
          </ul>
        </div>
      </div>
    </footer>
  )
}
