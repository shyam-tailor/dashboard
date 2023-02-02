var express = require('express')
var db = require('./db')
var path = require('path')
var bodyparser = require('body-parser')
const cookieParser = require("cookie-parser");
var cors = require("cors");
var session = require('express-session')
const multer = require("multer");
var fs = require('fs');
// const upload = multer({ dest: "uploads/" });
var con = db.openCon(con);


const port = process.env.PORT || 3000;

var userController = require('./api_controller/userController')
var taskController = require('./api_controller/taskController')
var feedbackController = require('./api_controller/fbController')
var messageController = require('./api_controller/messageContoller')

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads');
    },
    filename: function (req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

var upload = multer({ storage: storage })

var app = express();
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json())
app.use(cors({
    credentials: true,
    methods: ['GET', 'POST']
}))

app.use(express.static(path.join(__dirname, 'dist/nlp/browser')))

// creating 24 hours from milliseconds
const oneDay = 1000 * 60 * 60 * 24;

//session middleware
app.use(session({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized: true,
    cookie: { maxAge: oneDay },
    resave: false
}));

const ldap = require('ldapjs');

const client = ldap.createClient({
    url: ['ldap://127.0.0.1:1389', 'ldap://127.0.0.2:1389']
});

client.on('error', (err) => {
    // handle connection error
})

app.use(cookieParser());

app.use('/*', (req, res) => {
    res.sendFile(path.join(__dirname + path.join('dist/nlp/browser/index.html')))
})
app.get('/', function (request, response) {
    var con = db.openCon();
    response.json("You just hit the home page")
})

app.post('/loginAction', (request, response) => {
    userController.loginAction(request, response, db, con)
})

app.post('/registerAction', (request, response) => {
    userController.registerAction(request, response, db, con)
})

app.post('/logoutAction', (request, response) => {
    userController.logoutAction(request, response, db, con)
})

app.post('/updateuser', (request, response) => {
    userController.updateUser(request, response, db, con)
})

app.get('/getAllUsers', (request, response) => {
    userController.getAllUsers(request, response, db, con)
})



app.get('/allTaskDetails', (request, response) => {
    taskController.getAllTaskDetails(request, response, db, con)
})

app.get('/failedTasks', (request, response) => {
    taskController.getFailedTask(request, response, db, con)
})


app.post('/acceptTask', (request, response) => {
    taskController.acceptTask(request, response, db, con)
})

app.post('/checkIn', (request, response) => {
    userController.checkIn(request, response, db, con)
})

app.post('/checkInStatus', (request, response) => {
    userController.getCheckinStatus(request, response, db, con)
})


app.post('/checkOut', (request, response) => {
    userController.checkOut(request, response, db, con)
})

app.post('/addTask', (request, response) => {
    console.log("ashyam")
    taskController.addTask(request, response, db, con)
})

app.post('/updateTask', (request, response) => {
    taskController.updateTask(request, response, db, con)
})

app.get('/getFile/:id', (request, response) => {
    taskController.getFile(request, response, db, con)
})

app.post('/upload', upload.single("file"), uploadFiles);

function uploadFiles(req, res) {
    if (con == null) {
        con = db.openCon(con)
    }
    let file = req.file;
    console.log(req.file)
    let filename = req.file.filename;
    let sql = "INSERT INTO task_files (filename) VALUES (?)";
    var query = con.query(sql, [filename], function (err, result) {
        res.status(200).send({ 'code': 200, 'message': 'File inserted successfully', 'data': file })
    });
    // res.json({ message: "Successfully uploaded files" });
}

app.get('/download/:file', function (req, res) {
    var file = __dirname + '/uploads/' + req.params.file;
    res.download(file)
    // var path = require('path'); // get path
    // var dir = path.resolve('.') + '/uploads/'; // give path
    // fs.readdir(dir, function (err, list) { // read directory return  error or list
    //     if (err) return res.json(err);
    //     else
    //         var file = __dirname + '/uploads/' + req.params.file;
    //     res.status(200).send({ 'code': 200, 'message': typeof file, 'data': file })
    // });

});
app.get('/taskCounts', (request, response) => {
    taskController.getAllCount(request, response, db, con)
})

app.get('/usersCounts', (request, response) => {
    userController.getAllUsersCount(request, response, db, con)
})



app.get('/feedbackDetails', (request, response) => {
    feedbackController.getfeedbackDetails(request, response, db, con)
})

app.get('/feedbackDetails/:username', (request, response) => {
    feedbackController.getfeedbackforuser(request, response, db, con)
})

app.get('/getusertask/:user', (request, response) => {
    taskController.getTaskDetails(request, response, db, con)
})

app.get('/getFeedbackCounts', (request, response) => {
    feedbackController.getfeedbackCount(request, response, db, con)
})

app.get('/allMessageDetails', (request, response) => {
    messageController.getAllMessage(request, response, db, con)
})

app.get('/messageDetails/:username', (request, response) => {
    messageController.getMessageUser(request, response, db, con)
})

app.post('/addMessage', (request, response) => {
    messageController.addMessage(request, response, db, con)
})

app.post('/addFeedback', (request, response) => {
    feedbackController.addFeedback(request, response, db, con)
})



app.listen(port, () => {
    console.log(`server running at ${port}/`)
})