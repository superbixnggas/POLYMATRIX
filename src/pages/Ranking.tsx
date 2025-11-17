import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Trophy, TrendingUp, Activity, DollarSign } from 'lucide-react'

interface Wallet {
  id: string
  address: string
  roi: number
  win_rate: number
  total_profit: number
  trade_count: number
  last_activity: string
}

export function Ranking() {
  const [wallets, setWallets] = useState<Wallet[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRanking()
  }, [])

  const fetchRanking = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('wallets-ranking', {
        body: {}
      })
      
      if (error) throw error
      
      if (data?.data) {
        setWallets(data.data)
      }
    } catch (error) {
      console.error('Error fetching ranking:', error)
    } finally {
      setLoading(false)
    }
  }

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 8)}...${address.slice(-6)}`
  }

  const getRankBadge = (index: number) => {
    const colors = [
      'bg-gradient-to-r from-yellow-500 to-yellow-600',
      'bg-gradient-to-r from-gray-400 to-gray-500',
      'bg-gradient-to-r from-orange-600 to-orange-700',
    ]
    return colors[index] || 'bg-gradient-primary'
  }

  if (loading) {
    return (
      <div className="pt-24 px-4 max-w-7xl mx-auto">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-32 bg-card rounded-lg"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="pt-24 px-4 max-w-7xl mx-auto pb-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">
          <span className="gradient-text">Wallet</span> Performance Ranking
        </h1>
        <p className="text-muted-foreground">Top wallets with best performance based on ROI</p>
      </div>

      <div className="grid gap-4">
        {wallets.map((wallet, index) => (
          <Link
            key={wallet.id}
            to={`/wallet/${wallet.address}`}
            className="block"
          >
            <div className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-all card-hover">
              <div className="flex items-center gap-6">
                <div className={`w-16 h-16 rounded-lg ${getRankBadge(index)} flex items-center justify-center text-white font-bold text-2xl`}>
                  {index < 3 ? <Trophy className="w-8 h-8" /> : index + 1}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-mono text-lg font-semibold">
                      {truncateAddress(wallet.address)}
                    </span>
                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-semibold">
                      Rank #{index + 1}
                    </span>
                  </div>

                  <div className="grid grid-cols-4 gap-6">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-success" />
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">ROI</div>
                        <div className="text-lg font-bold text-success">
                          +{wallet.roi}%
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Activity className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Win Rate</div>
                        <div className="text-lg font-bold">
                          {wallet.win_rate}%
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                        <DollarSign className="w-5 h-5 text-accent" />
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Total Profit</div>
                        <div className="text-lg font-bold">
                          ${wallet.total_profit.toLocaleString()}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                        <Activity className="w-5 h-5 text-secondary" />
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Trades</div>
                        <div className="text-lg font-bold">
                          {wallet.trade_count}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
