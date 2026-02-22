import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import type { TrailerSegment } from './scriptDefault';
import { assetMap } from './assets';
import { drawCinematicText, drawTitleCard } from './typography';

interface TrailerRendererCanvasProps {
  segments: TrailerSegment[];
  currentTime: number;
  isPlaying: boolean;
}

export const TrailerRendererCanvas = forwardRef<HTMLCanvasElement, TrailerRendererCanvasProps>(
  ({ segments, currentTime, isPlaying }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const imagesRef = useRef<Map<string, HTMLImageElement>>(new Map());
    const loadedRef = useRef(false);

    useImperativeHandle(ref, () => canvasRef.current!);

    // Preload all images
    useEffect(() => {
      const loadImages = async () => {
        const imagePromises: Promise<void>[] = [];

        Object.entries(assetMap).forEach(([key, path]) => {
          const promise = new Promise<void>((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
              imagesRef.current.set(key, img);
              resolve();
            };
            img.onerror = () => {
              console.error(`Failed to load image: ${path}`);
              reject();
            };
            img.src = path;
          });
          imagePromises.push(promise);
        });

        try {
          await Promise.all(imagePromises);
          loadedRef.current = true;
        } catch (error) {
          console.error('Error loading images:', error);
        }
      };

      loadImages();
    }, []);

    // Render current frame
    useEffect(() => {
      if (!canvasRef.current || !loadedRef.current) return;

      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Find current segment
      let accumulatedTime = 0;
      let currentSegment: TrailerSegment | null = null;
      let segmentLocalTime = 0;

      for (const segment of segments) {
        if (currentTime >= accumulatedTime && currentTime < accumulatedTime + segment.duration) {
          currentSegment = segment;
          segmentLocalTime = currentTime - accumulatedTime;
          break;
        }
        accumulatedTime += segment.duration;
      }

      // Clear canvas
      ctx.fillStyle = 'oklch(0.1 0 0)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (!currentSegment) return;

      // Draw scene image
      if (currentSegment.imageAsset) {
        const img = imagesRef.current.get(currentSegment.imageAsset);
        if (img) {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        }
      }

      // Apply overlays
      if (currentSegment.overlays) {
        currentSegment.overlays.forEach((overlayKey) => {
          const overlay = imagesRef.current.get(overlayKey);
          if (overlay) {
            // Animate overlays slightly
            const offset = Math.sin(currentTime * 0.5) * 10;
            ctx.globalAlpha = 0.6 + Math.sin(currentTime * 0.3) * 0.2;
            ctx.drawImage(overlay, offset, 0, canvas.width, canvas.height);
            ctx.globalAlpha = 1.0;
          }
        });
      }

      // Add vignette effect
      const gradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        canvas.height * 0.3,
        canvas.width / 2,
        canvas.height / 2,
        canvas.height * 0.8
      );
      gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0.7)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw title card or caption
      if (currentSegment.sceneType === 'titleCard' && currentSegment.titleCard) {
        drawTitleCard(ctx, canvas, currentSegment.titleCard, segmentLocalTime);
      } else if (currentSegment.caption) {
        drawCinematicText(ctx, canvas, currentSegment.caption, segmentLocalTime, currentSegment.sceneType);
      }
    }, [currentTime, segments]);

    return (
      <canvas
        ref={canvasRef}
        width={1920}
        height={1080}
        className="w-full h-full object-contain"
      />
    );
  }
);

TrailerRendererCanvas.displayName = 'TrailerRendererCanvas';
