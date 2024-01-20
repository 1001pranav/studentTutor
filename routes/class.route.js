const { Router } = require("express");

const authentication = require("../middleware/authentication");;

const { onlyTutorsAllowed } = require("../middleware/userTypeValidation");
const { MISSING_PARAMS, SOMETHING_WENT_WRONG, SUCCESS, INVALID_INPUT_PARAM } = require("../src/constants/response");
const { EMAIL_REGEX } = require("../src/constants/constant");

const router = Router();

router.get("/", authentication, async (req, res, next) => {
    try {
        const { getAllClassDetailsForUser } = require("../src/library/sql/class");
        const [data] = await getAllClassDetailsForUser(req.user_info.user_id);
        return res.status(SUCCESS.responseStatus).json({
            responseStatus: SUCCESS.responseStatus,
            responseMessage: SUCCESS.responseMessage(),
            responseData: data
        });
    } catch (error) {
        console.log("Error: on classGet", error);
        return res.status(SOMETHING_WENT_WRONG.responseStatus).json({
            ...SOMETHING_WENT_WRONG,
            responseMessage: SOMETHING_WENT_WRONG.responseMessage()
        });
    }
});

// Inserting new class
router.post("/", authentication, onlyTutorsAllowed, async (req, res, next) => {
    try {
        const createClass = require("../src/methods/class/createClass");

        if (!("name" in req.body)) {
            return res.status(MISSING_PARAMS.responseStatus).json({
                ...MISSING_PARAMS,
                responseMessage: MISSING_PARAMS.responseMessage("name")
            })
        }
    
        const body = {
            ...req.body,
            user_info: req.user_info
        }
        const response = await createClass(body);
        return res.status(response.responseStatus).json(response);
    } catch (error) {
        console.log("Error on classPost", error);
        return res.status(SOMETHING_WENT_WRONG.responseStatus).json({
            ...SOMETHING_WENT_WRONG,
            responseMessage: SOMETHING_WENT_WRONG.responseMessage()
        });
    }
});

router.delete("/", authentication, onlyTutorsAllowed, async (req, res, next) => {
    
    if (!("class_id" in req.body)) {

        return res.status(MISSING_PARAMS.responseStatus).send({
            ...MISSING_PARAMS,
            responseMessage: MISSING_PARAMS.responseMessage("class_id")
        });
    }

    const deleteClass = require("../src/methods/class/deleteClass");
    const response = await deleteClass({
        ...req.body,
        user_info: req.user_info
    });
    return res.status(response.responseStatus).json(response);
});

router.patch("/", authentication, onlyTutorsAllowed, async (req, res, next) => {
    try {
        if (!("name" in req.body)) {
            return res.status(MISSING_PARAMS.responseStatus).send({
                ...MISSING_PARAMS,
                responseMessage: MISSING_PARAMS.responseMessage("name")
            });
        }
        if (!("class_id" in req.body)) {
            return res.status(MISSING_PARAMS.responseStatus).send({
                ...MISSING_PARAMS,
                responseMessage: MISSING_PARAMS.responseMessage("class_id")
            });
        }
    
        const updateClass = require("../src/methods/class/updateClass");
        const response = await updateClass({
            ...req.body,
            user_info: req.user_info
        });
        return res.status(response.responseStatus).json(response);
    } catch (error) {
        console.log("Error on classPatch", error);
        return res.status(SOMETHING_WENT_WRONG.responseStatus).json({
            ...SOMETHING_WENT_WRONG,
            responseMessage: SOMETHING_WENT_WRONG.responseMessage()
        });
    }
});

router.post("/addStudent", authentication, onlyTutorsAllowed, async (req, res, next) => {
    try {
        if (!("user_name" in req.body)) {
            return res.status(MISSING_PARAMS.responseStatus).json({
                ...MISSING_PARAMS,
                responseMessage: MISSING_PARAMS.responseMessage("user_name")
            });
        }

        if(!("email" in req.body)) {
            return res.status(MISSING_PARAMS.responseStatus).json({
                ...MISSING_PARAMS,
                responseMessage: MISSING_PARAMS.responseMessage("email")
            });
        }
        
        if(!("class_id" in req.body)) {
            return res.status(MISSING_PARAMS.responseStatus).json({
                ...MISSING_PARAMS,
                responseMessage: MISSING_PARAMS.responseMessage("class_id")
            });
        }
        
        if (!req.body.email.match(EMAIL_REGEX)) {
            return res.status(INVALID_INPUT_PARAM.responseStatus).json({
                ...INVALID_INPUT_PARAM,
                responseMessage: INVALID_INPUT_PARAM.responseMessage("email")
            });
        }

        const addStudent = require("../src/methods/class/addStudent");
        const studentResponse = await addStudent({...req.body, user_info: req.user_info});

        return res.status(studentResponse.responseStatus).json(studentResponse);
    } catch (error) {
        console.log("Error: on class/addStudent", error);
        return res.status(SOMETHING_WENT_WRONG.responseStatus).json({
            ...SOMETHING_WENT_WRONG,
            responseMessage: SOMETHING_WENT_WRONG.responseMessage()
        });
    }
});

router.delete("/deleteStudent/:studentID/:classID", authentication, onlyTutorsAllowed, async (req, res, next) => {
    try {

        const deleteStudent = require("../src/methods/class/deleteStudent");
        const deleteStudentResponse = await deleteStudent({
            class_id: req.params.classID,
            student_id: req.params.studentID,
            user_info: req.user_info
        });

        return res.status(deleteStudentResponse.responseStatus).json(deleteStudentResponse);
    } catch (error) {
         console.log("Error: on deleteStudent", error);
         return res.status(SOMETHING_WENT_WRONG.responseStatus).json({
             ...SOMETHING_WENT_WRONG,
             responseMessage: SOMETHING_WENT_WRONG.responseMessage()
         });
    }
});

module.exports = router;
