// Thumbnail Generation Script
// Creates diverse visual styles for project thumbnails

const fs = require('fs');
const path = require('path');

// Define thumbnail styles for different variants
const thumbnailStyles = {
  gradient: {
    background: 'linear-gradient(135deg, #f44e00 0%, #fa7300 50%, #ff8c00 100%)',
    overlay: 'rgba(0, 0, 0, 0.3)',
    filter: 'contrast(1.2) brightness(1.1)'
  },
  '3d': {
    background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 50%, #3a3a3a 100%)',
    overlay: 'rgba(244, 78, 0, 0.2)',
    filter: 'perspective(1000px) rotateX(5deg) rotateY(2deg)'
  },
  minimal: {
    background: 'linear-gradient(135deg, #f8f8f8 0%, #e8e8e8 100%)',
    overlay: 'rgba(0, 0, 0, 0.1)',
    filter: 'grayscale(0.5) contrast(1.3)'
  },
  'data-viz': {
    background: 'linear-gradient(135deg, #1a1a1a 0%, #2d1b69 50%, #0f3460 100%)',
    overlay: 'rgba(244, 78, 0, 0.3)',
    filter: 'hue-rotate(20deg) saturate(1.5)'
  },
  default: {
    background: 'linear-gradient(135deg, #000 0%, #1a1a1a 100%)',
    overlay: 'rgba(244, 78, 0, 0.1)',
    filter: 'contrast(1.1) brightness(0.9)'
  }
};

// CSS classes for thumbnail variants
const cssStyles = `
/* Thumbnail Variant Styles */
.thumbnail-gradient {
  background: linear-gradient(135deg, #f44e00 0%, #fa7300 50%, #ff8c00 100%);
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.3);
    z-index: 1;
  }
  
  img {
    mix-blend-mode: overlay;
    opacity: 0.8;
    filter: contrast(1.2) brightness(1.1);
    z-index: 2;
    position: relative;
  }
}

.thumbnail-3d {
  background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 50%, #3a3a3a 100%);
  transform-style: preserve-3d;
  perspective: 1000px;
  
  img {
    transform: rotateX(5deg) rotateY(2deg);
    filter: contrast(1.1) brightness(0.9);
    transition: transform 0.3s ease;
  }
  
  &:hover img {
    transform: rotateX(0deg) rotateY(0deg);
  }
}

.thumbnail-minimal {
  background: linear-gradient(135deg, #f8f8f8 0%, #e8e8e8 100%);
  
  img {
    filter: grayscale(0.5) contrast(1.3);
    mix-blend-mode: multiply;
  }
}

.thumbnail-data-viz {
  background: linear-gradient(135deg, #1a1a1a 0%, #2d1b69 50%, #0f3460 100%);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(244, 78, 0, 0.3);
    z-index: 1;
  }
  
  img {
    filter: hue-rotate(20deg) saturate(1.5) brightness(1.1);
    mix-blend-mode: screen;
    z-index: 2;
    position: relative;
  }
}

.thumbnail-default {
  background: linear-gradient(135deg, #000 0%, #1a1a1a 100%);
  
  img {
    filter: contrast(1.1) brightness(0.9);
  }
}
`;

// Write CSS to a file
const cssPath = path.join(__dirname, '../styles/thumbnail-variants.scss');
fs.writeFileSync(cssPath, cssStyles);

console.log('✅ Thumbnail styles generated successfully!');
console.log(`📁 CSS file created at: ${cssPath}`);
console.log('🎨 Available variants: gradient, 3d, minimal, data-viz, default');
