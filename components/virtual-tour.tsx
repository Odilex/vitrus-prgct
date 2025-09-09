"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, ExternalLink, AlertCircle, Maximize2, Volume2, VolumeX, Pause, RotateCcw } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

interface VirtualTourProps {
  tourUrl?: string;
  propertyTitle: string;
  fallbackImage?: string;
  className?: string;
  onTourStart?: () => void;
  onTourEnd?: () => void;
  onError?: (error: TourError) => void;
  autoplay?: boolean;
  maxRetries?: number;
}

interface TourError {
  type: 'network' | 'invalid_url' | 'load_failed' | 'timeout' | 'unsupported' | 'unknown';
  message: string;
  code?: string;
  timestamp: number;
  retryable: boolean;
}

type TourType = 'youtube' | 'vimeo' | 'matterport' | 'iframe' | 'unknown';

function detectTourType(url: string): TourType {
  if (!url) return 'unknown';
  
  const lowerUrl = url.toLowerCase();
  
  if (lowerUrl.includes('youtube.com') || lowerUrl.includes('youtu.be')) {
    return 'youtube';
  }
  if (lowerUrl.includes('vimeo.com')) {
    return 'vimeo';
  }
  if (lowerUrl.includes('matterport.com')) {
    return 'matterport';
  }
  if (lowerUrl.startsWith('http')) {
    return 'iframe';
  }
  
  return 'unknown';
}

