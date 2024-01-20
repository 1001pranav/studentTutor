const { updateClassFileToNullClass } = require("../../library/sql/classFiles")
const { NOT_FOUND, SOMETHING_WENT_WRONG, SUCCESS } = require("../../constants/response")
const { deleteClass, getClassData } = require("../../library/sql/class")

module.exports = async (requestBody) => {
    try {
        const [classData] = await getClassData({class_id: requestBody.class_id, created_by: requestBody.user_info.user_id})

        if (!classData[0]) {
            return {
                ...NOT_FOUND,
                requestMessage: NOT_FOUND.responseMessage("class_id")
            }
        }

        await updateClassFileToNullClass(classData[0].class_id);
        await deleteClass(requestBody.class_id);
        
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