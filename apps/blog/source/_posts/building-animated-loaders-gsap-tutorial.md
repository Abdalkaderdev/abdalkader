---
title: "Building Animated Loading Screens with GSAP: A Step-by-Step Tutorial"
date: 2025-02-11 09:00:00
updated: 2025-02-11 09:00:00
categories: [Tutorials]
tags: [GSAP, Animation, JavaScript, CSS, Loading Screen, Web Development, Frontend]
excerpt: "Learn how to create stunning animated loading screens using GSAP. This hands-on tutorial covers everything from basic loaders to advanced sequenced animations."
cover: /images/posts/gsap-loaders-cover.svg
thumbnail: /images/posts/gsap-loaders-thumb.svg
author: Abdalkader
featured: true
toc: true
comments: true
permalink: /blog/building-animated-loaders-gsap-tutorial/
seo_title: "GSAP Animated Loading Screens Tutorial 2025 | Step-by-Step Guide"
seo_description: "Create professional animated loading screens with GSAP. Complete tutorial with code examples, from basic spinners to complex sequenced animations."
keywords: ["GSAP", "Loading Animation", "Web Animation", "JavaScript Animation", "CSS Loading Screen", "Frontend Tutorial"]
difficulty: Intermediate
estimated_time: 45 minutes
---

# Building Animated Loading Screens with GSAP: A Step-by-Step Tutorial

A well-crafted loading screen can transform a moment of waiting into an engaging experience. In this tutorial, we'll build several animated loaders using GSAP (GreenSock Animation Platform), progressing from simple to advanced implementations.

## Prerequisites

Before diving in, make sure you have:

- **Basic HTML/CSS knowledge** - Understanding of flexbox and positioning
- **JavaScript fundamentals** - Familiarity with functions, arrays, and DOM manipulation
- **A code editor** - VS Code, Sublime Text, or any editor of your choice
- **A modern browser** - Chrome, Firefox, or Edge for testing

No prior GSAP experience is required - we'll cover everything you need!

## What You'll Learn

By the end of this tutorial, you'll be able to:

1. Set up GSAP in your project
2. Create pulsing dot loaders
3. Build circular progress indicators
4. Design text reveal animations
5. Combine multiple animations into sequenced loading screens
6. Add easing and timing for professional polish

---

## Step 1: Project Setup

Let's start by creating our project structure and including GSAP.

### Create the HTML Structure

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>GSAP Animated Loaders</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <!-- Our loaders will go here -->
  <div id="loader-container"></div>

  <!-- Include GSAP from CDN -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
  <script src="script.js"></script>
</body>
</html>
```

### Base CSS Styles

```css
/* styles.css */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

#loader-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 60px;
}

.loader-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.loader-label {
  color: #8892b0;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 2px;
}
```

---

## Step 2: Creating a Pulsing Dots Loader

Our first loader will feature three dots that pulse in sequence - a classic loading pattern.

### Add the HTML

```html
<div class="loader-wrapper">
  <div class="dots-loader">
    <div class="dot"></div>
    <div class="dot"></div>
    <div class="dot"></div>
  </div>
  <span class="loader-label">Loading</span>
</div>
```

### Style the Dots

```css
.dots-loader {
  display: flex;
  gap: 12px;
}

.dot {
  width: 16px;
  height: 16px;
  background: #64ffda;
  border-radius: 50%;
  opacity: 0.3;
}
```

### Animate with GSAP

```javascript
// script.js
function createDotsLoader() {
  const dots = document.querySelectorAll('.dot');

  // Create a timeline for the animation
  const tl = gsap.timeline({ repeat: -1 });

  // Animate each dot with a stagger
  tl.to(dots, {
    opacity: 1,
    scale: 1.3,
    duration: 0.4,
    stagger: 0.15,
    ease: "power2.inOut"
  })
  .to(dots, {
    opacity: 0.3,
    scale: 1,
    duration: 0.4,
    stagger: 0.15,
    ease: "power2.inOut"
  });

  return tl;
}

