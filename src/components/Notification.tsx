
import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { CheckCircle, XCircle, Info } from 'lucide-react';

const Notification: React.FC = () => {
  const { notification, hideNotification } = useGameStore();
  
  useEffect(() => {
    if (notification.visible) {
      const timer = setTimeout(() => {
        hideNotification();
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [notification.visible, hideNotification]);
  
  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case 'error':
        return <XCircle className="h-6 w-6 text-red-500" />;
      default:
        return <Info className="h-6 w-6 text-blue-500" />;
    }
  };
  
  const getBgColor = () => {
    switch (notification.type) {
      case 'success':
        return 'bg-green-50 border-green-100';
      case 'error':
        return 'bg-red-50 border-red-100';
      default:
        return 'bg-blue-50 border-blue-100';
    }
  };
  
  return (
    <AnimatePresence>
      {notification.visible && (
        <motion.div
          className="notification glass fixed z-50 min-w-[300px] max-w-md"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.3 }}
        >
          <div className={`rounded-lg shadow-lg p-4 border ${getBgColor()}`}>
            <div className="flex items-center">
              {getIcon()}
              <span className="ml-3 text-lg font-medium">{notification.message}</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Notification;
