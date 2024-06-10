

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
    const {men, women, children, sessionID} = data
    
    const sql = `INSERT INTO attendance 
    (id, men, women, children, status, sessionID, createdAt) 
    VALUES (?, ?, ?, ?, ?, ?, ?)`
    const queryValues = [
        generateID(), men ? men : 0, women ? women : 0, children ? children : 0, 'active', sessionID ? sessionID : null, fullDateTime()
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
    const {name, limit, offset} = data
    connection.getConnection((err, conn) => {
        const sql = 'SELECT * FROM attendance ORDER BY createdAt DESC LIMIT ? OFFSET ?';
        const queryValues = [limit || 10, offset || 0]
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

module.exports = AttendanceController