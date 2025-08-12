const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Advertisement = require('../models/Advertisement');
const { authenticateToken, isAdmin } = require('./auth');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = 'public/uploads/banners';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'banner-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: function (req, file, cb) {
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'));
        }
    }
});

// Get all advertisements (admin only)
router.get('/admin', authenticateToken, isAdmin, async (req, res) => {
    try {
        const advertisements = await Advertisement.find()
            .populate('uploader', 'username email')
            .sort({ uploadDate: -1 });
        
        res.json(advertisements);
    } catch (error) {
        console.error('Error fetching advertisements:', error);
        res.status(500).json({ error: 'Failed to fetch advertisements' });
    }
});

// Get active advertisements by position (public)
router.get('/position/:position', async (req, res) => {
    try {
        const { position } = req.params;
        const advertisements = await Advertisement.getActiveByPosition(position);
        res.json(advertisements);
    } catch (error) {
        console.error('Error fetching advertisements by position:', error);
        res.status(500).json({ error: 'Failed to fetch advertisements' });
    }
});

// Get all active advertisements (public)
router.get('/active', async (req, res) => {
    try {
        const advertisements = await Advertisement.getAllActive();
        res.json(advertisements);
    } catch (error) {
        console.error('Error fetching active advertisements:', error);
        res.status(500).json({ error: 'Failed to fetch advertisements' });
    }
});

// Upload new advertisement (admin only)
router.post('/upload', authenticateToken, isAdmin, upload.single('bannerImage'), async (req, res) => {
    try {
        const { title, text, telegramLink, position, status, startDate, endDate } = req.body;
        
        if (!req.file) {
            return res.status(400).json({ error: 'Banner image is required' });
        }
        
        const advertisement = new Advertisement({
            title,
            text,
            telegramLink,
            bannerImage: `/uploads/banners/${req.file.filename}`,
            position,
            status,
            uploader: req.user.id,
            startDate: startDate || new Date(),
            endDate: endDate || null
        });
        
        await advertisement.save();
        
        res.status(201).json({
            message: 'Advertisement uploaded successfully',
            advertisement
        });
    } catch (error) {
        console.error('Error uploading advertisement:', error);
        res.status(500).json({ error: 'Failed to upload advertisement' });
    }
});

// Update advertisement (admin only)
router.put('/:id', authenticateToken, isAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        
        // Remove fields that shouldn't be updated
        delete updateData.uploader;
        delete updateData.uploadDate;
        
        const advertisement = await Advertisement.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );
        
        if (!advertisement) {
            return res.status(404).json({ error: 'Advertisement not found' });
        }
        
        res.json({
            message: 'Advertisement updated successfully',
            advertisement
        });
    } catch (error) {
        console.error('Error updating advertisement:', error);
        res.status(500).json({ error: 'Failed to update advertisement' });
    }
});

// Delete advertisement (admin only)
router.delete('/:id', authenticateToken, isAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const advertisement = await Advertisement.findById(id);
        
        if (!advertisement) {
            return res.status(404).json({ error: 'Advertisement not found' });
        }
        
        // Delete banner image file
        if (advertisement.bannerImage) {
            const imagePath = path.join('public', advertisement.bannerImage);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }
        
        await Advertisement.findByIdAndDelete(id);
        
        res.json({ message: 'Advertisement deleted successfully' });
    } catch (error) {
        console.error('Error deleting advertisement:', error);
        res.status(500).json({ error: 'Failed to delete advertisement' });
    }
});

// Track advertisement click (public)
router.post('/:id/click', async (req, res) => {
    try {
        const { id } = req.params;
        const advertisement = await Advertisement.findById(id);
        
        if (!advertisement) {
            return res.status(404).json({ error: 'Advertisement not found' });
        }
        
        await advertisement.incrementClicks();
        
        res.json({ message: 'Click tracked successfully' });
    } catch (error) {
        console.error('Error tracking click:', error);
        res.status(500).json({ error: 'Failed to track click' });
    }
});

// Track advertisement view (public)
router.post('/:id/view', async (req, res) => {
    try {
        const { id } = req.params;
        const advertisement = await Advertisement.findById(id);
        
        if (!advertisement) {
            return res.status(404).json({ error: 'Advertisement not found' });
        }
        
        await advertisement.incrementViews();
        
        res.json({ message: 'View tracked successfully' });
    } catch (error) {
        console.error('Error tracking view:', error);
        res.status(500).json({ error: 'Failed to track view' });
    }
});

// Toggle advertisement status (admin only)
router.patch('/:id/toggle-status', authenticateToken, isAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const advertisement = await Advertisement.findById(id);
        
        if (!advertisement) {
            return res.status(404).json({ error: 'Advertisement not found' });
        }
        
        advertisement.status = advertisement.status === 'active' ? 'inactive' : 'active';
        await advertisement.save();
        
        res.json({
            message: `Advertisement ${advertisement.status}`,
            advertisement
        });
    } catch (error) {
        console.error('Error toggling advertisement status:', error);
        res.status(500).json({ error: 'Failed to toggle advertisement status' });
    }
});

module.exports = router; 