import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { TrailerSegment } from './scriptDefault';

interface SceneTimelinePanelProps {
  segments: TrailerSegment[];
  currentTime: number;
  totalDuration: number;
  onSeek: (time: number) => void;
  onDurationChange: (index: number, duration: number) => void;
}

export function SceneTimelinePanel({
  segments,
  currentTime,
  totalDuration,
  onSeek,
  onDurationChange,
}: SceneTimelinePanelProps) {
  const handleSliderChange = (value: number[]) => {
    onSeek(value[0]);
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-lg">Scene Timeline</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4 overflow-hidden">
        {/* Scrubber */}
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Playback Position</Label>
          <Slider
            value={[currentTime]}
            min={0}
            max={totalDuration}
            step={0.1}
            onValueChange={handleSliderChange}
            className="w-full"
          />
        </div>

        {/* Segment List */}
        <ScrollArea className="flex-1">
          <div className="space-y-3 pr-4">
            {segments.map((segment, index) => {
              let accumulatedTime = 0;
              for (let i = 0; i < index; i++) {
                accumulatedTime += segments[i].duration;
              }
              const isActive =
                currentTime >= accumulatedTime &&
                currentTime < accumulatedTime + segment.duration;

              return (
                <div
                  key={segment.id}
                  className={`p-3 rounded-lg border transition-colors ${
                    isActive
                      ? 'border-primary bg-primary/10'
                      : 'border-border bg-card'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">{segment.label}</span>
                    <span className="text-xs text-muted-foreground">
                      {segment.sceneType}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Label htmlFor={`duration-${segment.id}`} className="text-xs">
                      Duration (s)
                    </Label>
                    <Input
                      id={`duration-${segment.id}`}
                      type="number"
                      min={0.5}
                      max={30}
                      step={0.5}
                      value={segment.duration}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        if (!isNaN(val) && val > 0) {
                          onDurationChange(index, val);
                        }
                      }}
                      className="h-8 text-xs"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
