const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

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
  subscriptions: string[];
  supportedStocks: string[];
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

export { API_URL };
