const express = require('express');
const Dashboard = require('../models/Dashboard');
const User = require('../models/User');
const Comic = require('../models/Comic');
const router = express.Router();

// Get public dashboard data
router.get('/public', async (req, res) => {
  try {
    let dashboard = await Dashboard.findOne();
    
    if (!dashboard) {
      // Create default dashboard if none exists
      dashboard = new Dashboard({
        totalUsers: 66472,
        totalViews: Math.floor(Math.random() * 20000) + 40000, // 40k to 60k
        totalComics: 0,
        onlineUsers: Math.floor(Math.random() * 4000) + 1000, // 1k to 5k
        dailyViews: Math.floor(Math.random() * 20000) + 1349,
        userCountChange: Math.floor(Math.random() * 100) + 1
      });
      await dashboard.save();
    }
    
    // Update with random values for live feel
    dashboard.onlineUsers = Math.floor(Math.random() * 4000) + 1000;
    dashboard.dailyViews = Math.floor(Math.random() * 20000) + 1349;
    dashboard.userCountChange = Math.floor(Math.random() * 100) + 1;
    dashboard.lastUpdated = new Date();
    
    await dashboard.save();
    
    res.json({
      totalUsers: dashboard.totalUsers,
      totalViews: dashboard.totalViews,
      totalComics: dashboard.totalComics,
      onlineUsers: dashboard.onlineUsers,
      dailyViews: dashboard.dailyViews,
      userCountChange: dashboard.userCountChange,
      currentTime: new Date().toLocaleTimeString(),
      lastUpdated: dashboard.lastUpdated
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get live statistics
router.get('/live', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalComics = await Comic.countDocuments({ isActive: true });
    const totalViews = await Comic.aggregate([
      { $group: { _id: null, total: { $sum: '$views' } } }
    ]);
    
    // Generate random values for live dashboard
    const onlineUsers = Math.floor(Math.random() * 4000) + 1000;
    const dailyViews = Math.floor(Math.random() * 20000) + 1349;
    const userCountChange = Math.floor(Math.random() * 100) + 1;
    
    res.json({
      totalUsers: 66472, // Fixed as requested
      totalViews: totalViews[0]?.total || Math.floor(Math.random() * 20000) + 40000,
      totalComics,
      onlineUsers,
      dailyViews,
      userCountChange,
      currentTime: new Date().toLocaleTimeString()
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get trending comics
router.get('/trending', async (req, res) => {
  try {
    const trendingComics = await Comic.find({ isActive: true })
      .populate('uploader', 'username')
      .sort({ views: -1, likes: -1 })
      .limit(6)
      .exec();
    
    res.json({
      trendingComics
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get recent uploads
router.get('/recent', async (req, res) => {
  try {
    const recentComics = await Comic.find({ isActive: true })
      .populate('uploader', 'username')
      .sort({ uploadDate: -1 })
      .limit(8)
      .exec();
    
    res.json({
      recentComics
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get category statistics
router.get('/categories', async (req, res) => {
  try {
    const categoryStats = await Comic.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    res.json({
      categoryStats
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user statistics
router.get('/users', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const premiumUsers = await User.countDocuments({ role: 'premium' });
    const adminUsers = await User.countDocuments({ role: 'admin' });
    const regularUsers = totalUsers - premiumUsers - adminUsers;
    
    res.json({
      totalUsers: 66472, // Fixed as requested
      premiumUsers,
      adminUsers,
      regularUsers,
      premiumPercentage: ((premiumUsers / totalUsers) * 100).toFixed(2)
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router; 