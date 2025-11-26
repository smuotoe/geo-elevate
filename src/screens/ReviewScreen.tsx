import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Check, X } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import type { QuestionResult } from './GameScreen';

interface ReviewScreenProps {
    results: QuestionResult[];
    onBack: () => void;
}

export const ReviewScreen: React.FC<ReviewScreenProps> = ({ results, onBack }) => {
    const correctCount = results.filter(r => r.isCorrect).length;
    const accuracy = results.length > 0 ? Math.round((correctCount / results.length) * 100) : 0;

    return (
        <div className="flex flex-col h-full max-w-md mx-auto p-6 pt-8 space-y-6 overflow-y-auto">
            {/* Header */}
            <div className="flex items-center space-x-4 sticky top-0 bg-elevate-bg dark:bg-elevate-bg-dark pb-4 z-10">
                <Button variant="ghost" size="sm" onClick={onBack} className="p-2 rounded-full">
                    <ArrowLeft className="w-6 h-6" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold text-elevate-text dark:text-elevate-text-dark">Review Answers</h1>
                    <p className="text-sm text-elevate-subtext dark:text-elevate-subtext-dark">
                        {correctCount}/{results.length} correct ({accuracy}%)
                    </p>
                </div>
            </div>

            {/* Results List */}
            <div className="space-y-4 pb-6">
                {results.map((result, index) => (
                    <motion.div
                        key={`${result.country.name}-${index}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                    >
                        <Card className={`p-4 ${result.isCorrect ? 'border-l-4 border-l-green-500' : 'border-l-4 border-l-red-500'}`}>
                            <div className="flex items-start space-x-4">
                                {/* Flag */}
                                <div className="w-16 h-12 flex-shrink-0 shadow-md rounded overflow-hidden bg-gray-100 dark:bg-gray-800">
                                    <img
                                        src={`https://flagcdn.com/w80/${result.country.code.toLowerCase()}.png`}
                                        alt={`Flag of ${result.country.name}`}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center space-x-2 mb-2">
                                        {result.isCorrect ? (
                                            <Check className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                                        ) : (
                                            <X className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
                                        )}
                                        <h3 className="font-bold text-elevate-text dark:text-elevate-text-dark truncate">
                                            {result.country.name}
                                        </h3>
                                    </div>

                                    <div className="space-y-1 text-sm">
                                        {result.mode === 'capitals' ? (
                                            <>
                                                <div className="flex items-center">
                                                    <span className="text-elevate-subtext dark:text-elevate-subtext-dark mr-2">Capital:</span>
                                                    <span className="font-semibold text-elevate-text dark:text-elevate-text-dark">{result.correctAnswer}</span>
                                                </div>
                                                {!result.isCorrect && (
                                                    <div className="flex items-center">
                                                        <span className="text-elevate-subtext dark:text-elevate-subtext-dark mr-2">You answered:</span>
                                                        <span className="font-semibold text-red-600 dark:text-red-400">{result.userAnswer}</span>
                                                    </div>
                                                )}
                                            </>
                                        ) : (
                                            <>
                                                <div className="flex items-center">
                                                    <span className="text-elevate-subtext dark:text-elevate-subtext-dark mr-2">Correct:</span>
                                                    <span className="font-semibold text-elevate-text dark:text-elevate-text-dark">{result.correctAnswer}</span>
                                                </div>
                                                {!result.isCorrect && (
                                                    <div className="flex items-center">
                                                        <span className="text-elevate-subtext dark:text-elevate-subtext-dark mr-2">You answered:</span>
                                                        <span className="font-semibold text-red-600 dark:text-red-400">{result.userAnswer}</span>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};
