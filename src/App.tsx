
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { useGameStore, initializeLocalStorageSync, startTimerInterval, stopTimerInterval } from '@/store/gameStore';
import Notification from '@/components/Notification';
import BackgroundManager from './BackgroundManager';
import Index from '@/pages/Index';
import Admin from '@/pages/Admin';
import Host from '@/pages/Host';
import Player from '@/pages/Player';
import NotFound from '@/pages/NotFound';
import './App.css';

function App() {
  useEffect(() => {
    // Initialize local storage sync for admin
    initializeLocalStorageSync('admin');
    
    // Start timer interval
    startTimerInterval();
    
    // Clean up
    return () => {
      stopTimerInterval();
    };
  }, []);
  
  const { quizColors } = useGameStore();
  
  useEffect(() => {
    // Set CSS variables for custom colors
    Object.entries(quizColors).forEach(([key, value]) => {
      document.documentElement.style.setProperty(`--quiz-${key}`, value);
    });
  }, [quizColors]);
  
  return (
    <BrowserRouter>
      <BackgroundManager />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/host" element={<Host />} />
        <Route path="/player" element={<Player />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Notification />
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
