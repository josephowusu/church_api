const path = require('path')
const dotenv = require('dotenv')
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const RegisterController = require('./controllers/RegisterController')
const LoginController = require('./controllers/LoginController')
const CheckEmailController = require('./controllers/CheckUserEmailController')
const ChangePasswordController = require('./controllers/ChangePasswordController')
const { createServer } = require("http")
const { Server } = require("socket.io")
const httpServer = createServer()

const app = express()
const port = 3030
dotenv.config({ path: path.join(__dirname, `.env`)})

app.use(cors({
    origin: "*",
    methods: ['GET', 'POST', 'DELETE', 'PUT']
}))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ['GET', 'POST', 'DELETE', 'PUT']
    }
})

app.get('/', (req, res) => {
    res.status(200).json({
        status: "success",
        message: "Server is running"
    })
})

app.post('/register_user', (req, res) => {
    console.log('Received request to register user')
    RegisterController(req, res)
})

app.post('/login_user', (req, res) => {
    LoginController(req, res)
})

app.post('/check_user_email', (req, res) => {
    console.log('Received request to check user email')
    CheckEmailController(req, res)
})

app.post('/change_user_password', (req, res) => {
    console.log('Received request to change user password')
    ChangePasswordController(req, res)
})

app.listen(port, (error) => { 
    if (!error) {
        console.log(`Server is Successfully Running\nListening on port ${port}`)
    } else {
        console.log("Error occurred, server can't start", error)
    }
})
