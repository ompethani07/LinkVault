'use client'

import { useState, useEffect } from 'react'
import AdSense from './AdSense'

interface AdRewardModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function AdRewardModal({ isOpen, onClose, onSuccess }: AdRewardModalProps) {
  const [adLoaded, setAdLoaded] = useState(false)
  const [adError, setAdError] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setAdLoaded(false)
      setAdError(false)
    }
  }, [isOpen])

  const handleClaimReward = async () => {
    try {
      const response = await fetch('/api/ads/credit', {
        method: 'POST',
      })

      if (response.ok) {
        onSuccess()
        onClose()
      } else {
        alert('Failed to claim reward. Please try again.')
      }
    } catch (error) {
      console.error('Error claiming reward:', error)
      alert('An error occurred. Please try again.')
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-gray-900 border border-yellow-500/50 rounded-2xl p-8 max-w-md w-full shadow-2xl">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-white mb-3">Watch an Ad, Get More Links!</h3>
          <p className="text-gray-400 mb-4">
            To get 2 more free links, please watch the ad below.
          </p>
          
          <div className="bg-black aspect-video w-full rounded-lg flex items-center justify-center overflow-hidden relative">
            <AdSense adSlot="your-ad-slot-id" />
          </div>
        </div>

        <div className="flex space-x-4">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleClaimReward}
            disabled={!adLoaded || adError}
            className="flex-1 px-6 py-3 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold rounded-lg transition-colors disabled:bg-gray-500"
          >
            {adError ? 'Ad Failed' : 'Claim 2 Links'}
          </button>
        </div>
      </div>
    </div>
  )
}