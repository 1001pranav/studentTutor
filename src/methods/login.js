const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const { findUserByParam, updateUser } = require("../library/sql/users");
const { NOT_FOUND, SUCCESS, SOMETHING_WENT_WRONG, AUTHENTICATION_FAILED } = require("../constants/response");
const { DEVICE_TYPE } = require("../constants/constant");

module.exports = async (data) => {
    try {
        console.log(data.user_type);
        const [userData] = await findUserByParam({ 
            email: data.email,
            user_type: data.user_type
        });
        console.log(userData);
        if (!userData[0]) {
            return {
                ...NOT_FOUND,
                responseMessage: NOT_FOUND.responseMessage(`user with ${data.email}`)
            }
        }

        if (!(await bcrypt.compare(data.password, userData[0].password))) {
            return {
                ...AUTHENTICATION_FAILED,
                responseMessage: AUTHENTICATION_FAILED.responseMessage()
            }
        }

        const accessToken = jwt.sign({ user_id: userData[0].user_id }, process.env.JWT_SECRET_KEY);
        
        const updateStatement = {
            statement: `access_token = ?`,
            values: [accessToken]
        };

        if (Object.values(DEVICE_TYPE).includes(data.device_type)) {
            updateStatement.statement += ', device_type = ?',
            updateStatement.values.push(data.device_type)
        }

        if (data.push_token) {
            updateStatement.statement += ', push_token = ?',
            updateStatement.values.push(data.push_token)
        }

        const whereStatement = {
            statement: 'user_id = ?',
            values: [userData[0].user_id]
        }

        await updateUser(updateStatement, whereStatement);
        
        return {
            ...SUCCESS,
            responseMessage: SUCCESS.responseMessage(),
            responseData: {
                user_id: userData[0].user_id,
                access_token: accessToken,
                user_type: userData[0].user_type
            }
        }
    } catch (error) {
        console.log("Error: in login API", error);
        return {
            ...SOMETHING_WENT_WRONG,
            responseMessage: SOMETHING_WENT_WRONG.responseMessage()
        };
    }
}