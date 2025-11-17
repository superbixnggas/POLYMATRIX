import { Link } from 'react-router-dom'
import { Github, Twitter, Mail, FileText, Shield, HelpCircle } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4 gradient-text">PolyMatrix</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Crypto wallet monitoring platform with real-time analytics and automatic alerts.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center hover:bg-primary/20 transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center hover:bg-primary/20 transition-colors">
                <Github className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center hover:bg-primary/20 transition-colors">
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/market" className="text-muted-foreground hover:text-foreground transition-colors">Market Dashboard</Link></li>
              <li><Link to="/ranking" className="text-muted-foreground hover:text-foreground transition-colors">Wallet Ranking</Link></li>
              <li><Link to="/alerts" className="text-muted-foreground hover:text-foreground transition-colors">Alert System</Link></li>
              <li><Link to="/pricing" className="text-muted-foreground hover:text-foreground transition-colors">Pricing</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/docs" className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"><FileText className="w-3 h-3" /> Documentation</Link></li>
              <li><Link to="/faq" className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"><HelpCircle className="w-3 h-3" /> FAQ</Link></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">API Reference</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Support</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"><Shield className="w-3 h-3" /> Privacy Policy</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Cookie Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>2025 PolyMatrix. Professional crypto wallet monitoring platform.</p>
        </div>
      </div>
    </footer>
  )
}
