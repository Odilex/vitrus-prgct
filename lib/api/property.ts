import { Property } from '../types/property';
import { AuthService } from '../auth';
import { mockProperties } from '../data/mock-properties';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || (process.env.NODE_ENV === 'production' ? 'https://vitrus-backend.onrender.com/api/v1' : 'http://localhost:5000/api/v1');

// Force deployment refresh

// Custom error types for better error handling
export class PropertyError extends Error {
  constructor(message: string, public code: string, public status?: number) {
    super(message);
    this.name = 'PropertyError';
  }
}

export class NetworkError extends PropertyError {
  constructor(message: string = 'Network connection failed') {
    super(message, 'NETWORK_ERROR');
  }
}

export class ValidationError extends PropertyError {
  constructor(message: string, public field?: string) {
    super(message, 'VALIDATION_ERROR', 400);
  }
}

export class NotFoundError extends PropertyError {
  constructor(message: string = 'Property not found') {
    super(message, 'NOT_FOUND', 404);
  }
}

export class UnauthorizedError extends PropertyError {
  constructor(message: string = 'Unauthorized access') {
    super(message, 'UNAUTHORIZED', 401);
  }
}

// Retry configuration
const RETRY_CONFIG = {
  maxRetries: 3,
  baseDelay: 1000,
  maxDelay: 5000,
};

// Utility function for retrying requests
async function withRetry<T>(fn: () => Promise<T>, retries = RETRY_CONFIG.maxRetries): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (retries > 0 && (error instanceof NetworkError || (error instanceof PropertyError && error.status && error.status >= 500))) {
      const delay = Math.min(RETRY_CONFIG.baseDelay * (RETRY_CONFIG.maxRetries - retries + 1), RETRY_CONFIG.maxDelay);
      await new Promise(resolve => setTimeout(resolve, delay));
      return withRetry(fn, retries - 1);
    }
    throw error;
  }
}

// Database property interface
interface DbProperty {
  id: string;
  title: string;
  description?: string;
  price?: number;
  address?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  bedrooms?: number;
  bathrooms?: number;
  square_feet?: number;
  property_type?: string;
  status?: string;
  images?: string[];
  features?: string[];
  year_built?: number;
  lot_size?: number;
  garage_spaces?: number;
  listing_agent?: string;
  created_at?: string;
  updated_at?: string;
  user_id?: string;
  virtual_tour_url?: string;
  views_count?: number;
  agent_id?: string;
  listing_date?: string;
  amenities?: string[];
}

// Transform database property to frontend Property interface
function transformProperty(dbProperty: DbProperty): Property {
  return {
    id: dbProperty.id,
    title: dbProperty.title,
    description: dbProperty.description || '',
    price: dbProperty.price || 0,
    address: dbProperty.address || '',
    city: dbProperty.city || '',
    state: dbProperty.state || '',
    zipCode: dbProperty.postal_code || '',
    bedrooms: dbProperty.bedrooms || 0,
    bathrooms: dbProperty.bathrooms || 0,
    squareFootage: dbProperty.square_feet || 0,
    propertyType: (dbProperty.property_type as 'house' | 'apartment' | 'condo' | 'townhouse' | 'villa' | 'other') || 'other',
    status: (dbProperty.status as 'active' | 'pending' | 'sold' | 'inactive') || 'active',
    images: Array.isArray(dbProperty.images) ? dbProperty.images : [],
    features: Array.isArray(dbProperty.features) ? dbProperty.features : [],
    virtualTourUrl: dbProperty.virtual_tour_url,
    views: dbProperty.views_count || 0,
    createdAt: dbProperty.created_at || new Date().toISOString(),
    updatedAt: dbProperty.updated_at || new Date().toISOString(),
    agentId: dbProperty.agent_id,
    listingDate: dbProperty.listing_date || new Date().toISOString(),
    yearBuilt: dbProperty.year_built,
    lotSize: dbProperty.lot_size,
    parkingSpaces: dbProperty.garage_spaces,
    hasGarage: (dbProperty.garage_spaces || 0) > 0,
    hasPool: Array.isArray(dbProperty.amenities) ? dbProperty.amenities.includes('Swimming Pool') : false,
    hasGarden: Array.isArray(dbProperty.amenities) ? dbProperty.amenities.includes('Garden') : false,
    petFriendly: Array.isArray(dbProperty.features) ? dbProperty.features.includes('Pet Friendly') : false,
    furnished: Array.isArray(dbProperty.features) ? dbProperty.features.includes('Furnished') : false,
  };
}

class PropertyService {
  async getAll(): Promise<Property[]> {
    return withRetry(async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/properties`);
        
        if (!response.ok) {
          if (response.status === 401) {
            throw new UnauthorizedError('Authentication required to fetch properties');
          }
          if (response.status >= 500) {
            throw new PropertyError(`Server error: ${response.status}`, 'SERVER_ERROR', response.status);
          }
          throw new PropertyError(`Failed to fetch properties: ${response.status}`, 'FETCH_ERROR', response.status);
        }
        
        const data = await response.json();
        const properties = data.properties || [];
        return properties.map(transformProperty);
      } catch (error) {
        if (error instanceof PropertyError) {
          throw error;
        }
        if (error instanceof TypeError && error.message.includes('fetch')) {
          throw new NetworkError('Failed to connect to server');
        }
        console.error('Error fetching properties, using mock data:', error);
        // Return mock data as fallback
        return mockProperties;
      }
    });
  }

  async getById(id: string): Promise<Property | null> {
    if (!id || typeof id !== 'string' || id.trim() === '') {
      throw new ValidationError('Property ID is required and must be a valid string', 'id');
    }

    return withRetry(async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/properties/${encodeURIComponent(id)}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new NotFoundError(`Property with ID ${id} not found`);
          }
          if (response.status === 401) {
            throw new UnauthorizedError('Authentication required to fetch property');
          }
          if (response.status >= 500) {
            throw new PropertyError(`Server error: ${response.status}`, 'SERVER_ERROR', response.status);
          }
          throw new PropertyError(`Failed to fetch property: ${response.status}`, 'FETCH_ERROR', response.status);
        }
        
        const data = await response.json();
        if (!data.property) {
          throw new PropertyError('Invalid response format: missing property data', 'INVALID_RESPONSE');
        }
        return transformProperty(data.property);
      } catch (error) {
        if (error instanceof PropertyError) {
          throw error;
        }
        if (error instanceof TypeError && error.message.includes('fetch')) {
          throw new NetworkError('Failed to connect to server');
        }
        console.error('Error fetching property, using mock data:', error);
        // Return mock data as fallback
        return mockProperties.find(p => p.id === id) || null;
      }
    });
  }

  async create(property: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>): Promise<Property> {
    try {
      const data = await AuthService.makeAuthenticatedRequest<{ property: Property }>('/properties', {
        method: 'POST',
        body: JSON.stringify(property),
      });
      return data.property;
    } catch (error) {
      console.error('Error creating property:', error);
      throw error;
    }
  }

  async update(id: string, property: Partial<Property>): Promise<Property> {
    try {
      const data = await AuthService.makeAuthenticatedRequest<{ property: Property }>(`/properties/${id}`, {
        method: 'PUT',
        body: JSON.stringify(property),
      });
      return data.property;
    } catch (error) {
      console.error('Error updating property:', error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await AuthService.makeAuthenticatedRequest<void>(`/properties/${id}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error('Error deleting property:', error);
      throw error;
    }
  }
}

export const propertyService = new PropertyService();
export default propertyService;