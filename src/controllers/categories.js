const Categories = require('../models/Categories')
const fs = require('fs-extra')
const misc = require('../helper/misc')
const randomguy = require('../helper/randomguy')

module.exports = {

    getAll: async (request, response) => {

            const page = parseInt(request.query.page) || 1
            const search = request.query.search || ''
            const limit = request.query.limit || 1
            const sort = request.query.sort || 'DESC'
            const sortBy = request.query.sortBy || 'createdAt'
            const offset = (page - 1) * limit
        try {
            const total = await Categories.getCategoriesCount()
            const prevPage = page === 1 ? 1 : page - 1
            const nextPage = page === total[0].total ? total[0].total : page + 1
            const data = await Categories.getAll(offset, limit, sort, sortBy, search)

            if (data.length == 0) {
                return misc.response(response, 400, false, 'Data not found')
            }

            data.forEach(element => {
                if (element.image == null) {
                    element.imagelink = null
                } else {
                    element.imagelink = request.get('host')+ '/images/categories/' + element.image
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

    getSingleCategories: async (request, response) => {

        const categories_id = request.params.categories_id

        try {
            const data = await Categories.getSingleCategories(categories_id)
            if (!data) {
                return misc.response(response, 400, false, 'Data not found')
            }
            if (data.image == null) {
                data.imagelink = null
            } else {
                data.imagelink = request.get('host')+ '/images/categories/' + data.image
            }
            
            misc.response(response, 200, false, 'Successfull get single Categories', data, request.originalUrl)

        } catch(error) {
            console.error(error)
            misc.response(response, 500, true, 'Server error')
        }

    },

    addCategories: async (request, response) => {

        let error = false
        let fileName = '-'
        let fileNameBackground = '-'

        if(request) {
            if(request.files.image[0]) {
                const file = request.files.image[0].originalname
                const fileSplit = file.split('.')
                const fileExtension = fileSplit[fileSplit.length - 1]
                fileName = request.files.image[0].originalname

                if(request.files.size >= 5242880) {
                    const message = 'Oops!, Size cannot more than 5MB'
                     response.json(message)
                     error = true
                    fs.unlink(`public/images/categories/${request.files.image[0].originalname}`, function(error) {
                        if (error) response.json(error)
                    })
                }

                if(!isImage(fileExtension)) {
                    const message = 'Oops!, File allowed only JPG, JPEG, PNG, GIF, SVG'
                    response.json(message)
                    error = true
                    fs.unlink(`public/images/categories/${request.files.image[0].originalname}`, function(error) {
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

            if(request.files.background[0]) {
                const file = request.files.background[0].originalname
                const fileSplit = file.split('.')
                const fileExtension = fileSplit[fileSplit.length - 1]
                fileNameBackground = request.files.background[0].originalname

                if(request.files.size >= 5242880) {
                    const message = 'Oops!, Size cannot more than 5MB'
                     response.json(message)
                     error = true
                    fs.unlink(`public/images/categories/${request.files.background[0].originalname}`, function(error) {
                        if (error) response.json(error)
                    })
                }

                if(!isImage(fileExtension)) {
                    const message = 'Oops!, File allowed only JPG, JPEG, PNG, GIF, SVG'
                    response.json(message)
                    error = true
                    fs.unlink(`public/images/categories/${request.files.background[0].originalname}`, function(error) {
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

        const title = request.body.title
        const subtitle = request.body.subtitle
        const description = request.body.description
        const image = fileName
        const background = fileNameBackground
        const timestamp = request.timestamp

        try {
            if(error === false) {
                const response_addCategories = await Categories.addCategories(title, subtitle, description, image, background, timestamp)
                const data = {
                    title,
                    subtitle,
                    description,
                    image,
                    background
                }
                misc.response(response, 200, false, 'Successfull create Categories', data)
            }
        } catch(error) {
            console.error(error)
            misc.response(response, 500, true, 'Server Error')
        }

    },
    updateCategories: async (request, response) => {

        let error = false
        let fileName = '-'
        let fileNameBackground = '-'

        if(request) {
            if(request.files.image[0]) {
                const file = request.files.image[0].originalname
                const fileSplit = file.split('.')
                const fileExtension = fileSplit[fileSplit.length - 1]
                fileName = request.files.image[0].originalname

                if(request.files.size >= 5242880) {
                    const message = 'Oops!, Size cannot more than 5MB'
                     response.json(message)
                     error = true
                    fs.unlink(`public/images/categories/${request.files.image[0].originalname}`, function(error) {
                        if (error) response.json(error)
                    })
                }

                if(!isImage(fileExtension)) {
                    const message = 'Oops!, File allowed only JPG, JPEG, PNG, GIF, SVG'
                    response.json(message)
                    error = true
                    fs.unlink(`public/images/categories/${request.files.image[0].originalname}`, function(error) {
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

            if(request.files.background[0]) {
                const file = request.files.background[0].originalname
                const fileSplit = file.split('.')
                const fileExtension = fileSplit[fileSplit.length - 1]
                fileNameBackground = request.files.background[0].originalname

                if(request.files.size >= 5242880) {
                    const message = 'Oops!, Size cannot more than 5MB'
                     response.json(message)
                     error = true
                    fs.unlink(`public/images/categories/${request.files.background[0].originalname}`, function(error) {
                        if (error) response.json(error)
                    })
                }

                if(!isImage(fileExtension)) {
                    const message = 'Oops!, File allowed only JPG, JPEG, PNG, GIF, SVG'
                    response.json(message)
                    error = true
                    fs.unlink(`public/images/categories/${request.files.background[0].originalname}`, function(error) {
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
        const subtitle = request.body.subtitle
        const description = request.body.description
        const image = fileName
        const background = fileNameBackground
        const timestamp = request.timestamp

        try {
            if(error === false) {
                await Categories.updateCategories(categories_id, title, subtitle, description, image, background, timestamp)

                const data = {
                    title,
                    subtitle,
                    description,
                    image,
                    background
                }
                misc.response(response, 200, false, 'Successfull update categories', data)
            }
        } catch(error) {
            console.error(error)
            misc.response(response, 500, true, 'Server Error')
        }

    },
    deleteCategories: async (request, response) => {

        const categories_id = request.params.categories_id
        const checkCategories = await Categories.checkCategories(categories_id)
        
        if (checkCategories[0].jumlah > 0) {
            return misc.response(response, 406, false, "can't be deleted because there are articles using this category")
        }

        try {
            await Categories.deleteCategories(categories_id)
            misc.response(response, 200, false, 'Successfull delete Categories')
        } catch(error) {
            console.error(error)
            misc.response(response, 500, true, 'Server error')
        }

    },
}
