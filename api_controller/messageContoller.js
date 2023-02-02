module.exports = {

    getMessageUser(req, response, db, con) {

        let user = req.params.username
        console.log(req.params)
        let sql = "select * from messages where message_to=?";
        con.query(sql, [user], (err, result) => {
            if (err) {
                console.log(err)
                response.status(404).send({ 'code': 404, 'message': err })
            }
            else {
                response.status(200).send({ 'code': 200, 'message': 'Messages fetched successfully', 'data': result })
            }
        })
    },

    getAllMessage(request, response, db, con) {

        let sql = "select * from messages";
        con.query(sql, (err, result) => {
            if (err) {
                console.log(err)
                response.status(404).send({ 'code': 404, 'message': "Some error occured in fetching details" })
            }
            else {
                response.status(200).send({ 'code': 200, 'message': 'Messages fetched successfully', 'data': result })
            }
        })
    },

    addMessage(req, res, db, con) {

        console.log(req.body)

        let sql = "insert into messages set ?";
        con.query(sql, [req.body], (err, result) => {
            if (err) {
                console.log(err)
                res.status(404).send({ 'code': 404, 'message': err })
            }
            else {
                res.status(200).send({ 'code': 200, 'message': 'Messages added successfully', 'data': result })
            }
        })
    }


}