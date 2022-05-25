const Article = require('../models/Article')
const fs = require('fs-extra')
const misc = require('../helper/misc')
const randomguy = require('../helper/randomguy')
var slugify = require('slugify')

module.exports = {

    getAll: async (request, response) => {

            const page = parseInt(request.query.page) || 1
            const search = request.query.search || ''
            const limit = request.query.limit || 1
            const sort = request.query.sort || 'DESC'
            const category = request.query.categories_id || 1
            const sortBy = request.query.sortBy || 'createdAt'
            const offset = (page - 1) * limit
        try {
            const total = await Article.getArticleCount()
            const prevPage = page === 1 ? 1 : page - 1
            const nextPage = page === total[0].total ? total[0].total : page + 1
            const data = await Article.getAll(offset, limit, sort, sortBy, search, category)

            if (data.length == 0) {
                return misc.response(response, 400, false, 'Data not found')
            }

            data.forEach(element => {
                if (element.image == null) {
                    element.imagelink = null
                } else {
                    element.imagelink = request.get('host')+ '/images/articles/' + element.image
                }
            });

            let pageDetail = {
                total: Math.ceil(total[0].total),
                per_page: limit,
                current_page: page,
                nextLink: `${request.get('host')}${request.originalUrl.replace('page=' + page, 'page=' + nextPage)}`,
                prevLink: `${request.get('host')}${request.originalUrl.replace('page=' + page, 'page=' + prevPage)}`
            }

            misc.responsePagination(response, 200, false, 'Successfull get all data', pageDetail, data, request.originalUrl)
        } catch (error) {
            console.error(error)
            misc.response(response, 500, true, 'Server error')
        }

    },

    getSingleArticle: async (request, response) => {

        const article_id = request.params.article_id

        try {
            const data = await Article.getSingleArticle(article_id)
            if (!data) {
                return misc.response(response, 400, false, 'Data not found')
            }
            if (data.image == null) {
                data.imagelink = null
            } else {
                data.imagelink = request.get('host')+ '/images/articles/' + data.image
            }
            
            misc.response(response, 200, false, 'Successfull get single Article', data, request.originalUrl)

        } catch(error) {
            console.error(error)
            misc.response(response, 500, true, 'Server error')
        }

    },

    getSingleArticleSlug: async (request, response) => {

        const slug = request.params.slug

        try {
            const data = await Article.getSingleArticleSlug(slug)
            if (!data) {
                return misc.response(response, 400, false, 'Data not found')
            }
            if (data.image == null) {
                data.imagelink = null
            } else {
                data.imagelink = request.get('host')+ '/images/articles/' + data.image
            }
            
            misc.response(response, 200, false, 'Successfull get single Article', data, request.originalUrl)

        } catch(error) {
            console.error(error)
            misc.response(response, 500, true, 'Server error')
        }

    },

    addArticle: async (request, response) => {

        let error = false
        let fileName = '-'

        if(request) {
            if(request.file) {
                const file = request.file.originalname
                const fileSplit = file.split('.')
                const fileExtension = fileSplit[fileSplit.length - 1]
                fileName = request.file.originalname

                if(request.file.size >= 5242880) {
                    const message = 'Oops!, Size cannot more than 5MB'
                     response.json(message)
                     error = true
                    fs.unlink(`public/images/articles/${request.file.originalname}`, function(error) {
                        if (error) response.json(error)
                    })
                }

                if(!isImage(fileExtension)) {
                    const message = 'Oops!, File allowed only JPG, JPEG, PNG, GIF, SVG'
                    response.json(message)
                    error = true
                    fs.unlink(`public/images/articles/${request.file.originalname}`, function(error) {
                        if (error) response.json(error)
                    })
                }

                function isImage(fileExtension) {
                    switch (fileExtension) {
                        case 'jpg':
                        case 'jpeg':
                        case 'png':
                        case 'gif':
                        case 'svg':
                            return true
                        }
                        return false
                }
            }
        }

        const categories_id = request.body.categories_id
        const title = request.body.title
        const slug = slugify(title, {lower: true})+'-'+randomguy.randNumb('gapura')
        const label = request.body.label
        const sublabel = request.body.sublabel
        const description = request.body.description
        const image = fileName
        const timestamp = request.timestamp

        try {
            if(error === false) {
                const response_addArticle = await Article.addArticle(categories_id, title, label, sublabel, description, image, slug, timestamp)
                const data = {
                    categories_id,
                    slug,
                    title,
                    label,
                    sublabel,
                    description,
                    image
                }
                misc.response(response, 200, false, 'Successfull create Article', data)
            }
        } catch(error) {
            console.error(error)
            misc.response(response, 500, true, 'Server Error')
        }

    },
    updateArticle: async (request, response) => {

        let error = false
        let fileName = '-'

        if(request) {
            if(request.file) {
                const file = request.file.originalname
                const fileSplit = file.split('.')
                const fileExtension = fileSplit[fileSplit.length - 1]
                fileName = request.file.originalname

                if(request.file.size >= 5242880) {
                    const message = 'Oops!, Size cannot more than 5MB'
                     response.json(message)
                     error = true
                    fs.unlink(`public/images/articles/${request.file.originalname}`, function(error) {
                        if (error) response.json(error)
                    })
                }

                if(!isImage(fileExtension)) {
                    const message = 'Oops!, File allowed only JPG, JPEG, PNG, GIF, SVG'
                    response.json(message)
                    error = true
                    fs.unlink(`public/images/articles/${request.file.originalname}`, function(error) {
                        if (error) response.json(error)
                    })
                }

                function isImage(fileExtension) {
                    switch (fileExtension) {
                        case 'jpg':
                        case 'jpeg':
                        case 'png':
                        case 'gif':
                        case 'svg':
                            return true
                        }
                        return false
                }
            }
        }

        const article_id = request.body.article_id

        const categories_id = request.body.categories_id
        const title = request.body.title
        const label = request.body.label
        const sublabel = request.body.sublabel
        const description = request.body.description
        const image = fileName
        const timestamp = request.timestamp

        try {
            if(error === false) {
                await Article.updateArticle(article_id, categories_id, title, label, sublabel, description, image, timestamp)

                const data = {
                    article_id,
                    categories_id,
                    title,
                    label,
                    sublabel,
                    description,
                    image
                }
                misc.response(response, 200, false, 'Successfull update article', data)
            }
        } catch(error) {
            console.error(error)
            misc.response(response, 500, true, 'Server Error')
        }

    },
    deleteArticle: async (request, response) => {

        const article_id = request.params.article_id

        try {
            await Article.deleteArticle(article_id)
            misc.response(response, 200, false, 'Successfull delete Article')
        } catch(error) {
            console.error(error)
            misc.response(response, 500, true, 'Server error')
        }

    },
}
