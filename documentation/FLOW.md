# Application Flow and Verification

## Runtime Flow

The app has two running services:

```text
React/Vite frontend: http://localhost:5173
Node backend:        http://localhost:4000
```

The frontend uses REST calls for user actions and Socket.IO for live price updates.

## Start the Application

Backend:

```powershell
cd backend
npm install
npm run dev
```

Frontend:

```powershell
cd frontend
npm install
npm run dev
```

Open:

```text
http://localhost:5173
```

## Login Flow

1. User enters an email address.
2. React calls `POST /api/auth/login`.
3. Backend creates or loads the in-memory user.
4. Backend returns a JWT token and user object.
5. React stores the token and email in `localStorage`.
6. React loads subscriptions using `GET /api/subscriptions`.
7. React opens a Socket.IO connection.
8. React emits `authenticate` with the JWT token.
9. Backend emits `auth-success`.

## Subscribe Flow

1. User clicks a supported ticker or types one manually.
2. React calls `POST /api/subscriptions`.
3. Backend validates that the ticker is one of:

```text
GOOG, TSLA, AMZN, META, NVDA
```

4. Backend adds the ticker to that user's in-memory subscription list.
5. Backend returns the updated subscription list.
6. React updates the dashboard.
7. React emits `update-subscriptions` to Socket.IO.
8. Backend refreshes the socket session's subscribed tickers.
9. The socket starts sending that ticker's live prices.

## Unsubscribe Flow

1. User clicks the remove button on a subscribed stock card.
2. React calls `DELETE /api/subscriptions/:ticker`.
3. Backend removes the ticker from the user.
4. React removes the stock card and clears its price from state.
5. React emits `update-subscriptions`.
6. Backend stops sending that ticker to that user's socket.

## Live Price Flow

Every second, the backend:

1. Generates a new random price for each supported stock.
2. Checks all authenticated socket sessions.
3. Sends each connected user only their subscribed stocks.
4. React receives `stock-update`.
5. React calculates the price change from the previous value.
6. The stock card updates without refreshing the page.

## Multi-User Flow

To prove the assignment requirement:

1. Open `http://localhost:5173` in a normal browser window.
2. Login as `alice@example.com`.
3. Subscribe Alice to `GOOG`.
4. Open an incognito/private browser window.
5. Login as `bob@example.com`.
6. Subscribe Bob to `TSLA`.
7. Keep both dashboards open side by side.

Expected result:

- Alice receives live updates for `GOOG`.
- Bob receives live updates for `TSLA`.
- Neither user receives the other user's unsubscribed ticker.
- Both dashboards update every second without page refresh.

## API Endpoint Summary

| Purpose | Method | Endpoint | Auth |
| --- | --- | --- | --- |
| Health check | GET | `/health` | No |
| Email login | POST | `/api/auth/login` | No |
| Register-compatible login | POST | `/api/auth/register` | No |
| Get subscriptions | GET | `/api/subscriptions` | Bearer token |
| Subscribe | POST | `/api/subscriptions` | Bearer token |
| Unsubscribe | DELETE | `/api/subscriptions/:ticker` | Bearer token |

## Socket Event Summary

| Direction | Event | Purpose |
| --- | --- | --- |
| Client to server | `authenticate` | Authenticate socket with JWT |
| Client to server | `update-subscriptions` | Refresh socket subscription set |
| Server to client | `auth-success` | Confirm socket authentication |
| Server to client | `auth-error` | Report invalid socket auth |
| Server to client | `stock-update` | Send live subscribed stock price |

## Verification Commands

Backend syntax check:

```powershell
cd backend
npm test
```

Frontend production build:

```powershell
cd frontend
npm run build
```

Backend health check:

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

## Common Issues

### Backend Not Running

Symptom:

```text
Failed to fetch
```

Fix:

```powershell
cd backend
npm run dev
```

### Frontend Port Is Busy

Vite defaults to port `5173`. Stop the process using that port or run Vite on another port.

### Socket Is Disconnected

Make sure:

- Backend is running on `http://localhost:4000`.
- Frontend was started after dependencies were installed.
- The browser has a valid token from email login.

## Final Checklist

- Backend runs on port `4000`.
- Frontend runs on port `5173`.
- Login works with email only.
- Five supported stocks are available.
- User can subscribe by ticker.
- User can unsubscribe.
- Prices update every second.
- No page refresh is required.
- Two users can subscribe to different stocks at the same time.
- Each user only receives their own subscribed stock updates.
