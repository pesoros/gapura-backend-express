const Home = require('../models/Home')
const fs = require('fs-extra')
const misc = require('../helper/misc')
const randomguy = require('../helper/randomguy')
const fileChecker = require('../helper/fileChecker')

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
        let fileName = '-'

        if(request.body.image) {
            var binImage = request.body.image;
            const [,fileExtension] = binImage.split(';')[0].split('/');
            fileName = randomguy.randNumb('gapura-home-'+Date.now())+'.'+fileExtension
            binImage = binImage.split("base64,")[1];

            if (!fileChecker.isImage(fileExtension)) {
                const message = 'Oops!, File allowed only JPG, JPEG, PNG, GIF, SVG'
                response.json(message)
                error = true
                return
            }

            const fileContents = new Buffer(binImage, 'base64')
                fs.writeFile(`public/images/home/${fileName}`, fileContents, (err) => {
                if (err) return console.error(err)
                console.log('file saved to ', `public/images/home/${fileName}`)
            })
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
