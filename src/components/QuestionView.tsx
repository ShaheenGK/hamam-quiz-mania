import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import Timer from './Timer';
import { X, Eye, Award } from 'lucide-react';
import { playSound } from '@/utils/sound';
import { Button } from '@/components/ui/button';

interface QuestionViewProps {
  isPlayerView?: boolean;
}

const QuestionView: React.FC<{ isPlayerView?: boolean }> = ({ isPlayerView = false }) => {
  const { 
    questions, 
    selectedQuestionId, 
    selectedAnswerIndex, 
    revealAnswer, 
    teams, 
    currentTeamIndex,
    remainingTime,
    isTimerRunning,
    updateTeamPoints,
    closeQuestion,
    startTimer,
    stopTimer,
    resetTimer,
    showNotification,
    selectAnswer,
    showAnswer,
    questionWindowImageUrl,
    questionWindowOpacity,
    questionWindowSize,
    questionWindowPositionX,
    questionWindowPositionY,
  } = useGameStore();

  const question = questions.find(q => q.id === selectedQuestionId);
  const [showPointsControls, setShowPointsControls] = useState(false);
  
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.code === 'Space' && !isPlayerView) {
      event.preventDefault();
      
      if (!revealAnswer) {
        handleRevealAnswer();
      } else if (showPointsControls) {
        handleAwardPoints();
      }
    }
  }, [revealAnswer, showPointsControls, isPlayerView]);
  
  useEffect(() => {
    if (!isPlayerView) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [handleKeyDown, isPlayerView]);
  
  useEffect(() => {
    if (revealAnswer) {
      setShowPointsControls(true);
      
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
  
  useEffect(() => {
    if (isPlayerView && activeView === 'grid') {
      closeQuestion();
    }
  }, [isPlayerView, activeView, closeQuestion]);
  
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
        if (!question.usedCustomReward) {
          updateTeamPoints(currentTeam.id, question.points);
        } else if (question.customReward) {
          showNotification(`Prize: ${question.customReward}`, 'success');
        }
      } else if (selectedAnswerIndex !== null && question.usedCustomReward && question.customPenalty) {
        showNotification(`Penalty: ${question.customPenalty}`, 'error');
      }
    }
    
    closeQuestion();
  };
  
  const backgroundStyle = questionWindowImageUrl ? {
    backgroundImage: `url(${questionWindowImageUrl})`,
    backgroundSize: `${questionWindowSize}%`,
    backgroundPosition: `${questionWindowPositionX}% ${questionWindowPositionY}%`,
    opacity: questionWindowOpacity
  } : {};

  return (
    <div className="question-view relative">
      {questionWindowImageUrl && (
        <div 
          className="absolute inset-0 rounded-xl -m-4"
          style={backgroundStyle}
        ></div>
      )}
      
      <div className="relative z-10">
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
        
        <Timer />
        
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
        
        {!isPlayerView && (
          <div className="flex justify-end items-center mt-auto">
            <div className="flex gap-4">
              {showPointsControls && teams.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Button
                    onClick={handleAwardPoints}
                    variant="default"
                    className="px-6 py-3 bg-green-600 hover:bg-green-700 transition-all transform hover:scale-105 active:scale-95"
                  >
                    <Award className="mr-2" size={20} />
                    Award Points
                  </Button>
                </motion.div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionView;
