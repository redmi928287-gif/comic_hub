'use client'

import { useState, useEffect } from 'react'
import { Users, Eye, TrendingUp, Activity } from 'lucide-react'

interface Stats {
  totalUsers: number
  dailyViews: number
  onlineUsers: number
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 66472,
    dailyViews: 0,
    onlineUsers: 0,
  })

  useEffect(() => {
    // Generate random stats on component mount
    const generateRandomStats = () => {
      const dailyViews = Math.floor(Math.random() * (3000 - 1000 + 1)) + 1000
      const onlineUsers = Math.floor(Math.random() * (4000 - 2000 + 1)) + 2000
      
      setStats(prev => ({
        ...prev,
        dailyViews,
        onlineUsers,
      }))
    }

    generateRandomStats()

    // Update stats every 30 seconds
    const interval = setInterval(generateRandomStats, 30000)

    return () => clearInterval(interval)
  }, [])

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers.toLocaleString(),
      icon: Users,
      color: 'bg-blue-500',
      textColor: 'text-blue-500',
    },
    {
      title: 'Daily Views',
      value: stats.dailyViews.toLocaleString(),
      icon: Eye,
      color: 'bg-green-500',
      textColor: 'text-green-500',
    },
    {
      title: 'Online Users',
      value: stats.onlineUsers.toLocaleString(),
      icon: Activity,
      color: 'bg-purple-500',
      textColor: 'text-purple-500',
    },
    {
      title: 'Growth Rate',
      value: '+12.5%',
      icon: TrendingUp,
      color: 'bg-orange-500',
      textColor: 'text-orange-500',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statCards.map((stat, index) => (
        <div key={index} className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
            <div className={`p-3 rounded-full ${stat.color}`}>
              <stat.icon className="h-6 w-6 text-white" />
            </div>
          </div>
          
          {/* Animated progress bar */}
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${stat.color} transition-all duration-1000 ease-out`}
                style={{ width: `${Math.random() * 100}%` }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
} 