export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export const API_ENDPOINTS = {
    auth: {
        login: `${API_URL}/api/auth/login`,
        register: `${API_URL}/api/auth/register`,
    },
    subscriptions: {
        base: `${API_URL}/api/subscriptions`,
        delete: (ticker: string) => `${API_URL}/api/subscriptions/${ticker}`,
    },
};
