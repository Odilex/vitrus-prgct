export interface Client {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  company?: string;
  notes?: string;
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateClientData {
  full_name: string;
  email: string;
  phone?: string;
  company?: string;
  notes?: string;
  is_active?: boolean;
}

export interface UpdateClientData {
  full_name?: string;
  email?: string;
  phone?: string;
  company?: string;
  notes?: string;
  is_active?: boolean;
}