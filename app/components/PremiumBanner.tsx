'use client'

import { Crown, ArrowRight } from 'lucide-react'

export default function PremiumBanner() {
  const handlePremiumClick = () => {
    window.open('https://t.me/beast_is_kum', '_blank')
  }

  return (
    <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-4 rounded-lg shadow-lg mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Crown className="h-6 w-6 text-white" />
          <div>
            <h3 className="text-white font-bold text-lg">Upgrade to Premium!</h3>
            <p className="text-white text-sm opacity-90">
              Get exclusive access to premium comics and features
            </p>
          </div>
        </div>
        <button
          onClick={handlePremiumClick}
          className="bg-white text-orange-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center space-x-2"
        >
          <span>Get Premium</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
} 