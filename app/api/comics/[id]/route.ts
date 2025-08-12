import { NextRequest, NextResponse } from 'next/server'
import connectDB from '../../../lib/mongodb'
import Comic from '../../../models/Comic'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()
    
    const { id } = params
    const updates = await request.json()

    const comic = await Comic.findByIdAndUpdate(
      id,
      { ...updates, updatedAt: new Date() },
      { new: true }
    )

    if (!comic) {
      return NextResponse.json(
        { message: 'Comic not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(comic)
  } catch (error) {
    console.error('Error updating comic:', error)
    return NextResponse.json(
      { message: 'Failed to update comic' },
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

    const comic = await Comic.findByIdAndDelete(id)

    if (!comic) {
      return NextResponse.json(
        { message: 'Comic not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { message: 'Comic deleted successfully' }
    )
  } catch (error) {
    console.error('Error deleting comic:', error)
    return NextResponse.json(
      { message: 'Failed to delete comic' },
      { status: 500 }
    )
  }
} 