import { Routes, Route, Navigate } from 'react-router-dom'
import Intake from './pages/Intake.jsx'
import Checklist from './pages/Checklist.jsx'
import Privacy from './pages/Privacy.jsx'
import Terms from './pages/Terms.jsx'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'

// Each URL path shows one page. Header and footer sit outside Routes so they appear on every page.
// min-h-screen plus flex-col keeps the footer at the bottom on short pages.
function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <Routes>
        <Route path="/" element={<Intake />} />
        <Route path="/checklist" element={<Checklist />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        {/* Any unknown URL goes back to the questions instead of showing a blank page. */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </div>
  )
}

export default App
