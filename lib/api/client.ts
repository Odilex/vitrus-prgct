import { Client } from '../types/client';
import { AuthService } from '../auth';

export class ClientService {

  async getAll(): Promise<Client[]> {
    const response = await AuthService.makeAuthenticatedRequest<{success: boolean, data: Client[]}>('/clients');
    return response.data;
  }

  async getById(id: string): Promise<Client> {
    const response = await AuthService.makeAuthenticatedRequest<{success: boolean, data: Client}>(`/clients/${id}`);
    return response.data;
  }

  async create(clientData: Omit<Client, 'id' | 'created_at' | 'updated_at' | 'role'>): Promise<Client> {
    const response = await AuthService.makeAuthenticatedRequest<{success: boolean, data: Client}>('/clients', {
      method: 'POST',
      body: JSON.stringify(clientData),
    });
    return response.data;
  }

  async update(id: string, updates: Partial<Client>): Promise<Client> {
    const response = await AuthService.makeAuthenticatedRequest<{success: boolean, data: Client}>(`/clients/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await AuthService.makeAuthenticatedRequest<{success: boolean, message: string}>(`/clients/${id}`, {
      method: 'DELETE',
    });
  }
}

const clientService = new ClientService();
export default clientService;