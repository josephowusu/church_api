

const { generateID, fullDateTime } = require('../../model/helper')
const connection = require('./../../model/connection')

const MemberController = (data, type, callback, socket) => {
    if (type === "insert") {
        insert(data, callback, socket)
    } else if (type === "fetch") {
        fetch(data, callback)
    } else if (type === "fetchWithDetails") {
        fetchMemberDetail(data, callback)
    }
}


async function insert(data, callback, socket) {
    const {firstName, otherName, lastName, email, phone, type, password, sessionID} = data
    if (!firstName || !lastName || !email) {
        callback({
            status: 'error',
            message: 'Required fields'
        })
        return
    }
    connection.getConnection((err, conn) => {
        conn.query('SELECT * FROM users WHERE email = ?', [email], (error, results, fields) => {
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
                    message: 'User already exists!'
                })
                return
            }
            const sql = `INSERT INTO users 
            (id, firstName, otherName, lastName, email, password, type, status, sessionID, createdAt) 
            VALUES (?, ?, ?, ?, ?, ? ,? ,? ,? , ?)`
            const queryValues = [
                generateID(), firstName, otherName, lastName, email, password, type, 'active', sessionID ? sessionID : null, fullDateTime()
            ]
            conn.query(sql, queryValues, (err, results) => {
                if (err) {
                    callback({
                        status: 'error',
                        message: err.message
                    })
                    return
                }
                socket.broadcast.emit('/users/broadcast', 'success')
                socket.emit('/users/broadcast', 'success')
                callback({
                    status: 'success',
                    message: 'User successfully created!'
                })
            })
            conn.release()
        })
    })
}

// async function fetch(data, callback) {
//     const {name, limit, offset} = data
//     connection.getConnection((err, conn) => {
//         const sql = 'SELECT * FROM users LIMIT ? OFFSET ?';
//         const queryValues = [limit || 10, offset || 0]
//         conn.query(sql, queryValues, (err, results) => {
//             if (err) {
//                 callback({
//                     status: 'error',
//                     message: err.message
//                 })
//                 return
//             }
//             callback({
//                 status: 'success',
//                 data: results
//             })
//         })
//         conn.release()
//     })
// }

async function fetch(data, callback) {
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
                    SELECT * 
                    FROM users 
                    WHERE users.branchID IN (?) 
                    ORDER BY users.createdAt DESC 
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
                    });
                    conn.release();
                });
            });
        });
    });
}

async function fetchMemberDetail(data, callback) {
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
                    SELECT 
                    SUM(COALESCE(dues.amount, 0)) AS totalDues,
                    SUM(COALESCE(tithes.amount, 0)) AS totalTithes, 
                    tithes.*, 
                    users.*
                    FROM users
                    LEFT JOIN dues ON dues.userID = users.id
                    LEFT JOIN tithes ON tithes.userID = users.id
                    WHERE users.branchID IN (?) 
                    GROUP BY users.id
                    ORDER BY users.createdAt DESC 
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
                    });
                    conn.release();
                });
            });
        });
    });
}

module.exports = MemberController