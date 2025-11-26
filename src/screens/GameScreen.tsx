import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Loader2, Zap } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { ProgressBar } from '../components/ui/ProgressBar';
import { type Country } from '../data/countries';
import { useCountries } from '../hooks/useCountries';

export type GameMode = 'capitals' | 'flags' | 'speed';

export interface QuestionResult {
    country: Country;
    userAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
    mode: GameMode;
    timeToAnswer?: number; // in milliseconds
}

interface GameScreenProps {
    mode: GameMode;
    onEndGame: (score: number, totalQuestions: number, results: QuestionResult[]) => void;
}

const GAME_DURATION = 60; // seconds for timed modes
const SPEED_MODE_QUESTIONS = 10; // fixed questions for speed mode

// Time-based scoring for speed mode
const calculateSpeedScore = (timeMs: number, isCorrect: boolean): number => {
    if (!isCorrect) return 0;

    // Account for render latency and reaction time
    // We subtract 400ms from the time, effectively giving a "free" buffer
    const RENDER_BUFFER_MS = 400;
    const adjustedTimeMs = Math.max(0, timeMs - RENDER_BUFFER_MS);

    const timeSec = adjustedTimeMs / 1000;
    const baseScore = 100;
    const maxBonus = 400;

    // Exponential decay: maxBonus * e^(-0.8 * time)
    // We use 0.8 coefficient to make the decay slightly less aggressive than 1.0
    const bonus = maxBonus * Math.exp(-0.8 * timeSec);

    const totalScore = baseScore + bonus;

    // Round to nearest integer
    return Math.round(totalScore);
};

