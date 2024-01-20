
const replaceStatusMessage = (message, replaceMessage) => {
    return message.replaceAll("<replace>", replaceMessage);
}

module.exports = {
    "MISSING_PARAMS": {
        responseStatus: 400,
        responseMessage: (missingParam) => replaceStatusMessage("Missing <replace> parameter in request", missingParam),
        responseData: {}
    },
    "NOT_FOUND": {
        responseStatus: 404,
        responseMessage: (data="Data") => replaceStatusMessage("<replace> that you are looking for is not found", data),
        responseData: {}
    },
    "MISSING_AUTHENTICATION": {
        responseStatus: 403,
        responseMessage: () => "Missing Authentication token",
        responseData: {} 
    },
    "AUTHENTICATION_FAILED": {
        responseStatus: 403,
        responseMessage: () => "Authentication failed, Please login again",
        responseData: {}
    },
    "INVALID_INPUT_PARAM": {
        responseStatus: 400,
        responseMessage: (message="Parameter") => replaceStatusMessage("Input <replace> is invalid", message),
        responseData: {}
    },
    "SUCCESS": {
        responseStatus: 200,
        responseMessage: () => "Success",
        responseData: {}
    },
    "SOMETHING_WENT_WRONG": {
        responseStatus: 500,
        responseMessage: () => "Something went wrong, Please try in sometime",
        responseData: {}
    },
    "UNAUTHORIZED": {
        responseStatus: 401,
        responseMessage: () => "You are unauthorized to access the data",
        responseData: {} 
    },
    "CANNOT_PERFORM": {
        responseStatus: 417,
        responseMessage: () => "Failed to perform the operation due to some issue, Please try again",
        responseData: {} 
    },
    "FAILED_TO_UPDATE": {
        responseStatus: 417,
        responseMessage: (message = "some error") => replaceStatusMessage("Failed to update due to <replace>, Please try again", message),
        responseData: {} 
    },
    "SERVER_ERROR_UPLOAD": {
        responseStatus: 500,
        responseMessage: () => "Failed To Upload due to some error in server",
        responseData: {} 
    },
    "DATA_EXISTS": {
        responseStatus: 409,
        responseMessage: (message="Data") => replaceStatusMessage("<replace> already exists in the server, please try again with different input.", message),
        responseData: {} 
    },
    "API_NOT_FOUND": {
        responseStatus: 404,
        responseMessage: () => "Hey, You have reached dead end, Please check endpoint",
        responseData: {} 
    },
};