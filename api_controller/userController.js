// var db= require('../../db_config/db')
var crypto = require('crypto');
const { authenticate } = require('ldap-authentication');

module.exports = {
    loginAction(req, res, db, con) {
        if (con == null) {
            con = db.openCon(con)
        }
        var username = req.body.username;
        var password = crypto.createHash('md5').update(req.body.password).digest('hex');
        var sql = "select username,firstname,lastname,dob,role from users where username=? AND password=? AND isDeleted=0"
        con.query(sql, [username, password], (err, result) => {
            if (err) {
                res.json({ code: 500, message: 'There is some server error please contact to Admin' })
            }
            else {
                if (result.length == 0) {
                    res.status(400).send({ 'code': 400, 'message': "Invalid Credientials" })
                }
                else {
                    session = req.session;
                    session.userid = result[0].hash;
                    console.log(req.session)
                    res.status(200).send({ 'code': 200, 'message': "Success Login", 'data': result[0] })
                }
            }
        })
    },

    registerAction(req, res, db, con) {
        if (con == null) {
            con = db.openCon(con)
        }
        // const reEmail= /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        // if(reEmail.test(req.body.username)==false){
        //     res.status(400).send({'message':"E-mail is not valid"})
        // }
        // const rePass= /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})/
        // if(rePass.test(req.body.password==false)){
        //     res.status(400).send({'message':"Password must contain a alphabet , digit, special symbol"})
        // }
        console.log(req.body)
        var hash = crypto.randomBytes(16).toString("hex")
        var password = crypto.createHash('md5').update(req.body.password).digest('hex');

        var data = {
            username: req.body.username,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            dob: req.body.dob,
            hash: hash,
            password: password,
            role: req.body.role,
            score: req.body.score ? req.body.score : 0,
            cost: req.body.cost ? req.body.cost : 0
        }

        var sql = "insert into users set ?"
        con.query(sql, [data], (err, result) => {
            if (err) {
                res.json({ code: 500, message: 'There is some server error please contact to Admin' })
            }
            else {
                res.status(200).send({ 'code': 200, 'message': "User Registred" })
            }
        })
    },

    logoutAction(req, res, db, con) {

    },

    getAllUsers(req, res, db, con) {

        var sql = "select id,username, firstname, lastname, dob,role, score, cost from users where isDeleted=0"
        con.query(sql, (err, result) => {
            if (err) {
                res.json({ code: 500, message: err })
            }
            else {
                result.forEach((item) => [
                    item.dob = item.dob.split('T')[0]
                ])
                res.status(200).send({ 'code': 200, 'data': result })

            }
        })
    },

    getAllUsersCount(request, response, db, con) {

        let sql = "select COUNT(username) as totalUsers from users where isDeleted=0";
        con.query(sql, (err, result) => {
            if (err) {
                response.status(404).send({ 'code': 404, 'message': err })
            }
            else {
                response.status(200).send({ 'code': 200, 'message': 'Counts fetched successfully', 'data': result })
            }
        })
    },

    updateUser(req, response, db, con) {

        var data = {
            username: req.body.username,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            dob: req.body.dob,
            role: req.body.role,
            cost: req.body.cost,
            score: req.body.score,
        }
        let sql = "update users set ? where id=?";
        con.query(sql, [data, req.body.id], (err, result) => {
            if (err) {
                response.status(404).send({ 'code': 404, 'message': err })
            }
            else {
                response.status(200).send({ 'code': 200, 'message': 'User Updated successfully', 'data': result })
            }
        })
    },

    checkIn(req, response, db, con) {

        console.log(req.body)

        let sql = "insert into attendence set ?";
        con.query(sql, [req.body], (err, result) => {
            if (err) {
                response.status(404).send({ 'code': 404, 'message': err })
            }
            else {
                response.status(200).send({ 'code': 200, 'message': 'CheckIn  successfully', 'data': result })
            }
        })
    },

    getCheckinStatus(req, response, db, con) {

        let sql = "select checkIn from attendence where date=?";
        con.query(sql, [req.body.date], (err, result) => {
            if (err) {
                response.status(404).send({ 'code': 404, 'message': err })
            }
            else {
                response.status(200).send({ 'code': 200, 'message': 'success', 'data': result })
            }
        })
    },


    checkOut(req, response, db, con) {


        console.log(req.body)

        let sql = "select id from attendence where date=?";
        con.query(sql, [req.body.date], (err, result) => {
            if (err) {
                response.status(404).send({ 'code': 404, 'message': err })
            }
            else {
                console.log(result[0].id)
                let sql2 = 'update attendence set checkout=? where id=?';
                con.query(sql2, [req.body.checkout, result[0].id], (err, result) => {
                    if (err) {
                        response.status(404).send({ 'code': 404, 'message': err })
                    }
                    else {
                        response.status(200).send({ 'code': 200, 'message': 'Checout successfully', 'data': result })

                    }
                })
            }
        })
    },

    authenticateldap() {
        const client = ldap.createClient({
            url: ['ldap://127.0.0.1:1389', 'ldap://127.0.0.2:1389']
        });
    }
}