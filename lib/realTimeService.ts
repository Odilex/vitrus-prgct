"use client";

import { io, Socket } from 'socket.io-client';
import { toast } from 'sonner';

type RealTimeEventHandler = (data: unknown) => void;

interface RealTimeEvents {
  // Connection events
  connected: (data: { message: string; userId: string; timestamp: string }) => void;
  error: (data: { message: string }) => void;
  
  // Property events
  property_updated: (data: {
    eventType: string;
    propertyId: string;
    property: Record<string, unknown>;
    oldProperty?: Record<string, unknown>;
    timestamp: string;
  }) => void;
  property_viewed: (data: {
    propertyId: string;
    viewerId: string;
    viewerName: string;
    timestamp: string;
  }) => void;
  view_count_updated: (data: {
    propertyId: string;
    timestamp: string;
  }) => void;
  
  // Tour events
  tour_updated: (data: {
    eventType: string;
    tourId: string;
    tour: Record<string, unknown>;
    oldTour?: Record<string, unknown>;
    timestamp: string;
  }) => void;
  tour_status_updated: (data: {
    tourId: string;
    status: string;
    notes?: string;
    updatedBy: string;
    updatedByName: string;
    timestamp: string;
  }) => void;
  
  // Notification events
  new_notification: (data: {
    notification: Record<string, unknown>;
    timestamp: string;
  }) => void;
  pending_notifications: (data: {
    notifications: Record<string, unknown>[];
    count: number;
  }) => void;
  notification_marked_read: (data: { notificationId: string }) => void;
  
  // Room events
  joined_property_room: (data: { propertyId: string }) => void;
  left_property_room: (data: { propertyId: string }) => void;
  joined_tour_room: (data: { tourId: string }) => void;
  left_tour_room: (data: { tourId: string }) => void;
  joined_chat_room: (data: { roomId: string }) => void;
  
  // Chat events
  new_message: (data: {
    id: string;
    roomId: string;
    message: string;
    messageType: string;
    senderId: string;
    senderName: string;
    timestamp: string;
  }) => void;
}

class RealTimeService {
  private socket: Socket | null = null;
  private eventHandlers: Map<keyof RealTimeEvents, Set<RealTimeEventHandler>> = new Map();
  private isConnected = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private authToken: string | null = null;
  private userId: string | null = null;

  constructor() {
    this.setupEventHandlers();
  }

  // Initialize connection with authentication token
  connect(token: string, userId: string) {
    if (this.socket?.connected) {
      console.log('Already connected to real-time service');
      return;
    }

    this.authToken = token;
    this.userId = userId;

    const serverUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    
    this.socket = io(serverUrl, {
      auth: {
        token: token
      },
      transports: ['websocket', 'polling'],
      timeout: 20000,
      forceNew: true
    });

    this.setupSocketEventListeners();
  }

