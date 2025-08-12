# MongoDB Setup Guide

## Step 1: Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Click "Try Free" and create an account
3. Choose the free tier (M0)

## Step 2: Create a Cluster
1. Click "Build a Database"
2. Choose "FREE" tier
3. Select a cloud provider (AWS, Google Cloud, or Azure)
4. Choose a region close to you
5. Click "Create"

## Step 3: Set Up Database Access
1. Go to "Database Access" in the left sidebar
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Create a username and password (save these!)
5. Set privileges to "Read and write to any database"
6. Click "Add User"

## Step 4: Set Up Network Access
1. Go to "Network Access" in the left sidebar
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (for development)
4. Click "Confirm"

## Step 5: Get Connection String
1. Go back to "Database" in the left sidebar
2. Click "Connect"
3. Choose "Connect your application"
4. Copy the connection string
5. Replace `<username>`, `<password>`, and `<dbname>` with your actual values

## Step 6: Update Environment File
1. Copy `env.example` to `.env.local`
2. Replace `MONGODB_URI` with your actual connection string
3. Generate a random JWT_SECRET (you can use: `openssl rand -base64 32`)

## Example Connection String:
```
MONGODB_URI=mongodb+srv://yourusername:yourpassword@cluster0.xxxxx.mongodb.net/comic-hub?retryWrites=true&w=majority
```

## Step 7: Test Connection
1. Run the setup script: `node setup.js`
2. This will create the admin user and sample data
3. Check the console for any errors

## Troubleshooting:
- Make sure your IP is whitelisted in Network Access
- Verify username and password are correct
- Check that the cluster is running
- Ensure the database name in the connection string matches what you want to use 