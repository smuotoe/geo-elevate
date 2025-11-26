import React from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Home, Trophy, Eye } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

interface ResultScreenProps {
    score: number;
    totalQuestions: number;
    isHighScore?: boolean;
    onRetry: () => void;
    onHome: () => void;
    onReview: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({ score, totalQuestions, isHighScore, onRetry, onHome, onReview }) => {
    return (
        <div className="flex flex-col h-full max-w-md mx-auto p-6 pt-12 items-center justify-center space-y-8">

            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center space-y-2"
            >
                <h2 className="text-3xl font-bold text-elevate-text dark:text-elevate-text-dark">Session Complete!</h2>
                <p className="text-elevate-subtext dark:text-elevate-subtext-dark">Great effort.</p>
            </motion.div>

            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="w-full"
            >
                <Card className="flex flex-col items-center p-8 space-y-4 border-t-4 border-t-elevate-primary dark:border-t-blue-500 relative overflow-hidden">
                    {isHighScore && (
                        <motion.div
                            initial={{ y: -50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5, type: "spring" }}
                            className="absolute top-0 right-0 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-bl-lg shadow-sm"
                        >
                            NEW HIGH SCORE!
                        </motion.div>
                    )}
                    <div className={`p-4 rounded-full mb-2 ${isHighScore ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400' : 'bg-blue-50 dark:bg-blue-900/30 text-elevate-primary dark:text-blue-400'}`}>
                        <Trophy className="w-10 h-10" />
                    </div>
                    <div className="text-center">
                        <span className="text-sm text-elevate-subtext dark:text-elevate-subtext-dark uppercase tracking-wider font-semibold">Final Score</span>
                        <div className="text-6xl font-black text-elevate-text dark:text-elevate-text-dark mt-2">{score}</div>
                    </div>
                    <div className="w-full h-px bg-gray-100 dark:bg-gray-700 my-4" />
                    <div className="flex justify-between w-full text-sm">
                        <span className="text-elevate-subtext dark:text-elevate-subtext-dark">Questions</span>
                        <span className="font-bold text-elevate-text dark:text-elevate-text-dark">{totalQuestions}</span>
                    </div>
                </Card>
            </motion.div>

            <div className="w-full space-y-3">
                <Button onClick={onReview} variant="outline" fullWidth size="lg">
                    <Eye className="w-5 h-5 mr-2" />
                    Review Answers
                </Button>
                <Button onClick={onRetry} fullWidth size="lg">
                    <RefreshCw className="w-5 h-5 mr-2" />
                    Play Again
                </Button>
                <Button onClick={onHome} variant="ghost" fullWidth>
                    <Home className="w-5 h-5 mr-2" />
                    Back to Home
                </Button>
            </div>
        </div>
    );
};
