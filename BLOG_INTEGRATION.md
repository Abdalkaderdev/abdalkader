# Blog Integration Guide

## Overview

The blog integration provides a seamless connection between the Hexo blog (`apps/blog/`) and the main portfolio website (`apps/portfolio/`), creating a unified content management system.

## 🏗️ Architecture

### Blog Structure
```
apps/blog/
├── source/              # Blog content
│   ├── _posts/         # Blog posts (Markdown)
│   ├── _drafts/        # Draft posts
│   ├── pages/          # Static pages
│   └── images/         # Blog images
├── themes/             # Hexo themes
├── _config.yml         # Blog configuration
└── public/             # Generated static files
```

### Integration Points

1. **Shared UI Components** - Blog uses components from `@abdalkader/ui`
2. **Consistent Styling** - Shared design tokens and CSS
3. **Cross-linking** - Navigation between blog and portfolio
4. **Unified Analytics** - Shared tracking and analytics

## 📝 Content Management

### Creating New Posts

```bash
# Navigate to blog directory
cd apps/blog

# Create new post
hexo new "Post Title"

# Create draft post
hexo new draft "Draft Title"

# Publish draft
hexo publish "draft-title"
```

### Post Front Matter

```yaml
---
title: "Your Post Title"
date: 2024-01-15 10:00:00
updated: 2024-01-15 10:00:00
tags:
  - React
  - TypeScript
  - Web Development
categories:
  - Frontend
  - Tutorials
excerpt: "Brief description of your post"
cover: "path/to/cover-image.jpg"
featured: true
---
```

### Content Guidelines

#### Writing Style
- Use clear, concise language
- Include code examples with syntax highlighting
- Add relevant images and diagrams
- Use proper heading hierarchy (H1, H2, H3)
- Include meta descriptions for SEO

#### Code Blocks
```markdown
```javascript
function greetUser(name) {
  return `Hello, ${name}!`;
}
```
```

#### Images
- Store images in `source/images/`
- Use descriptive filenames
- Optimize images for web (WebP preferred)
- Include alt text for accessibility

## 🎨 Theming and Styling

### Theme Configuration

The blog uses the Icarus theme with custom modifications:

```yaml
# _config.yml
theme: icarus

# Custom theme settings
theme_config:
  # Custom colors matching design system
  primary_color: "#f44e00"
  secondary_color: "#fa7300"
  
  # Typography
  font_family: "PP Neue Montreal, sans-serif"
  
  # Layout
  sidebar: "left"
  sidebar_width: "280px"
```

### Custom Styling

Custom styles are defined in `source/css/custom.css`:

```css
/* Import design system variables */
@import url('../../packages/ui/dist/index.css');

/* Custom blog-specific styles */
.post-content {
  font-family: var(--font-primary);
  line-height: 1.6;
}

.post-meta {
  color: var(--color-gray-600);
  font-size: var(--text-sm);
}
```

### Component Integration

The blog can use shared UI components:

```javascript
// In theme templates
const { Button, Input, Layout } = require('@abdalkader/ui');

// Use in EJS templates
<%- Button({ 
  variant: 'primary', 
  children: 'Read More' 
}) %>
```

## 🔗 Cross-Platform Integration

### Portfolio Integration

#### Recent Posts Widget
```tsx
// In portfolio app
import { getRecentPosts } from '../blog/api';

function RecentPosts() {
  const posts = getRecentPosts(3);
  
  return (
    <section>
      <h2>Latest Blog Posts</h2>
      {posts.map(post => (
        <article key={post.slug}>
          <h3>{post.title}</h3>
          <p>{post.excerpt}</p>
          <a href={`/blog/${post.slug}`}>Read More</a>
        </article>
      ))}
    </section>
  );
}
```

#### Navigation Links
```tsx
// Shared navigation component
const navigation = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Projects', href: '/projects' },
  { name: 'Blog', href: '/blog' },
  { name: 'Contact', href: '/contact' }
];
```

### API Integration

