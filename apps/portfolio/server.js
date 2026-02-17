const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { Server } = require('socket.io');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = parseInt(process.env.PORT || '3000', 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

// In-memory session storage
const sessions = new Map();

// Session expiration time (15 minutes)
const SESSION_EXPIRATION_MS = 15 * 60 * 1000;

// Clean up expired sessions periodically
function cleanupExpiredSessions() {
  const now = Date.now();
  for (const [sessionId, session] of sessions.entries()) {
    if (session.expiresAt < now) {
      sessions.delete(sessionId);
      console.log(`[Remote Control] Session ${sessionId} expired and removed`);
    }
  }
}

// Run cleanup every minute
setInterval(cleanupExpiredSessions, 60 * 1000);

app.prepare().then(() => {
  const httpServer = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  const io = new Server(httpServer, {
    cors: {
      origin: dev ? '*' : process.env.NEXT_PUBLIC_SITE_URL,
      methods: ['GET', 'POST'],
    },
    transports: ['websocket', 'polling'],
  });

  io.on('connection', (socket) => {
    console.log(`[Remote Control] Client connected: ${socket.id}`);

    // Desktop creates a new session
    socket.on('session:create', (callback) => {
      const sessionId = generateSessionId();
      const now = Date.now();

      const session = {
        id: sessionId,
        createdAt: now,
        expiresAt: now + SESSION_EXPIRATION_MS,
        desktopSocketId: socket.id,
        phoneSocketId: null,
        isPhoneConnected: false,
      };

      sessions.set(sessionId, session);
      socket.join(`session:${sessionId}`);

      console.log(`[Remote Control] Session created: ${sessionId}`);
      callback({ success: true, session });
    });

    // Phone joins an existing session
    socket.on('session:join', (sessionId, callback) => {
      const session = sessions.get(sessionId);

      if (!session) {
        callback({ success: false, error: 'Session not found or expired' });
        return;
      }

      if (session.expiresAt < Date.now()) {
        sessions.delete(sessionId);
        callback({ success: false, error: 'Session expired' });
        return;
      }

      // Update session with phone socket
      session.phoneSocketId = socket.id;
      session.isPhoneConnected = true;
      sessions.set(sessionId, session);

      socket.join(`session:${sessionId}`);

      // Notify desktop that phone connected
      io.to(session.desktopSocketId).emit('phone:connected', {
        sessionId,
        timestamp: Date.now(),
      });

      console.log(`[Remote Control] Phone joined session: ${sessionId}`);
      callback({ success: true, session });
    });

    // Phone sends a command to desktop
    socket.on('command', (data) => {
      const { sessionId, command } = data;
      const session = sessions.get(sessionId);

      if (!session || !session.desktopSocketId) {
        console.log(`[Remote Control] Command failed - invalid session: ${sessionId}`);
        return;
      }

      // Forward command to desktop
      io.to(session.desktopSocketId).emit('command', command);
      console.log(`[Remote Control] Command forwarded: ${command.type}`);
    });

    // Desktop sends state updates to phone
    socket.on('desktop:state', (data) => {
      const { sessionId, event } = data;
      const session = sessions.get(sessionId);

      if (!session || !session.phoneSocketId) {
        return;
      }

      // Forward state to phone
      io.to(session.phoneSocketId).emit('desktop:state', event);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`[Remote Control] Client disconnected: ${socket.id}`);

      // Find and update any sessions this socket was part of
      for (const [sessionId, session] of sessions.entries()) {
        if (session.desktopSocketId === socket.id) {
          // Desktop disconnected - notify phone and remove session
          if (session.phoneSocketId) {
            io.to(session.phoneSocketId).emit('desktop:disconnected');
          }
          sessions.delete(sessionId);
          console.log(`[Remote Control] Desktop disconnected, session ${sessionId} removed`);
        } else if (session.phoneSocketId === socket.id) {
          // Phone disconnected - notify desktop
          session.phoneSocketId = null;
          session.isPhoneConnected = false;
          sessions.set(sessionId, session);

          if (session.desktopSocketId) {
            io.to(session.desktopSocketId).emit('phone:disconnected');
          }
          console.log(`[Remote Control] Phone disconnected from session ${sessionId}`);
        }
      }
    });
  });

  httpServer.listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
    console.log(`> Remote Control WebSocket server running`);
  });
});

// Generate a short, readable session ID
function generateSessionId() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
