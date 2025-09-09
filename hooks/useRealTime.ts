"use client";

import { useEffect, useCallback, useRef } from 'react';
import realTimeService, { RealTimeEvents } from '@/lib/realTimeService';

// Hook for managing real-time connection
export function useRealTimeConnection(token?: string, userId?: string) {
  const isInitialized = useRef(false);

  useEffect(() => {
    if (token && userId && !isInitialized.current) {
      realTimeService.connect(token, userId);
      isInitialized.current = true;
    }

    return () => {
      if (isInitialized.current) {
        realTimeService.disconnect();
        isInitialized.current = false;
      }
    };
  }, [token, userId]);

  return {
    isConnected: realTimeService.isConnectedToServer(),
    connectionStatus: realTimeService.getConnectionStatus(),
    disconnect: () => realTimeService.disconnect()
  };
}

// Hook for subscribing to real-time events
export function useRealTimeEvent<K extends keyof RealTimeEvents>(
  event: K,
  handler: RealTimeEvents[K],
  dependencies: unknown[] = []
) {
  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  useEffect(() => {
    const stableHandler = (data: unknown) => {
      (handlerRef.current as RealTimeEvents[K])(data);
    };
    
    realTimeService.on(event, stableHandler as RealTimeEvents[K]);
    
    return () => {
      realTimeService.off(event, stableHandler as RealTimeEvents[K]);
    };
  }, [event, ...dependencies]);
}

// Hook for property room management
export function usePropertyRoom(propertyId?: string) {
  const currentPropertyId = useRef<string | null>(null);

  const joinRoom = useCallback((id: string) => {
    if (currentPropertyId.current !== id) {
      if (currentPropertyId.current) {
        realTimeService.leavePropertyRoom(currentPropertyId.current);
      }
      realTimeService.joinPropertyRoom(id);
      currentPropertyId.current = id;
    }
  }, []);

  const leaveRoom = useCallback(() => {
    if (currentPropertyId.current) {
      realTimeService.leavePropertyRoom(currentPropertyId.current);
      currentPropertyId.current = null;
    }
  }, []);

  const trackView = useCallback(() => {
    if (currentPropertyId.current) {
      realTimeService.trackPropertyView(currentPropertyId.current);
    }
  }, []);

  useEffect(() => {
    if (propertyId) {
      joinRoom(propertyId);
    }

    return () => {
      leaveRoom();
    };
  }, [propertyId, joinRoom, leaveRoom]);

  return {
    joinRoom,
    leaveRoom,
    trackView,
    currentPropertyId: currentPropertyId.current
  };
}

// Hook for tour room management
export function useTourRoom(tourId?: string) {
  const currentTourId = useRef<string | null>(null);

  const joinRoom = useCallback((id: string) => {
    if (currentTourId.current !== id) {
      if (currentTourId.current) {
        realTimeService.leaveTourRoom(currentTourId.current);
      }
      realTimeService.joinTourRoom(id);
      currentTourId.current = id;
    }
  }, []);

  const leaveRoom = useCallback(() => {
    if (currentTourId.current) {
      realTimeService.leaveTourRoom(currentTourId.current);
      currentTourId.current = null;
    }
  }, []);

  const updateStatus = useCallback((status: string, notes?: string) => {
    if (currentTourId.current) {
      realTimeService.updateTourStatus(currentTourId.current, status, notes);
    }
  }, []);

  useEffect(() => {
    if (tourId) {
      joinRoom(tourId);
    }

    return () => {
      leaveRoom();
    };
  }, [tourId, joinRoom, leaveRoom]);

  return {
    joinRoom,
    leaveRoom,
    updateStatus,
    currentTourId: currentTourId.current
  };
}

// Hook for chat room management
export function useChatRoom(roomId?: string) {
  const currentRoomId = useRef<string | null>(null);

  const joinRoom = useCallback((id: string) => {
    if (currentRoomId.current !== id) {
      realTimeService.joinChatRoom(id);
      currentRoomId.current = id;
    }
  }, []);

  const sendMessage = useCallback((message: string, messageType: string = 'text') => {
    if (currentRoomId.current) {
      realTimeService.sendMessage(currentRoomId.current, message, messageType);
    }
  }, []);

  useEffect(() => {
    if (roomId) {
      joinRoom(roomId);
    }
  }, [roomId, joinRoom]);

  return {
    joinRoom,
    sendMessage,
    currentRoomId: currentRoomId.current
  };
}

// Hook for notification management
export function useNotifications() {
  const markAsRead = useCallback((notificationId: string) => {
    realTimeService.markNotificationAsRead(notificationId);
  }, []);

  return {
    markAsRead
  };
}

// Hook for real-time property updates
export function usePropertyUpdates(onPropertyUpdate?: (data: Parameters<RealTimeEvents['property_updated']>[0]) => void) {
  useRealTimeEvent('property_updated', (data) => {
    console.log('Property updated:', data);
    onPropertyUpdate?.(data);
  }, [onPropertyUpdate]);

  useRealTimeEvent('view_count_updated', (data) => {
    console.log('View count updated:', data);
  });
}

// Hook for real-time tour updates
export function useTourUpdates(
  onTourUpdate?: (data: Parameters<RealTimeEvents['tour_updated']>[0]) => void,
  onTourStatusUpdate?: (data: Parameters<RealTimeEvents['tour_status_updated']>[0]) => void
) {
  useRealTimeEvent('tour_updated', (data) => {
    console.log('Tour updated:', data);
    onTourUpdate?.(data);
  }, [onTourUpdate]);

  useRealTimeEvent('tour_status_updated', (data) => {
    console.log('Tour status updated:', data);
    onTourStatusUpdate?.(data);
  }, [onTourStatusUpdate]);
}

// Hook for real-time notifications
export function useNotificationUpdates(onNewNotification?: (data: Parameters<RealTimeEvents['new_notification']>[0]) => void) {
  useRealTimeEvent('new_notification', (data) => {
    console.log('New notification:', data);
    onNewNotification?.(data);
  }, [onNewNotification]);

  useRealTimeEvent('pending_notifications', (data) => {
    console.log('Pending notifications:', data);
  });
}

// Hook for real-time chat messages
export function useChatMessages(onNewMessage?: (data: Parameters<RealTimeEvents['new_message']>[0]) => void) {
  useRealTimeEvent('new_message', (data) => {
    console.log('New message:', data);
    onNewMessage?.(data);
  }, [onNewMessage]);
}

export default realTimeService;