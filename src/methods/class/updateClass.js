const { NOT_FOUND, FAILED_TO_UPDATE, SUCCESS, SOMETHING_WENT_WRONG } = require("../../constants/response")
const { getClassData, updateClassData } = require("../../library/sql/class")

module.exports = async (requestBody) => {
    try {
        const [classData] = await getClassData({class_id: requestBody.class_id, created_by: requestBody.user_info.user_id})

        if (!classData[0]) {
            return {
                ...NOT_FOUND,
                requestMessage: NOT_FOUND.responseMessage("class_id")
            }
        }
        
        if (requestBody.name === classData[0].name) {
            
            return {
                ...FAILED_TO_UPDATE,
                requestMessage: FAILED_TO_UPDATE.responseMessage("Similar name")
            }
        }
        const updateData = await updateClassData(requestBody.class_id, requestBody.name);

        return {
            ...SUCCESS,
            responseMessage: SUCCESS.responseMessage()
        }
    } catch (error) {
        console.log("Error: in updateClass API", error);
        return {
            ...SOMETHING_WENT_WRONG,
            responseMessage: SOMETHING_WENT_WRONG.responseMessage()
        };
    }
}