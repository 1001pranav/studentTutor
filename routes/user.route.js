const { Router } = require("express");
const router = Router();

const { MISSING_PARAMS, INVALID_INPUT_PARAM } = require("../src/constants/response");
const { EMAIL_REGEX, USER_TYPE, DEVICE_TYPE } = require("../src/constants/constant");
const login = require("../src/methods/login");

router.post("/login", async (req, res, next) => {

    // console.log("calling routes", JSON.stringify(req.body), JSON.stringify(req.query));
    if (!('email' in req.body)) {
        return res.status(MISSING_PARAMS.responseStatus).json({
            ...MISSING_PARAMS,
            responseMessage: MISSING_PARAMS.responseMessage("email"),
        });
    }

    if (!("password" in req.body)) {
        return res.status(MISSING_PARAMS.responseStatus).json({
            ...MISSING_PARAMS,
            responseMessage: MISSING_PARAMS.responseMessage("password")
        });
    }

    if (!("user_type" in req.body)) {
        return res.status(MISSING_PARAMS.responseStatus).json({
            ...MISSING_PARAMS,
            responseMessage: MISSING_PARAMS.responseMessage("user_type")
        });
    }

    if (!req.body.email.match(EMAIL_REGEX)) {
        return res.status(INVALID_INPUT_PARAM.responseStatus).json({
            ...INVALID_INPUT_PARAM,
            responseMessage: INVALID_INPUT_PARAM.responseMessage("email")
        })
    }

    if (!Object.values(USER_TYPE).includes(+req.body.user_type)) {
        return res.status(INVALID_INPUT_PARAM.responseStatus).json({
            ...INVALID_INPUT_PARAM,
            responseMessage: INVALID_INPUT_PARAM.responseMessage("user_type")
        });
    }

    if (req.body.push_token) {
        if (!req.body.device_type || !Object.values(DEVICE_TYPE).includes(req.body.device_type)) {
            return res.status(INVALID_INPUT_PARAM.responseStatus).json({
                ...INVALID_INPUT_PARAM,
                responseMessage: INVALID_INPUT_PARAM.responseMessage("device_type")
            });
        }  
    }
    else {
        if (!Object.values(DEVICE_TYPE).includes(req.body.device_type)) {
            req.body.device_type = DEVICE_TYPE.OTHERS;
        }
    }

    const loginResponse = await login(req.body);

    return res.status(loginResponse.responseStatus).json(loginResponse);
});

router.post("/register", async (req, res, next)=> {
    if (!('email' in req.body)) {
        return res.status(MISSING_PARAMS.responseStatus).json({
            ...MISSING_PARAMS,
            responseMessage: MISSING_PARAMS.responseMessage("email"),
        });
    }

    if (!("password" in req.body)) {
        return res.status(MISSING_PARAMS.responseStatus).json({
            ...MISSING_PARAMS,
            responseMessage: MISSING_PARAMS.responseMessage("password")
        });
    }

    if (!("user_name" in req.body)) {
        return res.status(MISSING_PARAMS.responseStatus).json({
            ...MISSING_PARAMS,
            responseMessage: MISSING_PARAMS.responseMessage("user_name")
        });
    }
    const emailRegex = new RegExp(EMAIL_REGEX);
    
    if (! emailRegex.test(req.body.email))  {
        return res.status(INVALID_INPUT_PARAM.responseStatus).json({
            ...INVALID_INPUT_PARAM,
            responseMessage: INVALID_INPUT_PARAM.responseMessage("email")
        })
    }
    const register = require("../src/methods/register");
    const response = await register(req);
    return res.status(response.responseStatus).json(response);
});
module.exports = router;
