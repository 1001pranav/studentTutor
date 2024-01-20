const { FILE_TYPE } = require("../../constants/constant");
const connectTODB = require("./connection/db_connection");

const classFilesSQLFunction = {};

classFilesSQLFunction.insertClassFiles = async (...insertObj) => {
    const connectionPool = connectTODB();
    const insertSQLQuery = `
        INSERT INTO class_files 
            (class_id, file_name, description, file_location, uploaded_by, file_type) 
        VALUES 
            (?, ?, ?, ?, ?, ?)
    `;
    return await connectionPool.query(insertSQLQuery, insertObj);
}

classFilesSQLFunction.updateClassFiles = async(filesID, fileName, description, fileLocation) => {
    const connectionPool = connectTODB();
    const updateData = [];
    let updateSQLQuery = `UPDATE class_files SET `;
    
    if (fileName) {
        updateSQLQuery += ` file_name = ?, file_location = ? `;
        updateData.push(fileName, fileLocation);
    }

    if (description) {
        updateSQLQuery += fileName ? " , ": " ";
        updateSQLQuery += `description = ?`;
        updateData.push(description);
    }

    updateSQLQuery += `  WHERE file_id = ?`;
    updateData.push(filesID);
    return await connectionPool.query(updateSQLQuery, updateData);
} 

classFilesSQLFunction.searchFiles = async (fileName, fileType, studentID, classID) => {
    const connectionPool = connectTODB();

    let searchSQL = `
        SELECT 
            class_files.file_id, class_files.class_id, file_name, class_files.description, file_type,
            IF(file_type=${FILE_TYPE.URL}, class_files.file_location, NULL) as url
            FROM class_files 
            INNER JOIN class_users USING(class_id)
        WHERE
    `;

    const findArrData = [];
    
    if (fileName) {
        searchSQL += ` file_name LIKE %${fileName}%`
    }

    if (fileType) {
        searchSQL += fileName ? " AND " : " ";
        searchSQL += ` file_type = ? `
        findArrData.push(fileType);
    }

    searchSQL +=  ` class_users.user_id = ? AND class_users.class_id = ? AND class_files.class_id = ?`;
    findArrData.push(studentID, classID, classID);
    return await connectionPool.query(searchSQL, findArrData);
}

classFilesSQLFunction.findFiles = async(fileName, studentID, classID) => {
    const findSQLQuery = ` 
        SELECT 
            class_files.* FROM class_files
            INNER JOIN class_users USING (user_id)
            INNER JOIN class USING (class_id)
        WHERE
            class_users.user_id = :userID AND
            class_files.file_name LIKE %${fileName}% AND
            class_files.class_id = :classID AND class_users.class_id = :classID AND
            class.class_id = :classID
    `;
    const connectionPool = connectTODB();
    return await connectionPool.query(findSQLQuery, {userID: studentID, classID});
}

classFilesSQLFunction.deleteFiles = async (fileID) => {
    const connectionPool = connectTODB();
    const deleteQuery = `DELETE FROM class_files WHERE file_id = ?`;
    return await connectionPool.query(deleteQuery, [fileID]);
}

classFilesSQLFunction.getClassFilesByParam = async(params = {}, userID, requiredColumns = '*') => {
    try {
        let findSQLQuery = `SELECT ${requiredColumns} from class_files  `;

        findSQLQuery += ` INNER JOIN class_users ON class_users.class_id = class_files.class_id `
        const colValue = [];
        const columnNames = Object.keys(params);
        
        if (columnNames.length > 0) {
            findSQLQuery += " WHERE ";
        }
        else {
            findSQLQuery += " WHERE class_users.user_id = ?"
            colValue = [userID]
        }
    
        for (let columnIndex = 0; columnIndex < columnNames.length; columnIndex++) {
            const column = columnNames[columnIndex];
            findSQLQuery += ` ${column} = ? `
            colValue.push(params[column]);
    
            if (columnIndex < columnNames.length - 1) {
                findSQLQuery += " AND ";
            } else {
                findSQLQuery += " AND class_users.user_id = ?";
                colValue.push(userID);
            }
        }
        
        const connectionPool = connectTODB();
        return await connectionPool.query(findSQLQuery, colValue);
    } catch (error) {
        console.log("Error in getClassFilesByParam", error);
    }
}

classFilesSQLFunction.updateClassFileToNullClass = async (classID) => {
    const connectionPool = connectTODB();
    const updateClassFilesSQLQuery = ` UPDATE class_files SET class_id = ? WHERE class_id = ?`;
    return await connectionPool.query(updateClassFilesSQLQuery, [null, classID]); 
}

classFilesSQLFunction.getNullClassFiles = async () => {
    const connectionPool = connectTODB();
    const selectQuery = `SELECT * FROM class_files WHERE ISNULL(class_id)`
    return await connectionPool.query(selectQuery);
}
module.exports = classFilesSQLFunction;