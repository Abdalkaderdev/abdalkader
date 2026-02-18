import { useState, useEffect, useCallback, useRef } from 'react';
import PartySocket from 'partysocket';
import { RemoteCommand, RemoteCommandType, DesktopEvent } from '@/types/remote-control';

// PartyKit host - use environment variable or default
const PARTYKIT_HOST = process.env.NEXT_PUBLIC_PARTYKIT_HOST || 'abdalkader-remote-control.abdalkaderdev.partykit.dev';

interface UsePhoneControllerOptions {
  sessionId: string;
  onDesktopState?: (event: DesktopEvent) => void;
}

interface UsePhoneControllerReturn {
  isConnected: boolean;
  isDesktopConnected: boolean;
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
  const socketRef = useRef<PartySocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isDesktopConnected, setIsDesktopConnected] = useState(false);
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

    socketRef.current.send(JSON.stringify({
      type: 'command',
      data: command,
    }));

    // Haptic feedback if available
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(10);
    }
  }, [isConnected]);

  // Disconnect from session
  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
    }
    setIsConnected(false);
    setIsDesktopConnected(false);
  }, []);

  // Connect to session
  useEffect(() => {
    if (!sessionId) return;

    setIsConnecting(true);
    setError(null);

    try {
      const socket = new PartySocket({
        host: PARTYKIT_HOST,
        room: sessionId,
      });

      socketRef.current = socket;

      socket.addEventListener('open', () => {
        // Identify as phone controller
        socket.send(JSON.stringify({ type: 'phone:connect' }));
      });

      socket.addEventListener('message', (event) => {
        try {
          const message = JSON.parse(event.data);

          switch (message.type) {
            case 'connected':
              if (message.role === 'phone') {
                setIsConnected(true);
                setIsConnecting(false);
                setIsDesktopConnected(message.desktopConnected || false);
                if (message.currentRoute) {
                  setCurrentRoute(message.currentRoute);
                }
                if (typeof message.menuOpen === 'boolean') {
                  setMenuOpen(message.menuOpen);
                }
              }
              break;

            case 'desktop:connected':
              setIsDesktopConnected(true);
              break;

            case 'desktop:disconnected':
              setIsDesktopConnected(false);
              setError('Desktop disconnected');
              break;

            case 'desktop:state':
              if (message.data) {
                const event = message.data as DesktopEvent;
                onDesktopState?.(event);

                switch (event.type) {
                  case 'CURRENT_ROUTE':
                    if (event.payload?.route) {
                      setCurrentRoute(event.payload.route as string);
                    }
                    break;
                  case 'MENU_STATE':
                    if (typeof event.payload?.menuOpen === 'boolean') {
                      setMenuOpen(event.payload.menuOpen);
                    }
                    break;
                }
              }
              break;
          }
        } catch (err) {
          console.error('[PhoneController] Error parsing message:', err);
        }
      });

      socket.addEventListener('close', () => {
        setIsConnected(false);
        setIsDesktopConnected(false);
      });

      socket.addEventListener('error', () => {
        setError('Failed to connect to server');
        setIsConnecting(false);
      });

      return () => {
        socket.close();
      };
    } catch (err) {
      setError('Failed to initialize connection');
      setIsConnecting(false);
    }
  }, [sessionId, onDesktopState]);

  return {
    isConnected,
    isDesktopConnected,
    isConnecting,
    error,
    currentRoute,
    menuOpen,
    sendCommand,
    disconnect,
  };
}
