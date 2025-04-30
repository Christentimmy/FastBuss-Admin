import { BASE_URL } from './config';

export interface TripHistory {
  _id: string;
  routeName: string;
  busName: string;
  busId: string;
  driverName: string;
  departureTime: string;
  origin: string;
  destination: string;
  arrivalTime: string;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  subCompanyId: string;
  createdAt: string;
  updatedAt: string;
}

export interface TripHistoryResponse {
  message: string;
  data: TripHistory[];
}

export interface Route {
  _id: string;
  routeName: string;
  origin: string;
  destination: string;
  distance: number;
  price: number;
  status: string;
  subCompanyId: string;
  createdAt: string;
  updatedAt: string;
  waypoints: any[];
}

export interface RoutesResponse {
  message: string;
  data: Route[];
}

export interface Driver {
  _id: string;
  name: string;
  email: string;
}

export interface DriversResponse {
  message: string;
  data: Driver[];
}

export interface CreateScheduleRequest {
  routeId: string;
  driverId: string;
  departureTime: string;
  arrivalTime: string;
}

export const tripHistoryService = {
  async getTripHistory(token: string): Promise<TripHistoryResponse> {
    try {
      const response = await fetch(`${BASE_URL}/sub-company/staff/get-trip-history`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch trip history');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching trip history:', error);
      throw error;
    }
  },

  async getAllRoutes(token: string): Promise<RoutesResponse> {
    try {
      const response = await fetch(`${BASE_URL}/sub-company/staff/all-routes`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch routes');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching routes:', error);
      throw error;
    }
  },

  async getAvailableDrivers(token: string): Promise<DriversResponse> {
    try {
      const response = await fetch(`${BASE_URL}/sub-company/staff/available-drivers`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch available drivers');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching available drivers:', error);
      throw error;
    }
  },

  async createSchedule(token: string, scheduleData: CreateScheduleRequest): Promise<any> {
    try {
      const response = await fetch(`${BASE_URL}/sub-company/create-route-schedule`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(scheduleData),
      });

      if (!response.ok) {
        throw new Error('Failed to create schedule');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating schedule:', error);
      throw error;
    }
  }
}; 