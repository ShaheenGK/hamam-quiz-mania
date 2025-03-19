
import React, { useEffect } from 'react';
import { useGameStore, startTimerInterval, stopTimerInterval, initializeLocalStorageSync } from '@/store/gameStore';
import QuestionGrid from '@/components/QuestionGrid';
import QuestionView from '@/components/QuestionView';
import TeamDisplay from '@/components/TeamDisplay';
import Notification from '@/components/Notification';
import Logo from '@/components/Logo';
import { preloadSounds } from '@/utils/sound';

const Player: React.FC = () => {
  const { activeView, teams } = useGameStore();

  useEffect(() => {
    // Initialize the timer and localStorage sync
    startTimerInterval();
    const cleanupSync = initializeLocalStorageSync('player');
    preloadSounds();

    return () => {
      stopTimerInterval();
      cleanupSync();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4">
      {/* Non-interactive overlay that blocks all interactions */}
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 10,
          pointerEvents: 'all', // Catches all pointer events
          cursor: 'default'
        }}
      ></div>
      
      <div className="max-w-7xl mx-auto" style={{ position: 'relative', zIndex: 5 }}>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Hamam Quiz Game</h1>
          <p className="text-lg font-medium text-gray-600">Player View (Spectate Only)</p>
        </div>
        
        {/* Logo */}
        <Logo />
        
        {/* Team Display */}
        {teams.length > 0 && <TeamDisplay />}
        
        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          {activeView === 'grid' ? (
            <QuestionGrid />
          ) : (
            <QuestionView isPlayerView={true} />
          )}
        </div>
        
        {/* Notification */}
        <Notification />
      </div>
    </div>
  );
};

export default Player;
