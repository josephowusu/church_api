


const { generateID, fullDateTime, fullDate } = require('../../model/helper')
const connection = require('./../../model/connection')

const OfferingsController = (data, type, callback, socket) => {
    if (type === "insert") {
        insert(data, callback, socket)
    } else if (type === "fetch") {
        fetch(data, callback)
    }
}

async function insert(data, callback, socket) {
    const { branchID, amount, sessionID } = data
    if (!branchID || !amount) {
        callback({
            status: 'error',
            message: 'Required fields'
        })
        return
    }
    connection.getConnection((err, conn) => {
        const sql = `INSERT INTO offerings 
        (id, branchID, amount, status, sessionID, createdAt) 
        VALUES (?, ?, ?, ?, ?, ?)`
        const queryValues = [
            generateID(), branchID, amount, 'active', sessionID ? sessionID : null, fullDateTime()
        ]
        conn.query(sql, queryValues, (err, results) => {
            if (err) {
                callback({
                    status: 'error',
                    message: err.message
                })
                return
            }
            socket.broadcast.emit('/offerings/broadcast', 'success')
            socket.emit('/offerings/broadcast', 'success')
            callback({
                status: 'success',
                message: 'Offering added successfully!'
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
                    SELECT branches.*, offerings.* FROM offerings
                    LEFT JOIN branches ON branches.id = offerings.branchID 
                    WHERE offerings.branchID IN (?) 
                    ORDER BY offerings.createdAt DESC 
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

// async function fetch(data, callback) {
//     const {name, limit, offset} = data
//     connection.getConnection((err, conn) => {
//         const sql = 'SELECT * FROM offerings LIMIT ? OFFSET ?';
//         const queryValues = [limit || 10, offset || 0]
//         conn.query(sql, queryValues, (err, results) => {
//             if (err) {
//                 callback({
//                     status: 'error',
//                     message: err.message
//                 })
//                 return
//             }
//             let resultOver = {}
//             if (results.length > 0) {
//                 for (let i = 0; i < results.length; i++) {
//                     const item = results[i]
//                     const dateTime = item.createdAt
//                     let date = fullDate(dateTime)
//                     if (!resultOver[date]) {
//                         resultOver[date] = [item]
//                     } else {
//                         resultOver[date].push(item)
//                     }
//                 }
//             }
//             callback({
//                 status: 'success',
//                 data: resultOver
//             })
//         })
//         conn.release()
//     })
// }

module.exports = OfferingsController