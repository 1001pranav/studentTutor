const { USER_TYPE, DEFAULT_STUDENT_PASSWORD } = require("../../constants/constant");
const { INVALID_INPUT_PARAM, SOMETHING_WENT_WRONG, SUCCESS, DATA_EXISTS } = require("../../constants/response");
const { getClassData, insertClassUser, getClassUserData } = require("../../library/sql/class");
const { findUserByParam, insertUser } = require("../../library/sql/users");

module.exports = async (requestBody) => {
    try {
        const [userData, classData] = await Promise.allSettled([
            findUserByParam({email: requestBody.email, user_type: USER_TYPE.STUDENT}),
            getClassData({class_id: requestBody.class_id})
        ]);

        if (!classData.value[0][0]) {
            return {
                ...INVALID_INPUT_PARAM,
                responseMessage: INVALID_INPUT_PARAM.responseMessage("class_id")
            }
        }
        let userID = 0; 
        if (!userData.value[0][0]) {
            const bcrypt = require("bcrypt");
            const hashedPassword =await bcrypt.hash(DEFAULT_STUDENT_PASSWORD, 10); 
            const insertUserData = await insertUser(requestBody.userName, requestBody.email, USER_TYPE.STUDENT, hashedPassword);
            userID = insertUserData[0].insertId
        } else {
            userID = userData.value[0][0].user_id;
            const [classUserData] = await getClassUserData(userData.value[0][0].user_id, classData.value[0][0].class_id);
            if (classUserData[0]) {
                return {
                    ...DATA_EXISTS,
                    responseMessage: DATA_EXISTS.responseMessage("class with student " + requestBody.email )
                }
            }
        }

        await insertClassUser(requestBody.class_id, userID);
        return {
            ...SUCCESS,
            responseMessage: SUCCESS.responseMessage()
        }
    } catch (error) {

        console.log("Error: in addStudent API", error);
        return {
            ...SOMETHING_WENT_WRONG,
            responseMessage: SOMETHING_WENT_WRONG.responseMessage()
        };
    }
}