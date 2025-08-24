# Thread of Fate - Retro 2D Browser Game

## Overview

Thread of Fate is a retro-style 2D browser game built with HTML5 Canvas and vanilla JavaScript. The game features a unique thread-following mechanic where players must navigate through levels while keeping a glowing thread connected to their starting position intact. The project combines a lightweight frontend game implementation with a modern React-based web application architecture.

The game presents a pixel art aesthetic with neon glowing effects, procedurally generated retro sound effects using Web Audio API, and progressive difficulty across multiple levels. Players control a small character that trails a glowing thread, and must reach exit portals while avoiding obstacles that would break the thread connection.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Game Engine
The core game is implemented as a class-based JavaScript architecture using HTML5 Canvas for rendering. The main components include:

- **Game Class**: Central game loop manager handling state transitions, input processing, and coordinate system management between game logic and rendering
- **Player Class**: Character movement with smooth acceleration/deceleration physics and visual trail effects
- **Thread System**: Dynamic line rendering with collision detection against level geometry, featuring animated glow effects and procedural point generation
- **Level Manager**: Static level definitions with obstacle placement, enemy patterns, and progressive difficulty scaling
- **Audio Manager**: Web Audio API integration for procedural retro sound generation, including movement sounds, thread effects, and background music

### Rendering Architecture
The rendering system uses immediate mode Canvas 2D API with manual optimization:

- Pixelated rendering style with crisp edges for retro aesthetics
- Layered rendering system (background, game objects, UI, effects)
- Real-time glow effects using canvas shadow properties
- Responsive canvas sizing with mobile touch control overlays

### Input System
Multi-platform input handling supporting both desktop and mobile:

- Keyboard input (WASD/Arrow keys) for desktop gameplay
- Touch controls with virtual D-pad for mobile devices
- Input state management with smooth movement transitions
- Mobile detection and adaptive UI layout

### React Application Shell
The game is embedded within a modern React application providing:

- **State Management**: Zustand stores for game state and audio control
- **UI Components**: Radix UI component library with Tailwind CSS styling
- **Build System**: Vite for development and production builds with TypeScript support
- **Component Architecture**: Modular UI components for game interface and controls

### Audio System Design
The audio implementation uses Web Audio API for dynamic sound generation:

- **Procedural Sound Generation**: Mathematical functions create retro-style sound effects without audio files
- **Gain Node Architecture**: Separate volume controls for music and sound effects
- **Audio Context Management**: Proper initialization handling for browser audio policies
- **Performance Optimization**: Sound pooling and cleanup to prevent memory leaks

### Database Integration
The project includes Drizzle ORM configuration with PostgreSQL support:

- **Schema Definition**: User management and game data structures
- **Migration System**: Database versioning and deployment automation
- **Connection Management**: Environment-based database URL configuration
- **Development vs Production**: Local development with production database deployment

### Development and Deployment
The architecture supports both development and production environments:

- **Development Server**: Express.js with Vite integration for hot reloading
- **Production Build**: Static asset generation with Vercel deployment configuration
- **Asset Management**: Support for game assets including fonts, audio, and graphics
- **Performance Optimization**: Bundle splitting and asset compression

## External Dependencies

### UI and Styling Framework
- **Radix UI**: Comprehensive component library providing accessible form controls, dialogs, and interactive elements
- **Tailwind CSS**: Utility-first CSS framework for responsive design and consistent styling
- **Lucide React**: Icon library for UI elements and game interface

### Development and Build Tools
- **Vite**: Modern build tool providing fast development server and optimized production builds
- **TypeScript**: Type safety and enhanced development experience
- **PostCSS**: CSS processing with Tailwind integration and autoprefixer

### Database and ORM
- **Drizzle ORM**: Type-safe database operations with PostgreSQL support
- **Neon Database**: Serverless PostgreSQL hosting for production deployment
- **Database Migration**: Automated schema management and version control

### Deployment Platform
- **Vercel**: Static site hosting with automatic deployments and CDN distribution
- **Environment Management**: Secure handling of database URLs and API keys

### Game-Specific Libraries
- **Web Audio API**: Browser-native audio processing for sound effects and music
- **Canvas 2D API**: Hardware-accelerated 2D graphics rendering
- **Web Fonts**: Google Fonts integration for retro pixel art typography

### React Ecosystem
- **React Query (TanStack)**: Server state management and data fetching
- **React Hook Form**: Form handling with validation
- **Zustand**: Lightweight state management for game state and audio controls

The architecture prioritizes performance and simplicity, avoiding heavy 3D libraries in favor of optimized 2D Canvas rendering that can run smoothly on low-end devices while maintaining the retro aesthetic.