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
  notificationDisplayTime: number;
  quizColors: QuizColors;
  sounds: Sound[];
  logoUrl: string | null;
  logoText: string | null;
  logoSize: number;
  backgroundImageUrl: string | null;
  questionWindowImageUrl: string | null;
  customMessageImageUrl: string | null;
  lastUpdateTimestamp: number;
  
  backgroundOpacity: number;
  backgroundSize: number;
  backgroundPositionX: number;
  backgroundPositionY: number;
  
  questionWindowOpacity: number;
  questionWindowSize: number;
  questionWindowPositionX: number;
  questionWindowPositionY: number;
  
  customMessageOpacity: number;
  customMessageSize: number;
  customMessagePositionX: number;
  customMessagePositionY: number;
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
  setNotificationDisplayTime: (time: number) => void;
  
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
  
  setBackgroundImage: (url: string | null) => void;
  setQuestionWindowImage: (url: string | null) => void;
  setCustomMessageImage: (url: string | null) => void;
  
  setBackgroundOpacity: (opacity: number) => void;
  setBackgroundSize: (size: number) => void;
  setBackgroundPositionX: (position: number) => void;
  setBackgroundPositionY: (position: number) => void;
  
  setQuestionWindowOpacity: (opacity: number) => void;
  setQuestionWindowSize: (size: number) => void;
  setQuestionWindowPositionX: (position: number) => void;
  setQuestionWindowPositionY: (position: number) => void;
  
  setCustomMessageOpacity: (opacity: number) => void;
  setCustomMessageSize: (size: number) => void;
  setCustomMessagePositionX: (position: number) => void;
  setCustomMessagePositionY: (position: number) => void;
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
      notificationDisplayTime: 5000,
      quizColors: defaultColors,
      sounds: defaultSounds,
      logoUrl: null,
      logoText: null,
      logoSize: 100,
      backgroundImageUrl: null,
      questionWindowImageUrl: null,
      customMessageImageUrl: null,
      lastUpdateTimestamp: Date.now(),
      
      backgroundOpacity: 0.85,
      backgroundSize: 100,
      backgroundPositionX: 50,
      backgroundPositionY: 50,
      
      questionWindowOpacity: 0.85,
      questionWindowSize: 100,
      questionWindowPositionX: 50,
      questionWindowPositionY: 50,
      
      customMessageOpacity: 0.85,
      customMessageSize: 100,
      customMessagePositionX: 50,
      customMessagePositionY: 50,
      
      setNotificationDisplayTime: (time) => {
        set({ 
          notificationDisplayTime: time,
          lastUpdateTimestamp: Date.now()
        });
        
        syncToLocalStorage({
          type: 'SET_NOTIFICATION_DISPLAY_TIME',
          payload: { time }
        });
      },
      
      setBackgroundImage: (url) => {
        set({ 
          backgroundImageUrl: url,
          lastUpdateTimestamp: Date.now()
        });
        
        syncToLocalStorage({
          type: 'SET_BACKGROUND_IMAGE',
          payload: { url }
        });
      },
      
      setQuestionWindowImage: (url) => {
        set({ 
          questionWindowImageUrl: url,
          lastUpdateTimestamp: Date.now()
        });
        
        syncToLocalStorage({
          type: 'SET_QUESTION_WINDOW_IMAGE',
          payload: { url }
        });
      },
      
      setCustomMessageImage: (url) => {
        set({ 
          customMessageImageUrl: url,
          lastUpdateTimestamp: Date.now()
        });
        
        syncToLocalStorage({
          type: 'SET_CUSTOM_MESSAGE_IMAGE',
          payload: { url }
        });
      },
      
      setBackgroundOpacity: (opacity) => {
        set({ 
          backgroundOpacity: opacity,
          lastUpdateTimestamp: Date.now()
        });
        
        syncToLocalStorage({
          type: 'SET_BACKGROUND_OPACITY',
          payload: { opacity }
        });
      },
      
      setBackgroundSize: (size) => {
        set({ 
          backgroundSize: size,
          lastUpdateTimestamp: Date.now()
        });
        
        syncToLocalStorage({
          type: 'SET_BACKGROUND_SIZE',
          payload: { size }
        });
      },
      
      setBackgroundPositionX: (position) => {
        set({ 
          backgroundPositionX: position,
          lastUpdateTimestamp: Date.now()
        });
        
        syncToLocalStorage({
          type: 'SET_BACKGROUND_POSITION_X',
          payload: { position }
        });
      },
      
      setBackgroundPositionY: (position) => {
        set({ 
          backgroundPositionY: position,
          lastUpdateTimestamp: Date.now()
        });
        
        syncToLocalStorage({
          type: 'SET_BACKGROUND_POSITION_Y',
          payload: { position }
        });
      },
      
      setQuestionWindowOpacity: (opacity) => {
        set({ 
          questionWindowOpacity: opacity,
          lastUpdateTimestamp: Date.now()
        });
        
        syncToLocalStorage({
          type: 'SET_QUESTION_WINDOW_OPACITY',
          payload: { opacity }
        });
      },
      
      setQuestionWindowSize: (size) => {
        set({ 
          questionWindowSize: size,
          lastUpdateTimestamp: Date.now()
        });
        
        syncToLocalStorage({
          type: 'SET_QUESTION_WINDOW_SIZE',
          payload: { size }
        });
      },
      
      setQuestionWindowPositionX: (position) => {
        set({ 
          questionWindowPositionX: position,
          lastUpdateTimestamp: Date.now()
        });
        
        syncToLocalStorage({
          type: 'SET_QUESTION_WINDOW_POSITION_X',
          payload: { position }
        });
      },
      
      setQuestionWindowPositionY: (position) => {
        set({ 
          questionWindowPositionY: position,
          lastUpdateTimestamp: Date.now()
        });
        
        syncToLocalStorage({
          type: 'SET_QUESTION_WINDOW_POSITION_Y',
          payload: { position }
        });
      },
      
      setCustomMessageOpacity: (opacity) => {
        set({ 
          customMessageOpacity: opacity,
          lastUpdateTimestamp: Date.now()
        });
        
        syncToLocalStorage({
          type: 'SET_CUSTOM_MESSAGE_OPACITY',
          payload: { opacity }
        });
      },
      
      setCustomMessageSize: (size) => {
        set({ 
          customMessageSize: size,
          lastUpdateTimestamp: Date.now()
        });
        
        syncToLocalStorage({
          type: 'SET_CUSTOM_MESSAGE_SIZE',
          payload: { size }
        });
      },
      
      setCustomMessagePositionX: (position) => {
        set({ 
          customMessagePositionX: position,
          lastUpdateTimestamp: Date.now()
        });
        
        syncToLocalStorage({
          type: 'SET_CUSTOM_MESSAGE_POSITION_X',
          payload: { position }
        });
      },
      
      setCustomMessagePositionY: (position) => {
        set({ 
          customMessagePositionY: position,
          lastUpdateTimestamp: Date.now()
        });
        
        syncToLocalStorage({
          type: 'SET_CUSTOM_MESSAGE_POSITION_Y',
          payload: { position }
        });
      },
      
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
        
        set({
          selectedQuestionId: null,
          selectedAnswerIndex: null,
          revealAnswer: false,
          activeView: 'grid',
          isTimerRunning: false,
          lastUpdateTimestamp: Date.now()
        });
        
        if (revealAnswer) {
          get().nextTeam();
        }
        
        syncToLocalStorage({
          type: 'CLOSE_QUESTION',
          payload: {}
        });
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
        useGameStore.setState({ 
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
        const { remainingTime, isTimerRunning, revealAnswer } = useGameStore.getState();
        
        if (isTimerRunning && remainingTime > 0 && !revealAnswer) {
          useGameStore.setState({ 
            remainingTime: remainingTime - 1,
            lastUpdateTimestamp: Date.now()
          });
          
          if (remainingTime === 1) {
            setTimeout(() => {
              const store = useGameStore.getState();
              if (store.isTimerRunning && !store.revealAnswer) {
                store.showAnswer();
              }
            }, 100);
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
        }, get().notificationDisplayTime);
        
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
        if (!useGameStore.getState().completedQuestions.includes(id)) {
          const updatedCompleted = [...useGameStore.getState().completedQuestions, id];
          useGameStore.setState({
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
        notificationDisplayTime: state.notificationDisplayTime,
        backgroundImageUrl: state.backgroundImageUrl,
        questionWindowImageUrl: state.questionWindowImageUrl,
        customMessageImageUrl: state.customMessageImageUrl,
        backgroundOpacity: state.backgroundOpacity,
        backgroundSize: state.backgroundSize,
        backgroundPositionX: state.backgroundPositionX,
        backgroundPositionY: state.backgroundPositionY,
        questionWindowOpacity: state.questionWindowOpacity,
        questionWindowSize: state.questionWindowSize,
        questionWindowPositionX: state.questionWindowPositionX,
        questionWindowPositionY: state.questionWindowPositionY,
        customMessageOpacity: state.customMessageOpacity,
        customMessageSize: state.customMessageSize,
        customMessagePositionX: state.customMessagePositionX,
        customMessagePositionY: state.customMessagePositionY,
      }),
    }
  )
);

