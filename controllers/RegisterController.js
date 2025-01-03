const { generateID, fullDateTime } = require('../model/helper')
const connection = require('./../model/connection')


const RegisterController = (request, response) => {
    const {firstname, othername, lastname, phone, email, password, session, branchID} = request.body
    
    if (!firstname || !lastname || !email || !phone || !password || !branchID) {
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
            (id, departmentID, firstName, otherName, lastName, password, phone, email, type, branchID, status, sessionID, createdAt) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
            const queryValues = [
                generateID(), null, firstname, othername, lastname,
                password, phone, email, 'member', branchID, 'active', session ? session : null, fullDateTime()
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