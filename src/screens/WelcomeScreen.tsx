import React from 'react';
import { motion } from 'framer-motion';
import { LogIn, UserPlus, Play } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

interface WelcomeScreenProps {
    onLoginClick: () => void;
    onSignupClick: () => void;
    onGuestClick: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
    onLoginClick,
    onSignupClick,
    onGuestClick,
}) => {
    return (
        <div className="flex flex-col h-full max-w-md mx-auto p-6 pt-12 justify-center space-y-8">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-4"
            >
                <h1 className="text-5xl font-bold text-elevate-text dark:text-elevate-text-dark">
                    GeoElevate
                </h1>
                <p className="text-xl text-elevate-subtext dark:text-elevate-subtext-dark">
                    Master world geography through interactive challenges
                </p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="space-y-4"
            >
                <Card className="p-6 space-y-4">
                    <Button
                        onClick={onLoginClick}
                        fullWidth
                        size="lg"
                        className="flex items-center justify-center"
                    >
                        <LogIn className="w-5 h-5 mr-2" />
                        Log In
                    </Button>

                    <Button
                        onClick={onSignupClick}
                        variant="secondary"
                        fullWidth
                        size="lg"
                        className="flex items-center justify-center"
                    >
                        <UserPlus className="w-5 h-5 mr-2" />
                        Sign Up
                    </Button>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white dark:bg-gray-900 text-elevate-subtext dark:text-elevate-subtext-dark">
                                or
                            </span>
                        </div>
                    </div>

                    <Button
                        onClick={onGuestClick}
                        variant="outline"
                        fullWidth
                        size="lg"
                        className="flex items-center justify-center"
                    >
                        <Play className="w-5 h-5 mr-2" />
                        Continue as Guest
                    </Button>
                </Card>

                <p className="text-center text-xs text-elevate-subtext dark:text-elevate-subtext-dark">
                    Create an account to compete on global leaderboards
                </p>
            </motion.div>
        </div>
    );
};
