import { useState, useEffect, useCallback, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { RemoteCommand, RemoteCommandType, DesktopEvent, RemoteSession } from '@/types/remote-control';

interface UsePhoneControllerOptions {
  sessionId: string;
  onDesktopState?: (event: DesktopEvent) => void;
}

interface UsePhoneControllerReturn {
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  currentRoute: string;
  menuOpen: boolean;
  sendCommand: (type: RemoteCommandType, payload?: RemoteCommand['payload']) => void;
  disconnect: () => void;
}

export function usePhoneController({
  sessionId,
  onDesktopState
}: UsePhoneControllerOptions): UsePhoneControllerReturn {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentRoute, setCurrentRoute] = useState('/');
  const [menuOpen, setMenuOpen] = useState(false);

  // Send command to desktop
  const sendCommand = useCallback((
    type: RemoteCommandType,
    payload?: RemoteCommand['payload']
  ) => {
    if (!socketRef.current || !isConnected) return;

    const command: RemoteCommand = {
      type,
      payload,
      timestamp: Date.now(),
    };

    socketRef.current.emit('command', {
      sessionId,
      command,
    });

    // Haptic feedback if available
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(10);
    }
  }, [sessionId, isConnected]);

  // Disconnect from session
  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
    setIsConnected(false);
  }, []);

  // Connect to session
  useEffect(() => {
    if (!sessionId) return;

    setIsConnecting(true);
    setError(null);

    const socket = io(window.location.origin, {
      transports: ['websocket', 'polling'],
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      socket.emit('session:join', sessionId, (response: {
        success: boolean;
        session?: RemoteSession;
        error?: string
      }) => {
        if (response.success) {
          setIsConnected(true);
          setIsConnecting(false);
        } else {
          setError(response.error || 'Failed to join session');
          setIsConnecting(false);
        }
      });
    });

    socket.on('desktop:state', (event: DesktopEvent) => {
      onDesktopState?.(event);

      switch (event.type) {
        case 'CURRENT_ROUTE':
          if (event.payload?.route) {
            setCurrentRoute(event.payload.route);
          }
          break;
        case 'MENU_STATE':
          if (typeof event.payload?.menuOpen === 'boolean') {
            setMenuOpen(event.payload.menuOpen);
          }
          break;
      }
    });

    socket.on('desktop:disconnected', () => {
      setError('Desktop disconnected');
      setIsConnected(false);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('connect_error', () => {
      setError('Failed to connect to server');
      setIsConnecting(false);
    });

    return () => {
      socket.disconnect();
    };
  }, [sessionId, onDesktopState]);

  return {
    isConnected,
    isConnecting,
    error,
    currentRoute,
    menuOpen,
    sendCommand,
    disconnect,
  };
}
