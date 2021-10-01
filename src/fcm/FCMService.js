import messaging from '@react-native-firebase/messaging'
import firebase from '@react-native-firebase/app'
import { Platform } from 'react-native';

class FCMService {

    register = (onRegister, onNotification, onOpenNotification) => {
        this.checkPermission(onRegister)
        this.createNotificationListeners(onRegister, onNotification, onOpenNotification)
    }

    registerAppWithFCM = async () => {

    }

    checkPermission = (onRegister) => {
        messaging().hasPermission()
            .then(enabled => {
                if (enabled) {
                    // User has permissions
                    this.getToken(onRegister)
                } else {
                    // User doesn't have permission
                    alert("Permission notifikasi belum diaktifkan");
                }
            }).catch(error => {
                onRegister("")
            })
    }


    getToken = (onRegister) => {
        messaging().getToken()
            .then(fcmToken => {
                if (fcmToken) {
                    onRegister(fcmToken)
                } else {
                    onRegister("")
                }
            }).catch(error => {
                onRegister("")
            })
    }

    requestPermission = (onRegister) => {
        messaging().requestPermission()
            .then(() => {
                this.getToken(onRegister)
            }).catch(error => {
                onRegister("")
            })
    }

    deleteToken = () => {
        console.log("[FCMService] deleteToken ")
        messaging().deleteToken()
            .catch(error => {
                console.log("[FCMService] Delete token error ", error)
            })
    }

    createNotificationListeners = (onRegister, onNotification, onOpenNotification) => {

        // When the application is running, but in the background
        messaging()
            .onNotificationOpenedApp(remoteMessage => {
                console.log('[FCMService] onNotificationOpenedApp Notification caused app to open from background state:', remoteMessage)
                if (remoteMessage) {
                    const notification = remoteMessage.data ;
                    onOpenNotification(notification)
                    // this.removeDeliveredNotification(notification.notificationId)
                }
            });

        // When the application is opened from a quit state.
        messaging()
            .getInitialNotification()
            .then(remoteMessage => {
                console.log('[FCMService] getInitialNotification Notification caused app to open from quit state:', remoteMessage)
                if (remoteMessage) {
                    const notification = remoteMessage.data;
                    onOpenNotification(notification)
                    //  this.removeDeliveredNotification(notification.notificationId)
                }
            });

        // Foreground state messages
        this.messageListener = messaging().onMessage(async remoteMessage => {
            console.log('[FCMService] A new FCM message arrived!', remoteMessage);
            if (remoteMessage) {
                let notification = null
                notification = remoteMessage.data
                onNotification(notification)
            }
        });

        // Triggered when have new token
        messaging().onTokenRefresh(fcmToken => {
            console.log("[FCMService] New token refresh: ", fcmToken)
            onRegister(fcmToken)
        })

    }

    unRegister = () => {
        this.messageListener()
    }
}

export const fcmService = new FCMService()