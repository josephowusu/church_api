


const { generateID, fullDateTime, fullDate } = require('../../model/helper')
const connection = require('./../../model/connection')

const DuesController = (data, type, callback, socket) => {
    if (type === "insert") {
        insert(data, callback, socket)
    } else if (type === "fetch") {
        fetch(data, callback)
    }
}

async function insert(data, callback, socket) {
    const { memberID, amount, sessionID, branchID } = data
    if (!memberID || !amount | !branchID) {
        callback({
            status: 'error',
            message: 'Required fields'
        })
        return
    }
    connection.getConnection((err, conn) => {
        const sql = `INSERT INTO dues 
        (id, userID, amount, branchID, status, sessionID, createdAt) 
        VALUES (?, ?, ?, ?, ?, ?, ?)`
        const queryValues = [
            generateID(), memberID.split('**')[1], amount, branchID, 'active', sessionID ? sessionID : null, fullDateTime()
        ]
        conn.query(sql, queryValues, (err, results) => {
            if (err) {
                callback({
                    status: 'error',
                    message: err.message
                })
                return
            }
            socket.broadcast.emit('/dues/broadcast', 'success')
            socket.emit('/dues/broadcast', 'success')
            callback({
                status: 'success',
                message: 'Dues added successfully!'
            })
        })
        conn.release()
    })
}

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
                    SELECT users.*, branches.*, dues.* FROM dues
                    LEFT JOIN users ON users.id = dues.userID 
                    LEFT JOIN branches ON branches.id = dues.branchID 
                    WHERE dues.branchID IN (?) 
                    ORDER BY dues.createdAt DESC 
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
                    let resultOver = {}
                    if (results.length > 0) {
                        for (let i = 0; i < results.length; i++) {
                            const item = results[i]
                            const dateTime = item.createdAt
                            let date = fullDate(dateTime)
                            if (!resultOver[date]) {
                                resultOver[date] = [item]
                            } else {
                                resultOver[date].push(item)
                            }
                        }
                    }
                    callback({
                        status: 'success',
                        data: resultOver
                    })
                    conn.release();
                });
            });
        });
    });
}


module.exports = DuesController