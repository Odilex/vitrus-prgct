// Enhanced Property Service with comprehensive error handling
import { propertyApi, ApiResponse } from './apiService';
import { Property } from './types/property';
import { ErrorHandler, handleApiResponse, withErrorHandling } from './errorHandler';
import { toast } from 'sonner';

export interface PropertyFilters {
  status?: string;
  type?: string;
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
}

export interface PropertyServiceOptions {
  showToasts?: boolean;
  logErrors?: boolean;
  context?: string;
}

export class PropertyService {
  private static readonly DEFAULT_OPTIONS: PropertyServiceOptions = {
    showToasts: true,
    logErrors: true,
    context: 'PropertyService'
  };

  // Get all properties with enhanced error handling
  static async getAll(
    filters?: PropertyFilters,
    options: PropertyServiceOptions = {}
  ): Promise<Property[] | null> {
    const opts = { ...this.DEFAULT_OPTIONS, ...options };
    
    return withErrorHandling(async () => {
      const response = await propertyApi.getAll(filters);
      const data = handleApiResponse(response, {
        showToast: opts.showToasts,
        logError: opts.logErrors,
        context: `${opts.context}.getAll`,
        fallbackMessage: 'Failed to load properties'
      });
      
      if (data && opts.showToasts && data.length === 0) {
        toast.info('No properties found matching your criteria');
      }
      
      return data || [];
    }, {
      showToast: opts.showToasts,
      logError: opts.logErrors,
      context: `${opts.context}.getAll`,
      fallbackMessage: 'Failed to load properties'
    });
  }

  // Get property by ID with enhanced error handling
  static async getById(
    id: string,
    options: PropertyServiceOptions = {}
  ): Promise<Property | null> {
    const opts = { ...this.DEFAULT_OPTIONS, ...options };
    
    if (!id) {
      if (opts.showToasts) {
        toast.error('Property ID is required');
      }
      return null;
    }

    return withErrorHandling(async () => {
      const response = await propertyApi.getById(id);
      return handleApiResponse(response, {
        showToast: opts.showToasts,
        logError: opts.logErrors,
        context: `${opts.context}.getById`,
        fallbackMessage: 'Failed to load property details'
      });
    }, {
      showToast: opts.showToasts,
      logError: opts.logErrors,
      context: `${opts.context}.getById`,
      fallbackMessage: 'Failed to load property details'
    });
  }

  // Create property with enhanced error handling and validation
  static async create(
    property: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>,
    options: PropertyServiceOptions = {}
  ): Promise<Property | null> {
    const opts = { ...this.DEFAULT_OPTIONS, ...options };
    
    // Client-side validation
    const validationError = this.validatePropertyData(property);
    if (validationError) {
      if (opts.showToasts) {
        toast.error(validationError);
      }
      if (opts.logErrors) {
        console.error(`${opts.context}.create - Validation error:`, validationError);
      }
      return null;
    }

    return withErrorHandling(async () => {
      const response = await propertyApi.create(property);
      const data = handleApiResponse(response, {
        showToast: false, // We'll show custom success message
        logError: opts.logErrors,
        context: `${opts.context}.create`,
        fallbackMessage: 'Failed to create property'
      });
      
      if (data && opts.showToasts) {
        toast.success('Property created successfully!');
      }
      
      return data;
    }, {
      showToast: opts.showToasts,
      logError: opts.logErrors,
      context: `${opts.context}.create`,
      fallbackMessage: 'Failed to create property'
    });
  }

  // Update property with enhanced error handling
  static async update(
    id: string,
    property: Partial<Property>,
    options: PropertyServiceOptions = {}
  ): Promise<Property | null> {
    const opts = { ...this.DEFAULT_OPTIONS, ...options };
    
    if (!id) {
      if (opts.showToasts) {
        toast.error('Property ID is required');
      }
      return null;
    }

    // Client-side validation for updated fields
    if (property.price !== undefined && (typeof property.price !== 'number' || property.price <= 0)) {
      if (opts.showToasts) {
        toast.error('Price must be a positive number');
      }
      return null;
    }

    return withErrorHandling(async () => {
      const response = await propertyApi.update(id, property);
      const data = handleApiResponse(response, {
        showToast: false, // We'll show custom success message
        logError: opts.logErrors,
        context: `${opts.context}.update`,
        fallbackMessage: 'Failed to update property'
      });
      
      if (data && opts.showToasts) {
        toast.success('Property updated successfully!');
      }
      
      return data;
    }, {
      showToast: opts.showToasts,
      logError: opts.logErrors,
      context: `${opts.context}.update`,
      fallbackMessage: 'Failed to update property'
    });
  }

