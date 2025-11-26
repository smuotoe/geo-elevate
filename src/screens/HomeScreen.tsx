import React from 'react';
import { Play, Trophy, Map, Flag, Moon, Sun, Zap, LogOut, User } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { motion } from 'framer-motion';

import { useTheme } from '../hooks/useTheme';
import { useHighScores } from '../hooks/useHighScores';
import { useCountries } from '../hooks/useCountries';
import { useAuth } from '../contexts/AuthContext';
import type { GameMode } from './GameScreen';

interface HomeScreenProps {
  onStart: (mode: GameMode) => void;
  onShowHighScores: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onStart, onShowHighScores }) => {
  const { theme, toggleTheme } = useTheme();
  const { getHighScore } = useHighScores();
  const { countries } = useCountries();
  const { user, isGuest, logout } = useAuth();

  return (
    <div className="flex flex-col h-full max-w-md mx-auto p-6 space-y-6 pt-8 overflow-y-auto no-scrollbar">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-elevate-text dark:text-elevate-text-dark tracking-tight"
          >
            GeoElevate
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-elevate-subtext dark:text-elevate-subtext-dark text-lg"
          >
            Master the world map.
          </motion.p>
          {user && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-2 text-sm text-elevate-primary"
            >
              <User className="w-4 h-4" />
              <span>{user.username}</span>
            </motion.div>
          )}
          {isGuest && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-sm text-elevate-subtext dark:text-elevate-subtext-dark"
            >
              Playing as Guest
            </motion.div>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={toggleTheme} className="rounded-full p-2">
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>
          {(user || isGuest) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="rounded-full p-2"
              title={isGuest ? "Exit Guest Mode" : "Logout"}
            >
              <LogOut className="w-5 h-5" />
            </Button>
          )}
        </div>
      </div>

      {/* Game Mode Cards */}
      <div className="space-y-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="relative overflow-hidden border-none bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg dark:from-blue-600 dark:to-blue-800">
            <div className="relative z-10 space-y-4">
              <div className="flex items-center space-x-2 opacity-90">
                <Map className="w-5 h-5" />
                <span className="font-medium">Classic Mode</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold">Countries & Capitals</h2>
                <p className="text-blue-100 mt-1">Best: {getHighScore('capitals')}</p>
              </div>
              <Button
                onClick={() => onStart('capitals')}
                variant="secondary"
                fullWidth
                className="mt-4 text-blue-600 hover:bg-white dark:text-blue-400 dark:hover:bg-gray-900"
              >
                <Play className="w-4 h-4 mr-2 fill-current" />
                Start Capitals
              </Button>
            </div>
            <div className="absolute -top-12 -right-12 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl" />
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="relative overflow-hidden border-none bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg dark:from-purple-600 dark:to-purple-800">
            <div className="relative z-10 space-y-4">
              <div className="flex items-center space-x-2 opacity-90">
                <Flag className="w-5 h-5" />
                <span className="font-medium">Visual Mode</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold">Flags of the World</h2>
                <p className="text-purple-100 mt-1">Best: {getHighScore('flags')}</p>
              </div>
              <Button
                onClick={() => onStart('flags')}
                variant="secondary"
                fullWidth
                className="mt-4 text-purple-600 hover:bg-white dark:text-purple-400 dark:hover:bg-gray-900"
              >
                <Play className="w-4 h-4 mr-2 fill-current" />
                Start Flags
              </Button>
            </div>
            <div className="absolute -top-12 -right-12 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl" />
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="relative overflow-hidden border-none bg-gradient-to-br from-yellow-500 to-orange-500 text-white shadow-lg dark:from-yellow-600 dark:to-orange-600">
            <div className="relative z-10 space-y-4">
              <div className="flex items-center space-x-2 opacity-90">
                <Zap className="w-5 h-5" />
                <span className="font-medium">Speed Challenge</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold">10 Questions</h2>
                <p className="text-yellow-100 mt-1">Best: {getHighScore('speed')}</p>
              </div>
              <Button
                onClick={() => onStart('speed')}
                variant="secondary"
                fullWidth
                className="mt-4 text-orange-600 hover:bg-white dark:text-orange-400 dark:hover:bg-gray-900"
              >
                <Play className="w-4 h-4 mr-2 fill-current" />
                Start Speed
              </Button>
            </div>
            <div className="absolute -top-12 -right-12 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl" />
          </Card>
        </motion.div>
      </div>

      {/* Stats / Info */}
      <div className="grid grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          onClick={onShowHighScores}
          className="cursor-pointer"
        >
          <Card hover className="flex flex-col items-center justify-center p-4 space-y-2 h-32">
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full text-green-600 dark:text-green-400">
              <Trophy className="w-6 h-6" />
            </div>
            <span className="text-sm text-elevate-subtext dark:text-elevate-subtext-dark font-medium">Leaderboard</span>
            <span className="text-xs text-elevate-subtext dark:text-elevate-subtext-dark">View All</span>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="flex flex-col items-center justify-center p-4 space-y-2 h-32">
            <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-full text-orange-600 dark:text-orange-400">
              <Map className="w-6 h-6" />
            </div>
            <span className="text-sm text-elevate-subtext dark:text-elevate-subtext-dark font-medium">Countries</span>
            <span className="text-xl font-bold text-elevate-text dark:text-elevate-text-dark">{countries.length}</span>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};
