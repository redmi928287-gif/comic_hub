const mongoose = require('mongoose');

const comicSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  thumbnail: {
    type: String,
    required: true
  },
  telegramLink: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^https:\/\/t\.me\/.+/.test(v);
      },
      message: 'Telegram link must be a valid t.me URL'
    }
  },
  category: {
    type: String,
    required: true,
    enum: ['action', 'adventure', 'comedy', 'drama', 'fantasy', 'horror', 'romance', 'sci-fi', 'thriller', 'other']
  },
  tags: [{
    type: String,
    trim: true
  }],
  uploader: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  views: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  uploadDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for search functionality
comicSchema.index({ title: 'text', description: 'text', tags: 'text' });

// Method to increment views
comicSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

// Method to increment likes
comicSchema.methods.incrementLikes = function() {
  this.likes += 1;
  return this.save();
};

module.exports = mongoose.model('Comic', comicSchema); 