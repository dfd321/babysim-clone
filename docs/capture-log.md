# BabySim.fun Complete User Experience Capture

## Overview
This document captures the complete user experience flow of https://www.babysim.fun for replication purposes.

## Initial Page Load
- **URL**: https://www.babysim.fun/
- **Title**: The Baby Simulator 养娃模拟器
- **Key Elements**:
  - Header with title and language toggle (🇺🇸 "Switch to 中文")
  - Game introduction section
  - Character role selection (Random, Mom, Dad, Non-binary Parent)
  - Game style selection (Realistic, Fantasy, Thrilling)
  - Special requirements text input
  - Main CTA button "I'm ready to meet my baby!"

## Network Requests on Load
```
[GET] https://www.babysim.fun/ => [200]
[GET] https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap => [200]
[GET] https://www.babysim.fun/assets/index-D51oaLHl.js => [200]
[GET] https://www.babysim.fun/assets/index-C_hMJyjD.css => [200]
[GET] https://js.stripe.com/basil/stripe.js => [200]
[POST] https://www.babysim.fun/_vercel/insights/view => [200]
```

## User Interaction Flow

### Step 1: Role Selection
- **Action**: Click "Mom" button
- **Result**: Button becomes selected state, shows "Mom" text
- **UI State**: Mom option highlighted

### Step 2: Style Selection  
- **Action**: Click "Realistic" button
- **Result**: Button becomes selected state, shows "Realistic" text
- **UI State**: Realistic option highlighted

### Step 3: Special Requirements
- **Action**: Type in text field: "I want a creative and curious child who loves learning"
- **Result**: Text appears in input field
- **Placeholder Text**: "I want an ugly cute kid"

### Step 4: Game Initialization
- **Action**: Click "I'm ready to meet my baby!" button
- **API Calls**:
  ```
  [POST] https://www.babysim.fun/api/session-init => [200]
  [POST] https://www.babysim.fun/api/chat => [200]
  ```
- **Result**: Game transitions to character generation screen

### Step 5: Character Generation Results
- **Generated Characters**:
  - **Mother**: Maya (28), freelance graphic designer, finance level 5
  - **Baby**: Luna (girl, just born), bright and curious
- **Setting**: Modest apartment, quiet neighborhood
- **Context**: Partner Alex travels for work, family lives far away
- **UI Elements**: 
  - "Give up Luna and restart" button
  - Timeline display showing "1 years old - Infant"
  - "Continue" button appears

### Step 6: Game Progression
- **Action**: Click "Continue" button
- **API Call**: `[POST] https://www.babysim.fun/api/chat => [200]`
- **Result**: Timeline updates to show first decision at age 2

### Step 7: First Decision (Age 2)
- **Scenario**: Language development class decision
- **Context**: Luna babbling, tantrums, expensive class recommendation
- **Options**:
  - A: Enroll in expensive class despite budget strain
  - B: Try free alternatives (library, YouTube)
  - C: Ask Alex to cut trip short
  - D: Delay decision until less overwhelmed
  - E: Custom input (0/200 characters)
- **Financial Status**: Visible via "Check current financial status" button (shows "Middle")

### Step 8: Decision Selection
- **Action**: Click Option A (Enroll in class)
- **API Call**: `[POST] https://www.babysim.fun/api/chat => [200]`
- **Result**: Consequence text displays outcome
- **Outcome**: Luna thrives, budget strained, early sentence formation

### Step 9: Next Decision (Age 3-4)
- **Scenario**: Arts kindergarten vs relocation decision
- **Context**: Luna's creativity explodes, wants piano lessons, prestigious school opportunity
- **Timeline**: Now shows both age 1-2 entry and current 3-4 decision
- **Options**:
  - A: Arts kindergarten despite cost
  - B: Relocate for better opportunities  
  - C: Stay put, invest in weekend classes
  - D: Focus on stability, encourage at home
  - E: Custom input option

### Step 10: Second Decision
- **Action**: Click Option C (Stay put, weekend classes)
- **API Call**: `[POST] https://www.babysim.fun/api/chat => [200]`
- **Result**: Shows consequence and "Generating..." button for next scenario

## Additional Features Discovered

### Information Center
- **Access**: Click "Open Information Center" button
- **URL**: https://www.babysim.fun/info
- **Content**:
  - Email subscription form
  - Privacy policy, terms of service, disclaimer (collapsible)
  - Developer message from "pearyj"
  - Close button to return to game

### Financial Status
- **Feature**: Hover tooltip on "Check current financial status"
- **Display**: Shows current financial level (e.g., "Middle")

### Game Management
- **Restart**: "Give up Luna and restart" button available throughout
- **Timeline**: Visual progression showing completed decisions
- **Language**: Toggle between English and Chinese

## Technical Architecture

### Key API Endpoints
- `/api/session-init` - Initialize game session
- `/api/chat` - Process game decisions and generate responses  
- `/api/log-event` - Track user actions
- `/_vercel/insights/` - Analytics tracking

### Frontend Technology
- **Framework**: React (based on Vite build)
- **Styling**: Custom CSS with Inter font family
- **Payment**: Stripe integration (basil/stripe.js)
- **Analytics**: Vercel insights
- **Deployment**: Vercel platform

### Game State Management
- Timeline-based progression
- Persistent character data (Maya, Luna)
- Financial status tracking
- Decision consequence system
- AI-generated content for scenarios

## UI Component Structure
```
App
├── Header (Title + Language Toggle)
├── Main Game Area
│   ├── Setup Phase
│   │   ├── Role Selection Buttons
│   │   ├── Style Selection Buttons  
│   │   ├── Special Requirements Input
│   │   └── Start Button
│   └── Gameplay Phase
│       ├── Timeline Component
│       ├── Current Scenario Text
│       ├── Decision Options (A-E)
│       ├── Financial Status Button
│       └── Restart Button
├── Information Center Modal
└── Footer Links
```

This capture provides a complete foundation for replicating the BabySim.fun experience with React + Tailwind components and API mocking.