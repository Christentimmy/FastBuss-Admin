import axios from 'axios';
import { BASE_URL } from './config';
import { authService } from './authService';

const TOKEN = authService.getToken();

// Types
export interface SupportTicket {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  subject: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high';
  category: 'booking' | 'payment' | 'technical' | 'other';
  attachments?: string[];
  assignedTo?: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface SupportTicketResponse {
  message: string;
  data: SupportTicket[];
}

class SupportService {
  private API_URL = `${BASE_URL}/support`;

  private handleError(error: any): never {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || error.message;
      throw new Error(`Support service error: ${message}`);
    }
    throw new Error('An unexpected error occurred');
  }

  async getMyTickets(): Promise<SupportTicket[]> {
    try {
      const response = await axios.get<SupportTicketResponse>(`${this.API_URL}/all-tickets`, {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          "Content-Type": "application/json"
        }
      });
      return response.data.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async getTicketById(ticketId: string): Promise<SupportTicket> {
    try {
      const response = await axios.get<{ message: string; data: SupportTicket }>(
        `${this.API_URL}/tickets/${ticketId}`,
        {
          headers: {
            Authorization: `Bearer ${TOKEN}`
          }
        }
      );
      return response.data.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async createTicket(ticketData: {
    subject: string;
    description: string;
    category: SupportTicket['category'];
    priority: SupportTicket['priority'];
  }): Promise<SupportTicket> {
    try {
      const response = await axios.post<{ message: string; data: SupportTicket }>(
        `${this.API_URL}/tickets`,
        ticketData,
        {
          headers: {
            Authorization: `Bearer ${TOKEN}`
          }
        }
      );
      return response.data.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async updateTicket(
    ticketId: string,
    status: SupportTicket['status'],
    priority: SupportTicket['priority']
  ): Promise<void> {
    try {
      await axios.patch<{ message: string }>(
        `${this.API_URL}/update-status`,
        { ticketId, status, priority },
        {
          headers: {
            "Authorization": `Bearer ${TOKEN}`,
            "Content-Type": "application/json"
          }
        }
      );
    } catch (error) {
      this.handleError(error);
    }
  }
}

export const supportService = new SupportService(); 