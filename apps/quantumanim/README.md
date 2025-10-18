# 🌌 Quantum Animation System

A visually stunning quantum animation system built with React, TypeScript, and CSS animations. Experience quantum mechanics through interactive animations including superposition, entanglement, and probability-based transitions.

**Live Demo:** [quantumanim.abdalkader.dev](https://quantumanim.abdalkader.dev)

## ✨ Features

### 🎯 Core Quantum Features

- **Superposition Button** - Multiple visual states that collapse on interaction
- **Entangled Components** - Pairs that instantly mirror each other's state
- **Probability-based Transitions** - Weighted random animation outcomes
- **Quantum Context** - State management for entangled components
- **Wave Function Visualizer** - Animated wave functions with collapse simulation

### 🎨 Visual Effects

- **Quantum Glow** - Energy field visualizations
- **Particle Effects** - Floating quantum particles
- **Wave Animations** - Quantum wave propagation
- **Superposition Effects** - Multiple state visualization
- **Entanglement Indicators** - Visual connection between components

## 🚀 Quick Start

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

## 🏗️ Architecture

### Core Components

```
apps/quantumanim/
├── components/
│   ├── QuantumButton.tsx      # Superposition button component
│   └── EntangledPair.tsx      # Entangled component pairs
├── hooks/
│   ├── useSuperposition.ts    # Superposition state management
│   └── useQuantumTransition.ts # Probability-based transitions
├── context/
│   └── QuantumContext.tsx     # Quantum state management
├── utils/
│   └── quantumRandom.ts       # Quantum random utilities
└── styles/
    └── globals.css            # Quantum animations & effects
```

### Quantum Principles

1. **Superposition** - Components exist in multiple states simultaneously
2. **Entanglement** - Instant correlation between distant components
3. **Probability** - Weighted random outcomes for organic animations
4. **Wave Functions** - Mathematical wave propagation for smooth effects

## 🎮 Usage Examples

### Superposition Button

```tsx
import { QuantumButton } from './components/QuantumButton';

<QuantumButton
  onClick={() => console.log('Collapsed!')}
  autoCollapse={true}
  className="quantum-glow"
>
  Click to Collapse
</QuantumButton>
```

### Entangled Components

```tsx
import { EntangledPair } from './components/EntangledPair';

<EntangledPair
  id1="card-1"
  id2="card-2"
  component1={<div>Card 1</div>}
  component2={<div>Card 2</div>}
  onStateChange={(id, value) => console.log(`${id}: ${value}`)}
/>
```

### Quantum Transitions

```tsx
import { useQuantumTransition } from './hooks/useQuantumTransition';

const { currentTransition, triggerTransition } = useQuantumTransition({
  transitions: [
    { from: 'idle', to: 'pulse', probability: 0.4, duration: 1000 },
    { from: 'idle', to: 'float', probability: 0.3, duration: 1500 },
  ],
  autoTrigger: true,
  triggerInterval: 3000,
});
```

## 🎨 Customization

### Quantum Colors

```css
:root {
  --quantum-blue: #00d4ff;
  --quantum-purple: #8b5cf6;
  --quantum-pink: #ec4899;
  --quantum-green: #10b981;
  --quantum-orange: #f59e0b;
}
```

### Animation Classes

- `animate-quantum-pulse` - Pulsing quantum effect
- `animate-quantum-float` - Floating animation
- `animate-quantum-wave` - Wave propagation
- `animate-quantum-collapse` - State collapse animation
- `animate-quantum-superposition` - Superposition effect

### Utility Classes

- `quantum-glow` - Energy field glow
- `quantum-glow-intense` - Intense energy field
- `quantum-text-glow` - Glowing text effect
- `quantum-border` - Quantum gradient border

## 🚀 Deployment

### Vercel Deployment

```bash
# Deploy to Vercel
vercel --prod

# Set environment variables
vercel env add NEXT_PUBLIC_APP_URL production
```

### Environment Variables

```env
NEXT_PUBLIC_APP_URL=https://quantumanim.abdalkader.dev
```

## 🧪 Performance

- **Bundle Size:** ~82KB (First Load JS)
- **Build Time:** ~20 seconds
- **Animation Performance:** 60fps with CSS animations
- **Memory Usage:** Optimized with React hooks and context

## 🔮 Future Enhancements

### Phase 2 Features

- **Wave Function Visualizer** - Canvas-based wave animations
- **Quantum Particle System** - Three.js/WebGL particle effects
- **Quantum Gates** - Interactive quantum circuit simulator
- **Quantum Interference** - Wave interference patterns
- **Quantum Tunneling** - Barrier penetration animations

### Advanced Physics

- **Schrödinger's Cat** - Interactive thought experiment
- **Double Slit Experiment** - Wave-particle duality
- **Quantum Decoherence** - State collapse visualization
- **Quantum Entanglement** - Multi-particle correlations

## 🛠️ Development

### Prerequisites

- Node.js 18+
- pnpm 8+
- TypeScript 5+

### Scripts

```bash
pnpm dev          # Development server
pnpm build        # Production build
pnpm start        # Production server
pnpm lint         # ESLint checking
pnpm type-check   # TypeScript checking
```

## 📚 Quantum Concepts

This project demonstrates quantum mechanics concepts through interactive animations:

- **Superposition** - Quantum states existing in multiple states simultaneously
- **Entanglement** - Quantum correlation between particles regardless of distance
- **Wave-Particle Duality** - Objects exhibiting both wave and particle properties
- **Probability Amplitudes** - Mathematical description of quantum states
- **Quantum Collapse** - Measurement causing state to collapse to definite value

## 🎯 Success Metrics

- ✅ Visually impressive quantum-like animations
- ✅ Smooth 60fps performance
- ✅ Understandable quantum concepts through UI
- ✅ Engaging user interactions
- ✅ Responsive design for all devices

---

**Built with ❤️ using React, TypeScript, and quantum mechanics principles**

*quantumanim.abdalkader.dev • Quantum Animation System*