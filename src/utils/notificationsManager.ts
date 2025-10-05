import { PushNotifications } from '@capacitor/push-notifications';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';

export const initPushNotifications = async () => {
  if (!Capacitor.isNativePlatform()) {
    console.log('Push notifications are only available on native platforms');
    return;
  }

  try {
    // Request permission
    let permStatus = await PushNotifications.checkPermissions();

    if (permStatus.receive === 'prompt') {
      permStatus = await PushNotifications.requestPermissions();
    }

    if (permStatus.receive !== 'granted') {
      throw new Error('User denied permissions!');
    }

    // Register with Apple / Google to receive push via APNS/FCM
    await PushNotifications.register();

    // Some issue with your setup and push will not work
    PushNotifications.addListener('registrationError', (error: any) => {
      console.error('Error on registration: ' + JSON.stringify(error));
    });

    // Show us the notification payload if the app is open on our device
    PushNotifications.addListener('pushNotificationReceived', (notification: any) => {
      console.log('Push notification received: ' + JSON.stringify(notification));
      
      // Show local notification when app is open
      showLocalNotification(
        notification.title || 'Nouveau message',
        notification.body || 'Vous avez reçu un nouveau message'
      );
    });

    // Method called when tapping on a notification
    PushNotifications.addListener('pushNotificationActionPerformed', (notification: any) => {
      console.log('Push notification action performed', notification.actionId, notification.inputValue);
    });

    console.log('Push notifications initialized successfully');
  } catch (error) {
    console.error('Error initializing push notifications:', error);
  }
};

export const initLocalNotifications = async () => {
  if (!Capacitor.isNativePlatform()) {
    console.log('Local notifications are only available on native platforms');
    return;
  }

  try {
    const permStatus = await LocalNotifications.checkPermissions();
    
    if (permStatus.display === 'prompt') {
      await LocalNotifications.requestPermissions();
    }

    console.log('Local notifications initialized successfully');
  } catch (error) {
    console.error('Error initializing local notifications:', error);
  }
};

export const showLocalNotification = async (title: string, body: string) => {
  if (!Capacitor.isNativePlatform()) {
    console.log('Local notifications are only available on native platforms');
    return;
  }

  try {
    await LocalNotifications.schedule({
      notifications: [
        {
          title,
          body,
          id: Date.now(),
          schedule: { at: new Date(Date.now() + 1000) },
          sound: 'default',
          attachments: undefined,
          actionTypeId: '',
          extra: null,
        },
      ],
    });
  } catch (error) {
    console.error('Error showing local notification:', error);
  }
};

export const simulateNewMessageNotification = (contactName: string) => {
  showLocalNotification(
    `${contactName}`,
    'Nouveau message reçu'
  );
};
