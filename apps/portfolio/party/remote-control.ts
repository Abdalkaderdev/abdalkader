import type * as Party from "partykit/server";

// Types for remote control
interface RemoteCommand {
  type: 'SCROLL' | 'SWIPE' | 'NAVIGATE' | 'TOGGLE_MENU';
  payload?: {
    direction?: 'up' | 'down';
    delta?: number;
    swipeDirection?: 'up' | 'down' | 'left' | 'right';
    swipeVelocity?: number;
    path?: string;
  };
}

interface DesktopState {
  type: 'CURRENT_ROUTE' | 'MENU_STATE' | 'SCROLL_POSITION';
  payload: Record<string, unknown>;
  timestamp: number;
}

interface ConnectionMessage {
  type: 'desktop:connect' | 'phone:connect' | 'command' | 'desktop:state';
  data?: RemoteCommand | DesktopState;
}

export default class RemoteControlServer implements Party.Server {
  constructor(readonly room: Party.Room) {}

  // Track connected clients
  desktopConnection: Party.Connection | null = null;
  phoneConnection: Party.Connection | null = null;
  currentRoute: string = '/';
  menuOpen: boolean = false;

  onConnect(conn: Party.Connection, ctx: Party.ConnectionContext) {
    // New connection - wait for identification message
    console.log(`[RemoteControl] New connection: ${conn.id}`);
  }

  onMessage(message: string, sender: Party.Connection) {
    try {
      const parsed = JSON.parse(message) as ConnectionMessage;

      switch (parsed.type) {
        case 'desktop:connect':
          this.desktopConnection = sender;
          // Notify phone if already connected
          if (this.phoneConnection) {
            this.phoneConnection.send(JSON.stringify({ type: 'desktop:connected' }));
          }
          // Confirm desktop connection
          sender.send(JSON.stringify({
            type: 'connected',
            role: 'desktop',
            phoneConnected: !!this.phoneConnection
          }));
          console.log(`[RemoteControl] Desktop connected: ${sender.id}`);
          break;

        case 'phone:connect':
          this.phoneConnection = sender;
          // Notify desktop if already connected
          if (this.desktopConnection) {
            this.desktopConnection.send(JSON.stringify({ type: 'phone:connected' }));
          }
          // Send current state to phone
          sender.send(JSON.stringify({
            type: 'connected',
            role: 'phone',
            desktopConnected: !!this.desktopConnection,
            currentRoute: this.currentRoute,
            menuOpen: this.menuOpen
          }));
          console.log(`[RemoteControl] Phone connected: ${sender.id}`);
          break;

        case 'command':
          // Phone sending command to desktop
          if (this.desktopConnection && parsed.data) {
            this.desktopConnection.send(JSON.stringify({
              type: 'command',
              data: parsed.data
            }));
          }
          break;

        case 'desktop:state':
          // Desktop sending state update to phone
          if (parsed.data) {
            const state = parsed.data as DesktopState;
            if (state.type === 'CURRENT_ROUTE' && state.payload.route) {
              this.currentRoute = state.payload.route as string;
            }
            if (state.type === 'MENU_STATE' && typeof state.payload.menuOpen === 'boolean') {
              this.menuOpen = state.payload.menuOpen;
            }
          }
          if (this.phoneConnection && parsed.data) {
            this.phoneConnection.send(JSON.stringify({
              type: 'desktop:state',
              data: parsed.data
            }));
          }
          break;
      }
    } catch (error) {
      console.error('[RemoteControl] Error parsing message:', error);
    }
  }

  onClose(conn: Party.Connection) {
    if (conn === this.desktopConnection) {
      this.desktopConnection = null;
      // Notify phone that desktop disconnected
      if (this.phoneConnection) {
        this.phoneConnection.send(JSON.stringify({ type: 'desktop:disconnected' }));
      }
      console.log(`[RemoteControl] Desktop disconnected: ${conn.id}`);
    }
    if (conn === this.phoneConnection) {
      this.phoneConnection = null;
      // Notify desktop that phone disconnected
      if (this.desktopConnection) {
        this.desktopConnection.send(JSON.stringify({ type: 'phone:disconnected' }));
      }
      console.log(`[RemoteControl] Phone disconnected: ${conn.id}`);
    }
  }

  onError(conn: Party.Connection, error: Error) {
    console.error(`[RemoteControl] Connection error for ${conn.id}:`, error);
  }
}

RemoteControlServer satisfies Party.Worker;
