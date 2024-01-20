const connectTODB = require("./connection/db_connection");

const classSQLFunction = {};

classSQLFunction.insertClass = async (className, createdBy) => {
    const connectionPool = connectTODB();
    const insertQuery = "INSERT INTO class(name, created_by) VALUES (?, ?)";
    return await connectionPool.query(insertQuery, [className, createdBy]); 
}

classSQLFunction.insertClassUser = async (classId, userId) => {
    const connectionPool = connectTODB();
    const insertQuery = "INSERT INTO class_users(class_id,user_id) VALUES (? ,?)";
    return await connectionPool.query(insertQuery, [classId, userId]);
}

classSQLFunction.getClassData = async (params = {}, requiredColumns = "*") => {
    try {
        const connectionPool = connectTODB();

        let findSQLQuery = `SELECT ${requiredColumns} from class  `;
        const colValue = [];
        const columnNames = Object.keys(params);
        
        if (columnNames.length > 0) {
            findSQLQuery += " WHERE ";
        }
    
        for (let columnIndex = 0; columnIndex < columnNames.length; columnIndex++) {
            const column = columnNames[columnIndex];
            findSQLQuery += ` ${column} = ? `
            colValue.push(params[column]);
    
            if (columnIndex < columnNames.length - 1) {
                findSQLQuery += " AND ";
            }
        }
        return await connectionPool.query(findSQLQuery, colValue);
    } catch (error) {
        console.log("Error: onGetClassData", error);
    }
}

classSQLFunction.updateClassData = async (classId, className) => {
    const connectionPool = connectTODB();
    const updateQuery = `UPDATE class SET name = ? WHERE class_id = ?`
    return await connectionPool.query(updateQuery, [className, classId]);
}

classSQLFunction.deleteClass = async(classId) => {
    try {
        const connectionPool = connectTODB();
        const deleteSQLQuery = `DELETE  FROM  class WHERE class_id = ?`;
        return await connectionPool.query(deleteSQLQuery, [classId]);
    } catch (error) {
        console.log("Error: on DeletingClass", error);
    }
}

classSQLFunction.getAllClassDetailsForUser = async (userID) => {
    const connectionPool = connectTODB();
    const getQuery = `
        SELECT class.* 
            from class_users
            INNER JOIN class USING(class_id)
        WHERE class_users.user_id = ?
    `
    return await connectionPool.query(getQuery, [userID]);
}

classSQLFunction.deleteClassUser = async (userID, classID) => {
    try {
        const connectionPool = connectTODB();
        const deleteSQLQuery = `DELETE FROM class_users WHERE (class_id = ? AND user_id = ?)`;
        return await connectionPool.query(deleteSQLQuery, [classID, userID]);
    } catch (error) {
        console.log("Error: OnDeleteClassuser", error);
    }

}

classSQLFunction.getClassUserData = async (userID, classID,  requiredColumns = '*') => {
    try {
        const connectionPool = connectTODB();
        const sqlQuery = `SELECT ${requiredColumns} FROM class_users WHERE class_id = ? AND user_id = ?  `;
        return await connectionPool.query(sqlQuery, [classID, userID]);
    } catch (error) {
        console.log("Error: onClassUserData", error);
    }

}
module.exports = classSQLFunction;