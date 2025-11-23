# Global Navigation Hub

A unified navigation system that appears across all four ecosystem sites (Portfolio, Storybook, Docs, History), providing context-aware navigation, related content discovery, and seamless cross-platform navigation.

## Features

### 🎯 Core Functionality

- **Context-Aware Navigation**: Automatically detects current site and shows relevant information
- **Related Content Discovery**: Shows related projects, components, docs, and blog posts based on current page
- **Quick Platform Jumps**: Fast access to all ecosystem sites
- **Consistent Design**: Unified header and footer across all properties
- **Responsive Design**: Works seamlessly on all device sizes

### 📊 Components

#### GlobalNavigationHub

Main navigation component that provides:
- Fixed top navigation bar
- Quick links to other sites (desktop)
- Slide-out menu panel with:
  - Current context display
  - Related content section
  - All ecosystem sites list
- Keyboard navigation support (ESC to close)
- Click-outside to close

**Location**: `packages/ui/src/components/GlobalNavigationHub/`

#### GlobalFooter

Consistent footer component with:
- Current site links
- Ecosystem sites navigation
- Social media links
- Copyright and tagline

**Location**: `packages/ui/src/components/GlobalFooter/`

### 🔧 Integration

#### Portfolio App

```tsx
import { GlobalNavigation } from '@/components/GlobalNavigation/GlobalNavigation';
import { GlobalFooter } from '@/components/GlobalFooter/GlobalFooter';

// In _app.tsx
<GlobalNavigation />
<Nav /> {/* Existing nav */}
<GlobalFooter />
<Footer /> {/* Existing footer */}
```

**Location**: `apps/portfolio/components/GlobalNavigation/`

#### Storybook

Integration pending - add to Storybook's preview configuration.

#### Docs (Mintlify)

Integration pending - add to Mintlify configuration.

#### History App

Integration pending - add to history app layout.

### 🎨 Context Detection

The system automatically detects the current site using hostname:

- `abdalkader.dev` → Portfolio
- `storybook.abdalkader.dev` → Storybook
- `docs.abdalkader.dev` → Documentation
- `blog.abdalkader.dev` → Blog
- `history.abdalkader.dev` → Programming Museum

### 🔗 Related Content

The navigation hub automatically shows related content based on the current page:

#### Portfolio Project Pages
- Development timeline milestones
- Storybook components used
- Documentation sections
- Related blog posts

#### Storybook Component Pages
- Component documentation
- Projects using the component

#### Documentation Pages
- Related projects
- Component references
- Tutorial links

#### Blog Posts
- Related projects
- Documentation references

### 📱 Responsive Behavior

- **Desktop**: Quick links visible in header, full menu on click
- **Tablet**: Quick links hidden, menu accessible via button
- **Mobile**: Full-width slide-out menu

### ⌨️ Keyboard Navigation

- `ESC`: Close navigation menu
- `Tab`: Navigate through menu items
- `Enter/Space`: Activate links

### 🎯 Usage Example

```tsx
import { GlobalNavigationHub } from '@abdalkader/ui';
import { getCurrentSiteContext, getContextRelatedContent } from '@abdalkader/ui/lib/navigationContext';

function MyApp() {
  const currentSite = getCurrentSiteContext();
  const relatedContent = getContextRelatedContent('portfolio', '/projects/quantum-animation-system');

  return (
    <GlobalNavigationHub
      currentSite={currentSite}
      relatedContent={relatedContent}
      showContext={true}
    />
  );
}
```

### 🔄 Site Context Utilities

Utilities for detecting and working with site context:

**Location**: `packages/ui/src/lib/navigationContext.ts`

#### Functions

- `getCurrentSiteContext()`: Detect current site from hostname
- `getProjectRelatedContent(slug)`: Get related content for a project
- `getComponentRelatedContent(path)`: Get related content for a component
- `getDocRelatedContent(path)`: Get related content for documentation
- `getBlogPostRelatedContent(slug)`: Get related content for blog post
- `getContextRelatedContent(siteId, pathname)`: Get related content based on context

### 🎨 Styling

The navigation uses CSS custom properties for theming:

- `--site-color`: Site-specific accent color
- Consistent with design system colors
- Dark theme optimized
- Smooth animations and transitions

### 🚀 Future Enhancements

Potential improvements:

1. **Search Integration**: Add search across all sites
2. **Recent Pages**: Show recently visited pages
3. **Favorites**: Allow users to favorite pages
4. **Notifications**: Show updates across sites
5. **Analytics**: Track navigation patterns
6. **Customization**: Allow users to customize quick links
7. **Keyboard Shortcuts**: Add keyboard shortcuts for navigation
8. **Voice Navigation**: Voice commands for navigation

## Integration Status

- ✅ **Portfolio**: Integrated
- ⏳ **Storybook**: Pending
- ⏳ **Docs**: Pending
- ⏳ **History**: Pending

## Related Documentation

- [Project Registry](../packages/ui/src/lib/projectRegistry.ts)
- [Navigation Context](../packages/ui/src/lib/navigationContext.ts)
- [Unified Timeline System](../UNIFIED_TIMELINE_SYSTEM.md)

