# BabySim Quick Reference

## 🚀 Quick Start
`ash
npm install
npm run dev
# Open http://localhost:3000
`

## 📁 Key Files
- src/App.tsx - Main app entry point
- src/components/BabySimulator.tsx - Game orchestrator
- src/components/OnboardingPhase.tsx - Setup form
- src/components/GameplayPhase.tsx - Main game interface
- src/components/Timeline.tsx - Journey tracking
- src/types/game.ts - TypeScript interfaces

## 🛠️ Recent Fixes
1. **Timeline Green Circle** - Fixed positioning with proper padding
2. **Form Re-renders** - Local state pattern in RequirementsInput.tsx

## 🎯 Current Status
- ✅ Setup form working
- ✅ UI components built
- ✅ Basic game structure
- 🚧 Decision mechanics
- 🚧 Timeline integration
- ❌ Full gameplay loop

## 🔧 Common Commands
`ash
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Run ESLint
npm test            # Run tests
git add . && git commit -m 
