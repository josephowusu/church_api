

const { sendMail } = require('../../handler/index.helper')
const { generateID, fullDateTime, mailTemp } = require('../../model/helper')
const connection = require('./../../model/connection')

const SendEmailController = (data, type, callback, socket) => {
    if (type === "sendEmail") {
        send(data, callback, socket)
    } else if (type === "fetchEmail") {
        fetch(data, callback, socket)
    }
}

const send = async (data, callback, socket) => {
    const { departmentID, message, subject, sessionID } = data
    if (!departmentID || !message || message === "undefined") {
        callback({
            status: 'error',
            message: 'Some fields are missing!'
        })
        return
    }
    try {
        let id = departmentID ? departmentID.split('**')[1]: null
        connection.getConnection((err, conn) => {
            conn.query('SELECT * FROM users WHERE departmentID = ?', [id], async (error, results, fields) => {
                if (error) {
                    callback({
                        status: 'error',
                        message: 'Database query failed'
                    })
                }
                let contacts = []
                if (results.length > 0) {
                    for (let i = 0; i < results.length; i++) {
                        const item = results[i]
                        contacts.push({ name: item.firstName ? item.firstName : '', email: item.email })
                    }
                }
                let success = 0, fails = 0
                if (contacts.length > 0) {
                   for (let j = 0; j < contacts.length; j++) {
                        const contact = contacts[j]
                        if (contact.email) {
                            let mailContent = mailTemp(subject, message, contact.name)
                            let response = await sendMail(subject, mailContent, contact.email)
                            if (response) {
                                success += 1
                            } else {
                                fails += 1
                            }
                        } else {
                            fails += 1
                        }
                    }
                    const sql = `INSERT INTO emails 
                    (id, subject, message, sent_status, status, sessionID, createdAt) 
                    VALUES (?, ?, ?, ?, ?, ?, ?)`
                    const queryValues = [
                        generateID(), subject, message, `sents ${success}, fails ${fails}`, 'active', sessionID ? sessionID : null, fullDateTime()
                    ]
                    conn.query(sql, queryValues, (err, results) => {
                        if (err) {
                            callback({
                                status: 'error',
                                message: err.message
                            })
                            return
                        }
                        socket.broadcast.emit('/send_mail/broadcast', 'success')
                        socket.emit('/send_mail/broadcast', 'success')
                        callback({
                            status: 'success',
                            message: 'Email(s) successfully created!'
                        })
                    })
                }
            })
        })
    } catch (error) {
        callback({
            status: 'error',
            message: 'An error occured, please try again later!'
        })
        return
    }
}

async function fetch(data, callback) {
    const {name, limit, offset} = data
    connection.getConnection((err, conn) => {
        const sql = 'SELECT * FROM emails LIMIT ? OFFSET ?';
        const queryValues = [limit || 100, offset || 0]
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


module.exports = SendEmailController