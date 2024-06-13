

const { generateID, fullDateTime } = require('../../model/helper')
const connection = require('./../../model/connection')

const DepartmentController = (data, type, callback, socket) => {
    if (type === "insert") {
        insert(data, callback, socket)
    } else if (type === "fetch") {
        fetch(data, callback)
    } else if (type === "fetchWithBranch") {
        fetchWithBranch(data, callback)
    }
}


async function insert(data, callback, socket) {
    const {name, description, sessionID, branchID} = data
    if (!name) {
        callback({
            status: 'error',
            message: 'Required fields'
        })
        return
    }
    connection.getConnection((err, conn) => {
        conn.query('SELECT * FROM department WHERE name = ? AND branchID = ?', [name, branchID], (error, results, fields) => {
            if (error) {
                callback({
                    status: 'error',
                    message: 'Database query failed'
                })
                return
            }
            if (results.length > 0) {
                callback({
                    status: 'error',
                    message: 'Department already exists!'
                })
                return
            }
            const sql = `INSERT INTO department 
            (id, name, description, branchID, status, sessionID, createdAt) 
            VALUES (?, ?, ?, ?, ?, ?, ?)`
            const queryValues = [
                generateID(), name, description ? description : '', branchID, 'active', sessionID ? sessionID : null, fullDateTime()
            ]
            conn.query(sql, queryValues, (err, results) => {
                if (err) {
                    callback({
                        status: 'error',
                        message: err.message
                    })
                    return
                }
                socket.broadcast.emit('/department/broadcast', 'success')
                socket.emit('/department/broadcast', 'success')
                callback({
                    status: 'success',
                    message: 'Department successfully created!'
                })
            })
            conn.release()
        })
    })
}

async function fetchWithBranch(data, callback) {
    const { name, limit, offset, branchID } = data
    connection.getConnection((err, conn) => {
        if (err) {
            callback({
                status: 'error',
                message: err.message
            });
            return;
        }

        const branchLevelSql = 'SELECT level FROM branches WHERE id = ?';
        conn.query(branchLevelSql, [branchID], (err, branchResults) => {
            if (err || branchResults.length === 0) {
                callback({
                    status: 'error',
                    message: err ? err.message : 'Branch not found'
                })
                conn.release();
                return;
            }
            const branchLevel = branchResults[0].level;
            const branchesSql = 'SELECT id FROM branches WHERE level = ?';
            conn.query(branchesSql, [branchLevel], (err, branchesResults) => {
                if (err) {
                    callback({
                        status: 'error',
                        message: err.message
                    });
                    conn.release();
                    return;
                }
                const branchIDs = branchesResults.map(branch => branch.id)
                const attendanceSql = `
                    SELECT * FROM department 
                    WHERE branchID IN (?) 
                    ORDER BY createdAt DESC 
                    LIMIT ? OFFSET ?`;
                const queryValues = [branchIDs, limit || 10, offset || 0];
                conn.query(attendanceSql, queryValues, (err, results) => {
                    if (err) {
                        callback({
                            status: 'error',
                            message: err.message
                        });
                        conn.release();
                        return;
                    }
                    callback({
                        status: 'success',
                        data: results
                    })
                    conn.release();
                });
            });
        });
    });
}

async function fetch(data, callback) {
    const {name, limit, offset} = data
    connection.getConnection((err, conn) => {
        const sql = 'SELECT * FROM department LIMIT ? OFFSET ?';
        const queryValues = [limit || 6, offset || 0]
        conn.query(sql, queryValues, (err, results) => {
            if (err) {
                callback({
                    status: 'error',
                    message: err.message
                })
                return
            }
            callback({
                status: 'success',
                data: results
            })
        })
        conn.release()
    })
}

module.exports = DepartmentController