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
    updateFooter: (copyright, address, phone, dinas, timestamp) => {
        return new Promise((resolve, reject) => {
            let query = ''

            query =  `UPDATE settingHome SET
            copyright = '${copyright}',
            address = '${address}',
            phone = '${phone}',
            dinas = '${dinas}'`

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