#### Blog API Endpoints
```javascript
// apps/blog/api/posts.js
const fs = require('fs');
const path = require('path');

function getPosts() {
  const postsDir = path.join(__dirname, '../source/_posts');
  const files = fs.readdirSync(postsDir);
  
  return files
    .filter(file => file.endsWith('.md'))
    .map(file => {
      const content = fs.readFileSync(path.join(postsDir, file), 'utf8');
      const frontMatter = parseFrontMatter(content);
      return {
        slug: file.replace('.md', ''),
        ...frontMatter
      };
    });
}

function getRecentPosts(limit = 5) {
  return getPosts()
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, limit);
}
```

## 🚀 Deployment

### Build Process

```bash
# Build blog
cd apps/blog
hexo generate

# Build with custom theme
hexo generate --config _config.production.yml
```

### Vercel Configuration

```json
// vercel-blog.json
{
  "buildCommand": "cd apps/blog && hexo generate",
  "outputDirectory": "apps/blog/public",
  "framework": "hexo"
}
```

### Environment Variables

```bash
# Blog-specific environment variables
HEXO_THEME=icarus
BLOG_URL=https://blog.abdalkader.dev
ANALYTICS_ID=G-XXXXXXXXXX
```

## 📊 Analytics and SEO

### Google Analytics Integration

```yaml
# _config.yml
google_analytics:
  tracking_id: G-XXXXXXXXXX
  anonymize_ip: true
```

### SEO Configuration

```yaml
# _config.yml
# SEO settings
url: https://blog.abdalkader.dev
permalink: :year/:month/:title/
permalink_defaults:
  pretty_urls:
    trailing_index: false
    trailing_html: false

# Meta tags
meta_generator: false
```

### Sitemap Generation

```yaml
# _config.yml
# Sitemap plugin
sitemap:
  path: sitemap.xml
  template: ./sitemap_template.xml
  rel: false
  tags: true
  categories: true
```

## 🔧 Development Workflow

### Local Development

```bash
# Start blog development server
cd apps/blog
hexo server

# Start with drafts
hexo server --draft

# Clean and regenerate
hexo clean && hexo generate
```

### Content Workflow

1. **Draft Creation** - Create draft posts for work-in-progress content
2. **Review Process** - Use draft system for content review
3. **Publishing** - Publish when ready for production
4. **Cross-linking** - Update portfolio with new blog content

### Quality Assurance

```bash
# Lint markdown files
markdownlint source/_posts/*.md

# Check for broken links
hexo check

# Validate HTML output
html-validate public/**/*.html
```

## 📱 Mobile Optimization

### Responsive Design

The blog theme is fully responsive with:
- Mobile-first CSS approach
- Touch-friendly navigation
- Optimized images for different screen sizes
- Readable typography on all devices

### Performance

- Lazy loading for images
- Minified CSS and JavaScript
- Optimized font loading
- CDN integration for static assets

## 🎯 Best Practices

### Content Strategy

1. **Consistent Publishing** - Regular posting schedule
2. **Quality over Quantity** - Focus on valuable content
3. **SEO Optimization** - Proper meta tags and descriptions
4. **User Experience** - Easy navigation and reading

### Technical Best Practices

1. **Image Optimization** - Compress and resize images
2. **Code Highlighting** - Use proper syntax highlighting
3. **Link Management** - Check for broken links regularly
4. **Backup Strategy** - Regular content backups

## 🛠️ Troubleshooting

### Common Issues

#### Build Failures
```bash
# Clear cache and rebuild
hexo clean
rm -rf node_modules
pnpm install
hexo generate
```

#### Theme Issues
```bash
# Update theme
cd themes/icarus
git pull origin master

# Reset theme configuration
cp themes/icarus/_config.yml.example themes/icarus/_config.yml
```

#### Content Issues
- Check front matter syntax
- Validate markdown formatting
- Ensure image paths are correct
- Verify category and tag names

## 📚 Resources

- [Hexo Documentation](https://hexo.io/docs/)
- [Icarus Theme](https://github.com/ppoffice/hexo-theme-icarus)
- [Markdown Guide](https://www.markdownguide.org/)
- [SEO Best Practices](https://developers.google.com/search/docs)