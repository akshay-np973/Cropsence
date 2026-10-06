import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Predict from './pages/Predict'
import History from './pages/History'
import HistoryDetail from './pages/HistoryDetail'
import About from './pages/About'

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 30_000 } },
})

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="app-shell">
          <Navbar />
          <main className="app-main">
            <Routes>
              <Route path="/"              element={<Home />} />
              <Route path="/predict"       element={<Predict />} />
              <Route path="/history"       element={<History />} />
              <Route path="/history/:id"   element={<HistoryDetail />} />
              <Route path="/about"         element={<About />} />
              <Route path="*"             element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
