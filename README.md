# BabySim Clone

A complete clone of [BabySim.fun](https://www.babysim.fun) - an AI-powered parenting simulator game where you raise a child from birth to 18 years old, making decisions that shape their development.

## 🎮 Features

- 🍼 **Complete Parenting Journey**: Raise your child from birth to age 18
- 🎭 **Role Selection**: Play as Mom, Dad, Non-binary Parent, or Random
- 🎨 **Multiple Styles**: Choose between Realistic, Fantasy, or Thrilling scenarios
- 🤖 **AI-Generated Content**: Dynamic character backgrounds, scenarios, and storylines
- 📊 **Decision Impact**: Every choice affects your child's personality, interests, and development
- 📈 **Timeline Visualization**: Track your parenting journey with a visual timeline
- 💰 **Financial Management**: Monitor your family's financial status and make budget decisions
- ✏️ **Custom Responses**: Create your own parenting solutions beyond preset options
- 💾 **Save/Load System**: Multiple save slots, auto-save, export/import functionality
- 🎯 **Expanded Scenarios**: 10 age-specific decision points (ages 1-18)

## 🛠 Technology Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Testing**: Playwright
- **Icons**: Lucide React

## 📁 Project Structure

```
babysim-clone/
├── README.md
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.js
├── index.html
├── docs/                    # Original capture documentation
│   ├── capture-log.md
│   ├── api-analysis.json
│   └── original-dom.html
├── tests/                   # Playwright tests
│   ├── playwright.config.ts
│   └── babysim.spec.ts
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── index.css
│   ├── types/
│   │   └── game.ts
│   ├── components/          # React components
│   │   ├── BabySimulator.tsx
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── OnboardingPhase.tsx
│   │   ├── GameplayPhase.tsx
│   │   ├── Timeline.tsx
│   │   ├── DecisionInterface.tsx
│   │   ├── RoleSelector.tsx
│   │   ├── StyleSelector.tsx
│   │   ├── RequirementsInput.tsx
│   │   └── InformationCenter.tsx
│   ├── services/            # API services
│   │   ├── api.ts
│   │   └── mockApi.ts
│   └── utils/
│       └── constants.ts
└── public/
    └── vite.svg
```

## 🚀 Installation

1. Clone the repository:
```bash
git clone https://github.com/dfd321/babysim-clone.git
cd babysim-clone
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## 🧪 Testing

Run Playwright tests:
```bash
npm run test
```

Run tests with UI:
```bash
npm run test:ui
```

## 📚 Documentation

This project includes complete documentation from the original BabySim.fun capture:

- **`docs/capture-log.md`**: Step-by-step interaction log
- **`docs/api-analysis.json`**: Network requests and API patterns
- **`docs/original-dom.html`**: Reconstructed DOM structure
- **`tests/babysim.spec.ts`**: Complete Playwright test suite

## 🎯 Game Flow

1. **Onboarding**: Choose your role (Mom/Dad/Non-binary/Random), game style (Realistic/Fantasy/Thrilling), and special requirements
2. **Character Generation**: AI creates your parent character and baby with unique backgrounds
3. **Gameplay**: Progress through years 1-18, making decisions at key developmental stages
4. **Timeline**: Track all decisions and their consequences in a visual timeline
5. **Outcomes**: See how your parenting choices shaped your child's development

## 🔧 Development Features

- **Mock API**: Complete mock implementation for development without backend
- **TypeScript**: Full type safety with interfaces for all game data
- **Tailwind CSS**: Responsive design matching original styling
- **Component Architecture**: Modular React components for easy maintenance
- **Playwright Testing**: Comprehensive test coverage of user interactions

## 📝 API Integration

The project includes both mock and real API implementations:

- **Mock API** (`src/services/mockApi.ts`): For development and testing
- **Real API** (`src/services/api.ts`): Ready for backend integration
- **WebSocket Support**: For real-time features like typing indicators

## 🎨 Design

The UI closely replicates the original BabySim.fun with:
- Clean, modern interface using Inter font
- Timeline visualization with age indicators
- Decision cards with hover effects
- Modal overlays for additional content
- Responsive design for all devices

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Original game: [BabySim.fun](https://www.babysim.fun) by pearyj
- Captured and cloned for educational purposes
- Built with modern React and TypeScript best practices

---

**Note**: This is a clone/replica created for educational and development purposes. The original BabySim.fun is created by pearyj.
