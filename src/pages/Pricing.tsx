import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { Check, Zap, Crown } from 'lucide-react'

interface PricingPlan {
  id: string
  name: string
  price: number
  period: string
  features: string[]
  limits: {
    maxWallets: number
    maxAlerts: number
    dataRetention: number
    apiAccess: boolean
  }
  popular?: boolean
}

export function Pricing() {
  const [plans, setPlans] = useState<PricingPlan[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPlan, setSelectedPlan] = useState<string>('free')

  useEffect(() => {
    fetchPlans()
  }, [])

  const fetchPlans = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('subscription-plans', {
        body: {}
      })
      
      if (error) throw error
      
      if (data?.data) {
        setPlans(data.data)
      }
    } catch (error) {
      console.error('Error fetching plans:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpgrade = async (planId: string) => {
    if (planId === 'free') return
    
    try {
      const { data, error } = await supabase.functions.invoke('subscription-create', {
        body: {
          plan_type: planId,
          user_id: 'demo_user'
        }
      })
      
      if (error) throw error
      
      alert('Subscription created successfully! In production implementation, this will redirect to payment gateway.')
    } catch (error) {
      console.error('Error creating subscription:', error)
      alert('Failed to create subscription')
    }
  }

  if (loading) {
    return (
      <div className="pt-24 px-4 max-w-7xl mx-auto">
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-96 bg-card rounded-lg"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="pt-24 px-4 max-w-7xl mx-auto pb-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">
          Choose the <span className="gradient-text">Right Plan</span>
        </h1>
        <p className="text-muted-foreground text-lg">
          Start free, upgrade when you need more features
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`bg-card border rounded-lg p-8 relative ${
              plan.popular
                ? 'border-primary shadow-lg scale-105'
                : 'border-border'
            } hover:border-primary/50 transition-all`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-primary text-white px-4 py-1 rounded-full text-sm font-semibold">
                  Popular
                </span>
              </div>
            )}

            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-lg bg-gradient-primary flex items-center justify-center">
                {plan.id === 'free' && <Zap className="w-8 h-8 text-white" />}
                {plan.id === 'premium' && <Crown className="w-8 h-8 text-white" />}
                {plan.id === 'professional' && <Crown className="w-8 h-8 text-white" />}
              </div>
              
              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              
              <div className="mb-2">
                <span className="text-4xl font-bold">${plan.price}</span>
                {plan.price > 0 && (
                  <span className="text-muted-foreground">/{plan.period}</span>
                )}
              </div>
              
              {plan.price === 0 && (
                <span className="text-sm text-muted-foreground">Forever free</span>
              )}
            </div>

            <ul className="space-y-3 mb-8">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-success" />
                  </div>
                  <span className="text-sm text-muted-foreground">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleUpgrade(plan.id)}
              className={`w-full py-3 rounded-lg font-semibold transition-all ${
                plan.popular
                  ? 'bg-gradient-primary text-white hover:opacity-90'
                  : plan.id === 'free'
                  ? 'bg-muted text-foreground hover:bg-muted/80'
                  : 'bg-primary text-white hover:bg-primary/90'
              }`}
            >
              {plan.id === 'free' ? 'Current Plan' : 'Upgrade'}
            </button>
          </div>
        ))}
      </div>

      <div className="bg-card border border-border rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-6 text-center">Feature Comparison</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-border">
              <tr>
                <th className="text-left pb-4 font-semibold">Feature</th>
                {plans.map(plan => (
                  <th key={plan.id} className="text-center pb-4 font-semibold">{plan.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border/50">
                <td className="py-4">Max Wallets</td>
                {plans.map(plan => (
                  <td key={plan.id} className="py-4 text-center">
                    {plan.limits.maxWallets === -1 ? 'Unlimited' : plan.limits.maxWallets}
                  </td>
                ))}
              </tr>
              <tr className="border-b border-border/50">
                <td className="py-4">Max Alerts</td>
                {plans.map(plan => (
                  <td key={plan.id} className="py-4 text-center">
                    {plan.limits.maxAlerts === -1 ? 'Unlimited' : plan.limits.maxAlerts}
                  </td>
                ))}
              </tr>
              <tr className="border-b border-border/50">
                <td className="py-4">Data Retention</td>
                {plans.map(plan => (
                  <td key={plan.id} className="py-4 text-center">
                    {plan.limits.dataRetention} days
                  </td>
                ))}
              </tr>
              <tr className="border-b border-border/50">
                <td className="py-4">API Access</td>
                {plans.map(plan => (
                  <td key={plan.id} className="py-4 text-center">
                    {plan.limits.apiAccess ? (
                      <Check className="w-5 h-5 text-success mx-auto" />
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-12 text-center">
        <h3 className="text-xl font-semibold mb-4">Need a custom plan for enterprise?</h3>
        <p className="text-muted-foreground mb-6">
          Contact our sales team for enterprise solutions with custom features and dedicated support
        </p>
        <a
          href="mailto:sales@polymatrix.io"
          className="inline-block px-8 py-3 bg-gradient-primary text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
        >
          Contact Sales
        </a>
      </div>
    </div>
  )
}
