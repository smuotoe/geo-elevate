import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { WelcomeScreen } from './screens/WelcomeScreen';
import { LoginScreen } from './screens/LoginScreen';
import { SignupScreen } from './screens/SignupScreen';
import { HomeScreen } from './screens/HomeScreen';
import { GameScreen, type QuestionResult } from './screens/GameScreen';
import { ResultScreen } from './screens/ResultScreen';
import { HighScoresScreen } from './screens/HighScoresScreen';
import { ReviewScreen } from './screens/ReviewScreen';
import { motion, AnimatePresence } from 'framer-motion';
import { useHighScores } from './hooks/useHighScores';

import type { GameMode } from './screens/GameScreen';

type Screen = 'welcome' | 'login' | 'signup' | 'home' | 'game' | 'result' | 'highscores' | 'review';

function AppContent() {
  const { isAuthenticated, isGuest, isLoading, continueAsGuest } = useAuth();
  const [currentScreen, setCurrentScreen] = useState<Screen>('welcome');
  const [gameMode, setGameMode] = useState<GameMode>('capitals');
  const [lastScore, setLastScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [questionResults, setQuestionResults] = useState<QuestionResult[]>([]);
  const { addScore } = useHighScores();

  const startGame = (mode: GameMode) => {
    setGameMode(mode);
    setCurrentScreen('game');
  };

  const endGame = (score: number, questions: number, results: QuestionResult[]) => {
    setLastScore(score);
    setTotalQuestions(questions);
    setQuestionResults(results);
    addScore(score, gameMode);
    setCurrentScreen('result');
  };

  const goHome = () => setCurrentScreen('home');
  const showHighScores = () => setCurrentScreen('highscores');
  const showReview = () => setCurrentScreen('review');
  const showWelcome = () => setCurrentScreen('welcome');
  const showLogin = () => setCurrentScreen('login');
  const showSignup = () => setCurrentScreen('signup');

  const handleGuestClick = () => {
    continueAsGuest();
    setCurrentScreen('home');
  };

  // Show welcome screen if not authenticated and not guest
  if (!isLoading && !isAuthenticated && !isGuest && currentScreen !== 'welcome' && currentScreen !== 'login' && currentScreen !== 'signup') {
    setCurrentScreen('welcome');
  }

  // Redirect to home after authentication
  if ((isAuthenticated || isGuest) && (currentScreen === 'welcome' || currentScreen === 'login' || currentScreen === 'signup')) {
    setCurrentScreen('home');
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-elevate-bg dark:bg-elevate-bg-dark flex items-center justify-center">
        <div className="text-elevate-text dark:text-elevate-text-dark">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-elevate-bg dark:bg-elevate-bg-dark font-sans text-elevate-text dark:text-elevate-text-dark overflow-hidden transition-colors duration-200">
      <AnimatePresence mode="wait">
        {currentScreen === 'welcome' && (
          <motion.div
            key="welcome"
            className="h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <WelcomeScreen
              onLoginClick={showLogin}
              onSignupClick={showSignup}
              onGuestClick={handleGuestClick}
            />
          </motion.div>
        )}

        {currentScreen === 'login' && (
          <motion.div
            key="login"
            className="h-full"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <LoginScreen onSignupClick={showSignup} />
          </motion.div>
        )}

        {currentScreen === 'signup' && (
          <motion.div
            key="signup"
            className="h-full"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <SignupScreen onBackClick={showWelcome} />
          </motion.div>
        )}

        {currentScreen === 'home' && (
          <motion.div
            key="home"
            className="h-full"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <HomeScreen onStart={startGame} onShowHighScores={showHighScores} />
          </motion.div>
        )}

        {currentScreen === 'game' && (
          <motion.div
            key="game"
            className="h-full"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <GameScreen mode={gameMode} onEndGame={endGame} />
          </motion.div>
        )}

        {currentScreen === 'result' && (
          <motion.div
            key="result"
            className="h-full"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <ResultScreen
              score={lastScore}
              totalQuestions={totalQuestions}
              onRetry={() => startGame(gameMode)}
              onHome={goHome}
              onReview={showReview}
            />
          </motion.div>
        )}

        {currentScreen === 'highscores' && (
          <motion.div
            key="highscores"
            className="h-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <HighScoresScreen onBack={goHome} />
          </motion.div>
        )}

        {currentScreen === 'review' && (
          <motion.div
            key="review"
            className="h-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <ReviewScreen results={questionResults} onBack={() => setCurrentScreen('result')} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
