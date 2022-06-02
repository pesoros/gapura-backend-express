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
                data.imagelink = request.protocol +'://'+ request.get('host')+ process.env.BASE_PORT + '/images/home/' + data.image
            }
            
            let arrpush = []
            let articleList = []
            const categoriesList = await Home.getCategories()

            if (position == 'wdg_terbaru') {
                for (let key = 0; key < categoriesList.length; key++) {
                    const element = categoriesList[key];
                    arrpush = await Home.getArticlesTerbaru(element.id)
                    if (arrpush.length !== 0) {
                        articleList.push(arrpush[0])
                    }
                }
            } else if (position == 'wdg_edisi_lama') {
                const d = new Date();
                let month = d.getMonth();
                month = month + 1
                for (let key = 0; key < categoriesList.length; key++) {
                    const element = categoriesList[key];
                    arrpush = await Home.getArticlesLama(element.id,month)
                    if (arrpush.length !== 0) {
                        articleList.push(arrpush[0])
                    }
                }
            }

            data.articleList = articleList

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
        const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');

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
