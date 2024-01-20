const jwt = require("jsonwebtoken");

const { MISSING_AUTHENTICATION, AUTHENTICATION_FAILED, NOT_FOUND, SOMETHING_WENT_WRONG } = require("../src/constants/response");
const { findUserByParam } = require("../src/library/sql/users");

module.exports = async (req, res, next) => {

    try {
        const accessToken = req.get("access_token");

        if (!accessToken) {
            return res.status(MISSING_AUTHENTICATION.responseStatus).json({
                ...MISSING_AUTHENTICATION,
                responseMessage: MISSING_AUTHENTICATION.responseMessage()
            });
        }
    
        let verifiedAccessToken;
        try {
            verifiedAccessToken = jwt.verify(accessToken, process.env.JWT_SECRET_KEY);
        } catch (error) {
            console.log(error)
            return res.status(AUTHENTICATION_FAILED.responseStatus).json({
                ...AUTHENTICATION_FAILED,
                responseMessage: AUTHENTICATION_FAILED.responseMessage()
            });
        }
     
        if (!verifiedAccessToken) {
            return res.status(AUTHENTICATION_FAILED.responseStatus).json({
                ...AUTHENTICATION_FAILED,
                responseMessage: AUTHENTICATION_FAILED.responseMessage()
            });
        }
    
        const [userInfo] = (await findUserByParam({
            user_id: verifiedAccessToken.user_id,
            access_token: accessToken
        }));
        
        if (!userInfo[0]) {
            return res.status(AUTHENTICATION_FAILED.responseStatus).json({
                ...AUTHENTICATION_FAILED,
                responseMessage: AUTHENTICATION_FAILED.responseMessage()
            });
        }
    
        req.user_info = userInfo[0];

        next();
    } catch (error) {
        console.log("Error: on Authentication", error);
        return res.status(SOMETHING_WENT_WRONG.responseStatus).json({
            ...SOMETHING_WENT_WRONG,
            responseMessage: SOMETHING_WENT_WRONG.responseMessage()
        })
    }
}