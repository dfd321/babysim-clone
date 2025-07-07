# BabySim Architecture - Multi-Agent Coordination

## System Overview

### Current Architecture (Single-Agent)
```
┌─────────────────────────────────────────┐
│           React Frontend                 │
│  ┌─────────────────────────────────┐   │
│  │     BabySimulator Core          │   │
│  ├─────────────────────────────────┤   │
│  │  - Onboarding Phase             │   │
│  │  - Gameplay Phase               │   │
│  │  - Character Development        │   │
│  │  - Family Management            │   │
│  │  - Achievement System           │   │
│  └─────────────────────────────────┘   │
│                  │                       │
│  ┌───────────────┴────────────────┐    │
│  │        Service Layer           │    │
│  ├────────────────────────────────┤    │
│  │ - SaveGameService              │    │
│  │ - CharacterDevelopmentService  │    │
│  │ - FamilyManagementService      │    │
│  │ - AchievementService           │    │
│  │ - TranslationService           │    │
│  │ - AnalyticsService             │    │
│  └────────────────────────────────┘    │
└─────────────────────────────────────────┘
                    │
        ┌──────────┴──────────┐
        │   Local Storage      │
        │  (Browser-based)     │
        └─────────────────────┘
```

### Target Architecture (Multi-Agent)
```
┌─────────────────────────────────────────┐
│         Manager Agent (Coordinator)      │
│  ┌─────────────────────────────────┐   │
│  │  - Task Distribution            │   │
│  │  - Agent Supervision            │   │
│  │  - Merge Coordination           │   │
│  │  - Risk Assessment              │   │
│  └─────────────────────────────────┘   │
└────────────────┬───────────────────────┘
                 │
    ┌────────────┼────────────┬──────────────┐
    │            │            │              │
┌───▼───┐   ┌───▼───┐   ┌───▼───┐     ┌───▼───┐
│Frontend│   │Backend │   │ AI/ML  │     │  UX   │
│ Agent  │   │ Agent  │   │ Agent  │     │Agent  │
├────────┤   ├────────┤   ├────────┤     ├───────┤
│React   │   │API     │   │Scenario│     │Style  │
│Optimiz.│   │Integr. │   │Gen     │     │Guide  │
│UI/UX   │   │Database│   │Content │     │A/B    │
└────────┘   └────────┘   └────────┘     └───────┘
    │            │            │              │
    └────────────┼────────────┴──────────────┘
                 │
        ┌────────▼─────────┐
        │  Shared Memory   │
        │  - CLAUDE.md     │
        │  - patterns.md   │
        │  - decisions.md  │
        └──────────────────┘
```

## Component Boundaries

### Frontend Agent Domain
- React component optimization
- UI/UX improvements
- Client-side performance
- Accessibility enhancements
- Animation and transitions

### Backend Agent Domain
- API service development
- Database design (future)
- Authentication system
- WebSocket implementation
- Server infrastructure

### AI/ML Agent Domain
- Scenario generation algorithms
- Character personality modeling
- Decision consequence prediction
- Natural language processing
- Content moderation

### UX Style-Guide Agent Domain
- Design system maintenance
- Component styling patterns
- Responsive design rules
- Accessibility standards
- Brand consistency

## Communication Protocols

### Inter-Agent Communication
1. **File-based**: Through coordination/*.md files
2. **Git-based**: Through branch merges
3. **Memory-based**: Through memory/*.md files

### Merge Strategy
```
feature/* branches → staging → main
                ↑              ↑
           Agent work    Manager review
```

### Conflict Resolution
1. Manager agent has final authority
2. Automated tests must pass
3. Style guide compliance required
4. Performance benchmarks maintained

## Technology Stack Boundaries

### Approved Technologies
- **Frontend**: React 18, TypeScript, Vite, Tailwind
- **Testing**: Playwright, Vitest
- **State**: Local storage, Context API
- **Future Backend**: Node.js, PostgreSQL
- **AI Services**: OpenAI API, Claude API

### Technology Constraints
- No jQuery or legacy libraries
- No global state management (yet)
- Browser compatibility: Chrome 90+, Firefox 88+, Safari 14+
- Mobile-first responsive design

## Performance Requirements

### Current Metrics
- Initial load: <3s
- Time to interactive: <2s
- Bundle size: <500KB
- Memory usage: <100MB

### Scaling Targets
- Support 100+ children per family
- 10,000+ timeline entries
- Real-time multiplayer (4 players)
- Offline-first capability

## Security Boundaries

### Data Protection
- No PII in local storage
- Sanitize all user inputs
- Content moderation for custom responses
- COPPA compliance for child data

### API Security (Future)
- Rate limiting per user
- API key rotation
- HTTPS only
- Input validation

## Agent Autonomy Levels

### Full Autonomy
- Code formatting
- Test writing
- Documentation updates
- Bug fixes (with tests)

### Manager Approval Required
- New dependencies
- API changes
- Database schema changes
- Security-related changes

### Human Approval Required
- Pricing changes
- Privacy policy updates
- Terms of service changes
- Major UX changes