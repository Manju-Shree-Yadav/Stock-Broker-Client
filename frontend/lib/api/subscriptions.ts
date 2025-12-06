import { API_ENDPOINTS } from '@/config/api';

export interface SubscriptionResponse {
    subscriptions: string[];
    supportedStocks?: string[];
}

export const getSubscriptions = async (token: string): Promise<SubscriptionResponse> => {
    const response = await fetch(API_ENDPOINTS.subscriptions.base, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch subscriptions');
    }

    return data;
};

export const subscribeToStock = async (ticker: string, token: string): Promise<SubscriptionResponse> => {
    const response = await fetch(API_ENDPOINTS.subscriptions.base, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ticker }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || 'Failed to subscribe');
    }

    return data;
};

export const unsubscribeFromStock = async (ticker: string, token: string): Promise<SubscriptionResponse> => {
    const response = await fetch(API_ENDPOINTS.subscriptions.delete(ticker), {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || 'Failed to unsubscribe');
    }

    return data;
};
