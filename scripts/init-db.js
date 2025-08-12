const mongoose = require('mongoose');
const User = require('../models/User');
const Dashboard = require('../models/Dashboard');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/comic-website', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', async () => {
    console.log('Connected to MongoDB');
    
    try {
        // Initialize dashboard
        await initializeDashboard();
        
        // Create admin user if it doesn't exist
        await createAdminUser();
        
        console.log('Database initialization completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Database initialization failed:', error);
        process.exit(1);
    }
});

async function initializeDashboard() {
    try {
        const existingDashboard = await Dashboard.findOne();
        
        if (!existingDashboard) {
            const dashboard = new Dashboard({
                totalUsers: 66472,
                totalViews: Math.floor(Math.random() * 20000) + 40000, // 40k to 60k
                totalComics: 0,
                onlineUsers: Math.floor(Math.random() * 4000) + 1000, // 1k to 5k
                dailyViews: Math.floor(Math.random() * 20000) + 1349,
                userCountChange: Math.floor(Math.random() * 100) + 1
            });
            
            await dashboard.save();
            console.log('Dashboard initialized successfully');
        } else {
            console.log('Dashboard already exists');
        }
    } catch (error) {
        console.error('Error initializing dashboard:', error);
        throw error;
    }
}

async function createAdminUser() {
    try {
        const existingAdmin = await User.findOne({ role: 'admin' });
        
        if (!existingAdmin) {
            const adminUser = new User({
                username: 'admin',
                email: 'admin@comichub.com',
                password: 'admin123', // This will be hashed automatically
                role: 'admin',
                isPremium: true
            });
            
            await adminUser.save();
            console.log('Admin user created successfully');
            console.log('Username: admin');
            console.log('Password: admin123');
            console.log('⚠️  IMPORTANT: Change these credentials after first login!');
        } else {
            console.log('Admin user already exists');
        }
    } catch (error) {
        console.error('Error creating admin user:', error);
        throw error;
    }
} 