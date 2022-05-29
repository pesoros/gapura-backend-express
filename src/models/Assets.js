const connection = require('../configs/db')

module.exports = {
    getAssetsCount: () => {
        return new Promise ((resolve, reject) => {
            const query = `SELECT COUNT(*) total from assets`
            connection.query(query, (error, result) => {
                if(error) {
                    reject(new Error(error))
                } else {
                    resolve(result)
                }
            })
        })
    },
    getAll: (offset, limit, sort, sortBy, search, category) => {
        return new Promise((resolve, reject) => {
            const query = `SELECT * 
            FROM assets 
            WHERE title LIKE '%${search}%'
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
    getSingleAssets: (assets_id) => {
        return new Promise((resolve, reject) => {
            const query = `SELECT * FROM assets WHERE id = '${assets_id}'`
            connection.query(query, (error, result) => {
                if(error) {
                    reject(new Error(error))
                } else {
                    resolve(result[0])
                }
            })
        })
    },
    addAssets: (title, attention, image, file, timestamp)=> {
        return new Promise((resolve, reject) => {
            let quertext = ''

            if (image === '-' && file === '-' ) {
                quertext = `title, attention`
                valtext = `'${title}', '${attention}'`
            } else {
                if (image === '-') {
                    if (file !== '-') {
                        quertext = `title, attention, createdAt, file`
                        valtext = `'${title}', '${attention}', ${timestamp}, '${file}'`
                    } 
                } else {
                    if (file === '-') {
                        quertext = `title, attention, createdAt, image`
                        valtext = `'${title}', '${attention}', ${timestamp}, '${image}'`
                    } else {
                        quertext = `title, attention, createdAt, image, file`
                        valtext = `'${title}', '${attention}', ${timestamp}, '${image}', '${file}'`
                    }
                }
            }

            const query = `INSERT INTO assets (${quertext}) VALUES (${valtext})`
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
    updateAssets: (assets_id, title, attention, image, file, timestamp)=> {
        return new Promise((resolve, reject) => {
            let query = ''

            if (image === '-' && file === '-' ) {
                query =  `UPDATE assets SET
                title = '${title}',
                attention = '${attention}',
                updatedAt = '${timestamp}'
                WHERE id = '${assets_id}'`
            } else {
                if (image === '-') {
                    if (file !== '-') {
                        query =  `UPDATE assets SET
                        title = '${title}',
                        attention = '${attention}',
                        updatedAt = '${timestamp}',
                        file = '${file}'
                        WHERE id = '${assets_id}'`
                    } 
                } else {
                    if (file === '-') {
                        query =  `UPDATE assets SET
                        title = '${title}',
                        attention = '${attention}',
                        updatedAt = '${timestamp}',
                        image = '${image}'
                        WHERE id = '${assets_id}'`
                    } else {
                        query =  `UPDATE assets SET
                        title = '${title}',
                        attention = '${attention}',
                        updatedAt = '${timestamp}',
                        image = '${image}',
                        file = '${file}'
                        WHERE id = '${assets_id}'`
                    }
                }
            }

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
    deleteAssets: (assets_id) => {
        return new Promise((resolve, reject) => {
            const query = `DELETE FROM assets WHERE id = '${assets_id}'`
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
