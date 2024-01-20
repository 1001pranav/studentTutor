const firebase = require("firebase-admin");
const serviceAccount = require("../../../notification.config.json");
firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount)
});

module.exports = async (notificationTitle = "", notificationMessage = "", token) => {
    try {
        await firebase.messaging().send({
            token: token.toString(),
            notification: {
                title: notificationTitle,
                body: notificationMessage
            }
        })
    } catch (error) {
        console.log("Error: onSendingNotification", error);
    }
}