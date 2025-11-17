import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { TrendingUp, TrendingDown, DollarSign, Activity, BarChart3 } from 'lucide-react'

interface MarketCoin {
  symbol: string
  name: string
  price: number
  price_change_24h: number
  volume_24h: number
  market_cap: number
}

interface MarketOverview {
  totalMarketCap: number
  totalVolume24h: number
  btcDominance: number
  totalCoins: number
}

export function Market() {
  const [overview, setOverview] = useState<MarketOverview | null>(null)
  const [topGainers, setTopGainers] = useState<MarketCoin[]>([])
  const [topLosers, setTopLosers] = useState<MarketCoin[]>([])
  const [allCoins, setAllCoins] = useState<MarketCoin[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchMarketData()
  }, [])

  const fetchMarketData = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('market-overview', {
        body: {}
      })
      
      if (error) throw error
      
      if (data?.data) {
        setOverview(data.data.overview)
        setTopGainers(data.data.topGainers)
        setTopLosers(data.data.topLosers)
        setAllCoins(data.data.allCoins)
      }
    } catch (error) {
      console.error('Error fetching market data:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredCoins = allCoins.filter(coin => 
    coin.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
    coin.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const formatNumber = (num: number) => {
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`
    return `$${num.toLocaleString()}`
  }

  if (loading) {
    return (
      <div className="pt-24 px-4 max-w-7xl mx-auto">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-24 bg-card rounded-lg"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="pt-24 px-4 max-w-7xl mx-auto pb-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">
          <span className="gradient-text">Market</span> Dashboard
        </h1>
        <p className="text-muted-foreground">Real-time cryptocurrency market overview and analytics</p>
      </div>

      {overview && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-primary" />
              </div>
              <div className="text-sm text-muted-foreground">Total Market Cap</div>
            </div>
            <div className="text-2xl font-bold">
              {formatNumber(overview.totalMarketCap)}
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                <Activity className="w-5 h-5 text-secondary" />
              </div>
              <div className="text-sm text-muted-foreground">24h Volume</div>
            </div>
            <div className="text-2xl font-bold">
              {formatNumber(overview.totalVolume24h)}
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-accent" />
              </div>
              <div className="text-sm text-muted-foreground">BTC Dominance</div>
            </div>
            <div className="text-2xl font-bold">
              {overview.btcDominance.toFixed(2)}%
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-success" />
              </div>
              <div className="text-sm text-muted-foreground">Total Coins</div>
            </div>
            <div className="text-2xl font-bold">
              {overview.totalCoins}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-success" />
            Top Gainers 24h
          </h3>
          <div className="space-y-3">
            {topGainers.map((coin) => (
              <div key={coin.symbol} className="flex items-center justify-between p-3 bg-success/5 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="font-semibold">{coin.symbol}</div>
                  <div className="text-sm text-muted-foreground">{coin.name}</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">${parseFloat(coin.price.toString()).toLocaleString()}</div>
                  <div className="text-sm text-success">+{coin.price_change_24h}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <TrendingDown className="w-5 h-5 text-destructive" />
            Top Losers 24h
          </h3>
          <div className="space-y-3">
            {topLosers.map((coin) => (
              <div key={coin.symbol} className="flex items-center justify-between p-3 bg-destructive/5 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="font-semibold">{coin.symbol}</div>
                  <div className="text-sm text-muted-foreground">{coin.name}</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">${parseFloat(coin.price.toString()).toLocaleString()}</div>
                  <div className="text-sm text-destructive">{coin.price_change_24h}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold">All Cryptocurrencies</h3>
          <input
            type="text"
            placeholder="Search coin..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-border">
              <tr className="text-left">
                <th className="pb-3 font-semibold">Coin</th>
                <th className="pb-3 font-semibold text-right">Price</th>
                <th className="pb-3 font-semibold text-right">24h Change</th>
                <th className="pb-3 font-semibold text-right">Volume 24h</th>
                <th className="pb-3 font-semibold text-right">Market Cap</th>
              </tr>
            </thead>
            <tbody>
              {filteredCoins.map((coin) => (
                <tr key={coin.symbol} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="font-semibold">{coin.symbol}</div>
                      <div className="text-sm text-muted-foreground">{coin.name}</div>
                    </div>
                  </td>
                  <td className="py-4 text-right font-semibold">
                    ${parseFloat(coin.price.toString()).toLocaleString()}
                  </td>
                  <td className={`py-4 text-right font-semibold ${
                    parseFloat(coin.price_change_24h.toString()) > 0 ? 'text-success' : 'text-destructive'
                  }`}>
                    {parseFloat(coin.price_change_24h.toString()) > 0 ? '+' : ''}{coin.price_change_24h}%
                  </td>
                  <td className="py-4 text-right">
                    {formatNumber(parseFloat(coin.volume_24h.toString()))}
                  </td>
                  <td className="py-4 text-right">
                    {formatNumber(parseFloat(coin.market_cap.toString()))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
