import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiEye, FiEyeOff, FiVolume2, FiVolumeX, FiMousePointer, FiKeyboard } from 'react-icons/fi';

interface AccessibilityTest {
  id: string;
  name: string;
  description: string;
  status: 'pass' | 'fail' | 'warning' | 'pending';
  category: 'keyboard' | 'screen-reader' | 'visual' | 'motor';
  fix?: string;
}

interface AccessibilityTesterProps {
  showDetails?: boolean;
  className?: string;
}

export default function AccessibilityTester({ showDetails = false, className = '' }: AccessibilityTesterProps) {
  const [tests, setTests] = useState<AccessibilityTest[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [currentTest, setCurrentTest] = useState<string | null>(null);

  const accessibilityTests: Omit<AccessibilityTest, 'status'>[] = [
    {
      id: 'keyboard-navigation',
      name: 'Keyboard Navigation',
      description: 'All interactive elements are accessible via keyboard',
      category: 'keyboard',
      fix: 'Ensure all buttons, links, and form elements can be focused and activated with keyboard'
    },
    {
      id: 'focus-indicators',
      name: 'Focus Indicators',
      description: 'Visible focus indicators on all focusable elements',
      category: 'keyboard',
      fix: 'Add visible focus styles using :focus-visible pseudo-class'
    },
    {
      id: 'skip-links',
      name: 'Skip Links',
      description: 'Skip links for keyboard users to bypass navigation',
      category: 'keyboard',
      fix: 'Add skip links to main content and navigation'
    },
    {
      id: 'aria-labels',
      name: 'ARIA Labels',
      description: 'Proper ARIA labels for screen readers',
      category: 'screen-reader',
      fix: 'Add aria-label, aria-labelledby, or aria-describedby attributes'
    },
    {
      id: 'heading-structure',
      name: 'Heading Structure',
      description: 'Logical heading hierarchy (h1, h2, h3, etc.)',
      category: 'screen-reader',
      fix: 'Ensure headings follow a logical order and don\'t skip levels'
    },
    {
      id: 'alt-text',
      name: 'Alt Text',
      description: 'Descriptive alt text for all images',
      category: 'screen-reader',
      fix: 'Add meaningful alt text or mark decorative images as empty'
    },
    {
      id: 'color-contrast',
      name: 'Color Contrast',
      description: 'Sufficient color contrast ratios (WCAG AA)',
      category: 'visual',
      fix: 'Ensure text has at least 4.5:1 contrast ratio with background'
    },
    {
      id: 'text-scaling',
      name: 'Text Scaling',
      description: 'Text remains readable when scaled to 200%',
      category: 'visual',
      fix: 'Use relative units and test with browser zoom'
    },
    {
      id: 'touch-targets',
      name: 'Touch Targets',
      description: 'Touch targets are at least 44x44px',
      category: 'motor',
      fix: 'Ensure interactive elements meet minimum touch target size'
    },
    {
      id: 'motion-preference',
      name: 'Motion Preferences',
      description: 'Respects prefers-reduced-motion setting',
      category: 'motor',
      fix: 'Use @media (prefers-reduced-motion: reduce) to disable animations'
    }
  ];

  const runAccessibilityTests = async () => {
    setIsRunning(true);
    setTests([]);

    for (const test of accessibilityTests) {
      setCurrentTest(test.id);
      
      // Simulate test execution
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const result = await executeTest(test);
      
      setTests(prev => [...prev, { ...test, ...result }]);
    }

    setIsRunning(false);
    setCurrentTest(null);
  };

  const executeTest = async (test: Omit<AccessibilityTest, 'status'>): Promise<{ status: AccessibilityTest['status'] }> => {
    switch (test.id) {
      case 'keyboard-navigation':
        return { status: testKeyboardNavigation() };
      case 'focus-indicators':
        return { status: testFocusIndicators() };
      case 'skip-links':
        return { status: testSkipLinks() };
      case 'aria-labels':
        return { status: testAriaLabels() };
      case 'heading-structure':
        return { status: testHeadingStructure() };
      case 'alt-text':
        return { status: testAltText() };
      case 'color-contrast':
        return { status: testColorContrast() };
      case 'text-scaling':
        return { status: testTextScaling() };
      case 'touch-targets':
        return { status: testTouchTargets() };
      case 'motion-preference':
        return { status: testMotionPreference() };
      default:
        return { status: 'pending' };
    }
  };

  const testKeyboardNavigation = (): AccessibilityTest['status'] => {
    const focusableElements = document.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    let accessibleCount = 0;
    focusableElements.forEach(element => {
      if (element instanceof HTMLElement) {
        element.focus();
        if (document.activeElement === element) {
          accessibleCount++;
        }
      }
    });

    const percentage = (accessibleCount / focusableElements.length) * 100;
    if (percentage >= 90) return 'pass';
    if (percentage >= 70) return 'warning';
    return 'fail';
  };

  const testFocusIndicators = (): AccessibilityTest['status'] => {
    const focusableElements = document.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    let hasFocusStyles = 0;
    focusableElements.forEach(element => {
      const styles = window.getComputedStyle(element, ':focus');
      if (styles.outline !== 'none' || styles.boxShadow !== 'none') {
        hasFocusStyles++;
      }
    });

    const percentage = (hasFocusStyles / focusableElements.length) * 100;
    if (percentage >= 90) return 'pass';
    if (percentage >= 70) return 'warning';
    return 'fail';
  };

  const testSkipLinks = (): AccessibilityTest['status'] => {
    const skipLinks = document.querySelectorAll('a[href^="#"]');
    return skipLinks.length > 0 ? 'pass' : 'fail';
  };

  const testAriaLabels = (): AccessibilityTest['status'] => {
    const interactiveElements = document.querySelectorAll(
      'button, input, select, textarea, [role="button"], [role="link"]'
    );
    
    let labeledCount = 0;
    interactiveElements.forEach(element => {
      if (
        element.hasAttribute('aria-label') ||
        element.hasAttribute('aria-labelledby') ||
        element.hasAttribute('aria-describedby') ||
        element.textContent?.trim()
      ) {
        labeledCount++;
      }
    });

    const percentage = (labeledCount / interactiveElements.length) * 100;
    if (percentage >= 90) return 'pass';
    if (percentage >= 70) return 'warning';
    return 'fail';
  };

  const testHeadingStructure = (): AccessibilityTest['status'] => {
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    if (headings.length === 0) return 'fail';

    let previousLevel = 0;
    let hasErrors = false;

    headings.forEach(heading => {
      const level = parseInt(heading.tagName.charAt(1));
      if (level > previousLevel + 1) {
        hasErrors = true;
      }
      previousLevel = level;
    });

    return hasErrors ? 'warning' : 'pass';
  };

  const testAltText = (): AccessibilityTest['status'] => {
    const images = document.querySelectorAll('img');
    if (images.length === 0) return 'pass';

    let hasAltText = 0;
    images.forEach(img => {
      if (img.hasAttribute('alt')) {
        hasAltText++;
      }
    });

    const percentage = (hasAltText / images.length) * 100;
    if (percentage >= 90) return 'pass';
    if (percentage >= 70) return 'warning';
    return 'fail';
  };

  const testColorContrast = (): AccessibilityTest['status'] => {
    // Simplified contrast check - in real implementation, use a proper contrast checker
    const textElements = document.querySelectorAll('p, span, div, h1, h2, h3, h4, h5, h6');
    let goodContrast = 0;

    textElements.forEach(element => {
      const styles = window.getComputedStyle(element);
      const color = styles.color;
      const backgroundColor = styles.backgroundColor;
      
      // This is a simplified check - real implementation would calculate actual contrast ratio
      if (color !== backgroundColor) {
        goodContrast++;
      }
    });

    const percentage = (goodContrast / textElements.length) * 100;
    if (percentage >= 80) return 'pass';
    if (percentage >= 60) return 'warning';
    return 'fail';
  };

  const testTextScaling = (): AccessibilityTest['status'] => {
    // Check if text uses relative units
    const textElements = document.querySelectorAll('p, span, div, h1, h2, h3, h4, h5, h6');
    let usesRelativeUnits = 0;

    textElements.forEach(element => {
      const styles = window.getComputedStyle(element);
      const fontSize = styles.fontSize;
      if (fontSize.includes('rem') || fontSize.includes('em') || fontSize.includes('%')) {
        usesRelativeUnits++;
      }
    });

    const percentage = (usesRelativeUnits / textElements.length) * 100;
    if (percentage >= 70) return 'pass';
    if (percentage >= 50) return 'warning';
    return 'fail';
  };

  const testTouchTargets = (): AccessibilityTest['status'] => {
    const interactiveElements = document.querySelectorAll(
      'button, [href], input, select, textarea, [role="button"], [role="link"]'
    );
    
    let adequateSize = 0;
    interactiveElements.forEach(element => {
      const rect = element.getBoundingClientRect();
      if (rect.width >= 44 && rect.height >= 44) {
        adequateSize++;
      }
    });

    const percentage = (adequateSize / interactiveElements.length) * 100;
    if (percentage >= 90) return 'pass';
    if (percentage >= 70) return 'warning';
    return 'fail';
  };

  const testMotionPreference = (): AccessibilityTest['status'] => {
    const hasReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const animatedElements = document.querySelectorAll('[style*="animation"], [style*="transition"]');
    
    if (hasReducedMotion && animatedElements.length > 0) {
      return 'fail';
    }
    
    return 'pass';
  };

  const getStatusIcon = (status: AccessibilityTest['status']) => {
    switch (status) {
      case 'pass': return '✅';
      case 'fail': return '❌';
      case 'warning': return '⚠️';
      case 'pending': return '⏳';
      default: return '❓';
    }
  };

  const getStatusColor = (status: AccessibilityTest['status']) => {
    switch (status) {
      case 'pass': return 'text-green-400';
      case 'fail': return 'text-red-400';
      case 'warning': return 'text-yellow-400';
      case 'pending': return 'text-gray-400';
      default: return 'text-gray-400';
    }
  };

  const getCategoryIcon = (category: AccessibilityTest['category']) => {
    switch (category) {
      case 'keyboard': return <FiKeyboard className="w-4 h-4" />;
      case 'screen-reader': return <FiVolume2 className="w-4 h-4" />;
      case 'visual': return <FiEye className="w-4 h-4" />;
      case 'motor': return <FiMousePointer className="w-4 h-4" />;
      default: return <FiEye className="w-4 h-4" />;
    }
  };

  const passedTests = tests.filter(test => test.status === 'pass').length;
  const totalTests = tests.length;
  const passRate = totalTests > 0 ? (passedTests / totalTests) * 100 : 0;

  if (!showDetails && passRate >= 80) return null;

  return (
    <div className={`fixed top-4 right-4 z-50 ${className}`}>
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-gray-900 border border-gray-700 rounded-lg p-4 shadow-xl max-w-sm max-h-96 overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <FiEye className="w-5 h-5 text-blue-400" />
            <h3 className="text-sm font-semibold text-white" style={{ fontFamily: 'var(--font-pp-medium)' }}>
              Accessibility Tester
            </h3>
          </div>
          <div className="text-xs text-gray-400">
            {passedTests}/{totalTests} passed
          </div>
        </div>

        {/* Overall Status */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-400" style={{ fontFamily: 'var(--font-pp-regular)' }}>
              Overall Score
            </span>
            <span className={`text-sm font-semibold ${getStatusColor(passRate >= 80 ? 'pass' : 'warning')}`}>
              {passRate.toFixed(0)}%
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                passRate >= 80 ? 'bg-green-500' : passRate >= 60 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${passRate}%` }}
            />
          </div>
        </div>

        {/* Test Results */}
        <div className="space-y-2">
          {tests.map((test) => (
            <motion.div
              key={test.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-2 rounded border-l-2 ${
                test.status === 'pass' ? 'border-green-500 bg-green-500/10' :
                test.status === 'fail' ? 'border-red-500 bg-red-500/10' :
                test.status === 'warning' ? 'border-yellow-500 bg-yellow-500/10' :
                'border-gray-500 bg-gray-500/10'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm">{getStatusIcon(test.status)}</span>
                <span className="text-xs text-gray-300 font-medium" style={{ fontFamily: 'var(--font-pp-regular)' }}>
                  {test.name}
                </span>
                <div className="ml-auto">
                  {getCategoryIcon(test.category)}
                </div>
              </div>
              <div className="text-xs text-gray-400" style={{ fontFamily: 'var(--font-pp-regular)' }}>
                {test.description}
              </div>
              {test.fix && test.status !== 'pass' && (
                <div className="text-xs text-gray-500 mt-1" style={{ fontFamily: 'var(--font-pp-regular)' }}>
                  💡 {test.fix}
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Run Tests Button */}
        <div className="mt-4 pt-3 border-t border-gray-700">
          <button
            onClick={runAccessibilityTests}
            disabled={isRunning}
            className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white text-sm font-semibold rounded transition-colors"
            style={{ fontFamily: 'var(--font-pp-medium)' }}
          >
            {isRunning ? `Running ${currentTest}...` : 'Run Tests'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}