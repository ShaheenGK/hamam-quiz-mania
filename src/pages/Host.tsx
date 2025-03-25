
import React, { useEffect, useState } from 'react';
import { useGameStore, startTimerInterval, stopTimerInterval, initializeLocalStorageSync } from '@/store/gameStore';
import QuestionGrid from '@/components/QuestionGrid';
import QuestionView from '@/components/QuestionView';
import TeamDisplay from '@/components/TeamDisplay';
import Notification from '@/components/Notification';
import Logo from '@/components/Logo';
import { preloadSounds } from '@/utils/sound';
import { Slider } from '@/components/ui/slider';
import GridBackgroundCustomizer from '@/components/GridBackgroundCustomizer';

const Host: React.FC = () => {
  const { 
    activeView, 
    teams, 
    notificationDisplayTime,
    setNotificationDisplayTime 
  } = useGameStore();

  useEffect(() => {
    // Initialize the timer and localStorage sync
    startTimerInterval();
    const cleanupSync = initializeLocalStorageSync('host');
    preloadSounds();

    return () => {
      stopTimerInterval();
      cleanupSync();
    };
  }, []);

  const handleNotificationTimeChange = (value: number[]) => {
    setNotificationDisplayTime(value[0]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Hamam Quiz Game</h1>
          <p className="text-lg font-medium text-gray-600">Host View</p>
        </div>
        
        {/* Logo */}
        <Logo />
        
        {/* Team Display */}
        {teams.length > 0 && <TeamDisplay />}
        
        {/* Notification Settings */}
        <div className="bg-white rounded-xl shadow-lg p-4 mb-4">
          <h3 className="text-lg font-medium mb-2">Notification Display Time: {notificationDisplayTime / 1000}s</h3>
          <Slider 
            defaultValue={[notificationDisplayTime]} 
            max={10000} 
            min={1000} 
            step={1000} 
            onValueChange={handleNotificationTimeChange}
          />
        </div>
        
        {/* Grid Background Customizer */}
        <GridBackgroundCustomizer />
        
        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          {activeView === 'grid' ? (
            <QuestionGrid />
          ) : (
            <QuestionView />
          )}
        </div>
        
        {/* Notification */}
        <Notification />
      </div>
    </div>
  );
};

export default Host;
