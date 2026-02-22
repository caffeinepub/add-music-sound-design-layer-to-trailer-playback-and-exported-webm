interface TitleCardData {
  title?: string;
  subtitle?: string;
  lines?: string[];
}

export function drawTitleCard(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  data: TitleCardData,
  localTime: number
) {
  const fadeInDuration = 0.5;
  const fadeOutStart = 4.0;
  const fadeOutDuration = 1.0;

  let alpha = 1.0;
  if (localTime < fadeInDuration) {
    alpha = localTime / fadeInDuration;
  } else if (localTime > fadeOutStart) {
    alpha = Math.max(0, 1 - (localTime - fadeOutStart) / fadeOutDuration);
  }

  ctx.globalAlpha = alpha;

  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;

  // Draw title
  if (data.title) {
    ctx.font = 'bold 96px serif';
    ctx.fillStyle = 'oklch(0.95 0 0)';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.letterSpacing = '8px';

    // Add text shadow for depth
    ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
    ctx.shadowBlur = 20;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 4;

    ctx.fillText(data.title, centerX, centerY - 80);

    // Reset shadow
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
  }

  // Draw lines
  if (data.lines && data.lines.length > 0) {
    ctx.font = '32px serif';
    ctx.fillStyle = 'oklch(0.85 0 0)';
    ctx.textAlign = 'center';
    ctx.letterSpacing = '2px';

    const lineHeight = 50;
    const startY = centerY + 60;

    data.lines.forEach((line, index) => {
      ctx.fillText(line, centerX, startY + index * lineHeight);
    });
  }

  ctx.globalAlpha = 1.0;
}

export function drawCinematicText(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  caption: string,
  localTime: number,
  sceneType: string
) {
  const fadeInDuration = 0.3;
  const fadeOutStart = 2.5;
  const fadeOutDuration = 0.5;

  let alpha = 1.0;
  if (localTime < fadeInDuration) {
    alpha = localTime / fadeInDuration;
  } else if (localTime > fadeOutStart) {
    alpha = Math.max(0, 1 - (localTime - fadeOutStart) / fadeOutDuration);
  }

  ctx.globalAlpha = alpha;

  // Position based on scene type
  const isQuickCut = sceneType === 'quickCut' || sceneType === 'montage';
  const y = isQuickCut ? canvas.height / 2 : canvas.height - 150;

  // Text styling
  ctx.font = isQuickCut ? 'italic 48px serif' : '36px serif';
  ctx.fillStyle = 'oklch(0.95 0 0)';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Add subtle shadow
  ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
  ctx.shadowBlur = 15;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 2;

  // Word wrap for long captions
  const maxWidth = canvas.width - 200;
  const words = caption.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  words.forEach((word) => {
    const testLine = currentLine + (currentLine ? ' ' : '') + word;
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  });
  if (currentLine) {
    lines.push(currentLine);
  }

  // Draw lines
  const lineHeight = isQuickCut ? 60 : 50;
  const startY = y - ((lines.length - 1) * lineHeight) / 2;

  lines.forEach((line, index) => {
    ctx.fillText(line, canvas.width / 2, startY + index * lineHeight);
  });

  // Reset shadow
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;

  ctx.globalAlpha = 1.0;
}
