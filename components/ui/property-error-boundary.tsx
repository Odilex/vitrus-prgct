'use client';

import React from 'react';
import { AlertCircle, RefreshCw, Wifi, Lock, Server, AlertTriangle } from 'lucide-react';
import { Button } from './button';
import { Alert, AlertDescription, AlertTitle } from './alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';

interface ErrorState {
  message: string;
  code: string;
  type: 'network' | 'validation' | 'not_found' | 'unauthorized' | 'server' | 'unknown';
  retryable: boolean;
  timestamp: number;
}

interface PropertyErrorBoundaryProps {
  error: ErrorState;
  onRetry?: () => void;
  onClear?: () => void;
  className?: string;
}

const getErrorIcon = (type: ErrorState['type']) => {
  switch (type) {
    case 'network':
      return <Wifi className="h-5 w-5" />;
    case 'unauthorized':
      return <Lock className="h-5 w-5" />;
    case 'server':
      return <Server className="h-5 w-5" />;
    case 'validation':
      return <AlertTriangle className="h-5 w-5" />;
    default:
      return <AlertCircle className="h-5 w-5" />;
  }
};

const getErrorTitle = (type: ErrorState['type']) => {
  switch (type) {
    case 'network':
      return 'Connection Error';
    case 'unauthorized':
      return 'Authentication Required';
    case 'server':
      return 'Server Error';
    case 'validation':
      return 'Validation Error';
    case 'not_found':
      return 'Not Found';
    default:
      return 'Error';
  }
};

const getErrorDescription = (error: ErrorState) => {
  switch (error.type) {
    case 'network':
      return 'Unable to connect to the server. Please check your internet connection and try again.';
    case 'unauthorized':
      return 'You need to be logged in to access this content. Please sign in and try again.';
    case 'server':
      return 'The server is experiencing issues. Please try again in a few moments.';
    case 'validation':
      return error.message;
    case 'not_found':
      return 'The requested property could not be found. It may have been deleted or moved.';
    default:
      return error.message || 'An unexpected error occurred. Please try again.';
  }
};

export function PropertyErrorBoundary({ 
  error, 
  onRetry, 
  onClear, 
  className 
}: PropertyErrorBoundaryProps) {
  const errorIcon = getErrorIcon(error.type);
  const errorTitle = getErrorTitle(error.type);
  const errorDescription = getErrorDescription(error);
  const timeAgo = new Date(error.timestamp).toLocaleTimeString();

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-destructive">
          {errorIcon}
          {errorTitle}
        </CardTitle>
        <CardDescription>
          Error occurred at {timeAgo}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Details</AlertTitle>
          <AlertDescription>
            {errorDescription}
          </AlertDescription>
        </Alert>
        
        {error.code && (
          <div className="text-sm text-muted-foreground">
            Error Code: {error.code}
          </div>
        )}
        
        <div className="flex gap-2">
          {error.retryable && onRetry && (
            <Button onClick={onRetry} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          )}
          {onClear && (
            <Button onClick={onClear} variant="ghost" size="sm">
              Dismiss
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Inline error component for smaller spaces
export function PropertyErrorInline({ 
  error, 
  onRetry, 
  onClear, 
  className 
}: PropertyErrorBoundaryProps) {
  const errorIcon = getErrorIcon(error.type);
  const errorDescription = getErrorDescription(error);

  return (
    <Alert variant="destructive" className={className}>
      {errorIcon}
      <AlertTitle>Error Loading Properties</AlertTitle>
      <AlertDescription className="flex items-center justify-between">
        <span>{errorDescription}</span>
        <div className="flex gap-1 ml-2">
          {error.retryable && onRetry && (
            <Button onClick={onRetry} variant="ghost" size="sm">
              <RefreshCw className="h-3 w-3" />
            </Button>
          )}
          {onClear && (
            <Button onClick={onClear} variant="ghost" size="sm">
              ×
            </Button>
          )}
        </div>
      </AlertDescription>
    </Alert>
  );
}