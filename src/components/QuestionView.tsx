
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import Timer from './Timer';
import { X } from 'lucide-react';
import { playSound } from '@/utils/sound';
import { Button } from '@/components/ui/button';

interface QuestionViewProps {
  isPlayerView?: boolean;
}

const QuestionView: React.FC<QuestionViewProps> = ({ isPlayerView = false }) => {
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
    updateTeamPoints,
    showNotification,
    quizColors
  } = useGameStore();
  
  const question = questions.find(q => q.id === selectedQuestionId);
  const [showPointsControls, setShowPointsControls] = useState(false);
  
  useEffect(() => {
    if (revealAnswer) {
      setShowPointsControls(true);
      
      // Auto-award points for player view when they get the correct answer
      if (isPlayerView && selectedAnswerIndex === question?.correctAnswerIndex && teams.length > 0 && currentTeamIndex < teams.length) {
        const currentTeam = teams[currentTeamIndex];
        
        if (!question.usedCustomReward) {
          updateTeamPoints(currentTeam.id, question.points);
        } else if (question.customReward) {
          showNotification(`Prize: ${question.customReward}`, 'success');
        }
      } else if (isPlayerView && selectedAnswerIndex !== null && 
                selectedAnswerIndex !== question?.correctAnswerIndex && 
                question?.usedCustomReward && question?.customPenalty) {
        showNotification(`Penalty: ${question.customPenalty}`, 'error');
      }
    } else {
      setShowPointsControls(false);
    }
  }, [revealAnswer, isPlayerView, selectedAnswerIndex, question, teams, currentTeamIndex, updateTeamPoints, showNotification]);
  
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
        if (!question.usedCustomReward) {
          updateTeamPoints(currentTeam.id, question.points);
        } else if (question.customReward) {
          // Show the reward notification
          showNotification(`Prize: ${question.customReward}`, 'success');
        }
      } else if (selectedAnswerIndex !== null && question.usedCustomReward && question.customPenalty) {
        // Show the penalty notification
        showNotification(`Penalty: ${question.customPenalty}`, 'error');
      }
    }
    
    // Close question after awarding points
    closeQuestion();
  };
  
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="question-view"
        className="w-full h-full flex flex-col p-6 rounded-xl neo-shadow"
        style={{ backgroundColor: quizColors.questionWindow || '#FFFFFF' }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
      >
        {/* Header with question and close button */}
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl font-bold text-gray-800">{question.text}</h2>
          {!isPlayerView && (
            <Button 
              variant="ghost" 
              size="icon"
              onClick={handleClose}
              className="rounded-full hover:bg-gray-100 transition-colors"
            >
              <X size={24} className="text-gray-600" />
            </Button>
          )}
        </div>
        
        {/* Timer */}
        <Timer />
        
        {/* Answer Grid */}
        <div className="answers-grid grid grid-cols-2 gap-4 flex-grow mb-6">
          {question.answers.map((answer, index) => (
            <motion.button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              className={`
                answer-button w-full p-4 flex items-center justify-center
                rounded-lg text-lg font-medium transition-all
                ${revealAnswer ? (
                  index === question.correctAnswerIndex 
                    ? 'correct-answer bg-green-100 text-green-800' 
                    : 'incorrect-answer bg-red-100 text-red-800'
                ) : (
                  selectedAnswerIndex === index 
                    ? 'selected-answer bg-gray-100' 
                    : 'bg-white hover:bg-gray-50'
                )}
                ${revealAnswer && 'cursor-default'}
              `}
              style={{
                backgroundColor: revealAnswer 
                  ? (index === question.correctAnswerIndex ? `${quizColors.correct}20` : `${quizColors.incorrect}20`)
                  : (selectedAnswerIndex === index ? `${quizColors.selected}20` : '#FFFFFF'),
                color: revealAnswer
                  ? (index === question.correctAnswerIndex ? quizColors.correct : quizColors.incorrect)
                  : (selectedAnswerIndex === index ? quizColors.selected : '#333333')
              }}
              whileHover={{ scale: revealAnswer ? 1 : 1.03 }}
              whileTap={{ scale: revealAnswer ? 1 : 0.98 }}
              disabled={revealAnswer}
            >
              {answer}
            </motion.button>
          ))}
        </div>
        
        {/* Control buttons - Only show for host view */}
        {!isPlayerView && (
          <div className="flex justify-between items-center mt-auto">
            <div className="text-lg font-bold">
              {!question.usedCustomReward && `${question.points} points`}
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
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default QuestionView;
