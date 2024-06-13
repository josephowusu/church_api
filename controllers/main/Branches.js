

const { generateID, fullDateTime } = require('../../model/helper')
const connection = require('./../../model/connection')

const BranchesController = (data, type, callback, socket) => {
    if (type === "insert") {
        insert(data, callback, socket)
    } else if (type === "fetch") {
        fetch(data, callback)
    } else if (type === "fetchBranches") {
        fetchBranches(data, callback)
    }
}


async function insert(data, callback, socket) {
    const {name, description, level, sessionID} = data
    if (!name || !level) {
        callback({
            status: 'error',
            message: 'Required fields'
        })
        return
    }
    let lvl = level ? level.split('**')[1] : ''
    connection.getConnection((err, conn) => {
        conn.query('SELECT * FROM branches WHERE name = ?', [name], (error, results, fields) => {
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
                    message: 'Branch already exists!'
                })
                return
            }
            const sql = `INSERT INTO branches 
            (id, name, description, level, status, sessionID, createdAt) 
            VALUES (?, ?, ?, ?, ?, ?, ?)`
            const queryValues = [
                generateID(), name, description ? description : '', lvl, 'active', sessionID ? sessionID : null, fullDateTime()
            ]
            conn.query(sql, queryValues, (err, results) => {
                if (err) {
                    callback({
                        status: 'error',
                        message: err.message
                    })
                    return
                }
                socket.broadcast.emit('/branches/broadcast', 'success')
                socket.emit('/branches/broadcast', 'success')
                callback({
                    status: 'success',
                    message: 'Branch successfully created!'
                })
            })
            conn.release()
        })
    })
}

async function fetchBranches(data, callback) {
    const { name, limit, offset, branchID } = data
    console.log(data)
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
            const branchesSql = 'SELECT id, name FROM branches WHERE level >= ?';
            conn.query(branchesSql, [branchLevel], (err, branchesResults) => {
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
                    data: branchesResults
                })
            })
        })
    })
}

async function fetch(data, callback) {
    const {name, limit, offset} = data
    connection.getConnection((err, conn) => {
        const sql = 'SELECT * FROM branches LIMIT ? OFFSET ?';
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

module.exports = BranchesController