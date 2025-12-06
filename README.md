# Stock Broker Client Web Dashboard

A modern, real-time stock trading dashboard that enables users to track and manage their favorite stocks with live price updates, user authentication, and persistent data storage.

**EscrowStack CUPI Internship Hiring Assignment**

## Problem Statement

Create a Stock broker client web Dashboard that allows the user to do the following:

0. Allows a user to login using his/her email
1. Subscribe to a Supported Stock via the Stock ticker code (e.g., GOOG, TSLA, etc.)
   - Choose 5 stocks to support (e.g., ['GOOG','TSLA','AMZN','META','NVDA'])
2. Update the stock prices of subscribed stock without refreshing the dashboard
3. The app should support at least two users who subscribe to different stocks and the dashboards update asynchronously while both are open

Note: You don't need to get an actual price for these stocks, you can use a random number generator to keep updating the stock prices every second.

## Overview

This full-stack web application provides a seamless stock tracking experience with real-time price updates delivered via WebSocket connections. Users can register, login, subscribe to stocks, and monitor live price changes with visual indicators showing market trends.

### Key Features

- **User Authentication**: Secure email/password registration and login with JWT tokens
- **Real-time Updates**: Live stock prices updated every second via Socket.io
- **Stock Management**: Subscribe/unsubscribe to stocks with persistent storage
- **Multi-user Support**: Independent user sessions with personalized stock lists
- **Visual Indicators**: Color-coded price trends and change indicators
- **Modern UI**: Clean, responsive interface with light mode theme

### Supported Stocks

GOOG, TSLA, AMZN, META, NVDA . . . . etc. 

## Technology Stack

**Backend:**

- Node.js + Express.js (ES6 Modules)
- Socket.io for WebSocket communication
- MongoDB + Mongoose for data persistence
- JWT authentication with bcryptjs password hashing

**Frontend:**

- Next.js 15 with TypeScript
- TailwindCSS for styling
- ShadcnUI component library
- Socket.io-client for real-time updates

## Quick Start

### Prerequisites

- Node.js (v18+)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

### Installation & Setup

**1. Clone the Repository**
```bash
git clone <repository-url>
cd stock
```

**2. Setup MongoDB**

Local MongoDB:
```bash
# Start MongoDB service (default: mongodb://localhost:27017)
```

Or use MongoDB Atlas (cloud):
- Create account at https://www.mongodb.com/cloud/atlas
- Create cluster and get connection string
- Update `MONGODB_URI` in backend/.env

**3. Backend Setup**
```bash
cd backend
npm install

# Create .env file with:
# MONGODB_URI=mongodb://localhost:27017/stock-broker
# JWT_SECRET=your-secret-key-change-this
# JWT_EXPIRE=7d
# PORT=4000

npm start
```

Backend runs on `http://localhost:4000`

**4. Frontend Setup**
```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:3000`

## Usage

1. Open `http://localhost:3000` in your browser
2. Register with email and password (min 6 characters)
3. Login to access the dashboard
4. Subscribe to stocks to receive real-time price updates
5. Unsubscribe anytime to stop receiving updates

<!-- ## Contributing

Contributions are welcome! Please follow these guidelines:

### Code Style
- Follow existing code formatting and structure
- Use TypeScript for frontend code
- Use ES6 modules for backend code
- Write clear, descriptive commit messages

### Pull Request Process
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request with a clear description

### Guidelines
- Test your changes thoroughly before submitting
- Update documentation if you add/change functionality
- Keep PRs focused on a single feature or bug fix
- Ensure code runs without errors
- Maintain consistent code style with existing codebase

### Bug Reports
- Use GitHub Issues to report bugs
- Include clear reproduction steps
- Describe expected vs actual behavior
- Include environment details (OS, Node version, etc.) -->

## License

MIT License

