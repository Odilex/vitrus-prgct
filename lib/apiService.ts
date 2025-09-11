// API Service for database operations
import { useAuthStore } from './auth';

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://vitrus-backend.onrender.com/api/v1' 
  : 'http://localhost:5000/api/v1';

// Types
export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  bedrooms: number;
  bathrooms: number;
  squareFootage: number;
  propertyType: 'house' | 'apartment' | 'condo' | 'townhouse' | 'villa' | 'other';
  status: 'active' | 'pending' | 'sold' | 'inactive';
  images: string[];
  features: string[];
  featured?: boolean;
  virtualTourUrl?: string;
  views?: number;
  createdAt: string;
  updatedAt: string;
  agentId?: string;
  listingDate: string;
  yearBuilt?: number;
  lotSize?: number;
  parkingSpaces?: number;
  hasGarage?: boolean;
  hasPool?: boolean;
  hasGarden?: boolean;
  petFriendly?: boolean;
  furnished?: boolean;
  owner?: {
    name: string;
    email: string;
    phone: string;
    whatsapp: string;
  };
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  preferences: {
    propertyType: string;
    budget: {
      min: number;
      max: number;
    };
    location: string;
  };
  status: 'active' | 'inactive';
  createdAt?: string;
  updatedAt?: string;
}

export interface Tour {
  id: string;
  propertyId: string;
  clientId: string;
  scheduledDate: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiError {
  type: 'network' | 'server' | 'client' | 'timeout' | 'validation' | 'auth' | 'not_found' | 'rate_limit' | 'unknown';
  message: string;
  code?: string | number;
  details?: Record<string, unknown>;
  timestamp: string;
  retryable: boolean;
  retryAfter?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
  message?: string;
}

export interface ApiRequestOptions extends RequestInit {
  timeout?: number;
  retries?: number;
  retryDelay?: number;
  skipRetryOn?: number[];
}

// Enhanced error creation utility
function createApiError(
  type: ApiError['type'],
  message: string,
  code?: string | number,
  details?: Record<string, unknown>,
  retryable: boolean = false,
  retryAfter?: number
): ApiError {
  return {
    type,
    message,
    code,
    details,
    timestamp: new Date().toISOString(),
    retryable,
    retryAfter
  };
}

// Network connectivity check
function isOnline(): boolean {
  return typeof navigator !== 'undefined' ? navigator.onLine : true;
}

// Timeout wrapper for fetch
function fetchWithTimeout(url: string, options: RequestInit, timeout: number = 30000): Promise<Response> {
  return new Promise((resolve, reject) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
      reject(createApiError('timeout', `Request timeout after ${timeout}ms`, 'TIMEOUT', { url, timeout }, true));
    }, timeout);

    fetch(url, { ...options, signal: controller.signal })
      .then(resolve)
      .catch(reject)
      .finally(() => clearTimeout(timeoutId));
  });
}

// Enhanced API request function with retry logic
async function apiRequest<T>(
  endpoint: string,
  options: ApiRequestOptions = {}
): Promise<ApiResponse<T>> {
  const {
    timeout = 30000,
    retries = 3,
    retryDelay = 1000,
    skipRetryOn = [400, 401, 403, 404, 422],
    ...fetchOptions
  } = options;

  let lastError: ApiError | undefined;
  
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      // Check network connectivity
      if (!isOnline()) {
        throw createApiError(
          'network',
          'No internet connection available',
          'OFFLINE',
          { attempt, maxRetries: retries },
          true
        );
      }

      // Get authentication headers from auth store
      const authStore = useAuthStore.getState();
      const authHeaders = authStore.getAuthHeaders();

      const url = `${API_BASE_URL}${endpoint}`;
      const response = await fetchWithTimeout(url, {
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders,
          ...fetchOptions.headers,
        },
        ...fetchOptions,
      }, timeout);

      // Handle different response types
      let data: unknown;
      const contentType = response.headers.get('content-type');
      
      if (contentType?.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      if (!response.ok) {
        const errorType = getErrorType(response.status);
        const shouldRetry = !skipRetryOn.includes(response.status) && attempt < retries;
        
        const apiError = createApiError(
          errorType,
          (data as any)?.message || (data as any)?.error || `HTTP ${response.status}: ${response.statusText}`,
          response.status,
          { 
            url, 
            attempt: attempt + 1, 
            maxRetries: retries + 1,
            responseData: data 
          },
          shouldRetry,
          response.headers.get('retry-after') ? parseInt(response.headers.get('retry-after')!) * 1000 : undefined
        );

        if (!shouldRetry) {
          return { success: false, error: apiError };
        }
        
        lastError = apiError;
        
        // Wait before retry
        const delay = apiError.retryAfter || retryDelay * Math.pow(2, attempt);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }

      return {
        success: true,
        data: (data as any)?.data || data,
        message: (data as any)?.message
      };
      
    } catch (error) {
      const isLastAttempt = attempt === retries;
      
      if (error instanceof Error && error.name === 'AbortError') {
        lastError = createApiError('timeout', 'Request was aborted', 'ABORTED', { attempt: attempt + 1 }, !isLastAttempt);
      } else if (error && typeof error === 'object' && 'type' in error) {
        lastError = error as ApiError;
      } else {
        lastError = createApiError(
          'unknown',
          error instanceof Error ? error.message : 'Unknown error occurred',
          'UNKNOWN',
          { attempt: attempt + 1, originalError: error },
          !isLastAttempt
        );
      }

      if (isLastAttempt || !lastError.retryable) {
        console.error('API request failed:', { endpoint, error: lastError, attempt: attempt + 1 });
        break;
      }

      // Wait before retry
      const delay = retryDelay * Math.pow(2, attempt);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  // Fallback error if none was set
  const finalError = lastError || createApiError('unknown', 'Request failed after all retries', 'UNKNOWN', {}, false);

  return { success: false, error: finalError };
}

