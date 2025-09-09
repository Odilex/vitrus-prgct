"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRealTimeConnection } from '@/hooks/useRealTime';
import realTimeService from '@/lib/realTimeService';

interface RealTimeContextType {
  isConnected: boolean;
  connectionStatus: 'connected' | 'disconnected' | 'connecting';
  connect: (token: string, userId: string) => void;
  disconnect: () => void;
  userId: string | null;
}

const RealTimeContext = createContext<RealTimeContextType | null>(null);

export function useRealTimeContext() {
  const context = useContext(RealTimeContext);
  if (!context) {
    throw new Error('useRealTimeContext must be used within a RealTimeProvider');
  }
  return context;
}

interface RealTimeProviderProps {
  children: ReactNode;
  autoConnect?: boolean;
  token?: string;
  userId?: string;
}

export function RealTimeProvider({ 
  children, 
  autoConnect = false, 
  token, 
  userId 
}: RealTimeProviderProps) {
  const [currentToken, setCurrentToken] = useState<string | undefined>(token);
  const [currentUserId, setCurrentUserId] = useState<string | undefined>(userId);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'connecting'>('disconnected');

  // Use the real-time connection hook
  useRealTimeConnection(
    autoConnect ? currentToken : undefined,
    autoConnect ? currentUserId : undefined
  );

  // Update connection status
  useEffect(() => {
    const updateStatus = () => {
      const status = realTimeService.getConnectionStatus();
      const connected = realTimeService.isConnectedToServer();
      
      setConnectionStatus(status);
      setIsConnected(connected);
    };

    // Update status immediately
    updateStatus();

    // Set up interval to check status periodically
    const interval = setInterval(updateStatus, 1000);

    return () => clearInterval(interval);
  }, []);

  const connect = (newToken: string, newUserId: string) => {
    setCurrentToken(newToken);
    setCurrentUserId(newUserId);
    realTimeService.connect(newToken, newUserId);
  };

  const disconnect = () => {
    realTimeService.disconnect();
    setCurrentToken(undefined);
    setCurrentUserId(undefined);
  };

  const contextValue: RealTimeContextType = {
    isConnected,
    connectionStatus,
    connect,
    disconnect,
    userId: currentUserId || null
  };

  return (
    <RealTimeContext.Provider value={contextValue}>
      {children}
    </RealTimeContext.Provider>
  );
}

export default RealTimeProvider;