// API Service for database operations
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-backend-url.com/api' 
  : 'http://localhost:5000/api/v1';

// Types
export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  type: string;
  bedrooms: number;
  bathrooms: number;
  square_feet: number;
  images: string[];
  virtualTour?: string;
  amenities: string[];
  status: 'active' | 'sold' | 'pending' | 'inactive';
  owner: {
    name: string;
    contact: string;
  };
  createdAt?: string;
  updatedAt?: string;
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

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Generic API request function
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || `HTTP error! status: ${response.status}`,
      };
    }

    return {
      success: true,
      data: data.data || data,
    };
  } catch (error) {
    console.error('API request failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

// Property API functions
export const propertyApi = {
  // Get all properties
  getAll: async (filters?: { status?: string; type?: string; location?: string }): Promise<ApiResponse<Property[]>> => {
    const queryParams = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });
    }
    const endpoint = `/properties${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return apiRequest<Property[]>(endpoint);
  },

  // Get property by ID
  getById: async (id: string): Promise<ApiResponse<Property>> => {
    return apiRequest<Property>(`/properties/${id}`);
  },

  // Create new property
  create: async (property: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Property>> => {
    return apiRequest<Property>('/properties', {
      method: 'POST',
      body: JSON.stringify(property),
    });
  },

  // Update property
  update: async (id: string, property: Partial<Property>): Promise<ApiResponse<Property>> => {
    return apiRequest<Property>(`/properties/${id}`, {
      method: 'PUT',
      body: JSON.stringify(property),
    });
  },

  // Delete property
  delete: async (id: string): Promise<ApiResponse<void>> => {
    return apiRequest<void>(`/properties/${id}`, {
      method: 'DELETE',
    });
  },

  // Delete multiple properties
  deleteMultiple: async (ids: string[]): Promise<ApiResponse<void>> => {
    return apiRequest<void>('/properties/bulk-delete', {
      method: 'DELETE',
      body: JSON.stringify({ ids }),
    });
  },
};

// Client API functions
export const clientApi = {
  // Get all clients
  getAll: async (filters?: { status?: string }): Promise<ApiResponse<Client[]>> => {
    const queryParams = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });
    }
    const endpoint = `/clients${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return apiRequest<Client[]>(endpoint);
  },

  // Get client by ID
  getById: async (id: string): Promise<ApiResponse<Client>> => {
    return apiRequest<Client>(`/clients/${id}`);
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