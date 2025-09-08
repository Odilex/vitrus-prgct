"use client";

import React, { useState, useEffect } from 'react';
import { Eye, Heart, MessageSquare, Calendar, MapPin, DollarSign } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { usePropertyUpdates } from '@/hooks/useRealTime';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

interface PropertyUpdate {
  id: string;
  propertyId: string;
  type: 'view' | 'favorite' | 'inquiry' | 'tour_request' | 'price_change' | 'status_change';
  title: string;
  description: string;
  timestamp: Date;
  userId?: string;
  userName?: string;
  userAvatar?: string;
  metadata?: {
    oldValue?: unknown;
    newValue?: unknown;
    propertyTitle?: string;
    propertyImage?: string;
    propertyPrice?: number;
    propertyLocation?: string;
  };
}

interface RealTimePropertyUpdatesProps {
  propertyId?: string;
  className?: string;
  maxUpdates?: number;
  showUserInfo?: boolean;
}

export function RealTimePropertyUpdates({ 
  propertyId,
  className, 
  maxUpdates = 20,
  showUserInfo = true
}: RealTimePropertyUpdatesProps) {
  const [updates, setUpdates] = useState<PropertyUpdate[]>([]);

  // Use the real-time property updates hook
  usePropertyUpdates((update) => {
    // Filter by propertyId if specified
    if (propertyId && update.propertyId !== propertyId) {
      return;
    }

    const newUpdate: PropertyUpdate = {
      id: update.id || Date.now().toString(),
      propertyId: update.propertyId,
      type: update.type || 'view',
      title: update.title || 'Property Update',
      description: update.description || '',
      timestamp: new Date(update.timestamp || Date.now()),
      userId: update.userId,
      userName: update.userName,
      userAvatar: update.userAvatar,
      metadata: update.metadata
    };

    setUpdates(prev => {
      const updated = [newUpdate, ...prev];
      return updated.slice(0, maxUpdates);
    });
  }, propertyId);

  const getUpdateIcon = (type: PropertyUpdate['type']) => {
    switch (type) {
      case 'view':
        return <Eye className="h-4 w-4 text-blue-600" />;
      case 'favorite':
        return <Heart className="h-4 w-4 text-red-600" />;
      case 'inquiry':
        return <MessageSquare className="h-4 w-4 text-green-600" />;
      case 'tour_request':
        return <Calendar className="h-4 w-4 text-purple-600" />;
      case 'price_change':
        return <DollarSign className="h-4 w-4 text-orange-600" />;
      case 'status_change':
        return <MapPin className="h-4 w-4 text-gray-600" />;
      default:
        return <Eye className="h-4 w-4 text-blue-600" />;
    }
  };

  const getUpdateColor = (type: PropertyUpdate['type']) => {
    switch (type) {
      case 'view':
        return 'bg-blue-100 text-blue-800';
      case 'favorite':
        return 'bg-red-100 text-red-800';
      case 'inquiry':
        return 'bg-green-100 text-green-800';
      case 'tour_request':
        return 'bg-purple-100 text-purple-800';
      case 'price_change':
        return 'bg-orange-100 text-orange-800';
      case 'status_change':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const formatUpdateType = (type: PropertyUpdate['type']) => {
    switch (type) {
      case 'view':
        return 'View';
      case 'favorite':
        return 'Favorite';
      case 'inquiry':
        return 'Inquiry';
      case 'tour_request':
        return 'Tour Request';
      case 'price_change':
        return 'Price Change';
      case 'status_change':
        return 'Status Change';
      default:
        return 'Update';
    }
  };

  if (updates.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="text-sm font-medium">
            {propertyId ? 'Property Activity' : 'Recent Activity'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-sm text-muted-foreground py-4">
            No recent activity
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          {propertyId ? 'Property Activity' : 'Recent Activity'}
          <Badge variant="secondary" className="text-xs">
            {updates.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {updates.map((update) => (
          <div
            key={update.id}
            className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
          >
            <div className="flex-shrink-0 mt-0.5">
              {getUpdateIcon(update.type)}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge 
                      variant="secondary" 
                      className={cn('text-xs', getUpdateColor(update.type))}
                    >
                      {formatUpdateType(update.type)}
                    </Badge>
                    
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(update.timestamp, { addSuffix: true })}
                    </span>
                  </div>
                  
                  <p className="text-sm font-medium mb-1">
                    {update.title}
                  </p>
                  
                  {update.description && (
                    <p className="text-xs text-muted-foreground mb-2">
                      {update.description}
                    </p>
                  )}
                  
                  {showUserInfo && (update.userName || update.userId) && (
                    <div className="flex items-center gap-2 mt-2">
                      <Avatar className="h-5 w-5">
                        <AvatarImage src={update.userAvatar} />
                        <AvatarFallback className="text-xs">
                          {update.userName?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      
                      <span className="text-xs text-muted-foreground">
                        {update.userName || `User ${update.userId?.slice(0, 8)}`}
                      </span>
                    </div>
                  )}
                  
                  {update.metadata?.propertyTitle && !propertyId && (
                    <div className="mt-2 p-2 bg-muted rounded text-xs">
                      <div className="font-medium">{update.metadata.propertyTitle}</div>
                      {update.metadata.propertyLocation && (
                        <div className="text-muted-foreground flex items-center gap-1 mt-1">
                          <MapPin className="h-3 w-3" />
                          {update.metadata.propertyLocation}
                        </div>
                      )}
                      {update.metadata.propertyPrice && (
                        <div className="text-muted-foreground flex items-center gap-1 mt-1">
                          <DollarSign className="h-3 w-3" />
                          ${update.metadata.propertyPrice.toLocaleString()}
                        </div>
                      )}
                    </div>
                  )}
                  
                  {update.type === 'price_change' && update.metadata?.oldValue && update.metadata?.newValue && (
                    <div className="mt-2 text-xs">
                      <span className="text-muted-foreground">Price changed from </span>
                      <span className="line-through text-red-600">
                        ${update.metadata.oldValue.toLocaleString()}
                      </span>
                      <span className="text-muted-foreground"> to </span>
                      <span className="font-medium text-green-600">
                        ${update.metadata.newValue.toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

// Compact version for dashboards
export function RealTimePropertyUpdatesCompact({ 
  propertyId, 
  className 
}: { 
  propertyId?: string; 
  className?: string; 
}) {
  return (
    <RealTimePropertyUpdates 
      propertyId={propertyId}
      className={className}
      maxUpdates={5}
      showUserInfo={false}
    />
  );
}

export default RealTimePropertyUpdates;