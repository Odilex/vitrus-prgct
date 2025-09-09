import React from 'react';
import { create } from 'zustand';
import propertyService from './api/property';
import { PropertyError, NetworkError, ValidationError, NotFoundError, UnauthorizedError } from './api/property';
import { toast } from 'sonner';
import type { Property } from './types/property';

export type DashboardProperty = Property;

// Enhanced error state interface
interface ErrorState {
  message: string;
  code: string;
  type: 'network' | 'validation' | 'not_found' | 'unauthorized' | 'server' | 'unknown';
  retryable: boolean;
  timestamp: number;
}

interface PropertyStore {
  properties: DashboardProperty[];
  isLoading: boolean;
  error: ErrorState | null;
  initialized: boolean;
  lastFetchTime: number | null;
  
  // Actions
  initializeProperties: () => Promise<void>;
  addProperty: (property: Omit<DashboardProperty, 'id' | 'createdAt' | 'updatedAt'>) => Promise<boolean>;
  updateProperty: (id: string, property: Partial<DashboardProperty>) => Promise<boolean>;
  deleteProperties: (ids: string[]) => Promise<boolean>;
  getPropertyById: (id: string) => DashboardProperty | undefined;
  refreshProperties: () => Promise<void>;
  retryLastOperation: () => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (error: ErrorState | null) => void;
  clearError: () => void;
}

// Helper function to convert PropertyError to ErrorState
const createErrorState = (error: unknown): ErrorState => {
  const timestamp = Date.now();
  
  if (error instanceof NetworkError) {
    return {
      message: error.message,
      code: error.code,
      type: 'network',
      retryable: true,
      timestamp,
    };
  }
  
  if (error instanceof ValidationError) {
    return {
      message: error.message,
      code: error.code,
      type: 'validation',
      retryable: false,
      timestamp,
    };
  }
  
  if (error instanceof NotFoundError) {
    return {
      message: error.message,
      code: error.code,
      type: 'not_found',
      retryable: false,
      timestamp,
    };
  }
  
  if (error instanceof UnauthorizedError) {
    return {
      message: error.message,
      code: error.code,
      type: 'unauthorized',
      retryable: false,
      timestamp,
    };
  }
  
  if (error instanceof PropertyError) {
    return {
      message: error.message,
      code: error.code,
      type: error.status && error.status >= 500 ? 'server' : 'unknown',
      retryable: error.status ? error.status >= 500 : false,
      timestamp,
    };
  }
  
  return {
    message: error instanceof Error ? error.message : 'An unexpected error occurred',
    code: 'UNKNOWN_ERROR',
    type: 'unknown',
    retryable: false,
    timestamp,
  };
};

export const propertyStore = create<PropertyStore>((set, get) => ({
  properties: [],
  isLoading: false,
  error: null,
  initialized: false,
  lastFetchTime: null,

  initializeProperties: async () => {
    if (get().initialized) return;
    
    set({ isLoading: true, error: null });
    try {
      const properties = await propertyService.getAll();
      set({ 
        properties: properties, 
        initialized: true,
        isLoading: false,
        lastFetchTime: Date.now(),
        error: null
      });
    } catch (error) {
      const errorState = createErrorState(error);
      set({ error: errorState, isLoading: false });
      
      // Show user-friendly toast messages
      if (errorState.type === 'network') {
        toast.error('Connection failed. Please check your internet connection.');
      } else if (errorState.type === 'unauthorized') {
        toast.error('Please log in to access properties.');
      } else if (errorState.type === 'server') {
        toast.error('Server is temporarily unavailable. Please try again later.');
      } else {
        toast.error('Failed to load properties. Please try again.');
      }
      
      console.error('Failed to initialize properties:', error);
    }
  },

  addProperty: async (property) => {
    set({ isLoading: true, error: null });
    try {
      const newProperty = await propertyService.create(property);
      set((state) => ({
        properties: [...state.properties, newProperty],
        isLoading: false
      }));
      toast.success('Property added successfully!');
      return true;
    } catch (error) {
      const errorState = createErrorState(error);
      set({ error: errorState, isLoading: false });
      toast.error(`Failed to add property: ${errorState.message}`);
      return false;
    }
  },

  updateProperty: async (id, updatedProperty) => {
    set({ isLoading: true, error: null });
    try {
      const updated = await propertyService.update(id, updatedProperty);
      set((state) => ({
        properties: state.properties.map((property) =>
          property.id === id ? updated : property
        ),
        isLoading: false
      }));
      toast.success('Property updated successfully!');
      return true;
    } catch (error) {
      const errorState = createErrorState(error);
      set({ error: errorState, isLoading: false });
      toast.error(`Failed to update property: ${errorState.message}`);
      return false;
    }
  },

  deleteProperties: async (ids) => {
    set({ isLoading: true, error: null });
    try {
      // Delete each property individually since we don't have a bulk delete method
      await Promise.all(ids.map(id => propertyService.delete(id)));
      set((state) => ({
        properties: state.properties.filter((property) => !ids.includes(property.id)),
        isLoading: false
      }));
      toast.success(`${ids.length} property(ies) deleted successfully!`);
      return true;
    } catch (error) {
      const errorState = createErrorState(error);
      set({ error: errorState, isLoading: false });
      toast.error(`Failed to delete properties: ${errorState.message}`);
      return false;
    }
  },

  refreshProperties: async () => {
    set({ isLoading: true, error: null });
    try {
      const properties = await propertyService.getAll();
      set({ 
        properties, 
        isLoading: false 
      });
    } catch (error) {
      const errorState = createErrorState(error);
      set({ error: errorState, isLoading: false });
      console.error('Failed to refresh properties:', error);
    }
  },

  getPropertyById: (id) => {
    return get().properties.find((property) => property.id === id);
  },

  setLoading: (loading) => {
    set({ isLoading: loading });
  },

  retryLastOperation: async () => {
    const state = get();
    if (!state.error || !state.error.retryable) {
      return;
    }
    
    // Retry the last failed operation
    if (!state.initialized) {
      await get().initializeProperties();
    } else {
      await get().refreshProperties();
    }
  },

  setError: (error) => {
    set({ error });
  },

  clearError: () => {
    set({ error: null });
  },
}));

// React hook for using the property store
export const usePropertyStore = () => {
  const store = propertyStore();
  
  // Initialize properties on first use
  React.useEffect(() => {
    if (!store.initialized && !store.isLoading) {
      store.initializeProperties();
    }
  }, [store, store.initialized, store.isLoading]);
  
  return store;
};

// Legacy compatibility functions for existing code
export const getProperties = () => propertyStore.getState().properties;
export const getPropertyById = (id: string) => propertyStore.getState().getPropertyById(id);
export const addProperty = (property: Omit<DashboardProperty, 'id' | 'createdAt' | 'updatedAt'>) => 
  propertyStore.getState().addProperty(property);
export const updateProperty = (id: string, property: Partial<DashboardProperty>) => 
  propertyStore.getState().updateProperty(id, property);
export const deleteProperties = (ids: string[]) => 
  propertyStore.getState().deleteProperties(ids);