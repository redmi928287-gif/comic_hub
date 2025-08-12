# Vercel Deployment Guide

## Prerequisites
- GitHub account
- Vercel account (free tier available)
- MongoDB Atlas database set up and running

## Step 1: Push Code to GitHub
1. Create a new repository on GitHub
2. Initialize git in your project folder:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/your-repo-name.git
   git push -u origin main
   ```

## Step 2: Deploy to Vercel
1. Go to [Vercel](https://vercel.com)
2. Sign up/Login with your GitHub account
3. Click "New Project"
4. Import your GitHub repository
5. Configure project settings:
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: `npm run build`
   - Output Directory: .next
   - Install Command: `npm install`

## Step 3: Set Environment Variables
1. In your Vercel project dashboard, go to "Settings" → "Environment Variables"
2. Add the following variables:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: Your JWT secret key
   - `NEXTAUTH_SECRET`: Your NextAuth secret (if using)
   - `NEXTAUTH_URL`: Your Vercel domain (e.g., https://your-app.vercel.app)

## Step 4: Deploy
1. Click "Deploy"
2. Wait for the build to complete
3. Your app will be available at `https://your-app.vercel.app`

## Step 5: Set Up Custom Domain (Optional)
1. In Vercel dashboard, go to "Settings" → "Domains"
2. Add your custom domain
3. Follow the DNS configuration instructions

## Step 6: Update MongoDB Network Access
1. Go to MongoDB Atlas
2. Add your Vercel deployment IP to Network Access
3. Or use "Allow Access from Anywhere" for production

## Step 7: Test Production
1. Visit your deployed app
2. Test all features (login, admin panel, comic uploads)
3. Check that database connections work

## Environment Variables Reference
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/comic-hub?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-here
NEXTAUTH_SECRET=your-nextauth-secret-here
NEXTAUTH_URL=https://your-app.vercel.app
```

## Troubleshooting
- **Build Errors**: Check the build logs in Vercel dashboard
- **Database Connection**: Verify MONGODB_URI is correct and network access is configured
- **Environment Variables**: Ensure all required variables are set in Vercel
- **CORS Issues**: Check if your MongoDB Atlas cluster allows connections from Vercel

## Post-Deployment
1. Run the setup script on your production database (if needed)
2. Test all admin functions
3. Monitor your app's performance in Vercel dashboard
4. Set up monitoring and analytics if desired 