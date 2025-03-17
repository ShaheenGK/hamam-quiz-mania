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

export type Sound = {
  id: string;
  name: string;
  url: string;
  isCustom: boolean;
};

export type QuizColors = {
  correct: string;
  incorrect: string;
  selected: string;
  timerStart: string;
  timerMid: string;
  timerEnd: string;
  activeTeam: string;
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
  quizColors: QuizColors;
  sounds: Sound[];
};

export type GameActions = {
  setQuestions: (questions: Question[]) => void;
  addQuestion: (question: Omit<Question, 'id'>) => void;
  updateQuestion: (id: number, question: Partial<Question>) => void;
  removeQuestion: (id: number) => void;
  uploadQuestions: (questions: Question[]) => void;
  resetQuestions: () => void;
  
  addTeam: (name: string) => void;
  updateTeamPoints: (teamId: number, points: number) => void;
  removeTeam: (teamId: number) => void;
  setCurrentTeam: (index: number) => void;
  nextTeam: () => void;
  
  selectQuestion: (id: number) => void;
  selectAnswer: (index: number) => void;
  showAnswer: () => void;
  closeQuestion: () => void;
  
  startTimer: () => void;
  stopTimer: () => void;
  resetTimer: (time?: number) => void;
  tickTimer: () => void;
  
  verifyAdminPassword: (password: string) => boolean;
  
  showNotification: (message: string, type: 'success' | 'error' | 'info') => void;
  hideNotification: () => void;
  
  markQuestionCompleted: (id: number) => void;
  
  resetGame: () => void;
  
  setTeams: (teams: Team[]) => void;
  
  setCustomColors: (colors: Partial<QuizColors>) => void;
  resetColors: () => void;
  
  addCustomSound: (name: string, url: string) => void;
  removeSound: (id: string) => void;
};

export type GameStore = GameState & GameActions;

const defaultSounds: Sound[] = [
  {
    id: 'correctAnswer',
    name: 'Correct Answer',
    url: '/sounds/correct.mp3',
    isCustom: false
  },
  {
    id: 'wrongAnswer',
    name: 'Wrong Answer',
    url: '/sounds/wrong.mp3',
    isCustom: false
  },
  {
    id: 'buttonClick',
    name: 'Button Click',
    url: '/sounds/click.mp3',
    isCustom: false
  },
  {
    id: 'timerEnd',
    name: 'Timer End',
    url: '/sounds/timer.mp3',
    isCustom: false
  }
];

const defaultColors: QuizColors = {
  correct: '#10B981',
  incorrect: '#EF4444',
  selected: '#FFA500',
  timerStart: '#3B82F6',
  timerMid: '#F97316',
  timerEnd: '#EF4444',
  activeTeam: '#3B82F6'
};

