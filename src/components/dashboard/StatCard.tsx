import React from 'react';
import { motion } from 'framer-motion';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    isPositive: boolean;
  };
  icon: LucideIcon;
  iconColor: string;
  iconBgColor: string;
  metric?: string;
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  iconColor, 
  iconBgColor, 
  metric 
}) => {
  return (
    <motion.div 
      className="data-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-sm text-gray-400 mb-1">{title}</h3>
          <div className="flex items-end">
            <span className="text-2xl font-semibold text-white">
              {value}
            </span>
            {metric && (
              <span className="ml-1 text-sm text-gray-400">{metric}</span>
            )}
          </div>
          
          {change && (
            <div className="flex items-center mt-2">
              <span className={`text-xs font-medium ${change.isPositive ? 'text-success-400' : 'text-error-400'}`}>
                {change.isPositive ? '+' : ''}{change.value}%
              </span>
              <span className="text-xs text-gray-500 ml-1">vs last week</span>
            </div>
          )}
        </div>
        
        <div className={`p-3 rounded-lg ${iconBgColor}`}>
          <Icon size={20} className={iconColor} />
        </div>
      </div>
    </motion.div>
  );
};

export default StatCard;