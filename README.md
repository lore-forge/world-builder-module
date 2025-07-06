# 🗺️ World Builder Module

A powerful world-building and campaign management platform for the RPG Immersive ecosystem. Create immersive worlds, design detailed maps, manage NPCs, and run epic campaigns with AI assistance.

## 🚀 Features

### Core Modules
- **🌍 World Management** - Create and organize multiple worlds with different genres and settings
- **🗺️ Map Editor** - Visual map creation with drawing tools powered by Konva.js
- **📍 Location Management** - Detailed location descriptions and interconnections
- **📚 Campaign Management** - Story arcs, quest chains, and session planning
- **🎭 NPC System** - Create memorable characters with personalities and dialogue trees
- **📖 Lore Repository** - World wiki, timelines, and cultural information
- **🤖 AI Generators** - Terrain generation, NPC creation, and story assistance
- **⚙️ Settings** - User preferences and configuration

### Technical Features
- **🔐 Authentication** - Secure login with Firebase Auth (Email/Password & Google)
- **💾 Real-time Database** - Firebase Firestore for instant synchronization
- **🎨 Modern UI** - Beautiful interface with shadcn/ui components
- **🌐 Internationalization** - Multi-language support (EN/ES ready)
- **📱 Responsive Design** - Works on desktop and mobile devices
- **🎯 State Management** - Zustand for efficient state handling

## 📋 Current Status

### ✅ Completed
- Project structure and architecture
- Complete UI component library (shadcn/ui)
- Module-based navigation system
- Authentication system with login page
- Firebase integration (client & admin)
- Map editor with drawing tools
- Zustand state management
- Dashboard with statistics

### 🚧 In Progress
- AI service integration (Google Cloud)
- API routes for CRUD operations
- Real-time collaboration features
- Asset management system

### 📅 Planned
- Campaign flow visualization
- Voice synthesis for NPCs
- Educational content integration
- Mobile app version

## 🛠️ Installation

### Prerequisites
- Node.js 18+ and npm/pnpm
- Firebase project with Authentication and Firestore enabled
- Google Cloud project (for AI features)

### Setup

1. **Clone the repository**
```bash
git clone https://github.com/Montinou/world-builder-module.git
cd world-builder-module
```

2. **Install dependencies**
```bash
npm install
# or
pnpm install
```

3. **Configure environment variables**

Create a `.env.local` file based on `.env.example`:

```env
# Firebase Client SDK
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id

# Firebase Admin SDK
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-client-email
FIREBASE_PRIVATE_KEY="your-private-key"
FIREBASE_STORAGE_BUCKET=your-storage-bucket

# Google Cloud (for AI features)
GOOGLE_CLOUD_PROJECT=your-project-id
GOOGLE_CLOUD_LOCATION=us-central1
GOOGLE_VERTEX_LOCATION=us-central1
GOOGLE_API_KEY=your-api-key
GOOGLE_APPLICATION_CREDENTIALS=./service-account-key.json
```

4. **Run the development server**
```bash
npm run dev
# or
pnpm dev
```

The application will be available at [http://localhost:3003](http://localhost:3003)

## 🎮 Usage

### First Time Setup
1. Navigate to the login page
2. Create an account with email/password or sign in with Google
3. You'll be redirected to the dashboard

### Creating Your First World
1. From the dashboard, click "Create New World"
2. Fill in the world details (name, genre, description)
3. Choose privacy settings (public/private)
4. Start building!

### Using the Map Editor
1. Navigate to the Map Editor module
2. Use the toolbar to select drawing tools:
   - **Pen** - Freehand drawing
   - **Rectangle/Circle** - Shape tools
   - **Text** - Add labels
   - **Pan** - Navigate the canvas
3. Adjust brush size and color as needed
4. Save your map when finished

## 🏗️ Architecture

```
world-builder-module/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard page
│   ├── login/            # Authentication
│   └── layout.tsx        # Root layout
├── components/            # React components
│   ├── modules/          # Feature modules
│   ├── map-editor/       # Map editor components
│   ├── ui/               # shadcn/ui components
│   └── auth/             # Authentication components
├── lib/                   # Utilities and services
│   ├── firebase/         # Firebase configuration
│   ├── store.ts          # Zustand store
│   └── utils.ts          # Helper functions
├── hooks/                # Custom React hooks
└── public/               # Static assets
```

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is part of the RPG Immersive Platform ecosystem. All rights reserved.

## 🔗 Related Projects

- [RPG Immersive Platform](https://github.com/Montinou/rpg-immersive) - Main platform
- [Documentation](https://github.com/Montinou/rpg-immersive/docs) - Full documentation

## 📞 Support

- **Issues**: Use GitHub Issues for bug reports
- **Discussions**: Join our Discord community
- **Email**: support@rpg-immersive.com

---

**Built with ❤️ by the RPG Immersive Team**
