// Centralized error handling utilities
import { toast } from 'sonner';
import { ApiError } from './apiService';

export interface ErrorHandlerOptions {
  showToast?: boolean;
  logError?: boolean;
  fallbackMessage?: string;
  onRetry?: () => void;
  context?: string;
}

export class ErrorHandler {
  private static readonly DEFAULT_MESSAGES = {
    network: 'Network connection failed. Please check your internet connection.',
    server: 'Server error occurred. Please try again later.',
    client: 'Invalid request. Please check your input.',
    timeout: 'Request timed out. Please try again.',
    validation: 'Validation failed. Please check your input.',
    auth: 'Authentication failed. Please log in again.',
    not_found: 'Requested resource not found.',
    rate_limit: 'Too many requests. Please wait before trying again.',
    unknown: 'An unexpected error occurred. Please try again.'
  };

  static handle(
    error: ApiError | Error | unknown,
    options: ErrorHandlerOptions = {}
  ): string {
    const {
      showToast = true,
      logError = true,
      fallbackMessage = 'An error occurred',
      onRetry,
      context
    } = options;

    let processedError: ApiError;

    // Convert different error types to ApiError
    if (this.isApiError(error)) {
      processedError = error;
    } else if (error instanceof Error) {
      processedError = {
        type: 'unknown',
        message: error.message,
        timestamp: new Date().toISOString(),
        retryable: false
      };
    } else {
      processedError = {
        type: 'unknown',
        message: fallbackMessage,
        timestamp: new Date().toISOString(),
        retryable: false
      };
    }

    // Log error if enabled
    if (logError) {
      console.error(`[ErrorHandler${context ? ` - ${context}` : ''}]:`, {
        error: processedError,
        timestamp: new Date().toISOString()
      });
    }

    // Get user-friendly message
    const userMessage = this.getUserMessage(processedError);

    // Show toast notification if enabled
    if (showToast) {
      this.showErrorToast(processedError, userMessage, onRetry);
    }

    return userMessage;
  }

  private static isApiError(error: unknown): error is ApiError {
    return (
      typeof error === 'object' &&
      error !== null &&
      'type' in error &&
      'message' in error &&
      'timestamp' in error
    );
  }

  private static getUserMessage(error: ApiError): string {
    // Use custom message if it's user-friendly, otherwise use default
    const defaultMessage = this.DEFAULT_MESSAGES[error.type] || this.DEFAULT_MESSAGES.unknown;
    
    // Check if the error message is technical (contains common technical terms)
    const technicalTerms = [
      'fetch', 'xhr', 'cors', 'json', 'parse', 'undefined', 'null',
      'status', 'response', 'request', 'timeout', 'abort', 'network'
    ];
    
    const isTechnical = technicalTerms.some(term => 
      error.message.toLowerCase().includes(term)
    );
    
    return isTechnical ? defaultMessage : error.message;
  }

  private static showErrorToast(
    error: ApiError,
    message: string,
    onRetry?: () => void
  ): void {
    const toastOptions: Record<string, unknown> = {
      duration: error.type === 'network' ? 10000 : 5000,
    };

    // Add retry action for retryable errors
    if (error.retryable && onRetry) {
      toastOptions.action = {
        label: 'Retry',
        onClick: onRetry
      };
    }

    // Show different toast types based on error severity
    switch (error.type) {
      case 'network':
      case 'timeout':
        toast.error(message, {
          ...toastOptions,
          description: 'Please check your connection and try again.'
        });
        break;
      
      case 'auth':
        toast.error(message, {
          ...toastOptions,
          description: 'You may need to log in again.'
        });
        break;
      
      case 'validation':
        toast.warning(message, {
          ...toastOptions,
          description: 'Please review your input and try again.'
        });
        break;
      
      case 'rate_limit':
        toast.warning(message, {
          ...toastOptions,
          description: error.retryAfter 
            ? `Please wait ${Math.ceil(error.retryAfter / 1000)} seconds.`
            : 'Please wait a moment before trying again.'
        });
        break;
      
      default:
        toast.error(message, toastOptions);
    }
  }

  // Utility method for handling API responses
  static handleApiResponse<T>(
    response: { success: boolean; data?: T; error?: ApiError },
    options: ErrorHandlerOptions = {}
  ): T | null {
    if (response.success && response.data) {
      return response.data;
    }

    if (response.error) {
      this.handle(response.error, options);
    } else {
      this.handle(new Error('Unknown API error'), options);
    }

    return null;
  }

  // Utility method for wrapping async operations
  static async withErrorHandling<T>(
    operation: () => Promise<T>,
    options: ErrorHandlerOptions = {}
  ): Promise<T | null> {
    try {
      return await operation();
    } catch (error) {
      this.handle(error, options);
      return null;
    }
  }

  // Method to create error boundary compatible errors
  static createBoundaryError(
    error: ApiError | Error | unknown,
    context?: string
  ): Error {
    if (error instanceof Error) {
      return error;
    }

    if (this.isApiError(error)) {
      const boundaryError = new Error(error.message);
      boundaryError.name = `ApiError_${error.type}`;
      (boundaryError as Error & { apiError?: ApiError; context?: string }).apiError = error;
      (boundaryError as Error & { apiError?: ApiError; context?: string }).context = context;
      return boundaryError;
    }

    const boundaryError = new Error('Unknown error occurred');
    boundaryError.name = 'UnknownError';
    (boundaryError as Error & { originalError?: unknown; context?: string }).originalError = error;
    (boundaryError as Error & { originalError?: unknown; context?: string }).context = context;
    return boundaryError;
  }
}

// Export convenience functions
export const handleError = ErrorHandler.handle.bind(ErrorHandler);
export const handleApiResponse = ErrorHandler.handleApiResponse.bind(ErrorHandler);
export const withErrorHandling = ErrorHandler.withErrorHandling.bind(ErrorHandler);
export const createBoundaryError = ErrorHandler.createBoundaryError.bind(ErrorHandler);