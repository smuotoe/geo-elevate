import apiClient from './client';

export interface User {
    id: number;
    username: string;
    email: string;
    created_at: string;
    is_active: boolean;
}

export interface LoginCredentials {
    username: string;
    password: string;
}

export interface SignupData {
    username: string;
    email: string;
    password: string;
}

export interface AuthResponse {
    access_token: string;
    token_type: string;
    user: User;
}

export const authAPI = {
    async signup(data: SignupData): Promise<AuthResponse> {
        const response = await apiClient.post<AuthResponse>('/api/auth/signup', data);
        return response.data;
    },

    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        const response = await apiClient.post<AuthResponse>('/api/auth/login', credentials);
        return response.data;
    },

    async getCurrentUser(): Promise<User> {
        const response = await apiClient.get<User>('/api/auth/me');
        return response.data;
    },
};