// Initialize
createDotsLoader();
```

### Understanding the Code

- **`gsap.timeline()`** - Creates a sequence of animations that play one after another
- **`repeat: -1`** - Makes the animation loop infinitely
- **`stagger: 0.15`** - Delays each subsequent element by 0.15 seconds
- **`ease: "power2.inOut"`** - Adds smooth acceleration and deceleration

---

## Step 3: Building a Circular Progress Loader

Next, let's create a more sophisticated circular progress indicator using SVG.

### Add the SVG Structure

```html
<div class="loader-wrapper">
  <div class="circle-loader">
    <svg viewBox="0 0 100 100">
      <circle class="circle-bg" cx="50" cy="50" r="45"/>
      <circle class="circle-progress" cx="50" cy="50" r="45"/>
    </svg>
    <span class="circle-percent">0%</span>
  </div>
  <span class="loader-label">Processing</span>
</div>
```

### Style the Circle

```css
.circle-loader {
  position: relative;
  width: 120px;
  height: 120px;
}

.circle-loader svg {
  transform: rotate(-90deg);
  width: 100%;
  height: 100%;
}

.circle-bg {
  fill: none;
  stroke: #233554;
  stroke-width: 8;
}

.circle-progress {
  fill: none;
  stroke: #64ffda;
  stroke-width: 8;
  stroke-linecap: round;
  stroke-dasharray: 283; /* 2 * PI * r (2 * 3.14159 * 45) */
  stroke-dashoffset: 283;
}

.circle-percent {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #ccd6f6;
  font-size: 24px;
  font-weight: 600;
}
```

### Animate the Progress

```javascript
function createCircleLoader() {
  const circleProgress = document.querySelector('.circle-progress');
  const percentText = document.querySelector('.circle-percent');
  const circumference = 2 * Math.PI * 45; // 283

  // Object to animate (GSAP can animate any object property)
  const progress = { value: 0 };

  const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.5 });

  tl.to(progress, {
    value: 100,
    duration: 2,
    ease: "power1.inOut",
    onUpdate: () => {
      // Update the stroke dash offset
      const offset = circumference - (progress.value / 100) * circumference;
      circleProgress.style.strokeDashoffset = offset;

      // Update the percentage text
      percentText.textContent = `${Math.round(progress.value)}%`;
    }
  })
  .to(progress, {
    value: 0,
    duration: 0.5,
    ease: "power2.in",
    onUpdate: () => {
      const offset = circumference - (progress.value / 100) * circumference;
      circleProgress.style.strokeDashoffset = offset;
      percentText.textContent = `${Math.round(progress.value)}%`;
    }
  });

  return tl;
}

createCircleLoader();
```

### Key Concepts

- **SVG stroke-dasharray** - Defines the pattern of dashes in the stroke
- **stroke-dashoffset** - Controls where the dash pattern starts
- **onUpdate callback** - Runs on every animation frame, perfect for custom updates

---

## Step 4: Text Reveal Loading Animation

Let's create an elegant text reveal effect that's perfect for splash screens.

### Add the HTML

```html
<div class="loader-wrapper">
  <div class="text-loader">
    <span class="text-char">L</span>
    <span class="text-char">O</span>
    <span class="text-char">A</span>
    <span class="text-char">D</span>
    <span class="text-char">I</span>
    <span class="text-char">N</span>
    <span class="text-char">G</span>
  </div>
</div>
```

### Style the Text

```css
.text-loader {
  display: flex;
  gap: 4px;
}