const syncToLocalStorage = (action: any) => {
  const timestamp = Date.now();
  localStorage.setItem(SYNC_KEY, JSON.stringify({
    action,
    timestamp
  }));
};

export const initializeLocalStorageSync = (role: 'admin' | 'host' | 'player') => {
  let lastProcessedTimestamp = 0;
  
  const checkForUpdates = () => {
    try {
      const syncData = localStorage.getItem(SYNC_KEY);
      if (!syncData) return;
      
      const { action, timestamp } = JSON.parse(syncData);
      
      if (timestamp <= lastProcessedTimestamp) return;
      if (timestamp <= useGameStore.getState().lastUpdateTimestamp) return;
      
      lastProcessedTimestamp = timestamp;
      
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
              useGameStore.setState({ completedQuestions: action.payload.completedQuestions });
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
            useGameStore.setState({ completedQuestions: [] });
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
            
          case 'SET_BACKGROUND_IMAGE':
            if (action.payload.url !== undefined) {
              useGameStore.setState({ backgroundImageUrl: action.payload.url });
            }
            break;
            
          case 'SET_QUESTION_WINDOW_IMAGE':
            if (action.payload.url !== undefined) {
              useGameStore.setState({ questionWindowImageUrl: action.payload.url });
            }
            break;
            
          case 'SET_CUSTOM_MESSAGE_IMAGE':
            if (action.payload.url !== undefined) {
              useGameStore.setState({ customMessageImageUrl: action.payload.url });
            }
            break;
            
          case 'SET_BACKGROUND_OPACITY':
            if (action.payload.opacity !== undefined) {
              useGameStore.setState({ backgroundOpacity: action.payload.opacity });
            }
            break;
            
          case 'SET_BACKGROUND_SIZE':
            if (action.payload.size !== undefined) {
              useGameStore.setState({ backgroundSize: action.payload.size });
            }
            break;
            
          case 'SET_BACKGROUND_POSITION_X':
            if (action.payload.position !== undefined) {
              useGameStore.setState({ backgroundPositionX: action.payload.position });
            }
            break;
            
          case 'SET_BACKGROUND_POSITION_Y':
            if (action.payload.position !== undefined) {
              useGameStore.setState({ backgroundPositionY: action.payload.position });
            }
            break;
            
          case 'SET_QUESTION_WINDOW_OPACITY':
            if (action.payload.opacity !== undefined) {
              useGameStore.setState({ questionWindowOpacity: action.payload.opacity });
            }
            break;
            
          case 'SET_QUESTION_WINDOW_SIZE':
            if (action.payload.size !== undefined) {
              useGameStore.setState({ questionWindowSize: action.payload.size });
            }
            break;
            
          case 'SET_QUESTION_WINDOW_POSITION_X':
            if (action.payload.position !== undefined) {
              useGameStore.setState({ questionWindowPositionX: action.payload.position });
            }
            break;
            
          case 'SET_QUESTION_WINDOW_POSITION_Y':
            if (action.payload.position !== undefined) {
              useGameStore.setState({ questionWindowPositionY: action.payload.position });
            }
            break;
            
          case 'SET_CUSTOM_MESSAGE_OPACITY':
            if (action.payload.opacity !== undefined) {
              useGameStore.setState({ customMessageOpacity: action.payload.opacity });
            }
            break;
            
          case 'SET_CUSTOM_MESSAGE_SIZE':
            if (action.payload.size !== undefined) {
              useGameStore.setState({ customMessageSize: action.payload.size });
            }
            break;
            
          case 'SET_CUSTOM_MESSAGE_POSITION_X':
            if (action.payload.position !== undefined) {
              useGameStore.setState({ customMessagePositionX: action.payload.position });
            }
            break;
            
          case 'SET_CUSTOM_MESSAGE_POSITION_Y':
            if (action.payload.position !== undefined) {
              useGameStore.setState({ customMessagePositionY: action.payload.position });
            }
            break;
            
          case 'SET_NOTIFICATION_DISPLAY_TIME':
            if (action.payload.time !== undefined) {
              useGameStore.setState({ notificationDisplayTime: action.payload.time });
            }
            break;
        }
      }
    } catch (error) {
      console.error('Error processing localStorage sync:', error);
    }
  };
  
  const syncInterval = setInterval(checkForUpdates, 500);
  
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
    useGameStore.getState().tickTimer();
  }, 1000) as unknown as number;
};

export const stopTimerInterval = () => {
  if (timerInterval !== null) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
};
