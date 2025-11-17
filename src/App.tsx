import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Feed } from './pages/Feed'
import { Ranking } from './pages/Ranking'
import { WalletDetail } from './pages/WalletDetail'
import { Alerts } from './pages/Alerts'
import { Market } from './pages/Market'
import { FAQ } from './pages/FAQ'
import { Documentation } from './pages/Documentation'
import { Pricing } from './pages/Pricing'
import { Navigation } from './components/Navigation'
import { Footer } from './components/Footer'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-dark flex flex-col">
        <Navigation />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Feed />} />
            <Route path="/ranking" element={<Ranking />} />
            <Route path="/wallet/:address" element={<WalletDetail />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/market" element={<Market />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/docs" element={<Documentation />} />
            <Route path="/pricing" element={<Pricing />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App
