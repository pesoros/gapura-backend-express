const Home = require('../models/Home')
const fs = require('fs-extra')
const misc = require('../helper/misc')
const randomguy = require('../helper/randomguy')

module.exports = {

    getAll: async (request, response) => {
        try {
            const data = await Home.getAll()

            if (data.length == 0) {
                return misc.response(response, 400, false, 'Data not found')
            }

            misc.responsePagination(response, 200, false, 'Successfull get all data', [], data, request.originalUrl)
        } catch (error) {
            console.error(error)
            misc.response(response, 500, true, 'Server error')
        }

    },
    getSingle: async (request, response) => {
        const position = request.params.position

        try {
            const data = await Home.getSingle(position)
            if (!data) {
                return misc.response(response, 400, false, 'Data not found')
            }
            if (data.image == null) {
                data.imagelink = null
            } else {
                data.imagelink = request.get('host')+ '/images/home/' + data.image
            }
            
            misc.response(response, 200, false, 'Successfull get single Home', data, request.originalUrl)

        } catch(error) {
            console.error(error)
            misc.response(response, 500, true, 'Server error')
        }

    },
    updateHome: async (request, response) => {

        let error = false
        let fileName = ''

        if(request) {
            if(request.file) {
                const file = request.file.filename
                const fileSplit = file.split('.')
                const fileExtension = fileSplit[fileSplit.length - 1]
                fileName = request.file.filename

                if(request.file.size >= 5242880) {
                    const message = 'Oops!, Size cannot more than 5MB'
                     response.json(message)
                     error = true
                    fs.unlink(`public/images/home/${request.file.filename}`, function(error) {
                        if (error) response.json(error)
                    })
                }

                if(!isImage(fileExtension)) {
                    const message = 'Oops!, File allowed only JPG, JPEG, PNG, GIF, SVG'
                    response.json(message)
                    error = true
                    fs.unlink(`public/images/home/${request.file.filename}`, function(error) {
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

        const position = request.body.position
        const title = request.body.title
        const subtitle = request.body.subtitle
        const image = fileName
        const timestamp = request.timestamp

        try {
            if(error === false) {
                await Home.updateHome(position, title, subtitle, image, timestamp) 

                const data = {
                    position,
                    title,
                    subtitle,
                    image 
                }
                misc.response(response, 200, false, 'Successfull update Home', data)
            }
        } catch(error) {
            console.error(error)
            misc.response(response, 500, true, 'Server Error')
        }
 
    },
}
