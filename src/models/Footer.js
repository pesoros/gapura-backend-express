const connection = require('../configs/db')

module.exports = {
    getAll: () => {
        return new Promise((resolve, reject) => {
            const query = `SELECT *
            FROM settingFooter`
            connection.query(query, (error, result) => {
                if (error) {
                    reject(new Error(error))
                } else {
                    resolve(result)
                }
            })
        })
    },
    updateFooter: (copyright, address, phone, dinas, timestamp) => {
        return new Promise((resolve, reject) => {
            let query = ''

            query =  `UPDATE settingFooter SET
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
