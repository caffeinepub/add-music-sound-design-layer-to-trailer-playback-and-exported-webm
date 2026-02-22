export interface AudioTrack {
  id: string;
  label: string;
  path: string;
}

export const audioTracks: AudioTrack[] = [
  {
    id: 'trailer-bed-01',
    label: 'Cinematic Horror Bed',
    path: '/assets/audio/trailer-bed-01.mp3',
  },
];

export const defaultAudioTrack = audioTracks[0];
