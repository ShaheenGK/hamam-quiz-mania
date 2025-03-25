
import React from 'react';
import { useGameStore } from '@/store/gameStore';
import { Slider } from '@/components/ui/slider';

const NotificationSettings: React.FC = () => {
  const { notificationDisplayTime, setNotificationDisplayTime } = useGameStore();

  const handleNotificationTimeChange = (value: number[]) => {
    setNotificationDisplayTime(value[0]);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Notification Settings</h2>
      <p className="text-gray-600 mb-4">
        Control how long notifications appear on the screen.
      </p>
      
      <div className="mb-4">
        <h3 className="text-lg font-medium mb-2">
          Notification Display Time: {notificationDisplayTime / 1000}s
        </h3>
        <Slider 
          defaultValue={[notificationDisplayTime]} 
          max={10000} 
          min={1000} 
          step={1000} 
          onValueChange={handleNotificationTimeChange}
        />
      </div>
    </div>
  );
};

export default NotificationSettings;
