export interface Animal {
  id: string;
  name: string;
  emoji: string;
  baseSpeed: number; // cm/s
  color: string;
  description: string;
  traits: 'steady' | 'erratic' | 'lazy' | 'fast';
}

export type AppScreen = 'START' | 'RACE' | 'MENU' | 'TIME_MATCH' | 'DISTANCE_MATCH' | 'ALL_RECORDS';

export interface RaceResult {
  animalId: string;
  distance: number;
  rank: number;
}