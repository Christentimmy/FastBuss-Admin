import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings as SettingsIcon,
  Bell,
  Users,
  Bus,
  Route,
  Calendar,
  Shield,
  Database,
  Save,
  ChevronDown,
  ChevronUp,
  ToggleLeft,
  ToggleRight,
  Clock,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';

const Settings = () => {
  const [activeSection, setActiveSection] = useState('general');
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [maintenanceAlerts, setMaintenanceAlerts] = useState(true);
  const [routeAlerts, setRouteAlerts] = useState(true);
  const [driverAlerts, setDriverAlerts] = useState(true);

  const sections = [
    {
      id: 'general',
      title: 'General Settings',
      icon: SettingsIcon,
      description: 'Configure basic system settings and preferences',
      content: (
        <div className="space-y-6">
          <div className="glass-card p-4">
            <h3 className="text-lg font-semibold text-white mb-4">Company Information</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <MapPin className="text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Company Address"
                  className="flex-1 px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-primary-500"
                />
              </div>
              <div className="flex items-center gap-3">
                <Phone className="text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Contact Number"
                  className="flex-1 px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-primary-500"
                />
              </div>
              <div className="flex items-center gap-3">
                <Mail className="text-gray-400" size={20} />
                <input
                  type="email"
                  placeholder="Contact Email"
                  className="flex-1 px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-primary-500"
                />
              </div>
            </div>
          </div>

          <div className="glass-card p-4">
            <h3 className="text-lg font-semibold text-white mb-4">Time Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="text-gray-400" size={20} />
                  <span className="text-white">Time Zone</span>
                </div>
                <select className="px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white focus:outline-none focus:border-primary-500">
                  <option>UTC+0</option>
                  <option>UTC+1</option>
                  <option>UTC+2</option>
                  <option>UTC+3</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="text-gray-400" size={20} />
                  <span className="text-white">Date Format</span>
                </div>
                <select className="px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white focus:outline-none focus:border-primary-500">
                  <option>DD/MM/YYYY</option>
                  <option>MM/DD/YYYY</option>
                  <option>YYYY-MM-DD</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'notifications',
      title: 'Notification Settings',
      icon: Bell,
      description: 'Configure notification preferences and alerts',
      content: (
        <div className="space-y-6">
          <div className="glass-card p-4">
            <h3 className="text-lg font-semibold text-white mb-4">Notification Channels</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mail className="text-gray-400" size={20} />
                  <span className="text-white">Email Notifications</span>
                </div>
                <button
                  onClick={() => setEmailNotifications(!emailNotifications)}
                  className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full transition-transform ${
                    emailNotifications ? 'translate-x-6 bg-primary-500' : 'translate-x-1 bg-gray-400'
                  }`} />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Phone className="text-gray-400" size={20} />
                  <span className="text-white">SMS Notifications</span>
                </div>
                <button
                  onClick={() => setSmsNotifications(!smsNotifications)}
                  className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full transition-transform ${
                    smsNotifications ? 'translate-x-6 bg-primary-500' : 'translate-x-1 bg-gray-400'
                  }`} />
                </button>
              </div>
            </div>
          </div>

          <div className="glass-card p-4">
            <h3 className="text-lg font-semibold text-white mb-4">Alert Types</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bus className="text-gray-400" size={20} />
                  <span className="text-white">Maintenance Alerts</span>
                </div>
                <button
                  onClick={() => setMaintenanceAlerts(!maintenanceAlerts)}
                  className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full transition-transform ${
                    maintenanceAlerts ? 'translate-x-6 bg-primary-500' : 'translate-x-1 bg-gray-400'
                  }`} />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Route className="text-gray-400" size={20} />
                  <span className="text-white">Route Alerts</span>
                </div>
                <button
                  onClick={() => setRouteAlerts(!routeAlerts)}
                  className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full transition-transform ${
                    routeAlerts ? 'translate-x-6 bg-primary-500' : 'translate-x-1 bg-gray-400'
                  }`} />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="text-gray-400" size={20} />
                  <span className="text-white">Driver Alerts</span>
                </div>
                <button
                  onClick={() => setDriverAlerts(!driverAlerts)}
                  className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full transition-transform ${
                    driverAlerts ? 'translate-x-6 bg-primary-500' : 'translate-x-1 bg-gray-400'
                  }`} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'security',
      title: 'Security Settings',
      icon: Shield,
      description: 'Configure security and access control settings',
      content: (
        <div className="space-y-6">
          <div className="glass-card p-4">
            <h3 className="text-lg font-semibold text-white mb-4">Password Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <input
                  type="password"
                  placeholder="Current Password"
                  className="flex-1 px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-primary-500"
                />
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="password"
                  placeholder="New Password"
                  className="flex-1 px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-primary-500"
                />
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="password"
                  placeholder="Confirm New Password"
                  className="flex-1 px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-primary-500"
                />
              </div>
            </div>
          </div>

          <div className="glass-card p-4">
            <h3 className="text-lg font-semibold text-white mb-4">Two-Factor Authentication</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-white">Enable 2FA</span>
                <button className="px-4 py-2 rounded-lg bg-primary-900 text-white text-sm">
                  Enable
                </button>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'data',
      title: 'Data Management',
      icon: Database,
      description: 'Configure data backup and storage settings',
      content: (
        <div className="space-y-6">
          <div className="glass-card p-4">
            <h3 className="text-lg font-semibold text-white mb-4">Backup Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-white">Automatic Backups</span>
                <select className="px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white focus:outline-none focus:border-primary-500">
                  <option>Daily</option>
                  <option>Weekly</option>
                  <option>Monthly</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white">Backup Location</span>
                <button className="px-4 py-2 rounded-lg bg-primary-900 text-white text-sm">
                  Change
                </button>
              </div>
            </div>
          </div>

          <div className="glass-card p-4">
            <h3 className="text-lg font-semibold text-white mb-4">Data Retention</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-white">Retention Period</span>
                <select className="px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white focus:outline-none focus:border-primary-500">
                  <option>3 months</option>
                  <option>6 months</option>
                  <option>1 year</option>
                  <option>2 years</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="h-full"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Settings</h1>
          <p className="text-sm text-gray-400 mt-1">Configure system settings and preferences</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Save size={16} />
          Save Changes
        </button>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-220px)]">
        {/* Settings Navigation */}
        <div className="space-y-2">
          {sections.map(section => (
            <button
              key={section.id}
              className={`w-full p-4 rounded-lg text-left transition-colors ${
                activeSection === section.id
                  ? 'bg-primary-900 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
              }`}
              onClick={() => setActiveSection(section.id)}
            >
              <div className="flex items-center gap-3">
                <section.icon size={20} />
                <span className="font-medium">{section.title}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3 space-y-6 overflow-y-auto pr-2">
          {sections.map(section => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: activeSection === section.id ? 1 : 0,
                y: activeSection === section.id ? 0 : 20
              }}
              className={`${activeSection === section.id ? 'block' : 'hidden'}`}
            >
              <div className="glass-card p-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-semibold text-white">{section.title}</h2>
                    <p className="text-sm text-gray-400">{section.description}</p>
                  </div>
                </div>
                {section.content}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default Settings; 