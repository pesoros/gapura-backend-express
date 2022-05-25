const connection = require('../configs/db')

module.exports = {
    getAll: () => {
        return new Promise((resolve, reject) => {
            const query = `SELECT *
            FROM settingHome`
            connection.query(query, (error, result) => {
                if (error) {
                    reject(new Error(error))
                } else {
                    resolve(result)
                }
            })
        })
    },
    getSingle: (position) => {
        return new Promise((resolve, reject) => {
            const query = `SELECT * FROM settingHome WHERE position = '${position}'`
            connection.query(query, (error, result) => {
                if(error) {
                    reject(new Error(error))
                } else {
                    resolve(result[0])
                }
            })
        })
    },
    updateHome: (position, title, subtitle, image, timestamp) => {
        return new Promise((resolve, reject) => {
            let query = ''

            query =  `UPDATE settingHome SET
            title = '${title}',
            subtitle = '${subtitle}',
            image = '${image}'
            WHERE position = '${position}'`

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
