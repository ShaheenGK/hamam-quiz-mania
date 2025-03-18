
import React from 'react';
import { useGameStore } from '@/store/gameStore';

const Logo: React.FC = () => {
  const { logoUrl, logoText, logoSize } = useGameStore();
  
  if (!logoUrl && !logoText) {
    return null;
  }
  
  return (
    <div className="flex flex-col items-center justify-center mb-6 mt-4">
      {logoUrl && (
        <img 
          src={logoUrl} 
          alt="Quiz Logo" 
          style={{ maxHeight: `${logoSize || 100}px`, maxWidth: '100%' }}
          className="mb-2"
        />
      )}
      {logoText && (
        <h2 
          className="text-2xl font-bold text-gray-800" 
          style={{ fontSize: `${(logoSize || 100) * 0.3}px` }}
        >
          {logoText}
        </h2>
      )}
    </div>
  );
};

export default Logo;
