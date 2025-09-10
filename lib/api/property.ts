import { Property } from '../types/property';
import { AuthService } from '../auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

// Transform database property to frontend Property interface
function transformProperty(dbProperty: any): Property {
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
    propertyType: dbProperty.property_type || 'other',
    status: dbProperty.status || 'active',
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
    hasGarage: dbProperty.garage_spaces > 0,
    hasPool: Array.isArray(dbProperty.amenities) ? dbProperty.amenities.includes('Swimming Pool') : false,
    hasGarden: Array.isArray(dbProperty.amenities) ? dbProperty.amenities.includes('Garden') : false,
    petFriendly: Array.isArray(dbProperty.features) ? dbProperty.features.includes('Pet Friendly') : false,
    furnished: Array.isArray(dbProperty.features) ? dbProperty.features.includes('Furnished') : false,
  };
}

class PropertyService {
  async getAll(): Promise<Property[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/properties`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const properties = data.properties || [];
      return properties.map(transformProperty);
    } catch (error) {
      console.error('Error fetching properties:', error);
      throw error;
    }
  }

  async getById(id: string): Promise<Property | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/properties/${id}`);
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const property = data.property || data;
      return property ? transformProperty(property) : null;
    } catch (error) {
      console.error('Error fetching property:', error);
      throw error;
    }
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