import  { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Bus, 
  LayoutDashboard, 
  Users, 
  Route, 
  CalendarClock, 
  BarChart3, 
  Settings, 
  Menu,
  X,
  LogOut,
  Building2,
  UserCog
} from 'lucide-react';
import { authService } from '../../services/authService';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleMobileSidebar = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const userRole = authService.getTokenPayload()?.role;

  const menuItems = [
    { id: '/', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { id: '/fleet', icon: <Bus size={20} />, label: 'Fleet Management' },
    { id: '/drivers', icon: <Users size={20} />, label: 'Drivers' },
    { id: '/routes', icon: <Route size={20} />, label: 'Routes' },
    { id: '/schedule', icon: <CalendarClock size={20} />, label: 'Schedule' },
    { id: '/analytics', icon: <BarChart3 size={20} />, label: 'Analytics' },
    ...(userRole === 'super_admin' ? [{ id: '/companies', icon: <Building2 size={20} />, label: 'Companies' }] : []),
    { id: '/staff', icon: <UserCog size={20} />, label: 'Staff Management' },
    { id: '/settings', icon: <Settings size={20} />, label: 'Settings' },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <button 
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-primary-800/50 text-white"
        onClick={toggleMobileSidebar}
      >
        <Menu size={20} />
      </button>

      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={toggleMobileSidebar}
        ></div>
      )}
      
      {/* Sidebar */}
      <motion.aside
        className={`fixed lg:relative h-screen z-50 lg:z-auto bg-gray-900/70 backdrop-blur-md border-r border-gray-800/50
                   ${isMobileOpen ? 'left-0' : '-left-72'} lg:left-0 transition-all duration-300`}
        initial={false}
        animate={{ 
          width: isCollapsed ? '80px' : '256px',
        }}
      >
        <div className="flex flex-col h-full">
          {/* Logo and Toggle */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-800/50">
            <motion.div 
              className="flex items-center gap-3"
              animate={{ opacity: isCollapsed ? 0 : 1 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-600 text-white">
                <Bus size={20} className="text-white" />
              </div>
              {!isCollapsed && (
                <motion.h1 
                  className="text-xl font-semibold text-white"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  FutureBus
                </motion.h1>
              )}
            </motion.div>
            
            <div className="flex">
              {/* Mobile Close Button */}
              <button 
                className="lg:hidden p-1 rounded-md hover:bg-gray-800/50"
                onClick={toggleMobileSidebar}
              >
                <X size={20} className="text-gray-400" />
              </button>
              
              {/* Desktop Toggle Button */}
              <button
                className="hidden lg:flex p-1 rounded-md hover:bg-gray-800/50"
                onClick={toggleSidebar}
              >
                <Menu size={20} className="text-gray-400" />
              </button>
            </div>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 py-4 overflow-y-auto">
            <ul className="space-y-1 px-2">
              {menuItems.map((item) => (
                <li key={item.id}>
                  <button
                    className={`sidebar-link w-full ${location.pathname === item.id ? 'active' : ''}`}
                    onClick={() => {
                      navigate(item.id);
                      if (isMobileOpen) toggleMobileSidebar();
                    }}
                  >
                    {item.icon}
                    {!isCollapsed && (
                      <motion.span
                        initial={false}
                        animate={{ opacity: isCollapsed ? 0 : 1, width: isCollapsed ? 0 : 'auto' }}
                        transition={{ duration: 0.2 }}
                        className="whitespace-nowrap overflow-hidden"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
          
          {/* User Profile */}
          <div className="border-t border-gray-800/50 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary-700 flex items-center justify-center overflow-hidden">
                <img 
                  src="https://images.pexels.com/photos/5792641/pexels-photo-5792641.jpeg?auto=compress&cs=tinysrgb&w=600" 
                  alt="Admin Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              {!isCollapsed && (
                <motion.div
                  initial={false}
                  animate={{ opacity: isCollapsed ? 0 : 1, width: isCollapsed ? 0 : 'auto' }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <p className="text-sm font-medium text-white">Alex Johnson</p>
                  <p className="text-xs text-gray-400">Administrator</p>
                </motion.div>
              )}
              {!isCollapsed && (
                <motion.button
                  initial={false}
                  animate={{ opacity: isCollapsed ? 0 : 1 }}
                  transition={{ duration: 0.2 }}
                  className="ml-auto p-1.5 rounded-md hover:bg-gray-800/50 text-gray-400"
                  onClick={handleLogout}
                >
                  <LogOut size={18} />
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;