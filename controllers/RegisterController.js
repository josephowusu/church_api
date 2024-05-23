const { generateID, fullDateTime } = require('../model/helper')
const connection = require('./../model/connection')


const RegisterController = (request, response) => {
    const {firstname, othername, lastname, email, password, session} = request.body
    
    if (!firstname || !lastname || !email || !password) {
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
                    status: 'error',
                    message: 'User already exists!'
                })
            }
            const sql = `INSERT INTO users 
            (id, firstName, otherName, lastName, password, email, status, sessionID, createdAt) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
            const queryValues = [
                generateID(), firstname, othername, lastname,
                password, email, 'active', session ? session : null, fullDateTime()
            ]
            conn.query(sql, queryValues, (err, results) => {
                if (err) throw err
                return response.status(200).json({
                    status: 'success',
                    message: 'User successfully created!'
                })
            })
            conn.release()
        })
    })
}

module.exports = RegisterController 