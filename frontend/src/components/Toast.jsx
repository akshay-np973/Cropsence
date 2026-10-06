import { useToastStore } from '../store'

export default function ToastContainer() {
  const { toasts, removeToast } = useToastStore()
  return (
    <div className="toast-container">
      {toasts.map((t) => (
        <div key={t.id} className={`toast ${t.type}`} onClick={() => removeToast(t.id)}>
          <span>{t.type === 'success' ? '✓' : '⚠'}</span>
          {t.message}
        </div>
      ))}
    </div>
  )
}
