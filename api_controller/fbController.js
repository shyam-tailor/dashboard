module.exports = {

  getfeedbackDetails(request, response, db, con) {

    let sql = "select * from feedback fb inner join task_details td on (fb.id=td.id)";
    con.query(sql, (err, result) => {
      if (err) {
        console.log(err)
        response.status(404).send({ 'code': 404, 'message': "Some error occured in fetching details" })
      }
      else {
        response.status(200).send({ 'code': 200, 'message': 'Feedback fetched successfully', 'data': result })
      }
    })
  },

  getfeedbackforuser(request, response, db, con) {

    console.log(request.body)
    username = request.query.username
    let sql = "select * from feedback fb inner join task_details td on (fb.id=td.id) user td.username=?";
    con.query(sql, [username], (err, result) => {
      if (err) {
        console.log(err)
        response.status(404).send({ 'code': 404, 'message': "Some error occured in fetching details" })
      }
      else {
        response.status(200).send({ 'code': 200, 'message': 'Feedbacks fetched successfully', 'data': result })
      }
    })
  },

  addFeedback(req, res, db, con) {

    let sql = "INSERT INTO feedback (task_id,feedback_title) VALUES (?,?)";
    data = [req.body.task_id, req.body.feedback_title]
    console.log(data)
    con.query(sql, data, (err, result) => {
      if (err) {
        console.log(err)
        res.status(404).send({ 'code': 404, 'message': err })
      }
      else {
        res.status(200).send({ 'code': 200, 'message': 'Feedback inserted successfully', 'data': result })
      }
    })
  },

  getfeedbackCount(request, response, db, con) {

    let sql = "select COUNT(feedback_title) as totlFeedback from feedback";
    con.query(sql, (err, result) => {
      if (err) {
        response.status(404).send({ 'code': 404, 'message': err })
      }
      else {
        response.status(200).send({ 'code': 200, 'message': 'Counts fetched successfully', 'data': result })
      }
    })
  },
}  