import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UserPlus, 
  Search, 
  Filter, 
  MoreVertical, 
  Mail, 
  Phone, 
  UserCog,
  Edit2,
  Trash2,
  Loader2,
  Shield,
  Building2,
  ChevronRight,
  ChevronLeft,
  Activity,
  Clock,
  Target,
  BarChart2
} from 'lucide-react';
import AddStaffModal from '../components/staff/AddStaffModal';

interface StaffMember {
  id: number;
  name: string;
  role: string;
  email: string;
  phone: string;
  avatar: string;
  department: string;
  status: 'active' | 'inactive';
  lastActive: string;
  performance: number;
  tasksCompleted: number;
  totalTasks: number;
  efficiency: number;
  attendance: number;
}

const StaffManagement: React.FC = () => {
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([
    {
      id: 1,
      name: 'John Doe',
      role: 'Operations Manager',
      email: 'john.doe@example.com',
      phone: '+1 234 567 890',
      avatar: '/path-to-avatar.jpg',
      department: 'Operations',
      status: 'active',
      lastActive: '2 hours ago',
      performance: 95,
      tasksCompleted: 24,
      totalTasks: 25,
      efficiency: 92,
      attendance: 98
    },
    {
      id: 2,
      name: 'Jane Smith',
      role: 'Fleet Coordinator',
      email: 'jane.smith@example.com',
      phone: '+1 234 567 891',
      avatar: '/path-to-avatar.jpg',
      department: 'Fleet',
      status: 'active',
      lastActive: '5 minutes ago',
      performance: 88,
      tasksCompleted: 18,
      totalTasks: 20,
      efficiency: 85,
      attendance: 95
    },
    {
      id: 3,
      name: 'Mike Johnson',
      role: 'Route Planner',
      email: 'mike.johnson@example.com',
      phone: '+1 234 567 892',
      avatar: '/path-to-avatar.jpg',
      department: 'Planning',
      status: 'inactive',
      lastActive: '1 day ago',
      performance: 75,
      tasksCompleted: 15,
      totalTasks: 20,
      efficiency: 78,
      attendance: 90
    },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'timeline'>('grid');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const filteredStaff = staffMembers.filter(staff => {
    const matchesSearch = staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         staff.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || staff.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const PerformanceBar = ({ value, color }: { value: number; color: string }) => (
    <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 1, ease: "easeOut" }}
        className={`h-full ${color}`}
      />
    </div>
  );

  const handleAddStaff = () => {
    setIsAddModalOpen(true);
  };

  const handleStaffCreated = () => {
    // Refresh staff list or add new staff member to the list
    // This will be implemented when we have the API integration
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 p-6">
      {/* Holographic Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative mb-8"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-primary-600/20 blur-3xl" />
        <div className="relative flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600">
              Staff Management
            </h1>
            <p className="text-gray-400 mt-2">Holographic Interface v2.0</p>
          </div>
          <button 
            className="btn-holographic flex items-center gap-2"
            onClick={handleAddStaff}
          >
            <UserPlus size={16} />
            Add Staff Member
          </button>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left Panel - Staff List */}
        <div className="col-span-12 lg:col-span-4">
          <div className="holographic-card p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">Staff Members</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-primary-500/20' : 'hover:bg-gray-800'}`}
                >
                  <Activity size={16} className="text-gray-400" />
                </button>
                <button
                  onClick={() => setViewMode('timeline')}
                  className={`p-2 rounded-lg ${viewMode === 'timeline' ? 'bg-primary-500/20' : 'hover:bg-gray-800'}`}
                >
                  <ChevronRight size={16} className="text-gray-400" />
                </button>
              </div>
            </div>

            {/* Search and Filter */}
            <div className="mb-4">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search staff members..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-900/50 border border-gray-800 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Filter size={16} className="text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="flex-1 bg-gray-900/50 border border-gray-800 rounded-md text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            {/* Staff List */}
            <div className="space-y-3">
              {filteredStaff.map((staff) => (
                <motion.div
                  key={staff.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  whileHover={{ scale: 1.02 }}
                  className={`holographic-card p-3 cursor-pointer ${
                    selectedStaff?.id === staff.id ? 'border-primary-500/30' : ''
                  }`}
                  onClick={() => setSelectedStaff(staff)}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                        <span className="text-white font-semibold">
                          {staff.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div className={`absolute bottom-0 right-0 w-2 h-2 rounded-full border-2 border-gray-900 ${
                        staff.status === 'active' ? 'bg-green-500' : 'bg-gray-500'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-semibold">{staff.name}</h3>
                      <p className="text-sm text-gray-400">{staff.role}</p>
                    </div>
                    <ChevronRight size={16} className="text-gray-400" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel - Staff Details */}
        <div className="col-span-12 lg:col-span-8">
          <AnimatePresence mode="wait">
            {selectedStaff ? (
              <motion.div
                key={selectedStaff.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="holographic-card p-6"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                        <span className="text-white text-xl font-semibold">
                          {selectedStaff.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-gray-900 ${
                        selectedStaff.status === 'active' ? 'bg-green-500' : 'bg-gray-500'
                      }`} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">{selectedStaff.name}</h2>
                      <p className="text-gray-400">{selectedStaff.role}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                      <Edit2 size={16} className="text-gray-400" />
                    </button>
                    <button className="p-2 hover:bg-red-500/20 rounded-lg transition-colors">
                      <Trash2 size={16} className="text-red-400" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-400 mb-2">Contact Information</h3>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-gray-300">
                          <Mail size={16} />
                          <span>{selectedStaff.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-300">
                          <Phone size={16} />
                          <span>{selectedStaff.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-300">
                          <Building2 size={16} />
                          <span>{selectedStaff.department}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-400 mb-2">Performance Metrics</h3>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-gray-300">Overall Performance</span>
                            <span className="text-white font-semibold">{selectedStaff.performance}%</span>
                          </div>
                          <PerformanceBar value={selectedStaff.performance} color="bg-primary-500" />
                        </div>
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-gray-300">Efficiency</span>
                            <span className="text-white font-semibold">{selectedStaff.efficiency}%</span>
                          </div>
                          <PerformanceBar value={selectedStaff.efficiency} color="bg-blue-500" />
                        </div>
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-gray-300">Attendance</span>
                            <span className="text-white font-semibold">{selectedStaff.attendance}%</span>
                          </div>
                          <PerformanceBar value={selectedStaff.attendance} color="bg-green-500" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-400 mb-2">Task Progress</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-300">Tasks Completed</span>
                          <span className="text-white font-semibold">
                            {selectedStaff.tasksCompleted}/{selectedStaff.totalTasks}
                          </span>
                        </div>
                        <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(selectedStaff.tasksCompleted / selectedStaff.totalTasks) * 100}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="h-full bg-blue-500"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-400 mb-2">Activity Status</h3>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                          selectedStaff.status === 'active' ? 'bg-green-500' : 'bg-gray-500'
                        }`} />
                        <span className="text-gray-300">
                          {selectedStaff.status === 'active' ? 'Active' : 'Inactive'} - Last active {selectedStaff.lastActive}
                        </span>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-400 mb-2">Recent Activity</h3>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-gray-300">
                          <Target size={16} />
                          <span>Completed 5 tasks today</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-300">
                          <BarChart2 size={16} />
                          <span>Performance increased by 5%</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-300">
                          <Clock size={16} />
                          <span>Average response time: 2.5 hours</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="holographic-card p-6 flex items-center justify-center"
              >
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary-500/20 to-primary-600/20 flex items-center justify-center">
                    <UserCog size={24} className="text-primary-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Select a Staff Member</h3>
                  <p className="text-gray-400">Choose a staff member from the list to view their details</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Add Staff Modal */}
      <AddStaffModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={handleStaffCreated}
      />
    </div>
  );
};

export default StaffManagement; 