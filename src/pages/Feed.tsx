import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { formatDistanceToNow } from 'date-fns'
import { enUS } from 'date-fns/locale'
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight } from 'lucide-react'

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

export function Feed() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTransactions()
    
    // Set up real-time subscription
    const subscription = supabase
      .channel('crypto_transactions_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'crypto_transactions'
      }, () => {
        fetchTransactions()
      })
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const fetchTransactions = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('feed', {
        body: {}
      })
      
      if (error) throw error
      
      if (data?.data) {
        setTransactions(data.data)
      }
    } catch (error) {
      console.error('Error fetching transactions:', error)
    } finally {
      setLoading(false)
    }
  }

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
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
          <span className="gradient-text">Real-time</span> Activity Feed
        </h1>
        <p className="text-muted-foreground">Monitor latest wallet transaction activity</p>
      </div>

      <div className="space-y-3">
        {transactions.map((tx) => (
          <div
            key={tx.id}
            className="bg-card border border-border rounded-lg p-4 hover:border-primary/50 transition-all card-hover"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 flex-1">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  tx.transaction_type === 'BUY' ? 'bg-success/10' : 'bg-destructive/10'
                }`}>
                  {tx.transaction_type === 'BUY' ? (
                    <TrendingUp className="w-6 h-6 text-success" />
                  ) : (
                    <TrendingDown className="w-6 h-6 text-destructive" />
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-mono text-sm text-muted-foreground">
                      {truncateAddress(tx.wallet_address)}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                      tx.transaction_type === 'BUY'
                        ? 'bg-success/10 text-success'
                        : 'bg-destructive/10 text-destructive'
                    }`}>
                      {tx.transaction_type}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm">
                    <span className="font-semibold text-foreground">{tx.pair}</span>
                    <span className="text-muted-foreground">
                      Volume: ${tx.volume.toLocaleString()}
                    </span>
                    <span className="text-muted-foreground">
                      Price: ${tx.price.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  {tx.profit !== null && (
                    <div className={`flex items-center gap-1 justify-end mb-1 ${
                      tx.profit > 0 ? 'text-success' : 'text-destructive'
                    }`}>
                      {tx.profit > 0 ? (
                        <ArrowUpRight className="w-4 h-4" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4" />
                      )}
                      <span className="font-semibold">
                        ${Math.abs(tx.profit).toLocaleString()}
                      </span>
                    </div>
                  )}
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(tx.timestamp), {
                      addSuffix: true,
                      locale: enUS
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
