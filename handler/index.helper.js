
const nodemailer = require('nodemailer');


const mailConfig = {
    serverHost: 'smtp.gmail.com',
    email: 'josephowusu4944@gmail.com',
    sendAs: 'jh.owusu@coastalcommercemfi.com',
    password: 'sofzqvhazngbeaos',
    port: 465
}

const sendMail = (subject, message, to) => {
    let transporter = nodemailer.createTransport({
        host: mailConfig.serverHost,
        port: mailConfig.port,
        secure: true,
        auth: {
            user: mailConfig.email,
            pass: mailConfig.password
        }
    })

    let mailOptions = {
        from: `CODIFY CENTRAL <${mailConfig.email}>`,
        to: to,
        subject: subject,
        text: message,
        html: message
    }

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error)
        }
        console.log('Message sent: %s', info.messageId)
    })
}



module.exports = { mailConfig, sendMail }