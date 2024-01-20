const { hash } = require("bcrypt");
const { USER_TYPE } = require("../constants/constant");
const { DATA_EXISTS, SUCCESS } = require("../constants/response");
const { findUserByParam, insertUser } = require("../library/sql/users")

module.exports = async (request) => {
    const [userData] = await findUserByParam({email: request.body.email, user_type: USER_TYPE.TUTOR});
    
    if (userData[0]) {
        return {
            ...DATA_EXISTS,
            responseMessage: DATA_EXISTS.responseMessage("Tutor with email "+ userData[0].email)
        }
    }
    
    const hashedPassword = await hash(request.body.password, 10);
    await insertUser(request.body.user_name, request.body.email, USER_TYPE.TUTOR, hashedPassword);
    
    return {
        ...SUCCESS,
        responseMessage: SUCCESS.responseMessage()
    }
}