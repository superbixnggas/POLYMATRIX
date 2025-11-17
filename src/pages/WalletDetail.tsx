import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { formatDistanceToNow } from 'date-fns'
import { enUS } from 'date-fns/locale'
import { 
  ArrowLeft, TrendingUp, TrendingDown, Activity, 
  DollarSign, Target, Clock 
} from 'lucide-react'

interface Wallet {
  address: string
  roi: number
  win_rate: number
  total_profit: number
  trade_count: number
  last_activity: string
}

interface Transaction {
  id: string
  wallet_address: string
  timestamp: string
  pair: string
  volume: number
  price: number
  transaction_type: 'BUY' | 'SELL'
  hash: string
  profit: number | null
}

export function WalletDetail() {
  const { address } = useParams<{ address: string }>()
  const [wallet, setWallet] = useState<Wallet | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (address) {
      fetchWalletDetails()
      fetchTransactionHistory()
    }
  }, [address])

  const fetchWalletDetails = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('wallet-details', {
        body: { address }
      })
      
      if (error) throw error
      
      if (data?.data) {
        setWallet(data.data)
      }
    } catch (error) {
      console.error('Error fetching wallet details:', error)
    }
  }

  const fetchTransactionHistory = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('wallet-history', {
        body: { address }
      })
      
      if (error) throw error
      
      if (data?.data) {
        setTransactions(data.data)
      }
    } catch (error) {
      console.error('Error fetching transaction history:', error)
    } finally {
      setLoading(false)
    }
  }

  const truncateHash = (hash: string) => {
    return `${hash.slice(0, 10)}...${hash.slice(-8)}`
  }

  if (loading) {
    return (
      <div className="pt-24 px-4 max-w-7xl mx-auto">
        <div className="animate-pulse">
          <div className="h-12 bg-card rounded-lg mb-8 w-1/3"></div>
          <div className="grid grid-cols-4 gap-4 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-card rounded-lg"></div>
            ))}
          </div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-24 bg-card rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!wallet) {
    return (
      <div className="pt-24 px-4 max-w-7xl mx-auto">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Wallet not found</p>
          <Link to="/ranking" className="text-primary hover:underline mt-4 inline-block">
            Back to Ranking
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-24 px-4 max-w-7xl mx-auto pb-12">
      <Link
        to="/ranking"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Ranking
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 font-mono">{address}</h1>
        <p className="text-muted-foreground">Complete wallet performance details</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-success" />
            </div>
            <div className="text-sm text-muted-foreground">ROI</div>
          </div>
          <div className="text-3xl font-bold text-success">
            +{wallet.roi}%
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Target className="w-6 h-6 text-primary" />
            </div>
            <div className="text-sm text-muted-foreground">Win Rate</div>
          </div>
          <div className="text-3xl font-bold">
            {wallet.win_rate}%
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-accent" />
            </div>
            <div className="text-sm text-muted-foreground">Total Profit</div>
          </div>
          <div className="text-3xl font-bold">
            ${wallet.total_profit.toLocaleString()}
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center">
              <Activity className="w-6 h-6 text-secondary" />
            </div>
            <div className="text-sm text-muted-foreground">Total Trades</div>
          </div>
          <div className="text-3xl font-bold">
            {wallet.trade_count}
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Transaction History</h2>
        
        {transactions.length === 0 ? (
          <div className="bg-card border border-border rounded-lg p-12 text-center">
            <p className="text-muted-foreground">No transactions found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className="bg-card border border-border rounded-lg p-4 hover:border-primary/50 transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      tx.transaction_type === 'BUY' ? 'bg-success/10' : 'bg-destructive/10'
                    }`}>
                      {tx.transaction_type === 'BUY' ? (
                        <TrendingUp className="w-5 h-5 text-success" />
                      ) : (
                        <TrendingDown className="w-5 h-5 text-destructive" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{tx.pair}</span>
                        <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                          tx.transaction_type === 'BUY'
                            ? 'bg-success/10 text-success'
                            : 'bg-destructive/10 text-destructive'
                        }`}>
                          {tx.transaction_type}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground font-mono">
                        {truncateHash(tx.hash)}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="flex items-center gap-2 justify-end text-sm text-muted-foreground mb-1">
                      <Clock className="w-3 h-3" />
                      {formatDistanceToNow(new Date(tx.timestamp), {
                        addSuffix: true,
                        locale: enUS
                      })}
                    </div>
                    {tx.profit !== null && (
                      <div className={`font-semibold ${
                        tx.profit > 0 ? 'text-success' : 'text-destructive'
                      }`}>
                        {tx.profit > 0 ? '+' : ''}${tx.profit.toLocaleString()}
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Volume: </span>
                    <span className="font-semibold">${tx.volume.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Price: </span>
                    <span className="font-semibold">${tx.price.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
