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
            const query = `SELECT art.id, art.categories_id, art.title, art.slug, art.label, art.sublabel, art.image, art.createdAt, art.updatedAt, cat.title as categories
            FROM articles art, categories cat
            WHERE art.categories_id = ${categories_id}
            AND art.categories_id = cat.id
            ORDER BY art.createdAt DESC`
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
            const query = `SELECT art.id, art.categories_id, art.title, art.slug, art.label, art.sublabel, art.image, art.createdAt, art.updatedAt, cat.title as categories
            FROM articles art, categories cat
            WHERE art.categories_id = ${categories_id}
            AND art.categories_id = cat.id 
            AND MONTH(art.createdAt) = MONTH(NOW() - INTERVAL 1 MONTH) 
            AND (YEAR(art.createdAt) = YEAR(NOW()) OR YEAR(art.createdAt) = YEAR(NOW() - INTERVAL 1 MONTH))
            ORDER BY art.id DESC`
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
 