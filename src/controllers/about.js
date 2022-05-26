const About = require('../models/About')
const fs = require('fs-extra')
const misc = require('../helper/misc')
const randomguy = require('../helper/randomguy')
const fileChecker = require('../helper/fileChecker')

module.exports = {

    getAll: async (request, response) => {

            const page = parseInt(request.query.page) || 1
            const search = request.query.search || ''
            const limit = request.query.limit || 10
            const sort = request.query.sort || 'DESC'
            const sortBy = request.query.sortBy || 'createdAt'
            const offset = (page - 1) * limit
        try {
            const total = await About.getAboutCount()
            const prevPage = page === 1 ? 1 : page - 1
            const nextPage = page === total[0].total ? total[0].total : page + 1
            const data = await About.getAll(offset, limit, sort, sortBy, search)

            if (data.length == 0) {
                return misc.response(response, 400, false, 'Data not found')
            }

            data.forEach(element => {
                if (element.image == null) {
                    element.imagelink = null
                } else {
                    element.imagelink = request.get('host')+ '/images/about/' + element.image
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

    getSingleAbout: async (request, response) => {

        const about_id = request.params.about_id

        try {
            const data = await About.getSingleAbout(about_id)
            if (!data) {
                return misc.response(response, 400, false, 'Data not found')
            }
            if (data.image == null) {
                data.imagelink = null
            } else {
                data.imagelink = request.get('host')+ '/images/about/' + data.image
            }
            
            misc.response(response, 200, false, 'Successfull get single about', data, request.originalUrl)

        } catch(error) {
            console.error(error)
            misc.response(response, 500, true, 'Server error')
        }

    },
    updateAbout: async (request, response) => {

        let error = false
        let fileName = '-'

        if(request.body.image) {
            var binImage = request.body.image;
            const [,fileExtension] = binImage.split(';')[0].split('/');
            fileName = randomguy.randNumb('gapura-about-'+Date.now())+'.'+fileExtension
            binImage = binImage.split("base64,")[1];

            if (!fileChecker.isImage(fileExtension)) {
                const message = 'Oops!, File allowed only JPG, JPEG, PNG, GIF, SVG'
                response.json(message)
                error = true
                return
            }

            const fileContents = new Buffer(binImage, 'base64')
                fs.writeFile(`public/images/about/${fileName}`, fileContents, (err) => {
                if (err) return console.error(err)
                console.log('file saved to ', `public/images/about/${fileName}`)
            })
        }

        const about_id = request.body.about_id
        const title = request.body.title
        const description = request.body.description
        const image = fileName
        const timestamp = request.timestamp

        try {
            if(error === false) {
                await About.updateAbout(about_id, title, description, image, timestamp)

                const data = {
                    title,
                    description,
                    image
                }
                misc.response(response, 200, false, 'Successfull update about', data)
            }
        } catch(error) {
            console.error(error)
            misc.response(response, 500, true, 'Server Error')
        }

    },
}
