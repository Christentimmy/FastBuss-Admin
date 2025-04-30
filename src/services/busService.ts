import { BASE_URL } from './config';
import { authService } from './authService';
const TOKEN = authService.getToken();

export interface CreateBusData {
  name: string;
  plateNumber: string;
  capacity: string;
  type: string;
}

export interface BusResponse {
  data: Bus[];
}

export interface Bus {
  _id: string;
  busName: string;
  busNumber: string;
  busType: string;
  capacity: number;
  status: 'active' | 'inactive';
  subCompanyId: string;
  createdAt: string;
  updatedAt: string;
}

export interface BusDetailsResponse {
  message: string;
  data: {
    _id: string;
    name: string;
    plateNumber: string;
    capacity: number;
    type: string;
    status: string;
    location: {
      latitude?: number;
      longitude?: number;
      address?: string;
      timestamp: string;
    };
    driver: {
      _id: string;
      name: string;
      email: string;
      phone: string;
      status: string;
    } | null;
  };
}

export const busService = {
  createBus: async (busData: CreateBusData) => {
    try {
      const response = await fetch(`${BASE_URL}/sub-company/create-bus`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${TOKEN}`
        },
        body: JSON.stringify(busData)
      });

      if (authService.handleTokenExpiration(response)) {
        throw new Error('Token expired');
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create bus');
      }

      return data;
    } catch (error) {
      console.error('Error creating bus:', error);
      throw error;
    }
  },

  fetchBuses: async (): Promise<BusResponse> => {
    try {
      const response = await fetch(`${BASE_URL}/sub-company/staff/buses`, {
        headers: {
          'Authorization': `Bearer ${TOKEN}`,
          'Content-Type': 'application/json'
        }
      });

      if (authService.handleTokenExpiration(response)) {
        throw new Error('Token expired');
      }

      if (!response.ok) {
        throw new Error('Failed to fetch buses');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching buses:', error);
      throw error;
    }
  },

  fetchNoDriverBuses: async (): Promise<BusResponse> => {
    try {
      const response = await fetch(`${BASE_URL}/sub-company/staff/no-driver-buses`, {
        headers: {
          'Authorization': `Bearer ${TOKEN}`
        }
      });

      if (authService.handleTokenExpiration(response)) {
        throw new Error('Token expired');
      }

      if (!response.ok) {
        throw new Error('Failed to fetch buses without drivers');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching buses without drivers:', error);
      throw error;
    }
  },

  deactivateBus: async (busId: string): Promise<Bus> => {
    const response = await fetch(`${BASE_URL}/sub-company/deactivate-bus/${busId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    if (authService.handleTokenExpiration(response)) {
      throw new Error('Token expired');
    }

    if (!response.ok) {
      throw new Error('Failed to deactivate bus');
    }

    return await response.json();
  },

  activateBus: async (busId: string): Promise<Bus> => {
    const response = await fetch(`${BASE_URL}/sub-company/activate-bus/${busId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${TOKEN}`
      }
    });

    if (authService.handleTokenExpiration(response)) {
      throw new Error('Token expired');
    }

    if (!response.ok) {
      throw new Error('Failed to activate bus');
    }

    return await response.json();
  },

  deleteBus: async (busId: string): Promise<void> => {
    const response = await fetch(`${BASE_URL}/sub-company/delete-bus/${busId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${TOKEN}`
      }
    });

    if (authService.handleTokenExpiration(response)) {
      throw new Error('Token expired');
    }

    if (!response.ok) {
      throw new Error('Failed to delete bus');
    }
  },

  fetchBusDetails: async (busId: string): Promise<BusDetailsResponse> => {
    try {
      const response = await fetch(`${BASE_URL}/sub-company/staff/bus-details/${busId}`, {
        headers: {
          'Authorization': `Bearer ${TOKEN}`
        }
      });

      if (authService.handleTokenExpiration(response)) {
        throw new Error('Token expired');
      }

      if (!response.ok) {
        throw new Error('Failed to fetch bus details');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching bus details:', error);
      throw error;
    }
  }
}; 