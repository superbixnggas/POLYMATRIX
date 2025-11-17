import { Link, useLocation } from 'react-router-dom'
import { Activity, Trophy, Bell, TrendingUp, HelpCircle, DollarSign } from 'lucide-react'

export function Navigation() {
  const location = useLocation()
  
  const navItems = [
    { path: '/', label: 'Feed', icon: Activity },
    { path: '/ranking', label: 'Wallets', icon: Trophy },
    { path: '/market', label: 'Market', icon: TrendingUp },
    { path: '/faq', label: 'FAQ', icon: HelpCircle },
    { path: '/pricing', label: 'Pricing', icon: DollarSign },
    { path: '/alerts', label: 'Alerts', icon: Bell },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">PolyMatrix</span>
          </Link>

          <div className="flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    isActive
                      ? 'bg-primary text-white'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium hidden md:inline">{item.label}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}
