const connection = require('../configs/db')

module.exports = {
    getAll: () => {
        return new Promise((resolve, reject) => {
            const query = `SELECT *
            FROM attention`
            connection.query(query, (error, result) => {
                if (error) {
                    reject(new Error(error))
                } else {
                    resolve(result)
                }
            })
        })
    },
    updateAttention: (content) => {
        return new Promise((resolve, reject) => {
            let query = ''

                query =  `UPDATE attention SET
                content = '${content}'`

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
}
 