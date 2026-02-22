import { useState, useEffect, useCallback } from 'react';
import type { TrailerSegment } from './scriptDefault';

const STORAGE_KEY = 'trailer-timeline-segments';

export function useTimelinePersistence() {
  const [savedSegments, setSavedSegments] = useState<TrailerSegment[] | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setSavedSegments(parsed);
      }
    } catch (error) {
      console.error('Failed to load saved timeline:', error);
    }
  }, []);

  // Save to localStorage
  const saveSegments = useCallback((segments: TrailerSegment[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(segments));
    } catch (error) {
      console.error('Failed to save timeline:', error);
    }
  }, []);

  return {
    savedSegments,
    saveSegments,
  };
}
