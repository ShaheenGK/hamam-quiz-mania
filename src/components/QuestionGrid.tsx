
import React from 'react';
import { motion } from 'framer-motion';
import QuestionCard from './QuestionCard';
import { useGameStore } from '@/store/gameStore';

const QuestionGrid: React.FC = () => {
  const { questions } = useGameStore();

  return (
    <motion.div
      className="card-grid w-full p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {questions.map((question, index) => (
        <QuestionCard 
          key={question.id} 
          id={question.id} 
          index={index} 
        />
      ))}
    </motion.div>
  );
};

export default QuestionGrid;
