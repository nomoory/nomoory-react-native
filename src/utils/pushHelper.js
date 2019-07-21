import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions'
import {
    Platform,
} from 'react-native';

export const registerForPushNotificationsAsync = async () => {
    const { status: existingStatus } = await Permissions.getAsync(
        Permissions.NOTIFICATIONS
    );
    let finalStatus = existingStatus;

    // only ask if permissions have not already been determined, because
    // iOS won't necessarily prompt the user a second time.
    if (existingStatus !== 'granted') {
        // Android remote notification permissions are granted during the app
        // install, so this will only ask on iOS
        const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
        finalStatus = status;
    }

    // Get the token that uniquely identifies this device
    let token = await Notifications.getExpoPushTokenAsync();
    let os = Platform.OS;
    let permission = null;

    // Stop here if the user did not grant permissions
    if (finalStatus !== 'granted') {
        permission = false;
    } else {
        permission = true;
    }

    alert({ token });
    // POST the token to your backend server from where you can retrieve it to send push notifications.
    return agent.updateUserPushToken({
        token,
        os,
        permission,
    });
}

