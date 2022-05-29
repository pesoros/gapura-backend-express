const Categories = require('../models/Categories')
const fs = require('fs-extra')
const misc = require('../helper/misc')
const randomguy = require('../helper/randomguy')
const fileChecker = require('../helper/fileChecker')

module.exports = {

    getAll: async (request, response) => {

            const page = parseInt(request.query.page) || 1
            const search = request.query.search || ''
            const limit = request.query.limit || 1000
            const sort = request.query.sort || 'DESC'
            const sortBy = request.query.sortBy || 'createdAt'
            const offset = (page - 1) * limit
        try {
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
                if (element.background == null) {
                    element.backgroundlink = null
                } else {
                    element.backgroundlink = request.get('host')+ '/images/categories/' + element.background
                }
            });

            misc.responsePagination(response, 200, false, 'Successfull get all data', [], data, request.originalUrl)
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
            if (data.background == null) {
                data.backgroundlink = null
            } else {
                data.backgroundlink = request.get('host')+ '/images/categories/' + data.background
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

        if(request.body.image) {
            var binImage = request.body.image;
            const [,fileExtension] = binImage.split(';')[0].split('/');
            fileName = randomguy.randNumb('gapura-categories-'+Date.now())+'.'+fileExtension
            binImage = binImage.split("base64,")[1];

            if (!fileChecker.isImage(fileExtension)) {
                const message = 'Oops!, File allowed only JPG, JPEG, PNG, GIF, SVG'
                response.json(message)
                error = true
                return
            }

            const fileContents = new Buffer(binImage, 'base64')
                fs.writeFile(`public/images/categories/${fileName}`, fileContents, (err) => {
                if (err) return console.error(err)
                console.log('file saved to ', `public/images/categories/${fileName}`)
            })
        }

        if(request.body.background) {
            var binImage = request.body.background;
            const [,fileExtension] = binImage.split(';')[0].split('/');
            fileNameBackground = randomguy.randNumb('gapura-categories-bg-'+Date.now())+'.'+fileExtension
            binImage = binImage.split("base64,")[1];

            if (!fileChecker.isImage(fileExtension)) {
                const message = 'Oops!, File allowed only JPG, JPEG, PNG, GIF, SVG'
                response.json(message)
                error = true
                return
            }

            const fileContents = new Buffer(binImage, 'base64')
                fs.writeFile(`public/images/categories/${fileNameBackground}`, fileContents, (err) => {
                if (err) return console.error(err)
                console.log('file saved to ', `public/images/categories/${fileNameBackground}`)
            })
        }

        const title = request.body.title
        const subtitle = request.body.subtitle
        const description = request.body.description
        const image = fileName
        const background = fileNameBackground
        const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ')

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

        if(request.body.image) {
            var binImage = request.body.image;
            const [,fileExtension] = binImage.split(';')[0].split('/');
            fileName = randomguy.randNumb('gapura-categories-'+Date.now())+'.'+fileExtension
            binImage = binImage.split("base64,")[1];

            if (!fileChecker.isImage(fileExtension)) {
                const message = 'Oops!, File allowed only JPG, JPEG, PNG, GIF, SVG'
                response.json(message)
                error = true
                return
            }

            const fileContents = new Buffer(binImage, 'base64')
                fs.writeFile(`public/images/categories/${fileName}`, fileContents, (err) => {
                if (err) return console.error(err)
                console.log('file saved to ', `public/images/categories/${fileName}`)
            })
        }

        if(request.body.background) {
            var binImage = request.body.background;
            const [,fileExtension] = binImage.split(';')[0].split('/');
            fileNameBackground = randomguy.randNumb('gapura-categories-bg-'+Date.now())+'.'+fileExtension
            binImage = binImage.split("base64,")[1];

            if (!fileChecker.isImage(fileExtension)) {
                const message = 'Oops!, File allowed only JPG, JPEG, PNG, GIF, SVG'
                response.json(message)
                error = true
                return
            }

            const fileContents = new Buffer(binImage, 'base64')
                fs.writeFile(`public/images/categories/${fileNameBackground}`, fileContents, (err) => {
                if (err) return console.error(err)
                console.log('file saved to ', `public/images/categories/${fileNameBackground}`)
            })
        }

        const categories_id = request.body.categories_id
        const title = request.body.title
        const subtitle = request.body.subtitle
        const description = request.body.description
        const image = fileName
        const background = fileNameBackground
        const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ')

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
