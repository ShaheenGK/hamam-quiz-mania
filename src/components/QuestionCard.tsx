
import React from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { playSound } from '@/utils/sound';

interface QuestionCardProps {
  id: number;
  index: number;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ id, index }) => {
  const { 
    questions, 
    completedQuestions, 
    selectQuestion 
  } = useGameStore();

  const question = questions.find(q => q.id === id);
  const isCompleted = completedQuestions.includes(id);

  const handleClick = () => {
    if (!isCompleted && question) {
      playSound('cardSelect');
      selectQuestion(id);
    }
  };

  if (!question) {
    return null;
  }

  return (
    <motion.div
      className={`
        question-card 
        relative 
        rounded-lg 
        overflow-hidden 
        shadow-lg 
        cursor-pointer 
        h-32 
        transition-all 
        duration-300
        ${isCompleted ? 'opacity-50' : 'hover:shadow-xl hover:scale-105'}
      `}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.03 }}
      onClick={handleClick}
      whileHover={{ scale: isCompleted ? 1 : 1.05 }}
      whileTap={{ scale: isCompleted ? 1 : 0.98 }}
    >
      <div className="bg-white rounded-lg neo-shadow h-full flex flex-col justify-center items-center p-4">
        <span className="text-3xl font-bold text-gray-800">{index + 1}</span>
        {isCompleted && (
          <div className="absolute inset-0 bg-gray-100 bg-opacity-70 flex items-center justify-center">
            <span className="text-lg font-bold text-gray-500">Completed</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default QuestionCard;
