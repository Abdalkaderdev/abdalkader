import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useRouter } from 'next/router';
import { RemoteCommand, RemoteSession, DesktopEvent, SESSION_EXPIRATION_MS } from '@/types/remote-control';

interface RemoteControlContextType {
  session: RemoteSession | null;
  isPhoneConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  createSession: () => Promise<void>;
  destroySession: () => void;
  getControllerUrl: () => string;
  timeRemaining: number;
  setMenuOpen: (open: boolean) => void;
  menuOpen: boolean;
}

const RemoteControlContext = createContext<RemoteControlContextType | null>(null);

export function RemoteControlProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const socketRef = useRef<Socket | null>(null);
  const [session, setSession] = useState<RemoteSession | null>(null);
  const [isPhoneConnected, setIsPhoneConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [menuOpen, setMenuOpenState] = useState(false);
  const menuOpenRef = useRef(false);

  // Get Lenis instance for smooth scrolling
  const getLenis = useCallback(() => {
    if (typeof window !== 'undefined') {
      // @ts-expect-error - Lenis is attached to window
      return window.lenis;
    }
    return null;
  }, []);

  // Handle incoming commands from phone
  const handleCommand = useCallback((command: RemoteCommand) => {
    const lenis = getLenis();

    switch (command.type) {
      case 'SCROLL':
        if (command.payload?.direction === 'up') {
          lenis?.scrollTo(window.scrollY - (command.payload.delta || 300), { duration: 0.5 });
        } else if (command.payload?.direction === 'down') {
          lenis?.scrollTo(window.scrollY + (command.payload.delta || 300), { duration: 0.5 });
        }
        break;

      case 'SWIPE':
        if (command.payload?.swipeDirection === 'up' || command.payload?.swipeDirection === 'down') {
          const velocity = command.payload.swipeVelocity || 1;
          const delta = velocity * 500;
          const direction = command.payload.swipeDirection === 'up' ? -1 : 1;
          lenis?.scrollTo(window.scrollY + (delta * direction), { duration: 0.8 });
        }
        break;

      case 'NAVIGATE':
        if (command.payload?.path) {
          router.push(command.payload.path);
        }
        break;

      case 'TOGGLE_MENU':
        setMenuOpenState(prev => !prev);
        menuOpenRef.current = !menuOpenRef.current;
        break;
    }
  }, [getLenis, router]);

  // Send desktop state to phone
  const sendDesktopState = useCallback((event: DesktopEvent) => {
    if (socketRef.current && session) {
      socketRef.current.emit('desktop:state', {
        sessionId: session.id,
        event,
      });
    }
  }, [session]);

  // Create a new session
  const createSession = useCallback(async () => {
    if (socketRef.current) return;

    setIsConnecting(true);
    setError(null);

    try {
      const socket = io(window.location.origin, {
        transports: ['websocket', 'polling'],
      });

      socketRef.current = socket;

      socket.on('connect', () => {
        socket.emit('session:create', (response: { success: boolean; session?: RemoteSession; error?: string }) => {
          if (response.success && response.session) {
            setSession(response.session);
            setTimeRemaining(SESSION_EXPIRATION_MS);
            setIsConnecting(false);

            // Send initial state
            sendDesktopState({
              type: 'CURRENT_ROUTE',
              payload: { route: router.asPath },
              timestamp: Date.now(),
            });
          } else {
            setError(response.error || 'Failed to create session');
            setIsConnecting(false);
          }
        });
      });

      socket.on('phone:connected', () => {
        setIsPhoneConnected(true);
      });

      socket.on('phone:disconnected', () => {
        setIsPhoneConnected(false);
      });

      socket.on('command', handleCommand);

      socket.on('disconnect', () => {
        setSession(null);
        setIsPhoneConnected(false);
      });

      socket.on('connect_error', () => {
        setError('Failed to connect to server');
        setIsConnecting(false);
      });
    } catch (err) {
      setError('Failed to initialize connection');
      setIsConnecting(false);
    }
  }, [handleCommand, router.asPath, sendDesktopState]);

  // Destroy session
  const destroySession = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
    setSession(null);
    setIsPhoneConnected(false);
    setTimeRemaining(0);
  }, []);

  // Get controller URL
  const getControllerUrl = useCallback(() => {
    if (!session) return '';
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    return `${baseUrl}/controller/${session.id}`;
  }, [session]);

  // Update menu state
  const setMenuOpen = useCallback((open: boolean) => {
    setMenuOpenState(open);
    menuOpenRef.current = open;
    sendDesktopState({
      type: 'MENU_STATE',
      payload: { menuOpen: open },
      timestamp: Date.now(),
    });
  }, [sendDesktopState]);

  // Update time remaining
  useEffect(() => {
    if (!session) return;

    const interval = setInterval(() => {
      const remaining = session.expiresAt - Date.now();
      if (remaining <= 0) {
        destroySession();
      } else {
        setTimeRemaining(remaining);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [session, destroySession]);

  // Send route updates to phone
  useEffect(() => {
    if (session && isPhoneConnected) {
      sendDesktopState({
        type: 'CURRENT_ROUTE',
        payload: { route: router.asPath },
        timestamp: Date.now(),
      });
    }
  }, [router.asPath, session, isPhoneConnected, sendDesktopState]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  return (
    <RemoteControlContext.Provider
      value={{
        session,
        isPhoneConnected,
        isConnecting,
        error,
        createSession,
        destroySession,
        getControllerUrl,
        timeRemaining,
        setMenuOpen,
        menuOpen,
      }}
    >
      {children}
    </RemoteControlContext.Provider>
  );
}

export function useRemoteControl() {
  const context = useContext(RemoteControlContext);
  if (!context) {
    throw new Error('useRemoteControl must be used within a RemoteControlProvider');
  }
  return context;
}
