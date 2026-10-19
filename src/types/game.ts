export type GameMode = 'turn' | 'relaxed' | 'normal' | 'active';

export type BlockComplexity = 'beginner' | 'standard'; // 'beginner': 2~3 cell mini blocks, 'standard': 7 classic tetrominoes

export type CellValue = {
  filled: boolean;
  color: string;
  symbol: string;
  borderColor: string;
} | null;

export interface Position {
  x: number;
  y: number;
}

export interface Piece {
  shape: number[][];
  color: string;
  borderColor: string;
  symbol: string;
  name: string;
  x: number;
  y: number;
}

export interface GameSettings {
  mode: GameMode;
  complexity: BlockComplexity;
  highContrast: boolean;
  fontSize: 'normal' | 'large' | 'huge';
  soundEnabled: boolean;
  voiceEnabled: boolean;
  showGhost: boolean;
  showGridLines: boolean;
  autoHint: boolean;
  vibration: boolean;
  volume: number; // 0 to 1
}

export interface GameStats {
  score: number;
  linesCleared: number;
  playTimeSeconds: number;
  undosUsed: number;
  hintsUsed: number;
  gamesPlayed: number;
  highestScore: number;
  todayDate: string;
  stampsCount: number;
}

export interface AIHint {
  x: number;
  rotation: number;
  score: number;
}
