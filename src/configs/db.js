const mysql = require('mysql2')
const config = require('./configs')
const connection = mysql.createConnection(config.database.mysql)

connection.connect(err => {
    if (err) { 
        console.log(`Error Database Connection: \n ${err}`)
    } else {
        console.log('Success Connect to Database')
    }
})

module.exports = connection
