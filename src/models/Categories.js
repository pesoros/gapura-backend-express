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
                quertext = `title, subtitle, description`
                valtext = `'${title}', '${subtitle}', '${description}'`
            } else {
                if (image === '-') {
                    if (background !== '-') {
                        quertext = `title, subtitle, description, background`
                        valtext = `'${title}', '${subtitle}', '${description}', '${background}'`
                    } 
                } else {
                    if (background === '-') {
                        quertext = `title, subtitle, description, image`
                        valtext = `'${title}', '${subtitle}', '${description}', '${image}'`
                    } else {
                        quertext = `title, subtitle, description, image, background`
                        valtext = `'${title}', '${subtitle}', '${description}', '${image}', '${background}'`
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
                description = '${description}'
                WHERE id = '${categories_id}'`
            } else {
                if (image === '-') {
                    if (background !== '-') {
                        query =  `UPDATE categories SET
                        title = '${title}',
                        subtitle = '${subtitle}',
                        description = '${description}',
                        background = '${background}'
                        WHERE id = '${categories_id}'`
                    } 
                } else {
                    if (background === '-') {
                        query =  `UPDATE categories SET
                        title = '${title}',
                        subtitle = '${subtitle}',
                        description = '${description}',
                        image = '${image}'
                        WHERE id = '${categories_id}'`
                    } else {
                        query =  `UPDATE categories SET
                        title = '${title}',
                        subtitle = '${subtitle}',
                        description = '${description}',
                        background = '${background}',
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
