const connection = require('./../model/connection')

const LoginController = (request, response) => {
    const {email, password} = request.body
    console.log(request.body)
    if (!email || !password) {
        response.status(200).json({
            status: "error",
            message: "Some fields are required!"
        })
        return
    }
    connection.getConnection((err, conn) => {
        conn.query('SELECT * FROM users WHERE email = ? AND password = ?', [email, password], (error, results, fields) => {
            if (error) {
                return response.status(500).json({
                    status: 'error',
                    message: 'Database query failed'
                })
            }
            if (results.length > 0) {
                return response.status(200).json({
                    status: 'success',
                    message: 'Login success!'
                })
            } else{
                return response.status(200).json({
                    status: 'error',
                    message: 'Login failed, Please check the login details and try again!'
                })
            }
        })
    })
}

module.exports = LoginController