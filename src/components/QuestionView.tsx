
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import Timer from './Timer';
import { Check, X } from 'lucide-react';
import { playSound } from '@/utils/sound';

const QuestionView: React.FC = () => {
  const {
    selectedQuestionId,
    questions,
    teams,
    currentTeamIndex,
    selectedAnswerIndex,
    revealAnswer,
    isTimerRunning,
    activeView,
    updateTeamPoints,
    selectAnswer,
    showAnswer,
    closeQuestion,
    startTimer,
    stopTimer,
    resetTimer,
    showNotification,
    quizColors
  } = useGameStore();
  
  const [pointsAwarded, setPointsAwarded] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  
  const currentQuestion = selectedQuestionId 
    ? questions.find(q => q.id === selectedQuestionId) 
    : null;
    
  const currentTeam = teams.length > currentTeamIndex ? teams[currentTeamIndex] : null;
  
  useEffect(() => {
    // Reset points awarded state when a new question is selected
    setPointsAwarded(false);
    
    // If this is the initial load, don't play the sound
    if (initialLoad) {
      setInitialLoad(false);
      return;
    }
    
    // Play sound when a question is selected
    if (selectedQuestionId && activeView === 'question') {
      playSound('cardSelect');
    }
  }, [selectedQuestionId, activeView, initialLoad]);
  
  const handleAnswerClick = (index: number) => {
    if (revealAnswer || !isTimerRunning) return;
    selectAnswer(index);
    playSound('buttonClick');
  };
  
  const handleRevealAnswer = () => {
    showAnswer();
    playSound('buttonClick');
  };
  
  const handleAwardPoints = () => {
    if (!currentQuestion || !currentTeam) return;
    
    const isCorrect = selectedAnswerIndex === currentQuestion.correctAnswerIndex;
    
    if (currentQuestion.usedCustomReward) {
      const message = isCorrect 
        ? `${currentTeam.name} ${currentQuestion.customReward || 'Wins a prize!'}` 
        : `${currentTeam.name} ${currentQuestion.customPenalty || 'Gets a penalty!'}`;
      
      showNotification(message, isCorrect ? 'success' : 'error');
    } else {
      // Award points based on correctness
      const pointsChange = isCorrect ? currentQuestion.points : -Math.floor(currentQuestion.points / 2);
      updateTeamPoints(currentTeam.id, pointsChange);
    }
    
    setPointsAwarded(true);
    playSound(isCorrect ? 'correctAnswer' : 'wrongAnswer');
  };
  
  const handleCloseQuestion = () => {
    closeQuestion();
    playSound('buttonClick');
  };
  
  const handleTimerControls = () => {
    if (isTimerRunning) {
      stopTimer();
    } else {
      startTimer();
    }
    playSound('buttonClick');
  };
  
  const handleResetTimer = () => {
    resetTimer();
    playSound('buttonClick');
  };
  
  if (!currentQuestion) {
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold text-gray-800">No question selected</h2>
      </div>
    );
  }
  
  return (
    <div className="question-view">
      {/* Question header */}
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <span className="inline-block bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full mr-2">
              Question {selectedQuestionId}
            </span>
            <span className="inline-block bg-green-100 text-green-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
              {currentQuestion.points} Points
            </span>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={handleTimerControls}
              className={`px-3 py-1 rounded-md text-sm ${
                isTimerRunning ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
              }`}
            >
              {isTimerRunning ? 'Pause Timer' : 'Resume Timer'}
            </button>
            
            <button
              onClick={handleResetTimer}
              className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-sm"
            >
              Reset Timer
            </button>
            
            <button
              onClick={handleCloseQuestion}
              className="px-3 py-1 bg-gray-200 text-gray-800 rounded-md text-sm"
            >
              Back to Grid
            </button>
          </div>
        </div>
        
        {/* Timer */}
        <Timer />
        
        {/* Current team */}
        {currentTeam && (
          <div className="flex justify-between items-center mb-2">
            <div className="font-medium">
              Current Team: <span className="text-blue-600">{currentTeam.name}</span>
            </div>
            <div className="font-medium">
              Score: <span className="text-green-600">{currentTeam.points}</span>
            </div>
          </div>
        )}
        
        <h1 className="text-2xl font-bold text-gray-800">{currentQuestion.text}</h1>
      </div>
      
      {/* Answers grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {currentQuestion.answers.map((answer, index) => {
          const isSelected = selectedAnswerIndex === index;
          const isCorrect = revealAnswer && index === currentQuestion.correctAnswerIndex;
          const isIncorrect = revealAnswer && isSelected && !isCorrect;
          
          let bgColor = 'bg-white';
          let borderColor = 'border-gray-200';
          
          if (isCorrect) {
            bgColor = `bg-[${quizColors.correct}]/10`;
            borderColor = `border-[${quizColors.correct}]`;
          } else if (isIncorrect) {
            bgColor = `bg-[${quizColors.incorrect}]/10`;
            borderColor = `border-[${quizColors.incorrect}]`;
          } else if (isSelected) {
            bgColor = `bg-[${quizColors.selected}]/10`;
            borderColor = `border-[${quizColors.selected}]`;
          }
          
          return (
            <motion.div
              key={index}
              className={`${bgColor} ${borderColor} border-2 rounded-xl p-6 cursor-pointer
                ${!revealAnswer && isTimerRunning ? 'hover:border-blue-400 hover:bg-blue-50' : ''}`}
              whileHover={!revealAnswer && isTimerRunning ? { scale: 1.02 } : {}}
              onClick={() => handleAnswerClick(index)}
              animate={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className="flex justify-between items-center">
                <span className="text-xl font-medium">
                  {String.fromCharCode(65 + index)}. {answer}
                </span>
                {isCorrect && (
                  <Check className="text-green-600 h-6 w-6" />
                )}
                {isIncorrect && (
                  <X className="text-red-600 h-6 w-6" />
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
      
      {/* Action buttons */}
      <div className="flex justify-center gap-4">
        {!revealAnswer && (
          <button
            onClick={handleRevealAnswer}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Reveal Answer
          </button>
        )}
        
        {revealAnswer && !pointsAwarded && currentTeam && (
          <button
            onClick={handleAwardPoints}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Award Points
          </button>
        )}
      </div>
    </div>
  );
};

export default QuestionView;
