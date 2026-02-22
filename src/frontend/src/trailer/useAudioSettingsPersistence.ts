import { useState, useEffect, useCallback } from 'react';

const AUDIO_SETTINGS_KEY = 'trailer-audio-settings';

export interface AudioSettings {
  enabled: boolean;
  volume: number;
  selectedTrackId: string;
}

const defaultSettings: AudioSettings = {
  enabled: false,
  volume: 0.7,
  selectedTrackId: 'trailer-bed-01',
};

export function useAudioSettingsPersistence() {
  const [settings, setSettings] = useState<AudioSettings>(defaultSettings);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(AUDIO_SETTINGS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setSettings({ ...defaultSettings, ...parsed });
      }
    } catch (error) {
      console.error('Failed to load audio settings:', error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save to localStorage
  const saveSettings = useCallback((newSettings: Partial<AudioSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      try {
        localStorage.setItem(AUDIO_SETTINGS_KEY, JSON.stringify(updated));
      } catch (error) {
        console.error('Failed to save audio settings:', error);
      }
      return updated;
    });
  }, []);

  return {
    settings,
    saveSettings,
    isLoaded,
  };
}
