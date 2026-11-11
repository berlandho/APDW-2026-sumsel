export interface Judge {
  id: number;
  name: string;
  role: string;
  agency: string;
  badge: string;
}

export interface VideoEntry {
  id: number;
  location: string;
  region: string;
  title: string;
  link: string;
  keyHighlights?: string[];
}

export interface AspectScores {
  cerita?: number | '';
  budaya?: number | '';
  potensi?: number | '';
  visual?: number | '';
  audio?: number | '';
  editing?: number | '';
  promosi?: number | '';
}

export type RecommendationType = 
  | 'calon_juara'
  | 'nominasi'
  | 'potensial'
  | 'perlu_pembinaan'
  | '';

export interface VideoEvaluation {
  scores: AspectScores;
  totalScore: number;
  notes: string;
  recommendation: RecommendationType;
  updatedAt?: string;
}

export type JudgeScoresMap = Record<number, VideoEvaluation>;

export interface ScoringWeights {
  cerita: number;
  budaya: number;
  potensi: number;
  visual: number;
  audio: number;
  editing: number;
  promosi: number;
}
