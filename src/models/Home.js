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

            if (image === '-') { 
                query =  `UPDATE settingHome SET
                title = '${title}',
                subtitle = '${subtitle}',
                updatedAt = '${timestamp}'
                WHERE position = '${position}'`
            } else {
                query =  `UPDATE settingHome SET
                title = '${title}',
                subtitle = '${subtitle}',
                updatedAt = '${timestamp}',
                image = '${image}'
                WHERE position = '${position}'`
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
    getCategories: () => {
        return new Promise((resolve, reject) => {
            const query = `SELECT *
            FROM categories `
            connection.query(query, (error, result) => {
                if (error) {
                    reject(new Error(error))
                } else {
                    resolve(result)
                }
            })
        })
    },
    getArticlesTerbaru: (categories_id) => {
        return new Promise((resolve, reject) => {
            const query = `SELECT art.*, cat.title as categories
            FROM articles art, categories cat
            WHERE categories_id = ${categories_id}
            AND art.categories_id = cat.id
            ORDER BY createdAt DESC`
            connection.query(query, (error, result) => {
                if (error) {
                    reject(new Error(error))
                } else {
                    resolve(result)
                }
            })
        })
    },
    getArticlesLama: (categories_id,month) => {
        return new Promise((resolve, reject) => {
            const query = `SELECT art.*, cat.title as categories
            FROM articles art, categories cat
            WHERE categories_id = ${categories_id}
            AND art.categories_id = cat.id 
            AND createdAt >= DATE_ADD(LAST_DAY(DATE_SUB(NOW(), INTERVAL 2 MONTH)), INTERVAL 1 DAY) 
            AND createdAt <= DATE_SUB(NOW(), INTERVAL 1 MONTH)
            ORDER BY id DESC`
            connection.query(query, (error, result) => {
                if (error) {
                    reject(new Error(error))
                } else {
                    resolve(result)
                }
            })
        })
    },
}
 