# 🔥 Roast / 💖 Toast Bot Setup

## Quick Setup

1. **Get Groq API Key**
   - Visit [Groq Console](https://console.groq.com/)
   - Create account and get your API key

2. **Environment Setup**
   ```bash
   cp .env.local.example .env.local
   ```
   Add your Groq API key to `.env.local`:
   ```
   GROQ_API_KEY=your_actual_groq_api_key_here
   ```

3. **Start Development**
   ```bash
   npm run dev
   ```

## Features

- **Floating Chat Widget**: Bottom-right corner button that expands into full chat interface
- **Dual Modes**: 
  - 🔥 Roast Mode (red theme) - Witty, playful roasts
  - 💖 Toast Mode (green theme) - Uplifting compliments
- **Multi-turn Conversations**: Chat history with scrollable message area
- **Flexible Input**: Send names, moods, situations, or anything
- **Real-time Chat**: User messages (blue) and bot replies (themed colors)
- **Persistent Mode**: Remembers last selected mode
- **Smooth Animations**: Framer Motion powered transitions

## Usage

1. Click the floating button (🔥 or 💖) in bottom-right corner
2. Type anything in the chat input
3. Press Enter or click "Send"
4. Toggle modes using the header button
5. Continue the conversation with multiple messages

The widget is automatically available on all pages via `_app.tsx` integration.