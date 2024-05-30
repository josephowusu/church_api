

const connection = require('./../model/connection')
const { generateID, fullDateTime } = require('../../model/helper')

const DuesController = (data, type, callback) => {
    if (type === "insert") {
        insert(data, callback)
    } else if (type === "fetch") {
        fetch(data, callback)
    }
}

async function insert(data, callback) {
    const { memberID, amount, session } = data
    if (!memberID || !amount) {
        callback({
            status: 'error',
            message: 'Required fields'
        })
        return
    }
    connection.getConnection((err, conn) => {
        const sql = `INSERT INTO dues 
        (id, memberID, amount, status, sessionID, createdAt) 
        VALUES (?, ?, ?, ?, ?, ?)`
        const queryValues = [
            generateID(), memberID, amount, 'active', session ? session : null, fullDateTime()
        ]
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
                message: 'Dues added successfully!'
            })
        })
        conn.release()
    })
}

async function fetch(data, callback) {
    const {name, limit, offset} = data
    connection.getConnection((err, conn) => {
        const sql = 'SELECT * FROM dues LIMIT ? OFFSET ?';
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

module.exports = DuesController