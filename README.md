# Stock Broker Client Dashboard

A Vercel-deployed React and Node.js dashboard for tracking generated stock prices in real time.

## Live Application

[Open the production dashboard](https://stock-broker-client-assessment.vercel.app)

**Note: Please check out documentation for detailed explaination of Architecture, Flow and User Manual**

## Assignment Coverage

- Email-only client login.
- Subscribe and unsubscribe by stock ticker.
- Supports `GOOG`, `TSLA`, `AMZN`, `META`, and `NVDA`.
- Prices update every second without refreshing the page.
- Multiple browser sessions can maintain different subscriptions and update independently.

## Tech Stack

Frontend:

- React 19 and TypeScript
- Vite
- Lucide icons
- Responsive CSS
- One-second authenticated HTTP polling

Backend:

- Node.js
- Express 5
- JWT authentication
- Vercel Functions
- Stateless JWT-backed subscriptions

## Architecture

The React app and Express API are deployed together on Vercel. Subscription state is embedded in a refreshed JWT, so serverless function cold starts do not lose the active browser session.

The frontend calls `GET /api/prices` every second. The endpoint reads the authenticated user's subscriptions from the JWT and returns generated prices only for those tickers.

## Local Development

Backend:

```bash
cd backend
npm install
npm run dev
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`. Vite proxies `/api` requests to `http://localhost:4000`.

## Verification

```bash
cd backend
npm test
```

```bash
npm run build
```

## Deployment

```bash
npx vercel deploy --prod
```

The deployment configuration is defined in `vercel.json`. The root `api/index.js` exports the Express application as a Vercel Function.
