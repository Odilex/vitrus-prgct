import { create } from 'zustand';
import { analyticsApi } from './apiService';

// Analytics data interfaces
interface MonthlyData {
  month: string;
  views: number;
  inquiries: number;
  tours: number;
}

interface PropertyTypeData {
  name: string;
  value: number;
  color: string;
}

interface TopProperty {
  id: string;
  name: string;
  views: number;
  inquiries: number;
  tours: number;
}

interface DashboardAnalytics {
  summary: {
    total_properties: number;
    total_views: number;
    total_favorites: number;
    total_inquiries: number;
    total_tours: number;
    properties_created: number;
  };
  trends: {
    properties_over_time: Array<{ date: string; count: number }>;
  inquiries_over_time: Array<{ date: string; count: number }>;
  tours_over_time: Array<{ date: string; count: number }>;
  events_over_time: Array<{ date: string; count: number }>;
  };
  breakdowns: {
    inquiry_types: Record<string, number>;
    inquiry_status: Record<string, number>;
    tour_types: Record<string, number>;
    tour_status: Record<string, number>;
    event_types: Record<string, number>;
  };
  top_properties: Array<{
    id: string;
    title: string;
    views: number;
    favorites: number;
  }>;
}

interface AnalyticsState {
  // Data
  dashboardData: DashboardAnalytics | null;
  monthlyData: MonthlyData[];
  propertyTypeData: PropertyTypeData[];
  topProperties: TopProperty[];
  
  // UI State
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchDashboardAnalytics: (dateFrom?: string, dateTo?: string) => Promise<void>;
  fetchPropertyAnalytics: () => Promise<void>;
  clearError: () => void;
  reset: () => void;
}

// Default property type colors
const PROPERTY_TYPE_COLORS = {
  'Villa': '#0ea5e9',
  'Apartment': '#06b6d4', 
  'House': '#8b5cf6',
  'Penthouse': '#f59e0b',
  'Commercial': '#10b981',
  'Industrial': '#ef4444',
  'Land': '#84cc16'
};

// Transform backend data to frontend format
const transformDashboardData = (backendData: Record<string, unknown>): DashboardAnalytics => {
  return {
    summary: {
      total_properties: backendData.summary?.total_properties || 0,
      total_views: backendData.summary?.total_views || 0,
      total_favorites: backendData.summary?.total_favorites || 0,
      total_inquiries: backendData.summary?.total_inquiries || 0,
      total_tours: backendData.summary?.total_tours || 0,
      properties_created: backendData.summary?.properties_created || 0,
    },
    trends: {
      properties_over_time: backendData.trends?.properties_over_time || [],
      inquiries_over_time: backendData.trends?.inquiries_over_time || [],
      tours_over_time: backendData.trends?.tours_over_time || [],
      events_over_time: backendData.trends?.events_over_time || [],
    },
    breakdowns: {
      inquiry_types: backendData.breakdowns?.inquiry_types || {},
      inquiry_status: backendData.breakdowns?.inquiry_status || {},
      tour_types: backendData.breakdowns?.tour_types || {},
      tour_status: backendData.breakdowns?.tour_status || {},
      event_types: backendData.breakdowns?.event_types || {},
    },
    top_properties: backendData.top_properties || [],
  };
};

// Transform trends data to monthly format
const transformToMonthlyData = (trends: Record<string, unknown>): MonthlyData[] => {
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentDate = new Date();
  const monthlyData: MonthlyData[] = [];
  
  // Generate last 6 months of data
  for (let i = 5; i >= 0; i--) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    // Find data for this month in trends
    const inquiriesData = trends.inquiries_over_time?.find((item: Record<string, unknown>) => 
      item.period?.startsWith(monthKey)
    );
    const toursData = trends.tours_over_time?.find((item: Record<string, unknown>) => 
      item.period?.startsWith(monthKey)
    );
    const eventsData = trends.events_over_time?.find((item: Record<string, unknown>) => 
      item.period?.startsWith(monthKey)
    );
    
    monthlyData.push({
      month: monthNames[date.getMonth()],
      views: eventsData?.count || 0,
      inquiries: inquiriesData?.count || 0,
      tours: toursData?.count || 0,
    });
  }
  
  return monthlyData;
};

// Property type interface
interface RawPropertyType {
  name?: string;
  count?: number;
}

// Property analytics interface
interface PropertyAnalytics {
  propertyTypes?: RawPropertyType[];
}

