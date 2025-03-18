
import React from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';

const TeamDisplay: React.FC = () => {
  const { teams, currentTeamIndex, quizColors } = useGameStore();

  if (teams.length === 0) {
    return (
      <div className="flex justify-center p-4 mb-4 bg-white rounded-lg shadow">
        <p className="text-gray-500 font-medium">No teams added yet</p>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap justify-center mb-4 gap-4">
      {teams.map((team, index) => (
        <motion.div
          key={team.id}
          className={`
            flex flex-col items-center justify-center 
            p-4 bg-white rounded-lg shadow-md
            ${index === currentTeamIndex ? 'border-2' : ''}
          `}
          style={{
            borderColor: index === currentTeamIndex ? quizColors.activeTeam : 'transparent',
            backgroundColor: quizColors.teamColor + '20' // Adding transparency
          }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <h3 className="text-lg font-bold" style={{ color: quizColors.teamColor }}>{team.name}</h3>
          <p className="text-2xl font-bold text-gray-900">{team.points}</p>
        </motion.div>
      ))}
    </div>
  );
};

export default TeamDisplay;
