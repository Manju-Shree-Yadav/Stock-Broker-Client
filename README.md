# Stock Broker Client Web Dashboard

Real-time stock broker client dashboard for the EscrowStack CUPI assignment.

**Note: Please check out documentation for detailed explaination of Architecture, Flow and User Manual**

## Assignment Coverage

- Login with an email address.
- Subscribe to supported stock tickers by code.
- Supports exactly five demo stocks: `GOOG`, `TSLA`, `AMZN`, `META`, `NVDA`.
- Updates subscribed stock prices every second without refreshing the dashboard.
- Supports multiple users at the same time. Each user only receives live updates for the stocks they subscribed to.

## Tech Stack

**Frontend**

- React.js with TypeScript
- Vite
- Socket.IO client
- Plain responsive CSS

**Backend**

- Node.js
- Express.js
- Socket.IO
- JWT for lightweight email-session tokens
- In-memory users and subscriptions for a simple assignment demo

## Quick Start

Open two terminals from the project root.

**Backend**

```bash
cd backend
npm install
npm run dev
```

Backend runs at `http://localhost:4000`.

**Frontend**

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`.

## Demo Flow

1. Open `http://localhost:5173`.
2. Login with any email, for example `alice@example.com`.
3. Subscribe to `GOOG` or another supported ticker.
4. Open a second browser or incognito window.
5. Login as another email, for example `bob@example.com`.
6. Subscribe Bob to a different ticker such as `TSLA`.
7. Both dashboards update every second, independently, without refresh.

## Verification

```bash
cd backend
npm test
```

```bash
cd frontend
npm run build
```

## Notes

This project intentionally uses generated demo prices rather than a live market API, as allowed by the assignment. Data is stored in memory, so users and subscriptions reset when the backend restarts.
