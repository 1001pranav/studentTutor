const { USER_TYPE } = require("../src/constants/constant");
const { UNAUTHORIZED, SOMETHING_WENT_WRONG } = require("../src/constants/response");


function onlyTutorsAllowed(req, res, next) {
    
   try {
        if (req?.user_info?.user_type === USER_TYPE.STUDENT || !req?.user_info) {
            return res.status(UNAUTHORIZED.responseStatus).json({
                ...UNAUTHORIZED,
                responseMessage: UNAUTHORIZED.responseMessage()
            });
        }
        next();
   } catch (error) {
        console.log("Error: on onlyTutorsAllowed", error);
        return res.status(SOMETHING_WENT_WRONG.responseStatus).json({
            ...SOMETHING_WENT_WRONG,
            responseMessage: SOMETHING_WENT_WRONG.responseMessage()
        });
   }
}

module.exports = {
    onlyTutorsAllowed
}