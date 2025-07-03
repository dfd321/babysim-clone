import { useState } from 'react';

interface GameState {
  phase: 'setup' | 'character-gen' | 'gameplay' | 'ended';
  role: 'Random' | 'Mom' | 'Dad' | 'Non-binary' | null;
  gameStyle: 'Realistic' | 'Fantasy' | 'Thrilling' | null;
  specialRequirements: string;
  parentCharacter: {
    name: string;
    age: number;
    profession: string;
    background: string;
  } | null;
  childCharacter: {
    name: string;
    age: number;
    gender: string;
    personality: string;
  } | null;
  currentAge: number;
  timeline: Array<{
    age: number;
    scenario: string;
    choice: string;
    consequence: string;
  }>;
  finances: number;
  happiness: number;
}

