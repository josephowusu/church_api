


const { sendSMSHelper } = require('../../handler/index.helper')
const { generateID, fullDateTime } = require('../../model/helper')
const connection = require('./../../model/connection')

const SendSMSController = (data, type, callback, socket) => {
    if (type === "sendSMS") {
        send(data, callback, socket)
    }
}

const send = async (data, callback, socket) => {
    const { departmentID, message } = data
    if (!departmentID || !message) {
        callback({
            status: 'error',
            message: 'Some fields are missing!'
        })
        return
    }
    try {
        let id = departmentID ? departmentID.split('**')[1]: null
        connection.getConnection((err, conn) => {
            conn.query('SELECT * FROM users WHERE departmentID = ?', [id], (error, results, fields) => {
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
                        contacts.push({name: `${item.firstName ? item.firstName : ''} ${item.otherName ? item.otherName : ''} ${item.lastName ? item.lastName : ''}`, phone: item.phone})
                    }
                }
                let success = 0, fails = 0
                if (contacts.length > 0) {
                   for (let j = 0; j < contacts.length; j++) {
                        const contact = contacts[j]
                        if (contact.phone) {
                            let response = sendSMSHelper('send-sms', message, contact.phone)
                            if (response) {
                                success += 1
                            } else {
                                fails += 1
                            }
                        } else {
                            fails += 1
                        }
                    }
                    console.log(success, fails)
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

module.exports = SendSMSController