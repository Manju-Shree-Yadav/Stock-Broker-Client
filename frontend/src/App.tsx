import { FormEvent, useEffect, useMemo, useState } from 'react';
import {
  Activity,
  BellPlus,
  CheckCircle2,
  Clock3,
  LogOut,
  MinusCircle,
  Radio,
  Search,
  TrendingDown,
  TrendingUp,
  UserRound
} from 'lucide-react';
import {
  getPrices,
  getSubscriptions,
  login,
  subscribeToStock,
  unsubscribeFromStock
} from './api';

type StockPrice = {
  ticker: string;
  price: number;
  timestamp: number;
  change?: number;
};

const STOCK_NAMES: Record<string, string> = {
  GOOG: 'Alphabet Inc.',
  TSLA: 'Tesla Inc.',
  AMZN: 'Amazon.com Inc.',
  META: 'Meta Platforms',
  NVDA: 'NVIDIA Corp.'
};

function App() {
  const [email, setEmail] = useState(localStorage.getItem('stockUserEmail') || '');
  const [loginEmail, setLoginEmail] = useState('');
  const [token, setToken] = useState(localStorage.getItem('stockToken') || '');
  const [subscriptions, setSubscriptions] = useState<string[]>([]);
  const [supportedStocks, setSupportedStocks] = useState<string[]>(['GOOG', 'TSLA', 'AMZN', 'META', 'NVDA']);
  const [prices, setPrices] = useState<Record<string, StockPrice>>({});
  const [tickerInput, setTickerInput] = useState('');
  const [status, setStatus] = useState('Waiting for login');
  const [error, setError] = useState('');
  const [isBooting, setIsBooting] = useState(Boolean(token));

  const unsubscribedStocks = useMemo(
    () => supportedStocks.filter((ticker) => !subscriptions.includes(ticker)),
    [subscriptions, supportedStocks]
  );

  useEffect(() => {
    if (!token) {
      setIsBooting(false);
      return;
    }

    let isMounted = true;
    setStatus('Loading subscriptions');

    getSubscriptions(token)
      .then((data) => {
        if (!isMounted) return;
        setSubscriptions(data.subscriptions);
        setSupportedStocks(data.supportedStocks);
      })
      .catch((err) => {
        if (!isMounted) return;
        setError(err instanceof Error ? err.message : 'Could not load subscriptions');
        handleLogout();
      })
      .finally(() => {
        if (isMounted) setIsBooting(false);
      });

    async function refreshPrices() {
      try {
        const data = await getPrices(token);

        if (!isMounted) return;

        setPrices((currentPrices) => {
          const nextPrices = { ...currentPrices };

          data.prices.forEach((price) => {
            const previous = currentPrices[price.ticker];
            nextPrices[price.ticker] = {
              ...price,
              change: previous ? price.price - previous.price : 0
            };
          });

          return nextPrices;
        });
        setStatus(`Live polling ${data.prices.length} subscribed ticker${data.prices.length === 1 ? '' : 's'}`);
      } catch (err) {
        if (!isMounted) return;
        setStatus('Live update interrupted. Retrying');
      }
    }

    refreshPrices();
    const priceInterval = window.setInterval(refreshPrices, 1000);

    return () => {
      isMounted = false;
      window.clearInterval(priceInterval);
    };
  }, [token]);

  async function handleLogin(event: FormEvent) {
    event.preventDefault();
    setError('');

    try {
      const data = await login(loginEmail);
      localStorage.setItem('stockToken', data.token);
      localStorage.setItem('stockUserEmail', data.user.email);
      setToken(data.token);
      setEmail(data.user.email);
      setSubscriptions(data.user.subscriptions);
      setLoginEmail('');
      setStatus('Logged in');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    }
  }

  async function handleSubscribe(ticker: string) {
    setError('');

    try {
      const data = await subscribeToStock(token, ticker);
      localStorage.setItem('stockToken', data.token);
      setToken(data.token);
      setSubscriptions(data.subscriptions);
      setStatus(`Subscribed to ${ticker}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not subscribe');
    }
  }

  async function handleTickerSubmit(event: FormEvent) {
    event.preventDefault();
    const ticker = tickerInput.trim().toUpperCase();

    if (!ticker) return;

    await handleSubscribe(ticker);
    setTickerInput('');
  }

  async function handleUnsubscribe(ticker: string) {
    setError('');

    try {
      const data = await unsubscribeFromStock(token, ticker);
      localStorage.setItem('stockToken', data.token);
      setToken(data.token);
      setSubscriptions(data.subscriptions);
      setPrices((currentPrices) => {
        const nextPrices = { ...currentPrices };
        delete nextPrices[ticker];
        return nextPrices;
      });
      setStatus(`Unsubscribed from ${ticker}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not unsubscribe');
    }
  }

  function handleLogout() {
    localStorage.removeItem('stockToken');
    localStorage.removeItem('stockUserEmail');
    setToken('');
    setEmail('');
    setSubscriptions([]);
    setPrices({});
    setStatus('Waiting for login');
  }

  if (!token) {
    return (
      <main className="login-shell">
        <section className="login-panel">
          <div className="brand-row">
            <span className="brand-mark"><Activity size={24} /></span>
            <span>Stock Broker Client Dashboard</span>
          </div>
          <h1>Track live subscribed stocks per client.</h1>
          <p>
            Login with any email. Open a second browser or incognito window with a different email to show asynchronous updates for separate users.
          </p>
          <form className="login-form" onSubmit={handleLogin}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="client@example.com"
              value={loginEmail}
              onChange={(event) => setLoginEmail(event.target.value)}
              required
            />
            {error && <div className="alert error">{error}</div>}
            <button className="primary-button" type="submit">Login</button>
          </form>
        </section>
      </main>
    );
  }

  return (
    <main className="dashboard-shell">
      <header className="topbar">
        <div>
          <div className="eyebrow"><Radio size={16} /> Live market stream</div>
          <h1>Stock Broker Dashboard</h1>
          <p>Subscribed stocks update every second without refreshing.</p>
        </div>
        <div className="account-strip">
          <div className="account-email"><UserRound size={16} /> {email}</div>
          <button className="ghost-button" onClick={handleLogout} title="Logout">
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </header>

      <section className="status-grid">
        <div className="metric">
          <span>Connection</span>
          <strong>{status}</strong>
        </div>
        <div className="metric">
          <span>Subscribed</span>
          <strong>{subscriptions.length} / {supportedStocks.length}</strong>
        </div>
        <div className="metric">
          <span>Supported tickers</span>
          <strong>{supportedStocks.join(', ')}</strong>
        </div>
      </section>

      {error && <div className="alert error">{error}</div>}
      {isBooting && <div className="alert info">Preparing your dashboard...</div>}

      <section className="subscription-panel">
        <div>
          <h2>Subscribe by ticker</h2>
          <p>Try GOOG, TSLA, AMZN, META, or NVDA.</p>
        </div>
        <form className="ticker-form" onSubmit={handleTickerSubmit}>
          <div className="ticker-input">
            <Search size={18} />
            <input
              value={tickerInput}
              onChange={(event) => setTickerInput(event.target.value)}
              placeholder="Enter ticker"
              maxLength={5}
            />
          </div>
          <button className="primary-button compact" type="submit">
            <BellPlus size={18} />
            Subscribe
          </button>
        </form>
      </section>

      <section className="content-grid">
        <div className="main-column">
          <div className="section-heading">
            <h2>My subscribed stocks</h2>
            <span><Clock3 size={16} /> one-second updates</span>
          </div>

          {subscriptions.length === 0 ? (
            <div className="empty-state">
              <CheckCircle2 size={36} />
              <h3>No subscriptions yet</h3>
              <p>Subscribe to a ticker to start receiving user-specific live prices.</p>
            </div>
          ) : (
            <div className="stock-grid">
              {subscriptions.map((ticker) => (
                <StockCard
                  key={ticker}
                  ticker={ticker}
                  price={prices[ticker]}
                  onUnsubscribe={() => handleUnsubscribe(ticker)}
                />
              ))}
            </div>
          )}
        </div>

        <aside className="side-panel">
          <h2>Available stocks</h2>
          <div className="watchlist">
            {unsubscribedStocks.map((ticker) => (
              <button key={ticker} className="watch-row" onClick={() => handleSubscribe(ticker)}>
                <span>
                  <strong>{ticker}</strong>
                  <small>{STOCK_NAMES[ticker]}</small>
                </span>
                <BellPlus size={18} />
              </button>
            ))}
            {unsubscribedStocks.length === 0 && <p className="muted">All supported stocks are subscribed.</p>}
          </div>
        </aside>
      </section>
    </main>
  );
}

type StockCardProps = {
  ticker: string;
  price?: StockPrice;
  onUnsubscribe: () => void;
};

function StockCard({ ticker, price, onUnsubscribe }: StockCardProps) {
  const change = price?.change || 0;
  const isUp = change >= 0;

  return (
    <article className="stock-card">
      <div className="stock-card-header">
        <div>
          <h3>{ticker}</h3>
          <p>{STOCK_NAMES[ticker]}</p>
        </div>
        <button className="icon-button" onClick={onUnsubscribe} title={`Unsubscribe from ${ticker}`}>
          <MinusCircle size={20} />
        </button>
      </div>
      {price ? (
        <>
          <div className="price-row">
            <strong>${price.price.toFixed(2)}</strong>
            <span className={isUp ? 'change up' : 'change down'}>
              {isUp ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
              {isUp ? '+' : ''}{change.toFixed(2)}
            </span>
          </div>
          <small>Updated {new Date(price.timestamp).toLocaleTimeString()}</small>
        </>
      ) : (
        <div className="loading-price">Waiting for first tick...</div>
      )}
    </article>
  );
}

export default App;
