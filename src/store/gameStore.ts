
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
  questionWindow: string;
  cardBackground: string;
  cardNumber: string;
  teamColor: string;
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
  logoUrl: string | null;
  logoText: string | null;
  logoSize: number;
  lastUpdateTimestamp: number;
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
  
  addCustomSound: (name: string, url: string, existingId?: string) => void;
  removeSound: (id: string) => void;
  
  setLogoUrl: (url: string | null) => void;
  setLogoText: (text: string | null) => void;
  setLogoSize: (size: number) => void;
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
  activeTeam: '#3B82F6',
  questionWindow: '#FFFFFF',
  cardBackground: '#3B82F6',
  cardNumber: '#FFFFFF',
  teamColor: '#6E59A5'
};

const SYNC_KEY = 'hamam-quiz-game-sync';

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
      logoUrl: null,
      logoText: null,
      logoSize: 100,
      lastUpdateTimestamp: Date.now(),
      
      setLogoUrl: (url) => {
        set({ 
          logoUrl: url,
          lastUpdateTimestamp: Date.now()
        });
        
        syncToLocalStorage({
          type: 'SET_LOGO_URL',
          payload: { url }
        });
      },
      
      setLogoText: (text) => {
        set({ 
          logoText: text,
          lastUpdateTimestamp: Date.now()
        });
        
        syncToLocalStorage({
          type: 'SET_LOGO_TEXT',
          payload: { text }
        });
      },
      
      setLogoSize: (size) => {
        set({ 
          logoSize: size,
          lastUpdateTimestamp: Date.now()
        });
        
        syncToLocalStorage({
          type: 'SET_LOGO_SIZE',
          payload: { size }
        });
      },
      
      setCustomColors: (colors) => {
        const updatedColors = { ...get().quizColors, ...colors };
        useGameStore.setState({ 
          quizColors: updatedColors,
          lastUpdateTimestamp: Date.now()
        });
        
        Object.entries(updatedColors).forEach(([key, value]) => {
          document.documentElement.style.setProperty(`--quiz-${key}`, value);
        });
        
        syncToLocalStorage({
          type: 'SET_COLORS',
          payload: { colors: updatedColors }
        });
      },
      
      resetColors: () => {
        useGameStore.setState({ 
          quizColors: defaultColors,
          lastUpdateTimestamp: Date.now()
        });
        
        Object.entries(defaultColors).forEach(([key, value]) => {
          document.documentElement.style.setProperty(`--quiz-${key}`, value);
        });
        
        syncToLocalStorage({
          type: 'SET_COLORS',
          payload: { colors: defaultColors }
        });
      },
      
      addCustomSound: (name: string, url: string, existingId?: string) => {
        const newSound: Sound = {
          id: existingId || `custom-${Date.now()}`,
          name,
          url,
          isCustom: true
        };
        
        let updatedSounds;
        if (existingId) {
          updatedSounds = get().sounds.filter(s => s.id !== existingId);
          updatedSounds.push(newSound);
        } else {
          updatedSounds = [...get().sounds, newSound];
        }
        
        useGameStore.setState({ 
          sounds: updatedSounds,
          lastUpdateTimestamp: Date.now()
        });
        
        syncToLocalStorage({
          type: 'SET_SOUNDS',
          payload: { sounds: updatedSounds }
        });
      },
      
      removeSound: (id) => {
        const sound = get().sounds.find(s => s.id === id);
        if (sound?.isCustom) {
          const updatedSounds = get().sounds.filter(s => s.id !== id);
          
          set({ 
            sounds: updatedSounds,
            lastUpdateTimestamp: Date.now()
          });
          
          syncToLocalStorage({
            type: 'SET_SOUNDS',
            payload: { sounds: updatedSounds }
          });
        }
      },
      
      setTeams: (teams) => {
        set({ 
          teams,
          lastUpdateTimestamp: Date.now()
        });
        
        syncToLocalStorage({
          type: 'SET_TEAMS',
          payload: { teams }
        });
      },
      
      setQuestions: (questions) => {
        set({ 
          questions,
          lastUpdateTimestamp: Date.now()
        });
      },
      
      addQuestion: (question) => {
        const questions = get().questions;
        const newId = questions.length > 0 
          ? Math.max(...questions.map(q => q.id)) + 1 
          : 1;
        
        const updatedQuestions = [...questions, { ...question, id: newId }];
        
        set({
          questions: updatedQuestions,
          lastUpdateTimestamp: Date.now()
        });
      },
      
      updateQuestion: (id, updatedQuestion) => {
        const updatedQuestions = get().questions.map(q => 
          q.id === id ? { ...q, ...updatedQuestion } : q
        );
        
        set({
          questions: updatedQuestions,
          lastUpdateTimestamp: Date.now()
        });
      },
      
      removeQuestion: (id) => {
        const updatedQuestions = get().questions.filter(q => q.id !== id);
        
        set({
          questions: updatedQuestions,
          lastUpdateTimestamp: Date.now()
        });
      },
      
      uploadQuestions: (questions) => {
        set({ 
          questions,
          lastUpdateTimestamp: Date.now()
        });
      },
      
      resetQuestions: () => {
        set({ 
          questions: defaultQuestions,
          lastUpdateTimestamp: Date.now()
        });
      },
      
      addTeam: (name) => {
        const teams = get().teams;
        const newId = teams.length > 0 
          ? Math.max(...teams.map(t => t.id)) + 1 
          : 1;
        
        const newTeams = [...teams, { id: newId, name, points: 0 }];
        set({ 
          teams: newTeams,
          lastUpdateTimestamp: Date.now()
        });
        
        syncToLocalStorage({
          type: 'SET_TEAMS',
          payload: { teams: newTeams }
        });
      },
      
      updateTeamPoints: (teamId, points) => {
        const updatedTeams = get().teams.map(t => 
          t.id === teamId ? { ...t, points: t.points + points } : t
        );
        
        set({ 
          teams: updatedTeams,
          lastUpdateTimestamp: Date.now()
        });
        
        const team = updatedTeams.find(t => t.id === teamId);
        if (team) {
          if (points > 0) {
            get().showNotification(`${team.name} earned ${points} points!`, 'success');
          } else if (points < 0) {
            get().showNotification(`${team.name} lost ${Math.abs(points)} points!`, 'error');
          }
        }
        
        syncToLocalStorage({
          type: 'SET_TEAMS',
          payload: { teams: updatedTeams }
        });
      },
      
      removeTeam: (teamId) => {
        const updatedTeams = get().teams.filter(t => t.id !== teamId);
        set({
          teams: updatedTeams,
          currentTeamIndex: get().currentTeamIndex >= updatedTeams.length 
            ? 0 
            : get().currentTeamIndex,
          lastUpdateTimestamp: Date.now()
        });
        
        syncToLocalStorage({
          type: 'SET_TEAMS',
          payload: { teams: updatedTeams }
        });
      },
      
      setCurrentTeam: (index) => {
        set({ 
          currentTeamIndex: index,
          lastUpdateTimestamp: Date.now()
        });
        
        syncToLocalStorage({
          type: 'SET_CURRENT_TEAM',
          payload: { index }
        });
      },
      
      nextTeam: () => {
        const { teams, currentTeamIndex } = get();
        if (teams.length === 0) return;
        
        const nextIndex = (currentTeamIndex + 1) % teams.length;
        set({ 
          currentTeamIndex: nextIndex,
          lastUpdateTimestamp: Date.now()
        });
        
        syncToLocalStorage({
          type: 'SET_CURRENT_TEAM',
          payload: { index: nextIndex }
        });
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
          isTimerRunning: true,
          lastUpdateTimestamp: Date.now()
        });
        
        syncToLocalStorage({
          type: 'SELECT_QUESTION',
          payload: { questionId: id }
        });
      },
      
      selectAnswer: (index) => {
        set({ 
          selectedAnswerIndex: index,
          lastUpdateTimestamp: Date.now()
        });
        
        syncToLocalStorage({
          type: 'SELECT_ANSWER',
          payload: { answerIndex: index }
        });
      },
      
      showAnswer: () => {
        set({ 
          revealAnswer: true,
          isTimerRunning: false,
          lastUpdateTimestamp: Date.now()
        });
        
        const questionId = get().selectedQuestionId;
        if (questionId !== null && !get().completedQuestions.includes(questionId)) {
          get().markQuestionCompleted(questionId);
        }
        
        syncToLocalStorage({
          type: 'SHOW_ANSWER',
          payload: {}
        });
      },
      
      closeQuestion: () => {
        const { selectedQuestionId, revealAnswer } = get();
        
        if (revealAnswer || selectedQuestionId === null) {
          set({
            selectedQuestionId: null,
            selectedAnswerIndex: null,
            revealAnswer: false,
            activeView: 'grid',
            isTimerRunning: false,
            lastUpdateTimestamp: Date.now()
          });
          
          get().nextTeam();
          
          syncToLocalStorage({
            type: 'CLOSE_QUESTION',
            payload: {}
          });
        }
      },
      
      startTimer: () => {
        set({ 
          isTimerRunning: true,
          lastUpdateTimestamp: Date.now()
        });
        
        syncToLocalStorage({
          type: 'START_TIMER',
          payload: {}
        });
      },
      
      stopTimer: () => {
        set({ 
          isTimerRunning: false,
          lastUpdateTimestamp: Date.now()
        });
        
        syncToLocalStorage({
          type: 'STOP_TIMER',
          payload: {}
        });
      },
      
      resetTimer: (time) => {
        const questionId = get().selectedQuestionId;
        let newTime = time;
        
        if (time === undefined && questionId !== null) {
          const question = get().questions.find(q => q.id === questionId);
          newTime = question ? question.timeLimit : 30;
        }
        
        set({ 
          remainingTime: newTime || 30,
          lastUpdateTimestamp: Date.now()
        });
        
        syncToLocalStorage({
          type: 'RESET_TIMER',
          payload: { time: newTime }
        });
      },
      
      tickTimer: () => {
        const { remainingTime, isTimerRunning, revealAnswer } = get();
        
        if (isTimerRunning && remainingTime > 0 && !revealAnswer) {
          set({ 
            remainingTime: remainingTime - 1,
            lastUpdateTimestamp: Date.now()
          });
          
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
          },
          lastUpdateTimestamp: Date.now()
        });
        
        setTimeout(() => {
          get().hideNotification();
        }, 5000);
        
        syncToLocalStorage({
          type: 'SHOW_NOTIFICATION',
          payload: { message, type }
        });
      },
      
      hideNotification: () => {
        set({
          notification: {
            ...get().notification,
            visible: false
          },
          lastUpdateTimestamp: Date.now()
        });
        
        syncToLocalStorage({
          type: 'HIDE_NOTIFICATION',
          payload: {}
        });
      },
      
      markQuestionCompleted: (id) => {
        if (!get().completedQuestions.includes(id)) {
          const updatedCompleted = [...get().completedQuestions, id];
          set({
            completedQuestions: updatedCompleted,
            lastUpdateTimestamp: Date.now()
          });
          
          syncToLocalStorage({
            type: 'SET_COMPLETED_QUESTIONS',
            payload: { completedQuestions: updatedCompleted }
          });
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
          teams: updatedTeams,
          lastUpdateTimestamp: Date.now()
        });
        
        syncToLocalStorage({
          type: 'RESET_GAME',
          payload: { teams: updatedTeams }
        });
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
        logoUrl: state.logoUrl,
        logoText: state.logoText,
        logoSize: state.logoSize,
      }),
    }
  )
);

