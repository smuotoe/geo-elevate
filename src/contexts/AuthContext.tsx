import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { authAPI, type User, type LoginCredentials, type SignupData } from '../services/api/auth';

interface AuthContextType {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isGuest: boolean;
    isLoading: boolean;
    login: (credentials: LoginCredentials) => Promise<void>;
    signup: (data: SignupData) => Promise<void>;
    logout: () => void;
    continueAsGuest: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isGuest, setIsGuest] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Load auth state from localStorage on mount
    useEffect(() => {
        const loadAuth = async () => {
            const savedToken = localStorage.getItem('auth_token');
            const savedUser = localStorage.getItem('user');
            const guestMode = localStorage.getItem('guest_mode');

            if (guestMode === 'true') {
                setIsGuest(true);
                setIsLoading(false);
                return;
            }

            if (savedToken && savedUser) {
                try {
                    setToken(savedToken);
                    setUser(JSON.parse(savedUser));
                    // Optionally verify token is still valid
                    await authAPI.getCurrentUser();
                } catch (error) {
                    // Token invalid, clear auth
                    localStorage.removeItem('auth_token');
                    localStorage.removeItem('user');
                    setToken(null);
                    setUser(null);
                }
            }
            setIsLoading(false);
        };

        loadAuth();
    }, []);

    const login = async (credentials: LoginCredentials) => {
        try {
            const response = await authAPI.login(credentials);
            setToken(response.access_token);
            setUser(response.user);
            setIsGuest(false);
            localStorage.setItem('auth_token', response.access_token);
            localStorage.setItem('user', JSON.stringify(response.user));
            localStorage.removeItem('guest_mode');
        } catch (error) {
            throw error;
        }
    };

    const signup = async (data: SignupData) => {
        try {
            const response = await authAPI.signup(data);
            setToken(response.access_token);
            setUser(response.user);
            setIsGuest(false);
            localStorage.setItem('auth_token', response.access_token);
            localStorage.setItem('user', JSON.stringify(response.user));
            localStorage.removeItem('guest_mode');
        } catch (error) {
            throw error;
        }
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        setIsGuest(false);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        localStorage.removeItem('guest_mode');
    };

    const continueAsGuest = () => {
        setIsGuest(true);
        localStorage.setItem('guest_mode', 'true');
    };

    const value: AuthContextType = {
        user,
        token,
        isAuthenticated: !!token && !!user,
        isGuest,
        isLoading,
        login,
        signup,
        logout,
        continueAsGuest,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
