import { NextRequest, NextResponse } from 'next/server'
import connectDB from '../../lib/mongodb'
import Ad from '../../models/Ad'

export async function GET() {
  try {
    await connectDB()
    
    const ads = await Ad.find({ isActive: true })
      .sort({ createdAt: -1 })

    return NextResponse.json(ads)
  } catch (error) {
    console.error('Error fetching ads:', error)
    return NextResponse.json(
      { message: 'Failed to fetch ads' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    
    const { title, thumbnail, link, position } = await request.json()

    const ad = new Ad({
      title,
      thumbnail,
      link,
      position,
      isActive: true,
    })

    await ad.save()

    return NextResponse.json(
      { message: 'Ad created successfully', ad },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating ad:', error)
    return NextResponse.json(
      { message: 'Failed to create ad' },
      { status: 500 }
    )
  }
} 