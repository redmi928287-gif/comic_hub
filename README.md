# Comic Hub - Your Ultimate Comic Destination

A modern, responsive web application for discovering, reading, and managing comics. Built with Next.js, TypeScript, Tailwind CSS, and MongoDB.

## Features

### 🎯 Core Features
- **Comic Management**: Upload and manage comics with thumbnail images and links
- **Admin Panel**: Full admin dashboard for content management
- **User Authentication**: Secure login/registration system
- **Responsive Design**: Mobile-first design that works on all devices

### 🚀 Admin Features
- **Comic Upload**: Add new comics with thumbnails and Telegram/other links
- **Ad Management**: Upload and manage advertisement banners
- **Dashboard**: Real-time statistics and analytics
- **Content Control**: Publish/unpublish comics and activate/deactivate ads

### 📊 Analytics & Statistics
- **Total Users**: Fixed at 66,472 users
- **Daily Views**: Randomly generated between 1K-3K
- **Online Users**: Randomly generated between 2K-4K
- **Comic Views**: Randomly generated between 5K-9K per comic

### 💰 Premium Features
- **Premium Banner**: Direct link to admin's Telegram account (@beast_is_kum)
- **Contact Admin**: Easy access to admin support

### 📱 Ad System
- **Multiple Positions**: Top, sidebar, and bottom banner placements
- **Dynamic Rotation**: Automatic ad rotation with navigation
- **Admin Control**: Full control over ad content and positioning

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: Custom JWT-based auth system
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **Deployment**: Vercel ready

## Prerequisites

- Node.js 18+ 
- MongoDB database (local or cloud)
- npm or yarn package manager

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd comic-hub
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   NEXTAUTH_SECRET=your_nextauth_secret
   NEXTAUTH_URL=http://localhost:3000
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   TELEGRAM_USERNAME=beast_is_kum
   ```

4. **Database Setup**
   - Ensure MongoDB is running
   - The application will automatically create necessary collections
   - Default admin user can be created manually in the database

5. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

### For Users
1. **Browse Comics**: View featured comics on the home page
2. **Read Comics**: Click on any comic to open the link (Telegram/other)
3. **Premium Access**: Click the premium banner to contact admin
4. **Account Management**: Register/login to access personal features

### For Admins
1. **Access Admin Panel**: Navigate to `/admin` (requires admin role)
2. **Manage Comics**: Add, edit, publish/unpublish comics
3. **Manage Ads**: Upload and control advertisement banners
4. **View Analytics**: Monitor user statistics and engagement

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Comics
- `GET /api/comics` - Fetch all published comics
- `POST /api/comics` - Create new comic (admin only)
- `PATCH /api/comics/[id]` - Update comic (admin only)
- `DELETE /api/comics/[id]` - Delete comic (admin only)

### Advertisements
- `GET /api/ads` - Fetch all active ads
- `POST /api/ads` - Create new ad (admin only)
- `PATCH /api/ads/[id]` - Update ad (admin only)
- `DELETE /api/ads/[id]` - Delete ad (admin only)

### Statistics
- `GET /api/stats` - Fetch dashboard statistics

## Database Models

### User
- Email, name, password (hashed)
- Role (user/admin)
- Premium status
- Creation and last login dates

### Comic
- Title, description, thumbnail
- Comic link (Telegram/other)
- Genre tags, view count
- Publication status

### Ad
- Title, thumbnail, link
- Position (top/sidebar/bottom)
- Active status

### Stats
- Total users, daily views, online users
- Last updated timestamp

## Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables
4. Deploy automatically

### Other Platforms
- Build the application: `npm run build`
- Start production server: `npm start`
- Ensure MongoDB connection is accessible

## Customization

### Telegram Integration
- Update `TELEGRAM_USERNAME` in environment variables
- Modify contact links in components
- Customize premium banner redirects

### Styling
- Modify `tailwind.config.js` for theme changes
- Update color schemes in `globals.css`
- Customize component styles as needed

### Content
- Add new comic genres
- Modify dashboard statistics ranges
- Customize ad positions and layouts

## Security Features

- Password hashing with bcrypt
- JWT-based authentication
- Admin role verification
- Input validation and sanitization
- Secure API endpoints

## Performance Features

- Image optimization with Next.js
- Responsive design for all devices
- Efficient database queries
- Client-side state management
- Optimized bundle size

## Support

For technical support or questions:
- **Telegram**: [@beast_is_kum](https://t.me/beast_is_kum)
- **Email**: Contact through admin panel

## License

This project is proprietary software. All rights reserved.

## Contributing

This is a private project. For feature requests or bug reports, please contact the admin through the provided channels.

---

**Built with ❤️ for the Comic Hub community** 