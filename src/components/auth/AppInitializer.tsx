import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../../services/authService';
import SplashScreen from './SplashScreen';

const AppInitializer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const initializeApp = async () => {
      // Skip initialization if we're already on the splash screen or login page
      if (location.pathname === '/' || location.pathname === '/login') {
        setIsInitializing(false);
        return;
      }

      try {
        const token = authService.getToken();
        if (!token) {
          navigate('/login');
          return;
        }

        const isValid = await authService.validateToken();
        if (!isValid) {
          navigate('/login');
        }
      } catch (error) {
        navigate('/login');
      } finally {
        setIsInitializing(false);
      }
    };

    initializeApp();
  }, [navigate, location]);

  if (isInitializing) {
    return <SplashScreen />;
  }

  return null;
};

export default AppInitializer; 