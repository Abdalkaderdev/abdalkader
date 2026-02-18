// Remote Control Types for Phone-to-Desktop WebSocket communication

import { NAVIGATION_LINKS, NavigationPath } from '@/data/navigation';

export type RemoteCommandType =
  | 'SCROLL'
  | 'NAVIGATE'
  | 'TOGGLE_MENU'
  | 'SWIPE';

export type DesktopEventType =
  | 'CONNECTED'
  | 'CURRENT_ROUTE'
  | 'MENU_STATE'
  | 'SCROLL_POSITION';

export interface RemoteCommand {
  type: RemoteCommandType;
  payload?: {
    direction?: 'up' | 'down';
    delta?: number;
    path?: string;
    swipeDirection?: 'up' | 'down' | 'left' | 'right';
    swipeVelocity?: number;
  };
  timestamp: number;
}

export interface DesktopEvent {
  type: DesktopEventType;
  payload?: {
    route?: string;
    menuOpen?: boolean;
    scrollY?: number;
    scrollProgress?: number;
  };
  timestamp: number;
}

export interface RemoteSession {
  id: string;
  createdAt: number;
  expiresAt: number;
  desktopSocketId?: string;
  phoneSocketId?: string;
  isPhoneConnected: boolean;
}

// Re-export navigation for backward compatibility
export { NAVIGATION_LINKS, type NavigationPath };

// Session expiration time (15 minutes)
export const SESSION_EXPIRATION_MS = 15 * 60 * 1000;
