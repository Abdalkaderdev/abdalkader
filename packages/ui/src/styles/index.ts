/**
 * Design System Styles Export
 * Centralized export for all design system styles
 */

// Import all styles to ensure they're bundled
import './design-tokens.css';
import './portfolio-components.css';

// Export design tokens
export * from './design-tokens';

// Re-export for convenience
export { default as designTokens } from './design-tokens';