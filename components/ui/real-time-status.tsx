"use client";

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Wifi, WifiOff, Loader2 } from 'lucide-react';
import { useRealTimeContext } from '@/components/providers/RealTimeProvider';
import { cn } from '@/lib/utils';

interface RealTimeStatusProps {
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function RealTimeStatus({ 
  className, 
  showText = true, 
  size = 'md' 
}: RealTimeStatusProps) {
  const { isConnected, connectionStatus } = useRealTimeContext();

  const getStatusConfig = () => {
    switch (connectionStatus) {
      case 'connected':
        return {
          icon: Wifi,
          text: 'Connected',
          variant: 'default' as const,
          color: 'text-green-600',
          bgColor: 'bg-green-100',
          tooltip: 'Real-time updates are active'
        };
      case 'connecting':
        return {
          icon: Loader2,
          text: 'Connecting',
          variant: 'secondary' as const,
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-100',
          tooltip: 'Connecting to real-time updates'
        };
      case 'disconnected':
      default:
        return {
          icon: WifiOff,
          text: 'Disconnected',
          variant: 'destructive' as const,
          color: 'text-red-600',
          bgColor: 'bg-red-100',
          tooltip: 'Real-time updates are not available'
        };
    }
  };

  const config = getStatusConfig();
  const IconComponent = config.icon;

  const iconSize = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  }[size];

  const textSize = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  }[size];

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge 
            variant={config.variant}
            className={cn(
              'flex items-center gap-1.5 cursor-help',
              className
            )}
          >
            <IconComponent 
              className={cn(
                iconSize,
                connectionStatus === 'connecting' && 'animate-spin'
              )} 
            />
            {showText && (
              <span className={textSize}>
                {config.text}
              </span>
            )}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p>{config.tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

// Compact version for headers/navbars
export function RealTimeStatusCompact({ className }: { className?: string }) {
  return (
    <RealTimeStatus 
      className={className}
      showText={false}
      size="sm"
    />
  );
}

// Detailed version for settings/status pages
export function RealTimeStatusDetailed({ className }: { className?: string }) {
  const { isConnected, connectionStatus, userId } = useRealTimeContext();
  
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <div className="flex items-center gap-2">
        <RealTimeStatus size="md" />
        <span className="text-sm text-muted-foreground">
          Real-time updates
        </span>
      </div>
      
      {userId && (
        <div className="text-xs text-muted-foreground">
          User ID: {userId.slice(0, 8)}...
        </div>
      )}
      
      <div className="text-xs text-muted-foreground">
        Status: {connectionStatus}
      </div>
    </div>
  );
}

export default RealTimeStatus;