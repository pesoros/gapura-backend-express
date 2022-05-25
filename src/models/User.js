const connection = require('../configs/db')

module.exports = {
    getUserCount: () => {
        return new Promise ((resolve, reject) => {
            const query = `SELECT COUNT(*) total from user`
            connection.query(query, (error, result) => {
                if(error) {
                    reject(new Error(error))
                } else {
                    resolve(result)
                }
            })
        })
    },
    getAll: (offset, limit, sort, sortBy, search) => {
        return new Promise((resolve, reject) => {
            const query = `SELECT 
            id,fullname,username,email,phone
            FROM user 
            WHERE username LIKE '%${search}%'
            ORDER BY ${sortBy} ${sort} LIMIT ${offset}, ${limit}`
            connection.query(query, (error, result) => {
                if (error) {
                    reject(new Error(error))
                } else {
                    resolve(result)
                }
            })
        })
    },
    getSingleUser: (user_id) => {
        return new Promise((resolve, reject) => {
            const query = `SELECT id,fullname,username,email,phone FROM user WHERE id = '${user_id}'`
            connection.query(query, (error, result) => {
                if(error) {
                    reject(new Error(error))
                } else {
                    resolve(result[0])
                }
            })
        })
    },
    addUser: (fullname, username, email, phone, password, timestamp) => {
        return new Promise((resolve, reject) => {
            let quertext = `fullname, username, email, phone, password`
            let valtext = `'${fullname}', '${username}', '${email}', '${phone}', '${password}'`

            const query = `INSERT INTO user (${quertext}) VALUES (${valtext})`
            connection.query(query, (error, result) => {
                if(error) {
                    reject(new Error(error))
                }
                else {
                    resolve(result)
                }
            })
        })
    },
    updateUser: (user_id, fullname, username, email, phone, password, timestamp) => {
        return new Promise((resolve, reject) => {
            let query = ''

            query =  `UPDATE user SET
                fullname = '${fullname}',
                username = '${username}',
                email = '${email}',
                phone = '${phone}',
                password = '${password}'
                WHERE id = '${user_id}'`

            connection.query(query, (error, result) => {
                if(error) {
                    reject(new Error(error))
                }
                else {
                    resolve(result)
                }
            })
        })
    },
    deleteUser: (user_id) => {
        return new Promise((resolve, reject) => {
            const query = `DELETE FROM user WHERE id = '${user_id}'`
            connection.query(query, (error, result) => {
                if(error) {
                    reject(new Error(error))
                } else {
                    resolve(result)
                }
            })
        })
    },
}
