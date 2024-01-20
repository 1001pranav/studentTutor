const { SOMETHING_WENT_WRONG, SUCCESS } = require("../../constants/response");
const { searchFiles } = require("../../library/sql/classFiles");

module.exports = async (request) => {
    try {
        const [response] = await searchFiles(request.query.file_name, request.query.file_type, request.user_info.user_id, +request.query.class_id)
    
        return {
            responseStatus: SUCCESS.responseStatus,
            responseMessage: SUCCESS.responseMessage(),
            responseData: response
        }
    } catch (error) {
        console.log("Error: in searchFiles API", error);
        return {
            ...SOMETHING_WENT_WRONG,
            responseMessage: SOMETHING_WENT_WRONG.responseMessage()
        };
    }
}