# Project Structure & Implementation Guide

## Architecture Overview

The Architectuer used here is a client-server model with a clear separation between the frontend and backend components. 

The frontend is built using Next.js and TypeScript, 

while the backend uses Node.js with Express and MongoDB for data storage. 

Real-time communication is handled via Socket.io.

```
┌─────────────┐         HTTP/REST          ┌─────────────┐
│             │◄──────────────────────────►│             │
│  Frontend   │                             │   Backend   │
│  (Next.js)  │         WebSocket          │  (Express)  │
│             │◄──────────────────────────►│             │
└─────────────┘                             └──────┬──────┘
                                                   │
                                                   │
                                            ┌──────▼──────┐
                                            │   MongoDB   │
                                            │  Database   │
                                            └─────────────┘
```

## File Structure

```
stock/

├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── authController.js           # Authentication logic
│   │   │   └── subscriptionController.js   # Subscription management
│   │   ├── data/
│   │   │   └── stocks.js                   # Supported stocks and prices
│   │   ├── middleware/
│   │   │   └── authMiddleware.js           # JWT verification
│   │   ├── models/
│   │   │   └── User.js                     # MongoDB User schema
│   │   ├── routes/
│   │   │   ├── authRoutes.js               # Auth endpoints
│   │   │   └── subscriptionRoutes.js       # Subscription endpoints
│   │   ├── socket/
│   │   │   └── socketHandler.js            # WebSocket logic
│   │   └── index.js                        # Main server file
│   ├── .env                                # Environment variables
│   ├── package.json
│   └── node_modules/
│
├── frontend/
│   ├── app/
│   │   ├── dashboard/
│   │   │   └── page.tsx                    # Dashboard page
│   │   ├── login/
│   │   │   └── page.tsx                    # Login page
│   │   ├── register/
│   │   │   └── page.tsx                    # Registration page
│   │   ├── layout.tsx                      # Root layout
│   │   └── globals.css                     # Global styles
│   ├── components/
│   │   ├── custom/
│   │   │   └── Loader.tsx                  # Loading component
│   │   └── ui/                             # ShadcnUI components
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── input.tsx
│   │       └── badge.tsx
│   ├── config/
│   │   └── api.ts                          # API configuration
│   ├── data/
│   │   └── stocks.ts                       # Supported stocks list
│   ├── lib/
│   │   ├── api/
│   │   │   ├── auth.ts                     # Auth API functions
│   │   │   └── subscriptions.ts            # Subscription API functions
│   │   └── utils.ts                        # Utility functions
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.ts
│   └── next.config.ts
│
└── README.md
```

## Backend Implementation Details

### User Model (`backend/src/models/User.js`)
- **Schema**: email, password (hashed), subscriptions array
- **Methods**: `comparePassword()` for authentication
- **Hooks**: Pre-save hook to hash passwords with bcrypt

### Main Server (`backend/src/index.js`)

#### 1. MongoDB Connection
```javascript
mongoose.connect(MONGODB_URI)
```

#### 2. REST API Endpoints
- `/api/auth/register` - Create new user account
- `/api/auth/login` - Authenticate and return JWT
- `/api/subscriptions` - GET user subscriptions
- `/api/subscriptions` - POST subscribe to stock
- `/api/subscriptions/:ticker` - DELETE unsubscribe from stock

#### 3. Authentication Middleware
- Verifies JWT token in Authorization header
- Attaches user object to request

#### 4. Socket.io Integration
- Client authenticates via `authenticate` event with JWT
- Server verifies token and loads user subscriptions from DB
- Real-time price updates sent only for subscribed stocks

#### 5. Stock Price Generator
- `setInterval` updates prices every 1000ms (1 second)
- Random fluctuation: ±1% per update
- Prices broadcast to all authenticated clients based on subscriptions

## Frontend Implementation Details

### Dashboard Page (`frontend/app/dashboard/page.tsx`)

#### 1. State Management
```typescript
- socketRef: Socket.io connection reference
- token: JWT token from localStorage
- userEmail: User email from localStorage
- subscriptions: Array of subscribed stock tickers
- stockPrices: Map of ticker to StockPrice object
- newTicker: Input for new subscription
- error/success: UI feedback messages
- isLoading: Loading state
```

#### 2. Authentication Flow
```
User submits form on login/register page
    ↓
POST /api/auth/login or /api/auth/register
    ↓
Receive JWT token
    ↓
Store token and email in localStorage
    ↓
Redirect to dashboard
    ↓
Dashboard initializes Socket.io connection
    ↓
Emit 'authenticate' event with token
    ↓
Receive 'auth-success' with user subscriptions
```

#### 3. Subscription Management
- Click Subscribe → POST /api/subscriptions
- Click Unsubscribe → DELETE /api/subscriptions/:ticker
- Update local state immediately
- Backend persists to MongoDB
- Socket.io continues sending updates

#### 4. Real-time Updates
```
Socket receives 'stock-update' event
    ↓
Update previousPrices state
    ↓
Update stockPrices state
    ↓
React re-renders
    ↓
Display price change indicators
```

## Key Features Implementation

### 1. Email-based Authentication
- User registers with email + password
- Password hashed using bcrypt (10 salt rounds)
- JWT token issued on login (7-day expiry)
- Token stored in localStorage for persistence

### 2. Persistent Subscriptions
- Subscriptions stored in User document
- Loaded on authentication
- Updated via REST API
- Persists across sessions

### 3. Real-time Price Updates
- Backend generates random prices every second
- Socket.io broadcasts to connected clients
- Only subscribed stocks sent to each user
- Frontend updates UI reactively

