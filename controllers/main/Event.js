


const { generateID, fullDateTime, fullDate } = require('../../model/helper')
const connection = require('./../../model/connection')

const EventController = (data, type, callback, socket) => {
    if (type === "insert") {
        insert(data, callback, socket)
    } else if (type === "fetch") {
        fetch(data, callback)
    } else if (type === "fetchWithDate") {
        fetchWithDate(data, callback)
    }
}

async function insert(data, callback, socket) {
    const { title, description, author, extraInfo, location, files, sessionID } = data
    if (!title || !description) {
        callback({
            status: 'error',
            message: 'Required fields'
        })
        return
    }
    connection.getConnection((err, conn) => {
        const sql = `INSERT INTO events 
        (id, title, description, author, images, extra_info, location, type, status, sessionID, createdAt) 
        VALUES (?, ?, ?, ?, ?, ?, ? ,? ,?, ?, ?)`
        const queryValues = [
            generateID(), title, description, 'Pastor Joseph', files, extraInfo, location, 'church', 'active', sessionID ? sessionID : null, fullDateTime()
        ]
        conn.query(sql, queryValues, (err, results) => {
            if (err) {
                callback({
                    status: 'error',
                    message: err.message
                })
                return
            }
            socket.broadcast.emit('/event/broadcast', 'success')
            socket.emit('/event/broadcast', 'success')
            callback({
                status: 'success',
                message: 'Event added successfully!'
            })
        })
        conn.release()
    })
}

// async function fetchWithDate(data, callback) {
//     const {name, limit, offset} = data
//     connection.getConnection((err, conn) => {
//         const sql = 'SELECT * FROM events LIMIT ? OFFSET ?';
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
async function fetchWithDate(data, callback) {
    const { name, limit, offset } = data;
    connection.getConnection((err, conn) => {
        const sql = 'SELECT * FROM events LIMIT ? OFFSET ?';
        const queryValues = [limit || 10, offset || 0];
        conn.query(sql, queryValues, (err, results) => {
            if (err) {
                callback({
                    status: 'error',
                    message: err.message
                });
                return;
            }
            
            let resultOver = {};
            let resultOverChurch = {};
            let resultOverMember = {};

            if (results.length > 0) {
                for (let i = 0; i < results.length; i++) {
                    const item = results[i];
                    const dateTime = item.createdAt;
                    const date = fullDate(dateTime);

                    // Group by date
                    if (!resultOver[date]) {
                        resultOver[date] = [item];
                    } else {
                        resultOver[date].push(item);
                    }

                    // Group by event type
                    if (item.type === 'church') {
                        if (!resultOverChurch[date]) {
                            resultOverChurch[date] = [item];
                        } else {
                            resultOverChurch[date].push(item);
                        }
                    } else if (item.type === 'member') {
                        if (!resultOverMember[date]) {
                            resultOverMember[date] = [item];
                        } else {
                            resultOverMember[date].push(item);
                        }
                    }
                }
            }

            callback({
                status: 'success',
                data: {
                    byDate: resultOver,
                    byChurch: resultOverChurch,
                    byMember: resultOverMember
                }
            });
        });
        conn.release();
    });
}


async function fetch(data, callback) {
    const {hiddenID, limit, offset} = data
    connection.getConnection((err, conn) => {
        const sql = `SELECT * FROM events ${hiddenID ? `WHERE events.id = ${hiddenID}` : ''} LIMIT ? OFFSET ?`;
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

module.exports = EventController