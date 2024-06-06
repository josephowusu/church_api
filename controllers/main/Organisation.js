

const { generateID, fullDateTime } = require('../../model/helper')
const connection = require('./../../model/connection')

const OrganisationController = (data, type, callback, socket) => {
    if (type === "insert") {
        insert(data, callback, socket)
    } else if (type === "fetch") {
        fetch(data, callback)
    }
}

async function insert(data, callback, socket) {
    const {name, description, sessionID} = data
    if (!name) {
        callback({
            status: 'error',
            message: 'Required fields'
        })
        return
    }
    
    connection.getConnection((err, conn) => {
        conn.query('SELECT * FROM organisation WHERE name = ?', [name], (error, results, fields) => {
            if (error) {
                callback({
                    status: 'error',
                    message: 'Database query failed'
                })
            }
            if (results.length > 0) {
                callback({
                    status: 'error',
                    message: 'Organisation already exists!'
                })
            }
            const sql = `INSERT INTO organisation 
            (id, name, description, status, sessionID, createdAt) 
            VALUES (?, ?, ?, ?, ?, ?)`
            const queryValues = [
                generateID(), name, description ? description : '', 'active', sessionID ? sessionID : null, fullDateTime()
            ]
            conn.query(sql, queryValues, (err, results) => {
                if (err) {
                    callback({
                        status: 'error',
                        message: err.message
                    })
                    return
                }
                socket.broadcast.emit('/organisation/broadcast', 'success')
                socket.emit('/organisation/broadcast', 'success')
                callback({
                    status: 'success',
                    message: 'Organisation successfully created!'
                })
            })
            conn.release()
        })
    })
}

async function fetch(data, callback) {
    const {name, limit, offset} = data
    connection.getConnection((err, conn) => {
        const sql = 'SELECT * FROM organisation LIMIT ? OFFSET ?';
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

module.exports = OrganisationController