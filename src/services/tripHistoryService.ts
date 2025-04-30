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
  }
}; 