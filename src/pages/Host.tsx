
import React, { useEffect } from 'react';
import { useGameStore, startTimerInterval, stopTimerInterval, initializeLocalStorageSync } from '@/store/gameStore';
import QuestionGrid from '@/components/QuestionGrid';
import QuestionView from '@/components/QuestionView';
import TeamDisplay from '@/components/TeamDisplay';
import Notification from '@/components/Notification';
import Logo from '@/components/Logo';
import { preloadSounds } from '@/utils/sound';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';

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
        
        {/* Settings */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <Label htmlFor="notification-time" className="whitespace-nowrap font-medium">
              Notification Time (ms): {notificationDisplayTime}
            </Label>
            <div className="flex-1">
              <Slider
                id="notification-time"
                defaultValue={[notificationDisplayTime]}
                min={1000}
                max={10000}
                step={500}
                onValueChange={handleNotificationTimeChange}
              />
            </div>
          </div>
        </div>
        
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
