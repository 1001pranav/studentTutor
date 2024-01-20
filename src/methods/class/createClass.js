const { SUCCESS, CANNOT_PERFORM } = require("../../constants/response")
const { insertClass, insertClassUser } = require("../../library/sql/class")

module.exports = async (requestBody) => {
    try {
        const [insertData] = await insertClass(requestBody.name, requestBody.user_info.user_id)

        if (!insertData.insertId) {
            return {
                ...CANNOT_PERFORM,
                responseMessage: CANNOT_PERFORM.responseMessage()
            }
        }
        await insertClassUser(insertData.insertId, requestBody.user_info.user_id);
        return {
            ...SUCCESS,
            responseMessage: SUCCESS.responseMessage()
        }
    } catch (error) {
    
        console.log("Error: in createClass API", error);
        return {
            ...SOMETHING_WENT_WRONG,
            responseMessage: SOMETHING_WENT_WRONG.responseMessage()
        };
    }
}