
// Sound utility functions

const audioCache: Record<string, HTMLAudioElement> = {};

// Sound effects for various game events
const SOUND_EFFECTS = {
  timerTick: '/sounds/timer-tick.mp3',
  timerEnd: '/sounds/timer-end.mp3',
  correctAnswer: '/sounds/correct-answer.mp3',
  wrongAnswer: '/sounds/wrong-answer.mp3',
  cardSelect: '/sounds/card-select.mp3',
  buttonClick: '/sounds/button-click.mp3',
  notification: '/sounds/notification.mp3',
};

// Preload audio files
export const preloadSounds = () => {
  Object.entries(SOUND_EFFECTS).forEach(([key, path]) => {
    try {
      const audio = new Audio();
      audio.src = path;
      audio.preload = 'auto';
      audioCache[key] = audio;
      
      // Test loading by doing a short play and immediate pause
      audio.volume = 0;
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          audio.pause();
          audio.currentTime = 0;
          audio.volume = 1;
        }).catch(err => {
          console.error(`Error preloading sound ${key}:`, err);
        });
      }
    } catch (error) {
      console.error(`Failed to preload sound: ${key}`, error);
    }
  });
};

// Play a sound effect
export const playSound = (sound: keyof typeof SOUND_EFFECTS) => {
  try {
    // Use cached audio if available
    if (audioCache[sound]) {
      // Reset the audio to start from beginning if it's already playing
      audioCache[sound].currentTime = 0;
      audioCache[sound].play().catch(err => {
        console.error(`Error playing sound ${sound}:`, err);
      });
      return;
    }

    // Create new audio if not cached
    const audio = new Audio(SOUND_EFFECTS[sound]);
    audio.play().catch(err => {
      console.error(`Error playing sound ${sound}:`, err);
    });
  } catch (error) {
    console.error(`Failed to play sound: ${sound}`, error);
  }
};

// Stop a specific sound effect
export const stopSound = (sound: keyof typeof SOUND_EFFECTS) => {
  try {
    if (audioCache[sound]) {
      audioCache[sound].pause();
      audioCache[sound].currentTime = 0;
    }
  } catch (error) {
    console.error(`Failed to stop sound: ${sound}`, error);
  }
};

// Stop all sounds
export const stopAllSounds = () => {
  Object.keys(audioCache).forEach(key => {
    try {
      audioCache[key].pause();
      audioCache[key].currentTime = 0;
    } catch (error) {
      console.error(`Failed to stop sound: ${key}`, error);
    }
  });
};

// Toggle mute all sounds
export const toggleMuteAll = (mute: boolean) => {
  Object.keys(audioCache).forEach(key => {
    try {
      audioCache[key].muted = mute;
    } catch (error) {
      console.error(`Failed to toggle mute for sound: ${key}`, error);
    }
  });
};

export default {
  preloadSounds,
  playSound,
  stopSound,
  stopAllSounds,
  toggleMuteAll
};
