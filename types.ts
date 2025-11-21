
export enum AppView {
  DASHBOARD = 'DASHBOARD',
  TRY_ON = 'TRY_ON',
  CHAT = 'CHAT',
  PROFILE = 'PROFILE'
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface WeatherData {
  temp: number;
  condition: string;
  location: string;
}

export interface BodyMeasurements {
  height: string;
  weight: string;
  chest: string;
  waist: string;
  hips: string;
}

export type Occasion = 'Casual' | 'Wedding' | 'Birthday' | 'Formal' | 'Party' | 'Festival' | 'Date Night' | 'Gym' | 'Sports' | 'Beach';
export type SkinTone = 'Fair' | 'Wheatish' | 'Medium' | 'Dusky' | 'Dark';

export interface OrnamentRecommendation {
  name: string;
  type: string;
  reason: string;
  searchQuery: string;
}

export interface StylingResult {
  fitAnalysis: string;
  colorAnalysis: string;
  colorSuggestions: string[];
  ornaments: OrnamentRecommendation[];
}

export interface TryOnState {
  faceImage: string | null;
  garmentImage: string | null;
  measurements: BodyMeasurements;
  skinTone: SkinTone;
  occasion: Occasion;
  generatedImage: string | null;
  isGenerating: boolean;
  step: 'input' | 'avatar' | 'result';
  result: StylingResult | null;
}

export interface UserProfile {
  name: string;
  age: string;
  birthday: string;
  profilePicture: string | null;
  skinTone: SkinTone;
  stylePreferences: string[];
  favoriteColors: string[];
  defaultMeasurements: BodyMeasurements;
}

export interface OutfitTemplate {
  id: string;
  name: string;
  category: string;
  image: string;
}

export interface ScriptFile {
  id: string;
  name: string;
  language: string;
  content: string;
}