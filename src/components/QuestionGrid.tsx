
import React from 'react';
import { useGameStore } from '@/store/gameStore';
import QuestionCard from './QuestionCard';

const QuestionGrid: React.FC = () => {
  const { questions, questionWindowImageUrl, questionWindowOpacity } = useGameStore();

  // Calculate grid columns based on number of questions
  const getGridColumns = () => {
    const count = questions.length;
    if (count <= 4) return 'grid-cols-2';
    if (count <= 9) return 'grid-cols-3';
    return 'grid-cols-4';
  };

  const backgroundStyle = questionWindowImageUrl ? {
    backgroundImage: `url(${questionWindowImageUrl})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    opacity: questionWindowOpacity
  } : {};

  return (
    <div className="question-grid-container p-4 relative">
      {questionWindowImageUrl && (
        <div 
          className="absolute inset-0 rounded-xl -m-4"
          style={backgroundStyle}
        ></div>
      )}
      <div className={`grid ${getGridColumns()} gap-4 relative z-10`}>
        {questions.map((question, index) => (
          <QuestionCard 
            key={question.id} 
            id={question.id} 
            index={index}
          />
        ))}
      </div>
    </div>
  );
};

export default QuestionGrid;
