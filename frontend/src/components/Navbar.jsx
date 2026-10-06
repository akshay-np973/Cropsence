import { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'

const links = [
  { to: '/',        label: 'Home',    exact: true },
  { to: '/predict', label: 'Predict' },
  { to: '/history', label: 'History' },
  { to: '/about',   label: 'About'   },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <nav className="navbar">
        <div className="navbar-inner">
          <Link to="/" className="navbar-brand">
            <span className="navbar-brand-icon">🌱</span>
            CropSense
          </Link>
          <ul className="navbar-links">
            {links.map(({ to, label, exact }) => (
              <li key={to}>
                <NavLink to={to} end={exact} className={({ isActive }) => isActive ? 'active' : ''}>
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
          <div className="navbar-cta">
            <Link to="/predict" className="btn btn-primary btn-sm">Start Prediction</Link>
          </div>
          <button className="hamburger" onClick={() => setOpen((o) => !o)} aria-label="Toggle navigation">
            <span /><span /><span />
          </button>
        </div>
      </nav>
      <nav className={`mobile-nav ${open ? 'open' : ''}`}>
        {links.map(({ to, label, exact }) => (
          <NavLink key={to} to={to} end={exact} className={({ isActive }) => isActive ? 'active' : ''} onClick={() => setOpen(false)}>
            {label}
          </NavLink>
        ))}
        <Link to="/predict" className="btn btn-primary btn-sm" style={{ marginTop: 8 }} onClick={() => setOpen(false)}>Start Prediction</Link>
      </nav>
    </>
  )
}
