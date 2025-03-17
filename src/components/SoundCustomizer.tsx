
import React, { useState, useRef } from 'react';
import { useGameStore } from '@/store/gameStore';
import { Play, Pause, Upload, X, Volume2, Save } from 'lucide-react';
import { playSound } from '@/utils/sound';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';

const SoundCustomizer: React.FC = () => {
  const { sounds, addCustomSound, removeSound } = useGameStore();
  const [playingSound, setPlayingSound] = useState<string | null>(null);
  const [audioVolume, setAudioVolume] = useState<number>(0.5);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [newSoundName, setNewSoundName] = useState('');

  const handlePlaySound = (soundId: string) => {
    if (playingSound === soundId) {
      setPlayingSound(null);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    } else {
      setPlayingSound(soundId);
      const sound = sounds.find(s => s.id === soundId);
      if (sound) {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
        }
        
        audioRef.current = new Audio(sound.url);
        audioRef.current.volume = audioVolume;
        audioRef.current.play();
        audioRef.current.onended = () => setPlayingSound(null);
      }
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('audio/')) {
      alert('Please upload an audio file');
      return;
    }

    if (!newSoundName.trim()) {
      alert('Please enter a sound name');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result;
      if (typeof result === 'string') {
        addCustomSound(newSoundName, result);
        setNewSoundName('');
      }
    };
    reader.readAsDataURL(file);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Sound Customization</h2>
      
      <div className="mb-6">
        <h3 className="text-md font-medium mb-2">Volume Control</h3>
        <div className="flex items-center gap-2">
          <Volume2 size={20} className="text-gray-600" />
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={audioVolume}
            onChange={(e) => setAudioVolume(parseFloat(e.target.value))}
            className="w-full"
          />
          <span className="text-sm font-medium">{Math.round(audioVolume * 100)}%</span>
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="text-md font-medium mb-2">Add New Sound</h3>
        <div className="flex items-center gap-2">
          <Input 
            type="text" 
            placeholder="Sound name"
            value={newSoundName}
            onChange={(e) => setNewSoundName(e.target.value)}
            className="flex-grow"
          />
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="audio/*"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-1"
          >
            <Upload size={18} />
            Upload
          </button>
        </div>
      </div>
      
      <div className="space-y-3">
        <h3 className="text-md font-medium mb-2">Sound List</h3>
        {sounds.map((sound) => (
          <motion.div
            key={sound.id}
            className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center gap-3">
              <button
                onClick={() => handlePlaySound(sound.id)}
                className={`p-2 rounded-full ${
                  playingSound === sound.id
                    ? 'bg-red-100 text-red-600'
                    : 'bg-blue-100 text-blue-600'
                }`}
              >
                {playingSound === sound.id ? <Pause size={16} /> : <Play size={16} />}
              </button>
              <span className="font-medium">{sound.name}</span>
            </div>
            
            {sound.isCustom && (
              <button
                onClick={() => removeSound(sound.id)}
                className="text-red-600 hover:text-red-800"
              >
                <X size={18} />
              </button>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SoundCustomizer;
