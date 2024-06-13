const mysql = require('mysql');
const config = require('./setup');

const pool = mysql.createPool({
    connectionLimit : 10,
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database
})

module.exports = {
    getConnection: (callback) => {
        return pool.getConnection(callback)
    } 
}