.text-char {
  font-size: 48px;
  font-weight: 700;
  color: #64ffda;
  opacity: 0;
  transform: translateY(50px);
}
```

### Create the Animation

```javascript
function createTextLoader() {
  const chars = document.querySelectorAll('.text-char');

  const tl = gsap.timeline({ repeat: -1, repeatDelay: 1 });

  // Reveal animation
  tl.to(chars, {
    opacity: 1,
    y: 0,
    duration: 0.6,
    stagger: 0.08,
    ease: "back.out(1.7)"
  })
  // Hold for a moment
  .to({}, { duration: 0.5 })
  // Wave effect
  .to(chars, {
    y: -15,
    duration: 0.3,
    stagger: {
      each: 0.05,
      repeat: 1,
      yoyo: true
    },
    ease: "power1.inOut"
  })
  // Fade out
  .to(chars, {
    opacity: 0,
    y: -50,
    duration: 0.4,
    stagger: 0.05,
    ease: "power2.in"
  });

  return tl;
}

createTextLoader();
```

### Animation Breakdown

- **`back.out(1.7)`** - Creates an overshoot effect, giving the letters a bouncy feel
- **`yoyo: true`** - Reverses the animation, creating a wave that goes up and back down
- **`repeat: 1`** inside stagger - Makes each letter do the wave motion twice

---

## Step 5: Advanced Sequenced Loader

Now let's combine everything into a full-page loading screen with multiple phases.

### Complete HTML Structure

```html
<div id="preloader">
  <!-- Background overlay -->
  <div class="preloader-bg"></div>

  <!-- Logo container -->
  <div class="preloader-logo">
    <svg class="logo-svg" viewBox="0 0 100 100">
      <path class="logo-path" d="M50 10 L90 90 L10 90 Z" />
    </svg>
  </div>

  <!-- Loading bar -->
  <div class="preloader-bar">
    <div class="bar-fill"></div>
  </div>

  <!-- Loading text -->
  <div class="preloader-text">
    <span class="loading-message">Preparing your experience</span>
    <span class="loading-dots">...</span>
  </div>
</div>

<!-- Main content (hidden initially) -->
<main id="main-content" style="opacity: 0;">
  <h1>Welcome!</h1>
  <p>Your content has loaded successfully.</p>
</main>
```

### Comprehensive Styles

```css
#preloader {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.preloader-bg {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #0a192f 0%, #112240 100%);
}

.preloader-logo {
  position: relative;
  z-index: 1;
  margin-bottom: 40px;
}

.logo-svg {
  width: 80px;
  height: 80px;
}

.logo-path {
  fill: none;
  stroke: #64ffda;
  stroke-width: 3;
  stroke-dasharray: 240;
  stroke-dashoffset: 240;
}

.preloader-bar {
  position: relative;
  z-index: 1;
  width: 200px;
  height: 4px;
  background: #233554;
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 20px;
}

.bar-fill {
  width: 0%;
  height: 100%;
  background: linear-gradient(90deg, #64ffda, #63b3ed);
  border-radius: 2px;
}

.preloader-text {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
}

.loading-message {
  color: #8892b0;
  font-size: 14px;
  letter-spacing: 1px;
}

.loading-dots {
  color: #64ffda;
  font-size: 14px;
  width: 20px;
}

#main-content {
  text-align: center;
  color: #ccd6f6;
}

