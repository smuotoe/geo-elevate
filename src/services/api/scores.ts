import apiClient from './client';

export interface Score {
    id: number;
    user_id: number;
    game_mode: string;
    score: number;
    questions_answered: number;
    created_at: string;
    username?: string;
}

export interface ScoreSubmit {
    game_mode: string;
    score: number;
    questions_answered: number;
}

export interface LeaderboardEntry {
    rank: number;
    username: string;
    score: number;
    questions_answered: number;
    created_at: string;
}

export interface LocalScore {
    mode: string;
    score: number;
    date: string;
}

export const scoresAPI = {
    async submitScore(data: ScoreSubmit): Promise<Score> {
        const response = await apiClient.post<Score>('/api/scores', data);
        return response.data;
    },

    async getMyScores(gameMode?: string): Promise<Score[]> {
        const params = gameMode ? { game_mode: gameMode } : {};
        const response = await apiClient.get<Score[]>('/api/scores/me', { params });
        return response.data;
    },

    async getLeaderboard(gameMode: string, limit: number = 10): Promise<LeaderboardEntry[]> {
        const response = await apiClient.get<LeaderboardEntry[]>(
            `/api/scores/leaderboard/${gameMode}`,
            { params: { limit } }
        );
        return response.data;
    },

    async migrateLocalScores(scores: LocalScore[]): Promise<{ message: string; count: number }> {
        const response = await apiClient.post('/api/scores/migrate', { scores });
        return response.data;
    },
};
