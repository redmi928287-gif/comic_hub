# 🚀 Deployment Guide: Render + MongoDB Atlas

## 📋 Prerequisites
- GitHub account
- MongoDB Atlas account (free)
- Render account (free)

## 🗄️ Step 1: MongoDB Atlas Setup

### 1. Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Click "Try Free" and create an account
3. Choose **FREE** tier (M0 Sandbox)

### 2. Create Your Cluster
1. Click "Build a Database"
2. Choose **FREE** tier (M0 Sandbox)
3. Select cloud provider (AWS/Google Cloud/Azure)
4. Choose region close to you
5. Click "Create"

### 3. Set Up Database Access
1. Go to "Database Access" → "Add New Database User"
2. Create username and password (save these!)
3. Set privileges to "Read and write to any database"
4. Click "Add User"

### 4. Get Connection String
1. Go to "Database" → "Connect"
2. Choose "Connect your application"
3. Copy the connection string
4. Replace `<username>`, `<password>`, and `<dbname>` with your values

## 🌐 Step 2: Render Deployment

### 1. Create Render Account
1. Go to [Render](https://render.com/)
2. Sign up with GitHub account
3. Click "New +" → "Web Service"

### 2. Connect Repository
1. Connect your GitHub repository
2. Select your comic website repository
3. Give it a name (e.g., "comic-website")

### 3. Configure Service
- **Name**: `comic-website`
- **Environment**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Plan**: **Free**

### 4. Set Environment Variables
Click "Advanced" and add:

```
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/comic-website?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_here
SESSION_SECRET=your_super_secret_session_key_here
```

**Important**: Replace the MongoDB URI with your actual connection string!

### 5. Deploy
1. Click "Create Web Service"
2. Wait for build to complete
3. Your site will be available at: `https://your-app-name.onrender.com`

## 🔐 Step 3: Generate Strong Secrets

### JWT Secret
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Session Secret
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## ✅ Step 4: Test Your Deployment

1. Visit your Render URL
2. Test user registration/login
3. Test comic upload functionality
4. Test ad upload functionality
5. Check MongoDB Atlas to see data being stored

## 🆘 Troubleshooting

### Common Issues:
1. **Build fails**: Check if all dependencies are in package.json
2. **Database connection fails**: Verify MongoDB URI and network access
3. **App crashes**: Check Render logs for errors
4. **Environment variables not working**: Ensure they're set in Render dashboard

### Check Logs:
1. Go to your Render service
2. Click "Logs" tab
3. Look for error messages

## 🔄 Auto-Deploy

- Every push to your main branch will automatically deploy
- Render will rebuild and restart your service
- No manual deployment needed!

## 💰 Cost
- **MongoDB Atlas**: FREE (512MB storage)
- **Render**: FREE (750 hours/month)
- **Total**: $0/month

## 📞 Support
- MongoDB Atlas: [Documentation](https://docs.atlas.mongodb.com/)
- Render: [Documentation](https://render.com/docs)
- Your app will be live at: `https://your-app-name.onrender.com` 