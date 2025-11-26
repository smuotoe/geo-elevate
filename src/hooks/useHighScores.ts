import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { scoresAPI, type LocalScore } from '../services/api/scores';

export interface ScoreEntry {
    date: string;
    score: number;
    mode: string;
}

export function useHighScores() {
    const [scores, setScores] = useState<ScoreEntry[]>([]);
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        const saved = localStorage.getItem('geo-elevate-scores');
        if (saved) {
            try {
                setScores(JSON.parse(saved));
            } catch (e) {
                console.error('Failed to parse scores', e);
            }
        }
    }, []);

    const addScore = async (score: number, mode: string): Promise<boolean> => {
        const currentHighScore = getHighScore(mode);
        const isNewHighScore = score > currentHighScore;

        const newEntry: ScoreEntry = {
            date: new Date().toISOString(),
            score,
            mode,
        };

        // If authenticated, submit to API
        if (isAuthenticated) {
            try {
                await scoresAPI.submitScore({
                    game_mode: mode,
                    score,
                    questions_answered: mode === 'speed' ? 10 : 0, // Speed mode has fixed 10 questions
                });
            } catch (error) {
                console.error('Failed to submit score to API', error);
                // Fall back to localStorage if API fails
            }
        }

        // Always save to localStorage (for guests and as backup)
        setScores((prev) => {
            const newScores = [...prev, newEntry]
                .sort((a, b) => b.score - a.score) // Sort descending
                .slice(0, 10); // Keep top 10

            localStorage.setItem('geo-elevate-scores', JSON.stringify(newScores));
            return newScores;
        });

        return isNewHighScore;
    };

    const getHighScore = (mode: string) => {
        const modeScores = scores.filter(s => s.mode === mode);
        return modeScores.length > 0 ? modeScores[0].score : 0;
    };

    const migrateLocalScores = async () => {
        if (!isAuthenticated || scores.length === 0) return;

        try {
            const localScores: LocalScore[] = scores.map(s => ({
                mode: s.mode,
                score: s.score,
                date: s.date,
            }));

            await scoresAPI.migrateLocalScores(localScores);
            console.log('Successfully migrated local scores');
        } catch (error) {
            console.error('Failed to migrate scores', error);
        }
    };

    return { scores, addScore, getHighScore, migrateLocalScores };
}
