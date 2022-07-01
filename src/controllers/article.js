const Article = require('../models/Article')
const fs = require('fs-extra')
const misc = require('../helper/misc')
const randomguy = require('../helper/randomguy')
const fileChecker = require('../helper/fileChecker')
var slugify = require('slugify')

module.exports = {

    getAll: async (request, response) => {

            const page = parseInt(request.query.page) || 1
            const search = request.query.search || ''
            const limit = request.query.limit || 10
            const sort = request.query.sort || 'DESC'
            const category = request.query.categories_id || null
            const sortBy = request.query.sortBy || 'createdAt'
            const admin = request.query.admin
            const offset = (page - 1) * limit
        try {
            const total = await Article.getArticleCount(offset, limit, sort, sortBy, search, category,admin)
            const totalPage =  total[0].total / limit
            const prevPage = page === 1 ? null : page - 1
            const nextPage = page === Math.ceil(totalPage) ? null : page + 1
            const data = await Article.getAll(offset, limit, sort, sortBy, search, category,admin)

            if (data.length == 0) {
                return misc.response(response, 400, false, 'Data not found')
            }

            data.forEach(element => {
                if (element.image == null) {
                    element.imagelink = null
                } else {
                    element.imagelink = 'https://'+ request.get('host')+  '/images/articles/' + element.image
                }
            });

            const prevLink = prevPage !== null ? `${request.get('host')}${request.originalUrl.replace('page=' + page, 'page=' + prevPage)}` : ''
            const nextLink = nextPage !== null ? `${request.get('host')}${request.originalUrl.replace('page=' + page, 'page=' + nextPage)}` : ''

            let pageDetail = {
                total: Math.ceil(totalPage),
                per_page: limit,
                current_page: page,
                prevLink: prevLink,
                nextLink: nextLink
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
            let data = await Article.getSingleArticle(article_id)

            if (!data) {
                return misc.response(response, 400, false, 'Data not found')
            }
            if (data.image == null) {
                data.imagelink = null
            } else {
                data.imagelink = 'https://'+ request.get('host')+  '/images/articles/' + data.image
            }
            
            data.articleLama = await Article.getArticlesLama()
            data.articleBaru = await Article.getArticlesTerbaru()

            data.articleLama.forEach(element => {
                if (element.image == null) {
                    element.imagelink = null
                } else {
                    element.imagelink = 'https://'+ request.get('host')+  '/images/articles/' + element.image
                }
            });

            data.articleBaru.forEach(element => {
                if (element.image == null) {
                    element.imagelink = null
                } else {
                    element.imagelink = 'https://'+ request.get('host')+  '/images/articles/' + element.image
                }
            });

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
                data.imagelink = 'https://'+ request.get('host')+  '/images/articles/' + data.image
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

        if(request.body.image) {
            var binImage = request.body.image;
            const [,fileExtension] = binImage.split(';')[0].split('/');
            fileName = randomguy.randNumb('gapura-articles-'+Date.now())+'.'+fileExtension
            binImage = binImage.split("base64,")[1];

            if (!fileChecker.isImage(fileExtension)) {
                const message = 'Oops!, File allowed only JPG, JPEG, PNG, GIF, SVG'
                response.json(message)
                error = true
                return
            }

            const fileContents = new Buffer(binImage, 'base64')
                fs.writeFile(`public/images/articles/${fileName}`, fileContents, (err) => {
                if (err) return console.error(err)
                console.log('file saved to ', `public/images/articles/${fileName}`)
            })
        }

        const categories_id = request.body.categories_id
        const title = request.body.title
        const slug = slugify(title, {lower: true})+'-'+randomguy.randNumb('gapura')
        const label = request.body.label
        const sublabel = request.body.sublabel
        const description = request.body.description
        const image = fileName
        const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ')
        const publishedAt = request.body.publishedAt || timestamp

        try {
            if(error === false) {
                const response_addArticle = await Article.addArticle(categories_id, title, label, sublabel, description, image, slug, publishedAt, timestamp)
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

        if(request.body.image) {
            var binImage = request.body.image;
            const [,fileExtension] = binImage.split(';')[0].split('/');
            fileName = randomguy.randNumb('gapura-articles-'+Date.now())+'.'+fileExtension
            binImage = binImage.split("base64,")[1];

            if (!fileChecker.isImage(fileExtension)) {
                const message = 'Oops!, File allowed only JPG, JPEG, PNG, GIF, SVG'
                response.json(message)
                error = true
                return
            }

            const fileContents = new Buffer(binImage, 'base64')
                fs.writeFile(`public/images/articles/${fileName}`, fileContents, (err) => {
                if (err) return console.error(err)
                console.log('file saved to ', `public/images/articles/${fileName}`)
            })
        }

        const article_id = request.body.article_id

        const categories_id = request.body.categories_id
        const title = request.body.title
        const label = request.body.label
        const sublabel = request.body.sublabel
        const description = request.body.description
        const image = fileName
        const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ')
        const publishedAt = request.body.publishedAt || timestamp

        try {
            if(error === false) {
                await Article.updateArticle(article_id, categories_id, title, label, sublabel, description, image, publishedAt, timestamp)

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
