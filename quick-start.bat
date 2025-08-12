@echo off
echo ========================================
echo Comic Hub - Quick Start Script
echo ========================================
echo.

echo 1. Installing dependencies...
npm install

echo.
echo 2. Starting development server...
echo Your app will be available at: http://localhost:3000
echo.
echo 3. To stop the server, press Ctrl+C
echo.
echo 4. Next steps:
echo    - Set up MongoDB Atlas (see MONGODB_SETUP.md)
echo    - Create .env.local file with your database credentials
echo    - Run: node setup.js (after setting up MongoDB)
echo    - Deploy to Vercel (see DEPLOYMENT.md)
echo.

npm run dev 