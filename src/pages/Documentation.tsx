import { FileText, Code, Calculator, BookOpen, Wrench } from 'lucide-react'

export function Documentation() {
  return (
    <div className="pt-24 px-4 max-w-5xl mx-auto pb-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">
          <span className="gradient-text">Documentation</span>
        </h1>
        <p className="text-muted-foreground text-lg">
          Complete guide to using PolyMatrix
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-all card-hover">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
            <FileText className="w-6 h-6 text-primary" />
          </div>
          <h3 className="text-xl font-bold mb-2">Quick Start Guide</h3>
          <p className="text-muted-foreground mb-4">
            Get started with PolyMatrix in 5 minutes
          </p>
          <a href="#quickstart" className="text-primary hover:underline font-semibold">
            Read more →
          </a>
        </div>

        <div className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-all card-hover">
          <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-4">
            <Code className="w-6 h-6 text-secondary" />
          </div>
          <h3 className="text-xl font-bold mb-2">API Documentation</h3>
          <p className="text-muted-foreground mb-4">
            Integrate PolyMatrix with your application
          </p>
          <a href="#api" className="text-primary hover:underline font-semibold">
            Read more →
          </a>
        </div>

        <div className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-all card-hover">
          <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
            <Calculator className="w-6 h-6 text-accent" />
          </div>
          <h3 className="text-xl font-bold mb-2">Calculation Methods</h3>
          <p className="text-muted-foreground mb-4">
            Understanding metrics and calculation formulas
          </p>
          <a href="#calculations" className="text-primary hover:underline font-semibold">
            Read more →
          </a>
        </div>

        <div className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-all card-hover">
          <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center mb-4">
            <BookOpen className="w-6 h-6 text-success" />
          </div>
          <h3 className="text-xl font-bold mb-2">Glossary</h3>
          <p className="text-muted-foreground mb-4">
            Definitions of important terms and concepts
          </p>
          <a href="#glossary" className="text-primary hover:underline font-semibold">
            Read more →
          </a>
        </div>
      </div>

      <div id="quickstart" className="bg-card border border-border rounded-lg p-8 mb-8">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
          <FileText className="w-6 h-6 text-primary" />
          Quick Start Guide
        </h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">1. Monitor Wallets</h3>
            <p className="text-muted-foreground leading-relaxed">
              Navigate to the Wallets page to view wallet rankings based on ROI. Click on a wallet to see detailed transaction and complete statistics.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">2. Real-time Feed</h3>
            <p className="text-muted-foreground leading-relaxed">
              The Feed page displays the latest transactions from all monitored wallets. Use this to identify trading patterns and opportunities.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">3. Setup Alerts</h3>
            <p className="text-muted-foreground leading-relaxed">
              Create alerts based on volume thresholds or specific wallets on the Alerts page. Alerts will provide real-time notifications when conditions are met.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">4. Market Dashboard</h3>
            <p className="text-muted-foreground leading-relaxed">
              Monitor overall crypto market conditions with the market dashboard. See top gainers, losers, and trending coins.
            </p>
          </div>
        </div>
      </div>

      <div id="calculations" className="bg-card border border-border rounded-lg p-8 mb-8">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
          <Calculator className="w-6 h-6 text-accent" />
          Calculation Methods
        </h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">ROI (Return on Investment)</h3>
            <div className="bg-muted/50 p-4 rounded-lg font-mono text-sm mb-2">
              ROI = (Total Profit / Initial Investment) × 100%
            </div>
            <p className="text-muted-foreground leading-relaxed">
              ROI measures investment effectiveness by comparing profit against initial capital. High ROI indicates a profitable trading strategy.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Win Rate</h3>
            <div className="bg-muted/50 p-4 rounded-lg font-mono text-sm mb-2">
              Win Rate = (Profitable Trades / Total Trades) × 100%
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Win rate measures consistency by calculating the percentage of profitable trades. High win rate indicates a reliable strategy.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Total Profit</h3>
            <div className="bg-muted/50 p-4 rounded-lg font-mono text-sm mb-2">
              Total Profit = Σ (Exit Price - Entry Price) × Position Size
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Total profit is the accumulation of all realized profit/loss from each closed position.
            </p>
          </div>
        </div>
      </div>

      <div id="glossary" className="bg-card border border-border rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
          <BookOpen className="w-6 h-6 text-success" />
          Glossary
        </h2>
        
        <div className="grid gap-4">
          <div className="border-b border-border pb-4">
            <h3 className="font-semibold mb-1">Wallet Address</h3>
            <p className="text-sm text-muted-foreground">
              Unique identifier for crypto wallets, usually in hexadecimal format (0x...)
            </p>
          </div>

          <div className="border-b border-border pb-4">
            <h3 className="font-semibold mb-1">Transaction Hash</h3>
            <p className="text-sm text-muted-foreground">
              Unique identifier for each transaction on the blockchain
            </p>
          </div>

          <div className="border-b border-border pb-4">
            <h3 className="font-semibold mb-1">Volume</h3>
            <p className="text-sm text-muted-foreground">
              Total value of the transaction in USD
            </p>
          </div>

          <div className="border-b border-border pb-4">
            <h3 className="font-semibold mb-1">Market Cap</h3>
            <p className="text-sm text-muted-foreground">
              Total value of all circulating coins (Price × Circulating Supply)
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-1">Position Size</h3>
            <p className="text-sm text-muted-foreground">
              Amount of assets traded in a single transaction
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
