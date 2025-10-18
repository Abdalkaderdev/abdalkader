# 📖 Bible App Project Plan

## 🚀 Vision
To create a world-class, clean, and uplifting Bible App for web and mobile, evolving from a simple reader into a holistic, community-powered spiritual companion empowered by AI.

---

## 🟢 Phase 1: Core Bible MVP (Complete)
### **Goals:**
- Clean, responsive Bible reader
- Fuzzy search (Fuse.js)
- Bookmarks (local/async storage)
- Daily verse feature
- Offline-ready (PWA)
- Dark/light mode
- Mintlify-style, typography-focused layout
- Shareable components between web/mobile

### **Architecture:**
```
/apps
  web/     → Next.js (bible.abdalkader.dev)
  mobile/  → Expo (Android/iOS)
/packages
  ui/      → Shared UI (Button, VerseCard, etc.)
  data/    → Bible data + metadata
  utils/   → Search, format, storage, etc.
```

### **Tech Stack:**
- Next.js 14 (App Router, Tailwind, next-pwa)
- Expo SDK 52 (React Native, NativeWind)
- TypeScript
- Zustand
- Fuse.js
- AsyncStorage/localStorage
- ESLint, Prettier, Turborepo

### **Milestones:**
1. [x] Monorepo structure/scaffolding
2. [x] Shared UI library & Mintlify design
3. [x] Fuzzy search on Bible text
4. [x] Daily verse logic
5. [x] Bookmarks with persistence
6. [x] PWA offline-first web app
7. [x] Light/dark mode sync
8. [x] Initial documentation + plans

---

## 🟡 Phase 2: Community & Study Platform
### **Goals:**
- Evolve to a social, study, and spiritual platform
- Add maps, prayer, plans, and static studies
- Stay modular, reusable, and cross-platform

### **Planned Features:**
- **Church Locator:**
  - Mapbox/Google Maps-based (show near user)
  - Data source: /packages/data/churches.json
- **Prayer Wall:**
  - Allow user-submitted prayer requests
  - Store locally first (cloud sync + moderation later)
- **Reading Plans/Challenges:**
  - JSON-driven daily plans, marked progress
  - Challenge yourself and optionally share progress
- **Studies, Salvation, Healing:**
  - Static MDX pages with verses, video, reflection
- **UI/UX:**
  - Tabs: Home | Bible | Churches | Prayer | Plans | Study | Settings
  - Persistent dark/light toggle
  - Maintain Mintlify style polish

### **Tech Additions:**
- Mapbox GL/Google Maps
- Cloud DB: Supabase or Firebase (later for auth, sync)
- Expo Notifications, Deep links
- Continue with Zustand, TypeScript

### **Milestones:**
1. [ ] Add routes/screens for all modules
2. [ ] Example data: JSON/MDX structures
3. [ ] Map feature for Church Locator
4. [ ] Prayer requests input/list + persistence
5. [ ] Reading plans with progress
6. [ ] Basic static MDX studies
7. [ ] Web/iOS/Android parity
8. [ ] Verified modularity: all UI shared, no code duplication
9. [ ] Roadmap refinement & doc update

---

## 🔵 Phase 3: AI-Powered Spiritual Assistant (Planned)
- AI Q&A on scripture (OpenAI integration)
- Verse lookup, contextual answers
- Smart suggestions, deep search
- Summaries, daily devotionals via LLM
- Smart bookmarks (auto highlights, trend detection)
- Chat-like spiritual support

---

## 📈 Roadmap & Priorities (Q4 2025)
- [x] MVP shipped (web/mobile)
- [ ] Launch Phase 2 features (community, plans, studies)
- [ ] Prep for async sync/auth (Phase 3)
- [ ] Prepare for Vercel, EAS, and app store launch
- [ ] Ongoing: polish, performance, accessibility

## 📋 Technical Principles
- **Monorepo first**: Everything shared and DRY
- **Modern stack**: Next.js, Expo, TypeScript, Turborepo
- **PWA & Offline always**
- **Tested, documented, and easy for others to contribute**

## 👥 Contributors & Guidance
- Follow roadmap, prioritize clean PRs, write documentation
- Maintain shared UI and utility packages
- Q&A, bugs, and ideas welcome in GitHub Issues

---

*“For God so loved the world...” – John 3:16*
