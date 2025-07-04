# World Builder Module

🗺️ **World Builder & Campaign Creator** - A powerful module for creating immersive worlds, campaigns, and educational experiences with AI assistance.

## Overview

The World Builder module is part of the RPG Immersive Platform ecosystem, designed to empower Game Masters and Educators to create rich, interactive worlds for both gaming and educational purposes.

## Features

### 🌍 Core Capabilities
- **Interactive World Map Creator** - Visual map editing with AI terrain generation
- **Location & Environment Builder** - Detailed location creation with 3D previews
- **Campaign Management System** - Story arc designer with educational objectives
- **Advanced NPC Creator** - AI-powered NPCs with dialogue trees
- **Lore & Knowledge Repository** - World wikis, timelines, and cultures
- **Encounter Designer** - Combat, puzzles, and educational challenges
- **Asset Library** - AI image generation and sound management
- **Collaboration Tools** - Multi-GM support and community sharing

### 🎯 Educational Features
- Curriculum alignment tools
- Embedded assessments
- Progress tracking
- Pre-built educational templates
- Adaptive difficulty

## Installation

```bash
# Clone the repository
git clone https://github.com/Montinou/world-builder-module.git
cd world-builder-module

# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env.local

# Run development server
pnpm dev
```

## Project Structure

```
world-builder-module/
├── src/
│   ├── components/     # React components
│   ├── lib/           # Core libraries and services
│   ├── pages/         # Next.js pages
│   ├── hooks/         # Custom React hooks
│   ├── store/         # State management
│   ├── types/         # TypeScript types
│   └── utils/         # Utility functions
├── public/            # Static assets
├── tests/             # Test files
└── docs/              # Documentation
```

## Development

### Prerequisites
- Node.js 18+
- pnpm 8+
- Firebase project
- Google Cloud project with Vertex AI enabled

### Environment Variables

See `.env.example` for required environment variables.

### Available Scripts

```bash
pnpm dev        # Start development server
pnpm build      # Build for production
pnpm test       # Run tests
pnpm lint       # Run linting
pnpm type-check # TypeScript type checking
```

## Architecture

The World Builder module is designed as a standalone application that can:
- Run independently
- Be integrated into the main RPG Immersive Platform
- Share authentication and user data
- Exchange data with RPG and TCG modules

## Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Links

- [Main Platform](https://github.com/Montinou/rpg-immersive)
- [Documentation](./docs/README.md)
- [API Reference](./docs/API.md)
