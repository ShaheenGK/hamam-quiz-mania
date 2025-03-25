import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useGameStore, Question } from '@/store/gameStore';
import { 
  Plus, X, Save, Edit, Trash, Upload, Download, 
  RotateCcw, Check, FileText, RefreshCw, Palette, Music, Image, Settings
} from 'lucide-react';
import { playSound } from '@/utils/sound';
import ColorCustomizer from '@/components/ColorCustomizer';
import SoundCustomizer from '@/components/SoundCustomizer';
import LogoCustomizer from '@/components/LogoCustomizer';
import BackgroundImageUploader from '@/components/BackgroundImageUploader';
import GridBackgroundCustomizer from '@/components/GridBackgroundCustomizer';
import NotificationSettings from '@/components/NotificationSettings';

const Admin: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'questions' | 'teams' | 'appearance' | 'sounds' | 'logo' | 'backgrounds' | 'settings'>('questions');
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [newQuestion, setNewQuestion] = useState<Partial<Question>>({
    text: '',
    answers: ['', '', '', ''],
    correctAnswerIndex: 0,
    points: 100,
    timeLimit: 30,
    usedCustomReward: false,
  });
  const [newTeamName, setNewTeamName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { 
    verifyAdminPassword, 
    questions,
    teams,
    addQuestion,
    updateQuestion,
    removeQuestion,
    uploadQuestions,
    resetQuestions,
    addTeam,
    removeTeam,
    resetGame
  } = useGameStore();

  const handleLogin = () => {
    if (verifyAdminPassword(password)) {
      setIsAuthenticated(true);
      setErrorMessage('');
      playSound('buttonClick');
    } else {
      setErrorMessage('Invalid password');
      playSound('wrongAnswer');
    }
  };

  const handleAddTeam = () => {
    if (newTeamName.trim()) {
      addTeam(newTeamName);
      setNewTeamName('');
      playSound('buttonClick');
    }
  };

  const handleSaveQuestion = () => {
    if (
      newQuestion.text &&
      newQuestion.answers?.every(a => a.trim() !== '') &&
      typeof newQuestion.correctAnswerIndex === 'number' &&
      typeof newQuestion.points === 'number' &&
      typeof newQuestion.timeLimit === 'number'
    ) {
      if (editingQuestion) {
        updateQuestion(editingQuestion.id, {
          text: newQuestion.text,
          answers: newQuestion.answers,
          correctAnswerIndex: newQuestion.correctAnswerIndex,
          points: newQuestion.points,
          timeLimit: newQuestion.timeLimit,
          usedCustomReward: newQuestion.usedCustomReward,
          customReward: newQuestion.customReward,
          customPenalty: newQuestion.customPenalty,
        });
      } else {
        addQuestion({
          text: newQuestion.text,
          answers: newQuestion.answers as string[],
          correctAnswerIndex: newQuestion.correctAnswerIndex as number,
          points: newQuestion.points as number,
          timeLimit: newQuestion.timeLimit as number,
          usedCustomReward: newQuestion.usedCustomReward || false,
          customReward: newQuestion.customReward,
          customPenalty: newQuestion.customPenalty,
        });
      }
      
      resetNewQuestionForm();
      playSound('correctAnswer');
    }
  };

  const resetNewQuestionForm = () => {
    setNewQuestion({
      text: '',
      answers: ['', '', '', ''],
      correctAnswerIndex: 0,
      points: 100,
      timeLimit: 30,
      usedCustomReward: false,
    });
    setEditingQuestion(null);
  };

  const handleEditQuestion = (question: Question) => {
    setEditingQuestion(question);
    setNewQuestion({
      text: question.text,
      answers: [...question.answers],
      correctAnswerIndex: question.correctAnswerIndex,
      points: question.points,
      timeLimit: question.timeLimit,
      usedCustomReward: question.usedCustomReward,
      customReward: question.customReward,
      customPenalty: question.customPenalty,
    });
    playSound('buttonClick');
  };

  const handleExportQuestions = () => {
    const dataStr = JSON.stringify(questions, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'hamam-quiz-questions.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    playSound('buttonClick');
  };

  const handleImportQuestions = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result;
        if (typeof content === 'string') {
          const importedQuestions = JSON.parse(content) as Question[];
          if (Array.isArray(importedQuestions)) {
            uploadQuestions(importedQuestions);
            playSound('correctAnswer');
          }
        }
      } catch (error) {
        console.error("Error parsing JSON file:", error);
        playSound('wrongAnswer');
      }
    };
    reader.readAsText(file);
    
    // Reset the input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleStartNewGame = () => {
    resetGame();
    playSound('buttonClick');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 p-4">
        <motion.div 
          className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Admin Login</h1>
          
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 font-medium mb-2">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter admin password"
            />
            {errorMessage && (
              <p className="mt-2 text-red-500">{errorMessage}</p>
            )}
          </div>
          
          <button
            onClick={handleLogin}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
          >
            Login
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-6">
      <motion.div 
        className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Admin Panel</h1>
            <div className="flex gap-4">
              <button
                onClick={handleStartNewGame}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
              >
                <RefreshCw size={20} />
                Start New Game
              </button>
              <button
                onClick={() => window.open('/host', '_blank')}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
              >
                <FileText size={20} />
                Open Host View
              </button>
              <button
                onClick={() => window.open('/player', '_blank')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
              >
                <FileText size={20} />
                Open Player View
              </button>
            </div>
          </div>
          
          {/* Tabs */}
          <div className="flex flex-wrap border-b border-gray-200 mb-6">
            <button
              className={`px-4 py-2 font-medium text-sm ${
                activeTab === 'questions' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('questions')}
            >
              Questions
            </button>
            <button
              className={`px-4 py-2 font-medium text-sm ${
                activeTab === 'teams' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('teams')}
            >
              Teams
            </button>
            <button
              className={`px-4 py-2 font-medium text-sm flex items-center gap-1 ${
                activeTab === 'appearance' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('appearance')}
            >
              <Palette size={16} />
              Colors
            </button>
            <button
              className={`px-4 py-2 font-medium text-sm flex items-center gap-1 ${
                activeTab === 'backgrounds' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('backgrounds')}
            >
              <Image size={16} />
              Backgrounds
            </button>
            <button
              className={`px-4 py-2 font-medium text-sm flex items-center gap-1 ${
                activeTab === 'settings' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('settings')}
            >
              <Settings size={16} />
              Settings
            </button>
            <button
              className={`px-4 py-2 font-medium text-sm flex items-center gap-1 ${
                activeTab === 'sounds' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('sounds')}
            >
              <Music size={16} />
              Sounds
            </button>
            <button
              className={`px-4 py-2 font-medium text-sm flex items-center gap-1 ${
                activeTab === 'logo' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('logo')}
            >
              <Image size={16} />
              Logo
            </button>
          </div>
          
          {/* Questions Tab */}
          {activeTab === 'questions' && (
            <div>
              <div className="mb-8 bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  {editingQuestion ? 'Edit Question' : 'Add New Question'}
                </h2>
                
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">Question Text</label>
                  <input
                    type="text"
                    value={newQuestion.text || ''}
                    onChange={(e) => setNewQuestion({...newQuestion, text: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter question text"
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">Answers (Select correct answer)</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {newQuestion.answers?.map((answer, index) => (
                      <div key={index} className="flex items-center">
                        <input
                          type="radio"
                          id={`answer-${index}`}
                          name="correctAnswer"
                          checked={newQuestion.correctAnswerIndex === index}
                          onChange={() => setNewQuestion({...newQuestion, correctAnswerIndex: index})}
                          className="mr-2"
                        />
                        <input
                          type="text"
                          value={answer}
                          onChange={(e) => {
                            const newAnswers = [...(newQuestion.answers || [])];
                            newAnswers[index] = e.target.value;
                            setNewQuestion({...newQuestion, answers: newAnswers});
                          }}
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder={`Answer ${index + 1}`}
                        />
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Points</label>
                    <input
                      type="number"
                      value={newQuestion.points || 0}
                      onChange={(e) => setNewQuestion({...newQuestion, points: parseInt(e.target.value)})}
                      min="0"
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Time Limit (seconds)</label>
                    <input
                      type="number"
                      value={newQuestion.timeLimit || 30}
                      onChange={(e) => setNewQuestion({...newQuestion, timeLimit: parseInt(e.target.value)})}
                      min="5"
                      max="300"
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div className="flex items-center mt-8">
                    <input
                      type="checkbox"
                      id="useCustomReward"
                      checked={newQuestion.usedCustomReward || false}
                      onChange={(e) => setNewQuestion({...newQuestion, usedCustomReward: e.target.checked})}
                      className="mr-2"
                    />
                    <label htmlFor="useCustomReward" className="text-gray-700 font-medium">Use Custom Reward/Penalty</label>
                  </div>
                </div>
                
                {newQuestion.usedCustomReward && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Custom Reward</label>
                      <input
                        type="text"
                        value={newQuestion.customReward || ''}
                        onChange={(e) => setNewQuestion({...newQuestion, customReward: e.target.value})}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., Free ice cream"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Custom Penalty</label>
                      <input
                        type="text"
                        value={newQuestion.customPenalty || ''}
                        onChange={(e) => setNewQuestion({...newQuestion, customPenalty: e.target.value})}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., Do 5 pushups"
                      />
                    </div>
                  </div>
                )}
                
                <div className="flex justify-end gap-3 mt-4">
                  {editingQuestion && (
                    <button
                      onClick={resetNewQuestionForm}
                      className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg font-medium flex items-center gap-2 transition-colors"
                    >
                      <X size={18} />
                      Cancel
                    </button>
                  )}
                  
                  <button
                    onClick={handleSaveQuestion}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center gap-2 transition-colors"
                  >
                    <Save size={18} />
                    {editingQuestion ? 'Update Question' : 'Add Question'}
                  </button>
                </div>
              </div>
              
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Question List</h2>
                
                <div className="flex gap-2">
                  <button
                    onClick={handleExportQuestions}
                    className="px-3 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium flex items-center gap-2 transition-colors text-sm"
                  >
                    <Download size={16} />
                    Export
                  </button>
                  
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImportQuestions}
                    accept=".json"
                    className="hidden"
                  />
                  
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium flex items-center gap-2 transition-colors text-sm"
                  >
                    <Upload size={16} />
                    Import
                  </button>
                  
                  <button
                    onClick={resetQuestions}
                    className="px-3 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium flex items-center gap-2 transition-colors text-sm"
                  >
                    <RotateCcw size={16} />
                    Reset
                  </button>
                </div>
              </div>
              
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Question</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Points</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {questions.map((question) => (
                      <tr key={question.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{question.id}</td>
                        <td className="px-6 py-4 text-sm text-gray-500 max-w-md truncate">{question.text}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{question.points}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{question.timeLimit}s</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditQuestion(question)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              onClick={() => removeQuestion(question.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          {/* Teams Tab */}
          {activeTab === 'teams' && (
            <div>
              <div className="mb-8 bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Add Team</h2>
                
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={newTeamName}
                    onChange={(e) => setNewTeamName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddTeam()}
                    className="flex-grow px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter team name"
                  />
                  
                  <button
                    onClick={handleAddTeam}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center gap-2 transition-colors"
                    disabled={!newTeamName.trim()}
                  >
                    <Plus size={18} />
                    Add Team
                  </button>
                </div>
              </div>
              
              <h2 className="text-xl font-bold text-gray-800 mb-4">Team List</h2>
              
              {teams.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">No teams added yet</p>
                </div>
              ) : (
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Points</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {teams.map((team) => (
                        <tr key={team.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{team.id}</td>
                          <td className="px-6 py-4 text-sm text-gray-500">{team.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{team.points}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => removeTeam(team.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash size={18} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
          
          {/* Appearance Tab */}
          {activeTab === 'appearance' && (
            <div>
              <ColorCustomizer />
            </div>
          )}

          {/* Backgrounds Tab */}
          {activeTab === 'backgrounds' && (
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-4">Background Images</h2>
              <p className="text-gray-600 mb-6">Upload custom background images for your quiz.</p>
              
              <BackgroundImageUploader
                type="background" 
                title="Main Background Image"
              />
              
              <BackgroundImageUploader
                type="questionWindow" 
                title="Question Window Background"
              />
              
              <BackgroundImageUploader
                type="message" 
                title="Custom Message Background"
              />
              
              {/* Add Grid Background Customizer */}
              <GridBackgroundCustomizer />
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-4">Game Settings</h2>
              <p className="text-gray-600 mb-6">Configure various game settings.</p>
              
              {/* Add Notification Settings */}
              <NotificationSettings />
            </div>
          )}

          {/* Sounds Tab */}
          {activeTab === 'sounds' && (
            <div>
              <SoundCustomizer />
            </div>
          )}

          {/* Logo Tab */}
          {activeTab === 'logo' && (
            <div>
              <LogoCustomizer />
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Admin;
