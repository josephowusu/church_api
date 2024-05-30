const path = require('path');
const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const RegisterController = require('./controllers/RegisterController');
const LoginController = require('./controllers/LoginController');
const CheckEmailController = require('./controllers/CheckUserEmailController');
const ChangePasswordController = require('./controllers/ChangePasswordController');
const { createServer } = require("http");
const { Server } = require("socket.io");
const DepartmentController = require('./controllers/main/Department');

dotenv.config({ path: path.join(__dirname, `.env`) });

const app = express();
const port = 3030;

app.use(cors({
    origin: "*",
    methods: ['GET', 'POST', 'DELETE', 'PUT']
}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.post('/register_user', (req, res) => {
    console.log('Received request to register user');
    RegisterController(req, res);
});

app.post('/login_user', (req, res) => {
    LoginController(req, res);
});

app.post('/check_user_email', (req, res) => {
    console.log('Received request to check user email');
    CheckEmailController(req, res);
});

app.post('/change_user_password', (req, res) => {
    console.log('Received request to change user password');
    ChangePasswordController(req, res);
});

app.get('/', (req, res) => {
    res.status(200).json({
        status: "success",
        message: "Server is running"
    });
});


const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: "*",
        methods: ['GET', 'POST', 'DELETE', 'PUT']
    }
});

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });

    socket.on('/insert-update-department', (data, callback) => {
        console.log('Received /insert-update-department event');
        DepartmentController(data, 'insert', callback)
    })

    socket.on('/fetch-department', (data, callback) => {
        console.log('Received /fetch-department event');
        DepartmentController(data, 'fetch', callback)
    })
});

// Start the server
httpServer.listen(port, (error) => {
    if (!error) {
        console.log(`Server is Successfully Running\nListening on port ${port}`);
    } else {
        console.log("Error occurred, server can't start", error);
    }
});
