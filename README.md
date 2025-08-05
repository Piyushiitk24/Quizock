# 🎯 Quizock - NDA Mathematics Preparation Tool

[![Build Status](https://github.com/Piyushiitk24/Quizock/actions/workflows/deploy.yml/badge.svg)](https://github.com/Piyushiitk24/Quizock/actions/workflows/deploy.yml)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9+-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18+-61DAFB.svg)](https://reactjs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub Pages](https://img.shields.io/badge/Deployed-GitHub%20Pages-green.svg)](https://piyushiitk24.github.io/Quizock/)

A comprehensive, modern web application designed specifically for NDA (National Defence Academy) mathematics preparation. Built with React, TypeScript, and Tailwind CSS for an optimal learning experience.

## 🚀 Deployment

### Automatic Deployment (GitHub Pages)
The project is configured for automatic deployment to GitHub Pages:

1. **Enable GitHub Pages**:
   - Go to your repository settings
   - Navigate to Pages section
   - Source: Deploy from a branch
   - Branch: `gh-pages`
   - Click Save

2. **Automatic Process**:
   - Every push to `main` branch triggers the CI/CD pipeline
   - Builds the project with `npm run build`
   - Deploys to `gh-pages` branch automatically
   - Your app will be available at: `https://[username].github.io/Quizock/`

### Manual Deployment
```bash
# Build for production
npm run build

# Deploy using the provided script (recommended)
./deploy.sh

# Or manually deploy to GitHub Pages
npm run deploy
```

### Easy Deployment Script
The project includes a convenient `deploy.sh` script that:
1. Builds the project
2. Copies built files to root directory  
3. Commits and pushes changes to GitHub
4. Automatically deploys to GitHub Pages

```bash
# Make script executable (one time only)
chmod +x deploy.sh

# Deploy with one command
./deploy.sh
```

## 🧪 Development

### Core Functionality
- **Simplified User Authentication**: No email/signup required - just enter your name and start learning
- **Formula Flashcards Module**: Timed high-speed formula memorization for instant recall training
- **Mock Test Module**: Full-scale examination simulation with 120+ MCQ questions
- **Performance Dashboard**: Detailed tracking of quiz attempts, scores, and progress over time
- **Persistent Local Storage**: All user data and progress saved locally in the browser

### UI/UX Highlights
- **Modern Glass-morphism Design**: Beautiful gradient backgrounds with glass-effect cards
- **Smooth Animations**: Framer Motion powered transitions and interactions
- **Responsive Layout**: Works perfectly on desktop, tablet, and mobile devices
- **Dark Theme**: Optimized for extended study sessions
- **Gamified Experience**: Achievements, confetti celebrations, and progress visualization

### Technical Features
- **Type-Safe Development**: Built with TypeScript for robust, maintainable code
- **Component Architecture**: Modular React components for easy maintenance
- **State Management**: Zustand for clean, efficient global state
- **Data Visualization**: Interactive charts showing performance trends
- **LaTeX Support**: Mathematical formulas rendered beautifully with react-latex-next

## 🚀 Live Demo

Access the live application: **[Quizock Live Demo](https://piyushiitk24.github.io/Quizock/)**

> **✅ GitHub Pages Fixed**: The application now properly renders with full styling and functionality on GitHub Pages. Recent fixes include:
> - HashRouter for GitHub Pages compatibility
> - CSS compilation fixes for Tailwind CSS
> - Proper asset routing and deployment configuration

> **Note**: To enable GitHub Pages deployment, go to your repository settings → Pages → Source: Deploy from a branch → Branch: `main` → Folder: `/ (root)` → Save

## 🚀 Quick Start
### Prerequisites
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd quizock
   ```

2. **Install dependencies**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── layout/          # Header, Footer components
│   ├── quiz/            # Quiz-specific components (Timer, QuestionCard, etc.)
│   └── ui/              # Basic UI elements (Button, Card, Loader)
├── data/                # JSON files with quiz content
│   ├── trigFormulas.json    # Trigonometry formulas for flashcards
│   └── mockTest1.json       # MCQ questions for mock tests
├── hooks/               # Custom React hooks
│   └── useQuizTimer.ts  # Timer logic for quizzes
├── pages/               # Main application pages
│   ├── Login.tsx        # User authentication
│   ├── Dashboard.tsx    # Main hub
│   ├── FormulaQuiz.tsx  # Formula flashcards
│   ├── MockTest.tsx     # Mock examination
│   ├── Results.tsx      # Quiz results display
│   └── Performance.tsx  # Progress tracking
├── store/               # State management
│   └── useUserStore.ts  # User data and quiz records
├── types/               # TypeScript type definitions
│   └── index.ts         # Core data types
└── App.tsx              # Main application component
```

## 🎯 Usage Guide

### For Students

1. **Getting Started**
   - Enter your name on the login screen
   - Choose between Formula Flashcards or Mock Test

2. **Formula Flashcards**
   - Each formula appears for 10 seconds
   - Try to complete the formula mentally before the answer shows
   - Self-report your score at the end
   - Perfect for building instant recall

3. **Mock Tests**
   - Choose Practice Mode (untimed) or Exam Mode (2.5 hours)
   - Navigate freely between questions
   - Use the question navigator for quick access
   - Get detailed results with explanations

4. **Performance Tracking**
   - View your progress over time
   - Analyze weak areas
   - Track improvement trends

### For Teachers

#### Adding New Content

**Formula Questions** (`src/data/trigFormulas.json`):
```json
{
  "id": 11,
  "prompt": "\sin(3A) = ?",
  "answer": "3\sin A - 4\sin^3 A"
}
```

**MCQ Questions** (`src/data/mockTest1.json`):
```json
{
  "id": 121,
  "question": "What is the value of cos(60°)?",
  "options": ["0", "1/2", "√3/2", "1"],
  "correctAnswer": "1/2"
}
```

## 🛠️ Technology Stack

- **Frontend**: React 18+ with TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Routing**: React Router DOM v6
- **State Management**: Zustand
- **Charts**: Recharts
- **Math Rendering**: react-latex-next
- **Build Tool**: Vite

## 📊 Performance Tracking

The application automatically tracks:
- Quiz completion dates and times
- Scores and percentages
- Time taken for timed tests
- Historical progress trends
- Performance analytics

All data is stored locally using browser localStorage, ensuring privacy and immediate access.

---

**Built with ❤️ for aspiring  students**

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
