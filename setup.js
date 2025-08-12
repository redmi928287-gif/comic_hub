const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// MongoDB connection string - update this with your actual connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/comic-hub';

// Sample data
const sampleComics = [
  {
    title: 'The Amazing Adventures',
    description: 'An epic journey through fantastical worlds filled with magic and mystery.',
    thumbnail: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop',
    comicLink: 'https://t.me/comic1',
    genre: ['Adventure', 'Fantasy'],
    views: Math.floor(Math.random() * (9000 - 5000 + 1)) + 5000,
    isPublished: true,
  },
  {
    title: 'Cyberpunk Chronicles',
    description: 'A futuristic tale of technology, rebellion, and human resilience.',
    thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=400&fit=crop',
    comicLink: 'https://t.me/comic2',
    genre: ['Sci-Fi', 'Action'],
    views: Math.floor(Math.random() * (9000 - 5000 + 1)) + 5000,
    isPublished: true,
  },
  {
    title: 'Mystery Manor',
    description: 'A haunted mansion holds secrets that will change everything.',
    thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    comicLink: 'https://t.me/comic3',
    genre: ['Horror', 'Mystery'],
    views: Math.floor(Math.random() * (9000 - 5000 + 1)) + 5000,
    isPublished: true,
  }
];

const sampleAds = [
  {
    title: 'Premium Comics Access',
    thumbnail: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop',
    link: 'https://t.me/beast_is_kum',
    position: 'top',
    isActive: true,
  },
  {
    title: 'Join Our Community',
    thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=400&fit=crop',
    link: 'https://t.me/beast_is_kum',
    position: 'sidebar',
    isActive: true,
  }
];

async function setupDatabase() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB successfully!');

    // Import models
    const User = require('./app/models/User');
    const Comic = require('./app/models/Comic');
    const Ad = require('./app/models/Ad');
    const Stats = require('./app/models/Stats');

    // Clear existing data
    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Comic.deleteMany({});
    await Ad.deleteMany({});
    await Stats.deleteMany({});

    // Create admin user
    console.log('Creating admin user...');
    const hashedPassword = await bcrypt.hash('admin123', 12);
    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@comichub.com',
      password: hashedPassword,
      role: 'admin',
      isPremium: true,
    });
    await adminUser.save();
    console.log('Admin user created:', adminUser.email);

    // Create sample comics
    console.log('Creating sample comics...');
    for (const comicData of sampleComics) {
      const comic = new Comic(comicData);
      await comic.save();
    }
    console.log(`${sampleComics.length} sample comics created`);

    // Create sample ads
    console.log('Creating sample ads...');
    for (const adData of sampleAds) {
      const ad = new Ad(adData);
      await ad.save();
    }
    console.log(`${sampleAds.length} sample ads created`);

    // Create initial stats
    console.log('Creating initial stats...');
    const stats = new Stats({
      totalUsers: 66472,
      dailyViews: Math.floor(Math.random() * (3000 - 1000 + 1)) + 1000,
      onlineUsers: Math.floor(Math.random() * (4000 - 2000 + 1)) + 2000,
    });
    await stats.save();
    console.log('Initial stats created');

    console.log('\n✅ Database setup completed successfully!');
    console.log('\n📋 Login Credentials:');
    console.log('Email: admin@comichub.com');
    console.log('Password: admin123');
    console.log('\n🔗 Access your app at: http://localhost:3000');
    console.log('🔗 Admin panel at: http://localhost:3000/admin');

  } catch (error) {
    console.error('❌ Error setting up database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run setup if this file is executed directly
if (require.main === module) {
  setupDatabase();
}

module.exports = setupDatabase; 