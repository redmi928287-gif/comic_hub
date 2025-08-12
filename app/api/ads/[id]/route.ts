import { NextRequest, NextResponse } from 'next/server'
import connectDB from '../../../lib/mongodb'
import Ad from '../../../models/Ad'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()
    
    const { id } = params
    const updates = await request.json()

    const ad = await Ad.findByIdAndUpdate(
      id,
      { ...updates, updatedAt: new Date() },
      { new: true }
    )

    if (!ad) {
      return NextResponse.json(
        { message: 'Ad not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(ad)
  } catch (error) {
    console.error('Error updating ad:', error)
    return NextResponse.json(
      { message: 'Failed to update ad' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()
    
    const { id } = params

    const ad = await Ad.findByIdAndDelete(id)

    if (!ad) {
      return NextResponse.json(
        { message: 'Ad not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { message: 'Ad deleted successfully' }
    )
  } catch (error) {
    console.error('Error deleting ad:', error)
    return NextResponse.json(
      { message: 'Failed to delete ad' },
      { status: 500 }
    )
  }
} 