const connection = require('../configs/db')

module.exports = {
    getAboutCount: () => {
        return new Promise ((resolve, reject) => {
            const query = `SELECT COUNT(*) total from settingAbout`
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
            const query = `SELECT *
            FROM settingAbout 
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
    getSingleAbout: (about_id) => {
        return new Promise((resolve, reject) => {
            const query = `SELECT * FROM settingAbout WHERE id = '${about_id}'`
            connection.query(query, (error, result) => {
                if(error) {
                    reject(new Error(error))
                } else {
                    resolve(result[0])
                }
            })
        })
    },
    updateAbout: (about_id, title, description, image, timestamp) => {
        return new Promise((resolve, reject) => {
            let query = ''

            if (image === '-') {
                query =  `UPDATE settingAbout SET
                title = '${title}',
                description = '${description}',
                updatedAt = '${timestamp}'
                WHERE id = '${about_id}'`
            } else {
                query =  `UPDATE settingAbout SET
                title = '${title}',
                description = '${description}',
                updatedAt = '${timestamp}',
                image = '${image}'
                WHERE id = '${about_id}'`
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
}
