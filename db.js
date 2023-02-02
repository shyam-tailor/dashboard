var mysql = require('mysql')

module.exports = {
    openCon: function (con) {
        var con = mysql.createConnection({
            host: "localhost",
            user: "u346626345_assignincApp",
            password: 'Assigninc@123',
            database: 'u346626345_AssignIncApp'
        })
        con.connect((err, result) => {
            if (err) {
                console.log('An error occured in connection')
            }
            else {
                console.log('Connection established')

            }
        })
        return con
    }
}