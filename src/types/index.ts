export interface Bus {
  id: string;
  number: string;
  status: 'active' | 'maintenance' | 'inactive';
  driver: string;
  route: string;
  currentLocation: {
    lat: number;
    lng: number;
  };
  capacity: number;
  currentPassengers: number;
  lastMaintenance: string;
  nextMaintenance: string;
  fuelLevel: number;
}

export interface Driver {
  id: string;
  name: string;
  avatar: string;
  status: 'available' | 'on-duty' | 'off-duty';
  phone: string;
  email: string;
  licenseExpiry: string;
  rating: number;
  totalTrips: number;
}

export interface Route {
  id: string;
  name: string;
  startPoint: string;
  endPoint: string;
  distance: number;
  duration: number;
  stops: number;
  avgPassengers: number;
  status: 'active' | 'inactive' | 'modified';
}

export interface ScheduleItem {
  id: string;
  busId: string;
  busNumber: string;
  driverId: string;
  driverName: string;
  routeId: string;
  routeName: string;
  departureTime: string;
  arrivalTime: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  timestamp: string;
  read: boolean;
}

export interface MaintenanceRecord {
  id: string;
  busId: string;
  busNumber: string;
  type: 'routine' | 'repair' | 'inspection';
  status: 'scheduled' | 'in-progress' | 'completed';
  date: string;
  description: string;
  cost: number;
}

export interface AnalyticsData {
  passengersByDay: {
    day: string;
    count: number;
  }[];
  busUtilization: {
    busId: string;
    busNumber: string;
    percentage: number;
  }[];
  routePerformance: {
    routeId: string;
    routeName: string;
    efficiency: number;
    punctuality: number;
    satisfaction: number;
  }[];
  fuelConsumption: {
    month: string;
    amount: number;
  }[];
}