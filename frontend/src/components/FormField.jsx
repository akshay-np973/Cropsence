export default function FormField({ label, name, value, onChange, onBlur, error, hint, unit, placeholder = 'Enter value', min, max, step = 'any' }) {
  return (
    <div className="form-group">
      <label className="form-label" htmlFor={name}>{label}</label>
      <div className="input-wrapper">
        <input
          id={name} name={name} type="number"
          className={`form-input ${error ? 'error' : ''}`}
          placeholder={placeholder}
          value={value} onChange={onChange} onBlur={onBlur}
          min={min} max={max} step={step}
          style={unit ? { paddingRight: '52px' } : undefined}
        />
        {unit && <span className="input-unit">{unit}</span>}
      </div>
      {error && <span className="form-error"><span>⚠</span> {error}</span>}
      {!error && hint && <span className="form-hint">{hint}</span>}
    </div>
  )
}
