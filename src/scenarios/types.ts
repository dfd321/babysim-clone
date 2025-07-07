import { GameStyle } from '../types/game';

export interface ScenarioOption {
  label: string;
  consequence: string;
}

export interface ScenarioData {
  title: string;
  description: string;
  options: ScenarioOption[];
}

export interface ScenarioGroup {
  [gameStyle: string]: ScenarioData;
}

export interface AgeGroupScenarios {
  [age: number]: ScenarioGroup;
}

export interface ScenarioModule {
  scenarios: AgeGroupScenarios;
  ageRange: {
    min: number;
    max: number;
  };
}

export type ScenarioLoader = () => Promise<ScenarioModule>;