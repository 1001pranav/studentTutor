const fs = require("fs");
const path = require("path");

const { SOMETHING_WENT_WRONG, SUCCESS, NOT_FOUND, SERVER_ERROR_UPLOAD, DATA_EXISTS } = require("../../constants/response");
const { getClassData } = require("../../library/sql/class");
const { UPLOADS, FILE_TYPE } = require("../../constants/constant");
const { getClassFilesByParam, insertClassFiles } = require("../../library/sql/classFiles");

module.exports = async (requestBody) => {
    try {
        const [classData ]= await getClassData({class_id: +requestBody.query.class_id, created_by: requestBody.user_info.user_id});

        if (!classData[0]) {
            return {
                ...NOT_FOUND,
                requestMessage: NOT_FOUND.responseMessage("class_id")
            }
        }
        
        if (+requestBody.query.file_type == FILE_TYPE.URL) {
            await insertClassFiles(classData[0].class_id, null, requestBody.query.description, requestBody.query.url, requestBody.user_info.user_id, +requestBody.query.file_type)

            return {
                ...SUCCESS,
                responseMessage: SUCCESS.responseMessage()
            }
        }

        const [fileData] = await getClassFilesByParam({file_name: requestBody.query.file_name}, requestBody.user_info.user_id);

        if (fileData[0]) {
            return {
                ...DATA_EXISTS,
                requestMessage: DATA_EXISTS.responseMessage(`file_name with ${requestBody.query.file_name}`)
            }
        }

        const fileLocation = path.join(UPLOADS, `class_${classData[0].class_id}`);
        if (!fs.existsSync(fileLocation)) {
            fs.mkdirSync(fileLocation, { recursive: true });
        }
        const filePath = path.join(fileLocation, requestBody.query.file_name)
        const writeStream = fs.createWriteStream(filePath);
        
        requestBody.pipe(writeStream);
 
        const fileUploadPromise = new Promise((resolve, reject) => {
            writeStream.on('finish', () => {
                console.log("Successfully writing file")
                resolve({
                    ...SUCCESS,
                    responseMessage: SUCCESS.responseMessage()
                })
            });
            writeStream.on('error', (err) => {
                console.error('Error writing file:', err);
                
                reject({
                    ...SERVER_ERROR_UPLOAD,
                    responseMessage: SERVER_ERROR_UPLOAD.responseMessage()
                })
            });
        });

        const response = await fileUploadPromise;

        if ( response.responseStatus === 200 ) {
            await insertClassFiles(classData[0].class_id, requestBody.query.file_name, requestBody.query.description, filePath, requestBody.user_info.user_id, +requestBody.query.file_type)
        }
        
        return response;
    } catch (error) {
        console.log("Error on InsertFiles", error);
        return {
            ...SOMETHING_WENT_WRONG,
            responseMessage: SOMETHING_WENT_WRONG.responseMessage()
        };
    }
}
