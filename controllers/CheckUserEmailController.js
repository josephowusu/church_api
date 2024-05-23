const connection = require('./../model/connection')

const CheckEmailController = (request, response) => {
    const {email} = request.body
    console.log(request.body)
    if (!email) {
        response.status(200).json({
            status: "error",
            message: "Some fields are required!"
        })
        return
    }
    connection.getConnection((err, conn) => {
        conn.query('SELECT * FROM users WHERE email = ?', [email], (error, results, fields) => {
            if (error) {
                return response.status(500).json({
                    status: 'error',
                    message: 'Database query failed'
                })
            }
            if (results.length > 0) {
                return response.status(200).json({
                    status: 'success',
                    message: 'User available!'
                })
            } else{
                return response.status(200).json({
                    status: 'error',
                    message: 'User not found!'
                })
            }
        })
    })
}

module.exports = CheckEmailController