let broadcastChannel: BroadcastChannel | null = null;
try {
  broadcastChannel = new BroadcastChannel('hamam-quiz-game');
} catch (error) {
  console.error('BroadcastChannel is not supported in this browser');
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
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
      quizColors: defaultColors,
      sounds: defaultSounds,
      
      setCustomColors: (colors) => {
        const updatedColors = { ...get().quizColors, ...colors };
        set({ quizColors: updatedColors });
        
        Object.entries(updatedColors).forEach(([key, value]) => {
          document.documentElement.style.setProperty(`--quiz-${key}`, value);
        });
        
        if (broadcastChannel) {
          broadcastChannel.postMessage({
            type: 'SET_COLORS',
            payload: { colors: updatedColors }
          });
        }
      },
      
      resetColors: () => {
        set({ quizColors: defaultColors });
        
        Object.entries(defaultColors).forEach(([key, value]) => {
          document.documentElement.style.setProperty(`--quiz-${key}`, value);
        });
        
        if (broadcastChannel) {
          broadcastChannel.postMessage({
            type: 'SET_COLORS',
            payload: { colors: defaultColors }
          });
        }
      },
      
      addCustomSound: (name, url) => {
        const newSound: Sound = {
          id: `custom-${Date.now()}`,
          name,
          url,
          isCustom: true
        };
        
        set({ sounds: [...get().sounds, newSound] });
        
        if (broadcastChannel) {
          broadcastChannel.postMessage({
            type: 'ADD_SOUND',
            payload: { sound: newSound }
          });
        }
      },
      
      removeSound: (id) => {
        const sound = get().sounds.find(s => s.id === id);
        if (sound?.isCustom) {
          set({ sounds: get().sounds.filter(s => s.id !== id) });
          
          if (broadcastChannel) {
            broadcastChannel.postMessage({
              type: 'REMOVE_SOUND',
              payload: { soundId: id }
            });
          }
        }
      },
      
      setTeams: (teams) => {
        set({ teams });
        
        if (broadcastChannel) {
          broadcastChannel.postMessage({
            type: 'SET_TEAMS',
            payload: { teams }
          });
        }
      },
      
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
      
      addTeam: (name) => {
        const teams = get().teams;
        const newId = teams.length > 0 
          ? Math.max(...teams.map(t => t.id)) + 1 
          : 1;
        
        const newTeams = [...teams, { id: newId, name, points: 0 }];
        set({ teams: newTeams });
        
        if (broadcastChannel) {
          broadcastChannel.postMessage({
            type: 'SET_TEAMS',
            payload: { teams: newTeams }
          });
        }
      },
      
      updateTeamPoints: (teamId, points) => {
        const updatedTeams = get().teams.map(t => 
          t.id === teamId ? { ...t, points: t.points + points } : t
        );
        
        set({ teams: updatedTeams });
        
        const team = updatedTeams.find(t => t.id === teamId);
        if (team) {
          if (points > 0) {
            get().showNotification(`${team.name} earned ${points} points!`, 'success');
          } else if (points < 0) {
            get().showNotification(`${team.name} lost ${Math.abs(points)} points!`, 'error');
          }
        }
        
        if (broadcastChannel) {
          broadcastChannel.postMessage({
            type: 'SET_TEAMS',
            payload: { teams: updatedTeams }
          });
        }
      },
      
      removeTeam: (teamId) => {
        const updatedTeams = get().teams.filter(t => t.id !== teamId);
        set({
          teams: updatedTeams,
          currentTeamIndex: get().currentTeamIndex >= updatedTeams.length 
            ? 0 
            : get().currentTeamIndex
        });
        
        if (broadcastChannel) {
          broadcastChannel.postMessage({
            type: 'SET_TEAMS',
            payload: { teams: updatedTeams }
          });
        }
      },
      
      setCurrentTeam: (index) => {
        set({ currentTeamIndex: index });
        
        if (broadcastChannel) {
          broadcastChannel.postMessage({
            type: 'SET_CURRENT_TEAM',
            payload: { index }
          });
        }
      },
      
      nextTeam: () => {
        const { teams, currentTeamIndex } = get();
        if (teams.length === 0) return;
        
        const nextIndex = (currentTeamIndex + 1) % teams.length;
        set({ currentTeamIndex: nextIndex });
        
        if (broadcastChannel) {
          broadcastChannel.postMessage({
            type: 'SET_CURRENT_TEAM',
            payload: { index: nextIndex }
          });
        }
      },
      
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
        
        if (broadcastChannel) {
          broadcastChannel.postMessage({
            type: 'SELECT_QUESTION',
            payload: { questionId: id }
          });
        }
      },
      
      selectAnswer: (index) => {
        set({ selectedAnswerIndex: index });
        
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
        
        const questionId = get().selectedQuestionId;
        if (questionId !== null && !get().completedQuestions.includes(questionId)) {
          get().markQuestionCompleted(questionId);
        }
        
        if (broadcastChannel) {
          broadcastChannel.postMessage({
            type: 'SHOW_ANSWER',
            payload: {}
          });
        }
      },
      
      closeQuestion: () => {
        const { selectedQuestionId, revealAnswer } = get();
        
        if (revealAnswer || selectedQuestionId === null) {
          set({
            selectedQuestionId: null,
            selectedAnswerIndex: null,
            revealAnswer: false,
            activeView: 'grid',
            isTimerRunning: false
          });
          
          get().nextTeam();
          
          if (broadcastChannel) {
            broadcastChannel.postMessage({
              type: 'CLOSE_QUESTION',
              payload: {}
            });
          }
        }
      },
      
      startTimer: () => {
        set({ isTimerRunning: true });
        
        if (broadcastChannel) {
          broadcastChannel.postMessage({
            type: 'START_TIMER',
            payload: {}
          });
        }
      },
      
      stopTimer: () => {
        set({ isTimerRunning: false });
        
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
          
          if (remainingTime === 1) {
            get().showAnswer();
          }
        }
      },
      
      verifyAdminPassword: (password) => {
        return password === get().adminPassword;
      },
      
      showNotification: (message, type) => {
        set({
          notification: {
            visible: true,
            message,
            type
          }
        });
        
        setTimeout(() => {
          get().hideNotification();
        }, 5000);
        
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
        
        if (broadcastChannel) {
          broadcastChannel.postMessage({
            type: 'HIDE_NOTIFICATION',
            payload: {}
          });
        }
      },
      
      markQuestionCompleted: (id) => {
        if (!get().completedQuestions.includes(id)) {
          const updatedCompleted = [...get().completedQuestions, id];
          set({
            completedQuestions: updatedCompleted
          });
          
          if (broadcastChannel) {
            broadcastChannel.postMessage({
              type: 'SET_COMPLETED_QUESTIONS',
              payload: { completedQuestions: updatedCompleted }
            });
          }
        }
      },
      
      resetGame: () => {
        const updatedTeams = get().teams.map(team => ({ ...team, points: 0 }));
        
        set({
          completedQuestions: [],
          currentTeamIndex: 0,
          selectedQuestionId: null,
          selectedAnswerIndex: null,
          revealAnswer: false,
          activeView: 'grid',
          isTimerRunning: false,
          remainingTime: 0,
          teams: updatedTeams
        });
        
        if (broadcastChannel) {
          broadcastChannel.postMessage({
            type: 'RESET_GAME',
            payload: { teams: updatedTeams }
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
        currentTeamIndex: state.currentTeamIndex,
        quizColors: state.quizColors,
        sounds: state.sounds,
      }),
    }
  )
);

