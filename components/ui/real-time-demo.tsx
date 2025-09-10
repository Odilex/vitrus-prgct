"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, RotateCcw, Zap } from 'lucide-react';
import realTimeService from '@/lib/realTimeService';
import { useRealTimeContext } from '@/components/providers/RealTimeProvider';
import { propertyService } from '@/lib/api/property';
import { Property } from '@/lib/types/property';

interface RealTimeDemoProps {
  className?: string;
}

export function RealTimeDemo({ className }: RealTimeDemoProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [eventCount, setEventCount] = useState(0);
  const { isConnected, connectionStatus, connect, disconnect } = useRealTimeContext();

  // Real-time event interfaces
  interface User {
    id: string;
    name: string;
    avatar: string | null;
  }

  // State for real properties and users
  const [properties, setProperties] = useState<Property[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  // Mock users for demo purposes
  const mockUsers: User[] = [
    { id: '1', name: 'John Smith', avatar: null },
    { id: '2', name: 'Sarah Johnson', avatar: null },
    { id: '3', name: 'Mike Davis', avatar: null },
    { id: '4', name: 'Emily Brown', avatar: null },
    { id: '5', name: 'David Wilson', avatar: null },
  ];

  // Load real data from API
  useEffect(() => {
    const loadRealData = async () => {
      try {
        // Fetch real properties using our property service
        const propertiesData = await propertyService.getAll();
        setProperties(propertiesData.slice(0, 10)); // Limit to 10 for demo
        
        // Use mock users for now
        setUsers(mockUsers);
      } catch (error) {
        console.error('Error loading real data for demo:', error);
        // Fallback to empty arrays if API fails
        setProperties([]);
        setUsers(mockUsers); // Still use mock users even if properties fail
      }
    };

    loadRealData();
  }, []);

  const eventTypes = [
    'view',
    'favorite',
    'inquiry',
    'tour_request',
    'price_change',
    'status_change'
  ] as const;

  const generateRandomEvent = () => {
    // Only generate events if we have real data
    if (properties.length === 0 || users.length === 0) {
      return null;
    }

    const property = properties[Math.floor(Math.random() * properties.length)];
    const user = users[Math.floor(Math.random() * users.length)];
    const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];

    const baseEvent = {
      id: `demo-${Date.now()}-${Math.random()}`,
      propertyId: property.id,
      type: eventType,
      timestamp: Date.now(),
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      metadata: {
        propertyTitle: property.name,
        propertyLocation: `${property.city}, ${property.state}`,
        propertyPrice: property.price,
      }
    };

    switch (eventType) {
      case 'view':
        return {
          ...baseEvent,
          title: 'Property Viewed',
          description: `${user.name} viewed ${property.name}`,
        };
      case 'favorite':
        return {
          ...baseEvent,
          title: 'Property Favorited',
          description: `${user.name} added ${property.name} to favorites`,
        };
      case 'inquiry':
        return {
          ...baseEvent,
          title: 'New Inquiry',
          description: `${user.name} sent an inquiry about ${property.name}`,
        };
      case 'tour_request':
        return {
          ...baseEvent,
          title: 'Tour Requested',
          description: `${user.name} requested a tour of ${property.name}`,
        };
      case 'price_change':
        const oldPrice = property.price;
        const newPrice = oldPrice + (Math.random() - 0.5) * 50000;
        return {
          ...baseEvent,
          title: 'Price Updated',
          description: `Price changed for ${property.name}`,
          metadata: {
            ...baseEvent.metadata,
            oldValue: oldPrice,
            newValue: Math.round(newPrice),
          }
        };
      case 'status_change':
        const statuses = ['active', 'inactive', 'sold', 'rented'];
        const newStatus = statuses[Math.floor(Math.random() * statuses.length)];
        return {
          ...baseEvent,
          title: 'Status Changed',
          description: `${property.name} status changed to ${newStatus}`,
          metadata: {
            ...baseEvent.metadata,
            newValue: newStatus,
          }
        };
      default:
        return baseEvent;
    }
  };

  const generateRandomNotification = () => {
    // Only generate notifications if we have real user data
    if (users.length === 0) {
      return null;
    }

    const user = users[Math.floor(Math.random() * users.length)];
    const types = ['info', 'success', 'warning', 'error'] as const;
    const type = types[Math.floor(Math.random() * types.length)];
    
    const notifications = {
      info: {
        title: 'System Update',
        message: 'New features have been added to the dashboard',
      },
      success: {
        title: 'Property Published',
        message: 'Your property listing has been successfully published',
      },
      warning: {
        title: 'Subscription Expiring',
        message: 'Your premium subscription expires in 7 days',
      },
      error: {
        title: 'Upload Failed',
        message: 'Failed to upload property images. Please try again',
      },
    };

    return {
      id: `notification-${Date.now()}-${Math.random()}`,
      type,
      title: notifications[type].title,
      message: notifications[type].message,
      timestamp: Date.now(),
      userId: user.id,
      metadata: {}
    };
  };

  const simulateEvent = () => {
    if (!isConnected) return;

    // 70% chance for property update, 30% for notification
    if (Math.random() < 0.7) {
      const event = generateRandomEvent();
      if (event) {
        realTimeService.emit('property_update', event);
        setEventCount(prev => prev + 1);
      }
    } else {
      const notification = generateRandomNotification();
      if (notification) {
        realTimeService.emit('new_notification', notification);
        setEventCount(prev => prev + 1);
      }
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && isConnected) {
      interval = setInterval(() => {
        simulateEvent();
      }, 2000 + Math.random() * 3000); // Random interval between 2-5 seconds
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, isConnected, properties, users]);

  const handleConnect = () => {
    // Connect with real authentication token and user ID
    // In a real application, these would come from the authentication context
    const token = localStorage.getItem('auth_token') || 'anonymous-token';
    const userId = localStorage.getItem('user_id') || `anonymous-${Date.now()}`;
    connect(token, userId);
  };

  const handleDisconnect = () => {
    setIsRunning(false);
    disconnect();
  };

  const resetDemo = () => {
    setIsRunning(false);
    setEventCount(0);
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5" />
          Real-time Demo
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <Badge variant={isConnected ? 'default' : 'secondary'}>
            {connectionStatus}
          </Badge>
          <span className="text-sm text-muted-foreground">
            Events generated: {eventCount}
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {!isConnected ? (
            <Button onClick={handleConnect} size="sm">
              <Play className="h-4 w-4 mr-2" />
              Connect
            </Button>
          ) : (
            <Button onClick={handleDisconnect} variant="outline" size="sm">
              Disconnect
            </Button>
          )}

          {isConnected && (
            <>
              <Button
                onClick={() => setIsRunning(!isRunning)}
                variant={isRunning ? 'destructive' : 'default'}
                size="sm"
              >
                {isRunning ? (
                  <>
                    <Pause className="h-4 w-4 mr-2" />
                    Stop Demo
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Start Demo
                  </>
                )}
              </Button>

              <Button onClick={simulateEvent} variant="outline" size="sm">
                <Zap className="h-4 w-4 mr-2" />
                Trigger Event
              </Button>
            </>
          )}

          <Button onClick={resetDemo} variant="outline" size="sm">
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>

        <div className="text-xs text-muted-foreground">
          <p>This demo simulates real-time property updates and notifications.</p>
          <p>Connect to start receiving live events in the real-time components.</p>
        </div>
      </CardContent>
    </Card>
  );
}

export default RealTimeDemo;