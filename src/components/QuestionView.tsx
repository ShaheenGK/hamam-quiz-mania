
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import Timer from './Timer';
import { X } from 'lucide-react';
import { playSound } from '@/utils/sound';

const QuestionView: React.FC = () => {
  const { 
    questions, 
    selectedQuestionId,
    selectedAnswerIndex,
    revealAnswer,
    showAnswer,
    closeQuestion,
    selectAnswer,
    teams,
    currentTeamIndex,
    updateTeamPoints
  } = useGameStore();
  
  const question = questions.find(q => q.id === selectedQuestionId);
  const [showPointsControls, setShowPointsControls] = useState(false);
  
  useEffect(() => {
    if (revealAnswer) {
      setShowPointsControls(true);
    } else {
      setShowPointsControls(false);
    }
  }, [revealAnswer]);
  
  if (!question) return null;
  
  const handleAnswerSelect = (index: number) => {
    if (!revealAnswer) {
      selectAnswer(index);
    }
  };
  
  const handleRevealAnswer = () => {
    showAnswer();
    if (selectedAnswerIndex !== null) {
      if (selectedAnswerIndex === question.correctAnswerIndex) {
        playSound('correctAnswer');
      } else {
        playSound('wrongAnswer');
      }
    }
  };
  
  const handleClose = () => {
    closeQuestion();
    playSound('buttonClick');
  };
  
  const handleAwardPoints = () => {
    if (teams.length > 0 && currentTeamIndex < teams.length) {
      const currentTeam = teams[currentTeamIndex];
      
      if (selectedAnswerIndex === question.correctAnswerIndex) {
        // Award points for correct answer
        if (question.usedCustomReward && question.customReward) {
          // Show custom reward notification
          // This will be displayed through the notification system in the store
        } else {
          updateTeamPoints(currentTeam.id, question.points);
        }
      } else if (selectedAnswerIndex !== null) {
        // Penalty for wrong answer
        if (question.usedCustomReward && question.customPenalty) {
          // Show custom penalty notification
        } else {
          // No point deduction by default
        }
      }
    }
    
    // Close question after awarding points
    closeQuestion();
  };
  
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="question-view"
        className="w-full h-full flex flex-col p-6 bg-white rounded-xl neo-shadow"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
      >
        {/* Header with question and close button */}
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl font-bold text-gray-800">{question.text}</h2>
          <button 
            onClick={handleClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X size={24} className="text-gray-600" />
          </button>
        </div>
        
        {/* Timer */}
        <Timer />
        
        {/* Answer Grid */}
        <div className="answers-grid flex-grow mb-6">
          {question.answers.map((answer, index) => (
            <motion.button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              className={`
                w-full h-full p-4 flex items-center justify-center
                rounded-lg text-lg font-medium transition-all
                ${revealAnswer ? (
                  index === question.correctAnswerIndex 
                    ? 'correct-answer' 
                    : 'incorrect-answer'
                ) : (
                  selectedAnswerIndex === index 
                    ? 'selected-answer bg-gray-100' 
                    : 'bg-white hover:bg-gray-50'
                )}
                ${revealAnswer && 'cursor-default'}
              `}
              whileHover={{ scale: revealAnswer ? 1 : 1.03 }}
              whileTap={{ scale: revealAnswer ? 1 : 0.98 }}
              disabled={revealAnswer}
            >
              {answer}
            </motion.button>
          ))}
        </div>
        
        {/* Control buttons */}
        <div className="flex justify-between items-center mt-auto">
          <div className="text-lg font-bold">
            {!question.usedCustomReward && `${question.points} points`}
            {question.usedCustomReward && question.customReward && `Prize: ${question.customReward}`}
          </div>
          
          <div className="flex gap-4">
            {!revealAnswer && (
              <motion.button
                onClick={handleRevealAnswer}
                className="px-6 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                Reveal Answer
              </motion.button>
            )}
            
            {showPointsControls && teams.length > 0 && (
              <motion.button
                onClick={handleAwardPoints}
                className="px-6 py-3 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition-colors"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                Award Points
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default QuestionView;