function getEmbedUrl(url: string, tourType: TourType): string {
  switch (tourType) {
    case 'youtube':
      // Convert YouTube URL to embed format
      const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
      const youtubeMatch = url.match(youtubeRegex);
      if (youtubeMatch) {
        return `https://www.youtube.com/embed/${youtubeMatch[1]}?autoplay=0&rel=0&modestbranding=1`;
      }
      break;
      
    case 'vimeo':
      // Convert Vimeo URL to embed format
      const vimeoRegex = /vimeo\.com\/(\d+)/;
      const vimeoMatch = url.match(vimeoRegex);
      if (vimeoMatch) {
        return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=0&title=0&byline=0&portrait=0`;
      }
      break;
      
    case 'matterport':
      // For Matterport, we'll use the full embed structure in the component
      return url;
      
    case 'iframe':
      // Generic iframe URL
      return url;
      
    default:
      return url;
  }
  
  return url;
}

export default function VirtualTour({ 
  tourUrl, 
  propertyTitle, 
  fallbackImage = "/images/default-property.jpg",
  className = "",
  onTourStart,
  onTourEnd,
  onError,
  autoplay = false,
  maxRetries = 3
}: VirtualTourProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [currentError, setCurrentError] = useState<TourError | null>(null);
  const [isPlaying, setIsPlaying] = useState(autoplay);
  const [isMuted, setIsMuted] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [loadTimeout, setLoadTimeout] = useState<NodeJS.Timeout | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const loadStartTime = useRef<number>(0);
  
  const tourType = tourUrl ? detectTourType(tourUrl) : 'unknown';
  const embedUrl = tourUrl ? getEmbedUrl(tourUrl, tourType) : '';
  
  // Enhanced error handling
  const createError = useCallback((type: TourError['type'], message: string, code?: string): TourError => {
    return {
      type,
      message,
      code,
      timestamp: Date.now(),
      retryable: type !== 'unsupported' && type !== 'invalid_url' && retryCount < maxRetries
    };
  }, [retryCount, maxRetries]);

  const handleError = useCallback((error: TourError) => {
    setCurrentError(error);
    setHasError(true);
    setIsLoaded(false);
    onError?.(error);
    
    // Clear any existing timeout
    if (loadTimeout) {
      clearTimeout(loadTimeout);
      setLoadTimeout(null);
    }
    
    // Show appropriate toast message
    if (error.retryable) {
      toast.error(`${error.message} (Attempt ${retryCount + 1}/${maxRetries})`);
    } else {
      toast.error(error.message);
    }
  }, [onError, loadTimeout, retryCount, maxRetries]);

  // Network connectivity monitoring
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      if (hasError && currentError?.type === 'network') {
        toast.success('Connection restored. You can retry the virtual tour.');
      }
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      if (isPlaying) {
        const networkError = createError('network', 'Network connection lost', 'OFFLINE');
        handleError(networkError);
      }
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [hasError, currentError, isPlaying, createError, handleError]);
  
  // Define handlePlayTour with enhanced error checking
  const handlePlayTour = useCallback(() => {
    if (!isOnline) {
      const networkError = createError('network', 'No internet connection available', 'OFFLINE');
      handleError(networkError);
      return;
    }
    
    if (!tourUrl || tourType === 'unknown') {
      const urlError = createError('invalid_url', 'Invalid or unsupported tour URL', 'INVALID_URL');
      handleError(urlError);
      return;
    }
    
    setIsPlaying(true);
    setLoadingProgress(10);
    setHasError(false);
    setCurrentError(null);
    loadStartTime.current = Date.now();
    
    // Set loading timeout (30 seconds)
    const timeout = setTimeout(() => {
      const timeoutError = createError('timeout', 'Virtual tour failed to load within 30 seconds', 'LOAD_TIMEOUT');
      handleError(timeoutError);
    }, 30000);
    setLoadTimeout(timeout);
    
    onTourStart?.();
    toast.info('Starting virtual tour...');
  }, [isOnline, tourUrl, tourType, onTourStart, createError, handleError]);
  
  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(prev => {
      const newState = !prev;
      if (newState) {
        toast.info('Press ESC to exit fullscreen');
      }
      return newState;
    });
  }, []);
  
  const toggleMute = useCallback(() => {
    setIsMuted(prev => {
      const newState = !prev;
      toast.info(newState ? 'Audio muted' : 'Audio unmuted');
      return newState;
    });
  }, []);
  
  // Enhanced loading progress simulation
  useEffect(() => {
    if (isPlaying && !isLoaded) {
      const interval = setInterval(() => {
        setLoadingProgress(prev => {
          if (prev >= 90) {
            clearInterval(interval);
            return prev;
          }
          return prev + Math.random() * 15;
        });
      }, 200);
      
      return () => clearInterval(interval);
    }
  }, [isPlaying, isLoaded]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (loadTimeout) {
        clearTimeout(loadTimeout);
      }
    };
  }, [loadTimeout]);

  useEffect(() => {
    if (tourUrl) {
      setHasError(false);
      setCurrentError(null);
      setIsLoaded(false);
      setRetryCount(0);
      setLoadingProgress(0);
    }
  }, [tourUrl]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!containerRef.current) return;
      
      switch (event.key) {
        case ' ':
        case 'Enter':
          event.preventDefault();
          if (!isPlaying) {
            handlePlayTour();
          }
          break;
        case 'Escape':
          if (isFullscreen) {
            setIsFullscreen(false);
          }
          break;
        case 'f':
        case 'F':
          event.preventDefault();
          toggleFullscreen();
          break;
        case 'm':
        case 'M':
          event.preventDefault();
          toggleMute();
          break;
      }
    };

    if (isPlaying || isFullscreen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isPlaying, isFullscreen]);

  // Touch controls for mobile
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let touchStartTime = 0;
    let touchStartX = 0;
    let touchStartY = 0;

    const handleTouchStart = (event: TouchEvent) => {
      touchStartTime = Date.now();
      touchStartX = event.touches[0].clientX;
      touchStartY = event.touches[0].clientY;
    };

    const handleTouchEnd = (event: TouchEvent) => {
      const touchEndTime = Date.now();
      const touchEndX = event.changedTouches[0].clientX;
      const touchEndY = event.changedTouches[0].clientY;
      
      const touchDuration = touchEndTime - touchStartTime;
      const touchDistanceX = Math.abs(touchEndX - touchStartX);
      const touchDistanceY = Math.abs(touchEndY - touchStartY);
      
      // Detect tap (short touch with minimal movement)
      if (touchDuration < 300 && touchDistanceX < 10 && touchDistanceY < 10) {
        if (!isPlaying) {
          handlePlayTour();
        }
      }
      
      // Detect swipe gestures
      if (touchDuration < 500 && (touchDistanceX > 50 || touchDistanceY > 50)) {
        if (touchDistanceX > touchDistanceY) {
          // Horizontal swipe
          if (touchEndX > touchStartX) {
            // Swipe right - could add next tour functionality
          } else {
            // Swipe left - could add previous tour functionality
          }
        } else {
          // Vertical swipe
          if (touchEndY < touchStartY) {
            // Swipe up - enter fullscreen
            if (!isFullscreen) {
              toggleFullscreen();
            }
          } else {
            // Swipe down - exit fullscreen
            if (isFullscreen) {
              setIsFullscreen(false);
            }
          }
        }
      }
    };

    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isPlaying, isFullscreen, handlePlayTour, toggleFullscreen]);
  
  const handleIframeLoad = useCallback(() => {
    const loadTime = Date.now() - loadStartTime.current;
    
    setIsLoaded(true);
    setHasError(false);
    setCurrentError(null);
    setLoadingProgress(100);
    
    // Clear timeout
    if (loadTimeout) {
      clearTimeout(loadTimeout);
      setLoadTimeout(null);
    }
    
    toast.success(`Virtual tour loaded successfully! (${Math.round(loadTime / 1000)}s)`);
  }, [loadTimeout]);
  
  const handleIframeError = useCallback(() => {
    const loadTime = Date.now() - loadStartTime.current;
    const newRetryCount = retryCount + 1;
    
    setRetryCount(newRetryCount);
    
    // Determine error type based on context
    let errorType: TourError['type'] = 'load_failed';
    let errorMessage = 'Failed to load virtual tour';
    
    if (!isOnline) {
      errorType = 'network';
      errorMessage = 'Network connection issue';
    } else if (loadTime < 1000) {
      errorType = 'invalid_url';
      errorMessage = 'Invalid or inaccessible tour URL';
    } else if (tourType === 'unknown') {
      errorType = 'unsupported';
      errorMessage = 'Unsupported tour format';
    }
    
    const error = createError(errorType, errorMessage, 'IFRAME_ERROR');
    handleError(error);
  }, [retryCount, isOnline, tourType, createError, handleError]);
  
  const handleStopTour = useCallback(() => {
    setIsPlaying(false);
    setIsLoaded(false);
    setLoadingProgress(0);
    onTourEnd?.();
  }, [onTourEnd]);

  const handleRetry = useCallback(() => {
    if (!currentError?.retryable) {
      toast.error('This error cannot be retried automatically');
      return;
    }
    
    if (retryCount >= maxRetries) {
      toast.error(`Maximum retry attempts (${maxRetries}) reached`);
      return;
    }
    
    if (!isOnline) {
      toast.error('Please check your internet connection and try again');
      return;
    }
    
    setHasError(false);
    setCurrentError(null);
    setIsLoaded(false);
    setLoadingProgress(0);
    
    // Clear any existing timeout
    if (loadTimeout) {
      clearTimeout(loadTimeout);
      setLoadTimeout(null);
    }
    
    // Force iframe reload
    if (iframeRef.current) {
      const currentSrc = iframeRef.current.src;
      iframeRef.current.src = '';
      setTimeout(() => {
        if (iframeRef.current) {
          iframeRef.current.src = currentSrc;
        }
      }, 100);
    }
    
    toast.info(`Retrying virtual tour... (${retryCount + 1}/${maxRetries})`);
  }, [currentError, retryCount, maxRetries, isOnline, loadTimeout]);
  
  const handleOpenExternal = () => {
    if (tourUrl) {
      window.open(tourUrl, '_blank', 'noopener,noreferrer');
    }
  };
  
  const getTourTypeLabel = (type: TourType): string => {
    switch (type) {
      case 'youtube': return 'YouTube Tour';
      case 'vimeo': return 'Vimeo Tour';
      case 'matterport': return '3D Virtual Tour';
      case 'iframe': return 'Virtual Tour';
      default: return 'Tour Unavailable';
    }
  };
  
  const getTourTypeColor = (type: TourType): string => {
    switch (type) {
      case 'youtube': return 'bg-red-600';
      case 'vimeo': return 'bg-blue-600';
      case 'matterport': return 'bg-purple-600';
      case 'iframe': return 'bg-cyan-600';
      default: return 'bg-gray-600';
    }
  };
  
  if (!tourUrl || tourType === 'unknown') {
    return (
      <Card className={`bg-slate-900/50 border-slate-800 ${className}`}>
        <CardContent className="p-0">
          <div className="relative h-[50vh] md:h-[60vh] bg-slate-800 rounded-lg overflow-hidden">
            <Image
              src={fallbackImage}
              alt={`${propertyTitle} - Property Image`}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="text-center text-white p-6">
                <AlertCircle className="h-12 w-12 mx-auto mb-4 text-yellow-500" />
                <h3 className="text-xl font-semibold mb-2">Virtual Tour Unavailable</h3>
                <p className="text-gray-300 mb-4">
                  No virtual tour is available for this property at the moment.
                </p>
                <Badge variant="secondary" className="bg-gray-600 text-white">
                  Coming Soon
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (hasError && currentError) {
    const getErrorIcon = () => {
      switch (currentError.type) {
        case 'network':
          return <svg className="h-20 w-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" /></svg>;
        case 'timeout':
          return <svg className="h-20 w-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
        case 'invalid_url':
        case 'unsupported':
          return <svg className="h-20 w-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>;
        default:
          return <svg className="h-20 w-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>;
      }
    };

    const getErrorColor = () => {
      switch (currentError.type) {
        case 'network': return 'text-orange-400';
        case 'timeout': return 'text-yellow-400';
        case 'invalid_url':
        case 'unsupported': return 'text-purple-400';
        default: return 'text-red-400';
      }
    };

    const getErrorTitle = () => {
      switch (currentError.type) {
        case 'network': return 'Connection Issue';
        case 'timeout': return 'Loading Timeout';
        case 'invalid_url': return 'Invalid URL';
        case 'unsupported': return 'Unsupported Format';
        default: return 'Virtual Tour Unavailable';
      }
    };

    const getErrorDescription = () => {
      switch (currentError.type) {
        case 'network': return isOnline ? 'Unable to connect to the tour service' : 'No internet connection detected';
        case 'timeout': return 'The virtual tour took too long to load';
        case 'invalid_url': return 'The tour URL appears to be invalid or inaccessible';
        case 'unsupported': return 'This tour format is not currently supported';
        default: return 'We\'re having trouble loading the virtual tour';
      }
    };

    return (
      <Card className={`bg-slate-900/50 border-slate-800 ${className}`}>
        <CardContent className="p-0">
          <div className="relative h-[50vh] md:h-[60vh] bg-slate-800 rounded-lg overflow-hidden">
            <Image
              src={fallbackImage}
              alt={`${propertyTitle} - Property Image`}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 to-slate-800/90 flex items-center justify-center">
              <div className="text-center text-white p-8 max-w-md">
                <div className={`${getErrorColor()} mb-6`}>
                  {getErrorIcon()}
                </div>
                <h3 className="text-white text-xl font-semibold mb-3">{getErrorTitle()}</h3>
                <p className="text-gray-400 mb-2">{getErrorDescription()}</p>
                <p className="text-gray-500 text-sm mb-6">
                  {currentError.code && `Error: ${currentError.code} • `}
                  Attempt {retryCount}/{maxRetries}
                  {!isOnline && ' • Offline'}
                </p>
                <div className="flex gap-3 justify-center flex-wrap">
                  {currentError.retryable && retryCount < maxRetries && (
                    <Button
                      onClick={handleRetry}
                      disabled={!isOnline && currentError.type === 'network'}
                      className="bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      {!isOnline && currentError.type === 'network' ? 'Waiting for Connection' : 'Retry'}
                    </Button>
                  )}
                  {tourUrl && (
                    <Button
                      onClick={handleOpenExternal}
                      variant="outline"
                      className="border-slate-600 text-white hover:bg-slate-700 px-6 py-3 rounded-xl font-semibold transition-all duration-300"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Open External
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className={`bg-slate-900/50 border-slate-800 ${className}`}>
      <CardContent className="p-0">
        <div 
          ref={containerRef}
          className={`relative ${isFullscreen ? 'fixed inset-0 z-50 bg-black' : 'h-[50vh] md:h-[60vh]'} rounded-lg overflow-hidden focus:outline-none`}
          tabIndex={0}
          role="application"
          aria-label={`Virtual tour for ${propertyTitle}`}
        >
          {/* Tour Type Badge */}
          <div className="absolute top-4 left-4 z-10">
            <Badge className={`${getTourTypeColor(tourType)} text-white`}>
              {getTourTypeLabel(tourType)}
            </Badge>
          </div>
          
          {/* Controls */}
          <div className="absolute top-4 right-4 z-10 flex gap-2 md:gap-3">
            {isPlaying && (
              <Button
                size="sm"
                variant="outline"
                onClick={handleStopTour}
                className="bg-slate-900/80 hover:bg-slate-800/90 text-white border border-slate-600/50 hover:border-red-500/50 backdrop-blur-sm transition-all duration-300 shadow-lg hover:shadow-red-500/25"
                title="Stop tour"
              >
                <Pause className="h-4 w-4" />
              </Button>
            )}
            {(tourType === 'youtube' || tourType === 'vimeo') && (
              <Button
                size="sm"
                variant="outline"
                onClick={toggleMute}
                className="bg-slate-900/80 hover:bg-slate-800/90 text-white border border-slate-600/50 hover:border-cyan-500/50 backdrop-blur-sm transition-all duration-300 shadow-lg hover:shadow-cyan-500/25"
                title={isMuted ? 'Unmute (M)' : 'Mute (M)'}
              >
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>
            )}
            <Button
              size="sm"
              variant="outline"
              onClick={toggleFullscreen}
              className="bg-slate-900/80 hover:bg-slate-800/90 text-white border border-slate-600/50 hover:border-cyan-500/50 backdrop-blur-sm transition-all duration-300 shadow-lg hover:shadow-cyan-500/25"
              title={isFullscreen ? 'Exit fullscreen (ESC)' : 'Fullscreen (F)'}
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleOpenExternal}
              className="bg-slate-900/80 hover:bg-slate-800/90 text-white border border-slate-600/50 hover:border-cyan-500/50 backdrop-blur-sm transition-all duration-300 shadow-lg hover:shadow-cyan-500/25"
              title="Open in new tab"
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
          
          {!isPlaying ? (
            // Preview/Thumbnail with Play Button
            <div className="relative h-full bg-slate-800">
              <Image
                src={fallbackImage}
                alt={`${propertyTitle} - Virtual Tour Preview`}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-black/40 to-slate-900/60 backdrop-blur-sm flex items-center justify-center">
                <div className="text-center">
                  <Button
                    onClick={handlePlayTour}
                    size="lg"
                    className="bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800 text-white rounded-full p-8 shadow-2xl hover:shadow-cyan-500/50 transition-all duration-300 transform hover:scale-110"
                  >
                    <Play className="h-10 w-10 ml-1" fill="currentColor" />
                  </Button>
                  <p className="text-white text-lg font-semibold mt-4">Start Virtual Tour</p>
                  <p className="text-gray-300 text-sm mt-1">Experience this property in 360°</p>
                </div>
              </div>
              <div className="absolute bottom-4 left-4 right-4">
                <div className="bg-black/70 backdrop-blur-sm rounded-lg p-4 text-white">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">Virtual Tour Available</h3>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-400' : 'bg-red-400'}`}></div>
                      <span className="text-xs text-gray-400">{isOnline ? 'Online' : 'Offline'}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-300 mb-2">
                    Experience this property in an immersive {getTourTypeLabel(tourType).toLowerCase()}
                  </p>
                  {loadingProgress > 0 && loadingProgress < 100 && (
                    <div className="mb-2">
                      <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                        <span>Loading...</span>
                        <span>{Math.round(loadingProgress)}%</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-1.5">
                        <div 
                          className="bg-gradient-to-r from-cyan-500 to-cyan-400 h-1.5 rounded-full transition-all duration-300"
                          style={{ width: `${loadingProgress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-4 text-xs text-gray-400">
                    <span>• Press Space or Enter to start</span>
                    <span className="hidden sm:inline">• Press F for fullscreen</span>
                    <span className="hidden md:inline">• Press M to mute</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Actual Tour Iframe
            tourType === 'matterport' ? (
              // Matterport with responsive wrapper
              <div style={{position: 'relative', width: '100%', paddingBottom: '56.25%'}}>
                <iframe
                  ref={iframeRef}
                  width="853"
                  height="480"
                  src={embedUrl}
                  title={`Virtual Tour of ${propertyTitle}`}
                  style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0}}
                  frameBorder="0"
                  allowFullScreen
                  allow="autoplay; fullscreen; web-share; xr-spatial-tracking"
                  onLoad={handleIframeLoad}
                  onError={handleIframeError}
                  loading="lazy"
                />
              </div>
            ) : (
              // Other tour types
              <iframe
                ref={iframeRef}
                src={`${embedUrl}${embedUrl.includes('?') ? '&' : '?'}autoplay=1${isMuted ? '&mute=1' : ''}`}
                title={`Virtual Tour of ${propertyTitle}`}
                className="w-full h-full border-0"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                onLoad={handleIframeLoad}
                onError={handleIframeError}
                loading="lazy"
              />
            )
          )}
          
          {/* Enhanced Loading Indicator */}
          {isPlaying && !isLoaded && (
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
              <div className="text-white text-center max-w-sm mx-auto px-6">
                <div className="relative mb-8">
                  <div className="animate-spin rounded-full h-20 w-20 border-4 border-slate-600 border-t-cyan-500 mx-auto"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-cyan-400 font-bold text-sm">{Math.round(loadingProgress)}%</span>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-slate-700 rounded-full h-2 mb-4">
                  <div 
                    className="bg-gradient-to-r from-cyan-500 to-cyan-400 h-2 rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${loadingProgress}%` }}
                  ></div>
                </div>
                
                <p className="text-gray-300 text-lg font-medium mb-2">Loading virtual tour...</p>
                <p className="text-gray-500 text-sm">Preparing immersive experience</p>
                
                {retryCount > 0 && (
                  <p className="text-yellow-400 text-xs mt-3">Retry attempt {retryCount}</p>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}