# User Manual

## Open the Dashboard

[https://stock-broker-client-assessment.vercel.app](https://stock-broker-client-assessment.vercel.app)

## Login

Enter any valid email address and select `Login`. No password is required for this assignment demo.

## Subscribe

Supported stocks:

```text
GOOG, TSLA, AMZN, META, NVDA
```

Subscribe by clicking an available stock or entering its ticker in the subscription field.

## Live Updates

Subscribed cards update every second without refreshing the page. Each card shows the ticker, company, generated price, movement, and update time.

## Unsubscribe

Click the remove icon on a subscribed card. The ticker returns to the available stock list.

## Demonstrate Two Users

1. Login as Alice in a normal browser window.
2. Subscribe Alice to `GOOG`.
3. Login as Bob in an incognito window.
4. Subscribe Bob to `TSLA`.
5. Keep both dashboards open and observe their independent updates.

## Notes

- Prices are generated demo values, not real market data.
- Subscriptions persist in the browser JWT until logout or token expiry.
- Logging in again starts a fresh subscription list.

## Troubleshooting

If live updates stop, confirm the browser is online and refresh the page. The saved JWT restores the current authenticated subscription list.
