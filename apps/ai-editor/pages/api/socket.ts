import { NextApiRequest, NextApiResponse } from 'next';
import { Server as ServerIO } from 'socket.io';
import { Server as NetServer } from 'http';

export const config = {
  api: {
    bodyParser: false,
  },
};

interface SocketServer extends NetServer {
  io?: ServerIO;
}

interface SocketResponse extends NextApiResponse {
  socket: NextApiResponse['socket'] & {
    server: SocketServer;
  };
}

const SocketHandler = (req: NextApiRequest, res: SocketResponse) => {
  if (res.socket.server.io) {
    console.log('Socket is already running');
    res.end();
    return;
  }

  console.log('Socket is initializing');
  const io = new ServerIO(res.socket.server, {
    path: '/api/socket',
    addTrailingSlash: false,
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  res.socket.server.io = io;

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    // Join a room for code collaboration
    socket.on('join-room', (roomId: string) => {
      socket.join(roomId);
      console.log(`Client ${socket.id} joined room ${roomId}`);
    });

    // Handle code updates
    socket.on('code-update', (data: { roomId: string; code: string; timestamp: number }) => {
      socket.to(data.roomId).emit('code-changed', {
        code: data.code,
        timestamp: data.timestamp,
        from: socket.id
      });
    });

    // Handle preview updates
    socket.on('preview-update', (data: { roomId: string; previewData: any }) => {
      socket.to(data.roomId).emit('preview-changed', {
        previewData: data.previewData,
        from: socket.id
      });
    });

    // Handle cursor position updates
    socket.on('cursor-update', (data: { roomId: string; position: any; selection: any }) => {
      socket.to(data.roomId).emit('cursor-changed', {
        position: data.position,
        selection: data.selection,
        from: socket.id
      });
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  res.end();
};

export default SocketHandler;