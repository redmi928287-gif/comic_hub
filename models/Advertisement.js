const mongoose = require('mongoose');

const advertisementSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    text: {
        type: String,
        required: true,
        trim: true
    },
    telegramLink: {
        type: String,
        required: true,
        trim: true
    },
    bannerImage: {
        type: String,
        required: true
    },
    position: {
        type: String,
        enum: ['top', 'sidebar', 'premium'],
        default: 'top'
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
    uploader: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    views: {
        type: Number,
        default: 0
    },
    clicks: {
        type: Number,
        default: 0
    },
    uploadDate: {
        type: Date,
        default: Date.now
    },
    startDate: {
        type: Date,
        default: Date.now
    },
    endDate: {
        type: Date
    },
    isActive: {
        type: Boolean,
        default: true
    }
});

// Method to increment views
advertisementSchema.methods.incrementViews = function() {
    this.views += 1;
    return this.save();
};

// Method to increment clicks
advertisementSchema.methods.incrementClicks = function() {
    this.clicks += 1;
    return this.save();
};

// Method to check if advertisement is currently active
advertisementSchema.methods.isCurrentlyActive = function() {
    if (!this.isActive || this.status !== 'active') {
        return false;
    }
    
    const now = new Date();
    if (this.startDate && now < this.startDate) {
        return false;
    }
    
    if (this.endDate && now > this.endDate) {
        return false;
    }
    
    return true;
};

// Static method to get active advertisements by position
advertisementSchema.statics.getActiveByPosition = function(position) {
    return this.find({
        position: position,
        status: 'active',
        isActive: true,
        $or: [
            { startDate: { $lte: new Date() } },
            { startDate: { $exists: false } }
        ],
        $or: [
            { endDate: { $gte: new Date() } },
            { endDate: { $exists: false } }
        ]
    }).sort({ uploadDate: -1 });
};

// Static method to get all active advertisements
advertisementSchema.statics.getAllActive = function() {
    return this.find({
        status: 'active',
        isActive: true,
        $or: [
            { startDate: { $lte: new Date() } },
            { startDate: { $exists: false } }
        ],
        $or: [
            { endDate: { $gte: new Date() } },
            { endDate: { $exists: false } }
        ]
    }).sort({ uploadDate: -1 });
};

module.exports = mongoose.model('Advertisement', advertisementSchema); 