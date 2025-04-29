import { BASE_URL } from './config';

export interface LoginResponse {
  message: string;
  token?: string;
}

export interface LoginError {
  message: string;
  status: number;
}

export interface TokenPayload {
  id: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

export const authService = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    try {
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw {
          message: data.message || 'Login failed',
          status: response.status,
        };
      }

      // Save token if login is successful
      if (data.token) {
        authService.setToken(data.token);
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw {
          message: error.message,
          status: 500,
        };
      }
      throw error;
    }
  },

  // Token management
  setToken: (token: string) => {
    localStorage.setItem('token', token);
  },

  getToken: (): string | null => {
    return localStorage.getItem('token');
  },

  removeToken: () => {
    localStorage.removeItem('token');
  },

  isAuthenticated: (): boolean => {
    const token = authService.getToken();
    if (!token) return false;

    try {
      // Decode token to check expiration
      const payload = JSON.parse(atob(token.split('.')[1])) as TokenPayload;
      const currentTime = Math.floor(Date.now() / 1000);
      
      return payload.exp > currentTime;
    } catch {
      return false;
    }
  },

  getTokenPayload: (): TokenPayload | null => {
    const token = authService.getToken();
    if (!token) return null;

    try {
      return JSON.parse(atob(token.split('.')[1])) as TokenPayload;
    } catch {
      return null;
    }
  },

  logout: () => {
    authService.removeToken();
    // You can add additional cleanup here if needed
  },

  validateToken: async (): Promise<boolean> => {
    const token = authService.getToken();
    if (!token) return false;

    try {
      const response = await fetch(`${BASE_URL}/auth/check-token`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      return response.ok;
    } catch {
      return false;
    }
  }
}; 