  // Disconnect from the server
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      this.authToken = null;
      this.userId = null;
      console.log('Disconnected from real-time service');
    }
  }

  // Setup socket event listeners
  private setupSocketEventListeners() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      this.isConnected = true;
      this.reconnectAttempts = 0;
      console.log('Connected to real-time service');
      toast.success('Connected to real-time updates');
    });

    this.socket.on('disconnect', (reason) => {
      this.isConnected = false;
      console.log('Disconnected from real-time service:', reason);
      
      if (reason === 'io server disconnect') {
        // Server disconnected, try to reconnect
        this.handleReconnection();
      }
    });

    this.socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      this.handleReconnection();
    });

    // Setup event forwarding
    Object.keys(this.getDefaultEventHandlers()).forEach(eventName => {
      this.socket!.on(eventName, (data) => {
        this.emit(eventName as keyof RealTimeEvents, data);
      });
    });
  }

  // Handle reconnection logic
  private handleReconnection() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
      
      console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts}) in ${delay}ms`);
      
      setTimeout(() => {
        if (this.authToken && this.userId) {
          this.connect(this.authToken, this.userId);
        }
      }, delay);
    } else {
      console.error('Max reconnection attempts reached');
      toast.error('Lost connection to real-time updates');
    }
  }

  // Setup default event handlers
  private setupEventHandlers() {
    const defaultHandlers = this.getDefaultEventHandlers();
    
    Object.entries(defaultHandlers).forEach(([event, handler]) => {
      this.on(event as keyof RealTimeEvents, handler);
    });
  }

  // Get default event handlers
  private getDefaultEventHandlers(): Partial<RealTimeEvents> {
    return {
      connected: (data) => {
        console.log('Real-time service connected:', data);
      },
      
      error: (data) => {
        console.error('Real-time service error:', data);
        toast.error(data.message || 'Real-time service error');
      },
      
      property_updated: (data) => {
        console.log('Property updated:', data);
        toast.info(`Property "${data.property?.title || data.propertyId}" was updated`);
      },
      
      property_viewed: (data) => {
        console.log('Property viewed:', data);
        if (data.viewerId !== this.userId) {
          toast.info(`${data.viewerName} is viewing this property`);
        }
      },
      
      view_count_updated: (data) => {
        console.log('View count updated:', data);
      },
      
      tour_updated: (data) => {
        console.log('Tour updated:', data);
        toast.info('Tour information has been updated');
      },
      
      tour_status_updated: (data) => {
        console.log('Tour status updated:', data);
        toast.info(`Tour status changed to: ${data.status}`);
      },
      
      new_notification: (data) => {
        console.log('New notification:', data);
        const notification = data.notification;
        toast.info(notification.title || 'New notification', {
          description: notification.message
        });
      },
      
      pending_notifications: (data) => {
        console.log('Pending notifications:', data);
        if (data.count > 0) {
          toast.info(`You have ${data.count} unread notification${data.count > 1 ? 's' : ''}`);
        }
      },
      
      new_message: (data) => {
        console.log('New message:', data);
        if (data.senderId !== this.userId) {
          toast.info(`New message from ${data.senderName}`);
        }
      }
    };
  }

  // Event subscription methods
  on<K extends keyof RealTimeEvents>(event: K, handler: RealTimeEvents[K]) {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, new Set());
    }
    this.eventHandlers.get(event)!.add(handler as RealTimeEventHandler);
  }

  off<K extends keyof RealTimeEvents>(event: K, handler: RealTimeEvents[K]) {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      handlers.delete(handler as RealTimeEventHandler);
    }
  }

  private emit<K extends keyof RealTimeEvents>(event: K, data: Parameters<RealTimeEvents[K]>[0]) {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      handlers.forEach(handler => {
        try {
          handler(data);
        } catch (error) {
          console.error(`Error in event handler for ${event}:`, error);
        }
      });
    }
  }

  // Property room methods
  joinPropertyRoom(propertyId: string) {
    if (this.socket?.connected) {
      this.socket.emit('join_property_room', { propertyId });
    }
  }

  leavePropertyRoom(propertyId: string) {
    if (this.socket?.connected) {
      this.socket.emit('leave_property_room', { propertyId });
    }
  }

  // Property interaction methods
  trackPropertyView(propertyId: string) {
    if (this.socket?.connected) {
      this.socket.emit('property_view', { propertyId });
    }
  }

  // Tour room methods
  joinTourRoom(tourId: string) {
    if (this.socket?.connected) {
      this.socket.emit('join_tour_room', { tourId });
    }
  }

  leaveTourRoom(tourId: string) {
    if (this.socket?.connected) {
      this.socket.emit('leave_tour_room', { tourId });
    }
  }

  // Tour interaction methods
  updateTourStatus(tourId: string, status: string, notes?: string) {
    if (this.socket?.connected) {
      this.socket.emit('tour_status_update', { tourId, status, notes });
    }
  }

  // Notification methods
  markNotificationAsRead(notificationId: string) {
    if (this.socket?.connected) {
      this.socket.emit('mark_notification_read', { notificationId });
    }
  }

  // Chat methods
  joinChatRoom(roomId: string) {
    if (this.socket?.connected) {
      this.socket.emit('join_chat_room', { roomId });
    }
  }

  sendMessage(roomId: string, message: string, messageType: string = 'text') {
    if (this.socket?.connected) {
      this.socket.emit('send_message', { roomId, message, messageType });
    }
  }

  // Utility methods
  isConnectedToServer(): boolean {
    return this.isConnected && this.socket?.connected === true;
  }

  getConnectionStatus(): 'connected' | 'disconnected' | 'connecting' {
    if (!this.socket) return 'disconnected';
    if (this.socket.connected) return 'connected';
    if (this.socket.connecting) return 'connecting';
    return 'disconnected';
  }

  // Get current user ID
  getCurrentUserId(): string | null {
    return this.userId;
  }
}

// Create and export singleton instance
const realTimeService = new RealTimeService();

export default realTimeService;
export type { RealTimeEvents };