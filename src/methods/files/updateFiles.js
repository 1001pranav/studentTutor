const { NOT_FOUND, FAILED_TO_UPDATE, SUCCESS, SOMETHING_WENT_WRONG } = require("../../constants/response");
const { getClassFilesByParam, updateClassFiles } = require("../../library/sql/classFiles");

module.exports = async (requestBody) => {
    try {

        const [fileData] = await getClassFilesByParam({file_id: requestBody.body.file_id, uploaded_by: requestBody.user_info.user_id}, requestBody.user_info.user_id);
        console.log(fileData)
        if (!fileData[0]) {
            return {
                ...NOT_FOUND,
                responseMessage: NOT_FOUND.responseMessage("file_id")
            }
        }
        const updateFields = {};

        
        if ("file_name" in requestBody.body) {
            
            const fs = require("fs");
            updateFields.file_name = requestBody.body.file_name;
            updateFields.file_location  = fileData[0].file_location.replace(fileData[0].file_name, updateFields.file_name);

            fs.rename(fileData[0].file_location, updateFields.file_location , (err) => {
                if (err) { 
                    return {
                        ...FAILED_TO_UPDATE,
                        responseMessage: FAILED_TO_UPDATE.responseMessage()
                    }
                }
            });
        }        

        if ("description" in requestBody.body) {
            updateFields.description = requestBody.body.description;
        }

        await updateClassFiles(requestBody.body.file_id, updateFields.file_name, updateFields.description, updateFields.file_location);
        return {
            ...SUCCESS,
            responseMessage: SUCCESS.responseMessage(),
        }

    } catch (error) {
        console.log("Error: in updateFiles API", error);
        return {
            ...SOMETHING_WENT_WRONG,
            responseMessage: SOMETHING_WENT_WRONG.responseMessage()
        };
    }
}

