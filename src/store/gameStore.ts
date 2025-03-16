
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { defaultQuestions } from '@/data/defaultQuestions';

export type Question = {
  id: number;
  text: string;
  category?: string;
  answers: string[];
  correctAnswerIndex: number;
  points: number;
  timeLimit: number;
  usedCustomReward: boolean;
  customReward?: string;
  customPenalty?: string;
};

export type Team = {
  id: number;
  name: string;
  points: number;
};

export type GameState = {
  questions: Question[];
  teams: Team[];
  currentTeamIndex: number;
  selectedQuestionId: number | null;
  selectedAnswerIndex: number | null;
  revealAnswer: boolean;
  isTimerRunning: boolean;
  remainingTime: number;
  activeView: 'grid' | 'question';
  completedQuestions: number[];
  adminPassword: string;
  notification: {
    visible: boolean;
    message: string;
    type: 'success' | 'error' | 'info';
  };
};

export type GameActions = {
  // Questions actions
  setQuestions: (questions: Question[]) => void;
  addQuestion: (question: Omit<Question, 'id'>) => void;
  updateQuestion: (id: number, question: Partial<Question>) => void;
  removeQuestion: (id: number) => void;
  uploadQuestions: (questions: Question[]) => void;
  resetQuestions: () => void;
  
  // Teams actions
  addTeam: (name: string) => void;
  updateTeamPoints: (teamId: number, points: number) => void;
  removeTeam: (teamId: number) => void;
  setCurrentTeam: (index: number) => void;
  nextTeam: () => void;
  
  // Game flow actions
  selectQuestion: (id: number) => void;
  selectAnswer: (index: number) => void;
  showAnswer: () => void;
  closeQuestion: () => void;
  
  // Timer actions
  startTimer: () => void;
  stopTimer: () => void;
  resetTimer: (time?: number) => void;
  tickTimer: () => void;
  
  // Admin actions
  verifyAdminPassword: (password: string) => boolean;
  
  // Notification actions
  showNotification: (message: string, type: 'success' | 'error' | 'info') => void;
  hideNotification: () => void;
  
  // Mark question as completed
  markQuestionCompleted: (id: number) => void;
};

export type GameStore = GameState & GameActions;

// Create a broadcast channel for cross-window communication
let broadcastChannel: BroadcastChannel | null = null;
try {
  broadcastChannel = new BroadcastChannel('hamam-quiz-game');
} catch (error) {
  console.error('BroadcastChannel is not supported in this browser');
}

