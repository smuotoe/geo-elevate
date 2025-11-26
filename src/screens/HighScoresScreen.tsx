import React, { useState, useEffect } from 'react';
import { ArrowLeft, Trophy, User as UserIcon } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { scoresAPI, type LeaderboardEntry } from '../services/api/scores';
import { useHighScores } from '../hooks/useHighScores';

interface HighScoresScreenProps {
    onBack: () => void;
}

type GameMode = 'capitals' | 'flags' | 'speed';
type ViewMode = 'my-scores' | 'global';

export const HighScoresScreen: React.FC<HighScoresScreenProps> = ({ onBack }) => {
    const [activeTab, setActiveTab] = useState<GameMode>('capitals');
    const [viewMode, setViewMode] = useState<ViewMode>('global');
    const [globalScores, setGlobalScores] = useState<LeaderboardEntry[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const { isAuthenticated, isGuest } = useAuth();
    const { scores: localScores } = useHighScores();

    useEffect(() => {
        if (viewMode === 'global') {
            loadGlobalLeaderboard();
        }
    }, [activeTab, viewMode]);

    const loadGlobalLeaderboard = async () => {
        setIsLoading(true);
        try {
            const data = await scoresAPI.getLeaderboard(activeTab, 10);
            setGlobalScores(data);
        } catch (error) {
            console.error('Failed to load leaderboard', error);
        } finally {
            setIsLoading(false);
        }
    };

    const tabs: { mode: GameMode; label: string }[] = [
        { mode: 'capitals', label: 'Capitals' },
        { mode: 'flags', label: 'Flags' },
        { mode: 'speed', label: 'Speed' },
    ];

    const getMyScores = () => {
        return localScores
            .filter(s => s.mode === activeTab)
            .slice(0, 10);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

    const getRankColor = (rank: number) => {
        if (rank === 1) return 'text-yellow-500';
        if (rank === 2) return 'text-gray-400';
        if (rank === 3) return 'text-orange-600';
        return 'text-elevate-subtext dark:text-elevate-subtext-dark';
    };

    return (
        <div className="flex flex-col h-full max-w-md mx-auto p-6 pt-8 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" onClick={onBack}>
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold text-elevate-text dark:text-elevate-text-dark">
                            Leaderboard
                        </h1>
                    </div>
                </div>
                <Trophy className="w-8 h-8 text-elevate-primary" />
            </div>

            {/* View Mode Toggle */}
            {isAuthenticated && (
                <div className="flex gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    <button
                        onClick={() => setViewMode('global')}
                        className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${viewMode === 'global'
                                ? 'bg-white dark:bg-gray-700 text-elevate-text dark:text-elevate-text-dark shadow-sm'
                                : 'text-elevate-subtext dark:text-elevate-subtext-dark'
                            }`}
                    >
                        Global
                    </button>
                    <button
                        onClick={() => setViewMode('my-scores')}
                        className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${viewMode === 'my-scores'
                                ? 'bg-white dark:bg-gray-700 text-elevate-text dark:text-elevate-text-dark shadow-sm'
                                : 'text-elevate-subtext dark:text-elevate-subtext-dark'
                            }`}
                    >
                        My Scores
                    </button>
                </div>
            )}

            {/* Game Mode Tabs */}
            <div className="flex gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
                {tabs.map(({ mode, label }) => (
                    <button
                        key={mode}
                        onClick={() => setActiveTab(mode)}
                        className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === mode
                                ? 'bg-white dark:bg-gray-700 text-elevate-text dark:text-elevate-text-dark shadow-sm'
                                : 'text-elevate-subtext dark:text-elevate-subtext-dark'
                            }`}
                    >
                        {label}
                    </button>
                ))}
            </div>

            {/* Guest Message */}
            {isGuest && (
                <Card className="p-4 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                    <p className="text-sm text-blue-700 dark:text-blue-300 text-center">
                        🔒 Login to compete on the global leaderboard
                    </p>
                </Card>
            )}

            {/* Scores List */}
            <div className="flex-1 overflow-y-auto space-y-2">
                {isLoading ? (
                    <div className="text-center py-8 text-elevate-subtext dark:text-elevate-subtext-dark">
                        Loading...
                    </div>
                ) : viewMode === 'global' && !isGuest ? (
                    globalScores.length > 0 ? (
                        globalScores.map((entry) => (
                            <motion.div
                                key={`${entry.username}-${entry.created_at}`}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <Card className="p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <span className={`text-2xl font-bold ${getRankColor(entry.rank)}`}>
                                                #{entry.rank}
                                            </span>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <UserIcon className="w-4 h-4 text-elevate-subtext dark:text-elevate-subtext-dark" />
                                                    <span className="font-medium text-elevate-text dark:text-elevate-text-dark">
                                                        {entry.username}
                                                    </span>
                                                </div>
                                                <span className="text-xs text-elevate-subtext dark:text-elevate-subtext-dark">
                                                    {formatDate(entry.created_at)}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-xl font-bold text-elevate-primary">
                                                {entry.score}
                                            </div>
                                            {entry.questions_answered > 0 && (
                                                <div className="text-xs text-elevate-subtext dark:text-elevate-subtext-dark">
                                                    {entry.questions_answered} questions
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        ))
                    ) : (
                        <div className="text-center py-8 text-elevate-subtext dark:text-elevate-subtext-dark">
                            No scores yet. Be the first!
                        </div>
                    )
                ) : (
                    getMyScores().length > 0 ? (
                        getMyScores().map((entry, index) => (
                            <motion.div
                                key={`${entry.date}-${index}`}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <Card className="p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <span className={`text-2xl font-bold ${getRankColor(index + 1)}`}>
                                                #{index + 1}
                                            </span>
                                            <span className="text-sm text-elevate-subtext dark:text-elevate-subtext-dark">
                                                {formatDate(entry.date)}
                                            </span>
                                        </div>
                                        <div className="text-xl font-bold text-elevate-primary">
                                            {entry.score}
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        ))
                    ) : (
                        <div className="text-center py-8 text-elevate-subtext dark:text-elevate-subtext-dark">
                            No scores yet. Play a game to get started!
                        </div>
                    )
                )}
            </div>
        </div>
    );
};
