# AI & Interactive Experiments Lab

A Next.js 14+ application showcasing cutting-edge AI experiments, machine learning demos, and interactive TensorFlow.js applications.

## 🧠 Features

- **Real-time Object Detection** - Computer vision with TensorFlow.js
- **AI Code Generation** - Natural language to code generation
- **Neural Network Visualization** - Interactive ML model playground
- **Sentiment Analysis** - Real-time text analysis
- **Style Transfer** - Neural artistic style transfer
- **Text-to-Image Generation** - AI-powered image creation

## 🚀 Tech Stack

- **Framework**: Next.js 14 with App Router
- **AI/ML**: TensorFlow.js, Transformers.js
- **Styling**: Tailwind CSS
- **Animation**: Framer Motion
- **Icons**: Lucide React
- **TypeScript**: Full type safety

## 📁 Project Structure

```
/apps/lab/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── experiments/       # Experiment pages
├── components/
│   └── lab/               # Lab-specific components
├── lib/
│   └── ai/                # AI utilities
│       ├── tensorflow.ts  # TensorFlow.js helpers
│       ├── transformers.ts # Transformers.js utilities
│       ├── computer-vision.ts # CV functions
│       └── utils.ts       # General AI utilities
├── data/
│   └── projects/          # Experiment definitions
├── styles/                # Tailwind CSS
└── public/               # Static assets
```

## 🛠️ Development

### Prerequisites

- Node.js 18+
- Modern browser with WebGL support

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_SITE_URL=https://lab.abdalkader.dev
OPENAI_API_KEY=your_openai_key_here  # Optional
```

## 🧪 Experiments

### Available Experiments

1. **Object Detection** - Real-time computer vision
2. **AI Code Generation** - Natural language programming
3. **Neural Network Visualization** - Interactive ML playground
4. **Sentiment Analysis** - Text emotion detection
5. **Style Transfer** - Neural artistic effects
6. **Text-to-Image** - AI image generation (Coming Soon)

### Adding New Experiments

1. Add experiment definition to `data/projects/experiments.ts`
2. Create experiment page in `app/experiments/[slug]/`
3. Implement experiment logic in `components/lab/`
4. Add AI utilities to `lib/ai/` if needed

## 🤖 AI Integration

### TensorFlow.js
- Pre-trained models for computer vision
- Custom model training and inference
- Real-time performance optimization

### Transformers.js
- Natural language processing
- Text generation and analysis
- Zero-dependency browser AI

### Performance Optimization
- Model caching and lazy loading
- Memory management for large models
- Progressive enhancement

## 📱 Browser Support

- Chrome 88+
- Firefox 85+
- Safari 14+
- Edge 88+

WebGL support required for most experiments.

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Deploy to Vercel
vercel

# Set environment variables in Vercel dashboard
```

### Other Platforms

```bash
# Build the application
npm run build

# Start production server
npm start
```

## 📊 Performance

- **Core Web Vitals**: Optimized for LCP, FID, CLS
- **Bundle Size**: Code splitting for AI models
- **Caching**: Intelligent model and asset caching
- **Progressive Loading**: Enhanced user experience

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Implement your experiment
4. Add tests and documentation
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🔗 Links

- **Main Portfolio**: [abdalkader.dev](https://abdalkader.dev)
- **GitHub**: [github.com/abdalkaderdev](https://github.com/abdalkaderdev)
- **LinkedIn**: [linkedin.com/in/abdalkaderdev](https://linkedin.com/in/abdalkaderdev)

---

Built with ❤️ for the AI community