// Define the game store
export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      // Initial state
      questions: defaultQuestions,
      teams: [],
      currentTeamIndex: 0,
      selectedQuestionId: null,
      selectedAnswerIndex: null,
      revealAnswer: false,
      isTimerRunning: false,
      remainingTime: 0,
      activeView: 'grid',
      completedQuestions: [],
      adminPassword: '112233',
      notification: {
        visible: false,
        message: '',
        type: 'info',
      },
      
      // Questions actions
      setQuestions: (questions) => {
        set({ questions });
      },
      
      addQuestion: (question) => {
        const questions = get().questions;
        const newId = questions.length > 0 
          ? Math.max(...questions.map(q => q.id)) + 1 
          : 1;
        
        set({
          questions: [...questions, { ...question, id: newId }]
        });
      },
      
      updateQuestion: (id, updatedQuestion) => {
        set({
          questions: get().questions.map(q => 
            q.id === id ? { ...q, ...updatedQuestion } : q
          )
        });
      },
      
      removeQuestion: (id) => {
        set({
          questions: get().questions.filter(q => q.id !== id)
        });
      },
      
      uploadQuestions: (questions) => {
        set({ questions });
      },
      
      resetQuestions: () => {
        set({ questions: defaultQuestions });
      },
      
      // Teams actions
      addTeam: (name) => {
        const teams = get().teams;
        const newId = teams.length > 0 
          ? Math.max(...teams.map(t => t.id)) + 1 
          : 1;
        
        set({
          teams: [...teams, { id: newId, name, points: 0 }]
        });
      },
      
      updateTeamPoints: (teamId, points) => {
        set({
          teams: get().teams.map(t => 
            t.id === teamId ? { ...t, points: t.points + points } : t
          )
        });
        
        // Show notification
        const team = get().teams.find(t => t.id === teamId);
        if (team) {
          if (points > 0) {
            get().showNotification(`${team.name} earned ${points} points!`, 'success');
          } else if (points < 0) {
            get().showNotification(`${team.name} lost ${Math.abs(points)} points!`, 'error');
          }
        }
      },
      
      removeTeam: (teamId) => {
        const teams = get().teams.filter(t => t.id !== teamId);
        set({
          teams,
          currentTeamIndex: get().currentTeamIndex >= teams.length 
            ? 0 
            : get().currentTeamIndex
        });
      },
      
      setCurrentTeam: (index) => {
        set({ currentTeamIndex: index });
      },
      
      nextTeam: () => {
        const { teams, currentTeamIndex } = get();
        if (teams.length === 0) return;
        
        const nextIndex = (currentTeamIndex + 1) % teams.length;
        set({ currentTeamIndex: nextIndex });
      },
      
      // Game flow actions
      selectQuestion: (id) => {
        const question = get().questions.find(q => q.id === id);
        if (!question) return;
        
        set({
          selectedQuestionId: id,
          selectedAnswerIndex: null,
          revealAnswer: false,
          activeView: 'question',
          remainingTime: question.timeLimit,
          isTimerRunning: true
        });
        
        // Broadcast to player windows
        if (broadcastChannel) {
          broadcastChannel.postMessage({
            type: 'SELECT_QUESTION',
            payload: { questionId: id }
          });
        }
      },
      
      selectAnswer: (index) => {
        set({ selectedAnswerIndex: index });
        
        // Broadcast to player windows
        if (broadcastChannel) {
          broadcastChannel.postMessage({
            type: 'SELECT_ANSWER',
            payload: { answerIndex: index }
          });
        }
      },
      
      showAnswer: () => {
        set({ 
          revealAnswer: true,
          isTimerRunning: false
        });
        
        // Mark question as completed
        const questionId = get().selectedQuestionId;
        if (questionId !== null && !get().completedQuestions.includes(questionId)) {
          get().markQuestionCompleted(questionId);
        }
        
        // Broadcast to player windows
        if (broadcastChannel) {
          broadcastChannel.postMessage({
            type: 'SHOW_ANSWER',
            payload: {}
          });
        }
      },
      
      closeQuestion: () => {
        const { selectedQuestionId, revealAnswer } = get();
        
        // Only close if answer was revealed or no answer selected
        if (revealAnswer || selectedQuestionId === null) {
          set({
            selectedQuestionId: null,
            selectedAnswerIndex: null,
            revealAnswer: false,
            activeView: 'grid',
            isTimerRunning: false
          });
          
          // Move to next team
          get().nextTeam();
          
          // Broadcast to player windows
          if (broadcastChannel) {
            broadcastChannel.postMessage({
              type: 'CLOSE_QUESTION',
              payload: {}
            });
          }
        }
      },
      
      // Timer actions
      startTimer: () => {
        set({ isTimerRunning: true });
        
        // Broadcast to player windows
        if (broadcastChannel) {
          broadcastChannel.postMessage({
            type: 'START_TIMER',
            payload: {}
          });
        }
      },
      
      stopTimer: () => {
        set({ isTimerRunning: false });
        
        // Broadcast to player windows
        if (broadcastChannel) {
          broadcastChannel.postMessage({
            type: 'STOP_TIMER',
            payload: {}
          });
        }
      },
      
      resetTimer: (time) => {
        const questionId = get().selectedQuestionId;
        let newTime = time;
        
        if (time === undefined && questionId !== null) {
          const question = get().questions.find(q => q.id === questionId);
          newTime = question ? question.timeLimit : 30;
        }
        
        set({ remainingTime: newTime || 30 });
        
        // Broadcast to player windows
        if (broadcastChannel) {
          broadcastChannel.postMessage({
            type: 'RESET_TIMER',
            payload: { time: newTime }
          });
        }
      },
      
      tickTimer: () => {
        const { remainingTime, isTimerRunning, revealAnswer } = get();
        
        if (isTimerRunning && remainingTime > 0 && !revealAnswer) {
          set({ remainingTime: remainingTime - 1 });
          
          // If timer reaches 0, automatically reveal answer
          if (remainingTime === 1) {
            get().showAnswer();
          }
        }
      },
      
      // Admin actions
      verifyAdminPassword: (password) => {
        return password === get().adminPassword;
      },
      
      // Notification actions
      showNotification: (message, type) => {
        set({
          notification: {
            visible: true,
            message,
            type
          }
        });
        
        // Auto-hide after 3 seconds
        setTimeout(() => {
          get().hideNotification();
        }, 3000);
        
        // Broadcast to player windows
        if (broadcastChannel) {
          broadcastChannel.postMessage({
            type: 'SHOW_NOTIFICATION',
            payload: { message, type }
          });
        }
      },
      
      hideNotification: () => {
        set({
          notification: {
            ...get().notification,
            visible: false
          }
        });
        
        // Broadcast to player windows
        if (broadcastChannel) {
          broadcastChannel.postMessage({
            type: 'HIDE_NOTIFICATION',
            payload: {}
          });
        }
      },
      
      // Mark question as completed
      markQuestionCompleted: (id) => {
        if (!get().completedQuestions.includes(id)) {
          set({
            completedQuestions: [...get().completedQuestions, id]
          });
        }
      }
    }),
    {
      name: 'hamam-quiz-game',
      partialize: (state) => ({
        questions: state.questions,
        teams: state.teams,
        completedQuestions: state.completedQuestions,
      }),
    }
  )
);

// Set up listener for broadcast messages
export const initializeBroadcastListener = (role: 'admin' | 'host' | 'player') => {
  if (!broadcastChannel) return;
  
  broadcastChannel.onmessage = (event) => {
    const { type, payload } = event.data;
    const store = useGameStore.getState();
    
    // Player only listens to messages, doesn't send
    if (role === 'player') {
      switch (type) {
        case 'SELECT_QUESTION':
          store.selectQuestion(payload.questionId);
          break;
          
        case 'SELECT_ANSWER':
          store.selectAnswer(payload.answerIndex);
          break;
          
        case 'SHOW_ANSWER':
          store.showAnswer();
          break;
          
        case 'CLOSE_QUESTION':
          store.closeQuestion();
          break;
          
        case 'START_TIMER':
          store.startTimer();
          break;
          
        case 'STOP_TIMER':
          store.stopTimer();
          break;
          
        case 'RESET_TIMER':
          store.resetTimer(payload.time);
          break;
          
        case 'SHOW_NOTIFICATION':
          store.showNotification(payload.message, payload.type);
          break;
          
        case 'HIDE_NOTIFICATION':
          store.hideNotification();
          break;
      }
    }
  };
};

// Timer interval setup
let timerInterval: number | null = null;

export const startTimerInterval = () => {
  if (timerInterval !== null) {
    clearInterval(timerInterval);
  }
  
  timerInterval = window.setInterval(() => {
    const store = useGameStore.getState();
    store.tickTimer();
  }, 1000) as unknown as number;
};

export const stopTimerInterval = () => {
  if (timerInterval !== null) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
};
