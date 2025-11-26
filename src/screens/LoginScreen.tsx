import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LogIn, UserPlus, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { useAuth } from '../contexts/AuthContext';

interface LoginScreenProps {
    onSignupClick: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onSignupClick }) => {
    const { login, continueAsGuest } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await login({ username, password });
        } catch (err: any) {
            console.error('Login error:', err);

            // Handle different types of errors
            if (err.response) {
                // Server responded with an error status code
                const status = err.response.status;
                const data = err.response.data;

                if (status === 401) {
                    setError('Incorrect username or password.');
                } else if (status === 422) {
                    // Validation error (e.g. missing fields)
                    setError('Please check your input and try again.');
                } else if (status >= 500) {
                    setError('Server error. Please try again later.');
                } else {
                    // Use the error message from the server if available
                    setError(data?.detail || 'Login failed. Please try again.');
                }
            } else if (err.request) {
                // Request was made but no response received (Network error)
                setError('Unable to connect to the server. Please check your internet connection.');
            } else {
                // Something happened in setting up the request
                setError('An unexpected error occurred. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full max-w-md mx-auto p-6 pt-12 justify-center space-y-6">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-2"
            >
                <h1 className="text-4xl font-bold text-elevate-text dark:text-elevate-text-dark">
                    Welcome to GeoElevate
                </h1>
                <p className="text-elevate-subtext dark:text-elevate-subtext-dark">
                    Test your geography knowledge
                </p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
            >
                <Card className="p-6 space-y-4">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-elevate-text dark:text-elevate-text-dark mb-1">
                                Username
                            </label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-elevate-text dark:text-elevate-text-dark focus:outline-none focus:ring-2 focus:ring-elevate-primary"
                                placeholder="Enter your username"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-elevate-text dark:text-elevate-text-dark mb-1">
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-elevate-text dark:text-elevate-text-dark focus:outline-none focus:ring-2 focus:ring-elevate-primary"
                                placeholder="Enter your password"
                                required
                            />
                        </div>

                        {error && (
                            <div className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                                {error}
                            </div>
                        )}

                        <Button
                            type="submit"
                            fullWidth
                            disabled={isLoading}
                            className="flex items-center justify-center"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                    Logging in...
                                </>
                            ) : (
                                <>
                                    <LogIn className="w-5 h-5 mr-2" />
                                    Log In
                                </>
                            )}
                        </Button>
                    </form>

                    <div className="text-center text-sm text-elevate-subtext dark:text-elevate-subtext-dark">
                        Don't have an account?{' '}
                        <button
                            onClick={onSignupClick}
                            className="text-elevate-primary hover:underline font-medium"
                        >
                            Sign Up
                        </button>
                    </div>
                </Card>
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
            >
                <Button
                    variant="ghost"
                    fullWidth
                    onClick={continueAsGuest}
                    className="text-elevate-subtext dark:text-elevate-subtext-dark"
                >
                    <UserPlus className="w-5 h-5 mr-2" />
                    Continue as Guest
                </Button>
            </motion.div>
        </div>
    );
};
