import { useState, useEffect, useCallback, useRef } from 'react';
import type { TrailerSegment } from './scriptDefault';

export function useTrailerPlayback(segments: TrailerSegment[]) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const animationFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(Date.now());

  const totalDuration = segments.reduce((sum, seg) => sum + seg.duration, 0);

  const play = useCallback(() => {
    setIsPlaying(true);
    lastTimeRef.current = Date.now();
  }, []);

  const pause = useCallback(() => {
    setIsPlaying(false);
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  }, []);

  const seek = useCallback((time: number) => {
    setCurrentTime(Math.max(0, Math.min(time, totalDuration)));
  }, [totalDuration]);

  const reset = useCallback(() => {
    setCurrentTime(0);
    setIsPlaying(false);
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  }, []);

  useEffect(() => {
    if (!isPlaying) return;

    const animate = () => {
      const now = Date.now();
      const delta = (now - lastTimeRef.current) / 1000;
      lastTimeRef.current = now;

      setCurrentTime((prev) => {
        const next = prev + delta;
        if (next >= totalDuration) {
          setIsPlaying(false);
          return totalDuration;
        }
        return next;
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, totalDuration]);

  return {
    isPlaying,
    currentTime,
    totalDuration,
    play,
    pause,
    seek,
    reset,
  };
}
