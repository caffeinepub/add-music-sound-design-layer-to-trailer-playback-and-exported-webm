import { useRef, useEffect, useCallback, useState } from 'react';
import { audioTracks, defaultAudioTrack } from './audioTracks';
import { useAudioSettingsPersistence } from './useAudioSettingsPersistence';

export function useTrailerAudio() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isAudioReady, setIsAudioReady] = useState(false);
  const { settings, saveSettings, isLoaded } = useAudioSettingsPersistence();

  // Initialize audio element
  useEffect(() => {
    if (!audioRef.current) {
      const audio = new Audio();
      audio.loop = false;
      audio.preload = 'auto';
      audioRef.current = audio;

      audio.addEventListener('canplaythrough', () => {
        setIsAudioReady(true);
      });

      audio.addEventListener('error', (e) => {
        console.error('Audio loading error:', e);
      });
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, []);

  // Update audio source when track changes
  useEffect(() => {
    if (!audioRef.current || !isLoaded) return;

    const track = audioTracks.find((t) => t.id === settings.selectedTrackId) || defaultAudioTrack;
    
    if (audioRef.current.src !== track.path) {
      const currentTime = audioRef.current.currentTime;
      audioRef.current.src = track.path;
      audioRef.current.load();
      
      // Restore time position after track loads
      audioRef.current.addEventListener('canplaythrough', () => {
        if (audioRef.current) {
          audioRef.current.currentTime = currentTime;
        }
      }, { once: true });
    }
  }, [settings.selectedTrackId, isLoaded]);

  // Update volume when it changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = settings.enabled ? settings.volume : 0;
    }
  }, [settings.volume, settings.enabled]);

  const syncToTime = useCallback((time: number) => {
    if (audioRef.current && isAudioReady) {
      audioRef.current.currentTime = time;
    }
  }, [isAudioReady]);

  const playAudio = useCallback(async (fromTime: number) => {
    if (!audioRef.current || !settings.enabled || !isAudioReady) return;

    try {
      audioRef.current.currentTime = fromTime;
      await audioRef.current.play();
    } catch (error) {
      // Handle autoplay restrictions gracefully
      if (error instanceof Error && error.name !== 'AbortError') {
        console.warn('Audio play failed:', error);
      }
    }
  }, [settings.enabled, isAudioReady]);

  const pauseAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
  }, []);

  const resetAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, []);

  const setEnabled = useCallback((enabled: boolean) => {
    saveSettings({ enabled });
  }, [saveSettings]);

  const setVolume = useCallback((volume: number) => {
    saveSettings({ volume });
  }, [saveSettings]);

  const setSelectedTrack = useCallback((trackId: string) => {
    saveSettings({ selectedTrackId: trackId });
  }, [saveSettings]);

  return {
    audioRef,
    isAudioReady,
    enabled: settings.enabled,
    volume: settings.volume,
    selectedTrackId: settings.selectedTrackId,
    setEnabled,
    setVolume,
    setSelectedTrack,
    syncToTime,
    playAudio,
    pauseAudio,
    resetAudio,
    isLoaded,
  };
}
