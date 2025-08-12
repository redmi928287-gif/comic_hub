const mongoose = require('mongoose');

const dashboardSchema = new mongoose.Schema({
  totalUsers: {
    type: Number,
    default: 66472
  },
  totalViews: {
    type: Number,
    default: 0
  },
  totalComics: {
    type: Number,
    default: 0
  },
  onlineUsers: {
    type: Number,
    default: 0
  },
  dailyViews: {
    type: Number,
    default: 0
  },
  userCountChange: {
    type: Number,
    default: 0
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Method to update dashboard stats
dashboardSchema.methods.updateStats = function(stats) {
  Object.assign(this, stats);
  this.lastUpdated = new Date();
  return this.save();
};

// Method to get random view count between 40k-60k
dashboardSchema.methods.getRandomViews = function() {
  return Math.floor(Math.random() * 20000) + 40000;
};

// Method to get random online users between 1k-5k
dashboardSchema.methods.getRandomOnlineUsers = function() {
  return Math.floor(Math.random() * 4000) + 1000;
};

module.exports = mongoose.model('Dashboard', dashboardSchema); 