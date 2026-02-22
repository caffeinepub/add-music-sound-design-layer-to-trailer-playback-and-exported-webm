import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Play, Pause, Download, RotateCcw } from 'lucide-react';
import { TrailerRendererCanvas } from '../trailer/TrailerRendererCanvas';
import { useTrailerPlayback } from '../trailer/useTrailerPlayback';
import { useTrailerExportRecorder } from '../trailer/useTrailerExportRecorder';
import { SceneTimelinePanel } from '../trailer/SceneTimelinePanel';
import { TrailerAudioControls } from '../trailer/TrailerAudioControls';
import { defaultScript } from '../trailer/scriptDefault';
import { useTimelinePersistence } from '../trailer/useTimelinePersistence';
import { useTrailerAudio } from '../trailer/useTrailerAudio';

export function TrailerBuilderPlayerPage() {
  const [segments, setSegments] = useState(defaultScript);
  const { savedSegments, saveSegments } = useTimelinePersistence();

  // Load saved segments on mount
  useEffect(() => {
    if (savedSegments && savedSegments.length > 0) {
      setSegments(savedSegments);
    }
  }, [savedSegments]);

  // Auto-save segments when they change
  useEffect(() => {
    saveSegments(segments);
  }, [segments, saveSegments]);

  const {
    isPlaying,
    currentTime,
    totalDuration,
    play,
    pause,
    seek,
    reset,
  } = useTrailerPlayback(segments);

  const {
    audioRef,
    isAudioReady,
    enabled: audioEnabled,
    volume: audioVolume,
    selectedTrackId,
    setEnabled: setAudioEnabled,
    setVolume: setAudioVolume,
    setSelectedTrack,
    syncToTime,
    playAudio,
    pauseAudio,
    resetAudio,
    isLoaded: audioSettingsLoaded,
  } = useTrailerAudio();

  const {
    isRecording,
    recordingProgress,
    startRecording,
    canvasRef,
  } = useTrailerExportRecorder(segments, totalDuration, {
    audioElement: audioRef.current,
    audioEnabled,
  });

  // Sync audio with playback
  useEffect(() => {
    if (isPlaying && audioEnabled && isAudioReady) {
      playAudio(currentTime);
    } else {
      pauseAudio();
    }
  }, [isPlaying, audioEnabled, isAudioReady, playAudio, pauseAudio, currentTime]);

  // Handle recording playback
  useEffect(() => {
    const handleRecordingPlayback = (event: Event) => {
      const customEvent = event as CustomEvent<{ duration: number }>;
      reset();
      
      // Start audio from beginning if enabled
      if (audioEnabled && audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(console.warn);
      }
      
      // Start video playback
      setTimeout(() => {
        play();
      }, 100);
    };

    window.addEventListener('startRecordingPlayback', handleRecordingPlayback);
    return () => {
      window.removeEventListener('startRecordingPlayback', handleRecordingPlayback);
    };
  }, [reset, play, audioEnabled, audioRef]);

  const handlePlayPause = () => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };

  const handleReset = () => {
    reset();
    resetAudio();
  };

  const handleSeek = (time: number) => {
    seek(time);
    syncToTime(time);
  };

  const handleExport = () => {
    handleReset();
    setTimeout(() => {
      startRecording();
    }, 100);
  };

  const handleDurationChange = (index: number, newDuration: number) => {
    const updated = [...segments];
    updated[index] = { ...updated[index], duration: newDuration };
    setSegments(updated);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold tracking-tight">The Curse of Parsi Falia</h1>
          <p className="text-sm text-muted-foreground mt-1">Cinematic Horror Trailer Builder</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-6 flex flex-col lg:flex-row gap-6">
        {/* Left Panel - Timeline Editor */}
        <aside className="lg:w-80 flex-shrink-0">
          <SceneTimelinePanel
            segments={segments}
            currentTime={currentTime}
            totalDuration={totalDuration}
            onSeek={handleSeek}
            onDurationChange={handleDurationChange}
          />
        </aside>

        {/* Right Panel - Player */}
        <div className="flex-1 flex flex-col gap-4">
          {/* Canvas Container */}
          <Card className="relative aspect-video bg-black overflow-hidden">
            <TrailerRendererCanvas
              ref={canvasRef}
              segments={segments}
              currentTime={currentTime}
              isPlaying={isPlaying}
            />
          </Card>

          {/* Controls */}
          <Card className="p-4">
            <div className="flex items-center gap-4">
              <Button
                onClick={handlePlayPause}
                disabled={isRecording}
                size="lg"
                className="gap-2"
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-5 h-5" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5" />
                    Play
                  </>
                )}
              </Button>

              <Button
                onClick={handleReset}
                disabled={isRecording}
                variant="outline"
                size="lg"
                className="gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </Button>

              <div className="flex-1" />

              <Button
                onClick={handleExport}
                disabled={isRecording || isPlaying}
                variant="secondary"
                size="lg"
                className="gap-2"
              >
                <Download className="w-4 h-4" />
                {isRecording ? `Recording ${recordingProgress}%` : 'Export Video'}
              </Button>
            </div>

            {/* Progress Bar */}
            <div className="mt-4">
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(totalDuration)}</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-100"
                  style={{ width: `${(currentTime / totalDuration) * 100}%` }}
                />
              </div>
            </div>

            {/* Audio Controls */}
            {audioSettingsLoaded && (
              <TrailerAudioControls
                enabled={audioEnabled}
                volume={audioVolume}
                selectedTrackId={selectedTrackId}
                onEnabledChange={setAudioEnabled}
                onVolumeChange={setAudioVolume}
                onTrackChange={setSelectedTrack}
                disabled={isRecording}
              />
            )}
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card mt-auto">
        <div className="container mx-auto px-4 py-4 text-center text-sm text-muted-foreground">
          © 2026. Built with love using{' '}
          <a
            href="https://caffeine.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground hover:underline"
          >
            caffeine.ai
          </a>
        </div>
      </footer>
    </div>
  );
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
