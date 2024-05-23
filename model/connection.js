const mysql = require('mysql');

const pool = mysql.createPool({
    connectionLimit : 10,
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'acciportal_database'
})

module.exports = {
    getConnection: (callback) => {
        return pool.getConnection(callback)
    } 
}