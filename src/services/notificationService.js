// // import messaging from '@react-native-firebase/messaging';
// // import notifee from '@notifee/react-native';

// // class NotificationService {
// //   async requestPermission() {
// //     const authStatus = await messaging().requestPermission();
// //     return authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
// //            authStatus === messaging.AuthorizationStatus.PROVISIONAL;
// //   }

// //   async getToken() {
// //     try {
// //       await messaging().registerDeviceForRemoteMessages();
// //       const token = await messaging().getToken();
// //       return token;
// //     } catch (error) {
// //       console.error('Error getting FCM token:', error);
// //       return null;
// //     }
// //   }

// //   async displayNotification(title, body, data = {}) {
// //     await notifee.displayNotification({
// //       title,
// //       body,
// //       data,
// //       android: {
// //         channelId: 'default',
// //         smallIcon: 'ic_launcher',
// //         pressAction: { id: 'default' },
// //       },
// //     });
// //   }

// //   setupNotificationListeners() {
// //     // Foreground notification handler
// //     messaging().onMessage(async remoteMessage => {
// //       await this.displayNotification(
// //         remoteMessage.notification?.title || 'New Notification',
// //         remoteMessage.notification?.body || '',
// //         remoteMessage.data
// //       );
// //     });

// //     // Background/Quit state notification handler
// //     messaging().setBackgroundMessageHandler(async remoteMessage => {
// //       console.log('Background message:', remoteMessage);
// //     });
// //   }

// //   async createNotificationChannel() {
// //     await notifee.createChannel({
// //       id: 'default',
// //       name: 'Default Channel',
// //       importance: 4, // High importance
// //     });
// //   }
// // }

// // export default new NotificationService();
// // src/services/notificationService.js
// import messaging from '@react-native-firebase/messaging';
// import notifee, { AndroidImportance, EventType } from '@notifee/react-native';
// import { Platform, PermissionsAndroid } from 'react-native';

// class NotificationService {
//   constructor() {
//     this.configure();
//   }

//   // Request notification permissions
//   async requestPermission() {
//     try {
//       if (Platform.OS === 'android') {
//         if (Platform.Version >= 33) {
//           const granted = await PermissionsAndroid.request(
//             PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
//           );
//           return granted === PermissionsAndroid.RESULTS.GRANTED;
//         }
//         return true; // No permission needed for Android < 13
//       } else {
//         // iOS
//         const authStatus = await messaging().requestPermission();
//         return (
//           authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
//           authStatus === messaging.AuthorizationStatus.PROVISIONAL
//         );
//       }
//     } catch (error) {
//       console.error('Error requesting notification permission:', error);
//       return false;
//     }
//   }

//   // Get FCM token
//   async getToken() {
//     try {
//       const hasPermission = await this.requestPermission();
      
//       if (!hasPermission) {
//         console.log('Notification permission denied');
//         return null;
//       }

//       const token = await messaging().getToken();
//       console.log('FCM Token obtained:', token);
//       return token;
//     } catch (error) {
//       console.error('Error getting FCM token:', error);
//       return null;
//     }
//   }
//   async getFCMToken() {
//     return this.getToken();
//   }
//   // Create notification channel (Android only)
//   async createNotificationChannel() {
//     if (Platform.OS === 'android') {
//       try {
//         await notifee.createChannel({
//           id: 'default',
//           name: 'Default Channel',
//           importance: AndroidImportance.HIGH,
//           sound: 'default',
//           vibration: true,
//         });

//         // Create channel for offers
//         await notifee.createChannel({
//           id: 'offers',
//           name: 'Offers & Promotions',
//           importance: AndroidImportance.HIGH,
//           sound: 'default',
//           vibration: true,
//         });

//         // Create channel for orders
//         await notifee.createChannel({
//           id: 'orders',
//           name: 'Order Updates',
//           importance: AndroidImportance.HIGH,
//           sound: 'default',
//           vibration: true,
//         });

//         console.log('Notification channels created');
//       } catch (error) {
//         console.error('Error creating notification channel:', error);
//       }
//     }
//   }

