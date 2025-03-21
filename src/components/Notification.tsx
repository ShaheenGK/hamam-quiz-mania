
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
      }, 5000); // 5 seconds display time
      
      return () => clearTimeout(timer);
    }
  }, [notification.visible, hideNotification]);
  
  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return <CheckCircle className="h-16 w-16 text-green-500" />;
      case 'error':
        return <XCircle className="h-16 w-16 text-red-500" />;
      default:
        return <Info className="h-16 w-16 text-blue-500" />;
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
          className="notification fixed z-50 inset-0 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className={`max-w-2xl w-full m-4 rounded-xl shadow-2xl ${getBgColor()} p-8`}
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
          >
            <div className="flex flex-col items-center text-center">
              {getIcon()}
              <h3 className="mt-4 text-3xl font-bold mb-2">{notification.message}</h3>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Notification;
