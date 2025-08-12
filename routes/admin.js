const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Comic = require('../models/Comic');
const Dashboard = require('../models/Dashboard');
const router = express.Router();

// Middleware to check if user is authenticated
const authenticateToken = (req, res, next) => {
  const token = req.session.token || req.headers['authorization']?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ message: 'Invalid token.' });
  }
};

// Middleware to check if user is admin
const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user || !user.isAdmin()) {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all users (admin only)
router.get('/users', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 20, role, search } = req.query;
    
    let query = {};
    
    // Filter by role
    if (role && role !== 'all') {
      query.role = role;
    }
    
    // Search functionality
    if (search) {
      query.$or = [
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();
    
    const total = await User.countDocuments(query);
    
    res.json({
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user by ID (admin only)
router.get('/users/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update user role (admin only)
router.put('/users/:id/role', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { role } = req.body;
    
    if (!['user', 'premium', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }
    
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Prevent admin from changing their own role
    if (user._id.toString() === req.user.userId) {
      return res.status(400).json({ message: 'Cannot change your own role' });
    }
    
    user.role = role;
    user.isPremium = role === 'premium';
    await user.save();
    
    res.json({
      message: 'User role updated successfully',
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
        isPremium: user.isPremium
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete user (admin only)
router.delete('/users/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Prevent admin from deleting themselves
    if (user._id.toString() === req.user.userId) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }
    
    await User.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all comics with admin details (admin only)
router.get('/comics', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 20, status, category } = req.query;
    
    let query = {};
    
    // Filter by status
    if (status === 'active') {
      query.isActive = true;
    } else if (status === 'inactive') {
      query.isActive = false;
    }
    
    // Filter by category
    if (category && category !== 'all') {
      query.category = category;
    }
    
    const comics = await Comic.find(query)
      .populate('uploader', 'username email')
      .sort({ uploadDate: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();
    
    const total = await Comic.countDocuments(query);
    
    res.json({
      comics,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Toggle comic status (admin only)
router.put('/comics/:id/toggle-status', authenticateToken, isAdmin, async (req, res) => {
  try {
    const comic = await Comic.findById(req.params.id);
    if (!comic) {
      return res.status(404).json({ message: 'Comic not found' });
    }
    
    comic.isActive = !comic.isActive;
    await comic.save();
    
    res.json({
      message: `Comic ${comic.isActive ? 'activated' : 'deactivated'} successfully`,
      comic: {
        id: comic._id,
        title: comic.title,
        isActive: comic.isActive
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get dashboard statistics (admin only)
router.get('/dashboard/stats', authenticateToken, isAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalComics = await Comic.countDocuments();
    const totalViews = await Comic.aggregate([
      { $group: { _id: null, total: { $sum: '$views' } } }
    ]);
    
    const premiumUsers = await User.countDocuments({ role: 'premium' });
    const adminUsers = await User.countDocuments({ role: 'admin' });
    
    // Get recent uploads
    const recentComics = await Comic.find({ isActive: true })
      .populate('uploader', 'username')
      .sort({ uploadDate: -1 })
      .limit(5)
      .exec();
    
    // Get recent registrations
    const recentUsers = await User.find()
      .select('username email role createdAt')
      .sort({ createdAt: -1 })
      .limit(5)
      .exec();
    
    res.json({
      totalUsers,
      totalComics,
      totalViews: totalViews[0]?.total || 0,
      premiumUsers,
      adminUsers,
      recentComics,
      recentUsers
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update dashboard statistics (admin only)
router.put('/dashboard/stats', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { totalUsers, totalViews, totalComics } = req.body;
    
    let dashboard = await Dashboard.findOne();
    if (!dashboard) {
      dashboard = new Dashboard();
    }
    
    if (totalUsers !== undefined) dashboard.totalUsers = totalUsers;
    if (totalViews !== undefined) dashboard.totalViews = totalViews;
    if (totalComics !== undefined) dashboard.totalComics = totalComics;
    
    await dashboard.save();
    
    res.json({
      message: 'Dashboard statistics updated successfully',
      dashboard
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get system logs (admin only)
router.get('/logs', authenticateToken, isAdmin, async (req, res) => {
  try {
    // This would typically connect to a logging service
    // For now, we'll return basic system info
    const systemInfo = {
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      nodeVersion: process.version,
      platform: process.platform,
      timestamp: new Date()
    };
    
    res.json({
      message: 'System logs retrieved successfully',
      systemInfo
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router; 