//   // Display local notification
//   async displayNotification(title, body, data = {}) {
//     try {
//       await notifee.displayNotification({
//         title,
//         body,
//         android: {
//           channelId: data.type === 'order' ? 'orders' : 
//                      data.type === 'welcome_offer' ? 'offers' : 'default',
//           importance: AndroidImportance.HIGH,
//           pressAction: {
//             id: 'default',
//             launchActivity: 'default',
//           },
//           sound: 'default',
//           vibrationPattern: [300, 500],
//         },
//         ios: {
//           sound: 'default',
//           foregroundPresentationOptions: {
//             alert: true,
//             badge: true,
//             sound: true,
//           },
//         },
//         data,
//       });

//       console.log('Notification displayed:', title);
//     } catch (error) {
//       console.error('Error displaying notification:', error);
//     }
//   }

//   // Configure notification handlers
//   configure() {
//     // Create channels on app start
//     this.createNotificationChannel();

//     // Handle foreground notifications (when app is open)
//     messaging().onMessage(async remoteMessage => {
//       console.log('Foreground notification received:', remoteMessage);
      
//       const { notification, data } = remoteMessage;
      
//       if (notification) {
//         await this.displayNotification(
//           notification.title || 'New Notification',
//           notification.body || '',
//           data || {}
//         );
//       }
//     });

//     // Handle background notifications (when app is in background)
//     messaging().setBackgroundMessageHandler(async remoteMessage => {
//       console.log('Background notification received:', remoteMessage);
      
//       const { notification, data } = remoteMessage;
      
//       if (notification) {
//         await this.displayNotification(
//           notification.title || 'New Notification',
//           notification.body || '',
//           data || {}
//         );
//       }
//     });

//     // Handle notification opened (user tapped notification)
//     messaging().onNotificationOpenedApp(remoteMessage => {
//       console.log('Notification opened app:', remoteMessage);
//       this.handleNotificationAction(remoteMessage);
//     });

//     // Check if app was opened from a notification (when app was quit)
//     messaging()
//       .getInitialNotification()
//       .then(remoteMessage => {
//         if (remoteMessage) {
//           console.log('App opened from notification:', remoteMessage);
//           this.handleNotificationAction(remoteMessage);
//         }
//       });

//     // Handle notifee notification actions
//     notifee.onForegroundEvent(({ type, detail }) => {
//       if (type === EventType.PRESS) {
//         console.log('Notifee notification pressed:', detail);
//         this.handleNotificationAction(detail.notification);
//       }
//     });

//     // Handle background events
//     notifee.onBackgroundEvent(async ({ type, detail }) => {
//       if (type === EventType.PRESS) {
//         console.log('Notifee background notification pressed:', detail);
//       }
//     });

//     console.log('Notification service configured');
//   }

//   // Handle notification actions (navigation, etc.)
//   handleNotificationAction(notification) {
//     const data = notification?.data || {};
    
//     console.log('Handling notification action:', data);

//     // Add your navigation logic here
//     // Example:
//     // if (data.screen === 'Home') {
//     //   navigation.navigate('Home');
//     // } else if (data.type === 'order') {
//     //   navigation.navigate('OrderDetails', { orderId: data.orderId });
//     // }
//   }

//   // Subscribe to topic
//   async subscribeToTopic(topic) {
//     try {
//       await messaging().subscribeToTopic(topic);
//       console.log(`Subscribed to topic: ${topic}`);
//     } catch (error) {
//       console.error(`Error subscribing to topic ${topic}:`, error);
//     }
//   }

//   // Unsubscribe from topic
//   async unsubscribeFromTopic(topic) {
//     try {
//       await messaging().unsubscribeFromTopic(topic);
//       console.log(`Unsubscribed from topic: ${topic}`);
//     } catch (error) {
//       console.error(`Error unsubscribing from topic ${topic}:`, error);
//     }
//   }

