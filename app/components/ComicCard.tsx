'use client'

import Image from 'next/image'
import { Eye, ExternalLink } from 'lucide-react'

interface Comic {
  id: string
  title: string
  description: string
  thumbnail: string
  comicLink: string
  genre: string[]
  views: number
}

interface ComicCardProps {
  comic: Comic
}

export default function ComicCard({ comic }: ComicCardProps) {
  const handleComicClick = () => {
    window.open(comic.comicLink, '_blank')
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-64 overflow-hidden">
        <Image
          src={comic.thumbnail}
          alt={comic.title}
          fill
          className="object-cover hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
          {comic.genre[0] || 'Comic'}
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {comic.title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-3">
          {comic.description}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-gray-500 text-sm">
            <Eye className="h-4 w-4" />
            <span>{comic.views.toLocaleString()}</span>
          </div>
          
          <button
            onClick={handleComicClick}
            className="bg-primary text-white px-3 py-1 rounded text-sm hover:bg-secondary transition-colors flex items-center space-x-1"
          >
            <span>Read</span>
            <ExternalLink className="h-3 w-3" />
          </button>
        </div>
        
        {comic.genre.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {comic.genre.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 