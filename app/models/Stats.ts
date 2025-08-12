import mongoose from 'mongoose'

const statsSchema = new mongoose.Schema({
  totalUsers: {
    type: Number,
    default: 66472,
  },
  dailyViews: {
    type: Number,
    default: 0,
  },
  onlineUsers: {
    type: Number,
    default: 0,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
})

export default mongoose.models.Stats || mongoose.model('Stats', statsSchema) 