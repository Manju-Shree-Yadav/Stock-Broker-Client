# Stock Broker Dashboard - Frontend

A modern, multi-page Stock Broker Dashboard built with Next.js, TypeScript, and TailwindCSS.

## 📁 Project Structure

```
frontend/
├── app/
│   ├── page.tsx              # Landing page - redirects to login/dashboard
│   ├── login/
│   │   └── page.tsx         # Login page
│   ├── register/
│   │   └── page.tsx         # Registration page
│   └── dashboard/
│       └── page.tsx         # Main dashboard (protected)
├── components/ui/           # ShadcnUI components
│   ├── button.tsx
│   ├── card.tsx
│   ├── input.tsx
│   └── badge.tsx
└── lib/
    └── utils.ts             # Utility functions
```

## 🚀 Features

### Pages

#### 1. **Landing Page** (`/`)
- Automatically redirects users based on authentication status
- Authenticated users → Dashboard
- Unauthenticated users → Login page

#### 2. **Login Page** (`/login`)
- Email and password authentication
- Error handling and loading states
- Link to registration page
- Automatic redirect to dashboard on success

#### 3. **Register Page** (`/register`)
- New user registration
- Password confirmation validation
- Minimum password length requirement (6 characters)
- Link to login page
- Automatic redirect to dashboard on success

#### 4. **Dashboard** (`/dashboard`)
- **Protected Route** - Requires authentication
- Real-time stock price updates via WebSocket
- Subscribe/unsubscribe to stocks (GOOG, TSLA, AMZN, META, NVDA)
- Visual price trend indicators (up/down arrows)
- Price change tracking
- User email display
- Logout functionality

## 🎨 Design Features

- **Dark Theme**: Gradient background (slate-900 → slate-800)
- **Responsive Design**: Mobile-first approach
- **Real-time Updates**: Live stock prices every second
- **Visual Feedback**: Color-coded price changes (green=up, red=down)
- **ShadcnUI Components**: Professional, accessible UI components

## 🔐 Authentication Flow

1. User visits `/` → Auto-redirect based on token
2. No token → `/login`
3. Has token → `/dashboard`
4. Login/Register success → Token saved → `/dashboard`
5. Logout → Token removed → `/login`

## 🔌 API Integration

### Backend Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/subscriptions` - Get user's subscriptions
- `POST /api/subscriptions` - Subscribe to a stock
- `DELETE /api/subscriptions/:ticker` - Unsubscribe from a stock

### WebSocket Events
- `connect` - Socket connection established
- `authenticate` - Send JWT token for authentication
- `auth-success` - Authentication successful
- `auth-error` - Authentication failed
- `stock-update` - Receive real-time price updates

## 📦 Technologies

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **TailwindCSS** - Utility-first CSS
- **ShadcnUI** - High-quality UI components
- **Socket.io-client** - Real-time WebSocket communication
- **Lucide React** - Icon library

## 🛠️ Setup Instructions

1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```

2. Start development server:
   ```bash
   npm run dev
   ```

3. Open browser:
   ```
   http://localhost:3000
   ```

## 🔑 Environment Variables

The frontend connects to the backend at `http://localhost:4000` by default. Make sure the backend server is running.

## 📱 User Experience

### First-Time Users
1. Visit homepage
2. Redirected to `/login`
3. Click "Register here"
4. Fill registration form
5. Auto-redirect to dashboard
6. Subscribe to stocks
7. View real-time prices

### Returning Users
1. Visit homepage
2. Auto-redirect to `/login`
3. Enter credentials
4. Auto-redirect to dashboard
5. Continue monitoring stocks

## 🎯 Key Features

- **Session Persistence**: JWT token stored in localStorage
- **Auto-redirect**: Smart routing based on authentication
- **Real-time Updates**: Stock prices update every second
- **Visual Indicators**: Trending up/down icons with color coding
- **Error Handling**: User-friendly error messages
- **Loading States**: Visual feedback during async operations
- **Responsive Layout**: Works on desktop, tablet, and mobile

## 🐛 Error Handling

- Connection errors → User-friendly messages
- Authentication failures → Redirect to login
- Subscription errors → Inline error display
- Socket disconnection → Automatic reconnection attempts

## 🔒 Security

- JWT token authentication
- Protected dashboard route
- Token validation on page load
- Automatic logout on auth failure
- Secure password requirements (min 6 characters)
