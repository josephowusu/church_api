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
const OrganisationController = require('./controllers/main/Organisation');
const DuesController = require('./controllers/main/Dues');
const MemberController = require('./controllers/main/Member');
const SendSMSController = require('./controllers/main/SendSMS');
const SendEmailController = require('./controllers/main/SendEmail');
const TithesController = require('./controllers/main/tithes');
const OfferingsController = require('./controllers/main/Offerings');
const multer = require('multer');

dotenv.config({ path: path.join(__dirname, `.env`) });

const app = express();
const port = 3030;

app.use(cors({
    origin: "*",
    methods: ['GET', 'POST', 'DELETE', 'PUT']
}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/events/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`);
    }
})

const upload = multer({ storage })

app.post('/upload', upload.array('files', 10), (req, res) => {
    if (req.files) {
        const fileNames = req.files.map(file => file.filename)
        res.json({ fileNames })
    } else {
        res.status(400).send('No files uploaded')
    }
})

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
})

io.on('connection', (socket) => {

    socket.on('/insert-update-department', (data, callback) => {
        console.log('Received /insert-update-department event');
        DepartmentController(data, 'insert', callback, socket)
    })

    socket.on('/fetch-department', (data, callback) => {
        console.log('Received /fetch-department event');
        DepartmentController(data, 'fetch', callback)
    })

    socket.on('/insert-update-organisation', (data, callback) => {
        console.log('Received /insert-update-organisation event');
        OrganisationController(data, 'insert', callback, socket)
    })

    socket.on('/fetch-organisation', (data, callback) => {
        console.log('Received /fetch-department event');
        OrganisationController(data, 'fetch', callback)
    })

    socket.on('/insert-dues', (data, callback) => {
        console.log('Received /insert-update-organisation event');
        DuesController(data, 'insert', callback, socket)
    })

    socket.on('/fetch-dues', (data, callback) => {
        console.log('Received /fetch-dues event');
        DuesController(data, 'fetch', callback)
    })

    socket.on('/insert-tithes', (data, callback) => {
        console.log('Received /insert-update-organisation event');
        TithesController(data, 'insert', callback, socket)
    })

    socket.on('/fetch-tithes', (data, callback) => {
        console.log('Received /fetch-dues event');
        TithesController(data, 'fetch', callback)
    })

    socket.on('/insert-offerings', (data, callback) => {
        console.log('Received /insert-update-organisation event');
        OfferingsController(data, 'insert', callback, socket)
    })

    socket.on('/fetch-offerings', (data, callback) => {
        console.log('Received /fetch-dues event');
        OfferingsController(data, 'fetch', callback)
    })

    socket.on('/send-sms', (data, callback) => {
        console.log('Received /insert-sms event');
        SendSMSController(data, 'sendSMS', callback, socket)
    })

    socket.on('/send-email', (data, callback) => {
        console.log('Received /send-email event');
        SendEmailController(data, 'sendEmail', callback, socket)
    })

    socket.on('/fetch-email', (data, callback) => {
        console.log('Received /fetch-email event');
        SendEmailController(data, 'fetchEmail', callback, socket)
    })
    

    socket.on('/fetch-members', (data, callback) => {
        console.log('Received /fetch-users event')
        MemberController(data, 'fetch', callback)
    })

    socket.on('/fetch-members-details', (data, callback) => {
        console.log('Received /fetch-users event')
        MemberController(data, 'fetchWithDetails', callback)
    })

})

// Start the server
httpServer.listen(port, (error) => {
    if (!error) {
        console.log(`Server is Successfully Running\nListening on port ${port}`)
    } else {
        console.log("Error occurred, server can't start", error)
    }
})
