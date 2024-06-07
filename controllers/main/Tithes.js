


const { generateID, fullDateTime, fullDate } = require('../../model/helper')
const connection = require('./../../model/connection')

const TithesController = (data, type, callback, socket) => {
    if (type === "insert") {
        insert(data, callback, socket)
    } else if (type === "fetch") {
        fetch(data, callback)
    }
}

async function insert(data, callback, socket) {
    const { memberID, amount, sessionID } = data
    if (!memberID || !amount) {
        callback({
            status: 'error',
            message: 'Required fields'
        })
        return
    } 
    connection.getConnection((err, conn) => {
        const sql = `INSERT INTO tithes 
        (id, userID, amount, status, sessionID, createdAt) 
        VALUES (?, ?, ?, ?, ?, ?)`
        const queryValues = [
            generateID(), memberID.split('**')[1], amount, 'active', sessionID ? sessionID : null, fullDateTime()
        ]
        conn.query(sql, queryValues, (err, results) => {
            if (err) {
                callback({
                    status: 'error',
                    message: err.message
                })
                return
            }
            socket.broadcast.emit('/tithes/broadcast', 'success')
            socket.emit('/tithes/broadcast', 'success')
            callback({
                status: 'success',
                message: 'Tithes added successfully!'
            })
        })
        conn.release()
    })
}

async function fetch(data, callback) {
    const {name, limit, offset} = data
    connection.getConnection((err, conn) => {
        const sql = 'SELECT * FROM tithes LIMIT ? OFFSET ?';
        const queryValues = [limit || 10, offset || 0]
        conn.query(sql, queryValues, (err, results) => {
            if (err) {
                callback({
                    status: 'error',
                    message: err.message
                })
                return
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
        })
        conn.release()
    })
}

module.exports = TithesController