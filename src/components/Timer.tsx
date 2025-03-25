
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { playSound, stopSound } from '@/utils/sound';

const Timer: React.FC = () => {
  const { 
    remainingTime, 
    isTimerRunning,
    revealAnswer
  } = useGameStore();
  
  const [timerColor, setTimerColor] = useState('bg-quiz-timer-start');
  const [prevTime, setPrevTime] = useState(remainingTime);
  
  // Calculate percentage of time remaining
  // If the question has a custom time limit, we need to calculate based on that
  const maxTime = 30; // This should ideally come from the current question
  const percentage = (remainingTime / maxTime) * 100;
  
  // Update timer color based on percentage
  useEffect(() => {
    if (percentage > 66) {
      setTimerColor('bg-quiz-timer-start');
    } else if (percentage > 33) {
      setTimerColor('bg-quiz-timer-mid');
    } else {
      setTimerColor('bg-quiz-timer-end');
    }
    
    // Play timer tick sound when running and time changes
    if (isTimerRunning && !revealAnswer) {
      if (remainingTime <= 5 && remainingTime > 0 && remainingTime !== prevTime) {
        playSound('timerTick');
      } else if (remainingTime === 0 && prevTime > 0) {
        stopSound('timerTick');
        playSound('timerEnd');
      }
    } else {
      stopSound('timerTick');
    }
    
    setPrevTime(remainingTime);
  }, [remainingTime, isTimerRunning, percentage, revealAnswer, prevTime]);

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full h-8 mb-4 bg-gray-200 rounded-full overflow-hidden shadow-inner">
      {/* Timer bar */}
      <motion.div
        className={`h-full ${timerColor} timer-bar`}
        initial={{ width: '100%' }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 0.3 }}
      />
      
      {/* Timer text overlay */}
      <div className="relative">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-full text-white font-bold text-sm">
          {formatTime(remainingTime)}
        </div>
      </div>
    </div>
  );
};

export default Timer;
