const connection = require('../configs/db')

module.exports = {
    getArticleCount: () => {
        return new Promise ((resolve, reject) => {
            const query = `SELECT COUNT(*) total from articles WHERE createdAt <= NOW()`
            connection.query(query, (error, result) => {
                if(error) {
                    reject(new Error(error))
                } else {
                    resolve(result)
                }
            })
        })
    },
    getAll: (offset, limit, sort, sortBy, search, category, admin) => {
        return new Promise((resolve, reject) => {
            let adminq = ''
            let categoryq = ''
            if (category) {
                categoryq = ' AND art.categories_id = ' + category 
            }
            if (!admin) {
                adminq = ' AND art.createdAt <= NOW() ' 
            }
            const query = `SELECT art.categories_id, art.title, art.slug, art.label, art.sublabel, art.image, art.createdAt, art.updatedAt, cat.title as categories FROM articles art, categories cat WHERE art.title LIKE CONCAT(?,'%') AND art.categories_id = cat.id ${adminq} ${categoryq}`
            const qvalues = [search]
            connection.query(query, qvalues, (error, result) => {
                if (error) {
                    reject(new Error(error))
                } else {
                    resolve(result)
                }
            })
        })
    },
    getSingleArticle: (article_id) => {
        return new Promise((resolve, reject) => {
            const query = `SELECT a.*, b.title as categories FROM articles a INNER JOIN categories b ON b.id = a.categories_id WHERE a.id = '${article_id}'`
            connection.query(query, (error, result) => {
                if(error) {
                    reject(new Error(error))
                } else {
                    resolve(result[0])
                }
            })
        })
    },
    getSingleArticleSlug: (slug) => {
        return new Promise((resolve, reject) => {
            const query = `SELECT a.*, b.title as categories FROM articles a INNER JOIN categories b ON b.id = a.categories_id WHERE a.slug = '${slug}'`
            connection.query(query, (error, result) => {
                if(error) {
                    reject(new Error(error))
                } else {
                    resolve(result[0])
                }
            })
        })
    },
    addArticle: (categories_id, title, label, sublabel, description, image, slug , publishedAt, timestamp) => {
        return new Promise((resolve, reject) => {
            let quertext = ''
            if (image === '-') {
                quertext = `categories_id, title, label, sublabel, description, slug, createdAt`
                valtext = `'${categories_id}', '${title}', '${label}', '${sublabel}', '${description}', '${slug}', '${publishedAt}'`
            } else {
                quertext = `categories_id, title, label, sublabel, description, slug, createdAt, image`
                valtext = `'${categories_id}', '${title}', '${label}', '${sublabel}', '${description}', '${slug}', '${publishedAt}', '${image}'`
            }
            const query = `INSERT INTO articles (${quertext}) VALUES (${valtext})`
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
    updateArticle: (article_id, categories_id, title, label, sublabel, description, image, publishedAt, timestamp) => {
        return new Promise((resolve, reject) => {
            let query = ''
            if (image === '-') { 
                query =  `UPDATE articles SET
                categories_id = '${categories_id}',
                title = '${title}',
                label = '${label}',
                sublabel = '${sublabel}',
                description = '${description}',
                createdAt = '${publishedAt}',
                updatedAt = '${timestamp}'
                WHERE id = '${article_id}'`
            } else {
                query =  `UPDATE articles SET
                categories_id = '${categories_id}',
                title = '${title}',
                label = '${label}',
                sublabel = '${sublabel}',
                description = '${description}',
                createdAt = '${publishedAt}',
                updatedAt = '${timestamp}',
                image = '${image}'
                WHERE id = '${article_id}'`
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
    deleteArticle: (article_id) => {
        return new Promise((resolve, reject) => {
            const query = `DELETE FROM articles WHERE id = '${article_id}'`
            connection.query(query, (error, result) => {
                if(error) {
                    reject(new Error(error))
                } else {
                    resolve(result)
                }
            })
        })
    },
    getArticlesTerbaru: () => {
        return new Promise((resolve, reject) => {
            const query = `SELECT art.*, cat.title as categories
            FROM articles art, categories cat
            WHERE art.categories_id = cat.id
            AND art.createdAt >= DATE_ADD(LAST_DAY(DATE_SUB(NOW(), INTERVAL 1 MONTH)), INTERVAL 1 DAY) 
            ORDER BY art.createdAt DESC LIMIT 2`
            connection.query(query, (error, result) => {
                if (error) {
                    reject(new Error(error))
                } else {
                    resolve(result)
                }
            })
        })
    },
    getArticlesLama: () => {
        return new Promise((resolve, reject) => {
            const query = `SELECT art.*, cat.title as categories
            FROM articles art, categories cat
            WHERE art.categories_id = cat.id 
            AND art.createdAt >= DATE_ADD(LAST_DAY(DATE_SUB(NOW(), INTERVAL 2 MONTH)), INTERVAL 1 DAY) 
            AND art.createdAt <= DATE_SUB(NOW(), INTERVAL 1 MONTH)
            ORDER BY art.id DESC LIMIT 4`
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
