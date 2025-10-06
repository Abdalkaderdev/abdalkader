---
title: Building Modern Web Apps with Next.js 14
date: 2024-12-19 14:00:00
categories: [Web Development]
tags: [Next.js, React, SSR, Performance, Full Stack]
excerpt: Explore the latest features in Next.js 14 and learn how to build high-performance web applications
cover: /images/nextjs-14-cover.jpg
toc: true
---

# Building Modern Web Apps with Next.js 14

Next.js 14 brings exciting new features and improvements that make building modern web applications faster and more efficient than ever. In this comprehensive guide, we'll explore the key features and learn how to leverage them in your projects.

## What's New in Next.js 14

### Server Actions (Stable)
Server Actions are now stable, providing a seamless way to handle server-side logic directly in your components.

```javascript
// app/actions.js
'use server'

export async function createPost(formData) {
  const title = formData.get('title')
  const content = formData.get('content')
  
  // Save to database
  const post = await db.post.create({
    data: { title, content }
  })
  
  return post
}

// app/create-post/page.js
import { createPost } from '../actions'

export default function CreatePost() {
  return (
    <form action={createPost}>
      <input name="title" placeholder="Post title" required />
      <textarea name="content" placeholder="Post content" required />
      <button type="submit">Create Post</button>
    </form>
  )
}
```

### Turbopack (Beta)
Turbopack, the Rust-based bundler, is now in beta and offers significant performance improvements.

```bash
# Enable Turbopack for development
npm run dev -- --turbo
```

## App Router Deep Dive

The App Router continues to be the recommended approach for new Next.js applications.

### File-based Routing

```
app/
├── page.js                 # /
├── about/page.js          # /about
├── blog/
│   ├── page.js            # /blog
│   └── [slug]/page.js     # /blog/[slug]
└── api/
    └── posts/route.js     # /api/posts
```

### Layouts and Templates

```javascript
// app/layout.js - Root layout
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header>
          <nav>Navigation</nav>
        </header>
        <main>{children}</main>
        <footer>Footer</footer>
      </body>
    </html>
  )
}

// app/blog/layout.js - Nested layout
export default function BlogLayout({ children }) {
  return (
    <div className="blog-container">
      <aside>Blog Sidebar</aside>
      <article>{children}</article>
    </div>
  )
}
```

## Data Fetching Strategies

### Server Components (Default)

```javascript
// app/posts/page.js
async function getPosts() {
  const res = await fetch('https://api.example.com/posts', {
    cache: 'force-cache' // Static generation
  })
  return res.json()
}

export default async function PostsPage() {
  const posts = await getPosts()
  
  return (
    <div>
      <h1>Blog Posts</h1>
      {posts.map(post => (
        <article key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.excerpt}</p>
        </article>
      ))}
    </div>
  )
}
```

### Dynamic Data with Revalidation

```javascript
// Revalidate every hour
async function getPosts() {
  const res = await fetch('https://api.example.com/posts', {
    next: { revalidate: 3600 }
  })
  return res.json()
}

// Revalidate on every request
async function getLatestPosts() {
  const res = await fetch('https://api.example.com/posts', {
    cache: 'no-store'
  })
  return res.json()
}
```

### Client Components

```javascript
'use client'

import { useState, useEffect } from 'react'

export default function InteractiveComponent() {
  const [count, setCount] = useState(0)
  
  useEffect(() => {
    // Client-side logic
  }, [])
  
  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  )
}
```

## API Routes with Route Handlers

```javascript
// app/api/posts/route.js
import { NextResponse } from 'next/server'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const page = searchParams.get('page') || '1'
  
  const posts = await fetchPosts(page)
  
  return NextResponse.json(posts)
}

export async function POST(request) {
  const body = await request.json()
  
  const post = await createPost(body)
  
  return NextResponse.json(post, { status: 201 })
}
```

## Streaming and Suspense

```javascript
// app/dashboard/page.js
import { Suspense } from 'react'

async function Analytics() {
  const data = await fetchAnalytics() // Slow operation
  return <div>Analytics: {data.views}</div>
}

async function RecentPosts() {
  const posts = await fetchRecentPosts() // Fast operation
  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  )
}

export default function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      <Suspense fallback={<div>Loading recent posts...</div>}>
        <RecentPosts />
      </Suspense>
      <Suspense fallback={<div>Loading analytics...</div>}>
        <Analytics />
      </Suspense>
    </div>
  )
}
```

## Middleware for Authentication

```javascript
// middleware.js
import { NextResponse } from 'next/server'

export function middleware(request) {
  const token = request.cookies.get('auth-token')
  
  if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*']
}
```

## Performance Optimization

### Image Optimization

```javascript
import Image from 'next/image'

export default function Gallery() {
  return (
    <div>
      <Image
        src="/hero-image.jpg"
        alt="Hero"
        width={800}
        height={400}
        priority // Load immediately
      />
      <Image
        src="/gallery-1.jpg"
        alt="Gallery item"
        width={400}
        height={300}
        loading="lazy" // Default behavior
      />
    </div>
  )
}
```

### Font Optimization

```javascript
// app/layout.js
import { Inter, Roboto_Mono } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
})

const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  display: 'swap',
})

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.className}>
      <body>{children}</body>
    </html>
  )
}
```

## Deployment Best Practices

### Environment Configuration

```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  images: {
    domains: ['example.com'],
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
}

module.exports = nextConfig
```

### Vercel Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production deployment
vercel --prod
```

## Testing Your Next.js App

```javascript
// __tests__/page.test.js
import { render, screen } from '@testing-library/react'
import Home from '../app/page'

describe('Home', () => {
  it('renders a heading', () => {
    render(<Home />)
    
    const heading = screen.getByRole('heading', {
      name: /welcome to next.js/i,
    })
    
    expect(heading).toBeInTheDocument()
  })
})
```

## Conclusion

Next.js 14 continues to push the boundaries of what's possible with React applications. The stable Server Actions, improved Turbopack performance, and enhanced App Router make it an excellent choice for building modern web applications.

Key takeaways:
- Use Server Components by default for better performance
- Leverage Server Actions for seamless server-side logic
- Implement proper caching strategies for optimal performance
- Take advantage of built-in optimizations for images and fonts

Start building with Next.js 14 today and experience the future of web development! 🚀