### 4. Multi-user Support
- Each user has unique socket connection
- Independent subscription lists in database
- Concurrent updates handled efficiently
- No cross-user data leakage

### 5. Visual Indicators
- TrendingUp icon: Price increased
- TrendingDown icon: Price decreased
- Minus icon: Price unchanged
- Color coding (green/red/gray)

## Security Considerations

### Current Implementation
- Passwords hashed with bcrypt
- JWT for stateless authentication
- CORS configured
- Input validation on backend
- MongoDB injection protection (Mongoose)

### Production Recommendations
- Use HTTPS/WSS
- Add rate limiting
- Implement refresh tokens
- Add email verification
- Use environment-specific secrets
- Add request logging
- Implement password reset
- Add CSRF protection

## Data Flow Examples

### Registration Flow
```
1. User enters email + password on register page
2. Frontend calls registerUser() API function
3. API function → POST /api/auth/register
4. Backend creates User in MongoDB
5. Backend returns JWT token and user data
6. Frontend stores token and email in localStorage
7. Frontend redirects to dashboard
8. Dashboard initializes Socket.io and authenticates
```

### Subscribe Flow
```
1. User clicks "Subscribe" button on stock card
2. Frontend calls subscribeToStock(ticker, token)
3. API function → POST /api/subscriptions {ticker}
4. Backend adds stock to user.subscriptions array
5. Backend saves to MongoDB
6. Backend returns updated subscriptions
7. Frontend updates local state
8. Frontend emits 'update-subscriptions' to socket
9. Socket.io starts sending stock prices
10. Dashboard shows live stock price with updates
```

### Price Update Flow
```
1. Backend timer triggers (every 1 second)
2. Generate new prices for all supported stocks (random +/-1%)
3. For each connected socket:
   - Get user session data
   - Emit 'stock-update' event for ALL stocks (not just subscribed)
   - Each update contains: {ticker, price, timestamp}
4. Frontend receives 'stock-update' event
5. Update stockPrices Map with new price
6. Calculate price change from previous price
7. React re-renders with new prices
8. Visual indicators (TrendingUp/TrendingDown) show direction
9. Color-coded badges show positive/negative change
```

## Testing Scenarios

### 1. Single User
- Register → Login → Subscribe to 3 stocks → Watch updates → Unsubscribe → Logout

### 2. Multiple Users
- Open 2 browser windows
- Register User A and User B
- User A subscribes to GOOG, TSLA
- User B subscribes to AMZN, META, NVDA
- Verify independent updates
- Verify no cross-contamination

### 3. Session Persistence
- Login → Subscribe to stocks → Close browser
- Reopen browser → Verify auto-login
- Verify subscriptions restored
- Verify price updates resume

### 4. Error Handling
- Try to register with existing email
- Try to login with wrong password
- Try to subscribe without authentication
- Test invalid stock ticker
- Test duplicate subscription

## Performance Notes

- Stock price generation: O(n) where n = 5 stocks
- Broadcasting: O(u × s) where u = users, s = subscribed stocks per user
- MongoDB queries: Indexed by email for fast lookups
- Socket.io: Efficient binary protocol
- React rendering: Optimized with proper state management

## API Layer Structure

### Frontend API Functions (`frontend/lib/api/`)

#### Authentication (`auth.ts`)
- `loginUser(credentials)` - Handles user login
- `registerUser(credentials)` - Handles user registration
- Returns: `{token, user: {email, subscriptions}}`

#### Subscriptions (`subscriptions.ts`)
- `getSubscriptions(token)` - Fetch user subscriptions
- `subscribeToStock(ticker, token)` - Subscribe to a stock
- `unsubscribeFromStock(ticker, token)` - Unsubscribe from a stock
- Returns: `{subscriptions: string[]}`

### Configuration (`frontend/config/api.ts`)
- `API_URL` - Backend base URL (http://localhost:4000)
- `API_ENDPOINTS` - Organized endpoint paths
  - `auth.login` - Login endpoint
  - `auth.register` - Register endpoint
  - `subscriptions.base` - Subscriptions endpoint
  - `subscriptions.delete(ticker)` - Unsubscribe endpoint

## UI/UX Features

### Light Mode Theme
- Gradient backgrounds (blue, indigo, purple)
- White/semi-transparent cards with shadows
- Color-coded stock cards (blue for subscribed, purple for available)
- Gradient text for headings
- Professional, clean design

### Loading States
- Animated loader with gradient icon
- Pulsing effects and background orbs
- Loading bar with shimmer animation
- Bouncing dots indicator

### Stock Display
- Real-time price updates every second
- Trend indicators (up/down arrows)
- Price change badges (green/red)
- Timestamp for last update
- Subscribe/unsubscribe buttons
- Hover effects and transitions

## Future Enhancements

1. **Real Market Data**: Integrate with Alpha Vantage or Yahoo Finance API
2. **Price History**: Store historical prices, display charts
3. **Alerts**: Email/push notifications for price thresholds
4. **Portfolio**: Track holdings, calculate profit/loss
5. **Search**: Search and filter stocks
6. **Admin Panel**: Manage users and stocks
7. **WebSocket Reconnection**: Automatic reconnection with exponential backoff
8. **TypeScript Backend**: Convert backend to TypeScript
9. **Unit Tests**: Jest for backend, React Testing Library for frontend
10. **Docker**: Containerize application for easy deployment
11. **Environment Management**: Separate dev/prod configurations
12. **Error Boundaries**: React error boundaries for graceful failures
13. **Pagination**: Handle large stock lists efficiently
14. **Dark Mode Toggle**: User preference for light/dark theme
