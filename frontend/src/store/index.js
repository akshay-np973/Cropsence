import { create } from 'zustand'

export const usePredictionStore = create((set) => ({
  result: null,
  setResult: (result) => set({ result }),
  clearResult: () => set({ result: null }),

  formValues: { nitrogen: '', phosphorus: '', potassium: '', temperature: '', humidity: '', ph: '', rainfall: '' },
  setFormValues: (values) => set({ formValues: values }),
  clearForm: () => set({ formValues: { nitrogen: '', phosphorus: '', potassium: '', temperature: '', humidity: '', ph: '', rainfall: '' } }),

  step: 'form',
  setStep: (step) => set({ step }),
  resetFlow: () => set({ step: 'form', result: null }),
}))

export const useToastStore = create((set) => ({
  toasts: [],
  addToast: (message, type = 'success') => {
    const id = Date.now()
    set((s) => ({ toasts: [...s.toasts, { id, message, type }] }))
    setTimeout(() => {
      set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }))
    }, 3500)
  },
  removeToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}))
