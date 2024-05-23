const path = require('path')
const dotenv = require('dotenv')
const express = require('express')
const app = express()
const port = 3030
const bodyParser = require('body-parser')
const RegisterController = require('./controllers/RegisterController')
const LoginController = require('./controllers/LoginController')
const CheckEmailController = require('./controllers/CheckUserEmailController')
const ChangePasswordController = require('./controllers/ChangePasswordController')
dotenv.config({ path: path.join(__dirname, `.env`)})
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.status(200).json({
        status: "success",
        message: "Server is running"
    })
})

app.post('/register_user', (req, res) => {
    RegisterController(req, res)
})

app.post('/login_user', (req, res) => {
    LoginController(req, res)
})

app.post('/check_user_email', (req, res) => {
    CheckEmailController(req, res)
})

app.post('/change_user_password', (req, res) => {
    ChangePasswordController(req, res)
})

app.listen(port, (error) => { 
    if(!error) {
        console.log("Server is Successfully Running, and App is listening on port "+ port) 
    } else {
        console.log("Error occurred, server can't start", error); 
    } 
})