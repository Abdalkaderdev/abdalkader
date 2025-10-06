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
}

export function Container({ children, size = 'lg' }: ContainerProps) {
  return (
    <div className={`container container--${size}`}>
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
}

export function Stack({ 
  children, 
  direction = 'column', 
  gap = 'md',
  align = 'stretch',
  justify = 'start'
}: StackProps) {
  return (
    <div 
      className={`stack stack--${direction} stack--gap-${gap} stack--align-${align} stack--justify-${justify}`}
    >
      {children}
    </div>
  );
}
