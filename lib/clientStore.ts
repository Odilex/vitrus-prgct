import React from 'react';
import { create } from 'zustand';
import ClientService from './api/client';
import { type Client } from './types/client';
import { toast } from 'sonner';

export type DashboardClient = Client;

interface ClientStore {
  clients: DashboardClient[];
  isLoading: boolean;
  error: string | null;
  initialized: boolean;
  
  // Actions
  initializeClients: () => Promise<void>;
  addClient: (client: Omit<DashboardClient, 'id' | 'createdAt' | 'updatedAt'>) => Promise<boolean>;
  updateClient: (id: string, client: Partial<DashboardClient>) => Promise<boolean>;
  deleteClients: (ids: string[]) => Promise<boolean>;
  getClientById: (id: string) => DashboardClient | undefined;
  refreshClients: () => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

const clientService = ClientService;

const useClientStoreBase = create<ClientStore>((set, get) => ({
  clients: [],
  isLoading: false,
  error: null,
  initialized: false,

  initializeClients: async () => {
    if (get().initialized) return;
    
    set({ isLoading: true, error: null });
    try {
      const clients = await clientService.getAll();
      set({ 
        clients, 
        initialized: true, 
        isLoading: false 
      });
    } catch (error) {
      console.error('Error initializing clients:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to load clients',
        isLoading: false 
      });
      toast.error('Failed to load clients');
    }
  },

  addClient: async (clientData) => {
    set({ isLoading: true, error: null });
    try {
      const newClient = await clientService.create(clientData);
      set(state => ({ 
        clients: [newClient, ...state.clients],
        isLoading: false 
      }));
      toast.success('Client added successfully');
      return true;
    } catch (error) {
      console.error('Error adding client:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to add client',
        isLoading: false 
      });
      toast.error('Failed to add client');
      return false;
    }
  },

  updateClient: async (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      const updatedClient = await clientService.update(id, updates);
      set(state => ({
        clients: state.clients.map(client => 
          client.id === id ? updatedClient : client
        ),
        isLoading: false
      }));
      toast.success('Client updated successfully');
      return true;
    } catch (error) {
      console.error('Error updating client:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update client',
        isLoading: false 
      });
      toast.error('Failed to update client');
      return false;
    }
  },

  deleteClients: async (ids) => {
    set({ isLoading: true, error: null });
    try {
      const deletePromises = ids.map(id => clientService.delete(id));
      await Promise.all(deletePromises);
      
      set(state => ({
        clients: state.clients.filter(client => !ids.includes(client.id)),
        isLoading: false
      }));
      
      toast.success(`${ids.length} client(s) deleted successfully`);
      return true;
    } catch (error) {
      console.error('Error deleting clients:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to delete clients',
        isLoading: false 
      });
      toast.error('Failed to delete clients');
      return false;
    }
  },

  getClientById: (id) => {
    return get().clients.find(client => client.id === id);
  },

  refreshClients: async () => {
    set({ initialized: false });
    await get().initializeClients();
  },

  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error })
}));

// React hook that initializes clients on first use
export const useClientStore = () => {
  const store = useClientStoreBase();
  
  React.useEffect(() => {
    if (!store.initialized && !store.isLoading) {
      store.initializeClients();
    }
  }, [store, store.initialized, store.isLoading, store.initializeClients]);
  
  return store;
};

// Legacy compatibility functions
export const getClients = () => useClientStoreBase.getState().clients;
export const getClientById = (id: string) => useClientStoreBase.getState().getClientById(id);
export const addClient = (data: Omit<DashboardClient, 'id' | 'createdAt' | 'updatedAt'>) => useClientStoreBase.getState().addClient(data);
export const updateClient = (id: string, updates: Partial<DashboardClient>) => useClientStoreBase.getState().updateClient(id, updates);
export const deleteClients = (ids: string[]) => useClientStoreBase.getState().deleteClients(ids);

// Export types
// DashboardClient is already exported above