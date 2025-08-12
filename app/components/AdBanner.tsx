'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'

interface Ad {
  id: string
  title: string
  thumbnail: string
  link: string
  position: string
}

interface AdBannerProps {
  position: 'top' | 'sidebar' | 'bottom'
}

export default function AdBanner({ position }: AdBannerProps) {
  const [ads, setAds] = useState<Ad[]>([])
  const [currentAdIndex, setCurrentAdIndex] = useState(0)

  useEffect(() => {
    // Fetch ads from API
    const fetchAds = async () => {
      try {
        const response = await fetch('/api/ads')
        const data = await response.json()
        const filteredAds = data.filter((ad: Ad) => ad.position === position && ad.isActive)
        setAds(filteredAds)
      } catch (error) {
        console.error('Error fetching ads:', error)
      }
    }

    fetchAds()
  }, [position])

  useEffect(() => {
    if (ads.length > 1) {
      const interval = setInterval(() => {
        setCurrentAdIndex((prev) => (prev + 1) % ads.length)
      }, 5000) // Change ad every 5 seconds

      return () => clearInterval(interval)
    }
  }, [ads.length])

  if (ads.length === 0) {
    return null
  }

  const currentAd = ads[currentAdIndex]

  const handleAdClick = () => {
    window.open(currentAd.link, '_blank')
  }

  const getPositionClasses = () => {
    switch (position) {
      case 'top':
        return 'w-full h-32 mb-6'
      case 'sidebar':
        return 'w-full h-64 mb-6'
      case 'bottom':
        return 'w-full h-32 mt-6'
      default:
        return 'w-full h-32'
    }
  }

  return (
    <div className={`${getPositionClasses()} relative overflow-hidden rounded-lg shadow-lg cursor-pointer`}>
      <div
        onClick={handleAdClick}
        className="w-full h-full relative group"
      >
        <Image
          src={currentAd.thumbnail}
          alt={currentAd.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-300" />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
          <h3 className="text-white font-semibold text-sm">{currentAd.title}</h3>
        </div>
        
        {/* Ad indicator */}
        <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
          Ad
        </div>
      </div>

      {/* Ad navigation dots */}
      {ads.length > 1 && (
        <div className="absolute bottom-2 right-2 flex space-x-1">
          {ads.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentAdIndex(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentAdIndex ? 'bg-white' : 'bg-white bg-opacity-50'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
} 