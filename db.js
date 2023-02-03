var mysql = require('mysql')

module.exports = {
    openCon: function (con) {
        var con = mysql.createConnection({
            host: "bn99lxpd9gmcm6atvdxz-mysql.services.clever-cloud.com",
            user: "u8vqt51zfn4lovkj",
            password: 'u8vqt51zfn4lovkj',
            database: 'bn99lxpd9gmcm6atvdxz'
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