import { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { initPushNotifications, initLocalNotifications } from '@/utils/notificationsManager';

export const NotificationSetup = () => {
  useEffect(() => {
    // Only initialize notifications on native platforms
    if (Capacitor.isNativePlatform()) {
      const setupNotifications = async () => {
        await initLocalNotifications();
        await initPushNotifications();
      };

      setupNotifications();
    }
  }, []);

  return null;
};
