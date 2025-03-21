
import React, { useEffect } from 'react';
import { useGameStore } from '@/store/gameStore';

const BackgroundManager: React.FC = () => {
  const { 
    backgroundImageUrl, 
    backgroundOpacity, 
    backgroundSize, 
    backgroundPositionX, 
    backgroundPositionY 
  } = useGameStore();
  
  useEffect(() => {
    const applyBackground = () => {
      const bodyElement = document.body;
      
      if (backgroundImageUrl) {
        bodyElement.style.backgroundImage = `url(${backgroundImageUrl})`;
        bodyElement.style.backgroundSize = `${backgroundSize}%`;
        bodyElement.style.backgroundPosition = `${backgroundPositionX}% ${backgroundPositionY}%`;
        bodyElement.style.backgroundAttachment = 'fixed';
        bodyElement.style.backgroundColor = `rgba(245, 247, 250, ${backgroundOpacity})`;
        bodyElement.style.backgroundBlendMode = 'overlay';
      } else {
        bodyElement.style.backgroundImage = '';
        bodyElement.style.backgroundSize = '';
        bodyElement.style.backgroundPosition = '';
        bodyElement.style.backgroundAttachment = '';
        bodyElement.style.backgroundColor = '';
        bodyElement.style.backgroundBlendMode = '';
      }
    };
    
    applyBackground();
    
    return () => {
      // Reset background when component unmounts
      document.body.style.backgroundImage = '';
      document.body.style.backgroundSize = '';
      document.body.style.backgroundPosition = '';
      document.body.style.backgroundAttachment = '';
      document.body.style.backgroundColor = '';
      document.body.style.backgroundBlendMode = '';
    };
  }, [backgroundImageUrl, backgroundOpacity, backgroundSize, backgroundPositionX, backgroundPositionY]);
  
  return null; // This is just a utility component with no UI
};

export default BackgroundManager;
