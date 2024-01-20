const fs = require("fs");

const { SOMETHING_WENT_WRONG, SUCCESS, CANNOT_PERFORM, NOT_FOUND } = require("../../constants/response");
const { deleteFiles, getClassFilesByParam } = require("../../library/sql/classFiles");
const { FILE_TYPE } = require("../../constants/constant");

module.exports = async (requestBody) => {

    try {
        const [fileData] = await getClassFilesByParam({file_id: +requestBody.params.fileID, uploaded_by: requestBody.user_info.user_id}, requestBody.user_info.user_id);
        console.log(fileData);
        if (!fileData[0]) {
            return {
                ...NOT_FOUND,
                responseMessage: NOT_FOUND.responseMessage("file_id")
            }
        }
        
        if (fileData[0].file_type != FILE_TYPE.URL) {
            fs.unlink(fileData[0].file_location, (err) => {
                if (err) {
                    console.log("Error on deleting file", err);
                    return {
                        ...CANNOT_PERFORM,
                        responseMessage: CANNOT_PERFORM.responseMessage()
                    };
                }
            });
        }
        await deleteFiles(fileData[0].file_id);

        return {
            ...SUCCESS,
            responseMessage: SUCCESS.responseMessage()
        }
    } catch (error) {
        console.log("Error on DeletingFiles", error);
        return {
            ...SOMETHING_WENT_WRONG,
            responseMessage: SOMETHING_WENT_WRONG.responseMessage()
        };
    }
}
