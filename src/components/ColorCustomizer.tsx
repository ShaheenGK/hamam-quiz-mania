
import React, { useState } from 'react';
import { SketchPicker } from 'react-color';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { Check, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

type ColorKey = 'correct' | 'incorrect' | 'selected' | 'timerStart' | 'timerMid' | 'timerEnd' | 'activeTeam';
type ColorName = 'Correct Answer' | 'Incorrect Answer' | 'Selected Answer' | 'Timer Start' | 'Timer Middle' | 'Timer End' | 'Active Team';

interface ColorOption {
  key: ColorKey;
  name: ColorName;
  value: string;
}

const ColorCustomizer: React.FC = () => {
  const { setCustomColors, quizColors, resetColors } = useGameStore();
  const [activeColor, setActiveColor] = useState<ColorKey | null>(null);

  const colorOptions: ColorOption[] = [
    { key: 'correct', name: 'Correct Answer', value: quizColors.correct },
    { key: 'incorrect', name: 'Incorrect Answer', value: quizColors.incorrect },
    { key: 'selected', name: 'Selected Answer', value: quizColors.selected },
    { key: 'timerStart', name: 'Timer Start', value: quizColors.timerStart },
    { key: 'timerMid', name: 'Timer Middle', value: quizColors.timerMid },
    { key: 'timerEnd', name: 'Timer End', value: quizColors.timerEnd },
    { key: 'activeTeam', name: 'Active Team', value: quizColors.activeTeam }
  ];

  const handleColorChange = (color: { hex: string }) => {
    if (activeColor) {
      setCustomColors({ [activeColor]: color.hex });
    }
  };

  const closeColorPicker = () => {
    setActiveColor(null);
  };

  return (
    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Color Customization</h2>
        <Button 
          variant="outline" 
          size="sm"
          onClick={resetColors}
          className="flex items-center gap-2"
        >
          <RefreshCw size={14} />
          Reset to Default
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {colorOptions.map((option) => (
          <div key={option.key} className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-full cursor-pointer border border-gray-300 flex items-center justify-center"
              style={{ backgroundColor: option.value }}
              onClick={() => setActiveColor(option.key)}
            >
              {activeColor === option.key && <Check size={16} className="text-white" />}
            </div>
            <div className="flex-grow">
              <p className="text-sm font-medium">{option.name}</p>
              <p className="text-xs text-gray-500">{option.value}</p>
            </div>
          </div>
        ))}
      </div>

      {activeColor && (
        <motion.div
          className="mt-4 p-4 bg-white rounded-lg shadow-md"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
        >
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium">
              Edit {colorOptions.find(c => c.key === activeColor)?.name} Color
            </h3>
            <button 
              onClick={closeColorPicker}
              className="text-gray-500 hover:text-gray-700"
            >
              Close
            </button>
          </div>
          
          <SketchPicker
            color={quizColors[activeColor]}
            onChange={handleColorChange}
            disableAlpha={true}
            presetColors={['#10B981', '#EF4444', '#3B82F6', '#F97316', '#8B5CF6', '#EC4899']}
          />
        </motion.div>
      )}
    </div>
  );
};

export default ColorCustomizer;
