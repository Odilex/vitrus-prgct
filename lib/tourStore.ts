import React from 'react';
import { create } from 'zustand';
import { tourApi, type Tour } from './apiService';
import { toast } from 'sonner';

export type DashboardTour = Tour;

interface TourStore {
  tours: DashboardTour[];
  isLoading: boolean;
  error: string | null;
  initialized: boolean;
  
  // Actions
  initializeTours: () => Promise<void>;
  addTour: (tour: Omit<DashboardTour, 'id' | 'createdAt' | 'updatedAt'>) => Promise<boolean>;
  updateTour: (id: string, tour: Partial<DashboardTour>) => Promise<boolean>;
  deleteTours: (ids: string[]) => Promise<boolean>;
  getTourById: (id: string) => DashboardTour | undefined;
  refreshTours: () => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

const useTourStoreBase = create<TourStore>((set, get) => ({
  tours: [],
  isLoading: false,
  error: null,
  initialized: false,

  initializeTours: async () => {
    if (get().initialized) return;
    
    set({ isLoading: true, error: null });
    try {
      const response = await tourApi.getTours();
      if (response.success && response.data) {
        set({ 
          tours: response.data, 
          initialized: true, 
          isLoading: false 
        });
      } else {
        throw new Error(response.error || 'Failed to fetch tours');
      }
    } catch (error) {
      console.error('Error initializing tours:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to load tours',
        isLoading: false 
      });
      toast.error('Failed to load tours');
    }
  },

  addTour: async (tourData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await tourApi.createTour(tourData);
      if (response.success && response.data) {
        set(state => ({ 
          tours: [response.data!, ...state.tours],
          isLoading: false 
        }));
        toast.success('Tour scheduled successfully');
        return true;
      } else {
        throw new Error(response.error || 'Failed to schedule tour');
      }
    } catch (error) {
      console.error('Error adding tour:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to schedule tour',
        isLoading: false 
      });
      toast.error('Failed to schedule tour');
      return false;
    }
  },

  updateTour: async (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      const response = await tourApi.updateTour(id, updates);
      if (response.success && response.data) {
        set(state => ({
          tours: state.tours.map(tour => 
            tour.id === id ? { ...tour, ...response.data } : tour
          ),
          isLoading: false
        }));
        toast.success('Tour updated successfully');
        return true;
      } else {
        throw new Error(response.error || 'Failed to update tour');
      }
    } catch (error) {
      console.error('Error updating tour:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update tour',
        isLoading: false 
      });
      toast.error('Failed to update tour');
      return false;
    }
  },

  deleteTours: async (ids) => {
    set({ isLoading: true, error: null });
    try {
      const deletePromises = ids.map(id => tourApi.deleteTour(id));
      const results = await Promise.all(deletePromises);
      
      const failedDeletes = results.filter(result => !result.success);
      if (failedDeletes.length > 0) {
        throw new Error(`Failed to delete ${failedDeletes.length} tour(s)`);
      }
      
      set(state => ({
        tours: state.tours.filter(tour => !ids.includes(tour.id)),
        isLoading: false
      }));
      
      toast.success(`${ids.length} tour(s) deleted successfully`);
      return true;
    } catch (error) {
      console.error('Error deleting tours:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to delete tours',
        isLoading: false 
      });
      toast.error('Failed to delete tours');
      return false;
    }
  },

  getTourById: (id) => {
    return get().tours.find(tour => tour.id === id);
  },

  refreshTours: async () => {
    set({ initialized: false });
    await get().initializeTours();
  },

  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error })
}));

// React hook that initializes tours on first use
export const useTourStore = () => {
  const store = useTourStoreBase();
  
  React.useEffect(() => {
    if (!store.initialized && !store.isLoading) {
      store.initializeTours();
    }
  }, [store, store.initialized, store.isLoading, store.initializeTours]);
  
  return store;
};

// Legacy compatibility functions
export const getTours = () => useTourStoreBase.getState().tours;
export const getTourById = (id: string) => useTourStoreBase.getState().getTourById(id);
export const addTour = (data: Partial<DashboardTour>) => useTourStoreBase.getState().addTour(data);
export const updateTour = (id: string, updates: Partial<DashboardTour>) => useTourStoreBase.getState().updateTour(id, updates);
export const deleteTours = (ids: string[]) => useTourStoreBase.getState().deleteTours(ids);

// Export types
export type { DashboardTour };