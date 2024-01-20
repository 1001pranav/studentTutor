const { NOT_FOUND, SUCCESS, SOMETHING_WENT_WRONG } = require("../../constants/response");
const { deleteClassUser, getClassData } = require("../../library/sql/class");
const { findUserByParam } = require("../../library/sql/users");

module.exports = async (requestData) => {
    try {
        const [userData, classData] = await Promise.allSettled([
            findUserByParam({user_id: requestData.student_id}),
            getClassData({class_id: requestData.class_id})
        ]);
        console.log(userData.status, userData.value[0])
        if (!userData.value[0][0]) {
            return {
                ...NOT_FOUND,
                responseMessage: NOT_FOUND.responseMessage("user_id")
            }
        }
        if (!classData.value[0][0]) {
            return {
                ...NOT_FOUND,
                responseMessage: NOT_FOUND.responseMessage("class_id")
            }
        }
        
        await deleteClassUser(requestData.student_id, requestData.class_id);
        
        return {
            ...SUCCESS,
            responseMessage: SUCCESS.responseMessage()    
        }
    } catch (error) {
        console.log("Error: in deleteStudent API", error);
        return {
            ...SOMETHING_WENT_WRONG,
            responseMessage: SOMETHING_WENT_WRONG.responseMessage()
        };
    }   
}