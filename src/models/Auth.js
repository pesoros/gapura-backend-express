const connection = require('../configs/db')

module.exports = {
    login: (email) => {
        return new Promise((resolve, reject) => {
            connection.query(`SELECT * FROM user WHERE email = ?`, email, (error, result) => {
                if (error) {
                    reject(new Error(error))
                } else {
                    resolve(result)
                }
            })
        })
    },
}
