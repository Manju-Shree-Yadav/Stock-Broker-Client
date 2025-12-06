import { API_ENDPOINTS } from '@/config/api';

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterCredentials {
    email: string;
    password: string;
}

export interface AuthResponse {
    token: string;
    user: {
        email: string;
        subscriptions: string[];
    };
}

export const loginUser = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await fetch(API_ENDPOINTS.auth.login, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || 'Login failed');
    }

    return data;
};

export const registerUser = async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    const response = await fetch(API_ENDPOINTS.auth.register, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
    }

    return data;
};
