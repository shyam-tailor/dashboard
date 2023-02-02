module.exports = {

    getTaskDetails(request, response, db, con) {


        let user = request.params.user;
        console.log(user)
        let sql = "select * from task_details where username=?";
        let data = [user]
        con.query(sql, data, (err, result) => {
            if (err) {
                console.log(err)
                response.status(404).send({ 'code': 404, 'message': "Some error occured in fetching details" })
            }
            else {
                response.status(200).send({ 'code': 200, 'message': 'Task details fetched successfully', 'data': result })
            }
        })
    },

    getFailedTask(request, response, db, con) {

        let sql = "select COUNT(id) as totalFailed from task_details where status=?";
        con.query(sql, ['failed'], (err, result) => {
            if (err) {
                console.log(err)
                response.status(404).send({ 'code': 404, 'message': "Some error occured in fetching details" })
            }
            else {
                response.status(200).send({ 'code': 200, 'message': 'Failed Tasks fetched successfully', 'data': result })
            }
        })
    },

    getAllTaskDetails(request, response, db, con) {

        let sql = "select * from task_details";
        con.query(sql, (err, result) => {
            if (err) {
                console.log(err)
                response.status(404).send({ 'code': 404, 'message': "Some error occured in fetching details" })
            }
            else {
                response.status(200).send({ 'code': 200, 'message': 'Task details fetched successfully', 'data': result })
            }
        })
    },

    addTask(req, res, db, con) {

        // let sql = "INSERT INTO task_details (title, description, assigner,username,deadline,file) VALUES (?,?,?,?,?,?)";
        let sql = "INSERT INTO task_details set ?";
        data = [req.body.title, req.body.description, req.body.assigner, req.body.username, req.body.deadline, req.body.file]
        console.log(req.body)
        con.query(sql, [req.body], (err, result) => {
            if (err) {
                console.log(err)
                res.status(404).send({ 'code': 404, 'message': err })
            }
            else {
                res.status(200).send({ 'code': 200, 'message': 'Task inserted successfully', 'data': result })
            }
        })
    },

    updateTask(req, response, db, con) {


        let sql = "update task_details set ? where id=?";
        con.query(sql, [req.body, req.body.id], (err, result) => {
            if (err) {
                response.status(404).send({ 'code': 404, 'message': err })
            }
            else {
                response.status(200).send({ 'code': 200, 'message': 'Task Updated successfully', 'data': result })
            }
        })
    },



    getAllCount(request, response, db, con) {

        let sql = "select COUNT(title) titles from task_details where isDeleted=0";
        con.query(sql, (err, result) => {
            if (err) {
                response.status(404).send({ 'code': 404, 'message': err })
            }
            else {
                response.status(200).send({ 'code': 200, 'message': 'Counts fetched successfully', 'data': result })
            }
        })
    },

    acceptTask(request, response, db, con) {


        let task_id = request.body.taskId;
        let sql = "update task_details SET accepted=? ,status=? where id=?"
        let data = ['Accepted', 'pending', task_id];
        con.query(sql, data, (err, result) => {
            if (err) {
                response.status(404).send({ 'code': 404, 'message': "Some error occured in fetching details" })
            }
            else {
                response.status(200).send({ 'code': 200, 'message': 'Task Acceptedsuccessfully', 'data': result })
            }
        })
    },

    getFile(req, response, db, con) {

        let sql = "select filename from task_files where id=?";
        con.query(sql, [req.params.id], (err, result) => {
            if (err) {
                response.status(404).send({ 'code': 404, 'message': err })
            }
            else {
                response.status(200).send({ 'code': 200, 'message': 'file', 'data': result })
            }
        })
    },


}