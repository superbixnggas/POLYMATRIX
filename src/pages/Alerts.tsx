import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Bell, Plus, Trash2, Volume2, Wallet } from 'lucide-react'

interface Alert {
  id: string
  user_id: string
  wallet_address: string | null
  volume_threshold: number | null
  alert_type: string
  is_active: boolean
  created_at: string
}

export function Alerts() {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    alert_type: 'volume',
    wallet_address: '',
    volume_threshold: ''
  })

  useEffect(() => {
    fetchAlerts()
  }, [])

  const fetchAlerts = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('alerts-list', {
        body: {}
      })
      
      if (error) throw error
      
      if (data?.data) {
        setAlerts(data.data)
      }
    } catch (error) {
      console.error('Error fetching alerts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const { data, error } = await supabase.functions.invoke('alerts-subscribe', {
        body: {
          alert_type: formData.alert_type,
          wallet_address: formData.alert_type === 'wallet' ? formData.wallet_address : null,
          volume_threshold: formData.alert_type === 'volume' ? parseFloat(formData.volume_threshold) : null,
          user_id: 'anonymous'
        }
      })
      
      if (error) throw error
      
      if (data?.data) {
        setAlerts([data.data, ...alerts])
        setFormData({ alert_type: 'volume', wallet_address: '', volume_threshold: '' })
        setShowForm(false)
      }
    } catch (error) {
      console.error('Error creating alert:', error)
      alert('Failed to create alert')
    }
  }

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  if (loading) {
    return (
      <div className="pt-24 px-4 max-w-7xl mx-auto">
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 bg-card rounded-lg"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="pt-24 px-4 max-w-4xl mx-auto pb-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">
          <span className="gradient-text">Alert</span> System
        </h1>
        <p className="text-muted-foreground">Manage notifications for important transactions</p>
      </div>

      <button
        onClick={() => setShowForm(!showForm)}
        className="mb-6 flex items-center gap-2 px-6 py-3 bg-gradient-primary text-white rounded-lg hover:opacity-90 transition-opacity font-semibold"
      >
        <Plus className="w-5 h-5" />
        Create New Alert
      </button>

      {showForm && (
        <div className="bg-card border border-border rounded-lg p-6 mb-6 animate-slide-up">
          <h3 className="text-xl font-bold mb-4">Alert Configuration</h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Alert Type</label>
              <select
                value={formData.alert_type}
                onChange={(e) => setFormData({ ...formData, alert_type: e.target.value })}
                className="w-full px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="volume">Volume Threshold</option>
                <option value="wallet">Wallet Spesifik</option>
              </select>
            </div>

            {formData.alert_type === 'volume' && (
              <div>
                <label className="block text-sm font-medium mb-2">
                  Minimum Volume (USD)
                </label>
                <input
                  type="number"
                  value={formData.volume_threshold}
                  onChange={(e) => setFormData({ ...formData, volume_threshold: e.target.value })}
                  placeholder="Example: 10000"
                  required
                  className="w-full px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            )}

            {formData.alert_type === 'wallet' && (
              <div>
                <label className="block text-sm font-medium mb-2">
                  Wallet Address
                </label>
                <input
                  type="text"
                  value={formData.wallet_address}
                  onChange={(e) => setFormData({ ...formData, wallet_address: e.target.value })}
                  placeholder="0x..."
                  required
                  className="w-full px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary font-mono"
                />
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-semibold"
              >
                Save Alert
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-3">
        {alerts.length === 0 ? (
          <div className="bg-card border border-border rounded-lg p-12 text-center">
            <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No active alerts yet</p>
            <p className="text-sm text-muted-foreground mt-2">
              Create alerts to get notifications for important transactions
            </p>
          </div>
        ) : (
          alerts.map((alert) => (
            <div
              key={alert.id}
              className="bg-card border border-border rounded-lg p-4 hover:border-primary/50 transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    alert.alert_type === 'volume' ? 'bg-warning/10' : 'bg-primary/10'
                  }`}>
                    {alert.alert_type === 'volume' ? (
                      <Volume2 className="w-6 h-6 text-warning" />
                    ) : (
                      <Wallet className="w-6 h-6 text-primary" />
                    )}
                  </div>

                  <div>
                    <div className="font-semibold mb-1">
                      {alert.alert_type === 'volume' ? 'Volume Alert' : 'Wallet Alert'}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {alert.alert_type === 'volume' ? (
                        <>Volume above ${alert.volume_threshold?.toLocaleString()}</>
                      ) : (
                        <>Wallet: {alert.wallet_address && truncateAddress(alert.wallet_address)}</>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                        alert.is_active
                          ? 'bg-success/10 text-success'
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {alert.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    // In real app, this would delete the alert
                    setAlerts(alerts.filter(a => a.id !== alert.id))
                  }}
                  className="p-2 hover:bg-destructive/10 rounded-lg transition-colors group"
                >
                  <Trash2 className="w-5 h-5 text-muted-foreground group-hover:text-destructive" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