//   // Delete FCM token
//   async deleteToken() {
//     try {
//       await messaging().deleteToken();
//       console.log('FCM token deleted');
//     } catch (error) {
//       console.error('Error deleting FCM token:', error);
//     }
//   }
// }

// export default new NotificationService();

// src/services/notificationService.js
// Gracefully handles SERVICE_NOT_AVAILABLE (emulators, devices without Google Play Services)

import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidImportance, EventType } from '@notifee/react-native';
import { Platform, PermissionsAndroid } from 'react-native';

class NotificationService {
  constructor() {
    this._tokenCache = null;
    this._configured = false;
    this.configure();
  }

  // ─── Check if Firebase Messaging is available ──────────────────────────────
  // Returns false on emulators / devices without Google Play Services
  async _isMessagingAvailable() {
    try {
      // This will throw if Play Services are unavailable
      await messaging().getToken();
      return true;
    } catch (error) {
      const msg = error?.message || '';
      if (
        msg.includes('SERVICE_NOT_AVAILABLE') ||
        msg.includes('java.io.IOException') ||
        msg.includes('MISSING_INSTANCEID_SERVICE') ||
        msg.includes('unknown')
      ) {
        return false;
      }
      return false;
    }
  }

  // ─── Request Permissions ───────────────────────────────────────────────────
  async requestPermission() {
    try {
      if (Platform.OS === 'android') {
        if (Platform.Version >= 33) {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
          );
          return granted === PermissionsAndroid.RESULTS.GRANTED;
        }
        return true; // Android < 13 doesn't need runtime permission
      } else {
        // iOS
        const authStatus = await messaging().requestPermission();
        return (
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL
        );
      }
    } catch (error) {
      console.warn('[Notifications] Permission request failed:', error?.message);
      return false;
    }
  }

  // ─── Get FCM Token ─────────────────────────────────────────────────────────
  // Returns null safely if Play Services are unavailable (emulator / no GMS)
  async getToken() {
    // Return cached token if already fetched
    if (this._tokenCache) return this._tokenCache;

    try {
      const hasPermission = await this.requestPermission();
      if (!hasPermission) {
        console.warn('[Notifications] Permission denied — skipping token fetch');
        return null;
      }

      const token = await messaging().getToken();
      this._tokenCache = token;
      console.log('[Notifications] FCM token obtained');
      return token;

    } catch (error) {
      const msg = error?.message || '';

      // ✅ Graceful handling — these errors mean no Google Play Services
      if (
        msg.includes('SERVICE_NOT_AVAILABLE') ||
        msg.includes('java.io.IOException') ||
        msg.includes('MISSING_INSTANCEID_SERVICE') ||
        msg.includes('[messaging/unknown]')
      ) {
        console.warn(
          '[Notifications] FCM unavailable — running on emulator or device without Google Play Services. Push notifications disabled.'
        );
        return null; // App continues normally without push notifications
      }

      // Unexpected error — still return null to not crash the app
      console.warn('[Notifications] Unexpected error getting FCM token:', msg);
      return null;
    }
  }

  // Alias for compatibility
  async getFCMToken() {
    return this.getToken();
  }

  // ─── Create Notification Channels (Android only) ───────────────────────────
  async createNotificationChannel() {
    if (Platform.OS !== 'android') return;

    try {
      await notifee.createChannel({
        id: 'default',
        name: 'Default Channel',
        importance: AndroidImportance.HIGH,
        sound: 'default',
        vibration: true,
      });
      await notifee.createChannel({
        id: 'offers',
        name: 'Offers & Promotions',
        importance: AndroidImportance.HIGH,
        sound: 'default',
        vibration: true,
      });
      await notifee.createChannel({
        id: 'orders',
        name: 'Order Updates',
        importance: AndroidImportance.HIGH,
        sound: 'default',
        vibration: true,
      });
      console.log('[Notifications] Channels created');
    } catch (error) {
      console.warn('[Notifications] Error creating channels:', error?.message);
    }
  }

  // ─── Display Local Notification ────────────────────────────────────────────
  async displayNotification(title, body, data = {}) {
    try {
      await notifee.displayNotification({
        title,
        body,
        android: {
          channelId:
            data.type === 'order'
              ? 'orders'
              : data.type === 'welcome_offer'
              ? 'offers'
              : 'default',
          importance: AndroidImportance.HIGH,
          pressAction: { id: 'default', launchActivity: 'default' },
          sound: 'default',
          vibrationPattern: [300, 500],
        },
        ios: {
          sound: 'default',
          foregroundPresentationOptions: { alert: true, badge: true, sound: true },
        },
        data,
      });
    } catch (error) {
      console.warn('[Notifications] Error displaying notification:', error?.message);
    }
  }

  // ─── Configure Listeners ───────────────────────────────────────────────────
  configure() {
    if (this._configured) return;
    this._configured = true;

    // Create channels immediately
    this.createNotificationChannel();

    // ── Safely attach Firebase listeners ──────────────────────────────────
    // Wrapped in try/catch so emulator crashes don't break the app
    try {
      // Foreground messages
      messaging().onMessage(async (remoteMessage) => {
        const { notification, data } = remoteMessage;
        if (notification) {
          await this.displayNotification(
            notification.title || 'New Notification',
            notification.body || '',
            data || {}
          );
        }
      });

      // Background messages
      messaging().setBackgroundMessageHandler(async (remoteMessage) => {
        const { notification, data } = remoteMessage;
        if (notification) {
          await this.displayNotification(
            notification.title || 'New Notification',
            notification.body || '',
            data || {}
          );
        }
      });

      // Notification opened (app in background)
      messaging().onNotificationOpenedApp((remoteMessage) => {
        this.handleNotificationAction(remoteMessage);
      });

      // App opened from quit state via notification
      messaging()
        .getInitialNotification()
        .then((remoteMessage) => {
          if (remoteMessage) this.handleNotificationAction(remoteMessage);
        })
        .catch((err) => {
          console.warn('[Notifications] getInitialNotification error:', err?.message);
        });

    } catch (error) {
      console.warn(
        '[Notifications] Firebase messaging listeners not attached — likely no Play Services:',
        error?.message
      );
    }

    // ── Notifee event handlers ────────────────────────────────────────────
    try {
      notifee.onForegroundEvent(({ type, detail }) => {
        if (type === EventType.PRESS) {
          this.handleNotificationAction(detail.notification);
        }
      });

      notifee.onBackgroundEvent(async ({ type, detail }) => {
        if (type === EventType.PRESS) {
          console.log('[Notifications] Background notification pressed:', detail);
        }
      });
    } catch (error) {
      console.warn('[Notifications] Notifee event handler error:', error?.message);
    }

    console.log('[Notifications] Service configured');
  }

  // ─── Handle Notification Tap ───────────────────────────────────────────────
  handleNotificationAction(notification) {
    const data = notification?.data || {};
    console.log('[Notifications] Action received:', data);
    // Add navigation logic here when needed:
    // if (data.screen === 'OrderDetails') navigation.navigate('OrderDetails', { orderId: data.orderId });
  }

  // ─── Topic Subscriptions ───────────────────────────────────────────────────
  async subscribeToTopic(topic) {
    try {
      await messaging().subscribeToTopic(topic);
      console.log(`[Notifications] Subscribed to: ${topic}`);
    } catch (error) {
      console.warn(`[Notifications] Subscribe to ${topic} failed:`, error?.message);
    }
  }

  async unsubscribeFromTopic(topic) {
    try {
      await messaging().unsubscribeFromTopic(topic);
      console.log(`[Notifications] Unsubscribed from: ${topic}`);
    } catch (error) {
      console.warn(`[Notifications] Unsubscribe from ${topic} failed:`, error?.message);
    }
  }

  async deleteToken() {
    try {
      this._tokenCache = null;
      await messaging().deleteToken();
      console.log('[Notifications] Token deleted');
    } catch (error) {
      console.warn('[Notifications] Delete token failed:', error?.message);
    }
  }
}

export default new NotificationService();