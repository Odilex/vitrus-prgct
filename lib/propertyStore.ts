import React from 'react';
import { create } from 'zustand';
import propertyService from './api/property';
import { toast } from 'sonner';
import type { Property } from './types/property';

export interface DashboardProperty extends Property {}

interface PropertyStore {
  properties: DashboardProperty[];
  isLoading: boolean;
  error: string | null;
  initialized: boolean;
  
  // Actions
  initializeProperties: () => Promise<void>;
  addProperty: (property: Omit<DashboardProperty, 'id' | 'createdAt' | 'updatedAt'>) => Promise<boolean>;
  updateProperty: (id: string, property: Partial<DashboardProperty>) => Promise<boolean>;
  deleteProperties: (ids: string[]) => Promise<boolean>;
  getPropertyById: (id: string) => DashboardProperty | undefined;
  refreshProperties: () => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const propertyStore = create<PropertyStore>((set, get) => ({
  properties: [],
  isLoading: false,
  error: null,
  initialized: false,

  initializeProperties: async () => {
    if (get().initialized) return;
    
    set({ isLoading: true, error: null });
    try {
      const properties = await propertyService.getAll();
      set({ 
        properties: properties, 
        initialized: true,
        isLoading: false 
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      set({ error: errorMessage, isLoading: false });
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
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      set({ error: errorMessage, isLoading: false });
      toast.error(`Failed to add property: ${errorMessage}`);
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
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      set({ error: errorMessage, isLoading: false });
      toast.error(`Failed to update property: ${errorMessage}`);
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
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      set({ error: errorMessage, isLoading: false });
      toast.error(`Failed to delete properties: ${errorMessage}`);
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
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      set({ error: errorMessage, isLoading: false });
      console.error('Failed to refresh properties:', error);
    }
  },

  getPropertyById: (id) => {
    return get().properties.find((property) => property.id === id);
  },

  setLoading: (loading) => {
    set({ isLoading: loading });
  },

  setError: (error) => {
    set({ error });
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
  }, [store.initialized, store.isLoading]);
  
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

// Export types
export type { DashboardProperty };