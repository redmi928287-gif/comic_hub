const express = require('express');
const jwt = require('jsonwebtoken');
const Comic = require('../models/Comic');
const User = require('../models/User');
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

// Get all comics (public)
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 12, category, search } = req.query;
    
    let query = { isActive: true };
    
    // Filter by category
    if (category && category !== 'all') {
      query.category = category;
    }
    
    // Search functionality
    if (search) {
      query.$text = { $search: search };
    }
    
    const comics = await Comic.find(query)
      .populate('uploader', 'username')
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

// Get comic by ID (public)
router.get('/:id', async (req, res) => {
  try {
    const comic = await Comic.findById(req.params.id)
      .populate('uploader', 'username')
      .exec();
    
    if (!comic || !comic.isActive) {
      return res.status(404).json({ message: 'Comic not found' });
    }
    
    // Increment views
    await comic.incrementViews();
    
    res.json(comic);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Upload new comic (admin only)
router.post('/', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { title, description, thumbnail, telegramLink, category, tags } = req.body;
    
    // Validate required fields
    if (!title || !description || !thumbnail || !telegramLink || !category) {
      return res.status(400).json({ message: 'All required fields must be provided' });
    }
    
    // Create new comic
    const comic = new Comic({
      title,
      description,
      thumbnail,
      telegramLink,
      category,
      tags: tags || [],
      uploader: req.user.userId
    });
    
    await comic.save();
    
    const populatedComic = await Comic.findById(comic._id)
      .populate('uploader', 'username')
      .exec();
    
    res.status(201).json({
      message: 'Comic uploaded successfully',
      comic: populatedComic
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update comic (admin only)
router.put('/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { title, description, thumbnail, telegramLink, category, tags } = req.body;
    
    const comic = await Comic.findById(req.params.id);
    if (!comic) {
      return res.status(404).json({ message: 'Comic not found' });
    }
    
    // Update fields
    if (title) comic.title = title;
    if (description) comic.description = description;
    if (thumbnail) comic.thumbnail = thumbnail;
    if (telegramLink) comic.telegramLink = telegramLink;
    if (category) comic.category = category;
    if (tags) comic.tags = tags;
    
    await comic.save();
    
    const updatedComic = await Comic.findById(comic._id)
      .populate('uploader', 'username')
      .exec();
    
    res.json({
      message: 'Comic updated successfully',
      comic: updatedComic
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete comic (admin only)
router.delete('/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const comic = await Comic.findById(req.params.id);
    if (!comic) {
      return res.status(404).json({ message: 'Comic not found' });
    }
    
    // Soft delete - just mark as inactive
    comic.isActive = false;
    await comic.save();
    
    res.json({ message: 'Comic deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Like comic (authenticated users)
router.post('/:id/like', authenticateToken, async (req, res) => {
  try {
    const comic = await Comic.findById(req.params.id);
    if (!comic || !comic.isActive) {
      return res.status(404).json({ message: 'Comic not found' });
    }
    
    await comic.incrementLikes();
    
    res.json({
      message: 'Comic liked successfully',
      likes: comic.likes + 1
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get comics by category
router.get('/category/:category', async (req, res) => {
  try {
    const { page = 1, limit = 12 } = req.query;
    const { category } = req.params;
    
    const comics = await Comic.find({ 
      category, 
      isActive: true 
    })
      .populate('uploader', 'username')
      .sort({ uploadDate: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();
    
    const total = await Comic.countDocuments({ category, isActive: true });
    
    res.json({
      comics,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
      category
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Search comics
router.get('/search/:query', async (req, res) => {
  try {
    const { page = 1, limit = 12 } = req.query;
    const { query } = req.params;
    
    const comics = await Comic.find({
      $text: { $search: query },
      isActive: true
    })
      .populate('uploader', 'username')
      .sort({ uploadDate: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();
    
    const total = await Comic.countDocuments({
      $text: { $search: query },
      isActive: true
    });
    
    res.json({
      comics,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
      searchQuery: query
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router; 