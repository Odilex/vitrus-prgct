import { Tour } from '../apiService';
import { AuthService } from '../auth';

export interface CreateTourData {
  property_id: string;
  client_id: string;
  scheduled_date: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
  notes?: string;
}

export interface UpdateTourData {
  property_id?: string;
  client_id?: string;
  scheduled_date?: string;
  status?: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
  notes?: string;
}

// Database tour interface
interface DbTour {
  id: string;
  property_id: string;
  client_id: string;
  scheduled_date: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
  notes?: string;
  created_at: string;
  updated_at: string;
}

// Transform database tour to frontend Tour interface
function transformTour(dbTour: DbTour): Tour {
  return {
    id: dbTour.id,
    propertyId: dbTour.property_id,
    clientId: dbTour.client_id,
    scheduledDate: dbTour.scheduled_date,
    status: dbTour.status,
    notes: dbTour.notes,
    createdAt: dbTour.created_at,
    updatedAt: dbTour.updated_at
  };
}

export class TourService {
  static async getAll(): Promise<Tour[]> {
    try {
      const result = await AuthService.makeAuthenticatedRequest<{ data: DbTour[] }>('/tours');
      return result.data?.map(transformTour) || [];
    } catch (error) {
      console.error('Error fetching tours:', error);
      return [];
    }
  }

  static async getById(id: string): Promise<Tour | null> {
    try {
      const result = await AuthService.makeAuthenticatedRequest<{ tour: DbTour }>(`/tours/${id}`);
      return transformTour(result.tour);
    } catch (error) {
      console.error('Error fetching tour:', error);
      return null;
    }
  }

  static async create(tourData: CreateTourData): Promise<Tour | null> {
    try {
      const result = await AuthService.makeAuthenticatedRequest<{ tour: DbTour }>('/tours', {
        method: 'POST',
        body: JSON.stringify(tourData),
      });
      return transformTour(result.tour);
    } catch (error) {
      console.error('Error creating tour:', error);
      return null;
    }
  }

  static async update(id: string, tourData: UpdateTourData): Promise<Tour | null> {
    try {
      const result = await AuthService.makeAuthenticatedRequest<{ tour: DbTour }>(`/tours/${id}`, {
        method: 'PUT',
        body: JSON.stringify(tourData),
      });
      return transformTour(result.tour);
    } catch (error) {
      console.error('Error updating tour:', error);
      return null;
    }
  }

  static async delete(id: string): Promise<boolean> {
    try {
      await AuthService.makeAuthenticatedRequest<void>(`/tours/${id}`, {
        method: 'DELETE',
      });
      return true;
    } catch (error) {
      console.error('Error deleting tour:', error);
      return false;
    }
  }
}