export const GameScreen: React.FC<GameScreenProps> = ({ mode, onEndGame }) => {
    const { countries, loading } = useCountries();
    const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
    const [score, setScore] = useState(0);
    const [questionCount, setQuestionCount] = useState(0);
    const [currentCountry, setCurrentCountry] = useState<Country | null>(null);
    const [options, setOptions] = useState<string[]>([]);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [questionHistory, setQuestionHistory] = useState<QuestionResult[]>([]);
    const [bonusPoints, setBonusPoints] = useState<number | null>(null);
    const questionStartTime = useRef<number>(0);

    const isSpeedMode = mode === 'speed';
    const maxQuestions = isSpeedMode ? SPEED_MODE_QUESTIONS : Infinity;

    // Generate a new question
    const generateQuestion = useCallback(() => {
        if (countries.length === 0) return;

        const randomCountry = countries[Math.floor(Math.random() * countries.length)];

        // Generate 3 distractors
        const distractors = new Set<string>();
        while (distractors.size < 3) {
            const randomC = countries[Math.floor(Math.random() * countries.length)];
            // Ensure distinct answers based on mode
            const answerKey = (mode === 'capitals' || mode === 'speed') ? 'capital' : 'name';
            const correctAnswer = randomCountry[answerKey];
            const distractorAnswer = randomC[answerKey];

            if (distractorAnswer && distractorAnswer !== correctAnswer) {
                distractors.add(distractorAnswer);
            }
        }

        const allOptions = Array.from(distractors);
        const answerKey = (mode === 'capitals' || mode === 'speed') ? 'capital' : 'name';
        allOptions.push(randomCountry[answerKey]);
        // Shuffle options
        allOptions.sort(() => Math.random() - 0.5);

        setCurrentCountry(randomCountry);
        setOptions(allOptions);
        setSelectedOption(null);
        setIsCorrect(null);
        setBonusPoints(null);
        // Timer will be started after render in useEffect
    }, [mode, countries]);

    // Initial setup
    useEffect(() => {
        if (!loading && countries.length > 0) {
            generateQuestion();
        }
    }, [loading, countries.length, generateQuestion]);

    // Start timer when question is rendered (after currentCountry changes)
    useEffect(() => {
        if (currentCountry && !selectedOption) {
            questionStartTime.current = Date.now();
        }
    }, [currentCountry, selectedOption]);

    // Timer logic (only for non-speed modes)
    useEffect(() => {
        if (loading || isSpeedMode) return;

        if (timeLeft <= 0) {
            onEndGame(score, questionCount, questionHistory);
            return;
        }
        const timer = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [timeLeft, onEndGame, score, questionCount, loading, questionHistory, isSpeedMode]);

    const handleAnswer = (answer: string) => {
        if (selectedOption || !currentCountry) return; // Prevent double clicking

        const timeToAnswer = Date.now() - questionStartTime.current;
        setSelectedOption(answer);
        const answerKey = (mode === 'capitals' || mode === 'speed') ? 'capital' : 'name';
        const correctAnswer = currentCountry[answerKey];
        const correct = answer === correctAnswer;

        setIsCorrect(correct);
        const newQuestionCount = questionCount + 1;
        setQuestionCount(newQuestionCount);

        // Record this question
        const result: QuestionResult = {
            country: currentCountry,
            userAnswer: answer,
            correctAnswer,
            isCorrect: correct,
            mode,
            timeToAnswer
        };
        setQuestionHistory(prev => [...prev, result]);

        // Calculate score based on mode
        if (isSpeedMode) {
            const points = calculateSpeedScore(timeToAnswer, correct);
            setScore((prev) => prev + points);
            setBonusPoints(points); // Show the bonus
        } else if (correct) {
            setScore((prev) => prev + 100);
        }

        // Check if game should end (speed mode only)
        if (isSpeedMode && newQuestionCount >= maxQuestions) {
            setTimeout(() => {
                onEndGame(score + (isSpeedMode ? calculateSpeedScore(timeToAnswer, correct) : 0), newQuestionCount, [...questionHistory, result]);
            }, 800);
            return;
        }

        // Delay before next question
        setTimeout(() => {
            generateQuestion();
        }, 800);
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-full">
                <Loader2 className="w-8 h-8 animate-spin text-elevate-primary" />
                <p className="mt-4 text-elevate-subtext dark:text-elevate-subtext-dark">Loading countries...</p>
            </div>
        );
    }

    if (!currentCountry) return null;

    return (
        <div className="flex flex-col h-full max-w-md mx-auto p-6 pt-8">
            {/* Top Bar */}
            <div className="flex justify-between items-center mb-8">
                <div className="flex flex-col">
                    <span className="text-xs font-bold text-elevate-subtext dark:text-elevate-subtext-dark uppercase tracking-wider">
                        {isSpeedMode ? 'Question' : 'Time'}
                    </span>
                    {isSpeedMode ? (
                        <span className="text-xl font-mono font-bold text-elevate-text dark:text-elevate-text-dark">
                            {questionCount + 1}/{SPEED_MODE_QUESTIONS}
                        </span>
                    ) : (
                        <span className={`text-xl font-mono font-bold ${timeLeft < 10 ? 'text-red-500' : 'text-elevate-text dark:text-elevate-text-dark'}`}>
                            {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                        </span>
                    )}
                </div>
                <div className="flex flex-col items-end relative">
                    <span className="text-xs font-bold text-elevate-subtext dark:text-elevate-subtext-dark uppercase tracking-wider">Score</span>
                    <span className="text-xl font-mono font-bold text-elevate-primary">{score}</span>

                    {/* Bonus Points Animation */}
                    <AnimatePresence>
                        {bonusPoints !== null && isSpeedMode && (
                            <motion.div
                                initial={{ opacity: 0, y: 0, scale: 0.5 }}
                                animate={{ opacity: 1, y: -10, scale: 1 }}
                                exit={{ opacity: 0, y: -15 }}
                                transition={{ duration: 0.6 }}
                                className="absolute -top-6 right-0 text-2xl font-bold text-yellow-500 dark:text-yellow-400"
                            >
                                +{bonusPoints}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-8">
                {isSpeedMode ? (
                    <ProgressBar progress={(questionCount / SPEED_MODE_QUESTIONS) * 100} color="bg-yellow-500" />
                ) : (
                    <ProgressBar progress={(timeLeft / GAME_DURATION) * 100} color={timeLeft < 10 ? 'bg-red-500' : 'bg-elevate-primary'} />
                )}
            </div>

            {/* Question Area */}
            <div className="flex-1 flex flex-col justify-center space-y-8">
                <div className="text-center space-y-4">
                    <span className="text-sm font-medium text-elevate-subtext dark:text-elevate-subtext-dark bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full inline-flex items-center gap-2">
                        {isSpeedMode && <Zap className="w-4 h-4 text-yellow-500" />}
                        {mode === 'flags' ? 'Which country is this?' : 'What is the capital of'}
                    </span>
                    <motion.div
                        key={currentCountry.name}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4 flex flex-col items-center"
                    >
                        <div className="w-32 h-24 shadow-lg rounded-md overflow-hidden bg-gray-100 dark:bg-gray-800 relative">
                            <img
                                src={`https://flagcdn.com/w160/${currentCountry.code.toLowerCase()}.png`}
                                alt={`Flag of ${currentCountry.name}`}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        {mode !== 'flags' && (
                            <h2 className="text-3xl font-bold text-elevate-text dark:text-elevate-text-dark">{currentCountry.name}</h2>
                        )}
                    </motion.div>
                </div>

                {/* Options Grid */}
                <div className="grid grid-cols-1 gap-3">
                    <AnimatePresence mode='wait'>
                        {options.map((option) => {
                            let variant: 'secondary' | 'primary' | 'outline' = 'secondary';
                            let className = '';
                            const answerKey = (mode === 'capitals' || mode === 'speed') ? 'capital' : 'name';
                            const correctAnswer = currentCountry[answerKey];

                            if (selectedOption) {
                                if (option === correctAnswer) {
                                    // Show correct answer
                                    variant = 'primary';
                                    className = '!bg-green-500 !border-green-500 text-white dark:!bg-green-600 dark:!border-green-600';
                                } else if (option === selectedOption && !isCorrect) {
                                    // Show wrong selection
                                    variant = 'primary';
                                    className = '!bg-red-500 !border-red-500 text-white dark:!bg-red-600 dark:!border-red-600';
                                } else {
                                    // Dim others
                                    className = 'opacity-50';
                                }
                            }

                            return (
                                <motion.div key={option} layout>
                                    <Button
                                        variant={variant}
                                        fullWidth
                                        onClick={() => handleAnswer(option)}
                                        disabled={!!selectedOption}
                                        className={`h-16 text-lg justify-between px-6 ${className}`}
                                    >
                                        <span>{option}</span>
                                        {selectedOption && option === correctAnswer && (
                                            <Check className="w-5 h-5" />
                                        )}
                                        {selectedOption === option && !isCorrect && (
                                            <X className="w-5 h-5" />
                                        )}
                                    </Button>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};
