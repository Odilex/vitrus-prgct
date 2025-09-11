// Property data management with API integration

export interface Property {
  id: string;
  title: string;
  description: string;
  price?: string;
  location: string;
  type: string;
  bedrooms: number;
  bathrooms: number;
  square_feet: number;
  images: string[];
  featured: boolean;
  status: string;
  amenities: string[];
  owner: {
    name: string;
    phone: string;
    email: string;
    whatsapp: string;
    photo: string;
  };
  // Additional fields used in property detail page
  rooms?: number;
  floors?: number;
  features?: string[];
  tourUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PropertyFilters {
  type?: string;
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  featured?: boolean;
  status?: string;
}

export interface PropertyResponse {
  properties: Property[];
  total: number;
  page: number;
  limit: number;
}

// API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || (process.env.NODE_ENV === 'production' ? 'https://vitrus-backend.onrender.com/api/v1' : 'http://localhost:5000/api/v1');

// Import auth store for authentication
import { useAuthStore } from './auth';

// Property API service
export class PropertyService {
  static async getAllProperties(filters?: PropertyFilters): Promise<PropertyResponse> {
    try {
      const queryParams = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            queryParams.append(key, value.toString());
          }
        });
      }
      
      const response = await fetch(`${API_BASE_URL}/properties?${queryParams}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch properties: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching properties:', error);
      // Return empty result on error
      return {
        properties: [],
        total: 0,
        page: 1,
        limit: 10
      };
    }
  }

  static async getPropertyById(id: string): Promise<Property | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/properties/${id}`);
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`Failed to fetch property: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching property:', error);
      return null;
    }
  }

  static async createProperty(property: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>): Promise<Property | null> {
    try {
      const authStore = useAuthStore.getState();
      const authHeaders = authStore.getAuthHeaders();
      
      const response = await fetch(`${API_BASE_URL}/properties`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders,
        },
        body: JSON.stringify(property),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to create property: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating property:', error);
      return null;
    }
  }

  static async updateProperty(id: string, updates: Partial<Property>): Promise<Property | null> {
    try {
      const authStore = useAuthStore.getState();
      const authHeaders = authStore.getAuthHeaders();
      
      const response = await fetch(`${API_BASE_URL}/properties/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders,
        },
        body: JSON.stringify(updates),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to update property: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating property:', error);
      return null;
    }
  }

  static async deleteProperty(id: string): Promise<boolean> {
    try {
      const authStore = useAuthStore.getState();
      const authHeaders = authStore.getAuthHeaders();
      
      const response = await fetch(`${API_BASE_URL}/properties/${id}`, {
        method: 'DELETE',
        headers: {
          ...authHeaders,
        },
      });
      
      return response.ok;
    } catch (error) {
      console.error('Error deleting property:', error);
      return false;
    }
  }

  static async getFeaturedProperties(): Promise<Property[]> {
    try {
      const response = await this.getAllProperties({ featured: true });
      return response.properties;
    } catch (error) {
      console.error('Error fetching featured properties:', error);
      return [];
    }
  }
}

// Legacy export for backward compatibility - will fetch from API
export const getProperties = async (): Promise<Property[]> => {
  const response = await PropertyService.getAllProperties();
  return response.properties;
};

// Default empty array for initial state
export const properties: Property[] = [];