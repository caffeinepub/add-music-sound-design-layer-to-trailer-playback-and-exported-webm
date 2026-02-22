export interface TrailerSegment {
  id: string;
  label: string;
  duration: number;
  sceneType: 'scene' | 'titleCard' | 'quickCut' | 'montage';
  imageAsset?: string;
  overlays?: string[];
  caption?: string;
  titleCard?: {
    title?: string;
    subtitle?: string;
    lines?: string[];
  };
}

export const defaultScript: TrailerSegment[] = [
  {
    id: 'opening',
    label: 'Opening Shot',
    duration: 5,
    sceneType: 'scene',
    imageAsset: 'scene-forest-dusk',
    overlays: ['overlay-fog'],
    caption: 'A slow drone pass over rural Kawant at dusk...',
  },
  {
    id: 'bungalow-exterior',
    label: 'Cut - Bungalow',
    duration: 4,
    sceneType: 'scene',
    imageAsset: 'scene-bungalow-exterior',
    overlays: ['overlay-fog', 'overlay-embers'],
    caption: 'An old colonial-era bungalow stands alone...',
  },
  {
    id: 'voiceover-1',
    label: 'Voice-over',
    duration: 3,
    sceneType: 'scene',
    imageAsset: 'scene-bungalow-exterior',
    overlays: ['overlay-fog'],
    caption: '"Some stories never stay buried. Some spirits never rest."',
  },
  {
    id: 'corridor',
    label: 'Inside the Bungalow',
    duration: 4,
    sceneType: 'scene',
    imageAsset: 'scene-bungalow-corridor',
    caption: 'A dim corridor. A lantern flickers...',
  },
  {
    id: 'quick-cuts-1',
    label: 'Quick Cuts',
    duration: 6,
    sceneType: 'quickCut',
    imageAsset: 'scene-tribal-village',
    caption: 'Tribal village homes glowing under dying torches...',
  },
  {
    id: 'quick-cuts-2',
    label: 'Quick Cuts - Forest',
    duration: 3,
    sceneType: 'quickCut',
    imageAsset: 'scene-forest-path',
    overlays: ['overlay-fog'],
    caption: 'A narrow forest path swallowed by fog...',
  },
  {
    id: 'whisper',
    label: 'Whisper',
    duration: 3,
    sceneType: 'scene',
    imageAsset: 'scene-spirit-fragment',
    caption: '"You returned... too late."',
  },
  {
    id: 'climax-montage',
    label: 'Climax Montage',
    duration: 5,
    sceneType: 'montage',
    imageAsset: 'scene-spirit-fragment',
    overlays: ['overlay-embers', 'overlay-fog'],
    caption: 'Doors slam. Embers burst. The spirit appears...',
  },
  {
    id: 'voiceover-2',
    label: 'Final Voice-over',
    duration: 4,
    sceneType: 'scene',
    imageAsset: 'scene-bungalow-exterior',
    overlays: ['overlay-fog'],
    caption: '"In Parsi Falia, the past is not forgotten... it hunts."',
  },
  {
    id: 'title-card',
    label: 'Title Card',
    duration: 5,
    sceneType: 'titleCard',
    imageAsset: 'titlecard-background',
    titleCard: {
      title: 'THE CURSE OF PARSI FALIA',
      lines: ['Directed by Mit Rathod', 'Coming Soon – August 2026'],
    },
  },
];
