import { NextRequest, NextResponse } from 'next/server'
import connectDB from '../../lib/mongodb'
import Stats from '../../models/Stats'

export async function GET() {
  try {
    await connectDB()
    
    // Get or create stats
    let stats = await Stats.findOne()
    
    if (!stats) {
      stats = new Stats({
        totalUsers: 66472,
        dailyViews: Math.floor(Math.random() * (3000 - 1000 + 1)) + 1000,
        onlineUsers: Math.floor(Math.random() * (4000 - 2000 + 1)) + 2000,
      })
      await stats.save()
    } else {
      // Update random stats
      stats.dailyViews = Math.floor(Math.random() * (3000 - 1000 + 1)) + 1000
      stats.onlineUsers = Math.floor(Math.random() * (4000 - 2000 + 1)) + 2000
      stats.lastUpdated = new Date()
      await stats.save()
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json(
      { message: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
} 