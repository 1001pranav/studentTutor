const { USER_TYPE } = require("../../constants/constant");
const connectTODB = require("./connection/db_connection");
const userSQLFunction = {};

userSQLFunction.findUserByParam = async (params = {}, requiredColumns = "*") => {
    try {
        let findSQLQuery = `SELECT ${requiredColumns} from user  `;
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
        
        const connectionPool = connectTODB();
        return await connectionPool.query(findSQLQuery, colValue);
    } catch (error) {
        console.log("Error: on findUserByParam", error)
    }
}

userSQLFunction.updateUser = async (updateObj = { statement: "", values: [] }, whereObj = { statement: "", values: [] }) => {
    try {
        const connectionPool = connectTODB();

        let updateSQLQuery = `
            UPDATE user 
                SET
        `;
        updateSQLQuery += updateObj.statement;

        updateSQLQuery += " WHERE ";
        updateSQLQuery += whereObj.statement;
        return await connectionPool.query(updateSQLQuery, [...updateObj.values, ...whereObj.values])
    } catch (error) {
        console.log("Error: on userUpdate", error)
    }

}

userSQLFunction.insertUser = async (userName, email, userType=USER_TYPE.STUDENT, password) => {
    try {
        const connectionPool = connectTODB();
        let insertSQLQuery = ` INSERT INTO user (user_name, email, user_type, password) VALUES (?, ?, ?, ?)`
        return await connectionPool.query(insertSQLQuery, [userName, email, userType, password]);
    } catch (error) {
        console.log('Error: onInsertUser', error);
    }
}
module.exports = userSQLFunction;