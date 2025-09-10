import { create } from 'zustand';
import { settingsApi } from './apiService';

// Types for different settings categories
export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  address: string;
  company: string;
  bio: string;
  avatar: string;
}

export interface NotificationSettings {
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  newInquiries: boolean;
  tourReminders: boolean;
  propertyUpdates: boolean;
  marketingEmails: boolean;
}

export interface AppearanceSettings {
  theme: 'light' | 'dark' | 'system';
  language: string;
  timezone: string;
  dateFormat: string;
  currency: string;
}

export interface SecuritySettings {
  twoFactorAuth: boolean;
  sessionTimeout: number;
  passwordExpiry: number;
  loginAlerts: boolean;
}

export interface SystemSettings {
  autoBackup: boolean;
  backupFrequency: string;
  dataRetention: number;
  analyticsTracking: boolean;
  performanceMode: boolean;
}

export interface UserSettings {
  profile: UserProfile;
  notifications: NotificationSettings;
  appearance: AppearanceSettings;
  security: SecuritySettings;
}

export interface SystemSettingsData {
  general: {
    siteName: string;
    siteDescription: string;
    contactEmail: string;
    supportEmail: string;
    phoneNumber: string;
    address: string;
    timezone: string;
    language: string;
    currency: string;
  };
  notifications: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    smsNotifications: boolean;
    newPropertyAlerts: boolean;
    bookingAlerts: boolean;
    paymentAlerts: boolean;
    systemAlerts: boolean;
  };
  security: {
    twoFactorAuth: boolean;
    sessionTimeout: number;
    passwordExpiry: number;
    loginAttempts: number;
  };
  system: {
    maintenanceMode: boolean;
    debugMode: boolean;
    cacheEnabled: boolean;
    backupFrequency: string;
    logLevel: string;
    autoBackup: boolean;
    dataRetention: number;
    analyticsTracking: boolean;
    performanceMode: boolean;
  };
}

interface SettingsStore {
  // User settings state
  userSettings: UserSettings | null;
  systemSettings: SystemSettingsData | null;
  isLoading: boolean;
  error: string | null;
  isSaving: boolean;
  
  // Actions
  fetchUserSettings: (userId: string) => Promise<void>;
  updateUserSettings: (userId: string, settings: Partial<UserSettings>) => Promise<void>;
  fetchSystemSettings: () => Promise<void>;
  updateSystemSettings: (settings: Partial<SystemSettingsData>) => Promise<void>;
  
  // Individual setting updates
  updateProfile: (userId: string, profile: Partial<UserProfile>) => Promise<void>;
  updateNotifications: (userId: string, notifications: Partial<NotificationSettings>) => Promise<void>;
  updateAppearance: (userId: string, appearance: Partial<AppearanceSettings>) => Promise<void>;
  updateSecurity: (userId: string, security: Partial<SecuritySettings>) => Promise<void>;
  
  // Utility functions
  clearError: () => void;
  resetSettings: () => void;
}

export const useSettingsStore = create<SettingsStore>((set, get) => ({
  // Initial state
  userSettings: null,
  systemSettings: null,
  isLoading: false,
  error: null,
  isSaving: false,
  
  // Fetch user settings
  fetchUserSettings: async (userId: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await settingsApi.getUserSettings(userId);
      
      if (response.success && response.data) {
        set({ 
          userSettings: response.data as UserSettings,
          isLoading: false 
        });
      } else {
        set({ 
          error: (response.error as string) || 'Failed to fetch user settings',
          isLoading: false 
        });
      }
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch user settings',
        isLoading: false 
      });
    }
  },
  
  // Update user settings
  updateUserSettings: async (userId: string, settings: Partial<UserSettings>) => {
    set({ isSaving: true, error: null });
    
    try {
      const currentSettings = get().userSettings;
      const updatedSettings = {
        ...currentSettings,
        ...settings
      };
      
      const response = await settingsApi.updateUserSettings(userId, updatedSettings);
      
      if (response.success && response.data) {
        set({ 
          userSettings: response.data,
          isSaving: false 
        });
      } else {
        set({ 
          error: response.error || 'Failed to update user settings',
          isSaving: false 
        });
      }
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update user settings',
        isSaving: false 
      });
    }
  },
  
  // Fetch system settings
  fetchSystemSettings: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await settingsApi.getSystemSettings();
      
      if (response.success && response.data) {
        set({ 
          systemSettings: response.data,
          isLoading: false 
        });
      } else {
        set({ 
          error: response.error || 'Failed to fetch system settings',
          isLoading: false 
        });
      }
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch system settings',
        isLoading: false 
      });
    }
  },
  
  // Update system settings
  updateSystemSettings: async (settings: Partial<SystemSettingsData>) => {
    set({ isSaving: true, error: null });
    
    try {
      const currentSettings = get().systemSettings;
      const updatedSettings = {
        ...currentSettings,
        ...settings
      };
      
      const response = await settingsApi.updateSystemSettings(updatedSettings);
      
      if (response.success && response.data) {
        set({ 
          systemSettings: response.data,
          isSaving: false 
        });
      } else {
        set({ 
          error: response.error || 'Failed to update system settings',
          isSaving: false 
        });
      }
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update system settings',
        isSaving: false 
      });
    }
  },
  
  // Update profile settings
  updateProfile: async (userId: string, profile: Partial<UserProfile>) => {
    const currentSettings = get().userSettings;
    if (!currentSettings) return;
    
    const updatedSettings = {
      ...currentSettings,
      profile: {
        ...currentSettings.profile,
        ...profile
      }
    };
    
    await get().updateUserSettings(userId, updatedSettings);
  },
  
  // Update notification settings
  updateNotifications: async (userId: string, notifications: Partial<NotificationSettings>) => {
    const currentSettings = get().userSettings;
    if (!currentSettings) return;
    
    const updatedSettings = {
      ...currentSettings,
      notifications: {
        ...currentSettings.notifications,
        ...notifications
      }
    };
    
    await get().updateUserSettings(userId, updatedSettings);
  },
  
  // Update appearance settings
  updateAppearance: async (userId: string, appearance: Partial<AppearanceSettings>) => {
    const currentSettings = get().userSettings;
    if (!currentSettings) return;
    
    const updatedSettings = {
      ...currentSettings,
      appearance: {
        ...currentSettings.appearance,
        ...appearance
      }
    };
    
    await get().updateUserSettings(userId, updatedSettings);
  },
  
  // Update security settings
  updateSecurity: async (userId: string, security: Partial<SecuritySettings>) => {
    const currentSettings = get().userSettings;
    if (!currentSettings) return;
    
    const updatedSettings = {
      ...currentSettings,
      security: {
        ...currentSettings.security,
        ...security
      }
    };
    
    await get().updateUserSettings(userId, updatedSettings);
  },
  
  // Clear error
  clearError: () => {
    set({ error: null });
  },
  
  // Reset settings
  resetSettings: () => {
    set({ 
      userSettings: null,
      systemSettings: null,
      isLoading: false,
      error: null,
      isSaving: false
    });
  }
}));

// Export default for convenience
export default useSettingsStore;