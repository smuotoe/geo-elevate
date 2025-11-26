import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { useAuth } from '../contexts/AuthContext';

interface SignupScreenProps {
    onBackClick: () => void;
}

export const SignupScreen: React.FC<SignupScreenProps> = ({ onBackClick }) => {
    const { signup } = useAuth();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Validation
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setIsLoading(true);

        try {
            await signup({ username, email, password });
        } catch (err: any) {
            console.error('Signup error:', err);

            // Handle different types of errors
            if (err.response) {
                const status = err.response.status;
                const data = err.response.data;

                if (status === 400) {
                    // Usually "Username already registered" or "Email already registered"
                    setError(data?.detail || 'Account creation failed. Please check your details.');
                } else if (status === 422) {
                    setError('Please check your input and try again.');
                } else if (status >= 500) {
                    setError('Server error. Please try again later.');
                } else {
                    setError(data?.detail || 'Signup failed. Please try again.');
                }
            } else if (err.request) {
                setError('Unable to connect to the server. Please check your internet connection.');
            } else {
                setError('An unexpected error occurred. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const getPasswordStrength = () => {
        if (password.length === 0) return '';
        if (password.length < 6) return 'Weak';
        if (password.length < 10) return 'Medium';
        return 'Strong';
    };

    const getPasswordColor = () => {
        const strength = getPasswordStrength();
        if (strength === 'Weak') return 'text-red-500';
        if (strength === 'Medium') return 'text-yellow-500';
        if (strength === 'Strong') return 'text-green-500';
        return '';
    };

    return (
        <div className="flex flex-col h-full max-w-md mx-auto p-6 pt-12 justify-center space-y-6">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-2"
            >
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onBackClick}
                    className="mb-4"
                >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back
                </Button>
                <h1 className="text-4xl font-bold text-elevate-text dark:text-elevate-text-dark">
                    Create Account
                </h1>
                <p className="text-elevate-subtext dark:text-elevate-subtext-dark">
                    Join GeoElevate and compete globally
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
                                placeholder="Choose a username"
                                required
                                minLength={3}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-elevate-text dark:text-elevate-text-dark mb-1">
                                Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-elevate-text dark:text-elevate-text-dark focus:outline-none focus:ring-2 focus:ring-elevate-primary"
                                placeholder="your@email.com"
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
                                placeholder="At least 6 characters"
                                required
                                minLength={6}
                            />
                            {password && (
                                <p className={`text-xs mt-1 ${getPasswordColor()}`}>
                                    Password strength: {getPasswordStrength()}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-elevate-text dark:text-elevate-text-dark mb-1">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-elevate-text dark:text-elevate-text-dark focus:outline-none focus:ring-2 focus:ring-elevate-primary"
                                placeholder="Confirm your password"
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
                                    Creating account...
                                </>
                            ) : (
                                <>
                                    <UserPlus className="w-5 h-5 mr-2" />
                                    Sign Up
                                </>
                            )}
                        </Button>
                    </form>
                </Card>
            </motion.div>
        </div>
    );
};