#main-content h1 {
  font-size: 48px;
  margin-bottom: 16px;
  color: #64ffda;
}
```

### The Complete Animation Sequence

```javascript
function initPreloader() {
  // Get all elements
  const preloader = document.getElementById('preloader');
  const preloaderBg = document.querySelector('.preloader-bg');
  const logoPath = document.querySelector('.logo-path');
  const barFill = document.querySelector('.bar-fill');
  const loadingMessage = document.querySelector('.loading-message');
  const loadingDots = document.querySelector('.loading-dots');
  const mainContent = document.getElementById('main-content');

  // Messages to cycle through
  const messages = [
    'Preparing your experience',
    'Loading assets',
    'Almost there',
    'Ready!'
  ];

  // Create master timeline
  const master = gsap.timeline({
    onComplete: () => {
      // Remove preloader from DOM after animation
      preloader.remove();
    }
  });

  // Phase 1: Logo draw animation
  master.to(logoPath, {
    strokeDashoffset: 0,
    duration: 1.5,
    ease: "power2.inOut"
  });

  // Phase 2: Logo fill and scale
  master.to(logoPath, {
    fill: '#64ffda',
    fillOpacity: 0.1,
    duration: 0.5,
    ease: "power1.in"
  })
  .to('.preloader-logo', {
    scale: 1.1,
    duration: 0.3,
    ease: "power1.out"
  })
  .to('.preloader-logo', {
    scale: 1,
    duration: 0.3,
    ease: "power1.in"
  });

  // Phase 3: Progress bar with message updates
  master.to(barFill, {
    width: '30%',
    duration: 0.8,
    ease: "power1.inOut",
    onStart: () => {
      loadingMessage.textContent = messages[0];
    }
  })
  .to(barFill, {
    width: '60%',
    duration: 0.6,
    ease: "power1.inOut",
    onStart: () => {
      loadingMessage.textContent = messages[1];
    }
  })
  .to(barFill, {
    width: '90%',
    duration: 0.5,
    ease: "power1.inOut",
    onStart: () => {
      loadingMessage.textContent = messages[2];
    }
  })
  .to(barFill, {
    width: '100%',
    duration: 0.3,
    ease: "power1.out",
    onStart: () => {
      loadingMessage.textContent = messages[3];
      loadingDots.textContent = '';
    }
  });

  // Phase 4: Animate dots while loading
  const dotsAnimation = gsap.to(loadingDots, {
    textContent: '...',
    duration: 1,
    repeat: -1,
    ease: "steps(3)",
    paused: true
  });

  // Start dots animation when bar starts
  master.call(() => dotsAnimation.play(), null, 1.5);
  master.call(() => dotsAnimation.pause(), null, "-=0.3");

  // Phase 5: Exit animation
  master.to('.preloader-logo', {
    y: -30,
    opacity: 0,
    duration: 0.4,
    ease: "power2.in"
  }, "+=0.3")
  .to(['.preloader-bar', '.preloader-text'], {
    y: 30,
    opacity: 0,
    duration: 0.4,
    ease: "power2.in"
  }, "<")
  .to(preloaderBg, {
    yPercent: -100,
    duration: 0.8,
    ease: "power3.inOut"
  })
  .to(mainContent, {
    opacity: 1,
    duration: 0.5,
    ease: "power1.out"
  }, "-=0.3");

  return master;
}

// Start the preloader when DOM is ready
document.addEventListener('DOMContentLoaded', initPreloader);
```

### Timeline Features Explained

- **Master Timeline** - Coordinates all sub-animations in sequence
- **Position Parameters** - `"<"` means "at the same time as previous", `"+=0.3"` adds delay
- **Callbacks** - `onStart`, `onComplete` for triggering actions at specific points
- **Steps Easing** - `"steps(3)"` creates a typewriter-like effect for the dots

---

## Step 6: Performance Optimization Tips

### Use will-change Sparingly

```css
.preloader-logo,
.bar-fill {
  will-change: transform, opacity;
}
```

### Prefer Transform and Opacity

GSAP automatically uses hardware-accelerated properties, but it's good practice to stick with:
- `transform` (scale, translate, rotate)
- `opacity`

### Clean Up Animations

```javascript
// Store timeline reference
let preloaderTimeline = initPreloader();

// If you need to cancel the animation
function cancelPreloader() {
  if (preloaderTimeline) {
    preloaderTimeline.kill();
    preloaderTimeline = null;
  }
}
```

### Use GSAP's Set for Initial States

```javascript
// Instead of CSS, use GSAP for consistency
gsap.set('.element', {
  opacity: 0,
  y: 50
});
```

---

## Final Result

When you put it all together, you'll have a professional loading screen that:

1. Draws an SVG logo with a stroke animation
2. Fills and pulses the logo
3. Animates a progress bar with status messages
4. Displays animated loading dots
5. Performs a smooth exit revealing your main content

### Complete JavaScript File

```javascript
// script.js - Complete implementation

