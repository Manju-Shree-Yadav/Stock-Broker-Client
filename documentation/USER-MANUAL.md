# USER MANUAL (Stock Broker Dashboard)

## Step 1: Install MongoDB

### Windows
1. Download MongoDB Community Server: https://www.mongodb.com/try/download/community
2. Run the installer
3. Choose "Complete" installation
4. Install as a Windows Service (recommended)
5. MongoDB will start automatically

**OR use MongoDB Atlas (Cloud - Recommended for quick start):**
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for free account
3. Create a free cluster (M0)
4. Click "Connect" → "Connect your application"
5. Copy the connection string
6. Update `backend/.env`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/stock-broker
   ```

## Step 2: Start the Application

### Terminal 1 - Backend
```powershell
cd backend
npm start
```

You should see:
```
Server running on port 4000
MongoDB connected successfully
Supported stocks: GOOG, TSLA, AMZN, META, NVDA
```

### Terminal 2 - Frontend
```powershell
cd frontend
npm run dev
```

You should see:
```
  ▲ Next.js 15.x.x
  - Local:        http://localhost:3000
```

## Step 3: Use the Application

1. Open browser: `http://localhost:3000`
2. Register a new account:
   - Email: `user1@example.com`
   - Password: `password123`
3. Click "Register"
4. You'll be logged in automatically
5. Click "Subscribe" on any stock (e.g., TSLA)
6. Watch the price update every second!

## Step 4: Test Multi-User

1. Open a new incognito/private browser window
2. Go to `http://localhost:3000`
3. Register a different user:
   - Email: `user2@example.com`
   - Password: `password456`
4. Subscribe to different stocks (e.g., GOOG, META)
5. Keep both windows open side by side
6. Watch both dashboards update independently!

## Troubleshooting

### MongoDB Connection Error
**Error**: `MongooseServerSelectionError: connect ECONNREFUSED`

**Solution**:
- If using local MongoDB: Make sure MongoDB service is running
  ```powershell
  # Check if MongoDB is running
  Get-Service MongoDB
  
  # Start MongoDB if stopped
  Start-Service MongoDB
  ```
- If using MongoDB Atlas: Check your connection string in `.env`

### Port Already in Use
**Error**: `EADDRINUSE: address already in use :::4000`

**Solution**:
```powershell
# Find and kill the process using port 4000
Get-Process -Id (Get-NetTCPConnection -LocalPort 4000).OwningProcess | Stop-Process
```

### Frontend Can't Connect
**Error**: Socket.io connection failed

**Solution**:
1. Make sure backend is running first
2. Check backend terminal for "Server running on port 4000"
3. Verify no firewall blocking localhost:4000

## Quick Test Commands

### Check MongoDB is Running
```powershell
# Local MongoDB
mongosh
# Should connect successfully

# Or check service
Get-Service MongoDB
```

### Test Backend API
```powershell
# Health check
curl http://localhost:4000/health

# Should return: {"status":"ok","supportedStocks":["GOOG","TSLA","AMZN","META","NVDA"]}
```

### Test Registration
```powershell
curl -X POST http://localhost:4000/api/register `
  -H "Content-Type: application/json" `
  -d '{"email":"test@example.com","password":"test123"}'

# Should return JWT token
```

## What to Expect

### Backend Console
```
MongoDB connected successfully
Server running on port 4000
Supported stocks: GOOG, TSLA, AMZN, META, NVDA
Client connected: xZy123...
User authenticated: user1@example.com
```

### Frontend
- Login/Register page with email and password fields
- After login: Dashboard with 5 stock cards
- Subscribe button on each stock
- Real-time price updates (every second)
- Visual indicators (up/down arrows)
- Logout button in header

## Success Checklist

- [ ] MongoDB is running (local or Atlas)
- [ ] Backend started successfully on port 4000
- [ ] Frontend started successfully on port 3000
- [ ] Can register a new user
- [ ] Can login with registered user
- [ ] Can subscribe to stocks
- [ ] Prices update every second
- [ ] Can unsubscribe from stocks
- [ ] Can test with multiple users simultaneously
- [ ] Subscriptions persist after logout/login

If all items are checked, congratulations! Your Stock Broker Dashboard is working perfectly! 🎉
