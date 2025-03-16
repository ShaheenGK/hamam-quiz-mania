
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '@/store/gameStore';
import { Users, Shield, Monitor } from 'lucide-react';
import { playSound } from '@/utils/sound';

const Index: React.FC = () => {
  const navigate = useNavigate();
  const { teams } = useGameStore();

  const handleNavigation = (route: string) => {
    playSound('buttonClick');
    navigate(route);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 p-4">
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-5xl font-bold text-gray-800 mb-4">Hamam Quiz Game</h1>
        <p className="text-xl text-gray-600">Select your role to continue</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl">
        <motion.div
          className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          onClick={() => handleNavigation('/admin')}
        >
          <div className="h-32 bg-blue-600 flex items-center justify-center">
            <Shield size={64} className="text-white" />
          </div>
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Admin</h2>
            <p className="text-gray-600 mb-4">Manage questions, teams, and game settings</p>
            <button 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                handleNavigation('/admin');
              }}
            >
              Enter as Admin
            </button>
          </div>
        </motion.div>

        <motion.div
          className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          onClick={() => handleNavigation('/host')}
        >
          <div className="h-32 bg-green-600 flex items-center justify-center">
            <Monitor size={64} className="text-white" />
          </div>
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Host</h2>
            <p className="text-gray-600 mb-4">Control the game, reveal answers, and award points</p>
            <button 
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                handleNavigation('/host');
              }}
            >
              Enter as Host
            </button>
          </div>
        </motion.div>

        <motion.div
          className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          onClick={() => handleNavigation('/player')}
        >
          <div className="h-32 bg-purple-600 flex items-center justify-center">
            <Users size={64} className="text-white" />
          </div>
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Player</h2>
            <p className="text-gray-600 mb-4">View questions and follow along with the game</p>
            <button 
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                handleNavigation('/player');
              }}
            >
              Enter as Player
            </button>
          </div>
        </motion.div>
      </div>

      {teams.length > 0 && (
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <p className="text-lg text-gray-600 mb-2">Current Teams:</p>
          <div className="flex flex-wrap justify-center gap-4">
            {teams.map(team => (
              <div key={team.id} className="bg-white px-4 py-2 rounded-lg shadow">
                <span className="font-medium">{team.name}: </span>
                <span>{team.points} points</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Index;
