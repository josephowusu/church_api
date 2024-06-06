
const nodemailer = require('nodemailer')
const axios = require('axios')


const config = {
    serverHost: 'smtp.gmail.com',
    email: 'josephowusu4944@gmail.com',
    sendAs: 'jh.owusu@coastalcommercemfi.com',
    password: 'sofzqvhazngbeaos',
    port: 465,
    api_key: '*********',
    from: 'ACCI',
    smsURL: 'https://sms.arkesel.com/sms/api?'
}

const sendMail = async (subject, message, to) => {
    let transporter = nodemailer.createTransport({
        host: config.serverHost,
        port: config.port,
        secure: true,
        auth: {
            user: config.email,
            pass: config.password
        }
    })

    let mailOptions = {
        from: `CODIFY CENTRAL <${config.email}>`,
        to: to,
        subject: subject,
        text: message,
        html: message
    }
    try {
        await transporter.sendMail(mailOptions)
        return true
    } catch (error) {
        console.log(error.message)
        return false
    }
}

const sendSMSHelper = (action, message, to) => {
    let url = `${config.smsURL}action=${action}&api_key=${config.api_key}&to=${to}&from=${config.from}&sms=${message}`
    try {
        axios.get(url).then((response) => {
            if (response.code === 'ok') {
                return true
            } else {
                return false
            }
        })
    } catch (error) {
        return false
    }
}


module.exports = { config, sendMail, sendSMSHelper }