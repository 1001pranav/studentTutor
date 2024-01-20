const { Router } = require("express");

const authentication = require("../middleware/authentication");

const { onlyTutorsAllowed } = require("../middleware/userTypeValidation");
const { MISSING_PARAMS, INVALID_INPUT_PARAM, SOMETHING_WENT_WRONG, NOT_FOUND } = require("../src/constants/response");
const { FILE_TYPE, FILE_NAME_REGEX } = require("../src/constants/constant");
const router = Router();

router.get("/", authentication,async (req, res, next) => {
   try {
        if (!("class_id" in req.query) || !+req.query.class_id) {
            return res.status(MISSING_PARAMS.responseStatus).json({
                ...MISSING_PARAMS,
                responseMessage: MISSING_PARAMS.responseMessage("class_id")
            });
        }

        if (
            "file_type" in req.query &&
            !Object.values(FILE_TYPE).includes(+req.query.file_type)
        ) {
            return res.status(INVALID_INPUT_PARAM.responseStatus).json({
                ...INVALID_INPUT_PARAM,
                responseMessage: INVALID_INPUT_PARAM.responseMessage("file_type")
            });
        }
                
        const search = require("../src/methods/files/searchFiles");
        const response = await search(req);
        return res.status(response.responseStatus).json(response);
   } catch (error) {
        console.log("Error: on filesGet", error);
        return res.status(SOMETHING_WENT_WRONG.responseStatus).json({
            ...SOMETHING_WENT_WRONG,
            responseMessage: SOMETHING_WENT_WRONG.responseMessage()
        });
   } 
});

router.post("/", authentication, onlyTutorsAllowed, async (req, res, next) => {
    try {
        
        if (!("class_id" in req.query)) {
            return res.status(MISSING_PARAMS.responseStatus).json({
                ...MISSING_PARAMS,
                responseMessage: MISSING_PARAMS.responseMessage("class_id")
            });
        }

        if (!("description" in req.query)) {
            return res.status(MISSING_PARAMS.responseStatus).json({
                ...MISSING_PARAMS,
                responseMessage: MISSING_PARAMS.responseMessage("description")
            });
        }

        if (!Object.values(FILE_TYPE).includes(+req.query.file_type)) {
            return res.status(INVALID_INPUT_PARAM.responseStatus).json({
                ...INVALID_INPUT_PARAM,
                responseMessage: INVALID_INPUT_PARAM.responseMessage("file_type")
            })
        }

        if (!("file_name" in req.query) &&  +req.query.file_type != FILE_TYPE.URL) {
            return res.status(MISSING_PARAMS.responseStatus).json({
                ...MISSING_PARAMS,
                responseMessage: MISSING_PARAMS.responseMessage("file_name")
            });
        }

        if (+req.query.file_type == FILE_TYPE.URL && !("url" in req.query)) {
            return res.status(MISSING_PARAMS.responseStatus).json({
                ...MISSING_PARAMS,
                responseMessage: MISSING_PARAMS.responseMessage("url")
            })
        }
        const insertFile = require("../src/methods/files/insertFile");
        const responseData = await insertFile(req);

        return res.status(responseData.responseStatus).json(responseData);

    } catch (error) {
         console.log("Error: on filesPost", error);
         return res.status(SOMETHING_WENT_WRONG.responseStatus).json({
             ...SOMETHING_WENT_WRONG,
             responseMessage: SOMETHING_WENT_WRONG.responseMessage()
         });
    }
});

router.put("/", authentication, onlyTutorsAllowed, async (req, res, next)=> {
    try {

        if (!("file_id" in req.body)) {
            return res.status(MISSING_PARAMS.responseStatus).json({
                ...MISSING_PARAMS,
                responseMessage: MISSING_PARAMS.responseMessage("file_id")
            });
        }

        const fileNameRegEx = new RegExp(FILE_NAME_REGEX)
        if (req.body.file_name && !fileNameRegEx.test(req.body.file_name)) {
            return res.status(INVALID_INPUT_PARAM.responseStatus).json({
                ...INVALID_INPUT_PARAM,
                responseMessage: INVALID_INPUT_PARAM.responseMessage("file_name")
            });
        }
        const files = require("../src/methods/files/updateFiles");
        const response = await files(req);
        return res.status(response.responseStatus).json(response);
    }  catch (error) {
         console.log("Error: on filesPut", error);
         return res.status(SOMETHING_WENT_WRONG.responseStatus).json({
             ...SOMETHING_WENT_WRONG,
             responseMessage: SOMETHING_WENT_WRONG.responseMessage()
         });
    }
});

router.delete("/:fileID", authentication, onlyTutorsAllowed, async(req, res, next)=> {
    try {
        const deleteFile = require("../src/methods/files/deleteFiles");
        const response = await deleteFile(req);
        console.log(response);
        return res.status(response.responseStatus).json(response);
    } catch (error) {
         console.log("Error: on filesDelete", error);
         return res.status(SOMETHING_WENT_WRONG.responseStatus).json({
             ...SOMETHING_WENT_WRONG,
             responseMessage: SOMETHING_WENT_WRONG.responseMessage()
         });
    }
});

router.get("/stream/:fileID", authentication, async(request, res, next) => {
    try {
        const fs = require("fs");
        const { getClassFilesByParam } = require("../src/library/sql/classFiles");
        
        const [filesData] = await getClassFilesByParam({file_id: +request.params.fileID}, request.user_info.user_id);
        if (!filesData[0]) {
            
           return res.status(NOT_FOUND.responseStatus).json({
                ...NOT_FOUND,
                responseMessage: NOT_FOUND.responseMessage("file with Id "+ request.params.fileID )
            });
        }

        if(fs.existsSync(filesData[0].file_location)) {
            res.setHeader('Content-Type', 'application/octet-stream');
            res.setHeader('Content-Disposition', `attachment; filename=${filesData[0].file_name}`);

            const fileStream = fs.createReadStream(filesData[0].file_location);
            fileStream.pipe(res);
            fileStream.on("error", (err) => {
                console.log("Error on streaming files", err);
                throw err;
            });
        }
        else {
            return res.status(NOT_FOUND.responseStatus).json({
                ...NOT_FOUND,
                responseMessage: NOT_FOUND.responseMessage("File")
            })
        }
        
    } catch (error) {
        console.log("Error: onStreaming", error);
        return res.status(SOMETHING_WENT_WRONG.responseStatus).json({
            ...SOMETHING_WENT_WRONG,
            responseMessage: SOMETHING_WENT_WRONG.responseMessage()
        });   
    }
});

module.exports = router;