document.addEventListener('DOMContentLoaded', () => {
  // Set initial states
  gsap.set('.logo-path', { strokeDashoffset: 240 });
  gsap.set('.bar-fill', { width: '0%' });
  gsap.set('#main-content', { opacity: 0 });

  // Initialize the preloader
  initPreloader();
});

function initPreloader() {
  const preloader = document.getElementById('preloader');
  const preloaderBg = document.querySelector('.preloader-bg');
  const logoPath = document.querySelector('.logo-path');
  const barFill = document.querySelector('.bar-fill');
  const loadingMessage = document.querySelector('.loading-message');
  const loadingDots = document.querySelector('.loading-dots');
  const mainContent = document.getElementById('main-content');

  const messages = [
    'Preparing your experience',
    'Loading assets',
    'Almost there',
    'Ready!'
  ];

  const master = gsap.timeline({
    onComplete: () => preloader.remove()
  });

  // Logo animation
  master
    .to(logoPath, {
      strokeDashoffset: 0,
      duration: 1.5,
      ease: "power2.inOut"
    })
    .to(logoPath, {
      fill: '#64ffda',
      fillOpacity: 0.1,
      duration: 0.5
    })
    .to('.preloader-logo', {
      scale: 1.1,
      duration: 0.3,
      yoyo: true,
      repeat: 1
    });

  // Progress bar
  master
    .to(barFill, { width: '30%', duration: 0.8, onStart: () => loadingMessage.textContent = messages[0] })
    .to(barFill, { width: '60%', duration: 0.6, onStart: () => loadingMessage.textContent = messages[1] })
    .to(barFill, { width: '90%', duration: 0.5, onStart: () => loadingMessage.textContent = messages[2] })
    .to(barFill, { width: '100%', duration: 0.3, onStart: () => { loadingMessage.textContent = messages[3]; loadingDots.textContent = ''; }});

  // Exit animation
  master
    .to(['.preloader-logo', '.preloader-bar', '.preloader-text'], {
      opacity: 0,
      y: -30,
      duration: 0.4,
      stagger: 0.1
    }, "+=0.3")
    .to(preloaderBg, {
      yPercent: -100,
      duration: 0.8,
      ease: "power3.inOut"
    })
    .to(mainContent, {
      opacity: 1,
      duration: 0.5
    }, "-=0.3");

  return master;
}
```

---

## Next Steps

Now that you've mastered GSAP loading animations, try these challenges:

1. **Add Sound** - Trigger subtle audio cues at key animation points
2. **Theme Variants** - Create light/dark versions that respect user preferences
3. **Interactive Elements** - Add hover effects to the loading elements
4. **Page Transitions** - Use similar techniques for page-to-page transitions

## Resources

- [GSAP Official Documentation](https://greensock.com/docs/)
- [GSAP Easing Visualizer](https://greensock.com/ease-visualizer/)
- [SVG Path Animator](https://jakearchibald.github.io/svgomg/)
- [CodePen GSAP Collection](https://codepen.io/collection/GreenSock)

---

## Conclusion

Animated loading screens are more than just visual flair - they improve perceived performance and create memorable first impressions. GSAP makes creating these animations accessible and performant.

The key takeaways from this tutorial:

- **Timelines** are essential for sequencing complex animations
- **Stagger** creates beautiful cascading effects with minimal code
- **Easing** transforms robotic movements into natural-feeling animations
- **Callbacks** let you synchronize animations with your application logic

Start with the simple dot loader, then work your way up to the full preloader sequence. Each step builds on the previous concepts, and before long, you'll be creating your own custom loading experiences.

Happy animating!
