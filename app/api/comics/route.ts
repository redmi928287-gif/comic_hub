import { NextRequest, NextResponse } from 'next/server'
import connectDB from '../../lib/mongodb'
import Comic from '../../models/Comic'

export async function GET() {
  try {
    await connectDB()
    
    const comics = await Comic.find({ isPublished: true })
      .sort({ createdAt: -1 })
      .limit(50)

    return NextResponse.json(comics)
  } catch (error) {
    console.error('Error fetching comics:', error)
    return NextResponse.json(
      { message: 'Failed to fetch comics' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    
    const { title, description, thumbnail, comicLink, genre } = await request.json()

    // Generate random views between 5k to 9k
    const views = Math.floor(Math.random() * (9000 - 5000 + 1)) + 5000

    const comic = new Comic({
      title,
      description,
      thumbnail,
      comicLink,
      genre,
      views,
      isPublished: true,
    })

    await comic.save()

    return NextResponse.json(
      { message: 'Comic created successfully', comic },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating comic:', error)
    return NextResponse.json(
      { message: 'Failed to create comic' },
      { status: 500 }
    )
  }
} 