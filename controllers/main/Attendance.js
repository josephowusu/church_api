

const { generateID, fullDateTime } = require('../../model/helper')
const connection = require('./../../model/connection')

const AttendanceController = (data, type, callback, socket) => {
    if (type === "insert") {
        insert(data, callback, socket)
    } else if (type === "fetch") {
        fetch(data, callback)
    }
}

async function insert(data, callback, socket) {
    const {men, women, children, branchID, sessionID} = data
    
    const sql = `INSERT INTO attendance 
    (id, men, women, children, branchID, status, sessionID, createdAt) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    const queryValues = [
        generateID(), men ? men : 0, women ? women : 0, children ? children : 0, branchID, 'active', sessionID ? sessionID : null, fullDateTime()
    ]
    connection.getConnection((err, conn) => {
        conn.query(sql, queryValues, (err, results) => {
            if (err) {
                callback({
                    status: 'error',
                    message: err.message
                })
                return
            }
            socket.broadcast.emit('/attendance/broadcast', 'success')
            socket.emit('/attendance/broadcast', 'success')
            callback({
                status: 'success',
                message: 'Attendance record added successfully!'
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
            const branchesSql = 'SELECT id FROM branches WHERE level >= ?';
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
                    SELECT * FROM attendance 
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
                    });
                    conn.release();
                });
            });
        });
    });
}


module.exports = AttendanceController