export const initializeBroadcastListener = (role: 'admin' | 'host' | 'player') => {
  if (!broadcastChannel) return;
  
  broadcastChannel.onmessage = (event) => {
    const { type, payload } = event.data;
    const store = useGameStore.getState();
    
    if (role === 'player' || role === 'admin' || role === 'host') {
      switch (type) {
        case 'SET_TEAMS':
          store.setTeams(payload.teams);
          break;
          
        case 'SET_CURRENT_TEAM':
          store.setCurrentTeam(payload.index);
          break;
          
        case 'SET_COMPLETED_QUESTIONS':
          if (payload.completedQuestions) {
            payload.completedQuestions.forEach((id: number) => {
              if (!store.completedQuestions.includes(id)) {
                store.markQuestionCompleted(id);
              }
            });
          }
          break;
          
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
        
        case 'RESET_GAME':
          if (payload.teams) {
            store.setTeams(payload.teams);
          }
          store.resetGame();
          break;
          
        case 'SET_COLORS':
          if (payload.colors) {
            store.setCustomColors(payload.colors);
          }
          break;
          
        case 'ADD_SOUND':
          if (payload.sound) {
            const sounds = [...store.sounds];
            if (!sounds.some(s => s.id === payload.sound.id)) {
              sounds.push(payload.sound);
              set({ sounds });
            }
          }
          break;
          
        case 'REMOVE_SOUND':
          if (payload.soundId) {
            const sounds = store.sounds.filter(s => s.id !== payload.soundId);
            set({ sounds });
          }
          break;
      }
    }
  };
};

export const playSound = (soundId: string) => {
  const store = useGameStore.getState();
  const sound = store.sounds.find(s => s.id === soundId);
  
  if (sound) {
    const audio = new Audio(sound.url);
    audio.play();
  }
};

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
