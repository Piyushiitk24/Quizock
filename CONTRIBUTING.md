# Contributing to Quizock 🎯

Thank you for your interest in contributing to Quizock! This guide will help you get started.

## 🚀 Getting Started

### Prerequisites
- Node.js 20.19.0 or higher
- npm or yarn
- Git

### Setup
1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/Quizock.git
   cd Quizock
   ```
3. Install dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## 📝 How to Contribute

### Adding New Questions

#### Formula Questions
Edit `src/data/trigFormulas.json`:
```json
{
  "id": 11,
  "prompt": "\\sin(3A) = ?",
  "answer": "3\\sin A - 4\\sin^3 A"
}
```

#### MCQ Questions
Edit `src/data/mockTest1.json`:
```json
{
  "id": 121,
  "question": "What is the value of cos(60°)?",
  "options": ["0", "1/2", "√3/2", "1"],
  "correctAnswer": "1/2"
}
```

### Code Contributions

1. **Create a new branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes:**
   - Follow TypeScript best practices
   - Maintain existing code style
   - Add proper type definitions
   - Write meaningful commit messages

3. **Test your changes:**
   ```bash
   npm run build
   npx tsc --noEmit
   ```

4. **Commit and push:**
   ```bash
   git add .
   git commit -m "feat: description of your changes"
   git push origin feature/your-feature-name
   ```

5. **Create a Pull Request**

## 🎨 Code Style

- Use TypeScript for all new code
- Follow existing naming conventions
- Use Tailwind CSS for styling
- Keep components small and focused
- Add comments for complex logic

## 🐛 Bug Reports

When reporting bugs, please include:
- Browser and version
- Steps to reproduce
- Expected vs actual behavior
- Screenshots (if applicable)

## 💡 Feature Requests

For new features:
- Describe the problem you're solving
- Explain your proposed solution
- Consider educational impact
- Think about user experience

## 📚 Educational Content Guidelines

When adding questions:
- Ensure mathematical accuracy
- Use proper LaTeX syntax for formulas
- Make questions appropriate for NDA level
- Provide clear, unambiguous options
- Test with actual students if possible

## 🔍 Review Process

All contributions will be reviewed for:
- Code quality and TypeScript compliance
- Educational value and accuracy
- User experience impact
- Performance implications
- Accessibility considerations

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

## 🤝 Code of Conduct

Please be respectful and constructive in all interactions. We're building an educational tool to help students succeed.

## 📞 Getting Help

- Open an issue for questions
- Check existing issues first
- Be specific and provide context

Thank you for helping make Quizock better! 🎓
