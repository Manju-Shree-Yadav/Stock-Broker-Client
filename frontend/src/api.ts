const API_URL = import.meta.env.VITE_API_URL || '';

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    }
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Request failed');
  }

  return data;
}

export type AuthResponse = {
  token: string;
  user: {
    email: string;
    subscriptions: string[];
  };
};

export type SubscriptionResponse = {
  token: string;
  subscriptions: string[];
  supportedStocks: string[];
};

export type StockPrice = {
  ticker: string;
  price: number;
  timestamp: number;
};

export function login(email: string) {
  return request<AuthResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email })
  });
}

export function getSubscriptions(token: string) {
  return request<SubscriptionResponse>('/api/subscriptions', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}

export function subscribeToStock(token: string, ticker: string) {
  return request<SubscriptionResponse>('/api/subscriptions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ ticker })
  });
}

export function unsubscribeFromStock(token: string, ticker: string) {
  return request<SubscriptionResponse>(`/api/subscriptions/${ticker}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}

export function getPrices(token: string) {
  return request<{ prices: StockPrice[] }>('/api/prices', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}

export { API_URL };