  // Delete property with enhanced error handling
  static async delete(
    id: string,
    options: PropertyServiceOptions = {}
  ): Promise<boolean> {
    const opts = { ...this.DEFAULT_OPTIONS, ...options };
    
    if (!id) {
      if (opts.showToasts) {
        toast.error('Property ID is required');
      }
      return false;
    }

    const result = await withErrorHandling(async () => {
      const response = await propertyApi.delete(id);
      const success = handleApiResponse(response, {
        showToast: false, // We'll show custom success message
        logError: opts.logErrors,
        context: `${opts.context}.delete`,
        fallbackMessage: 'Failed to delete property'
      });
      
      if (success !== null && opts.showToasts) {
        toast.success('Property deleted successfully!');
      }
      
      return success !== null;
    }, {
      showToast: opts.showToasts,
      logError: opts.logErrors,
      context: `${opts.context}.delete`,
      fallbackMessage: 'Failed to delete property'
    });
    
    return result ?? false;
  }

  // Delete multiple properties with enhanced error handling
  static async deleteMultiple(
    ids: string[],
    options: PropertyServiceOptions = {}
  ): Promise<boolean> {
    const opts = { ...this.DEFAULT_OPTIONS, ...options };
    
    if (!ids || ids.length === 0) {
      if (opts.showToasts) {
        toast.error('No properties selected for deletion');
      }
      return false;
    }

    const result = await withErrorHandling(async () => {
      const response = await propertyApi.deleteMultiple(ids);
      const success = handleApiResponse(response, {
        showToast: false, // We'll show custom success message
        logError: opts.logErrors,
        context: `${opts.context}.deleteMultiple`,
        fallbackMessage: 'Failed to delete properties'
      });
      
      if (success !== null && opts.showToasts) {
        toast.success(`${ids.length} properties deleted successfully!`);
      }
      
      return success !== null;
    }, {
      showToast: opts.showToasts,
      logError: opts.logErrors,
      context: `${opts.context}.deleteMultiple`,
      fallbackMessage: 'Failed to delete properties'
    });
    
    return result ?? false;
  }

  // Client-side validation helper
  private static validatePropertyData(
    property: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>
  ): string | null {
    if (!property.title || property.title.trim() === '') {
      return 'Property title is required';
    }
    
    if (!property.address || property.address.trim() === '') {
      return 'Property address is required';
    }
    
    if (!property.propertyType || property.propertyType.trim() === '') {
      return 'Property type is required';
    }
    
    if (typeof property.price !== 'number' || property.price <= 0) {
      return 'Property price must be a positive number';
    }
    
    if (typeof property.bedrooms !== 'number' || property.bedrooms < 0) {
      return 'Number of bedrooms must be a non-negative number';
    }
    
    if (typeof property.bathrooms !== 'number' || property.bathrooms < 0) {
      return 'Number of bathrooms must be a non-negative number';
    }
    
    if (typeof property.squareFootage !== 'number' || property.squareFootage <= 0) {
      return 'Square footage must be a positive number';
    }
    
    if (!Array.isArray(property.images)) {
      return 'Property images must be an array';
    }
    
    if (!Array.isArray(property.features)) {
      return 'Property features must be an array';
    }
    
    if (property.owner && (!property.owner.name || !property.owner.phone)) {
      return 'Property owner information is incomplete';
    }
    
    return null;
  }

  // Utility method to check if property exists
  static async exists(
    id: string,
    options: PropertyServiceOptions = {}
  ): Promise<boolean> {
    const property = await this.getById(id, { ...options, showToasts: false });
    return property !== null;
  }

  // Utility method to get property count
  static async getCount(
    filters?: PropertyFilters,
    options: PropertyServiceOptions = {}
  ): Promise<number> {
    const properties = await this.getAll(filters, { ...options, showToasts: false });
    return properties?.length || 0;
  }
}

// Export convenience functions
export const getProperties = PropertyService.getAll.bind(PropertyService);
export const getProperty = PropertyService.getById.bind(PropertyService);
export const createProperty = PropertyService.create.bind(PropertyService);
export const updateProperty = PropertyService.update.bind(PropertyService);
export const deleteProperty = PropertyService.delete.bind(PropertyService);
export const deleteProperties = PropertyService.deleteMultiple.bind(PropertyService);