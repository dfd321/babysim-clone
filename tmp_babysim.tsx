import React, { useState, useEffect } from 'react';
import { Clock, Heart, DollarSign, BookOpen, Trophy, AlertTriangle, Award, Star } from 'lucide-react';

const BabySimulator = () => {
  const [gameState, setGameState] = useState('menu');
  const [childName, setChildName] = useState('');
  const [parentName, setParentName] = useState('');
  const [gameStyle, setGameStyle] = useState('');
  const [currentAge, setCurrentAge] = useState(2);
  const [happiness, setHappiness] = useState(100);
  const [finances, setFinances] = useState(50000);
  const [timeline, setTimeline] = useState([]);
  const [currentScenario, setCurrentScenario] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [achievements, setAchievements] = useState([]);
  const [characterTraits, setCharacterTraits] = useState([]);
  const [showAchievement, setShowAchievement] = useState(null);

  // Simple scenarios for testing
  const scenarios = {
    2: {
      fantasy: {
        title: 'Magical Outbursts',
        description: 'Your 2-year-old shows magical abilities during tantrums.',
        context: 'Age 2 • Fantasy',
        decisions: [
          {
            text: 'A) Seek magical training',
            consequence: 'Child learns control with expert help.',
            effect: { happiness: 10, finances: -5000 },
            emoji: '😊'
          },
          {
            text: 'B) Suppress the abilities',
            consequence: 'Magic suppressed but child becomes unhappy.',
            effect: { happiness: -20, finances: -1000 },
            emoji: '😟'
          },
          {
            text: 'C) Let them explore freely',
            consequence: 'Uncontrolled magic causes property damage.',
            effect: { happiness: 5, finances: -15000 },
            emoji: '😅'
          },
          {
            text: 'D) Move somewhere isolated',
            consequence: 'Safe but financially difficult.',
            effect: { happiness: 0, finances: -25000 },
            emoji: '😐'
          }
        ]
      },
      thrilling: {
        title: 'Life-Threatening Tantrum',
        description: 'Your child has a meltdown during a dangerous situation.',
        context: 'Age 2 • Thrilling',
        decisions: [
          {
            text: 'A) Stay calm and protect child',
            consequence: 'Your composure helps resolve the crisis.',
            effect: { happiness: 15, finances: 1000 },
            emoji: '😊'
          },
          {
            text: 'B) Run for safety immediately',
            consequence: 'Escape but traumatic experience.',
            effect: { happiness: -15, finances: -8000 },
            emoji: '😰'
          },
          {
            text: 'C) Distract and help others',
            consequence: 'Heroic actions earn recognition.',
            effect: { happiness: 20, finances: 5000 },
            emoji: '😎'
          },
          {
            text: 'D) Hide and wait it out',
            consequence: 'Safe but child witnesses trauma.',
            effect: { happiness: -10, finances: -12000 },
            emoji: '😟'
          }
        ]
      },
      realistic: {
        title: 'Terrible Twos Crisis',
        description: 'Your child is going through intense tantrums and defiance.',
        context: 'Age 2 • Realistic',
        decisions: [
          {
            text: 'A) Get professional parenting help',
            consequence: 'Expert guidance improves behavior.',
            effect: { happiness: 15, finances: -2000 },
            emoji: '😊'
          },
          {
            text: 'B) Use consistent discipline',
            consequence: 'Firm boundaries work over time.',
            effect: { happiness: 5, finances: 0 },
            emoji: '😐'
          },
          {
            text: 'C) Give in to avoid scenes',
            consequence: 'Child learns tantrums work.',
            effect: { happiness: -10, finances: -3000 },
            emoji: '😟'
          },
          {
            text: 'D) Ask family for help',
            consequence: 'Support network makes things easier.',
            effect: { happiness: 10, finances: 2000 },
            emoji: '😊'
          }
        ]
      }
    }
  };

  // Timeline Component
  const Timeline = () => {
    if (timeline.length === 0) return null;

    return (
      <div className=" bg-white rounded-lg p-6 mb-6 shadow-lg\>
