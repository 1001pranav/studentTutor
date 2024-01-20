module.exports = {
    EMAIL_REGEX: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
    USER_TYPE: {
        STUDENT: 0,
        TUTOR: 1
    },
    DEVICE_TYPE: {
        WEB: 0,
        ANDROID: 1,
        IOS: 2,
        OTHERS: 3
    },
    FILE_TYPE: {
        AUDIO: 1,
        VIDEO: 2,
        IMAGE: 3,
        URL: 4
    },
    UPLOADS: "./files/",
    FILE_NAME_REGEX: /([a-z0-9_-]+\.[a-z0-9]{2,})/gm ,
    DEFAULT_STUDENT_PASSWORD: "Pass@123"
}