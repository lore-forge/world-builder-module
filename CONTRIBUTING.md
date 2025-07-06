# Contributing to World Builder Module

Thank you for your interest in contributing to the World Builder module! This document provides guidelines and instructions for contributing.

## Getting Started

1. **Fork the Repository**
   ```bash
   # Fork on GitHub, then:
   git clone https://github.com/YOUR_USERNAME/world-builder-module.git
   cd world-builder-module
   git remote add upstream https://github.com/Montinou/world-builder-module.git
   ```

2. **Install Dependencies**
   ```bash
   pnpm install
   ```

3. **Set Up Environment**
   ```bash
   cp .env.example .env.local
   # Add your development credentials
   ```

4. **Create a Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Guidelines

### Code Style

- Use TypeScript for all new code
- Follow the existing code style (Prettier configuration)
- Use meaningful variable and function names
- Add JSDoc comments for complex functions
- Keep components small and focused

### Component Structure

```typescript
// Example component structure
import { useState } from 'react'
import { cn } from '@/lib/utils'
import type { ComponentProps } from '@/types'

interface MyComponentProps {
  // Props interface
}

export function MyComponent({ prop1, prop2 }: MyComponentProps) {
  // Component logic
  
  return (
    <div className={cn('base-classes', 'conditional-classes')}>
      {/* Component JSX */}
    </div>
  )
}
```

### State Management

- Use Zustand for global state
- Use React hooks for local state
- Keep state as close to where it's used as possible

### API Development

- Follow RESTful conventions
- Always validate input data
- Return consistent error responses
- Add proper TypeScript types

### Testing

- Write tests for new features
- Ensure existing tests pass
- Test edge cases
- Add integration tests for critical paths

## Commit Guidelines

Follow conventional commits format:

```
type(scope): description

[optional body]

[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Test additions or changes
- `chore`: Build process or auxiliary tool changes

Examples:
```bash
feat(map-editor): add terrain brush tool
fix(auth): resolve session persistence issue
docs(api): update world creation endpoint
```

## Pull Request Process

1. **Update Your Branch**
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Run Tests**
   ```bash
   pnpm test
   pnpm lint
   pnpm type-check
   ```

3. **Create Pull Request**
   - Use a clear, descriptive title
   - Reference any related issues
   - Describe what changes you made and why
   - Include screenshots for UI changes
   - List any breaking changes

4. **PR Template**
   ```markdown
   ## Description
   Brief description of changes
   
   ## Type of Change
   - [ ] Bug fix
   - [ ] New feature
   - [ ] Breaking change
   - [ ] Documentation update
   
   ## Testing
   - [ ] Tests pass locally
   - [ ] Added new tests
   
   ## Screenshots (if applicable)
   
   ## Related Issues
   Fixes #123
   ```

## Project Structure

```
src/
├── app/              # Next.js app router pages
├── components/       # React components
│   ├── ui/          # Base UI components
│   └── world-builder/ # Feature-specific components
├── lib/             # Utilities and services
│   ├── services/    # API services
│   ├── firebase/    # Firebase configuration
│   └── ai/          # AI service integrations
├── hooks/           # Custom React hooks
├── store/           # Zustand stores
├── types/           # TypeScript type definitions
└── utils/           # Utility functions
```

## Current Priorities

Check [DEVELOPMENT_STATUS.md](./DEVELOPMENT_STATUS.md) for current priorities and next steps.

### High Priority Components Needed:

1. **UI Components** (src/components/ui/)
   - Basic shadcn/ui components
   - Theme configuration
   - Responsive layouts

2. **Map Editor** (src/components/world-builder/map-editor/)
   - Canvas rendering with Konva.js
   - Layer management
   - Drawing tools
   - Location markers

3. **AI Services** (src/lib/ai/)
   - Vertex AI integration
   - Prompt templates
   - Response parsing
   - Error handling

## Questions and Support

- **Discord**: [Join our Discord](#) (coming soon)
- **Issues**: Use GitHub Issues for bugs and features
- **Discussions**: Use GitHub Discussions for questions

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

Thank you for contributing! 🌍✨
