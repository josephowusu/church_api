

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
    const {userID, level, role, sessionID} = data

    if (!userID || !level || !role) {
        callback({
            status: 'error',
            message: 'Required fields'
        })
        return
    }
    let userid = userID ? userID.split('**')[1] : 0
    let lvl = level ? level.split('**')[1] : ''
    connection.getConnection((err, conn) => {
        conn.query('SELECT * FROM leadership WHERE userID = ?', [userid], (error, results, fields) => {
            if (error) {
                callback({
                    status: 'error',
                    message: 'Database query failed'
                })
            }
            if (results.length > 0) {
                const sql = `UPDATE leadership SET role = ?, level = ? WHERE leadership.userID = ?`
                const queryValues = [
                    role, lvl, userid
                ]
                conn.query(sql, queryValues, (err, results) => {
                    if (err) {
                        callback({
                            status: 'error',
                            message: err.message
                        })
                        return
                    }
                    socket.broadcast.emit('/leadership/broadcast', 'success')
                    socket.emit('/leadership/broadcast', 'success')
                    callback({
                        status: 'success',
                        message: 'Leadership successfully created!'
                    })
                })
                return
            }
            const sql = `INSERT INTO leadership 
            (id, userID, role, level, status, sessionID, createdAt) 
            VALUES (?, ?, ?, ?, ?, ?, ?)`
            const queryValues = [
                generateID(), userid, role, lvl, 'active', sessionID ? sessionID : null, fullDateTime()
            ]
            conn.query(sql, queryValues, (err, results) => {
                if (err) {
                    callback({
                        status: 'error',
                        message: err.message
                    })
                    return
                }
                socket.broadcast.emit('/leadership/broadcast', 'success')
                socket.emit('/leadership/broadcast', 'success')
                callback({
                    status: 'success',
                    message: 'Leadership successfully created!'
                })
            })
            conn.release()
        })
    })
}

async function fetch(data, callback) {
    const {name, limit, offset} = data
    connection.getConnection((err, conn) => {
        const sql = 'SELECT * FROM leadership LEFT JOIN users ON users.id = leadership.userID ORDER BY level ASC LIMIT ? OFFSET ?';
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