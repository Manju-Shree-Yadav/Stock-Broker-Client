# User Manual

## Purpose

This dashboard lets stock broker clients login with an email address, subscribe to supported stock tickers, and watch live demo prices update every second.

## Requirements

- Node.js 18 or newer
- npm
- No MongoDB is required
- No external stock API key is required

## Install and Run

Open two terminals from the project root.

### Terminal 1: Backend

```powershell
cd backend
npm install
npm run dev
```

Expected backend URL:

```text
http://localhost:4000
```

### Terminal 2: Frontend

```powershell
cd frontend
npm install
npm run dev
```

Expected frontend URL:

```text
http://localhost:5173
```

## Login

1. Open `http://localhost:5173`.
2. Enter any valid email address, for example:

```text
alice@example.com
```

3. Click `Login`.

There is no password in this assignment version. The backend creates a lightweight demo user from the email address and returns a JWT token.

## Subscribe to a Stock

Supported stock tickers:

```text
GOOG, TSLA, AMZN, META, NVDA
```

You can subscribe in two ways:

- Click a stock in the `Available stocks` panel.
- Type a ticker into the `Subscribe by ticker` input and click `Subscribe`.

After subscribing, the stock appears in `My subscribed stocks`.

## Watch Live Updates

Subscribed stock cards update every second.

Each card shows:

- Ticker code
- Company name
- Current generated price
- Price movement since the previous update
- Last update time
- Unsubscribe button

The page does not refresh. Updates arrive through Socket.IO.

## Unsubscribe

Click the remove button on a subscribed stock card. The stock disappears from the active list and returns to the available list.

## Test Two Users

1. Open the app in a normal browser window.
2. Login as:

```text
alice@example.com
```

3. Subscribe Alice to `GOOG`.
4. Open an incognito/private browser window.
5. Login as:

```text
bob@example.com
```

6. Subscribe Bob to `TSLA`.
7. Keep both windows open.

Expected behavior:

- Alice sees live `GOOG` updates.
- Bob sees live `TSLA` updates.
- Both dashboards update asynchronously.
- Each dashboard only receives prices for its subscribed stocks.

## API Quick Reference

### Login

```powershell
curl -X POST http://localhost:4000/api/auth/login `
  -H "Content-Type: application/json" `
  -d "{\"email\":\"alice@example.com\"}"
```

### Health Check

```powershell
curl http://localhost:4000/health
```

Expected response:

```json
{
  "status": "ok",
  "supportedStocks": ["GOOG", "TSLA", "AMZN", "META", "NVDA"]
}
```

### Subscribe

Use the JWT token returned by login.

```powershell
curl -X POST http://localhost:4000/api/subscriptions `
  -H "Content-Type: application/json" `
  -H "Authorization: Bearer <token>" `
  -d "{\"ticker\":\"GOOG\"}"
```

### Get Subscriptions

```powershell
curl http://localhost:4000/api/subscriptions `
  -H "Authorization: Bearer <token>"
```

### Unsubscribe

```powershell
curl -X DELETE http://localhost:4000/api/subscriptions/GOOG `
  -H "Authorization: Bearer <token>"
```

## Troubleshooting

### Frontend Cannot Connect to Backend

Make sure the backend is running:

```powershell
curl http://localhost:4000/health
```

### Port 4000 Already in Use

Stop the process using the port or start the backend with another `PORT` environment variable.

### Port 5173 Already in Use

Stop the process using the port or let Vite choose another available port.

### Subscriptions Disappear After Restart

This is expected. The assignment implementation stores users and subscriptions in memory, so data resets when the backend restarts.

## Success Checklist

- Backend starts successfully.
- Frontend starts successfully.
- Login works with email only.
- Supported stocks list shows five tickers.
- Subscribe works.
- Unsubscribe works.
- Live prices update every second.
- Two users can use the app at the same time.
- Each user receives only their subscribed stock updates.
