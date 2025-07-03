import React, { useState, useEffect } from 'react';
import { GameplayPhaseProps, GameStyle } from '../types/game';
import { Timeline } from './Timeline';

// Simplified scenarios for initial implementation
const getScenario = (age: number, gameStyle: GameStyle): { title: string; description: string; options: { label: string; consequence: string }[] } => {
  const scenarios: Record<number, Record<string, { title: string; description: string; options: { label: string; consequence: string }[] }>> = {
