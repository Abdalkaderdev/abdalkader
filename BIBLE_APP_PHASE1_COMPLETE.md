# Bible App - Phase 1 MVP Complete! 📖✨

A clean, searchable, offline-ready Bible reader with bookmarks and daily verses, built with Next.js and Expo in a monorepo architecture.

## 🚀 **Live Demo**
- **Web App**: [bible.abdalkader.dev](https://bible.abdalkader.dev) (Coming Soon)
- **Mobile App**: Available on App Store & Google Play (Coming Soon)

## 📱 **Features Implemented**

### ✅ **Core Bible Reader**
- Clean, Mintlify-inspired design
- Responsive web and mobile interfaces
- Typography-focused layout for optimal reading

### ✅ **Search Functionality**
- Fuzzy search with Fuse.js
- Real-time search results
- Search suggestions and popular terms

### ✅ **Daily Verse**
- Automatically generated daily verse
- Beautiful verse cards with actions
- Share and copy functionality

### ✅ **Bookmarks System**
- Save favorite verses locally
- Cross-platform bookmark management
- Easy bookmark management interface

### ✅ **Offline Support**
- PWA configuration for web
- Service worker caching
- Offline-first architecture

### ✅ **Theme Support**
- Light/Dark/Auto theme switching
- Consistent theming across platforms
- System preference detection

## 🏗️ **Architecture**

```
/apps
  bible-web/       → Next.js 14 + Tailwind + PWA
  bible-mobile/    → Expo SDK 52 + NativeWind
/packages
  bible-ui/        → Shared React components
  bible-data/      → Bible text + metadata (JSON)
  bible-utils/     → Helper functions (search, storage, etc.)
```

## 🛠️ **Tech Stack**

### **Web App**
- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS + Custom CSS Variables
- **PWA**: next-pwa with offline caching
- **State**: Zustand for global state
- **Search**: Fuse.js for fuzzy search
- **Storage**: localStorage for bookmarks

### **Mobile App**
- **Framework**: Expo SDK 52 + React Native
- **Styling**: NativeWind (Tailwind for React Native)
- **Navigation**: React Navigation v6
- **Icons**: Expo Vector Icons
- **Storage**: AsyncStorage for bookmarks
- **Sharing**: Expo Sharing + Clipboard

### **Shared Packages**
- **UI Components**: React + TypeScript + CSS Modules
- **Build Tool**: Rollup for component library
- **Data**: TypeScript interfaces + JSON data
- **Utils**: Search, storage, theme management

## 🚀 **Quick Start**

### **Prerequisites**
- Node.js 18+
- pnpm 8+
- Expo CLI (for mobile development)

### **Installation**
```bash
# Clone the repository
git clone https://github.com/Abdalkaderdev/abdalkader.git
cd abdalkader

# Install dependencies
pnpm install

# Build shared packages
pnpm build:ui
```

### **Development**

#### **Web App**
```bash
cd apps/bible-web
pnpm dev
# Runs on http://localhost:3003
```

#### **Mobile App**
```bash
cd apps/bible-mobile
pnpm start
# Scan QR code with Expo Go app
```

#### **All Apps**
```bash
# From root directory
pnpm dev
# Runs all apps in development mode
```

### **Building**

#### **Web App**
```bash
pnpm build:bible
# Builds for production
```

#### **Mobile App**
```bash
cd apps/bible-mobile
pnpm build:android  # Android APK
pnpm build:ios      # iOS IPA
pnpm build:all      # Both platforms
```

## 📦 **Package Structure**

### **@abdalkader/bible-ui**
Shared UI components with Mintlify-inspired design:
- `Button` - Primary, secondary, ghost, danger variants
- `VerseCard` - Beautiful verse display with actions
- `SearchInput` - Search input with loading states

### **@abdalkader/bible-data**
Bible text and metadata:
- Complete Bible book structure
- Sample verses (John 3:16, Romans 8:28, etc.)
- Daily verse generator
- Book lookup utilities

### **@abdalkader/bible-utils**
Utility functions:
- `BibleSearch` - Fuse.js-powered search
- `BookmarkStorage` - Cross-platform bookmark management
- `ThemeManager` - Theme switching utilities
- Formatting and sharing utilities

## 🎨 **Design System**

### **Colors**
```css
--bible-primary: #3b82f6      /* Blue */
--bible-secondary: #6b7280    /* Gray */
--bible-danger: #ef4444       /* Red */
--bible-text: #374151         /* Dark Gray */
--bible-bg: #ffffff           /* White */
```

### **Typography**
- **Sans**: System fonts (SF Pro, Segoe UI, Roboto)
- **Serif**: Georgia, Times New Roman (for verse text)
- **Sizes**: Responsive typography scale

### **Components**
- Clean, minimal design
- Consistent spacing and borders
- Smooth animations and transitions
- Accessible focus states

## 📱 **Mobile Features**

### **Navigation**
- Bottom tab navigation
- Home, Search, Bookmarks, Settings
- Native iOS/Android feel

### **Platform Integration**
- Native sharing on mobile
- Clipboard integration
- Push notifications (Phase 2)
- App store optimization

## 🌐 **PWA Features**

### **Offline Support**
- Service worker caching
- Offline-first architecture
- Background sync
- Install prompts

### **Performance**
- Lazy loading
- Image optimization
- Bundle splitting
- Caching strategies

## 🔧 **Development**

### **Scripts**
```bash
# Development
pnpm dev                    # All apps
pnpm dev:bible-web         # Web only
pnpm dev:bible-mobile      # Mobile only

# Building
pnpm build:bible           # Web production build
pnpm build:ui              # UI package build
pnpm build:all             # All packages

# Testing
pnpm lint                  # ESLint
pnpm typecheck             # TypeScript
pnpm test                  # Jest tests
```

### **Code Quality**
- TypeScript strict mode
- ESLint + Prettier
- Husky pre-commit hooks
- Conventional commits

## 🚀 **Deployment**

### **Web App**
- Vercel deployment ready
- Custom domain: bible.abdalkader.dev
- Environment variables configured
- Build optimization enabled

### **Mobile App**
- EAS Build configured
- App Store Connect ready
- Google Play Console ready
- Code signing setup

## 📈 **Phase 2 Roadmap**

### **Community Features**
- [ ] Church locator with maps
- [ ] Prayer request wall
- [ ] Reading plans and challenges
- [ ] Study guides and reflections

### **Advanced Features**
- [ ] User authentication
- [ ] Cloud sync for bookmarks
- [ ] Push notifications
- [ ] Social sharing
- [ ] Audio Bible integration

### **Technical Improvements**
- [ ] Performance optimization
- [ ] Advanced caching
- [ ] Analytics integration
- [ ] A/B testing framework

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 **Acknowledgments**

- Scripture taken from the Holy Bible, New International Version®, NIV®
- Design inspired by Mintlify's clean aesthetic
- Built with love for the Christian community

---

**Built with ❤️ by [Abdalkader](https://abdalkader.dev)**

*"For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life." - John 3:16*