// Function to sync state to localStorage
const syncToLocalStorage = (action: any) => {
  const timestamp = Date.now();
  localStorage.setItem(SYNC_KEY, JSON.stringify({
    action,
    timestamp
  }));
};

// Function to initialize localStorage sync
export const initializeLocalStorageSync = (role: 'admin' | 'host' | 'player') => {
  let lastProcessedTimestamp = 0;
  
  // Check for updates every 500ms
  const checkForUpdates = () => {
    try {
      const syncData = localStorage.getItem(SYNC_KEY);
      if (!syncData) return;
      
      const { action, timestamp } = JSON.parse(syncData);
      
      // Skip if we've already processed this update or if it's our own update
      if (timestamp <= lastProcessedTimestamp) return;
      if (timestamp <= useGameStore.getState().lastUpdateTimestamp) return;
      
      lastProcessedTimestamp = timestamp;
      
      // Process the action
      const store = useGameStore.getState();
      
      if (role === 'player' || role === 'host') {
        switch (action.type) {
          case 'SET_TEAMS':
            useGameStore.setState({ teams: action.payload.teams });
            break;
            
          case 'SET_CURRENT_TEAM':
            store.setCurrentTeam(action.payload.index);
            break;
            
          case 'SET_COMPLETED_QUESTIONS':
            if (action.payload.completedQuestions) {
              action.payload.completedQuestions.forEach((id: number) => {
                if (!store.completedQuestions.includes(id)) {
                  store.markQuestionCompleted(id);
                }
              });
            }
            break;
            
          case 'SELECT_QUESTION':
            store.selectQuestion(action.payload.questionId);
            break;
            
          case 'SELECT_ANSWER':
            store.selectAnswer(action.payload.answerIndex);
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
            store.resetTimer(action.payload.time);
            break;
            
          case 'SHOW_NOTIFICATION':
            store.showNotification(action.payload.message, action.payload.type);
            break;
            
          case 'HIDE_NOTIFICATION':
            store.hideNotification();
            break;
          
          case 'RESET_GAME':
            if (action.payload.teams) {
              store.setTeams(action.payload.teams);
            }
            store.resetGame();
            break;
            
          case 'SET_COLORS':
            if (action.payload.colors) {
              store.setCustomColors(action.payload.colors);
            }
            break;
            
          case 'SET_SOUNDS':
            if (action.payload.sounds) {
              useGameStore.setState({ sounds: action.payload.sounds });
            }
            break;
            
          case 'SET_LOGO_URL':
            useGameStore.setState({ logoUrl: action.payload.url });
            break;
            
          case 'SET_LOGO_TEXT':
            useGameStore.setState({ logoText: action.payload.text });
            break;
            
          case 'SET_LOGO_SIZE':
            useGameStore.setState({ logoSize: action.payload.size });
            break;
        }
      }
    } catch (error) {
      console.error('Error processing localStorage sync:', error);
    }
  };
  
  // Set up interval to check for updates
  const syncInterval = setInterval(checkForUpdates, 500);
  
  // Return cleanup function
  return () => {
    clearInterval(syncInterval);
  };
};

export const playSound = (soundId: string) => {
  const store = useGameStore.getState();
  const sound = store.sounds.find(s => s.id === soundId);
  
  if (sound) {
    const audio = new Audio(sound.url);
    audio.play().catch(err => {
      console.error('Error playing sound:', err);
    });
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
