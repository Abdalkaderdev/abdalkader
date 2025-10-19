# Programming Language History Museum

An interactive, AI-powered museum showcasing the evolution of programming languages from 1843 to present. Built with Next.js, TypeScript, and powered by Groq AI for real-time historical explanations and insights.

## 🌟 Features

### 🕰️ Interactive Timeline
- Smooth scrollable timeline from 1843 to 2024
- Major programming languages with historical context
- **Groq AI Integration**: Click any language → Real-time historical explanation
- Visual indicators for language paradigms (OOP, Functional, etc.)
- Decade-based filtering and exploration

### 💻 Live AI Code Playground
- Monaco Editor for code examples in each language
- **Groq AI Integration**: 
  - Explain code syntax and historical significance
  - Compare with modern equivalents
  - Suggest improvements in historical context
- Support for: JavaScript, Python, C++, Rust, Go, Java, C#, PHP, Ruby, and more
- WebAssembly execution where possible

### 🌳 Language Family Tree Visualization
- D3.js force-directed graph showing language relationships
- Click any node to get AI explanation of influences and derivations
- Filter by paradigm, decade, or popularity
- **Groq AI Integration**: "Explain this language's influence on modern programming"

### 🧠 Programming Paradigm Explorer
- Interactive exploration of programming paradigms:
  - Imperative vs Declarative
  - Object-Oriented Programming
  - Functional Programming
  - Logic Programming
  - Concurrent Programming
- **Groq AI Integration**: Real-time paradigm explanations with code examples

### 🤖 AI Programming History Assistant
- Real-time Q&A with programming history expert AI
- Language comparison tool with AI insights
- Interactive learning with AI guidance
- Personalized learning paths based on user interests

## 🚀 Tech Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **AI**: Groq API (Llama 3.1 8B, Mixtral 8x7B)
- **Visualization**: D3.js, GSAP
- **Code Editor**: Monaco Editor
- **Icons**: Lucide React
- **Deployment**: Vercel

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Groq API key (free tier available)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd apps/history
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Add your Groq API key to `.env.local`:
   ```env
   NEXT_PUBLIC_GROQ_API_KEY=your_groq_api_key_here
   NEXT_PUBLIC_APP_URL=https://history.abdalkader.dev
   ```

4. **Get a Groq API key**
   - Visit [console.groq.com](https://console.groq.com)
   - Sign up for a free account
   - Generate an API key
   - Add it to your `.env.local` file

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎯 Usage

### Timeline Exploration
1. Navigate to the Timeline section
2. Scroll through decades of programming history
3. Click on any language card to get AI-powered historical context
4. Explore different eras and their technological context

### Code Playground
1. Go to the Playground section
2. Select a programming language from the grid
3. Write or modify code in the Monaco Editor
4. Click "Explain Code" to get AI analysis
5. Compare syntax across different languages

### Language Family Tree
1. Visit the Family Tree section
2. Interact with the D3.js visualization
3. Click on language nodes to see relationships
4. Get AI explanations of language influences

### AI Assistant
1. Go to the AI Assistant section
2. Ask questions about programming history
3. Compare languages side-by-side
4. Explore programming paradigms with AI guidance

## 🔧 Configuration

### Groq AI Models
The application uses multiple Groq models for different tasks:
- **Primary**: `llama3-8b-8192` - Fast responses for most queries
- **Fallback**: `mixtral-8x7b-32768` - More detailed responses for complex queries

### Customization
- Modify language data in `src/lib/data/languages.json`
- Add new paradigms in `src/components/ParadigmExplorer.tsx`
- Customize AI prompts in `src/lib/prompts/`
- Adjust styling in `src/app/globals.css`

## 📊 Performance

- **AI Response Time**: < 2 seconds (Groq's ultra-fast inference)
- **Caching**: Smart caching of AI responses to reduce API calls
- **Animations**: 60fps GSAP animations
- **Bundle Size**: Optimized with dynamic imports

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment
```bash
npm run build
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- **Groq** for providing ultra-fast AI inference
- **Next.js** team for the amazing framework
- **D3.js** community for visualization tools
- **Monaco Editor** for the code editing experience
- **Programming language creators** throughout history

## 📞 Support

For questions or support:
- Create an issue on GitHub
- Contact: [your-email@domain.com]

---

Built with ❤️ for the programming community
