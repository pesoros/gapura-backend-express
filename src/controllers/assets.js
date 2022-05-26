const Assets = require('../models/Assets')
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
            const category = request.query.categories_id || 1
            const sortBy = request.query.sortBy || 'createdAt'
            const offset = (page - 1) * limit
        try {
            const total = await Assets.getAssetsCount()
            const prevPage = page === 1 ? 1 : page - 1
            const nextPage = page === total[0].total ? total[0].total : page + 1
            const data = await Assets.getAll(offset, limit, sort, sortBy, search, category)

            if (data.length == 0) {
                return misc.response(response, 400, false, 'Data not found')
            }

            data.forEach(element => {
                if (element.image == null) {
                    element.imagelink = null
                } else {
                    element.imagelink = request.get('host')+ '/images/assets/' + element.image
                }
                if (element.file == null) {
                    element.filelink = null
                } else {
                    element.filelink = request.get('host')+ '/images/assets/' + element.file
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

    getSingleAssets: async (request, response) => {

        const assets_id = request.params.assets_id

        try {
            const data = await Assets.getSingleAssets(assets_id)
            if (!data) {
                return misc.response(response, 400, false, 'Data not found')
            }
            if (data.image == null) {
                data.imagelink = null
            } else {
                data.imagelink = request.get('host')+ '/images/assets/' + data.image
            }

            if (data.file == null) {
                data.filelink = null
            } else {
                data.filelink = request.get('host')+ '/images/assets/' + data.file
            }
            
            misc.response(response, 200, false, 'Successfull get single Assets', data, request.originalUrl)

        } catch(error) {
            console.error(error)
            misc.response(response, 500, true, 'Server error')
        }

    },

    addAssets: async (request, response) => {

        let error = false
        let fileName = '-'
        let fileNameDocument = '-'

        if(request.body.image) {
            var binImage = request.body.image;
            const [,fileExtension] = binImage.split(';')[0].split('/');
            fileName = randomguy.randNumb('gapura-assets-'+Date.now())+'.'+fileExtension
            binImage = binImage.split("base64,")[1];

            if (!fileChecker.isImage(fileExtension)) {
                const message = 'Oops!, File allowed only JPG, JPEG, PNG, GIF, SVG'
                response.json(message)
                error = true
                return
            }

            const fileContents = new Buffer(binImage, 'base64')
                fs.writeFile(`public/images/assets/${fileName}`, fileContents, (err) => {
                if (err) return console.error(err)
                console.log('file saved to ', `public/images/assets/${fileName}`)
            })
        }

        if(request.body.document) {
            var binImage = request.body.document;
            const [,fileExtension] = binImage.split(';')[0].split('/');
            fileNameDocument = randomguy.randNumb('gapura-assets-file-'+Date.now())+'.'+fileExtension
            binImage = binImage.split("base64,")[1];

            if (!fileChecker.isDocument(fileExtension)) {
                const message = 'Oops!, File allowed only JPG, JPEG, PNG, GIF, SVG'
                response.json(message)
                error = true
                return
            }

            const fileContents = new Buffer(binImage, 'base64')
                fs.writeFile(`public/images/assets/${fileName}`, fileContents, (err) => {
                if (err) return console.error(err)
                console.log('file saved to ', `public/images/assets/${fileName}`)
            })
        }

        const title = request.body.title
        const image = fileName
        const file = fileNameDocument
        const timestamp = request.timestamp

        try {
            if(error === false) {
                const response_addAssets = await Assets.addAssets(title, image, file, timestamp)
                const data = {
                    title,
                    image,
                    file
                }
                misc.response(response, 200, false, 'Successfull create Assets', data)
            }
        } catch(error) {
            console.error(error)
            misc.response(response, 500, true, 'Server Error')
        }

    },
    updateAssets: async (request, response) => {

        let error = false
        let fileName = '-'
        let fileNameDocument = '-'

        if(request.body.image) {
            var binImage = request.body.image;
            const [,fileExtension] = binImage.split(';')[0].split('/');
            fileName = randomguy.randNumb('gapura-assets-'+Date.now())+'.'+fileExtension
            binImage = binImage.split("base64,")[1];

            if (!fileChecker.isImage(fileExtension)) {
                const message = 'Oops!, File allowed only JPG, JPEG, PNG, GIF, SVG'
                response.json(message)
                error = true
                return
            }

            const fileContents = new Buffer(binImage, 'base64')
                fs.writeFile(`public/images/assets/${fileName}`, fileContents, (err) => {
                if (err) return console.error(err)
                console.log('file saved to ', `public/images/assets/${fileName}`)
            })
        }

        if(request.body.document) {
            var binImage = request.body.document;
            const [,fileExtension] = binImage.split(';')[0].split('/');
            fileNameDocument = randomguy.randNumb('gapura-assets-file-'+Date.now())+'.'+fileExtension
            binImage = binImage.split("base64,")[1];

            if (!fileChecker.isDocument(fileExtension)) {
                const message = 'Oops!, File allowed only JPG, JPEG, PNG, GIF, SVG'
                response.json(message)
                error = true
                return
            }

            const fileContents = new Buffer(binImage, 'base64')
                fs.writeFile(`public/images/assets/${fileName}`, fileContents, (err) => {
                if (err) return console.error(err)
                console.log('file saved to ', `public/images/assets/${fileName}`)
            })
        }

        const assets_id = request.body.assets_id

        const title = request.body.title
        const image = fileName
        const file = fileNameDocument
        const timestamp = request.timestamp

        try {
            if(error === false) {
                await Assets.updateAssets(assets_id, title, image, file, timestamp)

                const data = {
                    title,
                    image,
                    file
                }
                misc.response(response, 200, false, 'Successfull update Assets', data)
            }
        } catch(error) {
            console.error(error)
            misc.response(response, 500, true, 'Server Error')
        }

    },
    deleteAssets: async (request, response) => {

        const assets_id = request.params.assets_id

        try {
            await Assets.deleteAssets(assets_id)
            misc.response(response, 200, false, 'Successfull delete Assets')
        } catch(error) {
            console.error(error)
            misc.response(response, 500, true, 'Server error')
        }

    },
}
