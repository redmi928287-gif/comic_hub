import mongoose from 'mongoose'

const adSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  thumbnail: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  position: {
    type: String,
    enum: ['top', 'sidebar', 'bottom'],
    default: 'sidebar',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

export default mongoose.models.Ad || mongoose.model('Ad', adSchema) 