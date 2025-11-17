import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'

interface FAQItem {
  question: string
  answer: string
}

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const faqs: FAQItem[] = [
    {
      question: "How does PolyMatrix work?",
      answer: "PolyMatrix monitors crypto wallet activity in real-time by collecting transaction data from the blockchain. Our system analyzes trading patterns, calculates ROI, win rate, and other performance metrics to provide deep insights into wallet trading strategies."
    },
    {
      question: "Where does transaction data come from?",
      answer: "Transaction data comes from public blockchains through node APIs that we maintain. All data is on-chain and can be independently verified. We also integrate data from centralized exchanges for more comprehensive analytics."
    },
    {
      question: "How is ROI calculated?",
      answer: "ROI (Return on Investment) is calculated with the formula: (Total Profit / Initial Investment) × 100%. We track every entry and exit point of trading positions, calculate realized profit/loss, and accumulate the results to get the wallet's cumulative ROI."
    },
    {
      question: "What is Win Rate?",
      answer: "Win Rate is the percentage of profitable transactions out of total transactions. Calculated as: (Number of Profitable Trades / Total Trades) × 100%. This metric helps identify the consistency of wallet trading strategies."
    },
    {
      question: "How to set up alerts?",
      answer: "Navigate to the Alerts page, click 'Create New Alert', select alert type (volume threshold or specific wallet), and set parameters as needed. Alerts will be active immediately after creation and will provide notifications when conditions are met."
    },
    {
      question: "What's the difference between Free vs Premium?",
      answer: "Free tier provides basic access with limits of 5 wallet tracking, 3 alerts, and 24h data retention. Premium provides unlimited wallet tracking, 30 days historical data, advanced analytics, unlimited alerts, data export, and API access. Professional tier adds 90 days retention, custom alerts, and webhook notifications."
    },
    {
      question: "How to upgrade to Premium?",
      answer: "Click the 'Pricing' menu, select the appropriate plan, and click 'Upgrade'. You will be directed to a secure payment page. After successful payment, your account will be automatically upgraded and all premium features will be immediately available."
    },
    {
      question: "How long is historical data available?",
      answer: "Depends on your plan: Free (24 hours), Premium (30 days), Professional (90 days). Data older than the retention period will be archived and can be requested specifically for Professional plan users."
    },
    {
      question: "Is the data real-time?",
      answer: "Yes, transaction feed is updated in real-time using WebSocket connection. Market data is refreshed every 30 seconds, and wallet statistics are updated every minute. Average latency is < 2 seconds from blockchain confirmation."
    },
    {
      question: "How to read wallet ranking?",
      answer: "Rankings are sorted by highest ROI. Each wallet displays ROI, Win Rate, Total Profit, and number of Trades. Click on a wallet to see complete details including transaction history and strategy patterns."
    }
  ]

  return (
    <div className="pt-24 px-4 max-w-4xl mx-auto pb-12">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-4">
          <span className="gradient-text">Frequently Asked</span> Questions
        </h1>
        <p className="text-muted-foreground text-lg">
          Find answers to common questions about PolyMatrix
        </p>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="bg-card border border-border rounded-lg overflow-hidden transition-all"
          >
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <HelpCircle className="w-5 h-5 text-primary" />
                <span className="font-semibold text-left">{faq.question}</span>
              </div>
              {openIndex === index ? (
                <ChevronUp className="w-5 h-5 text-muted-foreground" />
              ) : (
                <ChevronDown className="w-5 h-5 text-muted-foreground" />
              )}
            </button>
            
            {openIndex === index && (
              <div className="px-6 pb-4 text-muted-foreground animate-slide-up">
                <p className="leading-relaxed">{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-12 bg-gradient-primary rounded-lg p-8 text-center">
        <h3 className="text-2xl font-bold text-white mb-3">Still have questions?</h3>
        <p className="text-white/90 mb-6">
          Our support team is ready to help you 24/7
        </p>
        <a
          href="mailto:support@polymatrix.io"
          className="inline-block px-8 py-3 bg-white text-primary rounded-lg font-semibold hover:bg-white/90 transition-colors"
        >
          Contact Support
        </a>
      </div>
    </div>
  )
}
