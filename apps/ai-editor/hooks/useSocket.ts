import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface UseSocketOptions {
  roomId?: string;
  onCodeChange?: (data: { code: string; timestamp: number; from: string }) => void;
  onPreviewChange?: (data: { previewData: any; from: string }) => void;
  onCursorChange?: (data: { position: any; selection: any; from: string }) => void;
}

export function useSocket({
  roomId,
  onCodeChange,
  onPreviewChange,
  onCursorChange
}: UseSocketOptions = {}) {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectedUsers, setConnectedUsers] = useState<string[]>([]);

  useEffect(() => {
    // Initialize socket connection
    const socketInitializer = async () => {
      await fetch('/api/socket');
      
      const socket = io({
        path: '/api/socket',
        addTrailingSlash: false,
      });

      socketRef.current = socket;

      socket.on('connect', () => {
        console.log('Connected to socket server');
        setIsConnected(true);
        
        // Join room if provided
        if (roomId) {
          socket.emit('join-room', roomId);
        }
      });

      socket.on('disconnect', () => {
        console.log('Disconnected from socket server');
        setIsConnected(false);
      });

      // Handle code changes from other users
      socket.on('code-changed', (data: { code: string; timestamp: number; from: string }) => {
        onCodeChange?.(data);
      });

      // Handle preview changes from other users
      socket.on('preview-changed', (data: { previewData: any; from: string }) => {
        onPreviewChange?.(data);
      });

      // Handle cursor changes from other users
      socket.on('cursor-changed', (data: { position: any; selection: any; from: string }) => {
        onCursorChange?.(data);
      });

      // Handle user list updates
      socket.on('users-updated', (users: string[]) => {
        setConnectedUsers(users);
      });
    };

    socketInitializer();

    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [roomId, onCodeChange, onPreviewChange, onCursorChange]);

  const emitCodeUpdate = (code: string) => {
    if (socketRef.current && roomId) {
      socketRef.current.emit('code-update', {
        roomId,
        code,
        timestamp: Date.now()
      });
    }
  };

  const emitPreviewUpdate = (previewData: any) => {
    if (socketRef.current && roomId) {
      socketRef.current.emit('preview-update', {
        roomId,
        previewData
      });
    }
  };

  const emitCursorUpdate = (position: any, selection: any) => {
    if (socketRef.current && roomId) {
      socketRef.current.emit('cursor-update', {
        roomId,
        position,
        selection
      });
    }
  };

  const joinRoom = (newRoomId: string) => {
    if (socketRef.current) {
      socketRef.current.emit('join-room', newRoomId);
    }
  };

  return {
    socket: socketRef.current,
    isConnected,
    connectedUsers,
    emitCodeUpdate,
    emitPreviewUpdate,
    emitCursorUpdate,
    joinRoom
  };
}