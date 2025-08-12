import Header from './components/Header'
import Dashboard from './components/Dashboard'
import PremiumBanner from './components/PremiumBanner'
import AdBanner from './components/AdBanner'
import ComicCard from './components/ComicCard'
import { BookOpen, TrendingUp, Star } from 'lucide-react'

// Mock data for demonstration
const featuredComics = [
  {
    id: '1',
    title: 'The Amazing Adventures',
    description: 'An epic journey through fantastical worlds filled with magic and mystery.',
    thumbnail: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop',
    comicLink: 'https://example.com/comic1',
    genre: ['Adventure', 'Fantasy'],
    views: Math.floor(Math.random() * (9000 - 5000 + 1)) + 5000,
  },
  {
    id: '2',
    title: 'Cyberpunk Chronicles',
    description: 'A futuristic tale of technology, rebellion, and human resilience.',
    thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=400&fit=crop',
    comicLink: 'https://example.com/comic2',
    genre: ['Sci-Fi', 'Action'],
    views: Math.floor(Math.random() * (9000 - 5000 + 1)) + 5000,
  },
  {
    id: '3',
    title: 'Mystery Manor',
    description: 'A haunted mansion holds secrets that will change everything.',
    thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    comicLink: 'https://example.com/comic3',
    genre: ['Horror', 'Mystery'],
    views: Math.floor(Math.random() * (9000 - 5000 + 1)) + 5000,
  },
  {
    id: '4',
    title: 'Superhero Origins',
    description: 'The birth of legends and the rise of extraordinary powers.',
    thumbnail: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop',
    comicLink: 'https://example.com/comic4',
    genre: ['Superhero', 'Action'],
    views: Math.floor(Math.random() * (9000 - 5000 + 1)) + 5000,
  },
  {
    id: '5',
    title: 'Romance in Paris',
    description: 'A love story that transcends time and distance.',
    thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    comicLink: 'https://example.com/comic5',
    genre: ['Romance', 'Drama'],
    views: Math.floor(Math.random() * (9000 - 5000 + 1)) + 5000,
  },
  {
    id: '6',
    title: 'Space Explorers',
    description: 'Venturing into the unknown reaches of the cosmos.',
    thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=400&fit=crop',
    comicLink: 'https://example.com/comic6',
    genre: ['Sci-Fi', 'Adventure'],
    views: Math.floor(Math.random() * (9000 - 5000 + 1)) + 5000,
  },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Top Ad Banner */}
        <AdBanner position="top" />
        
        {/* Dashboard */}
        <Dashboard />
        
        {/* Premium Banner */}
        <PremiumBanner />
        
        {/* Hero Section */}
        <section className="text-center mb-12">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Welcome to{' '}
              <span className="text-primary">Comic Hub</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Discover amazing stories, epic adventures, and unforgettable characters in our vast collection of comics.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn-primary text-lg px-8 py-3">
                <BookOpen className="h-5 w-5 mr-2 inline" />
                Start Reading
              </button>
              <button className="btn-secondary text-lg px-8 py-3">
                <TrendingUp className="h-5 w-5 mr-2 inline" />
                Trending Now
              </button>
            </div>
          </div>
        </section>
        
        {/* Featured Comics */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900 flex items-center">
              <Star className="h-8 w-8 text-yellow-500 mr-3" />
              Featured Comics
            </h2>
            <a href="/comics" className="text-primary hover:text-secondary font-semibold">
              View All →
            </a>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredComics.map((comic) => (
              <ComicCard key={comic.id} comic={comic} />
            ))}
          </div>
        </section>
        
        {/* Bottom Ad Banner */}
        <AdBanner position="bottom" />
      </main>
    </div>
  )
} 