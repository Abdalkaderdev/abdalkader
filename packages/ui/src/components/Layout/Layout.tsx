import React from 'react';
import './Layout.css';

interface LayoutProps {
  children: React.ReactNode;
  variant?: 'default' | 'centered' | 'wide';
}

export function Layout({ children, variant = 'default' }: LayoutProps) {
  return (
    <div className={`layout layout--${variant}`}>
      {children}
    </div>
  );
}

interface ContainerProps {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  className?: string;
}

export function Container({ children, size = 'lg', className = '' }: ContainerProps) {
  return (
    <div className={`container container--${size} ${className}`.trim()}>
      {children}
    </div>
  );
}

interface StackProps {
  children: React.ReactNode;
  direction?: 'row' | 'column';
  gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around';
  className?: string;
  wrap?: boolean;
}

export function Stack({ 
  children, 
  direction = 'column', 
  gap = 'md',
  align = 'stretch',
  justify = 'start',
  className = '',
  wrap = false
}: StackProps) {
  return (
    <div 
      className={`stack stack--${direction} stack--gap-${gap} stack--align-${align} stack--justify-${justify} ${wrap ? 'stack--wrap' : ''} ${className}`.trim()}
    >
      {children}
    </div>
  );
}

interface GridProps {
  children: React.ReactNode;
  columns?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
  gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  responsive?: {
    mobile?: 1 | 2;
    tablet?: 1 | 2 | 3 | 4;
    desktop?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
  };
}

export function Grid({ 
  children, 
  columns = 3, 
  gap = 'md',
  className = '',
  responsive
}: GridProps) {
  const gridClass = responsive 
    ? `grid grid--responsive grid--gap-${gap}`
    : `grid grid--cols-${columns} grid--gap-${gap}`;
  
  const style = responsive ? {
    '--grid-cols-mobile': responsive.mobile || 1,
    '--grid-cols-tablet': responsive.tablet || 2,
    '--grid-cols-desktop': responsive.desktop || columns,
  } as React.CSSProperties : undefined;

  return (
    <div className={`${gridClass} ${className}`.trim()} style={style}>
      {children}
    </div>
  );
}

interface SectionProps {
  children: React.ReactNode;
  variant?: 'default' | 'narrow' | 'wide' | 'full';
  spacing?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  id?: string;
  background?: 'default' | 'secondary' | 'tertiary';
}

export function Section({ 
  children, 
  variant = 'default',
  spacing = 'lg',
  className = '',
  id,
  background = 'default'
}: SectionProps) {
  return (
    <section 
      id={id}
      className={`section section--${variant} section--spacing-${spacing} section--bg-${background} ${className}`.trim()}
    >
      {children}
    </section>
  );
}