// Transform property analytics to type distribution
const transformPropertyTypeData = (propertyAnalytics: PropertyAnalytics): PropertyTypeData[] => {
  const propertyTypes = propertyAnalytics?.propertyTypes || [];
  
  return propertyTypes.map((type: RawPropertyType, index: number) => ({
    name: type.name || `Type ${index + 1}`,
    value: type.count || 0,
    color: PROPERTY_TYPE_COLORS[type.name as keyof typeof PROPERTY_TYPE_COLORS] || `#${Math.floor(Math.random()*16777215).toString(16)}`,
  }));
};

// Raw property interface
interface RawProperty {
  id: string;
  title?: string;
  name?: string;
  views?: number;
}

// Transform top properties data
const transformTopProperties = (topProperties: RawProperty[]): TopProperty[] => {
  return topProperties.map(property => ({
    id: property.id,
    name: property.title || property.name,
    views: property.views || 0,
    inquiries: 0, // This would need to be calculated from inquiries data
    tours: 0, // This would need to be calculated from tours data
  }));
};

export const useAnalyticsStore = create<AnalyticsState>((set, _get) => ({
  // Initial state
  dashboardData: null,
  monthlyData: [],
  propertyTypeData: [],
  topProperties: [],
  isLoading: false,
  error: null,
  
  // Fetch dashboard analytics
  fetchDashboardAnalytics: async (_dateFrom?: string, _dateTo?: string) => {
    set({ isLoading: true, error: null });
    
    try {
      // Fetch dashboard data
      const dashboardResponse = await analyticsApi.getDashboardStats();
      
      if (!dashboardResponse.success) {
        throw new Error(dashboardResponse.error || 'Failed to fetch dashboard analytics');
      }
      
      // For now, we'll use the basic dashboard stats and transform them
      // In a real implementation, you'd call the backend analytics/dashboard endpoint
      const mockDashboardData = {
        summary: {
          total_properties: dashboardResponse.data?.totalProperties || 0,
          total_views: 0,
          total_favorites: 0,
          total_inquiries: 0,
          total_tours: dashboardResponse.data?.scheduledTours || 0,
          properties_created: dashboardResponse.data?.totalProperties || 0,
        },
        trends: {
          properties_over_time: [],
          inquiries_over_time: [],
          tours_over_time: [],
          events_over_time: [],
        },
        breakdowns: {
          inquiry_types: {},
          inquiry_status: {},
          tour_types: {},
          tour_status: {},
          event_types: {},
        },
        top_properties: [],
      };
      
      const transformedData = transformDashboardData(mockDashboardData);
      const monthlyData = transformToMonthlyData(transformedData.trends);
      
      set({ 
        dashboardData: transformedData,
        monthlyData,
        isLoading: false 
      });
      
    } catch (error) {
      console.error('Error fetching dashboard analytics:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch analytics data',
        isLoading: false 
      });
    }
  },
  
  // Fetch property analytics
  fetchPropertyAnalytics: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await analyticsApi.getPropertyAnalytics();
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch property analytics');
      }
      
      const propertyTypeData = transformPropertyTypeData(response.data);
      
      set({ 
        propertyTypeData,
        isLoading: false 
      });
      
    } catch (error) {
      console.error('Error fetching property analytics:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch property analytics',
        isLoading: false 
      });
    }
  },
  
  // Clear error
  clearError: () => set({ error: null }),
  
  // Reset store
  reset: () => set({
    dashboardData: null,
    monthlyData: [],
    propertyTypeData: [],
    topProperties: [],
    isLoading: false,
    error: null,
  }),
}));

// Legacy compatibility functions
export const getAnalyticsData = () => {
  const store = useAnalyticsStore.getState();
  return {
    totalViews: store.dashboardData?.summary.total_views || 0,
    uniqueVisitors: 0, // This would need to be calculated
    conversionRate: store.dashboardData ? 
      ((store.dashboardData.summary.total_tours / Math.max(store.dashboardData.summary.total_views, 1)) * 100) : 0,
    averageTimeOnSite: "0:00",
    topPerformingProperties: store.topProperties.map(p => ({ name: p.name, views: p.views })),
    monthlyTrends: {
      views: "+0%",
      inquiries: "+0%",
      bookings: "+0%"
    }
  };
};

export const fetchAnalytics = async () => {
  const { fetchDashboardAnalytics, fetchPropertyAnalytics } = useAnalyticsStore.getState();
  await Promise.all([
    fetchDashboardAnalytics(),
    fetchPropertyAnalytics()
  ]);
};

export default useAnalyticsStore;