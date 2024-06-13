const connection = require('./../model/connection')

const ChangePasswordController = (request, response) => {
    const {email, password} = request.body
    if (!email) {
        return response.status(200).json({
            status: "error",
            message: "Some fields are required!"
        })
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
                conn.query('UPDATE users SET password = ? WHERE users.email = ?', [password, email], (error, results, fields) => {
                    if (results.affectedRows > 0) {
                        return response.status(200).json({
                            status: 'success',
                            message: 'Password changed successfully!'
                        })
                    } else {
                        return response.status(200).json({
                            status: 'error',
                            message: 'An error occured whiles changing password, please try again!'
                        })
                    }
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

module.exports = ChangePasswordController