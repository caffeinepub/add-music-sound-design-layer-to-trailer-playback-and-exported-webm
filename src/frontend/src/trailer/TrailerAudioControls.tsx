import { Volume2, VolumeX } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { audioTracks } from './audioTracks';

interface TrailerAudioControlsProps {
  enabled: boolean;
  volume: number;
  selectedTrackId: string;
  onEnabledChange: (enabled: boolean) => void;
  onVolumeChange: (volume: number) => void;
  onTrackChange: (trackId: string) => void;
  disabled?: boolean;
}

export function TrailerAudioControls({
  enabled,
  volume,
  selectedTrackId,
  onEnabledChange,
  onVolumeChange,
  onTrackChange,
  disabled = false,
}: TrailerAudioControlsProps) {
  return (
    <div className="space-y-4 pt-4 border-t border-border">
      <div className="flex items-center justify-between">
        <Label htmlFor="audio-enabled" className="text-sm font-medium">
          Background Audio
        </Label>
        <Switch
          id="audio-enabled"
          checked={enabled}
          onCheckedChange={onEnabledChange}
          disabled={disabled}
        />
      </div>

      {enabled && (
        <>
          <div className="space-y-2">
            <Label htmlFor="audio-track" className="text-sm">
              Track
            </Label>
            <Select
              value={selectedTrackId}
              onValueChange={onTrackChange}
              disabled={disabled}
            >
              <SelectTrigger id="audio-track">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {audioTracks.map((track) => (
                  <SelectItem key={track.id} value={track.id}>
                    {track.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="audio-volume" className="text-sm">
                Volume
              </Label>
              <span className="text-xs text-muted-foreground">
                {Math.round(volume * 100)}%
              </span>
            </div>
            <div className="flex items-center gap-3">
              {volume === 0 ? (
                <VolumeX className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              ) : (
                <Volume2 className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              )}
              <Slider
                id="audio-volume"
                value={[volume]}
                onValueChange={([v]) => onVolumeChange(v)}
                min={0}
                max={1}
                step={0.01}
                disabled={disabled}
                className="flex-1"
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
