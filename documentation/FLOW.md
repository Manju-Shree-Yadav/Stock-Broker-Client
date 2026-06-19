# Application Flow and Verification

## Login

1. User enters an email.
2. React sends `POST /api/auth/login`.
3. Express returns the user and a JWT with an empty subscription list.
4. React stores the token and email in `localStorage`.
5. React loads subscriptions and starts the price polling loop.

## Subscribe

1. User selects or types a supported ticker.
2. React sends `POST /api/subscriptions` with the current JWT.
3. Express validates the ticker.
4. Express returns the updated subscriptions and a refreshed JWT.
5. React stores the refreshed token and rerenders the dashboard.

## Live Prices

1. React requests `GET /api/prices` every second.
2. JWT middleware reads the user's subscriptions.
3. The API generates prices only for those tickers.
4. React compares each result with its previous value.
5. Cards update without a page refresh.

## Unsubscribe

1. User clicks the remove icon.
2. React sends `DELETE /api/subscriptions/:ticker`.
3. Express returns a refreshed JWT without that ticker.
4. React removes the card and continues polling remaining tickers.

## Multi-User Test

1. Open the production URL in a normal window and login as `alice@example.com`.
2. Subscribe Alice to `GOOG`.
3. Open an incognito window and login as `bob@example.com`.
4. Subscribe Bob to `TSLA`.
5. Confirm Alice receives only `GOOG` and Bob receives only `TSLA`.

## Verification Commands

```bash
cd backend
npm test
```

```bash
npm run build
```

```bash
curl https://stock-broker-client-assessment.vercel.app/api/health
```

Expected health response:

```json
{
  "status": "ok",
  "supportedStocks": ["GOOG", "TSLA", "AMZN", "META", "NVDA"]
}
```
