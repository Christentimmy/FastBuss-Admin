import { BASE_URL } from './config';
import { authService } from './authService';

interface CreateStaffData {
  name: string;
  email: string;
  password: string;
  role: 'Staff' | 'Sub_Admin';
}

class StaffService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = `${BASE_URL}/sub-company`;
  }

  async createStaff(data: CreateStaffData) {
    const token = authService.getToken();
    const formattedData = {
      ...data,
      role: data.role.toLowerCase().replace(' ', '_')
    };
    
    const response = await fetch(`${this.baseUrl}/create-staff`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formattedData),
    });

    const res = await response.json();
    if (!response.ok) {
      throw new Error(res.message || 'Failed to create staff member');
    }

    return res;
  }
}

export const staffService = new StaffService(); 