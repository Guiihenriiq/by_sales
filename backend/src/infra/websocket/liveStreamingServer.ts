import { WebSocketServer, WebSocket } from 'ws';
import { Server } from 'http';

interface LiveRoom {
  liveId: string;
  streamer?: WebSocket;
  viewers: Map<string, WebSocket>;
  chatMessages: any[];
}

export class LiveStreamingServer {
  private wss: WebSocketServer;
  private rooms: Map<string, LiveRoom> = new Map();

  constructor(server: Server) {
    this.wss = new WebSocketServer({ server });
    this.wss.on('connection', this.handleConnection.bind(this));
  }

  private handleConnection(ws: WebSocket, request: any) {
    const url = new URL(request.url, `http://${request.headers.host}`);
    const liveId = url.searchParams.get('liveId');
    const isStreamer = url.searchParams.get('streamer') === 'true';
    
    if (!liveId) {
      ws.close();
      return;
    }

    if (!this.rooms.has(liveId)) {
      this.rooms.set(liveId, {
        liveId,
        viewers: new Map(),
        chatMessages: []
      });
    }

    const room = this.rooms.get(liveId)!;
    const viewerId = this.generateId();

    if (isStreamer) {
      room.streamer = ws;
    } else {
      room.viewers.set(viewerId, ws);
    }

    ws.on('message', (data) => {
      const message = JSON.parse(data.toString());
      this.handleMessage(room, ws, message, viewerId, isStreamer);
    });

    ws.on('close', () => {
      if (isStreamer) {
        room.streamer = undefined;
      } else {
        room.viewers.delete(viewerId);
      }
    });
  }

  private handleMessage(room: LiveRoom, ws: WebSocket, message: any, viewerId: string, isStreamer: boolean) {
    switch (message.type) {
      case 'chat-message':
        room.chatMessages.push(message.message);
        this.broadcast(room, message);
        break;
      case 'webrtc-offer':
      case 'webrtc-answer':
      case 'ice-candidate':
        if (isStreamer) {
          room.viewers.forEach(viewer => this.send(viewer, message));
        } else if (room.streamer) {
          this.send(room.streamer, { ...message, viewerId });
        }
        break;
    }
  }

  private broadcast(room: LiveRoom, message: any) {
    if (room.streamer) this.send(room.streamer, message);
    room.viewers.forEach(viewer => this.send(viewer, message));
  }

  private send(ws: WebSocket, message: any) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message));
    }
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}