import { useEffect } from 'react';
import { initPushNotifications, initLocalNotifications } from '@/utils/notificationsManager';

export const NotificationSetup = () => {
  useEffect(() => {
    const setupNotifications = async () => {
      await initLocalNotifications();
      await initPushNotifications();
    };

    setupNotifications();
  }, []);

  return null;
};
