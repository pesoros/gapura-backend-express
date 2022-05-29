const connection = require('../configs/db')

module.exports = {
    getCategoriesCount: () => {
        return new Promise ((resolve, reject) => {
            const query = `SELECT COUNT(*) total from categories`
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
            FROM categories 
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
    getSingleCategories: (categories_id) => {
        return new Promise((resolve, reject) => {
            const query = `SELECT * FROM categories WHERE id = '${categories_id}'`
            connection.query(query, (error, result) => {
                if(error) {
                    reject(new Error(error))
                } else {
                    resolve(result[0])
                }
            })
        })
    },
    addCategories: (title, subtitle, description, image, background, timestamp) => {
        return new Promise((resolve, reject) => {
            let quertext = ''
            if (image === '-' && background === '-' ) {
                quertext = `title, subtitle, description, createdAt`
                valtext = `'${title}', '${subtitle}', '${description}', ${timestamp}`
            } else {
                if (image === '-') {
                    if (background !== '-') {
                        quertext = `title, subtitle, description, createdAt, background`
                        valtext = `'${title}', '${subtitle}', '${description}', ${timestamp}, '${background}'`
                    } 
                } else {
                    if (background === '-') {
                        quertext = `title, subtitle, description, createdAt, image`
                        valtext = `'${title}', '${subtitle}', '${description}', ${timestamp}, '${image}'`
                    } else {
                        quertext = `title, subtitle, description, createdAt, image, background`
                        valtext = `'${title}', '${subtitle}', '${description}', ${timestamp}, '${image}', '${background}'`
                    }
                }
            }
            const query = `INSERT INTO categories (${quertext}) VALUES (${valtext})`
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
    updateCategories: (categories_id, title, subtitle, description, image, background, timestamp) => {
        return new Promise((resolve, reject) => {
            let query = ''

            if (image === '-' && background === '-' ) {
                query =  `UPDATE categories SET
                title = '${title}',
                subtitle = '${subtitle}',
                description = '${description}',
                updatedAt = '${timestamp}'
                WHERE id = '${categories_id}'`
            } else {
                if (image === '-') {
                    if (background !== '-') {
                        query =  `UPDATE categories SET
                        title = '${title}',
                        subtitle = '${subtitle}',
                        description = '${description}',
                        updatedAt = '${timestamp}',
                        background = '${background}'
                        WHERE id = '${categories_id}'`
                    } 
                } else {
                    if (background === '-') {
                        query =  `UPDATE categories SET
                        title = '${title}',
                        subtitle = '${subtitle}',
                        description = '${description}',
                        updatedAt = '${timestamp}',
                        image = '${image}'
                        WHERE id = '${categories_id}'`
                    } else {
                        query =  `UPDATE categories SET
                        title = '${title}',
                        subtitle = '${subtitle}',
                        description = '${description}',
                        background = '${background}',
                        updatedAt = '${timestamp}',
                        image = '${image}'
                        WHERE id = '${categories_id}'`
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
    deleteCategories: (categories_id) => {
        return new Promise((resolve, reject) => {
            const query = `DELETE FROM categories WHERE id = '${categories_id}'`
            connection.query(query, (error, result) => {
                if(error) {
                    reject(new Error(error))
                } else {
                    resolve(result)
                }
            })
        })
    },
    checkCategories: (categories_id) => {
        return new Promise((resolve, reject) => {
            const query = `SELECT COUNT(*) as jumlah FROM articles WHERE categories_id = '${categories_id}'`
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
