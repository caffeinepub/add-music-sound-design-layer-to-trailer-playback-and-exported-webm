import { useState, useRef, useCallback } from 'react';
import type { TrailerSegment } from './scriptDefault';
import { toast } from 'sonner';

interface ExportRecorderOptions {
  audioElement?: HTMLAudioElement | null;
  audioEnabled?: boolean;
}

export function useTrailerExportRecorder(
  segments: TrailerSegment[],
  totalDuration: number,
  options?: ExportRecorderOptions
) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingProgress, setRecordingProgress] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = useCallback(async () => {
    if (!canvasRef.current) {
      toast.error('Canvas not ready');
      return;
    }

    try {
      const canvas = canvasRef.current;
      const videoStream = canvas.captureStream(30); // 30 FPS

      let finalStream = videoStream;

      // Mix audio if enabled and available
      if (options?.audioEnabled && options?.audioElement) {
        try {
          const audioContext = new AudioContext();
          const audioSource = audioContext.createMediaElementSource(options.audioElement);
          const destination = audioContext.createMediaStreamDestination();
          
          audioSource.connect(destination);
          audioSource.connect(audioContext.destination); // Also play through speakers
          
          // Combine video and audio streams
          const audioTrack = destination.stream.getAudioTracks()[0];
          if (audioTrack) {
            finalStream = new MediaStream([
              ...videoStream.getVideoTracks(),
              audioTrack,
            ]);
          }
        } catch (audioError) {
          console.warn('Failed to add audio to recording, continuing with video only:', audioError);
        }
      }

      const mediaRecorder = new MediaRecorder(finalStream, {
        mimeType: 'video/webm;codecs=vp9',
        videoBitsPerSecond: 5000000, // 5 Mbps
      });

      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'the-curse-of-parsi-falia-trailer.webm';
        a.click();
        URL.revokeObjectURL(url);
        setIsRecording(false);
        setRecordingProgress(0);
        toast.success('Video exported successfully!');
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start(100); // Collect data every 100ms
      setIsRecording(true);

      // Simulate playback for recording
      const startTime = Date.now();
      const animate = () => {
        const elapsed = (Date.now() - startTime) / 1000;
        const progress = Math.min((elapsed / totalDuration) * 100, 100);
        setRecordingProgress(Math.floor(progress));

        if (elapsed >= totalDuration) {
          mediaRecorder.stop();
        } else {
          requestAnimationFrame(animate);
        }
      };

      // Trigger a custom event to start playback
      const event = new CustomEvent('startRecordingPlayback', {
        detail: { duration: totalDuration },
      });
      window.dispatchEvent(event);

      animate();
    } catch (error) {
      console.error('Recording error:', error);
      toast.error('Failed to start recording');
      setIsRecording(false);
    }
  }, [totalDuration, options?.audioEnabled, options?.audioElement]);

  return {
    isRecording,
    recordingProgress,
    startRecording,
    canvasRef,
  };
}