// Helper function to determine error type from status code
function getErrorType(status: number): ApiError['type'] {
  if (status >= 400 && status < 500) {
    switch (status) {
      case 401: return 'auth';
      case 404: return 'not_found';
      case 422: return 'validation';
      case 429: return 'rate_limit';
      default: return 'client';
    }
  }
  if (status >= 500) return 'server';
  return 'unknown';
}

// Property API functions with enhanced error handling
export const propertyApi = {
  // Get all properties
  getAll: async (filters?: { status?: string; type?: string; location?: string }): Promise<ApiResponse<Property[]>> => {
    try {
      const queryParams = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value) queryParams.append(key, value);
        });
      }
      const endpoint = `/properties${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      return await apiRequest<Property[]>(endpoint, {
        timeout: 15000,
        retries: 2
      });
    } catch (error) {
      return {
        success: false,
        error: createApiError('unknown', 'Failed to fetch properties', 'FETCH_ERROR', { filters }, false)
      };
    }
  },

  // Get property by ID
  getById: async (id: string): Promise<ApiResponse<Property>> => {
    if (!id || typeof id !== 'string' || id.trim() === '') {
      return {
        success: false,
        error: createApiError('validation', 'Property ID is required', 'INVALID_ID', { id }, false)
      };
    }

    return await apiRequest<Property>(`/properties/${encodeURIComponent(id)}`, {
      timeout: 10000,
      retries: 2
    });
  },

  // Create new property
  create: async (property: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Property>> => {
    // Validate required fields
    const requiredFields = ['title', 'price', 'address', 'propertyType'];
    const missingFields = requiredFields.filter(field => !property[field as keyof typeof property]);
    
    if (missingFields.length > 0) {
      return {
        success: false,
        error: createApiError(
          'validation',
          `Missing required fields: ${missingFields.join(', ')}`,
          'MISSING_FIELDS',
          { missingFields, property },
          false
        )
      };
    }

    // Validate price
    if (typeof property.price !== 'number' || property.price <= 0) {
      return {
        success: false,
        error: createApiError('validation', 'Price must be a positive number', 'INVALID_PRICE', { price: property.price }, false)
      };
    }

    return await apiRequest<Property>('/properties', {
      method: 'POST',
      body: JSON.stringify(property),
      timeout: 20000,
      retries: 1
    });
  },

  // Update property
  update: async (id: string, property: Partial<Property>): Promise<ApiResponse<Property>> => {
    if (!id || typeof id !== 'string' || id.trim() === '') {
      return {
        success: false,
        error: createApiError('validation', 'Property ID is required', 'INVALID_ID', { id }, false)
      };
    }

    if (!property || Object.keys(property).length === 0) {
      return {
        success: false,
        error: createApiError('validation', 'No update data provided', 'NO_UPDATE_DATA', { property }, false)
      };
    }

    // Validate price if provided
    if (property.price !== undefined && (typeof property.price !== 'number' || property.price <= 0)) {
      return {
        success: false,
        error: createApiError('validation', 'Price must be a positive number', 'INVALID_PRICE', { price: property.price }, false)
      };
    }

    return await apiRequest<Property>(`/properties/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify(property),
      timeout: 20000,
      retries: 1
    });
  },

  // Delete property
  delete: async (id: string): Promise<ApiResponse<void>> => {
    if (!id || typeof id !== 'string' || id.trim() === '') {
      return {
        success: false,
        error: createApiError('validation', 'Property ID is required', 'INVALID_ID', { id }, false)
      };
    }

    return await apiRequest<void>(`/properties/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      timeout: 15000,
      retries: 1,
      skipRetryOn: [400, 401, 403, 404] // Don't retry client errors
    });
  },

  // Delete multiple properties
  deleteMultiple: async (ids: string[]): Promise<ApiResponse<void>> => {
    if (!Array.isArray(ids) || ids.length === 0) {
      return {
        success: false,
        error: createApiError('validation', 'Property IDs array is required', 'INVALID_IDS', { ids }, false)
      };
    }

    const invalidIds = ids.filter(id => !id || typeof id !== 'string' || id.trim() === '');
    if (invalidIds.length > 0) {
      return {
        success: false,
        error: createApiError('validation', 'All property IDs must be valid strings', 'INVALID_IDS', { invalidIds }, false)
      };
    }

    return await apiRequest<void>('/properties/bulk-delete', {
      method: 'DELETE',
      body: JSON.stringify({ ids }),
      timeout: 30000,
      retries: 1
    });
  },
};

// Client API functions with enhanced error handling
export const clientApi = {
  // Get all clients
  getAll: async (filters?: { status?: string }): Promise<ApiResponse<Client[]>> => {
    try {
      const queryParams = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value) queryParams.append(key, value);
        });
      }
      const endpoint = `/clients${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      return await apiRequest<Client[]>(endpoint, {
        timeout: 15000,
        retries: 2
      });
    } catch (error) {
      return {
        success: false,
        error: createApiError('unknown', 'Failed to fetch clients', 'FETCH_ERROR', { filters }, false)
      };
    }
  },

  // Get client by ID
  getById: async (id: string): Promise<ApiResponse<Client>> => {
    if (!id || typeof id !== 'string' || id.trim() === '') {
      return {
        success: false,
        error: createApiError('validation', 'Client ID is required', 'INVALID_ID', { id }, false)
      };
    }

    return await apiRequest<Client>(`/clients/${encodeURIComponent(id)}`, {
      timeout: 10000,
      retries: 2
    });
  },

  // Create new client
  create: async (client: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Client>> => {
    return apiRequest<Client>('/clients', {
      method: 'POST',
      body: JSON.stringify(client),
    });
  },

  // Update client
  update: async (id: string, client: Partial<Client>): Promise<ApiResponse<Client>> => {
    return apiRequest<Client>(`/clients/${id}`, {
      method: 'PUT',
      body: JSON.stringify(client),
    });
  },

  // Delete client
  delete: async (id: string): Promise<ApiResponse<void>> => {
    return apiRequest<void>(`/clients/${id}`, {
      method: 'DELETE',
    });
  },
};

// Tour API functions
export const tourApi = {
  // Get all tours
  getAll: async (filters?: { status?: string; propertyId?: string; clientId?: string }): Promise<ApiResponse<Tour[]>> => {
    const queryParams = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });
    }
    const endpoint = `/tours${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return apiRequest<Tour[]>(endpoint);
  },

  // Get tour by ID
  getById: async (id: string): Promise<ApiResponse<Tour>> => {
    return apiRequest<Tour>(`/tours/${id}`);
  },

  // Create new tour
  create: async (tour: Omit<Tour, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Tour>> => {
    return apiRequest<Tour>('/tours', {
      method: 'POST',
      body: JSON.stringify(tour),
    });
  },

  // Update tour
  update: async (id: string, tour: Partial<Tour>): Promise<ApiResponse<Tour>> => {
    return apiRequest<Tour>(`/tours/${id}`, {
      method: 'PUT',
      body: JSON.stringify(tour),
    });
  },

  // Delete tour
  delete: async (id: string): Promise<ApiResponse<void>> => {
    return apiRequest<void>(`/tours/${id}`, {
      method: 'DELETE',
    });
  },
};

// Analytics API functions
export const analyticsApi = {
  // Get dashboard statistics
  getDashboardStats: async (): Promise<ApiResponse<{
    totalProperties: number;
    activeProperties: number;
    totalClients: number;
    scheduledTours: number;
    recentActivity: Array<{ id: string; type: string; timestamp: string; description: string }>;
  }>> => {
    return apiRequest('/analytics/dashboard');
  },

  // Get property analytics
  getPropertyAnalytics: async (): Promise<ApiResponse<{
    salesData: Array<{ date: string; value: number }>;
    propertyTypes: Array<{ type: string; count: number }>;
    locationData: Array<{ location: string; count: number }>;
    priceRanges: Array<{ range: string; count: number }>;
  }>> => {
    return apiRequest('/analytics/properties');
  },
};

// Settings API functions
export const settingsApi = {
  // Get user settings
  getUserSettings: async (userId: string): Promise<ApiResponse<Record<string, unknown>>> => {
    return apiRequest(`/settings/user/${userId}`);
  },

  // Update user settings
  updateUserSettings: async (userId: string, settings: Record<string, unknown>): Promise<ApiResponse<Record<string, unknown>>> => {
    return apiRequest(`/settings/user/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
  },

  // Get system settings
  getSystemSettings: async (): Promise<ApiResponse<Record<string, unknown>>> => {
    return apiRequest('/settings/system');
  },

  // Update system settings
  updateSystemSettings: async (settings: Record<string, unknown>): Promise<ApiResponse<Record<string, unknown>>> => {
    return apiRequest('/settings/system', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
  },
};

const apiService = {
  propertyApi,
  clientApi,
  tourApi,
  analyticsApi,
  settingsApi,
};

export default apiService;