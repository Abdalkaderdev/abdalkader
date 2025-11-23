import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme, ColorScheme, Theme } from '../../contexts/ThemeContext';
import { Button, Card, Modal, Select } from '../index';
import { Switch } from '../Switch/Switch';
import { Settings, Palette, Moon, Sun, Monitor } from 'lucide-react';

export interface ThemePreferencesProps {
  isOpen: boolean;
  onClose: () => void;
}

const colorSchemes: { value: ColorScheme; label: string; preview: string }[] = [
  { value: 'portfolio', label: 'Portfolio Orange', preview: '#f44e00' },
  { value: 'blue', label: 'Ocean Blue', preview: '#3b82f6' },
  { value: 'green', label: 'Forest Green', preview: '#10b981' },
  { value: 'purple', label: 'Royal Purple', preview: '#8b5cf6' },
];

const themes: { value: Theme; label: string; icon: React.ReactNode }[] = [
  { value: 'dark', label: 'Dark', icon: <Moon size={16} /> },
  { value: 'light', label: 'Light', icon: <Sun size={16} /> },
  { value: 'auto', label: 'Auto', icon: <Monitor size={16} /> },
];

const fontSizes: { value: 'small' | 'medium' | 'large'; label: string; size: string }[] = [
  { value: 'small', label: 'Small', size: '14px' },
  { value: 'medium', label: 'Medium', size: '16px' },
  { value: 'large', label: 'Large', size: '18px' },
];

export const ThemePreferences: React.FC<ThemePreferencesProps> = ({ isOpen, onClose }) => {
  const { preferences, updatePreferences, resetPreferences } = useTheme();

  const handleThemeChange = (value: Theme) => {
    updatePreferences({ theme: value });
  };

  const handleColorSchemeChange = (value: ColorScheme) => {
    updatePreferences({ colorScheme: value });
  };

  const handleFontSizeChange = (value: 'small' | 'medium' | 'large') => {
    updatePreferences({ fontSize: value });
  };

  const handleAnimationsToggle = (enabled: boolean) => {
    updatePreferences({ animationsEnabled: enabled });
  };

  const handleReducedMotionToggle = (reduced: boolean) => {
    updatePreferences({ reducedMotion: reduced });
  };

  const handleReset = () => {
    resetPreferences();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Modal
          isOpen={isOpen}
          onClose={onClose}
          title="Theme Preferences"
          size="md"
        >
          <div className="theme-preferences" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* Theme Selection */}
            <Card>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Palette size={18} />
                Theme Mode
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                {themes.map((theme) => (
                  <Button
                    key={theme.value}
                    variant={preferences.theme === theme.value ? 'primary' : 'ghost'}
                    onClick={() => handleThemeChange(theme.value)}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}
                  >
                    {theme.icon}
                    {theme.label}
                  </Button>
                ))}
              </div>
            </Card>

            {/* Color Scheme */}
            <Card>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Palette size={18} />
                Color Scheme
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
                {colorSchemes.map((scheme) => (
                  <motion.div
                    key={scheme.value}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`color-scheme-option ${preferences.colorScheme === scheme.value ? 'active' : ''}`}
                    onClick={() => handleColorSchemeChange(scheme.value)}
                    style={{
                      padding: '0.75rem',
                      border: `2px solid ${preferences.colorScheme === scheme.value ? scheme.preview : 'var(--border-color, #374151)'}`,
                      borderRadius: '8px',
                      cursor: 'pointer',
                      background: 'var(--background-secondary, #111)',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div
                        style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          background: scheme.preview,
                          border: '2px solid var(--border-color, #374151)',
                        }}
                      />
                      <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{scheme.label}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>

            {/* Font Size */}
            <Card>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem' }}>Font Size</h3>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {fontSizes.map((size) => (
                  <Button
                    key={size.value}
                    variant={preferences.fontSize === size.value ? 'primary' : 'ghost'}
                    onClick={() => handleFontSizeChange(size.value)}
                    style={{ fontSize: size.size }}
                  >
                    {size.label}
                  </Button>
                ))}
              </div>
            </Card>

            {/* Accessibility Options */}
            <Card>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem' }}>Accessibility</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontWeight: 500 }}>Enable Animations</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary, #787878)' }}>
                      Allow smooth transitions and micro-interactions
                    </div>
                  </div>
                  <Switch
                    checked={preferences.animationsEnabled}
                    onChange={handleAnimationsToggle}
                  />
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontWeight: 500 }}>Reduced Motion</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary, #787878)' }}>
                      Minimize animations for users with motion sensitivity
                    </div>
                  </div>
                  <Switch
                    checked={preferences.reducedMotion}
                    onChange={handleReducedMotionToggle}
                  />
                </div>
              </div>
            </Card>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', paddingTop: '1rem', borderTop: '1px solid var(--border-color, #374151)' }}>
              <Button variant="ghost" onClick={handleReset}>
                Reset to Defaults
              </Button>
              <Button variant="primary" onClick={onClose}>
                Apply Changes
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </AnimatePresence>
  );
};

// Theme toggle button component
export const ThemeToggleButton: React.FC = () => {
  const { preferences, updatePreferences } = useTheme();
  const [isOpen, setIsOpen] = React.useState(false);

  const handleThemeToggle = () => {
    const nextTheme = preferences.theme === 'dark' ? 'light' : preferences.theme === 'light' ? 'auto' : 'dark';
    updatePreferences({ theme: nextTheme });
  };

  return (
    <>
      <Button
        variant="ghost"
        onClick={handleThemeToggle}
        style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
        }}
      >
        {preferences.theme === 'dark' ? <Sun size={20} /> : preferences.theme === 'light' ? <Moon size={20} /> : <Monitor size={20} />}
      </Button>

      <Button
        variant="ghost"
        onClick={() => setIsOpen(true)}
        style={{
          position: 'fixed',
          bottom: '2rem',
          right: '5rem',
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
        }}
      >
        <Settings size={18} />
      </Button>

      <ThemePreferences isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};
